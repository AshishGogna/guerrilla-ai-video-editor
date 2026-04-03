import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/**
 * Rendering agent: renders the Remotion composition to a video file in public/.
 *
 * @param {string} sessionId - Used to name the output file
 */
export async function renderingAgent(sessionId) {
  const outputPath = path.join("public", `${sessionId}.mp4`);

  console.log(`[renderingAgent] Rendering to ${outputPath}...`);

  execSync(
    `npx remotion render src/index.ts Main ${outputPath}`,
    { stdio: "inherit", cwd: ROOT },
  );

  console.log(`[renderingAgent] Output saved: ${outputPath}`);
}
