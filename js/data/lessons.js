// Training modules. Each module summarizes one area of ASD-STE100 or of
// general technical-writing practice, in the trainer's own words.
// The section numbers refer to the writing rules part of the ASD-STE100
// specification. Always use the official specification as the reference.

export const MODULES = [
  {
    id: "intro",
    title: "What is Simplified Technical English?",
    section: "Introduction",
    minutes: 5,
    summary:
      "ASD-STE100 is a controlled language for technical documentation. It limits grammar and vocabulary so that every reader, including non-native speakers, gets one clear meaning.",
    body: [
      "Simplified Technical English (STE) started in the aerospace industry in the 1980s. Today the ASD Simplified Technical English Maintenance Group (STEMG) maintains it as the specification ASD-STE100. Many industries use it: defense, energy, automotive, medical devices, rail, and software.",
      "The specification has two parts: a set of writing rules and a dictionary. The dictionary lists approved words, each with one approved meaning and one part of speech. It also lists unapproved words, with approved alternatives.",
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
        explain: "Do not use a noun as a verb if the dictionary does not permit it.",
        bad: "Torque the bolt.  (correct only if your organization approved \"torque\" as a technical verb)",
        good: "Tighten the bolt to a torque of 25 N·m.",
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
        explain: "\"Ensure\", \"verify\" and \"ascertain\" are not STE words. \"Make sure\" is the approved form.",
      },
      {
        q: "Which word is the best STE replacement for \"commence\"?",
        options: ["start", "initiate", "launch", "activate"],
        answer: 0,
        explain: "Use the short, common word: start.",
      },
      {
        q: "Which spelling does STE use?",
        options: ["American English", "British English", "Either, if consistent", "The writer's local spelling"],
        answer: 0,
        explain: "STE uses American English spelling.",
      },
    ],
  },
  {
    id: "noun-clusters",
    title: "Noun clusters",
    section: "Section 2",
    minutes: 5,
    summary: "Do not use more than three nouns in a noun cluster. Break long clusters with prepositions or make a hyphenated technical name.",
    body: [
      "A noun cluster is a group of nouns (sometimes with adjectives) that together name one thing, for example \"engine oil pressure\". Long clusters are difficult to understand and to translate, because the reader cannot see which word modifies which.",
      "If a technical name has more than three words, you can use hyphens to show which words go together, or you can write the cluster with prepositions.",
    ],
    rules: [
      {
        rule: "Maximum three nouns",
        explain: "Divide long noun clusters.",
        bad: "Read the engine oil pressure indicator scale.",
        good: "Read the scale on the indicator for engine oil pressure.",
      },
      {
        rule: "Use hyphens to show relations",
        explain: "Hyphens show which words make one unit in a technical name.",
        bad: "the main landing gear door actuator",
        good: "the actuator of the main-landing-gear door",
      },
    ],
    quiz: [
      {
        q: "Which is the best STE version of \"flight control system hydraulic pressure monitoring unit\"?",
        options: [
          "the unit that monitors the hydraulic pressure in the flight control system",
          "the flight control system hydraulic pressure monitoring unit",
          "the FCS HP monitor",
          "the monitoring unit hydraulic pressure flight control",
        ],
        answer: 0,
        explain: "Break the cluster with prepositions and a clause so that each relation is clear. Do not invent abbreviations.",
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
      "STE permits a small set of verb forms: the infinitive, the imperative (for commands), the simple present, the simple past, the future, and the past participle (only as an adjective or with \"is/are\" in descriptive text, where necessary).",
      "Do not use the progressive (-ing) forms, such as \"is operating\". Do not use the perfect tenses, such as \"has opened\" or \"had removed\".",
      "Use the active voice in procedures. Use the active voice as much as possible in descriptive text. Use the passive voice in descriptive text only when you do not know who or what does the action.",
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
        good: "When the light comes on, release the switch.",
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
      "Do not leave out articles (a, an, the), verbs or other words to make a sentence shorter. Telegraphic text is difficult for non-native readers and for translators.",
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
      "Use numbered steps for sequences. Put the steps in the order that the reader does them.",
    ],
    rules: [
      {
        rule: "Maximum 20 words",
        explain: "Divide long instructions.",
        bad: "Prior to removing the access panel located on the left side of the unit, make sure that the main power switch has been set to the OFF position.",
        good: "Set the main power switch to OFF. Then remove the access panel on the left side of the unit.",
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
    summary: "Start a warning or caution with a clear command. Then give the risk. Notes give information only.",
    body: [
      "A WARNING tells the reader about a risk of injury or death. A CAUTION tells the reader about a risk of damage to equipment. A NOTE gives information that is useful but not a command.",
      "Start a warning or a caution with a simple, clear command. Then, if necessary, give an explanation of the risk.",
      "Put the warning or caution immediately before the step that it applies to.",
      "Do not put commands in notes. Do not use warnings or cautions for information that is not about safety.",
      "Your organization can use a standard (for example ANSI Z535 or ISO 3864) for the format and signal words. STE controls the language inside the message.",
    ],
    rules: [
      {
        rule: "Command first, then the risk",
        explain: "The reader must know immediately what to do.",
        bad: "WARNING: High voltage is present in the cabinet, which can cause serious injury.",
        good: "WARNING: Disconnect the power before you open the cabinet. The cabinet has high voltage that can kill you.",
      },
      {
        rule: "No commands in notes",
        explain: "Readers often skip notes.",
        bad: "NOTE: You must discard the seal after removal.",
        good: "Discard the seal.\nNOTE: A new seal is in the repair kit.",
      },
    ],
    quiz: [
      {
        q: "What must the first part of a warning be?",
        options: ["A clear command", "A description of the hazard", "The word DANGER", "A reference to the safety manual"],
        answer: 0,
        explain: "Start with a command, then explain the risk.",
      },
      {
        q: "Which type of notice is for a risk of damage to equipment?",
        options: ["CAUTION", "WARNING", "NOTE", "DANGER"],
        answer: 0,
        explain: "WARNING = risk to persons. CAUTION = risk to equipment. NOTE = information.",
      },
    ],
  },
  {
    id: "punctuation",
    title: "Punctuation and word counts",
    section: "Section 8",
    minutes: 5,
    summary: "Use simple punctuation. Do not use semicolons. Know how to count words.",
    body: [
      "Use the full stop (period), comma, colon, hyphen, parentheses and quotation marks as in standard English. Do not use semicolons.",
      "Use parentheses only for specific purposes, such as references to figures or to identify an item on an illustration. Do not use parentheses for extra explanations inside a sentence.",
      "Word count: a number and its unit (10 mm) count as one word. A hyphenated word counts as one word. Each word in a technical name counts as a word.",
    ],
    rules: [
      {
        rule: "No semicolons",
        explain: "Write two sentences.",
        bad: "Close the valve; the pressure decreases.",
        good: "Close the valve. The pressure decreases.",
      },
      {
        rule: "No contractions",
        explain: "Write the full form.",
        bad: "Don't touch the terminals.",
        good: "Do not touch the terminals.",
      },
    ],
    quiz: [
      {
        q: "How many words does \"Tighten the nut to 25 N·m.\" contain in an STE word count?",
        options: ["5", "6", "4", "7"],
        answer: 0,
        explain: "Tighten / the / nut / to / 25 N·m = 5. The number with its unit counts as one word.",
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
      "2. Get the specification. Download the current issue of ASD-STE100 from the ASD STEMG website. Make sure that all writers use the same issue.",
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
        good: "fuel line (one approved name, listed in the glossary)",
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
