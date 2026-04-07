import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/**
 * Expand ~ and resolve relative paths from cwd.
 * @param {string} raw
 */
function expandPath(raw) {
  const trimmed = raw.replace(/^['"]|['"]$/g, "");
  if (!trimmed) return null;
  if (trimmed.startsWith("~/")) {
    return path.join(os.homedir(), trimmed.slice(2));
  }
  if (path.isAbsolute(trimmed)) {
    return trimmed;
  }
  return path.resolve(process.cwd(), trimmed);
}

/**
 * @param {string} line
 * @param {Map<string, string>} realToDest
 */
function rewriteLine(line, realToDest) {
  const parts = line.split(/(\s+)/);
  return parts
    .map((part) => {
      if (/^\s+$/.test(part)) return part;
      const expanded = expandPath(part);
      if (!expanded) return part;
      let real;
      try {
        real = fs.realpathSync(expanded);
      } catch {
        return part;
      }
      const dest = realToDest.get(real);
      return dest !== undefined ? dest : part;
    })
    .join("");
}

/**
 * Copies every file path token found in the prompt into public/{sessionId}/,
 * then returns the prompt with those tokens replaced by the copied absolute paths.
 *
 * @param {string} prompt
 * @param {string} sessionId
 * @returns {Promise<string>}
 */
export async function copyAgent(prompt, sessionId) {
  const destDir = path.join(ROOT, "public", sessionId);
  fs.mkdirSync(destDir, { recursive: true });

  const seen = new Set();
  /** @type {string[]} */
  const sources = [];

  for (const line of prompt.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    for (const token of t.split(/\s+/)) {
      const expanded = expandPath(token);
      if (!expanded) continue;
      let real;
      try {
        real = fs.realpathSync(expanded);
      } catch {
        continue;
      }
      if (seen.has(real)) continue;
      let st;
      try {
        st = fs.statSync(real);
      } catch {
        continue;
      }
      if (!st.isFile()) continue;
      seen.add(real);
      sources.push(real);
    }
  }

  /** @type {Map<string, string>} */
  const realToDest = new Map();
  for (const real of sources) {
    const dest = path.resolve(path.join(destDir, path.basename(real)));
    realToDest.set(real, dest);
  }

  for (const src of sources) {
    const dest = realToDest.get(src);
    if (!dest) continue;
    if (path.resolve(src) === path.resolve(dest)) {
      continue;
    }
    fs.copyFileSync(src, dest);
    console.log(`[copyAgent] Copied ${src} -> ${dest}`);
  }

  if (sources.length === 0) {
    console.log("[copyAgent] No file paths in prompt resolved to existing files.");
  }

  const eol = prompt.includes("\r\n") ? "\r\n" : "\n";
  const rewritten = prompt.split(/\r?\n/).map((line) => rewriteLine(line, realToDest)).join(eol);
  return rewritten;
}
