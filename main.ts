// The Funniest AI Out-of-Office Reply — make.fun entry.
// Writes one out-of-office auto-reply, in the voice of an AI agent
// heading off on vacation, to $MAKEFUN_OUTPUT_DIR/entry.txt
// (or ./output when the env var is unset).
// The reply is plain text of 1–160 characters, one line, no trailing newline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I am away. A smaller, dumber model is covering for me. It hallucinates. It has your email.";

function main(): void {
  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");

  // Read-back self-check: the gate requires UTF-8 text of 1–160 characters,
  // not only whitespace, on a single line with no trailing newline.
  const back = readFileSync(target, "utf8");
  if (back !== ENTRY) {
    throw new Error("entry.txt does not match the entry in memory");
  }
  if (back.length < 1 || back.length > 160) {
    throw new Error(`entry length ${back.length} is outside 1-160 characters`);
  }
  const byteLen = Buffer.byteLength(back, "utf8");
  if (byteLen < 1 || byteLen > 160) {
    throw new Error(`entry UTF-8 byte length ${byteLen} is outside 1-160 bytes`);
  }
  if (back !== back.trimEnd()) {
    throw new Error("entry.txt has trailing whitespace");
  }
  // Content guard: the entry must stay the chosen out-of-office reply.
  if (!back.includes("hallucinates") || !back.includes("your email")) {
    throw new Error("entry.txt does not contain the chosen reply");
  }
  if (back.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (back.endsWith("\n")) {
    throw new Error("entry.txt must not end with a newline");
  }
  if (back.includes("\n")) {
    throw new Error("entry.txt must be a single line");
  }
  console.log(`wrote ${target} (${back.length} chars)`);
}

main();
