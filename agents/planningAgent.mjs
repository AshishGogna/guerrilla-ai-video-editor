import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chat } from "../tools/ai.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs.readFileSync(path.join(__dirname, "systemPromptPlanningAgent.txt"), "utf-8").trim();

const PLAN_PATH = path.join(__dirname, "..", "public", "editingPlan.txt");

/**
 * Planning agent: creates an editing plan from the user prompt and transcripts.
 *
 * @param {string} userPrompt - The user's editing prompt
 * @returns {Promise<string>} The editing plan text
 */
export async function planningAgent(userPrompt) {
  const prompt = `${systemPrompt}\n\nUser request:\n${userPrompt}`;
  const response = await chat(prompt, "gpt-5.4");

  fs.mkdirSync(path.dirname(PLAN_PATH), { recursive: true });
  fs.writeFileSync(PLAN_PATH, response);
  console.log(`[planningAgent] Plan saved: ${PLAN_PATH}`);

  return response;
}

/**
 * Reads and returns the contents of the current editing plan file.
 *
 * @returns {string} The editing plan text
 */
export function getExistingPlan() {
  if (fs.existsSync(PLAN_PATH)) {
    return fs.readFileSync(PLAN_PATH, 'utf-8');
  }
  return '';
}

