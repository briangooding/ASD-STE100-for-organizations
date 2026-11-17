// STE writing checker.
//
// A rule-based checker that finds common deviations from ASD-STE100 writing
// rules and general technical-writing practice. It is a training aid. It
// does not replace a full check against the official STE dictionary or a
// review by a trained STE writer.
//
// The module has no DOM dependencies, so it runs in the browser and in Node.

import { DICTIONARY, AMBIGUOUS_MODALS } from "./data/dictionary.js";

export const DEFAULT_OPTIONS = {
  mode: "auto", // "auto" | "procedural" | "descriptive"
  maxProceduralWords: 20,
  maxDescriptiveWords: 25,
  maxParagraphSentences: 6,
  maxNounCluster: 3,
  dictionary: DICTIONARY,
  orgTerms: [], // extra words to flag: [{ word, alternatives, note }]
  approvedTerms: [], // organization technical names that are always allowed
  disabledRules: [], // rule ids to skip
};

export const RULES = {
  "sentence-length": { title: "Sentence length", section: "Sections 5 and 6" },
  "paragraph-length": { title: "Paragraph length", section: "Section 6" },
  "unapproved-word": { title: "Non-STE word", section: "Section 1" },
  "org-term": { title: "Organization term", section: "Organization style" },
  "ing-form": { title: "-ing form", section: "Section 3" },
  "passive-voice": { title: "Passive voice", section: "Section 3" },
  "multiple-instructions": { title: "More than one instruction", section: "Section 5" },
  "condition-first": { title: "Condition after the instruction", section: "Section 5" },
  "noun-cluster": { title: "Noun cluster", section: "Section 2" },
  "safety-command": { title: "Safety instruction", section: "Section 7" },
  "note-command": { title: "Command in a note", section: "Section 7" },
  "contraction": { title: "Contraction", section: "Section 9" },
  "semicolon": { title: "Semicolon", section: "Section 8" },
  "ambiguous-modal": { title: "Ambiguous verb", section: "Best practice" },
  "progressive-tense": { title: "Progressive tense", section: "Section 3" },
  "perfect-tense": { title: "Perfect tense", section: "Section 3" },
};

// Common verbs that start an instruction. Includes some non-STE verbs
// (check, verify, ensure ...) so that the checker still detects the sentence
// as an instruction, and the dictionary rule then flags the word.
const IMPERATIVE_VERBS = new Set(
  `add adjust align apply attach bend calibrate change check clean click close
  compare connect continue cut decrease disconnect discard disengage do drain
  drill engage ensure examine fill find get give go hold increase inspect install
  keep let lift loosen lower lubricate make measure monitor move open perform
  pull push put read record refer release remove repair replace reset rotate
  safety-wire select set start stop supply tap tell test tighten torque turn
  type unlock lock use verify wait wear write enter press choose drag log sign
  save copy paste upload download run restart update configure enable disable
  confirm submit seal cover clear wipe dry heat cool fold insert`
    .split(/\s+/)
    .filter(Boolean)
);

// Other common verbs, so that "the system shows" is not read as a noun cluster.
const COMMON_VERBS = new Set(
  `show operate contain give send prevent cause has have become flow come stay
  help need include comprise provide control protect occur go move change
  hold keep let make get supply stop start open close increase decrease
  look see know think find tell` .split(/\s+/).filter(Boolean)
);
const isVerbLike = (w) => IMPERATIVE_VERBS.has(w) || COMMON_VERBS.has(w);

const FUNCTION_WORDS = new Set(
  `a an the and or but nor so yet of in on at to for from by with without into
  onto over under above below between through during before after until when
  while if then than that this these those it its is are was were be been
  being am has have had do does did not no yes all any each every some many
  more most less few other such as also only can must will shall may might
  could would should you your we our they their them he she his her i me my
  there here which who whom whose what where why how up down out off again
  per about against along across around behind beyond near since toward
  towards upon within`
    .split(/\s+/)
    .filter(Boolean)
);

// Words that end in "-ing" but are not verb forms.
const ING_EXCEPTIONS = new Set(
  `thing things nothing something anything everything during string strings
  ring rings o-ring o-rings spring springs bring wing wings king sling slings
  ceiling ceilings morning evening sing swing ping bearing bearings housing
  housings fitting fittings coupling couplings wiring tubing lining linings
  building buildings warning warnings opening openings ending landing
  bushing bushings casing casings fairing fairings shielding seating
  setting settings reading readings marking markings drawing drawings
  packing padding piping plating coating coatings grounding bonding
  heading headings spacing spacings timing rating ratings mounting mountings
  bedding sealing ceiling flooring railing railings clothing training
  retaining cooling heating locking lighting plumbing scaffolding tooling`
    .split(/\s+/)
    .filter(Boolean)
);

