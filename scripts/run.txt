import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// -------- CONFIG --------
const MODEL_NAME = "gemini-2.5-flash";
const INPUT_PATH = "examples/input-01.json";
const MASTER_PROMPT_PATH = "prompt/MASTER_PROMPT.md";
const OUTPUT_MD_PATH = "examples/output-latest.md";
const OUTPUT_JSON_PATH = "examples/output-latest.json";

// -------- SAFETY CHECKS --------
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env");
}

// -------- LOAD FILES --------
const input = fs.readFileSync(INPUT_PATH, "utf-8");
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

// -------- RUN --------
(async () => {
  console.log("🚀 Generating dungeon with Gemini 2.5 Flash...");

  const result = await model.generateContent(finalPrompt);
  const text = result.response.text();

  // -------- WRITE MARKDOWN --------
  fs.writeFileSync(OUTPUT_MD_PATH, text, "utf-8");

  // -------- EXTRACT JSON (BEST EFFORT) --------
  const jsonMatch = text.match(/```json([\s\S]*?)```/);

  if (jsonMatch) {
    fs.writeFileSync(
      OUTPUT_JSON_PATH,
      jsonMatch[1].trim(),
      "utf-8"
    );
    console.log("✅ JSON extracted");
  } else {
    console.warn("⚠️ No JSON block found in output");
  }

  console.log("✅ Dungeon generated:");
  console.log(`- ${OUTPUT_MD_PATH}`);
  console.log(`- ${OUTPUT_JSON_PATH}`);
})();
