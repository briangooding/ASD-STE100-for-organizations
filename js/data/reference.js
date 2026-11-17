export const TIPS = [
  "Write one instruction in each step. If the reader must do two things, write two steps.",
  "Put the condition first: \"If the light is red, stop the pump.\"",
  "Use \"make sure\" instead of \"ensure\" or \"verify\".",
  "A procedural sentence has a maximum of 20 words. A descriptive sentence has a maximum of 25 words.",
  "Start a WARNING or CAUTION with a command. Then tell the reader the risk.",
  "Do not put commands in notes. Many readers do not read notes.",
  "Use the same technical name for the same part every time.",
  "Do not use more than three nouns in a noun cluster.",
  "Do not use -ing verb forms. \"The pump is running\" → \"The pump operates\".",
  "Use the active voice: \"Replace the filter\", not \"The filter is to be replaced\".",
  "Keep the articles: write \"Remove the cover\", not \"Remove cover\".",
  "Give measurable values: \"Tighten to 25 N·m\", not \"Tighten firmly\".",
  "Do not use semicolons. Write two sentences.",
  "Use vertical lists for tools, materials, and conditions.",
  "Write the title as a task: \"Replace the fuel filter\".",
  "Do not use idioms. They do not translate.",
];

export const REFERENCE = [
  {
    title: "Words (Section 1)",
    items: [
      "Use approved words with their approved meaning only.",
      "Use each word only as the approved part of speech.",
      "Use technical names and technical verbs from your glossary.",
      "Use the same word for the same thing.",
      "Use American English spelling.",
    ],
  },
  {
    title: "Noun clusters (Section 2)",
    items: ["Maximum three nouns in a cluster.", "Use prepositions to break long clusters.", "Use hyphens to show which words go together."],
  },
  {
    title: "Verbs (Section 3)",
    items: [
      "Approved forms: infinitive, imperative, simple present, simple past, future, past participle (as an adjective).",
      "No -ing verb forms (progressive). No perfect tenses.",
      "Active voice in procedures.",
      "Active voice as much as possible in descriptions.",
      "Use a verb for an action, not a noun (\"examine\", not \"do an examination\").",
    ],
  },
  {
    title: "Sentences (Section 4)",
    items: ["One topic per sentence.", "Do not omit articles or verbs.", "Use vertical lists for complex text.", "Use connecting words between sentences."],
  },
  {
    title: "Procedures (Section 5)",
    items: [
      "Maximum 20 words per sentence.",
      "Imperative (command) form.",
      "One instruction per sentence, unless the actions are simultaneous.",
      "Condition first, then the instruction.",
      "Numbered steps in the correct sequence.",
    ],
  },
  {
    title: "Descriptions (Section 6)",
    items: ["Maximum 25 words per sentence.", "Maximum six sentences per paragraph.", "One topic per paragraph.", "Topic sentence first. General information before details."],
  },
  {
    title: "Safety instructions (Section 7)",
    items: [
      "WARNING: risk of injury. CAUTION: risk of damage.",
      "Start with a clear command, then give the risk.",
      "Put the notice immediately before the step.",
      "A NOTE gives information only, never a command.",
    ],
  },
  {
    title: "Punctuation (Section 8)",
    items: ["No semicolons.", "No contractions.", "A number and its unit count as one word.", "A hyphenated word counts as one word."],
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
