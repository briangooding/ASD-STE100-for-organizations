# STE Writing Coach

A training app that helps employees learn and apply **ASD-STE100 Simplified Technical English (STE)** and technical writing best practices.

It is a static web app with no build step, no server-side code and no external dependencies. It runs offline, on GitHub Pages, or on any intranet web server. All learner data stays in the learner's browser.

## Features

| Area | What it does |
| --- | --- |
| **Learn** | 12 modules: an introduction, one module for each of the nine sections of the STE writing rules (words, multi-word nouns, verbs, sentences, procedural writing, descriptive writing, safety instructions, punctuation and word count, writing practices), general technical writing practice, and how to roll out STE in an organization. Each module has rules with "not STE" and "STE" examples and a quiz. |
| **Checker** | Paste a procedure or description. The checker highlights problems in the text, explains the rule for each one, and gives a 0–100 score. |
| **Practice** | 15 rewrite exercises (beginner to advanced). The checker gives feedback on the learner's answer, then the app shows a model answer. |
| **Quiz** | A random mixed quiz from all modules. |
| **Word list** | 317 non-STE words with the approved alternatives from ASD-STE100 Issue 9, approved words that writers often avoid by mistake, and the organization's own terms and technical names. Organizations can load the full dictionary (see below). |
| **Quick reference** | A printable one-page summary of the rules and the organization's house style. |
| **Organization** | Add approved technical names, terms to avoid, house style notes, and turn checker rules on or off. Export the settings and share them with the team. |

### What the checker finds

Each issue shows the ASD-STE100 Issue 9 rule number.

- Sentences that are too long: procedural 20 words (Rule 5.1), descriptive 25 words (Rule 6.3). Words are counted as Rules 8.5 to 8.7 say (text in parentheses, quoted text, a number with its unit, and a hyphenated word each count as one word).
- Paragraphs with more than six descriptive sentences (Rule 6.6)
- Words that are not approved, with the approved alternatives (Rules 1.1 to 1.4), including "should", "may", "would", "need", "every" and "press"
- Organization terms (Rules 1.8, 1.11)
- Passive voice (Rule 3.6): an error in procedures, a suggestion in descriptions
- Progressive and perfect tenses, and other -ing verb forms (Rules 3.2 to 3.5)
- More than one instruction in a sentence (Rule 5.2)
- A condition after the instruction (Rule 5.4)
- Multi-word nouns of more than three words (Rules 2.1, 2.2)
- Safety instructions that do not start with a command or condition (Rule 7.2), and instructions in notes (Rule 5.5)
- Contractions (Rule 4.2) and semicolons (Rule 8.1)

The checker is rule-based. It cannot check meaning or identify parts of speech, so it cannot find a word with the wrong meaning or in the wrong part of speech, an inconsistent technical name, a phrasal verb that is not in the word list, or omitted articles. A trained person must make the final review.

## The STE word list

The 317 entries in `js/data/dictionary.js` were checked against the dictionary of **ASD-STE100 Issue 9 (2025-01-15)**. Each entry is a word that is not approved in any part of speech, with the approved alternatives from the specification. The notes are our own guidance.

- Words that are approved in one part of speech but not in another (for example CHECK, approved only as a noun) are left out, because the checker cannot identify parts of speech. Two patterns ("check that", "check the" at the start of a sentence) catch the most frequent verb use.
- Approved inflections are not flagged: for example, "remain" is not approved, but "remaining" is.
- `NOT_LISTED` has 20 words that are not in the dictionary at all (for example "might", "could", "please", "etc."), with our suggestions.
- `COMMONLY_MISTAKEN` lists approved words that writers often avoid by mistake (approximately, sufficient, subsequently, contact, torque).

The word list is a selection. It does not include the definitions or examples of the specification.

### Use the full dictionary

