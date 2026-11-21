// Level 1: the "Sole Mate" signup page.
// This is the single source of truth for the bugs in this level.
// The game engine (next iteration) reads this file to check player reports,
// so adding a new level later means adding a file like this one.
//
// A report matches a bug when:
//   1. the chosen category equals `category`, AND
//   2. the description contains at least one of `keywords` (case-insensitive).

export const level1 = {
  id: "level-1",
  title: "Sole Mate signup",
  bugs: [
    {
      id: "visual-button-typo",
      difficulty: "easy", // green
      category: "Visual",
      points: 10,
      keywords: ["sing up", "typo", "misspell", "spelling", "spelt", "button label", "button text"],
    },
    {
      id: "validation-email-no-at",
      difficulty: "easy", // green
      category: "Validation",
      points: 10,
      keywords: ["@", "at sign", "at symbol", "email", "e-mail"],
    },
    {
      id: "edge-password-special-char",
      difficulty: "medium", // orange
      category: "Edge case",
      points: 20,
      keywords: ["special", "symbol", "character", "ampersand", "&", "rejects", "invalid"],
    },
    {
      id: "logic-confirm-password-mismatch",
      difficulty: "medium", // orange
      category: "Logic",
      points: 20,
      keywords: ["confirm", "match", "mismatch", "different", "does not match", "doesn't match"],
    },
    {
      id: "behavior-double-submit",
      difficulty: "hard", // red
      category: "Behavior",
      points: 40,
      keywords: ["double", "twice", "duplicate", "two accounts", "multiple", "double-click", "double click"],
    },
  ],
};
