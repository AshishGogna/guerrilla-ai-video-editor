#!/usr/bin/env node

import fs from "fs";
import { chat } from "./tools/ai.mjs";

const sessionId = process.argv[2];
const promptPath = process.argv[3];

if (!sessionId || !promptPath) {
  console.error("Usage: guerrilla:edit <session-id> <prompt-file>");
  process.exit(1);
}

const prompt = fs.readFileSync(promptPath, "utf-8").trim();

console.log(`Session: ${sessionId}`);
console.log(`Prompt file: ${promptPath}\n`);

const response = await chat(prompt, "gpt-5.4-mini");
console.log(response);
