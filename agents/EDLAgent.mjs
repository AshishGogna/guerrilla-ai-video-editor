import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chat } from "../tools/ai.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs
  .readFileSync(
    path.join(__dirname, "..", "systemPrompts", "systemPromptEDLAgent.txt"),
    "utf-8",
  )
  .trim();

function extractFcpXml(text) {
  const trimmed = String(text ?? "").trim();
  const m1 = trimmed.match(/<\?xml[\s\S]*?<\/fcpxml>/i);
  if (m1?.[0]) return m1[0].trim();
  const m2 = trimmed.match(/<fcpxml[\s\S]*?<\/fcpxml>/i);
  if (m2?.[0]) return m2[0].trim();
  return trimmed;
}

/**
 * EDL agent: converts an editing plan into an importable FCPXML file.
 *
 * @param {string} editingPlan - The editing plan from the planning agent
 * @param {string} sessionId - Session identifier
 */
export async function EDLAgent(editingPlan, sessionId) {
  const prompt = `Convert this editing plan into a single valid FCPXML document:\n\n${editingPlan}`;
  const response = await chat(systemPrompt, prompt, "gpt-5.4", sessionId);
  let xml = extractFcpXml(response);

  const outPath = path.join(__dirname, "..", "public", sessionId, "FCPXML.xml");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml);
  console.log(`[EDLAgent] FCPXML saved: ${outPath}`);

  return xml;
}

