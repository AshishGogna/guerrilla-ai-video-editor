import OpenAI from "openai";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { transcribeAudio } from "./tool_audio_transcript.mjs";
import { transcribeVideo } from "./tool_visual_transcript.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs.readFileSync(path.join(__dirname, "systemPromptChat.txt"), "utf-8").trim();

const openai = new OpenAI();

const MODELS = ["gpt-5.4", "gpt-5.4-mini"];

const tools = [
  {
    type: "function",
    function: {
      name: "transcribeAudio",
      description: "Transcribe audio from an audio or video file. Returns the transcription.",
      parameters: {
        type: "object",
        properties: {
          inputPath: {
            type: "string",
            description: "Path to an audio or video file",
          },
        },
        required: ["inputPath"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "transcribeVideo",
      description: "Transcribe visual content from a video file for visual understanding of what's happening in video. Returns the transcription.",
      parameters: {
        type: "object",
        properties: {
          inputPath: {
            type: "string",
            description: "Path to a video file",
          },
          prompt: {
            type: "string",
            description: "Instructions for what to describe about the video",
          },
        },
        required: ["inputPath", "prompt"],
      },
    },
  },
];

function getToolHandlers(sessionId) {
  return {
    transcribeAudio: async ({ inputPath }) => {
      const outputPath = await transcribeAudio(inputPath, sessionId);
      return fs.readFileSync(outputPath, "utf-8");
    },
    transcribeVideo: async ({ inputPath, prompt }) => {
      const outputPath = await transcribeVideo(inputPath, prompt, sessionId);
      return fs.readFileSync(outputPath, "utf-8");
    },
  };
}

/**
 * @param {string} prompt - User prompt text
 * @param {string} model - One of: gpt-5.4, gpt-5.4-mini
 * @param {string} [sessionId] - Session identifier for saving message history
 * @returns {Promise<string>} AI response text
 */
export async function chat(prompt, model, sessionId) {
  if (!MODELS.includes(model)) {
    throw new Error(`Unknown model: ${model}. Available: ${MODELS.join(", ")}`);
  }

  const toolHandlers = getToolHandlers(sessionId);
  const historyPath = sessionId ? path.join("public", sessionId, "messageHistory.json") : null;

  const messages = [{ role: "system", content: systemPrompt }];

  if (historyPath && fs.existsSync(historyPath)) {
    const previous = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
    if (Array.isArray(previous) && previous.length > 0) {
      if (previous[0].role) {
        messages.push(...previous.filter(m => m.role !== "system"));
      } else if (previous[0].messages) {
        for (const entry of previous) {
          messages.push(...entry.messages.filter(m => m.role !== "system"));
        }
      }
    }
  }

  messages.push({ role: "user", content: prompt });

  while (true) {
    const response = await openai.chat.completions.create({
      model,
      messages,
      tools,
    });

    const choice = response.choices[0];

    if (choice.finish_reason === "tool_calls") {
      messages.push(choice.message);

      for (const toolCall of choice.message.tool_calls) {
        const fn = toolHandlers[toolCall.function.name];
        if (!fn) {
          throw new Error(`Unknown tool: ${toolCall.function.name}`);
        }

        const args = JSON.parse(toolCall.function.arguments);
        console.log(`Calling tool: ${toolCall.function.name}(${JSON.stringify(args)})`);

        const result = await fn(args);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: String(result),
        });
      }

      continue;
    }

    messages.push({ role: "assistant", content: choice.message.content });

    if (sessionId) {
      saveMessageHistory(sessionId, messages);
    }

    return choice.message.content;
  }
}

function saveMessageHistory(sessionId, messages) {
  const historyPath = path.join("public", sessionId, "messageHistory.json");
  fs.mkdirSync(path.dirname(historyPath), { recursive: true });
  fs.writeFileSync(historyPath, JSON.stringify(messages, null, 2));
}
