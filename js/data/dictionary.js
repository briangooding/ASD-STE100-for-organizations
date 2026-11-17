// Starter word list: common words and phrases that STE writers avoid, with
// plain alternatives in the spirit of ASD-STE100.
//
// IMPORTANT: This is an illustrative training subset, not the official
// ASD-STE100 dictionary. The official specification (with the full
// dictionary of approved and unapproved words) is available free of charge
// from ASD at https://www.asd-ste100.org. Organizations should confirm each
// entry against their copy of the current Issue and extend this list in
// Organization settings.
//
// Fields:
//   word         The word or phrase to flag (lower case). Matching also
//                catches simple inflections (-s, -ed, -ing) for single words.
//   alternatives Suggested replacements.
//   note         Short explanation or example.

export const DICTIONARY = [
  { word: "utilize", alternatives: ["use"], note: "Use the short, common word." },
  { word: "utilise", alternatives: ["use"], note: "Use the short, common word. STE uses American spelling." },
  { word: "commence", alternatives: ["start", "begin"], note: "START the engine. (Not: Commence engine start.)" },
  { word: "terminate", alternatives: ["stop", "end"], note: "STOP the pump." },
  { word: "initiate", alternatives: ["start"], note: "START the test." },
  { word: "prior to", alternatives: ["before"], note: "Before you remove the panel, ..." },
  { word: "subsequent to", alternatives: ["after"], note: "After you install the cover, ..." },
  { word: "subsequently", alternatives: ["then", "after this"], note: "Use a short connecting word." },
  { word: "in order to", alternatives: ["to"], note: "Remove the cover to get access to the valve." },
  { word: "obtain", alternatives: ["get"], note: "Get a sample of the fluid." },
  { word: "ensure", alternatives: ["make sure"], note: "Make sure that the switch is OFF." },
  { word: "verify", alternatives: ["make sure", "examine"], note: "Make sure that the light comes on." },
  { word: "perform", alternatives: ["do"], note: "Do the leak test." },
  { word: "accomplish", alternatives: ["do"], note: "Do the procedure that follows." },
  { word: "locate", alternatives: ["find"], note: "Find the drain plug." },
  { word: "inspect", alternatives: ["examine"], note: "Examine the seal for cracks." },
  { word: "inform", alternatives: ["tell"], note: "Tell the supervisor." },
  { word: "notify", alternatives: ["tell"], note: "Tell the operator." },
  { word: "advise", alternatives: ["tell"], note: "Tell the crew." },
  { word: "indicate", alternatives: ["show"], note: "The gauge shows the pressure." },
  { word: "rotate", alternatives: ["turn"], note: "Turn the knob clockwise." },
  { word: "depress", alternatives: ["push", "press"], note: "Push the TEST button." },
  { word: "assist", alternatives: ["help"], note: "Use the short, common word." },
  { word: "assistance", alternatives: ["help"], note: "Use the short, common word." },
  { word: "facilitate", alternatives: ["help", "make easy"], note: "Say what the action does." },
  { word: "remain", alternatives: ["stay"], note: "Stay clear of the propeller." },
  { word: "retain", alternatives: ["keep"], note: "Keep the bolts for installation." },
  { word: "proceed", alternatives: ["continue", "go"], note: "Continue with step 5." },
  { word: "exceed", alternatives: ["be more than"], note: "The pressure must not be more than 200 kPa." },
  { word: "minimize", alternatives: ["decrease", "make as small as possible"], note: "Say the result clearly." },
  { word: "maximize", alternatives: ["increase", "make as large as possible"], note: "Say the result clearly." },
  { word: "necessitate", alternatives: ["make necessary"], note: "Use a simple verb construction." },
  { word: "require", alternatives: ["must", "be necessary", "need"], note: "You must have two persons for this task." },
  { word: "requirement", alternatives: ["what is necessary"], note: "Say who must do what." },
  { word: "additional", alternatives: ["more", "other"], note: "Install more clamps." },
  { word: "numerous", alternatives: ["many"], note: "Use the short, common word." },
  { word: "sufficient", alternatives: ["enough"], note: "Use the short, common word." },
  { word: "adequate", alternatives: ["enough", "correct"], note: "Give a measurable value where possible." },
  { word: "approximately", alternatives: ["about"], note: "Give the tolerance if you can (10 ±1 mm)." },
  { word: "due to", alternatives: ["because of"], note: "Because of the high temperature, ..." },
  { word: "malfunction", alternatives: ["failure", "defect", "does not operate correctly"], note: "Say what happens." },
  { word: "contact", alternatives: ["touch", "speak to"], note: "Do not touch the hot surface." },
  { word: "purchase", alternatives: ["buy"], note: "Use the short, common word." },
  { word: "demonstrate", alternatives: ["show"], note: "Use the short, common word." },
  { word: "endeavor", alternatives: ["try"], note: "Use the short, common word." },
  { word: "attempt", alternatives: ["try"], note: "Try again after 10 seconds." },
  { word: "commencement", alternatives: ["start"], note: "Use the short, common word." },
  { word: "completion", alternatives: ["end", "when ... is complete"], note: "When the test is complete, ..." },
  { word: "modification", alternatives: ["change"], note: "Use the short, common word." },
  { word: "modify", alternatives: ["change"], note: "Use the short, common word." },
  { word: "eliminate", alternatives: ["remove", "prevent"], note: "Say exactly what happens." },
  { word: "implement", alternatives: ["do", "apply", "use"], note: "Say exactly what the reader does." },
  { word: "however", alternatives: ["but"], note: "Use a short connecting word." },
  { word: "therefore", alternatives: ["thus", "as a result"], note: "Use a clear connecting phrase." },
  { word: "whilst", alternatives: ["while"], note: "STE uses American English." },
  { word: "amongst", alternatives: ["among"], note: "STE uses American English." },
  { word: "it is recommended that", alternatives: ["(give the instruction directly)"], note: "Write a clear command: Do this." },
  { word: "please", alternatives: ["(omit)"], note: "Give the instruction directly." },
  { word: "simply", alternatives: ["(omit)"], note: "Filler word. It adds no technical information." },
  { word: "just", alternatives: ["(omit)", "only"], note: "Filler word, or use 'only' if you mean 'only'." },
  { word: "basically", alternatives: ["(omit)"], note: "Filler word." },
  { word: "very", alternatives: ["(give a value)"], note: "Give a measurable value instead of an intensifier." },
  { word: "etc", alternatives: ["(give the full list)"], note: "Tell the reader all the items." },
  { word: "and/or", alternatives: ["or", "and", "(write two sentences)"], note: "Say exactly what you mean." },
  { word: "via", alternatives: ["through", "with"], note: "Use plain English." },
  { word: "i.e.", alternatives: ["that is"], note: "Avoid Latin abbreviations." },
  { word: "e.g.", alternatives: ["for example"], note: "Avoid Latin abbreviations." },
];

// Words that are often ambiguous in instructions. They are not
// "unapproved" by themselves in every context, but writers should review them.
export const AMBIGUOUS_MODALS = [
  { word: "should", note: "Ambiguous. If the action is mandatory, use 'must' or an imperative. If optional, say 'you can'." },
  { word: "may", note: "Ambiguous: permission or possibility? Use 'can' for possibility, or give the condition." },
  { word: "might", note: "Ambiguous. Use 'can' or state the condition." },
  { word: "could", note: "Ambiguous. Use 'can' or state the condition." },
  { word: "would", note: "Use the simple present or future tense." },
];
