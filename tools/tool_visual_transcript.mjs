import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs.readFileSync(path.join(__dirname, "systemPromptVisualTranscript.txt"), "utf-8").trim();

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview", systemInstruction: systemPrompt });

/**
 * Transcribes visual content from a video file using Gemini Vision.
 * Saves result to public/<filename>.video.json
 *
 * @param {string} inputPath - Path to a video file
 * @param {string} prompt - Instructions for what to describe in the video
 * @returns {Promise<string>} Path to the saved transcript JSON
 */
export async function transcribeVideo(inputPath, prompt) {
  // prompt = systemPrompt;

  if (!fs.existsSync(inputPath)) {
    throw new Error(`File not found: ${inputPath}`);
  }

  const basename = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join("public", `${basename}.video.json`);

  if (fs.existsSync(outputPath)) {
    console.log(`Visual transcript already exists: ${outputPath}`);
    return outputPath;
  }

  const ext = path.extname(inputPath).toLowerCase();
  const mimeTypes = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".mkv": "video/x-matroska",
  };
  const mimeType = mimeTypes[ext];
  if (!mimeType) {
    throw new Error(`Unsupported video format: ${ext}`);
  }

  console.log(`Uploading video to Gemini...`);
  const uploadResult = await fileManager.uploadFile(inputPath, {
    mimeType,
    displayName: path.basename(inputPath),
  });

  let file = uploadResult.file;
  while (file.state === "PROCESSING") {
    console.log("Waiting for video processing...");
    await new Promise((r) => setTimeout(r, 3000));
    file = await fileManager.getFile(file.name);
  }

  if (file.state === "FAILED") {
    throw new Error("Gemini video processing failed");
  }

  console.log("Generating visual transcript...");
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: file.mimeType,
        fileUri: file.uri,
      },
    },
    prompt,
  ]);

  const responseText = result.response.text();

  let frames;
  try {
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    frames = jsonMatch ? JSON.parse(jsonMatch[0]) : [{ timestamp: 0, description: responseText }];
  } catch {
    frames = [{ timestamp: 0, description: responseText }];
  }

  const fpsStr = execSync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "${inputPath}"`,
    { encoding: "utf-8" },
  ).trim();
  const [num, den] = fpsStr.split("/").map(Number);
  const fps = den ? Math.round((num / den) * 100) / 100 : num;

  const output = {
    source: inputPath,
    fps,
    frames,
  };

  fs.mkdirSync("public", { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`Visual transcript saved: ${outputPath}`);
  return outputPath;
}
