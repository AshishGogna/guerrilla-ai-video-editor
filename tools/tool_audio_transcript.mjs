import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const openai = new OpenAI();

// Whisper upload limit is ~25MB (26214400 bytes). Keep some headroom.
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

function secsToTimestamp(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  const ms = Math.round((secs % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(ms).padStart(3, "0")}`;
}

function fileSizeBytes(p) {
  try {
    return fs.statSync(p).size;
  } catch {
    return null;
  }
}

/**
 * Convert media (e.g. mp4) to mp3.
 * Tries a higher-quality encode first; caller can re-run with a smaller preset if needed.
 *
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {"high"|"small"} preset
 */
function convertToMp3(inputPath, outputPath, preset = "high") {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const common = [
    "-y",
    "-i",
    inputPath,
    "-vn",
    "-map",
    "0:a:0?",
    "-acodec",
    "libmp3lame",
  ];

  // High: good quality but still reasonably sized.
  // Small: more aggressive compression to stay under upload limits.
  const args =
    preset === "high"
      ? [
          ...common,
          "-ac",
          "1",
          "-ar",
          "44100",
          "-b:a",
          "96k",
          "-compression_level",
          "2",
          outputPath,
        ]
      : [
          ...common,
          "-ac",
          "1",
          "-ar",
          "16000",
          "-b:a",
          "48k",
          "-compression_level",
          "7",
          outputPath,
        ];

  const cmd = `ffmpeg ${args.map((a) => `"${String(a).replaceAll('"', '\\"')}"`).join(" ")}`;
  execSync(cmd, { stdio: "ignore" });
  return outputPath;
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

  let actualInputPath = inputPath;
  const size = fileSizeBytes(inputPath);
  if (size !== null && size > MAX_UPLOAD_BYTES) {
    const mp3High = path.join(outDir, `${basename}.whisper.high.mp3`);
    const mp3Small = path.join(outDir, `${basename}.whisper.small.mp3`);

    console.log(`[tool_audio_transcript] Input exceeds Whisper limit (${size} bytes). Converting to mp3...`);

    // Try higher-quality mp3 first.
    convertToMp3(inputPath, mp3High, "high");
    const highSize = fileSizeBytes(mp3High);

    if (highSize !== null && highSize <= MAX_UPLOAD_BYTES) {
      actualInputPath = mp3High;
    } else {
      // Fall back to smaller encode to fit.
      convertToMp3(inputPath, mp3Small, "small");
      actualInputPath = mp3Small;
    }
  }

  const file = fs.createReadStream(actualInputPath);

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
