import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI();

/**
 * Transcribes audio from an audio or video file using OpenAI Whisper.
 * Saves result to public/<filename>.audio.json
 *
 * @param {string} inputPath - Path to an audio or video file
 * @returns {Promise<string>} Path to the saved transcript JSON
 */
export async function transcribeAudio(inputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`File not found: ${inputPath}`);
  }

  const basename = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join("public", `${basename}.audio.json`);

  if (fs.existsSync(outputPath)) {
    console.log(`Audio transcript already exists: ${outputPath}`);
    return outputPath;
  }

  const file = fs.createReadStream(inputPath);

  const transcript = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["segment", "word"],
  });

  fs.mkdirSync("public", { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(transcript, null, 2));

  console.log(`Audio transcript saved: ${outputPath}`);
  return outputPath;
}
