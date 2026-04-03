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

  const clean = {
    language: transcript.language,
    duration: transcript.duration,
    text: transcript.text,
    segments: transcript.segments.map(({ id, start, end, text }) => ({ id, start, end, text })),
    words: transcript.words,
  };

  fs.mkdirSync("public", { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(clean, null, 2));

  console.log(`Audio transcript saved: ${outputPath}`);
  return outputPath;
}
