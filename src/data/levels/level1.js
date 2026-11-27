// Level 1: the "Sole Mate" signup page.
// This is the single source of truth for the bugs in this level.
// The game engine reads this file to check player reports,
// so adding a new level later means adding a file like this one.
//
// A report matches a bug when the description is somewhat accurate: `match` is a list
// of word groups, and the description must contain at least one word from EVERY group.
// Typically one group says WHAT it is about (the email field) and another says WHAT IS
// WRONG (it accepts bad input), so "email" alone is not enough.
// How words are compared is explained in src/lib/matching.js: whole words from their first
// letter ("accept" matches "accepts"), phrases as consecutive words, case and punctuation
// ignored. So write words in lowercase without apostrophes ("doesnt match"), and prefer
// specific phrases ("not the same") over broad words ("same") that also appear in praise.
// The phrase fixture tests/matching/phrases.js is the test for these lists: add the
// phrase there first, then adjust the words until `npm run test:unit` passes.
// Several bugs can match one report; the one with the most matched words wins.
// Then the category decides the points:
//   - category equals `category`  -> full `points`
//   - any other category          -> half points
//
// Teaching content shown after a report (both when the type is right and when it is wrong):
//   typeExplanation - why THIS bug belongs to its category
//   lesson          - a testing technique the player can reuse on any page
//
// Navigation (read by the start screen and the results screen):
//   path    - the level's URL
//   name    - the product's name, shown on level cards and the Next level button
//   summary - one line describing the product
//   next    - the URL of the next level; leave it out on the last level

export const level1 = {
  id: "level-1",
  title: "Sole Mate signup",
  path: "/level-1",
  name: "Sole Mate",
  summary: "A sneaker store's signup page.",
  next: "/level-2",
  bugs: [
    {
      id: "visual-button-typo",
      title: "Misspelled submit button",
      difficulty: "easy", // green
      category: "Visual",
      points: 10,
      match: [
        // what it is about
        ["button", "sing up", "sign up", "submit", "label", "cta"],
        // what is wrong
        ["typo", "misspell", "spelling", "spelt", "sing up", "wrong letter", "wrong word", "swapped", "mistake"],
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
        // what it is about
        ["email", "e mail", "@", "at sign", "at symbol"],
        // what the field does wrong (accepts it, or does not check)
        [
          "accept", "allow", "let through", "lets through", "without", "ignor",
          "not follow", "doesnt follow", "does not follow",
          "no validation", "not validated", "missing validation", "validation missing",
          "validation is missing", "doesnt validate", "does not validate",
          "not check", "no check", "doesnt check", "does not check",
        ],
        // what kind of bad input gets through (or that nothing is checked)
        [
          "invalid", "not valid", "malformed", "wrong format", "bad format", "any format", "no format",
          "no at", "no domain", "two @", "2 @", "multiple @", "double @", "@@", "more than one @",
          "space", "anything", "any text", "random text", "mask", "without",
          "no validation", "not validated", "missing validation", "validation missing",
          "validation is missing", "doesnt validate", "does not validate",
          "not check", "no check", "doesnt check", "does not check",
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
        // what it is about
        ["password", "&", "ampersand"],
        // which kind of input
        ["special", "symbol", "character", "&", "ampersand"],
        // what goes wrong
        [
          "reject", "invalid", "not valid", "not accept", "not allow", "doesnt accept", "doesnt allow",
          "does not accept", "does not allow", "not supported", "refuse", "fails", "blocked", "denied",
          "cant", "cannot", "wont", "not work",
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
        // what it is about
        ["confirm", "retype", "repeat", "second password", "two passwords", "both passwords"],
        // what is wrong. Phrases such as "not the same" are used on purpose: the bare words
        // "same" and "match" also appear in praise ("the same size", "matches the style").
        [
          "mismatch", "not match", "doesnt match", "does not match", "dont match", "do not match",
          "no match", "not matching", "not compared", "never compared", "isnt compared",
          "not checked", "not check", "no check", "not the same", "isnt the same", "not equal",
          "different password", "different value", "different text", "another password",
          "ignor", "anything", "any value", "any text",
          // "different", "differs" and "not identical" only when tied to the password: on their
          // own they also appear in praise ("the confirm button is different", "the confirm
          // password label differs on mobile").
          "password are different", "passwords are different", "password is different",
          "differs from the password", "differs from password", "differ from the password",
          "differ from password", "passwords differ",
          "passwords are not identical", "password is not identical", "not identical to the password",
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
        // what the player does
        ["click", "submit", "press", "tap", "sign up", "signup"],
        // that it is repeated or fast, or that duplicates appear
        [
          "double", "twice", "two times", "2 times", "repeated", "rapid", "quick", "fast",
          "duplicate", "two accounts", "2 accounts", "two users", "multiple accounts",
          "more than one account", "extra account", "several accounts",
        ],
        // what gets created
        ["account", "users", "duplicate", "create", "record", "entry", "entries"],
      ],
      typeExplanation:
        "Every field works. The problem only appears in how the page reacts when you click twice quickly. Bugs that depend on timing or on repeated actions, and not on a single value, are Behavior bugs.",
      lesson:
        "Actions that create something (an account, an order, a payment) must be tried repeatedly and quickly: double click, press Enter twice, click and refresh. Then check the data (here the 'Accounts created' counter), not just the message on screen: the message can look fine while two records were created.",
    },
  ],
};
