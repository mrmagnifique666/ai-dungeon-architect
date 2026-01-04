import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

/**
 * AI Dungeon Architect Runner (ESM)
 * - Step 1: Generate MODULE markdown (model)
 * - Step 2: Generate MAP JSON strict (model + repair loop)
 * - Step 3: Render ASCII locally (always visible: '.' background)
 * - Step 4: Build image prompt locally + render SVG locally (automatic image artifact)
 *
 * Usage:
 *   node ./scripts/run.js ./examples/input-03.json --rooms=6-12 --seed=test-001 --bounds=80x60
 */

const DEFAULT_MODEL = "gemini-2.5-flash";
const MASTER_PROMPT_PATH = "prompt/MASTER_PROMPT.md";
const OUTPUT_ROOT = path.join("examples", "outputs");

// ---------------- CLI PARSE ----------------
function parseArgs(argv) {
  const args = {
    inputPath: null,
    model: DEFAULT_MODEL,
    roomsMin: 6,
    roomsMax: 12,
    seed: null,
    boundsW: 80,
    boundsH: 60,
    maxRepair: 3
  };

  const positional = [];
  for (const a of argv.slice(2)) {
    if (!a.startsWith("--")) positional.push(a);
    else {
      const [k, vRaw] = a.split("=", 2);
      const v = vRaw ?? "";
      if (k === "--model") args.model = v || DEFAULT_MODEL;
      if (k === "--seed") args.seed = v || null;
      if (k === "--rooms") {
        const m = v.match(/^(\d+)\-(\d+)$/);
        if (m) {
          args.roomsMin = Number(m[1]);
          args.roomsMax = Number(m[2]);
        }
      }
      if (k === "--bounds") {
        const m = v.match(/^(\d+)x(\d+)$/i);
        if (m) {
          args.boundsW = Number(m[1]);
          args.boundsH = Number(m[2]);
        }
      }
      if (k === "--maxRepair") {
        const n = Number(v);
        if (Number.isFinite(n) && n >= 0) args.maxRepair = n;
      }
    }
  }

  args.inputPath = positional[0] ?? "examples/input-01.json";
  if (!args.seed) args.seed = crypto.randomBytes(6).toString("hex"); // short random seed
  return args;
}

const cli = parseArgs(process.argv);

// ---------------- SAFETY CHECKS ----------------
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env");
}
if (!fs.existsSync(cli.inputPath)) {
  throw new Error(`❌ Input file not found: ${cli.inputPath}`);
}
if (!fs.existsSync(MASTER_PROMPT_PATH)) {
  throw new Error(`❌ Master prompt not found: ${MASTER_PROMPT_PATH}`);
}

// ---------------- IO HELPERS ----------------
function safeMkdir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
function safeWrite(filePath, content) {
  safeMkdir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}
function nowOutputDir() {
  // Windows-safe ISO
  const iso = new Date().toISOString().replace(/[:]/g, "-");
  return path.join(OUTPUT_ROOT, iso);
}

// ---------------- MODEL CLIENT ----------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: cli.model,
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 8192
  }
});

async function callGemini(prompt) {
  const res = await model.generateContent(prompt);
  return res.response.text();
}

// ---------------- JSON EXTRACT ----------------
function tryParseJson(s) {
  try { return JSON.parse(s); } catch { return null; }
}

function extractJsonCandidates(text) {
  const candidates = [];

  // fenced blocks
  const fenceRegex = /```(?:json|JSON)?\s*([\s\S]*?)```/g;
  let m;
  while ((m = fenceRegex.exec(text)) !== null) {
    const block = m[1].trim();
    if (block.startsWith("{") && block.endsWith("}")) candidates.push(block);
  }

  // best-effort braces
  const braceRegex = /\{[\s\S]*\}/g;
  const braceMatches = text.match(braceRegex) ?? [];
  for (const b of braceMatches) {
    const t = b.trim();
    if (t.startsWith("{") && t.endsWith("}")) candidates.push(t);
  }

  return [...new Set(candidates)];
}

function pickBestJson(text) {
  const candidates = extractJsonCandidates(text);
  let lastParseable = null;
  for (const c of candidates) {
    const obj = tryParseJson(c);
    if (!obj) continue;
    lastParseable = { obj, raw: c };
  }
  return lastParseable;
}

