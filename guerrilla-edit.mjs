#!/usr/bin/env node

import fs from "fs";
import { orchestrate } from "./orchestrator.mjs";

const sessionId = process.argv[2];
const promptPath = process.argv[3];

if (!sessionId || !promptPath) {
  console.error("Usage: guerrilla:edit <session-id> <prompt-file>");
  process.exit(1);
}

const prompt = fs.readFileSync(promptPath, "utf-8").trim();

await orchestrate(prompt, sessionId);
