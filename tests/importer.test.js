import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const python = ["python3", "python"].find((p) => {
  try {
    execFileSync(p, ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
});

test("dictionary importer parses the specification layout", { skip: !python && "Python is not installed" }, () => {
  const out = join(mkdtempSync(join(tmpdir(), "ste-")), "dict.json");
  // The fixture is too small for the size check, so lower it with the environment.
  execFileSync(python, ["tools/import_ste_dictionary.py", "tests/fixtures/dictionary-layout.txt", "-o", out], {
    env: { ...process.env, STE_IMPORT_MIN_WORDS: "1" },
    stdio: "ignore",
  });
  const data = JSON.parse(readFileSync(out, "utf8"));
  const byWord = Object.fromEntries(data.entries.map((e) => [e.word, e]));
  assert.equal(data.source, "ASD-STE100 Issue 9 (2025-01-15)");
  assert.deepEqual(byWord.assist.alternatives, ["help"]);
  assert.deepEqual(byWord.coax.alternatives, ["carefully move", "carefully remove"]);
  assert.deepEqual(byWord["prior to"].pos, ["prep"]);
  assert.deepEqual(byWord["prior to"].alternatives, ["before"]);
  assert.deepEqual(byWord.remain.except, ["remaining"]);
  // "test" is approved as a verb, so the unapproved noun is left out.
  assert.equal(byWord.test, undefined);
  assert.equal(byWord.adjust, undefined);
});
