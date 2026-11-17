import { test } from "node:test";
import assert from "node:assert/strict";
import { checkText, segment, countWords, tokenize, isInstruction, termRegex } from "../js/checker.js";
import { EXERCISES } from "../js/data/exercises.js";
import { MODULES } from "../js/data/lessons.js";
import { normalizeOrg } from "../js/store.js";
import { DICTIONARY, NOT_LISTED, COMMONLY_MISTAKEN } from "../js/data/dictionary.js";
import { steWordCount } from "../js/checker.js";

const rules = (text, opts) => checkText(text, opts).issues.map((i) => i.rule);

test("segments steps, safety notices and paragraphs", () => {
  const { sentences, paragraphs } = segment("1. Remove the cover.\n2. Discard the seal.\n\nWARNING: Do not touch the terminals.\n\nThe pump is in the bay. It has two ports.");
  assert.equal(paragraphs.length, 3);
  assert.deepEqual(
    sentences.map((s) => [s.blockType, s.text]),
    [
      ["step", "Remove the cover."],
      ["step", "Discard the seal."],
      ["warning", "Do not touch the terminals."],
      ["text", "The pump is in the bay."],
      ["text", "It has two ports."],
    ]
  );
});

test("does not split on abbreviations or decimals", () => {
  const { sentences } = segment("Use a tool, e.g. a wrench, to apply 2.5 N·m. Then stop.");
  assert.equal(sentences.length, 2);
});

test("sentence offsets map back to the original text", () => {
  const text = "  Remove the cover.  Install the seal.\n\n3. Push the button.";
  for (const s of segment(text).sentences) assert.equal(text.slice(s.start, s.end), s.text);
});

test("counts a number and its unit as one word", () => {
  assert.equal(countWords(tokenize("Tighten the nut to 25 N·m.")), 5);
  assert.equal(countWords(tokenize("Move it 10 mm to the left.")), 6);
});

test("detects instructions", () => {
  assert.ok(isInstruction("Remove the cover."));
  assert.ok(isInstruction("If the seal is damaged, replace it."));
  assert.ok(isInstruction("Do not touch the terminals."));
  assert.ok(!isInstruction("The pump supplies pressure."));
});

test("procedural sentence longer than 20 words", () => {
  const long = "Remove the four bolts that attach the cover to the housing of the pump on the left side of the unit near the door.";
  assert.ok(rules(long).includes("sentence-length"));
  assert.ok(!rules("Remove the four bolts.").includes("sentence-length"));
});

test("descriptive limit is 25 words", () => {
  const s22 = "The pump supplies hydraulic pressure to the actuators of the doors and to the brakes when the engine operates at a normal speed.";
  assert.ok(!rules(s22).includes("sentence-length"));
  assert.ok(rules(s22, { mode: "procedural" }).includes("sentence-length"));
});

test("paragraph with more than six descriptive sentences", () => {
  const p = Array.from({ length: 7 }, (_, i) => `The unit has part ${i + 1}.`).join(" ");
  assert.ok(rules(p).includes("paragraph-length"));
});

test("flags non-STE words and inflections", () => {
  const r = checkText("Utilize the tool. Ensure that the switch is off. The light indicates a fault.");
  const words = r.issues.filter((i) => i.rule === "unapproved-word").map((i) => i.match.toLowerCase());
  assert.deepEqual(words, ["utilize", "ensure", "indicates"]);
});

test("flags phrases", () => {
  assert.ok(rules("Prior to the test, stop the pump.").includes("unapproved-word"));
  assert.ok(rules("Remove the cover in order to get access.").includes("unapproved-word"));
});

test("term regex matches inflections but not other words", () => {
  const re = termRegex("utilize");
  assert.ok(re.test("utilizing"));
  re.lastIndex = 0;
  assert.ok(re.test("utilized"));
  re.lastIndex = 0;
  assert.ok(!re.test("utilizer"));
});

test("passive voice is an error in a non-imperative procedural step", () => {
  const r = checkText("1. The cover is removed by the technician.");
  const i = r.issues.find((x) => x.rule === "passive-voice");
  assert.equal(i.severity, "error");
});

test("past participle in a leading condition is accepted", () => {
  assert.ok(!rules("If the seal is damaged, replace it.").includes("passive-voice"));
});

test("progressive and perfect tenses", () => {
  assert.ok(rules("The pump is operating at high speed.").includes("progressive-tense"));
  assert.ok(rules("When the light has come on, release the switch.").includes("perfect-tense"));
});

test("-ing technical names are not flagged", () => {
  assert.ok(!rules("Examine the bearing and the housing for damage.").includes("ing-form"));
  assert.ok(rules("Examine the part while rotating it slowly.").includes("ing-form") || rules("Examine the part while rotating it slowly.").includes("unapproved-word"));
});

test("multiple instructions and condition placement", () => {
  assert.ok(rules("Remove the bolts and then lift the cover.").includes("multiple-instructions"));
  assert.ok(rules("Remove the bolts and lift the cover.").includes("multiple-instructions"));
  assert.ok(!rules("Remove the bolts.").includes("multiple-instructions"));
  assert.ok(rules("Replace the seal if it is damaged.").includes("condition-first"));
});

test("noun clusters of more than three words", () => {
  assert.ok(rules("Read the engine oil pressure indicator.").includes("noun-cluster"));
  assert.ok(!rules("Read the oil pressure.").includes("noun-cluster"));
});

