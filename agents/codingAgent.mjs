import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { chat } from "../tools/ai.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs.readFileSync(path.join(__dirname, "systemPromptCodingAgent.txt"), "utf-8").trim();

const MAIN_TSX = path.join(__dirname, "..", "src", "Main.tsx");

/**
 * Coding agent: generates Remotion code from an editing plan and writes it to Main.tsx.
 * Also executes any shell commands the AI returns (e.g. npm install).
 *
 * @param {string} editingPlan - The editing plan from the planning agent
 */
export async function codingAgent(editingPlan) {
  const prompt = `${systemPrompt}\n\nEditing plan (execute exactly as specified):\n${editingPlan}`;
  const response = await chat(prompt, "gpt-5.4");

  let parsed;
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    console.error("[codingAgent] Failed to parse AI response:\n", response);
    throw new Error("AI did not return valid JSON");
  }

  const { commands = [], code, config } = parsed;

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

  fs.writeFileSync(MAIN_TSX, code);
  console.log(`[codingAgent] Main.tsx updated`);

  if (config) {
    const configPath = path.join(__dirname, "..", "public", "composition.json");
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`[codingAgent] composition.json updated`);
  }
}
