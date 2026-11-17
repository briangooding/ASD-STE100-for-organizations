export const TIPS = [
  "Write one instruction in each step. If the reader must do two things, write two steps.",
  "Put the condition first: \"If the light is red, stop the pump.\"",
  "Write \"make sure that\". Do not write \"ensure\" or \"verify\".",
  "A procedural sentence has a maximum of 20 words. A descriptive sentence has a maximum of 25 words.",
  "Start a safety instruction with a clear command or condition. Then tell the reader the risk.",
  "Do not put instructions in notes. Many readers do not read notes.",
  "Always use the same technical name for the same part.",
  "Write multi-word nouns of no more than three words.",
  "Do not use -ing verb forms. \"The pump is running\" → \"The pump operates\".",
  "Use the active voice: \"Replace the filter\", not \"The filter is to be replaced\".",
  "Keep the articles: write \"Remove the cover\", not \"Remove cover\".",
  "Give measurable values: \"Tighten to 25 N·m\", not \"Tighten firmly\".",
  "Do not use semicolons. Write two sentences.",
  "Use vertical lists for tools, materials, and conditions.",
  "Write the title as a task: \"Replace the fuel filter\".",
  "Do not use idioms. They do not translate.",
  "\"Should\", \"may\" and \"would\" are not approved. Use \"must\" or \"can\".",
  "Do not use phrasal verbs: write \"Stop the pump\", not \"Turn off the pump\".",
  "\"Approximately\" is approved. \"About\" is approved only with the meaning \"concerned with\".",
  "Text in parentheses counts as one word.",
  "\"Need\" is not approved. Write \"It is necessary to ...\" or give a command.",
  "\"Press\" is not approved. Write \"Push the button\".",
];

export const REFERENCE = [
  {
    title: "Words (Section 1)",
    items: [
      "Use approved words only as the specified part of speech and with their approved meaning (Rules 1.2, 1.3).",
      "Use only the approved forms of verbs and adjectives (Rule 1.4).",
      "Use technical nouns and technical verbs that your company or industry approves (Rules 1.5 to 1.13).",
      "Do not use different technical nouns for the same item (Rule 1.11).",
      "Use American English spelling (Rule 1.14).",
    ],
  },
  {
    title: "Multi-word nouns (Section 2)",
    items: [
      "No more than three words in a multi-word noun (Rule 2.1).",
      "Official technical noun with more than three words: write it in full, then use a shorter form or hyphens (Rule 2.2).",
    ],
  },
  {
    title: "Verbs (Section 3)",
    items: [
      "Only these forms: infinitive, imperative, simple present, simple past, simple future, past participle as an adjective (Rules 3.2, 3.3).",
      "No complex constructions with auxiliary verbs, so no perfect or progressive tenses (Rule 3.4).",
      "The -ing form only as a technical noun or in a technical noun (Rule 3.5).",
      "Active voice. Passive voice only in descriptive writing, when necessary (Rule 3.6).",
      "Use a verb for an action, not a noun: \"examine\", not \"do an examination\" (Rule 3.7).",
    ],
  },
  {
    title: "Sentences (Section 4)",
    items: [
      "Short and clear sentences (Rule 4.1).",
      "Do not omit words. No contractions (Rule 4.2).",
      "Use vertical lists for complex text (Rule 4.3).",
      "Use connecting words between sentences (Rule 4.4).",
      "Use articles (the, a, an) or this/these when applicable (Rule 4.5).",
    ],
  },
  {
    title: "Procedural writing (Section 5)",
    items: [
      "Maximum 20 words in each sentence (Rule 5.1).",
      "One instruction in each sentence, unless the actions occur at the same time (Rule 5.2).",
      "Imperative (command) form (Rule 5.3).",
      "Condition first, then the instruction (Rule 5.4).",
      "Notes give information, not instructions (Rule 5.5).",
    ],
  },
  {
    title: "Descriptive writing (Section 6)",
    items: [
      "Give information gradually (Rule 6.1).",
      "Use key words and key phrases for a logical structure (Rule 6.2).",
      "Maximum 25 words in each sentence (Rule 6.3).",
      "One topic in each paragraph (Rules 6.4, 6.5).",
      "Maximum six sentences in each paragraph (Rule 6.6).",
    ],
  },
  {
    title: "Safety instructions (Section 7)",
    items: [
      "Identify the level of risk with a word (WARNING, CAUTION) or symbol (Rule 7.1).",
      "Start with a clear and accurate command or condition (Rule 7.2).",
      "Give the risk or the possible result (Rule 7.3).",
    ],
  },
  {
    title: "Punctuation and word count (Section 8)",
    items: [
      "All standard punctuation, but not the semicolon (Rule 8.1).",
      "Hyphens connect words that are directly related (Rule 8.2).",
      "Parentheses for references, identifiers, abbreviations, explanations and alternatives (Rule 8.3).",
      "One word: text in parentheses, a number with its unit, an abbreviation, quoted text, a label, a proper noun, a hyphenated word (Rules 8.5 to 8.7).",
    ],
  },
  {
    title: "Writing practices (Section 9)",
    items: [
      "If a word-for-word change does not work, use a different sentence construction (Rule 9.1).",
      "Use each approved word correctly (Rule 9.2).",
      "No phrasal verbs, such as \"turn off\" or \"carry out\" (Rule 9.3).",
      "Use a consistent style (Rule 9.4).",
    ],
  },
  {
    title: "Technical writing practices",
    items: [
      "Know the audience and the place where they use the document.",
      "Separate concept, task and reference information.",
      "Write task titles that start with a verb.",
      "Give prerequisites (tools, materials, safety) before the steps.",
      "Use illustrations and tables. Label callouts with the same technical names as the text.",
      "Write for translation: no idioms, no humor, no text fragments in variables.",
      "Make content accessible: real headings, alt text, good contrast.",
      "Review three ways: STE peer review, technical review, validation with a real user.",
    ],
  },
];

export const SAMPLE_TEXT = `Replacement of the hydraulic filter

1. Prior to commencing work, ensure that the system has been depressurized and the electrical power is disconnected.
2. Remove the filter bowl and discard the old element; it shouldn't be reused.
3. Install the new filter element and the bowl and then tighten the bowl to the specified torque.
4. The system pressure indicator gauge reading must be checked by the technician.
5. Replace the O-ring if it is damaged.

WARNING: Hydraulic fluid is toxic and can cause skin irritation.

NOTE: You must dispose of the used element in accordance with local regulations.

The hydraulic filter assembly, which is located downstream of the main pump, is removing contaminants from the fluid that is circulating in the system, thereby protecting the actuators and valves from premature wear, etc.`;
