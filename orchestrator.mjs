import { planningAgent, getExistingPlan } from "./agents/planningAgent.mjs";
import { codingAgent } from "./agents/codingAgent.mjs";
import { renderingAgent } from "./agents/renderingAgent.mjs";

/**
 * @param {string} prompt - User's editing prompt
 * @param {string} sessionId - Session identifier
 */
export async function orchestrate(prompt, sessionId) {
  console.log(`[orchestrator] Starting session: ${sessionId}\n`);

  // console.log("[orchestrator] Running planning agent...");
  // const plan = await planningAgent(prompt);

  const plan = getExistingPlan();

  console.log("\n[orchestrator] Running coding agent...");
  await codingAgent(plan);

  console.log("\n[orchestrator] Running rendering agent...");
  await renderingAgent(sessionId);

  console.log("\n[orchestrator] Done.");
}
