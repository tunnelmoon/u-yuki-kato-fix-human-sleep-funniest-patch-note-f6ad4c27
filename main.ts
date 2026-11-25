// Fix Human Sleep: Funniest Patch Note
// make.fun bounty entry: u-yuki-kato-fix-human-sleep-funniest-patch-note-f6ad4c27
// One line of patch notes announcing that human sleep is fixed.
// Gate: /output/entry.txt must be UTF-8 text of 1 to 160 characters,
// a single line, not only white space.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Fixed: humans now fall asleep in under 8 minutes. Side effect: dreams now load in 4K.";

const MAX_CHARS = 160;

function validate(line: string): void {
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Reject control characters so the entry stays clean printable text.
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("entry must not contain control characters");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

validate(LINE);

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip read-back check: what was written must read back identical.
const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  throw new Error("round-trip check failed: entry.txt does not match the line");
}
if (readBack.length < 1 || readBack.length > MAX_CHARS) {
  throw new Error("round-trip check failed: entry length out of gate range");
}

console.log(`wrote ${outPath} (${LINE.length} characters)`);
