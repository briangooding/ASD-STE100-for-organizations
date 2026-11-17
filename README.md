# STE Writing Coach

A training app that helps employees learn and apply **ASD-STE100 Simplified Technical English (STE)** and technical writing best practices.

It is a static web app with no build step, no server-side code and no external dependencies. It runs offline, on GitHub Pages, or on any intranet web server. All learner data stays in the learner's browser.

## Features

| Area | What it does |
| --- | --- |
| **Learn** | 11 modules: an introduction, one module for each STE writing-rule section (words, noun clusters, verbs, sentences, procedures, descriptive writing, safety instructions, punctuation), general technical writing practice, and how to roll out STE in an organization. Each module has rules with "not STE" and "STE" examples and a quiz. |
| **Checker** | Paste a procedure or description. The checker highlights problems in the text, explains the rule for each one, and gives a 0–100 score. |
| **Practice** | 13 rewrite exercises (beginner to advanced). The checker gives feedback on the learner's answer, then the app shows a model answer. |
| **Quiz** | A random mixed quiz from all modules. |
| **Word list** | Search for common non-STE words with alternatives, plus the organization's own terms and approved technical names. |
| **Quick reference** | A printable one-page summary of the rules and the organization's house style. |
| **Organization** | Add approved technical names, terms to avoid, house style notes, and turn checker rules on or off. Export the settings and share them with the team. |

### What the checker finds

- Sentences that are too long (procedural: 20 words, descriptive: 25 words). Each sentence is classified automatically, or the writer selects the text type.
- Paragraphs with more than six descriptive sentences
- Non-STE words from the starter list and organization terms, with alternatives
- Passive voice (an error in procedures, a suggestion in descriptions)
- Progressive (-ing) and perfect tenses, and other -ing verb forms
- More than one instruction in a sentence
- A condition after the instruction ("Replace the seal if it is damaged")
- Noun clusters of more than three words
- Warnings and cautions that do not start with a command, and commands in notes
- Contractions, semicolons, and ambiguous verbs (should, may, might, could, would)

The checker is rule-based. It cannot check meaning, so it cannot find a word with the wrong meaning, an inconsistent technical name, or omitted articles. A trained person must make the final review.

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

If you do not deploy a file, the browser console shows a 404 for `org-config.json`. This is normal.

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

Rule IDs for `disabledRules`: `sentence-length`, `paragraph-length`, `unapproved-word`, `org-term`, `ing-form`, `passive-voice`, `progressive-tense`, `perfect-tense`, `multiple-instructions`, `condition-first`, `noun-cluster`, `safety-command`, `note-command`, `contraction`, `semicolon`, `ambiguous-modal`.

## Project structure

```
index.html              App shell
css/styles.css          Styles (light and dark mode, print, mobile)
js/app.js               Views and hash router
js/store.js             Progress and organization settings (localStorage)
js/checker.js           Rule engine (no DOM, also runs in Node)
js/data/lessons.js      Learning modules and quizzes
js/data/exercises.js    Rewrite exercises
js/data/dictionary.js   Starter list of non-STE words
js/data/reference.js    Tips, quick reference and checker sample text
tests/                  Node tests for the checker and content
```

## Tests

```bash
npm test
```

The tests use the built-in Node test runner (Node 18 or later). They cover the checker rules, and they also confirm that every model answer and every "STE" lesson example passes the checker, and every exercise original fails it. When you add content, the tests show if an example contradicts the checker.

## Add content

- **Module:** add an object to `MODULES` in `js/data/lessons.js` (`id`, `title`, `section`, `minutes`, `summary`, `body`, `rules`, `quiz`).
- **Exercise:** add an object to `EXERCISES` in `js/data/exercises.js`. Set `mode` to `procedural`, `descriptive` or `auto`.
- **Starter word:** add `{ word, alternatives, note }` to `DICTIONARY` in `js/data/dictionary.js`. For organization-specific words, use the Organization settings instead.

## Important note about the STE specification

This app is a training aid. It is not affiliated with or endorsed by ASD. ASD-STE100 is a trademark of ASD.

The starter word list is a small illustrative subset written for training. It is **not** the official STE dictionary. Get the official specification free of charge from [asd-ste100.org](https://www.asd-ste100.org), and check words against the current issue. For lead writers, think about formal STE training from a qualified trainer.