const IRREGULAR_PARTICIPLES = new Set(
  `done made given taken seen known shown written driven broken chosen frozen
  hidden spoken stolen worn torn sworn thrown blown grown drawn withdrawn
  held kept left lost meant met paid put read said sent set shut sold spent
  split spread stood struck stuck taught told thought understood won wound
  bent bound brought bought built caught cut dealt dug fed felt fought found
  fit got hung hit hurt laid led lent let lit run shot sunk slid spun`
    .split(/\s+/)
    .filter(Boolean)
);

const BE_FORMS = "am|is|are|was|were|be|been|being";

// Abbreviations whose periods do not end a sentence.
const ABBREVIATIONS = [
  "e.g.", "i.e.", "etc.", "approx.", "fig.", "figs.", "no.", "nos.", "ref.",
  "para.", "vs.", "mr.", "mrs.", "ms.", "dr.", "min.", "max.", "p.", "pp.",
  "vol.", "rev.", "sect.", "ch.",
];

const UNITS = new Set(
  `mm cm m km in ft lb lbs kg g mg n nm kn pa kpa mpa psi bar v mv kv a ma w kw
  hz khz mhz s ms min h hr c f k l ml % °c °f rpm db n·m n.m lbf·in lbf·ft`
    .split(/\s+/)
    .filter(Boolean)
);

const CONTRACTION_RE =
  /(?<![A-Za-z])(?:[A-Za-z]+n['’]t|it['’]s|that['’]s|there['’]s|what['’]s|let['’]s|[A-Za-z]+['’](?:ll|re|ve|d)|i['’]m)(?![A-Za-z])/gi;

const STEP_MARKER_RE = /^[ \t]*(?:\d+[.)]|[a-zA-Z][.)]|\(\w{1,3}\)|[-*•–])[ \t]+/;
const SAFETY_MARKER_RE = /^[ \t]*(WARNING|CAUTION|NOTE)\b[ \t]*[:\-–]?[ \t]*/i;
const CONDITION_START_RE = /^(?:if|when|before|after|while|until|unless|as soon as)\b[^,]*,\s*/i;

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build a regular expression that matches a word and its simple inflections.
export function termRegex(term) {
  const t = term.toLowerCase().trim();
  const L = "(?<![A-Za-z0-9])";
  const R = "(?![A-Za-z0-9])";
  if (/[^a-z]/.test(t)) {
    // Phrase or term with punctuation: exact match only, flexible spaces.
    const body = t.split(/\s+/).map(escapeRe).join("\\s+");
    return new RegExp(L + body + R, "gi");
  }
  const forms = [t + "(?:s|es|d|ed|ing)?"];
  if (t.endsWith("e")) forms.push(t.slice(0, -1) + "(?:ing|ed|es)");
  if (t.endsWith("y")) forms.push(t.slice(0, -1) + "(?:ies|ied)");
  return new RegExp(L + "(?:" + forms.join("|") + ")" + R, "gi");
}

// Replace characters that must not split sentences with a placeholder of the
// same length, so that offsets stay the same.
function maskForSplitting(text) {
  let masked = text;
  for (const abbr of ABBREVIATIONS) {
    const re = new RegExp("(?<![A-Za-z])" + escapeRe(abbr), "gi");
    masked = masked.replace(re, (m) => m.replace(/\./g, "\u0001"));
  }
  // Decimal numbers and version numbers: 2.5, 1.2.3
  masked = masked.replace(/(\d)\.(?=\d)/g, "$1\u0001");
  return masked;
}

