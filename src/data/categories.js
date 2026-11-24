// The bug categories a player can choose from in the report form.
export const CATEGORIES = ["Visual", "Validation", "Edge case", "Logic", "Behavior"];

// What each category means, in plain words. Shown to the player when they find a
// real bug but pick the wrong category, so new QAs learn the difference.
export const CATEGORY_DEFINITIONS = {
  Visual: "something looks wrong on screen: a typo, a misaligned or broken element, wrong colours.",
  Validation: "a field accepts input it should reject, or rejects input it should accept, against its stated rules.",
  "Edge case": "everything works for normal input, but fails at an unusual or boundary value, like a rarely used character or a minimum or maximum length.",
  Logic: "the rule itself is wrong or missing: the app does not compare, calculate or decide the way the requirement says.",
  Behavior: "something goes wrong in how the app reacts over time or to how you use it, like double clicks, timing, or repeated actions.",
};

export const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
