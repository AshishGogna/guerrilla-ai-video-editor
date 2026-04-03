import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI();

function secsToTimestamp(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  const ms = Math.round((secs % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(ms).padStart(3, "0")}`;
}

/**
 * Transcribes audio from an audio or video file using OpenAI Whisper.
 * Saves result to public/<sessionId>/<filename>.audio.json
 *
 * @param {string} inputPath - Path to an audio or video file
 * @param {string} [sessionId] - Session identifier for output directory
 * @returns {Promise<string>} Path to the saved transcript JSON
 */
export async function transcribeAudio(inputPath, sessionId) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`File not found: ${inputPath}`);
  }

  const basename = path.basename(inputPath, path.extname(inputPath));
  const outDir = sessionId ? path.join("public", sessionId) : "public";
  const outputPath = path.join(outDir, `${basename}.audio.json`);

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
    duration: secsToTimestamp(transcript.duration),
    text: transcript.text,
    segments: transcript.segments.map(({ id, start, end, text }) => ({
      id,
      start: secsToTimestamp(start),
      end: secsToTimestamp(end),
      text,
    })),
    words: transcript.words.map(({ word, start, end }) => ({
      word,
      start: secsToTimestamp(start),
      end: secsToTimestamp(end),
    })),
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(clean, null, 2));

  console.log(`Audio transcript saved: ${outputPath}`);
  return outputPath;
}
