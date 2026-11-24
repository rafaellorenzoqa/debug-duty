// Level 1: the "Sole Mate" signup page.
// This is the single source of truth for the bugs in this level.
// The game engine reads this file to check player reports,
// so adding a new level later means adding a file like this one.
//
// A report matches a bug when the description contains at least one of `keywords`
// (case-insensitive). Then the category decides the points:
//   - category equals `category`  -> full `points`
//   - any other category          -> half points, plus `typeExplanation` so the
//                                    player learns why this is the real type.

export const level1 = {
  id: "level-1",
  title: "Sole Mate signup",
  bugs: [
    {
      id: "visual-button-typo",
      title: "Misspelled submit button",
      difficulty: "easy", // green
      category: "Visual",
      points: 10,
      keywords: ["sing up", "typo", "misspell", "spelling", "spelt", "button label", "button text"],
      typeExplanation:
        "A misspelled label breaks nothing: the button still works, it just looks wrong. Bugs in how the page looks or reads are Visual.",
    },
    {
      id: "validation-email-no-at",
      title: "Email accepted without an @",
      difficulty: "easy", // green
      category: "Validation",
      points: 10,
      keywords: ["@", "at sign", "at symbol", "email", "e-mail"],
      typeExplanation:
        "The Email field states what a valid address is, and the form accepts input that breaks that rule. A field letting through input it should reject is Validation.",
    },
    {
      id: "edge-password-special-char",
      title: "Password rejects a valid special character",
      difficulty: "medium", // orange
      category: "Edge case",
      points: 20,
      keywords: ["special", "symbol", "character", "ampersand", "&", "rejects", "invalid"],
      typeExplanation:
        "Most special characters work and one listed as allowed does not. It only fails for one unusual value, which is the signature of an Edge case.",
    },
    {
      id: "logic-confirm-password-mismatch",
      title: "Confirm password does not have to match",
      difficulty: "medium", // orange
      category: "Logic",
      points: 20,
      keywords: ["confirm", "match", "mismatch", "different", "does not match", "doesn't match"],
      typeExplanation:
        "The field is checked for being filled in, but the actual rule (the two passwords must be equal) is never applied. A missing or wrong rule is Logic.",
    },
    {
      id: "behavior-double-submit",
      title: "Double click creates a duplicate account",
      difficulty: "hard", // red
      category: "Behavior",
      points: 40,
      keywords: ["double", "twice", "duplicate", "two accounts", "multiple", "double-click", "double click"],
      typeExplanation:
        "Each field is fine on its own. The problem only shows up in how the page reacts when you click twice quickly. Problems with timing and repeated actions are Behavior.",
    },
  ],
};
