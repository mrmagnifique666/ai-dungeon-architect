import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// -------- CONFIG --------
const MODEL_NAME = "gemini-2.5-flash";
const MASTER_PROMPT_PATH = "prompt/MASTER_PROMPT.md";
const OUTPUT_MD_PATH = "examples/output-latest.md";
const OUTPUT_JSON_PATH = "examples/output-latest.json";
const OUTPUT_RAW_PATH = "examples/output-raw.txt";

// -------- SAFETY CHECKS --------
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env");
}

// -------- INPUT PATH (CLI FIRST) --------
const inputPath = process.argv[2] ?? "examples/input-01.json";
if (!fs.existsSync(inputPath)) {
  throw new Error(`❌ Input file not found: ${inputPath}`);
}
if (!fs.existsSync(MASTER_PROMPT_PATH)) {
  throw new Error(`❌ Master prompt not found: ${MASTER_PROMPT_PATH}`);
}

// -------- LOAD FILES --------
const input = fs.readFileSync(inputPath, "utf-8");
const masterPrompt = fs.readFileSync(MASTER_PROMPT_PATH, "utf-8");

// -------- BUILD PROMPT --------
const finalPrompt = `
${masterPrompt}

--- USER INPUT (JSON) ---
${input}
`;

// -------- GEMINI CLIENT --------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 8192
  }
});

// -------- HELPERS --------
function tryParseJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/**
 * STRICT contract:
 * - Top-level keys EXACTLY: rooms, map, map_generation_rules_applied, top_down_map_prompt
 * - rooms: 6-12
 * - map.rooms length matches rooms length
 * - room_ids unique and map references valid
 * - door schema valid
 */
function assertDungeonContractStrict(obj) {
  if (!obj || typeof obj !== "object") return false;

  // 1) Exact top-level keys
  const keys = Object.keys(obj).sort();
  const expected = ["map", "map_generation_rules_applied", "rooms", "top_down_map_prompt"].sort();
  const sameKeys = keys.length === expected.length && keys.every((k, i) => k === expected[i]);
  if (!sameKeys) return false;

  // 2) rooms array 6-12
  if (!Array.isArray(obj.rooms)) return false;
  if (obj.rooms.length < 6 || obj.rooms.length > 12) return false;

  // 3) map + map.rooms
  if (!obj.map || typeof obj.map !== "object") return false;
  if (!Array.isArray(obj.map.rooms)) return false;
  if (obj.map.rooms.length !== obj.rooms.length) return false;

  // 4) map basics
  if (typeof obj.map.grid_type !== "string" || !obj.map.grid_type.trim()) return false;
  if (typeof obj.map.units !== "string" || !obj.map.units.trim()) return false;

  // 5) prompt + rules
  if (typeof obj.top_down_map_prompt !== "string" || !obj.top_down_map_prompt.trim()) return false;
  if (!Array.isArray(obj.map_generation_rules_applied) || obj.map_generation_rules_applied.length === 0) return false;

  // 6) rooms schema + ids
  const roomIds = new Set();
  for (const r of obj.rooms) {
    if (!r || typeof r !== "object") return false;

    if (typeof r.room_id !== "string" || !r.room_id.trim()) return false;
    if (roomIds.has(r.room_id)) return false;
    roomIds.add(r.room_id);

    if (typeof r.name !== "string" || !r.name.trim()) return false;
    if (typeof r.purpose !== "string" || !r.purpose.trim()) return false;

    if (!Array.isArray(r.features)) return false;
    if (!Array.isArray(r.exits)) return false;

    // exits must be strings (can validate references later)
    for (const ex of r.exits) {
      if (typeof ex !== "string") return false;
    }
  }

  // 7) map.rooms schema + doors
  const mapRoomIds = new Set();
  for (const mr of obj.map.rooms) {
    if (!mr || typeof mr !== "object") return false;

    if (typeof mr.room_id !== "string" || !mr.room_id.trim()) return false;
    if (!roomIds.has(mr.room_id)) return false;
    if (mapRoomIds.has(mr.room_id)) return false;
    mapRoomIds.add(mr.room_id);

    for (const k of ["x", "y", "width", "height"]) {
      if (!Number.isInteger(mr[k])) return false;
    }
    if (!Array.isArray(mr.doors)) return false;

    for (const d of mr.doors) {
      if (!d || typeof d !== "object") return false;

      if (typeof d.to_room_id !== "string" || !d.to_room_id.trim()) return false;
      if (!roomIds.has(d.to_room_id)) return false;

      if (!["N", "S", "E", "W"].includes(d.side)) return false;
      if (!Number.isInteger(d.position)) return false;
    }
  }

  // 8) Ensure exits reference existing room_ids
  for (const r of obj.rooms) {
    for (const ex of r.exits) {
      if (typeof ex !== "string") return false;
      if (!roomIds.has(ex)) return false;
      if (ex === r.room_id) return false; // no self-loop
    }
  }

  return true;
}

/**
 * Extraction:
 * - ONLY fenced ```json ... ``` blocks
 * - PLUS: if the entire text is a JSON object (repair output)
 * This avoids grabbing random { ... } blobs from the DM packet.
 */
