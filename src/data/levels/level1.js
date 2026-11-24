// Level 1: the "Sole Mate" signup page.
// This is the single source of truth for the bugs in this level.
// The game engine reads this file to check player reports,
// so adding a new level later means adding a file like this one.
//
// A report matches a bug when the description is somewhat accurate: `match` is a list
// of word groups, and the description must contain at least one word from EVERY group
// (case-insensitive). Typically one group says WHAT it is about (the email field) and
// another says WHAT IS WRONG (it accepts bad input), so "email" alone is not enough.
// Watch out for words that hide inside others ("sing" is inside "missing").
// Then the category decides the points:
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
      match: [
        ["button", "sing up", "sign up", "submit", "label", "cta"],
        ["typo", "misspell", "spelling", "spelt", "sing up", "incorrect", "swapped", "wrong letter"],
      ],
      typeExplanation:
        "A misspelled label breaks nothing: the button still works, it just looks wrong. Bugs in how the page looks or reads are Visual.",
    },
    {
      id: "validation-email-no-at",
      title: "Email accepted without an @",
      difficulty: "easy", // green
      category: "Validation",
      points: 10,
      match: [
        ["email", "e-mail", "@", "at sign", "at symbol", "address"],
        [
          "@", "at sign", "at symbol", "accept", "allow", "valid", "without", "missing",
          "malformed", "format", "no domain", "anything", "any text", "not check", "no check",
        ],
      ],
      typeExplanation:
        "The Email field states what a valid address is, and the form accepts input that breaks that rule. A field letting through input it should reject is Validation.",
    },
    {
      id: "edge-password-special-char",
      title: "Password rejects a valid special character",
      difficulty: "medium", // orange
      category: "Edge case",
      points: 20,
      match: [
        ["password", "&", "ampersand"],
        ["special", "symbol", "character", "char", "&", "ampersand"],
        [
          "reject", "invalid", "not accept", "not allow", "doesn't accept", "doesn't allow",
          "refuse", "fails", "blocked", "denied", "can't", "cannot", "won't", "not work",
        ],
      ],
      typeExplanation:
        "Most special characters work and one listed as allowed does not. It only fails for one unusual value, which is the signature of an Edge case.",
    },
    {
      id: "logic-confirm-password-mismatch",
      title: "Confirm password does not have to match",
      difficulty: "medium", // orange
      category: "Logic",
      points: 20,
      match: [
        ["confirm", "retype", "repeat", "second password"],
        [
          "match", "different", "same", "equal", "compare", "not checked", "not check",
          "no check", "ignored", "accept", "allow",
        ],
      ],
      typeExplanation:
        "The field is checked for being filled in, but the actual rule (the two passwords must be equal) is never applied. A missing or wrong rule is Logic.",
    },
    {
      id: "behavior-double-submit",
      title: "Double click creates a duplicate account",
      difficulty: "hard", // red
      category: "Behavior",
      points: 40,
      match: [
        ["account", "user", "signup", "sign up", "click", "submit", "button"],
        [
          "double", "twice", "duplicate", "two accounts", "2 accounts", "two users",
          "multiple", "more than one", "several", "extra account", "again",
        ],
      ],
      typeExplanation:
        "Each field is fine on its own. The problem only shows up in how the page reacts when you click twice quickly. Problems with timing and repeated actions are Behavior.",
    },
  ],
};