The specification is free, but ASD's copyright notice does not permit reproduction or publication without written authority, except for the organizations that it lists (for example, ASD and AIA member companies and their customers, defense ministries, and universities for education). For this reason, this repository does not include the full dictionary. Your organization can convert its own copy:

1. Download the specification from [asd-ste100.org](https://www.asd-ste100.org).
2. Install `pdftotext` (`poppler-utils`), then run:

   ```bash
   python3 tools/import_ste_dictionary.py ASD-STE100_ISSUE9.pdf
   ```

3. Put the output file, `ste-dictionary.json`, next to `index.html` on your server. The app loads it at startup, and the checker and the Word list then use all the words that are not approved in any part of speech (1,167 in Issue 9).

`ste-dictionary.json` and PDF files are in `.gitignore`. Do not publish them, and use them only as your organization's rights permit.

## Run locally

ES modules do not load from `file://`, so serve the folder over HTTP:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Deploy

Copy the repository content to any static web host. For GitHub Pages: **Settings → Pages → Deploy from a branch**, then select the branch and the `/ (root)` folder.

### Give every employee the same organization settings

1. Open **Organization**, enter your technical names and terms, and select **Export settings**. You can also start from [`org-config.example.json`](org-config.example.json).
2. Save the file as `org-config.json` next to `index.html` on the web server.
3. The app loads this file at startup. A user's own saved settings take priority, unless the file contains `"locked": true`.

If you do not deploy these files, the browser console shows a 404 for `org-config.json` and `ste-dictionary.json`. This is normal.

Settings file format:

```json
{
  "name": "Acme Technical Publications",
  "locked": false,
  "approvedTerms": ["landing gear", "retaining ring"],
  "orgTerms": [{ "word": "hose", "alternatives": ["fuel line"], "note": "Use the parts list name." }],
  "disabledRules": [],
  "styleNotes": "Give SI units first."
}
```

Rule IDs for `disabledRules`: `sentence-length`, `paragraph-length`, `unapproved-word`, `org-term`, `ing-form`, `passive-voice`, `progressive-tense`, `perfect-tense`, `multiple-instructions`, `condition-first`, `noun-cluster`, `safety-command`, `note-command`, `contraction`, `semicolon`.

## Project structure

```
index.html              App shell
css/styles.css          Styles (light and dark mode, print, mobile)
js/app.js               Views and hash router
js/store.js             Progress and organization settings (localStorage)
js/checker.js           Rule engine (no DOM, also runs in Node)
js/data/lessons.js      Learning modules and quizzes
js/data/exercises.js    Rewrite exercises
js/data/dictionary.js   STE word list (verified against Issue 9)
js/data/reference.js    Tips, quick reference and checker sample text
tools/                  Importer for the full STE dictionary
tests/                  Node tests for the checker, content and importer
```

## Tests

```bash
npm test
```

The tests use the built-in Node test runner (Node 18 or later). They cover the checker rules, and they also confirm that every model answer and every "STE" lesson example passes the checker, and every exercise original fails it. When you add content, the tests show if an example contradicts the checker.

## Add content

- **Module:** add an object to `MODULES` in `js/data/lessons.js` (`id`, `title`, `section`, `minutes`, `summary`, `body`, `rules`, `quiz`).
- **Exercise:** add an object to `EXERCISES` in `js/data/exercises.js`. Set `mode` to `procedural`, `descriptive` or `auto`.
- **STE word:** add `{ word, pos, alternatives, note }` to `DICTIONARY` in `js/data/dictionary.js`. Check the word and its alternatives in the current issue of the specification, and do not add words that are approved in another part of speech. For organization-specific words, use the Organization settings instead.

## Important note about the STE specification

This app is a training aid. It is not affiliated with or endorsed by ASD. ASD-STE100 is a trademark of ASD.

The word list is a verified selection, not the full official dictionary, and the lessons are summaries in our own words. Get the official specification free of charge from [asd-ste100.org](https://www.asd-ste100.org) and use it as the reference. For lead writers, think about formal STE training from a qualified trainer.
