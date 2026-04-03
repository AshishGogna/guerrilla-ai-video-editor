import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/**
 * Rendering agent: renders the Remotion composition to a video file.
 *
 * @param {string} sessionId - Used to locate the remotion file and name the output
 */
export async function renderingAgent(sessionId) {
  const entryPoint = path.join("src", `${sessionId}_remotion.tsx`);
  const outputPath = path.join("public", sessionId, `${sessionId}.mp4`);

  console.log(`[renderingAgent] Rendering ${entryPoint} to ${outputPath}...`);

  execSync(
    `npx remotion render ${entryPoint} Main ${outputPath}`,
    { stdio: "inherit", cwd: ROOT },
  );

  console.log(`[renderingAgent] Output saved: ${outputPath}`);
}
