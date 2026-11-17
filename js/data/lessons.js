// Training modules. Each module summarizes one area of ASD-STE100 or of
// general technical-writing practice, in the trainer's own words.
// Section and rule numbers refer to ASD-STE100 Issue 9 (2025-01-15). The
// text is a summary in our own words. Always use the official
// specification as the reference.

export const MODULES = [
  {
    id: "intro",
    title: "What is Simplified Technical English?",
    section: "Introduction",
    minutes: 5,
    summary:
      "ASD-STE100 is a controlled language for technical documentation. It limits grammar and vocabulary so that every reader, including non-native speakers, gets one clear meaning.",
    body: [
      "Simplified Technical English (STE) started in the aerospace industry in the 1980s. Today the ASD Simplified Technical English Maintenance Group (STEMG) maintains it as the specification ASD-STE100. The current issue is Issue 9 (January 2025). It is free of charge from the STEMG website. Many industries use STE: aerospace, defense, energy, automotive, medical devices, rail, and software.",
      "The specification has two parts: the writing rules (Part 1) and the dictionary (Part 2). The dictionary has approximately 900 approved words. Each approved word has one approved meaning and one part of speech. The dictionary also lists many words that are not approved, with approved alternatives.",
      "STE also lets you use technical names (for example, names of parts and tools) and technical verbs (for example, \"drill\" or \"ream\") that are specific to your industry. Your organization must control these words in a glossary.",
    ],
    benefits: [
      "Fewer misunderstandings and fewer errors during tasks",
      "Easier reading for non-native speakers of English",
      "Lower translation cost and better translation quality",
      "Consistent documents from many different writers",
      "Better results with machine translation and search",
    ],
    rules: [
      {
        rule: "One word, one meaning",
        explain: "In STE, an approved word has only one meaning. For example, \"close\" means \"to move to a closed position\", not \"near\".",
        bad: "Install the bracket close to the pump.",
        good: "Install the bracket near the pump.",
      },
      {
        rule: "One meaning, one word",
        explain: "Use the same word for the same thing every time. Do not change words to make the text more interesting.",
        bad: "Remove the lid. Clean the cover. Install the cap.",
        good: "Remove the cover. Clean the cover. Install the cover.",
      },
    ],
    quiz: [
      {
        q: "What are the two main parts of ASD-STE100?",
        options: ["Writing rules and a dictionary", "A grammar book and a style guide", "A template set and a glossary", "A translation memory and rules"],
        answer: 0,
        explain: "The specification has writing rules and a dictionary of approved and unapproved words.",
      },
      {
        q: "Which statement about technical names is correct?",
        options: [
          "You can use technical names that are not in the dictionary, if they are specific to your field",
          "You can only use words from the dictionary",
          "Technical names are not permitted in STE",
          "Each writer can choose a different name for the same part",
        ],
        answer: 0,
        explain: "STE permits technical names (such as part names) that are not in the dictionary. Control them in a glossary so that all writers use the same name.",
      },
    ],
  },
  {
    id: "words",
    title: "Words",
    section: "Section 1",
    minutes: 8,
    summary: "Use approved words with their approved meaning and part of speech. Use technical names and technical verbs consistently.",
    body: [
      "Look up each word in the STE dictionary. If a word is not approved, the dictionary usually gives an approved alternative.",
      "An approved word is approved only as the part of speech that the dictionary shows. For example, \"test\" can be a noun and a verb, but many words are approved only as a noun or only as a verb.",
      "Use the shortest and most common words. Use American English spelling (for example, \"color\", not \"colour\").",
      "Some words are not approved, although they look simple: \"should\", \"may\", \"would\", \"need\", \"every\", \"main\", \"old\", \"never\" and \"press\". Some long words are approved: \"approximately\", \"sufficient\" and \"subsequently\". Always look in the dictionary. Do not guess.",
    ],
    rules: [
      {
        rule: "Use approved words",
        explain: "Replace unapproved words with approved alternatives.",
        bad: "Utilize the torque wrench to ensure correct tightness.",
        good: "Use the torque wrench to make sure that the torque is correct.",
      },
      {
        rule: "Use the approved meaning",
        explain: "Do not give an approved word a different meaning.",
        bad: "Follow the procedure to fire the system. (\"fire\" as \"start\")",
        good: "Do the procedure to start the system.",
      },
      {
        rule: "Use the approved part of speech",
        explain: "Use an approved word only as the part of speech that the dictionary gives (Rule 1.2). For example, OIL is a technical noun, but \"oil\" is not approved as a verb.",
        bad: "Oil the hinges.",
        good: "Lubricate the hinges.",
      },
      {
        rule: "Use technical names consistently",
        explain: "Give each part one name. Use the name from the illustrated parts list or your glossary.",
        bad: "Remove the retaining clip. Discard the retainer.",
        good: "Remove the retaining clip. Discard the retaining clip.",
      },
    ],
    quiz: [
      {
        q: "Which sentence uses STE-style words?",
        options: ["Make sure that the valve is closed.", "Ensure the valve is closed.", "Verify valve closure.", "Ascertain that the valve is shut."],
        answer: 0,
        explain: "\"Ensure\", \"verify\" and \"ascertain\" are not approved. The dictionary gives MAKE SURE as the alternative for all three.",
      },
      {
        q: "Which word is the best STE replacement for \"commence\"?",
        options: ["start", "initiate", "launch", "activate"],
        answer: 0,
        explain: "Use the short, common word: start.",
      },
      {
        q: "Which of these words is approved in STE?",
        options: ["approximately", "should", "every", "need"],
        answer: 0,
        explain: "APPROXIMATELY is approved. \"Should\" (use MUST), \"every\" (use ALL or EACH) and \"need\" (use NECESSARY) are not approved.",
      },
      {
        q: "Which spelling does STE use?",
        options: ["American English", "British English", "Either, if consistent", "The writer's local spelling"],
        answer: 0,
        explain: "Rule 1.14: use American English spelling, unless other official directives tell you differently.",
      },
    ],
  },
  {
    id: "noun-clusters",
    title: "Multi-word nouns",
    section: "Section 2",
    minutes: 5,
    summary: "Write multi-word nouns of no more than three words. When an official technical noun is longer, write it in full, then use a shorter form or hyphens.",
    body: [
      "A multi-word noun (in older issues, a \"noun cluster\") is a group of words that together name one thing, for example \"engine oil pressure\". Long multi-word nouns are difficult to understand and to translate, because the reader cannot see which word modifies which.",
      "Rule 2.1: write multi-word nouns of no more than three words. If the long noun is not an official name, divide it with prepositions or a clause.",
      "Rule 2.2: some long names are official technical nouns (for example, from an engineering drawing or a parts catalog). You cannot change these names. Write the name in full the first time. Then use a shorter form (with an explanation), or use hyphens between words that make one unit.",
    ],
    rules: [
      {
        rule: "Maximum three words (Rule 2.1)",
        explain: "Divide long multi-word nouns that are not official names.",
        bad: "Read the engine oil pressure indicator scale.",
        good: "Read the scale on the indicator for engine oil pressure.",
      },
      {
        rule: "Long technical nouns (Rule 2.2)",
        explain: "Write the official name in full one time. Then give a shorter form and use it in the remaining text.",
        bad: "Disconnect the cabin pressure controller test harness connector. Then clean the cabin pressure controller test harness connector.",
        good: "Disconnect the cabin pressure controller test harness connector (referred to as the \"harness connector\"). Then clean the harness connector.",
        allow: ["noun-cluster"],
      },
    ],
    quiz: [
      {
        q: "The parts catalog name of a part has six words. What does Rule 2.2 tell you to do?",
        options: [
          "Write it in full, then use a shorter form or hyphens",
          "Remove words until the name has three words",
          "Make your own abbreviation and do not write the full name",
          "Use a different name in each procedure",
        ],
        answer: 0,
        explain: "You cannot change an official technical noun. Write it in full the first time, then make it clear with a shorter form or with hyphens.",
      },
      {
        q: "Which is the best STE version of \"Read the engine oil pressure indicator scale\" (not an official name)?",
        options: [
          "Read the scale on the indicator for engine oil pressure.",
          "Read the engine oil pressure indicator scale.",
          "Read the EOP indicator scale.",
          "Read the scale engine oil pressure indicator.",
        ],
        answer: 0,
        explain: "Divide the multi-word noun with prepositions so that each relation is clear. Do not make new abbreviations.",
      },
    ],
  },
  {
    id: "verbs",
    title: "Verbs",
    section: "Section 3",
    minutes: 8,
    summary: "Use only the approved verb forms. Use the active voice. Do not use -ing verb forms.",
    body: [
      "Rule 3.2 permits only these verb forms: the infinitive, the imperative (command), the simple present, the simple past, the simple future, and the past participle used as an adjective (Rule 3.3).",
      "Do not use auxiliary verbs to make complex verb constructions (Rule 3.4). Thus, do not use perfect tenses (\"has opened\", \"had removed\") or progressive forms (\"is operating\").",
      "Use the -ing form of a verb only as a technical noun or as a modifier in a technical noun (Rule 3.5), for example \"landing gear\". Only a few approved words have an -ing form: lighting, opening, routing, servicing, mating, missing, remaining, something and during.",
      "Rule 3.6: use the active voice. In descriptive writing, you can use the passive voice only when it is necessary, for example when you do not know who or what does the action.",
      "Use a verb to show an action. Do not hide the action in a noun (\"do an inspection of\" → \"examine\").",
    ],
    rules: [
      {
        rule: "Use the active voice",
        explain: "Tell the reader who does the action.",
        bad: "The filter must be replaced by the operator.",
        good: "Replace the filter.",
      },
      {
        rule: "No -ing verb forms",
        explain: "Use a simple tense or a clause.",
        bad: "The pump is operating continuously while pressurizing the system.",
        good: "The pump operates continuously when it pressurizes the system.",
      },
      {
        rule: "No perfect tenses",
        explain: "Use the simple past or simple present.",
        bad: "When the light has come on, release the switch.",
        good: "When the light is on, release the switch.",
      },
      {
        rule: "Use verbs for actions",
        explain: "Do not turn the action into a noun.",
        bad: "Perform an adjustment of the cable tension.",
        good: "Adjust the cable tension.",
      },
    ],
    quiz: [
      {
        q: "Which sentence follows the STE verb rules?",
        options: ["The valve opens when the pressure increases.", "The valve is opening as pressure is increasing.", "The valve has opened when pressure has increased.", "Valve opening occurs at increasing pressure."],
        answer: 0,
        explain: "The simple present tense in the active voice is correct.",
      },
      {
        q: "When can you use the passive voice?",
        options: [
          "Only in descriptive text, when the doer is unknown or not important",
          "In procedures, to sound more formal",
          "Never, under any condition",
          "Whenever the sentence is short",
        ],
        answer: 0,
        explain: "Procedures must use the active voice. Descriptive text can use the passive voice only where necessary.",
      },
    ],
  },
  {
    id: "sentences",
    title: "Sentences",
    section: "Section 4",
    minutes: 5,
    summary: "Write about one topic in each sentence. Do not omit words to make sentences shorter. Use vertical lists for complex text.",
    body: [
      "Each sentence must give one idea. If a sentence contains many ideas, divide it.",
      "Do not omit words or use contractions to make your sentences shorter (Rule 4.2). When applicable, use an article (the, a, an) or a demonstrative adjective (this, these) before a noun (Rule 4.5). Telegraphic text is difficult for non-native readers and for translators.",
      "Use connecting words (such as \"thus\", \"but\", \"then\") to join sentences logically. Use vertical lists to show items, conditions or sequences.",
    ],
    rules: [
      {
        rule: "Do not omit words",
        explain: "Keep articles and verbs.",
        bad: "Remove cover, discard gasket.",
        good: "Remove the cover. Discard the gasket.",
      },
      {
        rule: "No contractions (Rule 4.2)",
        explain: "Write the full form.",
        bad: "Don't touch the terminals.",
        good: "Do not touch the terminals.",
      },
      {
        rule: "Use vertical lists",
        explain: "A list is easier to read than a long sentence.",
        bad: "You need a torque wrench, a 10 mm socket, an extension bar, safety glasses and gloves.",
        good: "Get these tools:\n- A torque wrench\n- A 10 mm socket\n- An extension bar\n- Safety glasses\n- Gloves",
      },
    ],
    quiz: [
      {
        q: "\"Disconnect connector, remove bracket.\" What is the problem?",
        options: ["Articles are omitted and there are two instructions", "The sentence is too long", "It uses passive voice", "It contains a noun cluster"],
        answer: 0,
        explain: "Write: \"Disconnect the connector. Remove the bracket.\"",
      },
    ],
  },
  {
    id: "procedures",
    title: "Procedural writing",
    section: "Section 5",
    minutes: 10,
    summary: "Write short instructions (maximum 20 words), one instruction per sentence, in the imperative. Put conditions first.",
    body: [
      "Procedural sentences tell the reader what to do. Write them as commands (imperative): \"Remove the cover.\"",
      "Do not use more than 20 words in a procedural sentence.",
      "Write only one instruction in each sentence, unless the reader must do two or more actions at the same time (\"Hold the lever and turn the knob.\").",
      "If the reader must do the instruction only under a condition, write the condition first, then the instruction: \"If the seal is damaged, replace it.\"",
      "Write notes only to give information, not instructions (Rule 5.5). In a note, the maximum sentence length is 25 words, because a note gives information.",
      "Use numbered steps for sequences. Put the steps in the order that the reader does them.",
    ],
    rules: [
      {
        rule: "Maximum 20 words",
        explain: "Divide long instructions.",
        bad: "Prior to removing the access panel located on the left side of the unit, make sure that the main power switch has been set to the OFF position.",
        good: "Set the power switch to OFF. Then remove the access panel on the left side of the unit.",
      },
      {
        rule: "One instruction per sentence",
        explain: "Each step is one action.",
        bad: "Remove the four bolts and lift the cover and put it on a clean surface.",
        good: "1. Remove the four bolts.\n2. Lift the cover.\n3. Put the cover on a clean surface.",
      },
      {
        rule: "Condition first",
        explain: "The reader must know the condition before the action.",
        bad: "Replace the O-ring if it is cut.",
        good: "If the O-ring is cut, replace it.",
      },
      {
        rule: "Imperative form",
        explain: "Tell the reader directly what to do.",
        bad: "The technician should then lubricate the shaft.",
        good: "Lubricate the shaft.",
      },
      {
        rule: "Notes give information only (Rule 5.5)",
        explain: "Readers often skip notes. Put each instruction in a step.",
        bad: "NOTE: You must discard the seal after removal.",
        good: "Discard the seal.\nNOTE: A new seal is in the repair kit.",
      },
    ],
    quiz: [
      {
        q: "What is the maximum length of a procedural sentence in STE?",
        options: ["20 words", "15 words", "25 words", "30 words"],
        answer: 0,
        explain: "Procedural sentences: 20 words maximum. Descriptive sentences: 25 words maximum.",
      },
      {
        q: "Which instruction is correct?",
        options: ["If the light is on, push the RESET button.", "Push the RESET button if the light is on.", "The RESET button should be pushed if the light is on.", "Pushing of the RESET button is necessary with the light on."],
        answer: 0,
        explain: "Put the condition first and use the imperative.",
      },
      {
        q: "When can you put two instructions in one sentence?",
        options: ["When the reader does the actions at the same time", "When both instructions are short", "When the second instruction is optional", "Never"],
        answer: 0,
        explain: "Example: \"Hold the handle and turn the valve.\"",
      },
    ],
  },
  {
    id: "descriptive",
    title: "Descriptive writing",
    section: "Section 6",
    minutes: 7,
    summary: "Keep descriptive sentences to 25 words or fewer and paragraphs to six sentences or fewer. Start each paragraph with the topic sentence.",
    body: [
      "Descriptive text gives information: how a system operates, what a component does, why a condition is important.",
      "Do not use more than 25 words in a descriptive sentence. Do not use more than six sentences in a paragraph.",
      "Write about one topic in each paragraph. Put the most important information first (a topic sentence), then the details.",
      "Give information gradually. Give the general information before the detailed information.",
    ],
    rules: [
      {
        rule: "Topic sentence first",
        explain: "Tell the reader what the paragraph is about.",
        bad: "When the temperature is more than 90 °C, a sensor sends a signal and a relay opens, which stops the fan motor, which is part of the cooling system.",
        good: "The cooling system has a thermal protection function. When the temperature is more than 90 °C, a sensor sends a signal to a relay. The relay opens and the fan motor stops.",
      },
      {
        rule: "Maximum 25 words",
        explain: "Divide long descriptions.",
        bad: "The control unit, which is installed in the forward compartment and is supplied with 28 V DC from the essential bus, monitors the position of all doors and gives a warning to the crew.",
        good: "The control unit is in the forward compartment. The essential bus supplies 28 V DC to the unit. The unit monitors the position of all doors and gives a warning to the crew.",
      },
    ],
    quiz: [
      {
        q: "What is the maximum number of sentences in an STE descriptive paragraph?",
        options: ["6", "4", "8", "10"],
        answer: 0,
        explain: "Six sentences maximum, one topic per paragraph.",
      },
    ],
  },
  {
    id: "safety",
    title: "Safety instructions",
    section: "Section 7",
    minutes: 7,
    summary: "Identify the level of risk. Start with a clear command or condition. Then give the risk or the possible result.",
    body: [
      "Rule 7.1: use an applicable word (for example \"warning\" or \"caution\") or a symbol to show the level of risk immediately.",
      "Rule 7.2: start a safety instruction with a clear and accurate command or condition.",
      "Rule 7.3: give an explanation to show the risk or the possible result.",
      "STE does not define the signal words or the format. Use the specification of your industry or organization (for example S1000D, ATA iSpec 2200, ANSI Z535 or ISO 3864). In most of these, a WARNING is about a risk of injury or death, and a CAUTION is about a risk of damage to equipment.",
      "Do not put instructions in notes (Rule 5.5). Do not use warnings or cautions for information that is not about safety.",
    ],
    rules: [
      {
        rule: "Command first, then the risk",
        explain: "The reader must know immediately what to do.",
        bad: "WARNING: High voltage is present in the cabinet, which can cause serious injury.",
        good: "WARNING: Disconnect the power before you open the cabinet. The cabinet has high voltage that can kill you.",
      },
      {
        rule: "A condition can come first (Rule 7.2)",
        explain: "If the reader must know a condition, start with it. Then give the command and the risk.",
        bad: "WARNING: Hot oil can burn your skin if you open the cap when the engine is hot.",
        good: "WARNING: If the engine is hot, do not open the cap. Hot oil can cause burns.",
      },
    ],
    quiz: [
      {
        q: "How must a safety instruction start?",
        options: ["With a clear command or condition", "With a description of the hazard", "With the word DANGER", "With a reference to the safety manual"],
        answer: 0,
        explain: "Rule 7.2: start with a clear and accurate command or condition. Then explain the risk (Rule 7.3).",
      },
      {
        q: "In most technical publication specifications, which notice is for a risk of damage to equipment?",
        options: ["CAUTION", "WARNING", "NOTE", "DANGER"],
        answer: 0,
        explain: "STE does not define the signal words, but most specifications use WARNING for a risk to persons and CAUTION for a risk to equipment.",
      },
    ],
  },
  {
    id: "punctuation",
    title: "Punctuation and word count",
    section: "Section 8",
    minutes: 5,
    summary: "Use standard punctuation, but not the semicolon. Know how to count words.",
    body: [
      "Rule 8.1: you can use all standard English punctuation marks, but not the semicolon (;).",
      "Rule 8.2: use hyphens to connect words that are directly related.",
      "Rule 8.3: you can use parentheses for references to illustrations or text, to identify items, to identify work steps, for abbreviations, for singular and plural forms together, to explain words or a part of a sentence, and to include an alternative.",
      "Word count (Rules 8.4 to 8.7): text in parentheses counts as one word. These also count as one word: a number, a number with its unit (10 mm), an abbreviation, an alphanumeric identifier, quoted text, a title, heading, placard or label, and a proper noun. A hyphenated word counts as one word. In a vertical list, a colon has the same effect as a period.",
    ],
    rules: [
      {
        rule: "No semicolons",
        explain: "Write two sentences.",
        bad: "Close the valve; the pressure decreases.",
        good: "Close the valve. The pressure decreases.",
      },
      {
        rule: "Hyphens connect related words",
        explain: "A hyphen shows that the words make one unit. A hyphenated word counts as one word.",
        bad: "Install a two way valve.",
        good: "Install a two-way valve.",
      },
    ],
    quiz: [
      {
        q: "How many words does \"Tighten the nut to 25 N·m.\" contain in an STE word count?",
        options: ["5", "6", "4", "7"],
        answer: 0,
        explain: "Tighten / the / nut / to / 25 N·m = 5. The number with its unit counts as one word.",
      },
      {
        q: "How do you count text in parentheses?",
        options: ["As one word", "Each word separately", "It does not count", "As two words"],
        answer: 0,
        explain: "Rule 8.5: when you put text in parentheses, it counts as one word in that sentence.",
      },
    ],
  },
  {
    id: "writing-practices",
    title: "Writing practices",
    section: "Section 9",
    minutes: 6,
    summary: "Change the sentence construction when a word-for-word change does not work. Do not make phrasal verbs. Use a consistent style.",
    body: [
      "Rule 9.1: sometimes you cannot replace a word with its approved alternative and keep a good sentence. Then write the sentence with a different construction.",
      "Rule 9.2: use each approved word correctly, with its approved meaning and part of speech.",
      "Rule 9.3: when you use two words together, do not make phrasal verbs. A phrasal verb is a verb with a preposition or adverb that has a different meaning, for example \"turn off\", \"switch off\" or \"carry out\". These are difficult for non-native readers.",
      "Rule 9.4: when you select terminology or wording, always use a consistent style.",
    ],
    rules: [
      {
        rule: "No phrasal verbs (Rule 9.3)",
        explain: "Use one approved verb.",
        bad: "Turn off the pump and carry out the test.",
        good: "Stop the pump. Then do the test.",
      },
      {
        rule: "Change the construction (Rule 9.1)",
        explain: "A direct word replacement can give a bad sentence. Write the sentence again.",
        bad: "There is a requirement for two persons for this task.",
        good: "Two persons are necessary for this task.",
      },
      {
        rule: "Consistent style (Rule 9.4)",
        explain: "Use the same words and the same structure for the same thing.",
        bad: "Push the TEST button. Then press the RESET pushbutton.",
        good: "Push the TEST button. Then push the RESET button.",
      },
    ],
    quiz: [
      {
        q: "Which instruction does not use a phrasal verb?",
        options: ["Stop the engine.", "Shut down the engine.", "Turn off the engine.", "Switch off the engine."],
        answer: 0,
        explain: "\"Shut down\", \"turn off\" and \"switch off\" are phrasal verbs, and they are not approved. Use STOP.",
      },
    ],
  },
  {
    id: "best-practices",
    title: "Technical writing best practices",
    section: "Beyond STE",
    minutes: 10,
    summary: "STE controls the language. Good documentation also needs a clear purpose, a known audience, a good structure, and a review process.",
    body: [
      "Know your audience. Write down who uses the document, what they already know, where they use it (a hangar, a cleanroom, an office), and what language they speak.",
      "Write task-based topics. Organize content by what the reader must do, not by how the product is built. Separate concept (what it is), task (how to do it) and reference (data, tables) information.",
      "Use a consistent structure: a title that tells the result (\"Replace the fuel filter\"), prerequisites (tools, materials, safety, conditions), steps, and the result or test.",
      "Use illustrations and tables. One good illustration can replace many sentences. Give each callout a short technical name that is also in the text.",
      "Write for translation and reuse. Use short sentences, consistent terms, no idioms, no humor, and no culture-specific references. Do not build sentences from fragments in variables.",
      "Make content accessible. Use real headings, alternative text for images, sufficient color contrast, and do not use color as the only way to give information.",
      "Review and test. Do a peer review for STE, a technical review by a subject-matter expert, and a usability test (validation) where a real user does the procedure.",
    ],
    rules: [
      {
        rule: "Action-oriented titles",
        explain: "The title tells the reader the result of the task.",
        bad: "Fuel filter information",
        good: "Replace the fuel filter",
      },
      {
        rule: "Prerequisites before steps",
        explain: "Tell the reader what they need before they start.",
        bad: "3. Get a 13 mm wrench and remove the four bolts.",
        good: "Tools: 13 mm wrench.\n1. Remove the four bolts.",
      },
      {
        rule: "No idioms",
        explain: "Idioms do not translate.",
        bad: "Give the bolt a once-over before you install it.",
        good: "Examine the bolt for damage before you install it.",
      },
    ],
    quiz: [
      {
        q: "Which is the best title for a task topic?",
        options: ["Replace the hydraulic filter", "Hydraulic filter", "About hydraulic filters", "Filter replacement procedure information"],
        answer: 0,
        explain: "A task title starts with a verb and tells the result.",
      },
      {
        q: "Which review confirms that a real user can do the procedure?",
        options: ["Validation (usability test)", "STE peer review", "Spell check", "Translation review"],
        answer: 0,
        explain: "Validation means that a real user does the task with the document.",
      },
    ],
  },
  {
    id: "rollout",
    title: "Implementing STE in your organization",
    section: "Organization",
    minutes: 8,
    summary: "A successful STE program has a scope, a controlled glossary, trained writers, tools, and measurable goals.",
    body: [
      "1. Define the scope. Decide which documents must use STE (for example maintenance manuals, work instructions, safety data). Start with one product line.",
      "2. Get the specification. Download the current issue of ASD-STE100 (Issue 9, January 2025) free of charge from the STEMG website, asd-ste100.org. Make sure that all writers use the same issue.",
      "3. Make a controlled glossary of technical names and technical verbs. Give each part one name. Record unapproved synonyms and the approved term to use instead. Load the glossary into this app in Organization settings.",
      "4. Train writers and reviewers. Use this app for self-study and practice. Consider official STE training from a qualified trainer for lead writers.",
      "5. Use tools. Use a checker in the writing workflow. A checker finds many problems, but a trained person must make the final decisions.",
      "6. Review. Add an STE check to the document review checklist. Use a sample of documents for regular audits.",
      "7. Measure. Track the number of issues per page, translation cost and time, user errors, and support questions. Report the results to management.",
    ],
    rules: [
      {
        rule: "Control your technical names",
        explain: "Inconsistent names are a major cause of errors and translation cost.",
        bad: "hose / pipe / line / tube (for the same part)",
        good: "fuel line (the one approved name in the glossary)",
      },
    ],
    quiz: [
      {
        q: "What is a good first step in an STE program?",
        options: ["Define the scope and start with one product line", "Rewrite all documents at the same time", "Buy a translation tool", "Ask each writer to make a personal glossary"],
        answer: 0,
        explain: "A pilot with a clear scope gives results and lessons before you expand.",
      },
      {
        q: "Can a software checker replace a trained STE reviewer?",
        options: ["No. It finds many problems, but a person must make the final decision", "Yes, always", "Yes, for procedures only", "Only if it has the full dictionary"],
        answer: 0,
        explain: "Checkers cannot fully understand meaning, context, or correct technical content.",
      },
    ],
  },
];
