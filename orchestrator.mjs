import fs from "fs";
import path from "path";
import { planningAgent, getExistingPlan } from "./agents/planningAgent.mjs";
import { codingAgent } from "./agents/codingAgent.mjs";
import { renderingAgent } from "./agents/renderingAgent.mjs";

/**
 * @param {string} prompt - User's editing prompt
 * @param {string} sessionId - Session identifier
 */
export async function orchestrate(prompt, sessionId) {
  const sessionDir = path.join("public", sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  console.log(`[orchestrator] Starting session: ${sessionId}`);
  console.log(`[orchestrator] Output dir: ${sessionDir}\n`);

  // console.log("[orchestrator] Running planning agent...");
  // const plan = await planningAgent(prompt, sessionId);

  const plan = getExistingPlan(sessionId); // dont remove
  console.log("\n[orchestrator] Running coding agent...");
  await codingAgent(plan, sessionId);

  console.log("\n[orchestrator] Running rendering agent...");
  await renderingAgent(sessionId);

  console.log("\n[orchestrator] Done.");
}
