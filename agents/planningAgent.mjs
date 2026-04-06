import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chat } from "../tools/ai.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs.readFileSync(
  path.join(__dirname, "..", "systemPrompts", "systemPromptPlanningAgent.txt"),
  "utf-8",
).trim();

/** Audio / visual transcript outputs from tool_audio_transcript / tool_visual_transcript. */
function isTranscriptFile(name) {
  return name.endsWith(".audio.json") || name.endsWith(".video.json");
}

/**
 * Reads all transcript JSON files in public/<sessionId>/ and returns one markdown-ish block, or "".
 */
function readSessionTranscriptsBlock(sessionId) {
  const dir = path.join("public", sessionId);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return "";
  }
  const names = fs.readdirSync(dir).filter(isTranscriptFile).sort();
  if (names.length === 0) return "";

  const parts = names.map((name) => {
    const full = path.join(dir, name);
    try {
      const body = fs.readFileSync(full, "utf-8").trim();
      return `### ${name}\n${body}`;
    } catch (e) {
      return `### ${name}\n[failed to read: ${e?.message ?? e}]`;
    }
  });

  return `Available transcripts (${names.length} file(s)):\n\n${parts.join("\n\n---\n\n")}`;
}

/**
 * Planning agent: creates an editing plan from the user prompt and transcripts.
 *
 * @param {string} userPrompt - The user's editing prompt
 * @param {string} sessionId - Session identifier
 * @returns {Promise<string>} The editing plan text
 */
export async function planningAgent(userPrompt, sessionId) {
  const planPath = path.join("public", sessionId, "editingPlan.txt");
  const transcriptsBlock = readSessionTranscriptsBlock(sessionId);

  let finalUserPrompt = userPrompt;
  if (transcriptsBlock) finalUserPrompt += `\n\nTranscripts -\n${transcriptsBlock}`;

  const response = await chat(systemPrompt, finalUserPrompt, "gpt-5.4", sessionId);

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