// Split text into paragraphs, blocks and sentences, keeping offsets.
export function segment(text) {
  const paragraphs = [];
  const sentences = [];
  const paraRe = /\S[\s\S]*?(?=\n[ \t]*\n|$)/g;
  let pm;
  while ((pm = paraRe.exec(text))) {
    const pStart = pm.index;
    const pText = pm[0];
    const paragraph = { index: paragraphs.length, start: pStart, end: pStart + pText.length, sentenceIndexes: [] };
    paragraphs.push(paragraph);

    // Build blocks: a new block starts at a step marker or a safety marker.
    const blocks = [];
    let current = null;
    const lineRe = /[^\n]*(?:\n|$)/g;
    let lm;
    while ((lm = lineRe.exec(pText)) && lm[0].length > 0) {
      const line = lm[0];
      const lineStart = pStart + lm.index;
      const step = STEP_MARKER_RE.exec(line);
      const safety = SAFETY_MARKER_RE.exec(line);
      if (safety || step || !current) {
        let type = "text";
        let contentOffset = 0;
        if (safety) {
          type = safety[1].toLowerCase();
          contentOffset = safety[0].length;
        } else if (step) {
          type = "step";
          contentOffset = step[0].length;
        } else {
          contentOffset = line.length - line.trimStart().length;
        }
        current = { type, start: lineStart + contentOffset, end: lineStart + line.length };
        blocks.push(current);
      } else {
        current.end = lineStart + line.length;
      }
    }

    for (const block of blocks) {
      const bText = text.slice(block.start, block.end);
      const masked = maskForSplitting(bText);
      const sentRe = /[^.!?]+(?:[.!?]+(?=\s|$)|$)|[.!?]+/g;
      let sm;
      let blockSentence = 0;
      while ((sm = sentRe.exec(masked))) {
        if (sm[0].length === 0) {
          sentRe.lastIndex++;
          continue;
        }
        const raw = bText.slice(sm.index, sm.index + sm[0].length);
        const lead = raw.length - raw.trimStart().length;
        const trimmed = raw.trim();
        if (!/[A-Za-z0-9]/.test(trimmed)) continue;
        const start = block.start + sm.index + lead;
        const s = {
          index: sentences.length,
          paragraphIndex: paragraph.index,
          blockType: block.type,
          firstInBlock: blockSentence === 0,
          start,
          end: start + trimmed.length,
          text: trimmed,
        };
        blockSentence++;
        sentences.push(s);
        paragraph.sentenceIndexes.push(s.index);
      }
    }
  }
  return { paragraphs, sentences };
}