test("safety notices and notes", () => {
  assert.ok(rules("WARNING: High voltage is present.").includes("safety-command"));
  assert.ok(!rules("WARNING: Disconnect the power. High voltage can kill you.").includes("safety-command"));
  assert.ok(rules("NOTE: You must wear gloves.").includes("note-command"));
});

test("contractions, semicolons and unapproved modal verbs", () => {
  const r = checkText("Don't open the valve; the pressure should decrease.");
  const ids = r.issues.map((i) => i.rule);
  assert.ok(ids.includes("contraction"));
  assert.ok(ids.includes("semicolon"));
  assert.ok(r.issues.some((i) => i.rule === "unapproved-word" && i.match === "should" && i.message.includes("must")));
});

test("word list entries are well formed and unique", () => {
  const seen = new Set();
  for (const e of [...DICTIONARY, ...NOT_LISTED]) {
    assert.ok(e.word && e.word === e.word.toLowerCase(), e.word);
    assert.ok(Array.isArray(e.alternatives) && e.alternatives.length, e.word);
    assert.ok(!seen.has(e.word), "duplicate " + e.word);
    seen.add(e.word);
  }
  for (const e of DICTIONARY) assert.ok(Array.isArray(e.pos) && e.pos.length, e.word);
  assert.ok(DICTIONARY.length >= 300);
});

test("approved Issue 9 words are not flagged", () => {
  for (const m of COMMONLY_MISTAKEN) assert.ok(!DICTIONARY.some((d) => d.word === m.word), m.word);
  const text = "Drain approximately 2 liters. Make sure that the quantity is sufficient. Contact customer services. Torque the plug. Do a check of the system. Add the oil very slowly. Subsequently, the unit stops.";
  assert.deepEqual(rules(text).filter((r) => r === "unapproved-word"), []);
});

test("approved inflections, the month May and hyphenated words are not flagged", () => {
  assert.ok(!rules("Discard the remaining fluid.").includes("unapproved-word"));
  assert.ok(rules("The fluid must remain in the tank.").includes("unapproved-word"));
  assert.ok(!rules("The change was made on May 5.").includes("unapproved-word"));
  assert.ok(!rules("Install a two-way valve.").includes("unapproved-word"));
});

test("check is flagged only as a verb pattern", () => {
  assert.ok(rules("Check that the valve is closed.").includes("unapproved-word"));
  assert.ok(rules("Check the valve for leaks.").includes("unapproved-word"));
  assert.ok(!rules("Do a check of the valve.").includes("unapproved-word"));
});

test("Rule 8.5 and 8.6: parentheses and quoted text count as one word", () => {
  assert.equal(steWordCount("Remove the cover (Figure 2, item 14)."), 4);
  assert.equal(steWordCount('Select "Save all open files".'), 2);
});

test("organization terms are flagged and approved terms are protected", () => {
  const orgTerms = [{ word: "hose", alternatives: ["fuel line"], note: "" }];
  assert.ok(rules("Disconnect the hose.", { orgTerms }).includes("org-term"));
  const text = "Examine the main landing gear door actuator.";
  assert.ok(rules(text).includes("noun-cluster"));
  assert.ok(!rules(text, { approvedTerms: ["main landing gear door actuator"] }).includes("noun-cluster"));
  // An approved term removes a dictionary entry with the same word.
  assert.ok(!rules("Inspect the panel.", { approvedTerms: ["inspect"] }).includes("unapproved-word"));
});

test("disabled rules are skipped", () => {
  assert.ok(!rules("Don't do it.", { disabledRules: ["contraction"] }).includes("contraction"));
});

test("score: clean text is 100, bad text is lower, empty is null", () => {
  assert.equal(checkText("Remove the cover.").score, 100);
  assert.ok(checkText("Utilize the tool; don't stop.").score < 80);
  assert.equal(checkText("").score, null);
});

test("every exercise original has issues and every model answer is clean", () => {
  for (const e of EXERCISES) {
    assert.ok(checkText(e.original, { mode: e.mode }).issues.length > 0, `original ${e.id} should have issues`);
    const m = checkText(e.model, { mode: e.mode });
    assert.equal(m.issues.length, 0, `model ${e.id}: ${m.issues.map((i) => i.rule + ":" + (i.match || "")).join(", ")}`);
  }
});

test("every 'STE' example in the lessons passes the checker", () => {
  for (const m of MODULES) {
    for (const r of m.rules) {
      const res = checkText(r.good, { disabledRules: r.allow || [] });
      assert.equal(res.issues.length, 0, `${m.id} / ${r.rule}: ${res.issues.map((i) => i.rule + ":" + (i.match || "")).join(", ")}`);
    }
  }
});

test("lesson quizzes are well formed", () => {
  for (const m of MODULES) {
    assert.ok(m.quiz.length > 0, m.id);
    for (const q of m.quiz) {
      assert.ok(q.answer >= 0 && q.answer < q.options.length, `${m.id}: ${q.q}`);
      assert.equal(new Set(q.options).size, q.options.length, `${m.id}: duplicate options`);
    }
  }
});

test("normalizeOrg cleans imported settings", () => {
  const org = normalizeOrg({ name: "Acme", approvedTerms: ["  landing gear ", "", 5], orgTerms: [{ word: "hose", alternatives: ["fuel line"] }, { foo: 1 }], disabledRules: ["semicolon"] });
  assert.equal(org.name, "Acme");
  assert.deepEqual(org.approvedTerms, ["landing gear"]);
  assert.equal(org.orgTerms.length, 1);
  assert.deepEqual(org.disabledRules, ["semicolon"]);
  assert.deepEqual(normalizeOrg(null).approvedTerms, []);
});
