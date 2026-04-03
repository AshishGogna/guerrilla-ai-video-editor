import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { chat } from "../tools/ai.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs.readFileSync(path.join(__dirname, "systemPromptCodingAgent.txt"), "utf-8").trim();

/**
 * Coding agent: generates a self-contained Remotion file from an editing plan.
 * Writes to src/{sessionId}_remotion.tsx
 *
 * @param {string} editingPlan - The editing plan from the planning agent
 * @param {string} sessionId - Session identifier
 */
export async function codingAgent(editingPlan, sessionId) {
  const prompt = `${systemPrompt}\n\nEditing plan (execute exactly as specified):\n${editingPlan}`;
  const response = await chat(prompt, "gpt-5.4", sessionId);

  let parsed;
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    console.error("[codingAgent] Failed to parse AI response:\n", response);
    throw new Error("AI did not return valid JSON");
  }

  const { commands = [], code } = parsed;

  if (commands.length > 0) {
    for (const cmd of commands) {
      console.log(`[codingAgent] Running: ${cmd}`);
      try {
        execSync(cmd, { stdio: "inherit", cwd: path.join(__dirname, "..") });
      } catch (e) {
        console.error(`[codingAgent] Command failed: ${cmd}`);
      }
    }
  }

  if (!code) {
    throw new Error("AI response missing 'code' field");
  }

  const outputPath = path.join(__dirname, "..", "src", `${sessionId}_remotion.tsx`);
  fs.writeFileSync(outputPath, code);
  console.log(`[codingAgent] ${sessionId}_remotion.tsx updated`);
}