function extractJsonCandidates(text) {
  const candidates = [];

  // 1) fenced blocks
  const fenceRegex = /```(?:json|JSON)?\s*([\s\S]*?)```/g;
  let m;
  while ((m = fenceRegex.exec(text)) !== null) {
    const block = m[1].trim();
    if (block.startsWith("{") && block.endsWith("}")) candidates.push(block);
  }

  // 2) entire response is JSON
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) candidates.push(trimmed);

  return [...new Set(candidates)];
}

/**
 * pickBestJson:
 * - prefer STRICT contract
 * - else return last parseable candidate (for debugging)
 */
function pickBestJson(text) {
  const candidates = extractJsonCandidates(text);

  let lastParseable = null;
  let lastStrict = null;

  for (const c of candidates) {
    const obj = tryParseJson(c);
    if (!obj) continue;

    lastParseable = { obj, raw: c };

    if (assertDungeonContractStrict(obj)) {
      lastStrict = { obj, raw: c };
      // keep going so "last strict wins" if multiple
    }
  }

  if (lastStrict) return { ...lastStrict, contractOk: true };
  if (lastParseable) return { ...lastParseable, contractOk: false };
  return null;
}

async function callGemini(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

function buildRepairPrompt(previousOutputText) {
  // NOTE: This forces compliance; no empty arrays allowed.
  return `
You MUST return ONLY valid JSON. No markdown. No commentary. No code fences.

Return exactly ONE JSON object with EXACTLY these top-level keys:
- "rooms"
- "map"
- "map_generation_rules_applied"
- "top_down_map_prompt"

HARD REQUIREMENTS:
- rooms MUST have 6 to 12 entries (inclusive).
- map.rooms MUST have the same number of entries as rooms.
- room_id values MUST be unique.
- map.rooms[*].room_id MUST match an existing rooms[*].room_id.
- doors[*].to_room_id MUST match an existing rooms[*].room_id.
- rooms[*].exits MUST reference existing room_id values (no self-reference).

Schema requirements:
"rooms": array of 6-12 room objects. Each room MUST include:
- "room_id" (string)
- "name" (string)
- "purpose" (string)
- "features" (array of strings)
- "exits" (array of strings referencing connected room_ids)

"map": object with:
- "grid_type" (string, non-empty)
- "units" (string, non-empty)
- "rooms" (array)
Each map.rooms entry MUST include:
- "room_id" (string matching rooms.room_id)
- "x" (integer)
- "y" (integer)
- "width" (integer)
- "height" (integer)
- "doors" (array of door objects)
Each door object MUST include:
- "to_room_id" (string)
- "side" (one of: "N","S","E","W")
- "position" (integer)

"map_generation_rules_applied": array of strings (non-empty)
"top_down_map_prompt": string (non-empty)

You MUST comply even if you need to infer missing details.

Previous model output:
${previousOutputText}
`.trim();
}

// -------- RUN --------
(async () => {
  console.log("🚀 Generating dungeon with Gemini 2.5 Flash...");
  console.log(`📥 Input: ${inputPath}`);

  // 1) Primary call
  const text1 = await callGemini(finalPrompt);

  // Save evidence
  fs.writeFileSync(OUTPUT_RAW_PATH, text1, "utf-8");
  fs.writeFileSync(OUTPUT_MD_PATH, text1, "utf-8");

  // Try extract from primary output (usually DM packet => may not include JSON)
  let picked = pickBestJson(text1);

  // 2) Repair pass if strict contract missing
  const needsRepair = !picked || !picked.contractOk;

  if (needsRepair) {
    console.log("🛠️ Strict contract missing. Running repair pass (JSON-only) ...");

    const repairPrompt1 = buildRepairPrompt(text1);
    const text2 = await callGemini(repairPrompt1);

    // Append evidence
    fs.writeFileSync(
      OUTPUT_RAW_PATH,
      text1 + "\n\n===== REPAIR PASS #1 OUTPUT =====\n\n" + text2,
      "utf-8"
    );

    picked = pickBestJson(text2);

    // 3) Second repair pass if still not strict
    if (!picked || !picked.contractOk) {
      console.log("🧰 Repair #1 still not strict. Running repair pass #2 ...");

      const repairPrompt2 = buildRepairPrompt(text2);
      const text3 = await callGemini(repairPrompt2);

      fs.writeFileSync(
        OUTPUT_RAW_PATH,
        text1 + "\n\n===== REPAIR PASS #1 OUTPUT =====\n\n" + text2 + "\n\n===== REPAIR PASS #2 OUTPUT =====\n\n" + text3,
        "utf-8"
      );

      picked = pickBestJson(text3);
    }
  }

  // Fail if still not strict
  if (!picked || !picked.contractOk) {
    console.warn("❌ Could not extract STRICT contract JSON after repair attempts.");
    console.warn(`🧾 Evidence saved: ${OUTPUT_RAW_PATH}`);
    console.log("✅ Dungeon generated (markdown/raw).");
    console.log(`- ${OUTPUT_MD_PATH}`);
    console.log(`- ${OUTPUT_RAW_PATH}`);
    process.exit(1);
  }

  // Write strict JSON
  fs.writeFileSync(OUTPUT_JSON_PATH, picked.raw.trim(), "utf-8");

  console.log("✅ JSON extracted + STRICT contract OK");
  console.log("✅ Outputs:");
  console.log(`- ${OUTPUT_MD_PATH}`);
  console.log(`- ${OUTPUT_JSON_PATH}`);
  console.log(`- ${OUTPUT_RAW_PATH}`);
})();
