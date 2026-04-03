import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chat } from "../tools/ai.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs.readFileSync(
  path.join(__dirname, "..", "systemPrompts", "systemPromptPlanningAgent.txt"),
  "utf-8",
).trim();

/**
 * Planning agent: creates an editing plan from the user prompt and transcripts.
 *
 * @param {string} userPrompt - The user's editing prompt
 * @param {string} sessionId - Session identifier
 * @returns {Promise<string>} The editing plan text
 */
export async function planningAgent(userPrompt, sessionId) {
  const planPath = path.join("public", sessionId, "editingPlan.txt");
  const existingPlan = fs.existsSync(planPath) ? fs.readFileSync(planPath, "utf-8").trim() : "";
  const prompt = existingPlan
    ? `${systemPrompt}\n\nCurrent editing plan:\n${existingPlan}\n\nUser request:\n${userPrompt}`
    : `${systemPrompt}\n\nUser request:\n${userPrompt}`;
  const response = await chat(prompt, "gpt-5.4", sessionId);

  fs.writeFileSync(planPath, response);
  console.log(`[planningAgent] Plan saved: ${planPath}`);

  return response;
}

/**
 * Reads and returns the contents of an existing editing plan.
 *
 * @param {string} sessionId - Session identifier
 * @returns {string} The editing plan text
 */
export function getExistingPlan(sessionId) {
  const planPath = path.join("public", sessionId, "editingPlan.txt");
  if (fs.existsSync(planPath)) {
    return fs.readFileSync(planPath, "utf-8");
  }
  return "";
}

