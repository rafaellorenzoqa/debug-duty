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
//   - any other category          -> half points
//
// Teaching content shown after a report (both when the type is right and when it is wrong):
//   typeExplanation - why THIS bug belongs to its category
//   lesson          - a testing technique the player can reuse on any page

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
        "The button reads 'Sing Up' instead of 'Sign Up'. Nothing is broken: clicking it still works, it just reads wrong. A problem with how the page looks or reads, and not with how it behaves, is a Visual bug.",
      lesson:
        "Read every label, button and heading slowly, and compare them with the other text on the page (the tagline spells the button label correctly). Typos on a main call to action also hurt trust, and they break automated tests that find the button by its text.",
    },
    {
      id: "validation-email-format",
      title: "Email field does not check the format",
      difficulty: "easy", // green
      category: "Validation",
      points: 10,
      match: [
        ["email", "e-mail", "@", "at sign", "at symbol", "address"],
        [
          "@", "at sign", "at symbol", "accept", "allow", "valid", "without", "missing",
          "malformed", "format", "mask", "pattern", "space", "domain", "anything", "any text",
          "not check", "no check", "regex",
        ],
      ],
      typeExplanation:
        "The page states what a valid email looks like (text@domain.ext, like a@b.com), but the field accepts input that breaks that format: no @, two @, spaces, no domain. A field that accepts or rejects input against its stated rules is a Validation bug.",
      lesson:
        "Do not stop at one bad value. Try one valid value, then several invalid ones that each break a DIFFERENT rule: no @, two @, a space, no domain, no dot in the domain. A field that rejects one kind of bad input can still accept another. This is called equivalence partitioning: group inputs into classes and test one from each.",
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
        "Most listed special characters work and exactly one, the ampersand, does not. The feature works for normal input and breaks only for one unusual value. That pattern, fine almost everywhere and broken at one extreme or rare value, is an Edge case.",
      lesson:
        "When the rules give a list of allowed values, treat it as a checklist and try EVERY item, not just a sample. Also test at the limits: 7 characters (too short) and 8 (the minimum). Bugs love rare values and boundaries.",
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
        "The field only checks that something was typed. The real rule, that both passwords must be identical, is never applied. The inputs are fine and the screen looks fine: the rule behind them is missing. A missing or wrong rule is a Logic bug.",
      lesson:
        "Whenever the page promises that two things must be equal, test the negative: make them different and check the app stops you. Then try the nearly-equal case: a different capital letter, or a trailing space. A positive test alone (both the same) will never find this bug.",
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
          "multiple", "more than one", "several", "extra account", "again ",
        ],
      ],
      typeExplanation:
        "Every field works. The problem only appears in how the page reacts when you click twice quickly. Bugs that depend on timing or on repeated actions, and not on a single value, are Behavior bugs.",
      lesson:
        "Actions that create something (an account, an order, a payment) must be tried repeatedly and quickly: double click, press Enter twice, click and refresh. Then check the data (here the 'Accounts created' counter), not just the message on screen: the message can look fine while two records were created.",
    },
  ],
};
