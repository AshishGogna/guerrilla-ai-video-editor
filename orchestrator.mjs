import fs from "fs";
import path from "path";
import { copyAgent } from "./agents/copyAgent.mjs";
import { planningAgent, getExistingPlan } from "./agents/planningAgent.mjs";
import { fcpxmlAgent } from "./agents/fcpxmlAgent.mjs";
import { codingAgent } from "./agents/codingAgent.mjs";
import { renderingAgent } from "./agents/renderingAgent.mjs";

/**
 * @param {string} prompt - User's editing prompt
 * @param {string} sessionId - Session identifier
 * @param {"video"|"fcpxml"} [output] - Desired output type
 */
export async function orchestrate(prompt, sessionId, output = "video") {
  const sessionDir = path.join("public", sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  console.log(`[orchestrator] Starting session: ${sessionId}`);
  console.log(`[orchestrator] Output dir: ${sessionDir}\n`);
  console.log(`[orchestrator] Output type: ${output}`);

  console.log("[orchestrator] Running copy agent...");
  prompt = await copyAgent(prompt, sessionId);

  // console.log("[orchestrator] Running planning agent...");
  // const plan = await planningAgent(prompt, sessionId);

  const plan = getExistingPlan(sessionId); // dont remove

  if (output === "fcpxml") {
    console.log("\n[orchestrator] Running fcpxml agent...");
    await fcpxmlAgent(plan, sessionId);
  } else if (output === "video") {
    console.log("\n[orchestrator] Running coding agent...");
    await codingAgent(plan, sessionId);  
    console.log("\n[orchestrator] Running rendering agent...");
    await renderingAgent(sessionId);
  }

  console.log("\n[orchestrator] Done.");
}