// ---------------- STRICT CONTRACT ----------------
function validateStrictMap(obj, boundsW, boundsH, roomsMin, roomsMax) {
  const errors = [];
  if (!obj || typeof obj !== "object") return { ok: false, errors: ["not_an_object"] };

  const topKeys = Object.keys(obj).sort().join(",");
  const requiredTop = ["map", "map_generation_rules_applied", "rooms", "top_down_map_prompt"];
  for (const k of requiredTop) if (!(k in obj)) errors.push(`missing_top_${k}`);

  if (!Array.isArray(obj.rooms)) errors.push("rooms_not_array");
  if (!obj.map || typeof obj.map !== "object") errors.push("map_not_object");
  if (!Array.isArray(obj?.map?.rooms)) errors.push("map_rooms_not_array");
  if (typeof obj.top_down_map_prompt !== "string" || !obj.top_down_map_prompt.trim()) errors.push("top_down_map_prompt_empty");
  if (!Array.isArray(obj.map_generation_rules_applied) || obj.map_generation_rules_applied.length === 0) errors.push("map_generation_rules_applied_empty");

  if (errors.length) return { ok: false, errors, meta: { topKeys } };

  if (obj.rooms.length < roomsMin || obj.rooms.length > roomsMax) {
    errors.push(`rooms_count_out_of_range_${obj.rooms.length}`);
  }
  if (obj.map.rooms.length !== obj.rooms.length) {
    errors.push(`map_rooms_count_mismatch_${obj.map.rooms.length}_vs_${obj.rooms.length}`);
  }

  // Unique room_ids
  const roomIds = obj.rooms.map(r => r?.room_id).filter(Boolean);
  const uniq = new Set(roomIds);
  if (uniq.size !== roomIds.length) errors.push("duplicate_room_ids");

  // map rooms must match
  const mapIds = obj.map.rooms.map(r => r?.room_id).filter(Boolean);
  const mapSet = new Set(mapIds);
  for (const id of roomIds) if (!mapSet.has(id)) errors.push(`missing_in_map_${id}`);
  for (const id of mapIds) if (!uniq.has(id)) errors.push(`missing_in_rooms_${id}`);

  // Bounds + geometry checks + doors on perimeter
  for (const mr of obj.map.rooms) {
    const id = mr?.room_id ?? "UNKNOWN";
    const x = mr?.x, y = mr?.y, w = mr?.width, h = mr?.height;
    if (![x,y,w,h].every(Number.isInteger)) {
      errors.push(`room_geometry_not_int_${id}`);
      continue;
    }
    if (w <= 1 || h <= 1) errors.push(`room_too_small_${id}`);
    if (x < 0 || y < 0 || x + w > boundsW || y + h > boundsH) errors.push(`room_out_of_bounds_${id}`);

    const doors = Array.isArray(mr.doors) ? mr.doors : null;
    if (!doors) { errors.push(`doors_not_array_${id}`); continue; }

    for (const d of doors) {
      const to = d?.to_room_id;
      const side = d?.side;
      const pos = d?.position;
      if (typeof to !== "string" || !to) errors.push(`door_missing_to_${id}`);
      if (!["N","S","E","W"].includes(side)) errors.push(`door_bad_side_${id}`);
      if (!Number.isInteger(pos)) errors.push(`door_bad_position_${id}`);

      // perimeter rule: position must be within the span of that side
      // N/S => 0..(w-1), E/W => 0..(h-1)
      if (Number.isInteger(pos)) {
        if ((side === "N" || side === "S") && (pos < 0 || pos > (w - 1))) errors.push(`door_pos_out_of_span_${id}`);
        if ((side === "E" || side === "W") && (pos < 0 || pos > (h - 1))) errors.push(`door_pos_out_of_span_${id}`);
      }
    }
  }

  // exits consistency (soft but useful)
  const roomById = new Map(obj.rooms.map(r => [r.room_id, r]));
  for (const r of obj.rooms) {
    if (!Array.isArray(r.exits)) errors.push(`exits_not_array_${r.room_id}`);
    else {
      for (const ex of r.exits) {
        if (!roomById.has(ex)) errors.push(`exit_unknown_${r.room_id}_to_${ex}`);
      }
    }
  }

  return { ok: errors.length === 0, errors, meta: { topKeys } };
}