// Tokenize words with offsets relative to the sentence.
export function tokenize(sentenceText) {
  const tokens = [];
  const re = /[A-Za-z0-9°%][A-Za-z0-9'’\-\/.°%·]*[A-Za-z0-9%]|[A-Za-z0-9%]/g;
  let m;
  while ((m = re.exec(sentenceText))) {
    tokens.push({ text: m[0], lower: m[0].toLowerCase(), start: m.index, end: m.index + m[0].length });
  }
  return tokens;
}

// STE word count. A number and its unit count as one word.
export function countWords(tokens) {
  let count = 0;
  for (let i = 0; i < tokens.length; i++) {
    count++;
    if (/^[\d.,]+$/.test(tokens[i].text) && tokens[i + 1] && UNITS.has(tokens[i + 1].lower)) i++;
  }
  return count;
}

function stripCondition(text) {
  return text.replace(CONDITION_START_RE, "");
}

export function isInstruction(sentenceText) {
  const rest = stripCondition(sentenceText).trim();
  const first = (rest.match(/^[A-Za-z][A-Za-z\-]*/) || [""])[0].toLowerCase();
  if (!first) return false;
  if (IMPERATIVE_VERBS.has(first)) return true;
  if (/^(do\s+not|don['’]t|never|always)\b/i.test(rest)) return true;
  return false;
}

function sentenceMode(sentence, options) {
  if (options.mode === "procedural" || options.mode === "descriptive") return options.mode;
  if (sentence.blockType === "step" || sentence.blockType === "warning" || sentence.blockType === "caution") {
    return "procedural";
  }
  if (sentence.blockType === "note") return "descriptive";
  return isInstruction(sentence.text) ? "procedural" : "descriptive";
}

function rangesOf(re, text) {
  const out = [];
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text))) {
    out.push([m.index, m.index + m[0].length, m[0]]);
    if (m[0].length === 0) re.lastIndex++;
  }
  return out;
}

function overlaps(ranges, s, e) {
  return ranges.some(([a, b]) => s < b && e > a);
}

export function checkText(text, userOptions = {}) {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  const disabled = new Set(options.disabledRules || []);
  const { paragraphs, sentences } = segment(text || "");
  const issues = [];

  const approvedRegexes = (options.approvedTerms || [])
    .map((t) => (typeof t === "string" ? t : t.word))
    .filter((t) => t && t.trim())
    .map(termRegex);

  const approvedLower = new Set(
    (options.approvedTerms || []).map((t) => (typeof t === "string" ? t : t.word || "").toLowerCase().trim())
  );

  const flagged = [
    ...(options.dictionary || []).map((d) => ({ ...d, source: "dictionary" })),
    ...(options.orgTerms || []).map((d) => ({ ...d, source: "org" })),
  ]
    .filter((d) => d.word && d.word.trim() && !approvedLower.has(d.word.toLowerCase().trim()))
    .map((d) => ({ ...d, re: termRegex(d.word) }));

  const add = (rule, severity, sentence, message, extra = {}) => {
    if (disabled.has(rule)) return;
    issues.push({
      rule,
      title: RULES[rule]?.title || rule,
      section: RULES[rule]?.section || "",
      severity,
      sentenceIndex: sentence ? sentence.index : null,
      start: sentence ? sentence.start : 0,
      end: sentence ? sentence.end : 0,
      scope: "sentence",
      message,
      ...extra,
    });
  };

  const addWord = (rule, severity, sentence, rs, re, message, extra = {}) =>
    add(rule, severity, sentence, message, {
      start: sentence.start + rs,
      end: sentence.start + re,
      scope: "word",
      match: sentence.text.slice(rs, re),
      ...extra,
    });

  let totalWords = 0;
  let proceduralCount = 0;

  for (const s of sentences) {
    const tokens = tokenize(s.text);
    const words = countWords(tokens);
    totalWords += words;
    const mode = sentenceMode(s, options);
    s.mode = mode;
    s.wordCount = words;
    if (mode === "procedural") proceduralCount++;

    const protectedRanges = approvedRegexes.flatMap((re) => rangesOf(re, s.text));

    // Sentence length
    const max = mode === "procedural" ? options.maxProceduralWords : options.maxDescriptiveWords;
    if (words > max) {
      add(
        "sentence-length",
        "error",
        s,
        `This ${mode} sentence has ${words} words. The maximum is ${max}. Divide it into shorter sentences or use a vertical list.`
      );
    }

    // Dictionary and organization terms
    const wordHits = [];
    for (const d of flagged) {
      for (const [rs, re] of rangesOf(d.re, s.text)) {
        if (overlaps(protectedRanges, rs, re) || overlaps(wordHits, rs, re)) continue;
        if (ING_EXCEPTIONS.has(s.text.slice(rs, re).toLowerCase())) continue;
        wordHits.push([rs, re]);
        const alt = (d.alternatives || []).join(", ");
        addWord(
          d.source === "org" ? "org-term" : "unapproved-word",
          "warning",
          s,
          rs,
          re,
          `"${s.text.slice(rs, re)}" is not ${d.source === "org" ? "in your organization's style" : "an STE word"}.` +
            (alt ? ` Use: ${alt}.` : "") +
            (d.note ? ` ${d.note}` : ""),
          { suggestions: d.alternatives || [] }
        );
      }
    }

    // Ambiguous modal verbs
    for (const m of AMBIGUOUS_MODALS) {
      for (const [rs, re] of rangesOf(new RegExp(`(?<![A-Za-z])${m.word}(?![A-Za-z])`, "gi"), s.text)) {
        if (overlaps(protectedRanges, rs, re)) continue;
        addWord("ambiguous-modal", "info", s, rs, re, `"${s.text.slice(rs, re)}": ${m.note}`);
      }
    }

    // Contractions
    for (const [rs, re, m] of rangesOf(new RegExp(CONTRACTION_RE.source, "gi"), s.text)) {
      addWord("contraction", "warning", s, rs, re, `Do not use contractions. Write the full form ("${expandContraction(m)}").`);
    }

    // Semicolons
    for (const [rs, re] of rangesOf(/;/g, s.text)) {
      addWord("semicolon", "warning", s, rs, re, "Do not use semicolons. Write two sentences or use a vertical list.");
    }

    // Progressive tense and passive voice
    const progressiveRe = new RegExp(`(?<![A-Za-z])(?:${BE_FORMS})\\s+(?:\\w+ly\\s+)?(\\w+ing)(?![A-Za-z])`, "gi");
    const progressiveHits = [];
    for (const m of s.text.matchAll(progressiveRe)) {
      const ing = m[1].toLowerCase();
      if (ING_EXCEPTIONS.has(ing)) continue;
      const rs = m.index;
      const re = m.index + m[0].length;
      if (overlaps(protectedRanges, rs, re)) continue;
      progressiveHits.push([rs, re]);
      addWord(
        "progressive-tense",
        "warning",
        s,
        rs,
        re,
        `"${m[0]}" is a progressive (-ing) verb form. Use the simple present or simple past tense.`
      );
    }

    const passiveRe = new RegExp(`(?<![A-Za-z])(?:${BE_FORMS})\\s+(?:not\\s+)?(?:\\w+ly\\s+)?(\\w+)(?![A-Za-z])(\\s+by\\b)?`, "gi");
    for (const m of s.text.matchAll(passiveRe)) {
      const p = m[1].toLowerCase();
      const isParticiple = (/[a-z]{2,}ed$/.test(p) && !["need", "feed", "seed", "speed", "bleed"].includes(p)) || IRREGULAR_PARTICIPLES.has(p);
      if (!isParticiple) continue;
      const rs = m.index;
      const re = m.index + m[0].length - (m[2] ? m[2].length : 0);
      if (overlaps(protectedRanges, rs, re)) continue;
      const withBy = Boolean(m[2]);
      const condition = CONDITION_START_RE.exec(s.text);
      if (condition && re <= condition[0].length && !withBy) continue;
      if (mode === "procedural" && !isInstruction(s.text)) {
        addWord(
          "passive-voice",
          "error",
          s,
          rs,
          re,
          `"${s.text.slice(rs, re)}" looks like passive voice. Instructions must use the active voice (imperative): tell the reader what to do.`
        );
      } else {
        addWord(
          "passive-voice",
          withBy ? "warning" : "info",
          s,
          rs,
          re,
          withBy
            ? `"${s.text.slice(rs, re)} by ..." is passive voice. Use the active voice: put the doer first.`
            : `"${s.text.slice(rs, re)}" can be passive voice. Use the active voice when you know who or what does the action. (A past participle used as an adjective, such as "the valve is closed", is acceptable.)`
        );
      }
    }

    // Perfect tenses
    const perfectRe = /(?<![A-Za-z])(?:has|have|had)\s+(?:not\s+)?(?:been\s+)?(\w+)(?![A-Za-z])/gi;
    for (const m of s.text.matchAll(perfectRe)) {
      const p = m[1].toLowerCase();
      if (!(/[a-z]{2,}ed$/.test(p) || IRREGULAR_PARTICIPLES.has(p) || p === "come" || p === "become" || p === "gone")) continue;
      if (overlaps(protectedRanges, m.index, m.index + m[0].length)) continue;
      addWord(
        "perfect-tense",
        "warning",
        s,
        m.index,
        m.index + m[0].length,
        `"${m[0]}" is a perfect tense. STE does not use perfect tenses. Use the simple past or simple present ("when the light comes on").`
      );
    }

    // Other -ing forms
    for (const t of tokens) {
      if (!/[a-z]{2,}ing$/i.test(t.text)) continue;
      if (ING_EXCEPTIONS.has(t.lower)) continue;
      if (overlaps(protectedRanges, t.start, t.end) || overlaps(progressiveHits, t.start, t.end) || overlaps(wordHits, t.start, t.end)) continue;
      addWord(
        "ing-form",
        "info",
        s,
        t.start,
        t.end,
        `"${t.text}": STE does not use -ing verb forms, except in technical names (for example "landing gear"). If this is a technical name, add it to your organization's approved terms.`
      );
    }

    // Procedural-only rules
    if (mode === "procedural") {
      const body = stripCondition(s.text);
      const multi =
        /,\s*(?:and\s+)?then\s+/i.test(body) ||
        /\band\s+then\b/i.test(body) ||
        [...body.matchAll(/\b(?:and|,)\s+([a-z]+)\s+(?:the|a|an|all|it|them)\b/gi)].some((m) =>
          IMPERATIVE_VERBS.has(m[1].toLowerCase())
        );
      if (multi) {
        add(
          "multiple-instructions",
          "warning",
          s,
          "This sentence seems to contain more than one instruction. Write one instruction per sentence, unless the actions are done at the same time."
        );
      }
      if (!CONDITION_START_RE.test(s.text) && isInstruction(s.text) && /\s(?:if|when|unless)\s/i.test(s.text)) {
        add(
          "condition-first",
          "info",
          s,
          "Put the condition before the instruction. Example: \"If the seal is damaged, replace it.\""
        );
      }
    }

    // Noun clusters: more than N consecutive content words.
    let run = [];
    const flush = () => {
      if (run.length > options.maxNounCluster) {
        const rs = run[0].start;
        const re = run[run.length - 1].end;
        if (!overlaps(protectedRanges, rs, re)) {
          addWord(
            "noun-cluster",
            "info",
            s,
            rs,
            re,
            `Possible noun cluster of ${run.length} words. Do not use more than ${options.maxNounCluster} nouns in a cluster. Use prepositions or a hyphenated technical name ("the pressure of the oil in the engine").`
          );
        }
      }
      run = [];
    };
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      const prev = tokens[i - 1];
      const gap = prev ? s.text.slice(prev.end, t.start) : "";
      const isContent =
        /^[a-z][a-z\-]*$/i.test(t.text) &&
        !FUNCTION_WORDS.has(t.lower) &&
        !IMPERATIVE_VERBS.has(t.lower) &&
        !(/(?:ly|ed|ing)$/i.test(t.text) && !ING_EXCEPTIONS.has(t.lower)) &&
        !COMMON_VERBS.has(t.lower) &&
        !(/s$/i.test(t.text) && (isVerbLike(t.lower.replace(/e?s$/, "")) || isVerbLike(t.lower.slice(0, -1)))) &&
        !(i === 0);
      if (!isContent || (run.length && /[^\s]/.test(gap))) {
        flush();
      }
      if (isContent) run.push(t);
    }
    flush();

    // Safety instructions
    if ((s.blockType === "warning" || s.blockType === "caution") && s.firstInBlock && !isInstruction(s.text)) {
      add(
        "safety-command",
        "error",
        s,
        `Start a ${s.blockType} with a clear, short command (for example "Do not touch the hot surface."). Then give the reason or risk.`
      );
    }
    if (s.blockType === "note" && (isInstruction(s.text) || /\bmust\b/i.test(s.text))) {
      add(
        "note-command",
        "warning",
        s,
        "A note gives information only. Do not put a command in a note. Move the instruction into a step, a warning or a caution."
      );
    }
  }

  // Paragraph length (descriptive writing)
  for (const p of paragraphs) {
    const descriptive = p.sentenceIndexes.map((i) => sentences[i]).filter((s) => s.mode === "descriptive" && s.blockType === "text");
    if (descriptive.length > options.maxParagraphSentences) {
      if (!disabled.has("paragraph-length")) {
        issues.push({
          rule: "paragraph-length",
          title: RULES["paragraph-length"].title,
          section: RULES["paragraph-length"].section,
          severity: "warning",
          sentenceIndex: descriptive[0].index,
          start: p.start,
          end: p.end,
          scope: "paragraph",
          message: `This paragraph has ${descriptive.length} sentences. Do not use more than ${options.maxParagraphSentences} sentences in a descriptive paragraph. Keep one topic per paragraph.`,
        });
      }
    }
  }

  issues.sort((a, b) => a.start - b.start || severityRank(a.severity) - severityRank(b.severity));

  const counts = { error: 0, warning: 0, info: 0 };
  for (const i of issues) counts[i.severity]++;

  return {
    sentences,
    paragraphs,
    issues,
    stats: {
      words: totalWords,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      procedural: proceduralCount,
      descriptive: sentences.length - proceduralCount,
      averageSentenceLength: sentences.length ? +(totalWords / sentences.length).toFixed(1) : 0,
      counts,
    },
    score: score(counts, totalWords, sentences.length),
  };
}

function severityRank(s) {
  return s === "error" ? 0 : s === "warning" ? 1 : 2;
}

// A simple 0-100 score. Each issue removes points, weighted by severity and
// normalized by the number of sentences, so long texts are not penalized
// for length alone.
export function score(counts, words, sentenceCount) {
  if (!words) return null;
  const penalty = counts.error * 3 + counts.warning * 1.5 + counts.info * 0.4;
  const perSentence = penalty / Math.max(sentenceCount, 1);
  return Math.max(0, Math.min(100, Math.round(100 - perSentence * 25)));
}

function expandContraction(c) {
  const lower = c.toLowerCase().replace("’", "'");
  const special = { "can't": "cannot", "won't": "will not", "shan't": "shall not", "it's": "it is", "let's": "let us", "i'm": "I am" };
  if (special[lower]) return special[lower];
  return lower
    .replace(/n't$/, " not")
    .replace(/'ll$/, " will")
    .replace(/'re$/, " are")
    .replace(/'ve$/, " have")
    .replace(/'d$/, " would")
    .replace(/'s$/, " is");
}
