import { codingAgent } from "./agents/codingAgent.mjs";
import { renderingAgent } from "./agents/renderingAgent.mjs";

/**
 * @param {string} prompt - User's editing prompt
 * @param {string} sessionId - Session identifier
 */
export async function orchestrate(prompt, sessionId) {
  console.log(`[orchestrator] Starting session: ${sessionId}\n`);

  //dont uncomment this for now.
  console.log("[orchestrator] Running coding agent...");
  await codingAgent(prompt);

  console.log("\n[orchestrator] Running rendering agent...");
  await renderingAgent(sessionId);

  console.log("\n[orchestrator] Done.");
}