// ---------------- LOCAL ASCII RENDER ----------------
function renderAscii(mapObj, boundsW, boundsH) {
  // Visible background (.)
  const grid = Array.from({ length: boundsH }, () => Array.from({ length: boundsW }, () => "."));

  function drawRect(x, y, w, h) {
    for (let i = x; i < x + w; i++) {
      if (grid[y] && grid[y][i] !== undefined) grid[y][i] = "#";
      if (grid[y + h - 1] && grid[y + h - 1][i] !== undefined) grid[y + h - 1][i] = "#";
    }
    for (let j = y; j < y + h; j++) {
      if (grid[j] && grid[j][x] !== undefined) grid[j][x] = "#";
      if (grid[j] && grid[j][x + w - 1] !== undefined) grid[j][x + w - 1] = "#";
    }
    // fill interior
    for (let j = y + 1; j < y + h - 1; j++) {
      for (let i = x + 1; i < x + w - 1; i++) {
        if (grid[j] && grid[j][i] !== undefined) grid[j][i] = " ";
      }
    }
  }

  function placeText(cx, cy, text) {
    const startX = Math.max(0, cx - Math.floor(text.length / 2));
    for (let i = 0; i < text.length; i++) {
      const x = startX + i;
      if (grid[cy] && grid[cy][x] !== undefined) grid[cy][x] = text[i];
    }
  }

  function carveDoor(x, y) {
    if (grid[y] && grid[y][x] !== undefined) grid[y][x] = "+";
  }

  const rooms = mapObj?.map?.rooms ?? [];
  for (const r of rooms) {
    const { room_id, x, y, width, height, doors } = r;
    drawRect(x, y, width, height);

    // label
    const cx = x + Math.floor(width / 2);
    const cy = y + Math.floor(height / 2);
    placeText(cx, cy, String(room_id));

    // doors
    if (Array.isArray(doors)) {
      for (const d of doors) {
        const side = d.side;
        const pos = d.position;
        if (!Number.isInteger(pos)) continue;
        if (side === "N") carveDoor(x + pos, y);
        if (side === "S") carveDoor(x + pos, y + height - 1);
        if (side === "W") carveDoor(x, y + pos);
        if (side === "E") carveDoor(x + width - 1, y + pos);
      }
    }
  }

  // crop empty margins based on non-dot/non-space chars
  let minX = boundsW, minY = boundsH, maxX = -1, maxY = -1;
  for (let y = 0; y < boundsH; y++) {
    for (let x = 0; x < boundsW; x++) {
      const c = grid[y][x];
      if (c !== "." && c !== " ") {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX === -1) {
    // nothing drawn
    return "(empty map)";
  }

  const pad = 2;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(boundsW - 1, maxX + pad);
  maxY = Math.min(boundsH - 1, maxY + pad);

  const lines = [];
  for (let y = minY; y <= maxY; y++) {
    lines.push(grid[y].slice(minX, maxX + 1).join(""));
  }
  return lines.join("\n");
}

// ---------------- LOCAL SVG RENDER (AUTO IMAGE ARTIFACT) ----------------
function renderSvg(mapObj, boundsW, boundsH) {
  const cell = 10; // px per grid unit
  const W = boundsW * cell;
  const H = boundsH * cell;

  const rooms = mapObj?.map?.rooms ?? [];
  const rects = rooms.map(r => {
    const x = r.x * cell, y = r.y * cell, w = r.width * cell, h = r.height * cell;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white" stroke="black" stroke-width="2" />`;
  }).join("\n");

  const labels = rooms.map(r => {
    const x = (r.x + Math.floor(r.width / 2)) * cell;
    const y = (r.y + Math.floor(r.height / 2)) * cell;
    return `<text x="${x}" y="${y}" font-family="monospace" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="black">${r.room_id}</text>`;
  }).join("\n");

  const doors = rooms.flatMap(r => {
    if (!Array.isArray(r.doors)) return [];
    return r.doors.map(d => {
      const side = d.side, pos = d.position;
      let dx = r.x, dy = r.y;
      if (side === "N") { dx = r.x + pos; dy = r.y; }
      if (side === "S") { dx = r.x + pos; dy = r.y + r.height - 1; }
      if (side === "W") { dx = r.x; dy = r.y + pos; }
      if (side === "E") { dx = r.x + r.width - 1; dy = r.y + pos; }
      const x = dx * cell, y = dy * cell;
      return `<rect x="${x-3}" y="${y-3}" width="6" height="6" fill="black" />`;
    });
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="0" y="0" width="${W}" height="${H}" fill="#f7f7f7"/>
  ${rects}
  ${doors}
  ${labels}
</svg>`;
}

// ---------------- PROMPTS ----------------
function buildModulePrompt(masterPrompt, inputJsonText, seed, roomsMin, roomsMax) {
  return `
${masterPrompt}

--- RUN CONTROLS ---
seed: ${seed}
rooms_range: ${roomsMin}-${roomsMax}

--- USER INPUT (JSON) ---
${inputJsonText}
`.trim();
}

function buildStrictMapPrompt(moduleMd, seed, roomsMin, roomsMax, boundsW, boundsH) {
  return `
You MUST return ONLY valid JSON. No markdown. No commentary.

Return exactly ONE JSON object with EXACTLY these top-level keys:
- "rooms"
- "map"
- "map_generation_rules_applied"
- "top_down_map_prompt"

HARD CONSTRAINTS:
- Seed: ${seed}
- Room count: must be between ${roomsMin} and ${roomsMax}
- Bounds: x in [0, ${boundsW-1}], y in [0, ${boundsH-1}], and each room must fit within width=${boundsW}, height=${boundsH}
- No overlaps between rooms.
- Doors MUST be on the room perimeter.
- Door "position" is an integer offset along the side:
  - side N/S => 0..(width-1)
  - side E/W => 0..(height-1)
- Each room.exits must reference valid room_ids.
- map.rooms must include one entry per rooms.room_id

Schema requirements:
"rooms": array of room objects. Each room MUST include:
- "room_id" (string)
- "name" (string)
- "purpose" (string)
- "features" (array of strings, can be empty)
- "exits" (array of strings referencing connected room_ids, can be empty)

"map": object with:
- "grid_type" (string)
- "units" (string)
- "rooms" (array)
Each map.rooms entry MUST include:
- "room_id" (string matching rooms.room_id)
- "x" (integer)
- "y" (integer)
- "width" (integer)
- "height" (integer)
- "doors" (array of door objects, can be empty)
Each door object MUST include:
- "to_room_id" (string)
- "side" (one of: "N","S","E","W")
- "position" (integer)

"map_generation_rules_applied": array of strings (non-empty)
"top_down_map_prompt": string (non-empty)

SOURCE OF TRUTH (module):
${moduleMd}
`.trim();
}

function buildRepairPrompt(previousJsonText, failureReasons, seed, roomsMin, roomsMax, boundsW, boundsH) {
  return `
You MUST return ONLY valid JSON. No markdown. No commentary.

Fix the JSON to satisfy ALL strict constraints.
Do NOT remove keys. Do NOT add extra top-level keys.

Strict constraints reminder:
- Seed: ${seed}
- Room count: ${roomsMin}-${roomsMax}
- Bounds: width=${boundsW}, height=${boundsH}
- No overlaps, rooms in-bounds, doors on perimeter, door position within span, exits valid.

Failures to fix (must all be resolved):
${failureReasons.map(e => `- ${e}`).join("\n")}

Previous JSON:
${previousJsonText}
`.trim();
}

// ---------------- RUN ----------------
(async () => {
  const outDir = nowOutputDir();
  safeMkdir(outDir);

  const inputText = fs.readFileSync(cli.inputPath, "utf-8");
  const masterPrompt = fs.readFileSync(MASTER_PROMPT_PATH, "utf-8");

  console.log("🚀 AI Dungeon Architect Runner");
  console.log(`🧠 Model: ${cli.model}`);
  console.log(`📥 Input: ${cli.inputPath}`);
  console.log(`📦 Output dir: ${outDir}`);
  console.log(`🔁 Seed: ${cli.seed}   | rooms: ${cli.roomsMin}-${cli.roomsMax}   | bounds: ${cli.boundsW}x${cli.boundsH}`);

  // Step 1 — MODULE
  console.log("🧾 Step 1/4 — Generating MODULE (Markdown)...");
  const modulePrompt = buildModulePrompt(masterPrompt, inputText, cli.seed, cli.roomsMin, cli.roomsMax);
  const moduleMd = await callGemini(modulePrompt);
  safeWrite(path.join(outDir, "module.md"), moduleMd);

  // Step 2 — STRICT MAP JSON (+ repair loop)
  console.log("🗺️ Step 2/4 — Generating MAP JSON (strict)...");
  let rawAll = "";
  let best = null;
  let bestText = "";
  let strictReport = null;

  let mapPrompt = buildStrictMapPrompt(moduleMd, cli.seed, cli.roomsMin, cli.roomsMax, cli.boundsW, cli.boundsH);
  let text = await callGemini(mapPrompt);
  rawAll += `===== MAP GEN (initial) =====\n${text}\n\n`;

  let picked = pickBestJson(text);
  if (picked) {
    strictReport = validateStrictMap(picked.obj, cli.boundsW, cli.boundsH, cli.roomsMin, cli.roomsMax);
    best = picked.obj;
    bestText = picked.raw;
  }

  let attempt = 0;
  while ((!strictReport || !strictReport.ok) && attempt < cli.maxRepair) {
    attempt++;
    const reasons = strictReport?.errors ?? ["no_parseable_json"];
    console.log(`🛠️ MAP JSON not strict (${reasons[0]}). Repair pass #${attempt}...`);

    const repairPrompt = buildRepairPrompt(bestText || text, reasons, cli.seed, cli.roomsMin, cli.roomsMax, cli.boundsW, cli.boundsH);
    const t2 = await callGemini(repairPrompt);
    rawAll += `===== MAP REPAIR #${attempt} =====\n${t2}\n\n`;

    const picked2 = pickBestJson(t2);
    if (picked2) {
      const rep2 = validateStrictMap(picked2.obj, cli.boundsW, cli.boundsH, cli.roomsMin, cli.roomsMax);
      // keep latest parseable always; keep strict-ok when achieved
      best = picked2.obj;
      bestText = picked2.raw;
      strictReport = rep2;
    }
  }

  // Always write raw evidence
  safeWrite(path.join(outDir, "raw.txt"), rawAll);

  // Always write map.json (even if not strict)
  if (!best) {
    best = { rooms: [], map: { grid_type: "standard", units: "5ft", rooms: [] }, map_generation_rules_applied: [], top_down_map_prompt: "" };
    bestText = JSON.stringify(best, null, 2);
    strictReport = { ok: false, errors: ["no_parseable_json_after_repairs"] };
  }

  safeWrite(path.join(outDir, "map.json"), JSON.stringify(best, null, 2));

  if (!strictReport?.ok) {
    const reportTxt = [
      "MAP STRICT FAILURE REPORT",
      "========================",
      `strictOk: ${String(strictReport?.ok ?? false)}`,
      `errors: ${(strictReport?.errors ?? []).join(", ")}`,
      "",
      "Tip: even when strict fails, outputs are still produced (ASCII + SVG + prompt)."
    ].join("\n");
    safeWrite(path.join(outDir, "FAILURE_REPORT.txt"), reportTxt);
    console.log("⚠️ MAP JSON strict contract FAILED (fallback outputs still produced).");
    console.log(`🧾 Failure report: ${path.join(outDir, "FAILURE_REPORT.txt")}`);
  } else {
    console.log("✅ MAP JSON strict contract OK");
  }

  // Step 3 — ASCII local
  console.log("🧱 Step 3/4 — Rendering ASCII MAP (local)...");
  const ascii = renderAscii(best, cli.boundsW, cli.boundsH);
  safeWrite(path.join(outDir, "map-ascii.txt"), ascii);

  // Step 4 — Image prompt + SVG local
  console.log("🖼️ Step 4/4 — Building image prompt + SVG (local)...");
  const topDownPrompt =
    (typeof best.top_down_map_prompt === "string" && best.top_down_map_prompt.trim())
      ? best.top_down_map_prompt.trim()
      : [
          "Top-down fantasy dungeon map, clean black ink lines, parchment background, rooms and corridors, labels for each room (R1..), doors clearly marked, high contrast, printable, no characters, no perspective, no isometric."
        ].join(" ");

  safeWrite(path.join(outDir, "map-image-prompt.txt"), topDownPrompt);

  const svg = renderSvg(best, cli.boundsW, cli.boundsH);
  safeWrite(path.join(outDir, "map.svg"), svg);

  console.log("✅ Outputs:");
  console.log(`- ${path.join(outDir, "module.md")}`);
  console.log(`- ${path.join(outDir, "map.json")}`);
  console.log(`- ${path.join(outDir, "map-ascii.txt")}`);
  console.log(`- ${path.join(outDir, "map.svg")}`);
  console.log(`- ${path.join(outDir, "map-image-prompt.txt")}`);
  console.log(`- ${path.join(outDir, "raw.txt")}`);
})();
