#!/usr/bin/env node

import fs from "fs";
import { orchestrate } from "./orchestrator.mjs";

const sessionId = process.argv[2];
const argv = process.argv.slice(3);

let output = "video";
const promptParts = [];
for (const a of argv) {
  if (a === "--video") output = "video";
  else if (a === "--fcpxml") output = "fcpxml";
  else if (a.startsWith("--output=")) output = a.split("=").slice(1).join("=") || output;
  else promptParts.push(a);
}
const promptInput = promptParts.join(" ");

if (!sessionId || !promptInput) {
  console.error(
    "Usage: guerrilla:edit <session-id> <prompt-file-or-text> [--output=video|fcpxml | --video | --fcpxml]",
  );
  process.exit(1);
}

const prompt = fs.existsSync(promptInput)
  ? fs.readFileSync(promptInput, "utf-8").trim()
  : promptInput;

if (output !== "video" && output !== "fcpxml") {
  console.error(`Unknown output: ${output}. Expected video or fcpxml.`);
  process.exit(1);
}

await orchestrate(prompt, sessionId, output);
