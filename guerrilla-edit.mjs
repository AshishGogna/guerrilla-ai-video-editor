#!/usr/bin/env node

import fs from "fs";
import { orchestrate } from "./orchestrator.mjs";

const sessionId = process.argv[2];
const promptInput = process.argv.slice(3).join(" ");

if (!sessionId || !promptInput) {
  console.error("Usage: guerrilla:edit <session-id> <prompt-file-or-text>");
  process.exit(1);
}

const prompt = fs.existsSync(promptInput)
  ? fs.readFileSync(promptInput, "utf-8").trim()
  : promptInput;

await orchestrate(prompt, sessionId);
