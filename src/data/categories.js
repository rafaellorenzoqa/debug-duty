// The bug categories a player can choose from in the report form.
export const CATEGORIES = ["Visual", "Validation", "Edge case", "Logic", "Behavior"];

// Teaching content for each category. It is shown in two places:
//   - in the report form, as soon as the player picks a category (before they submit);
//   - in the feedback after a report, so the player learns the difference.
// The examples are deliberately from OTHER apps, so they do not give away this level's bugs.
//   definition  - what the category means
//   askYourself - the question a tester asks to decide if a bug belongs here
//   example     - a bug of this kind in a different app
//   tellApart   - how to tell it from the categories it is most often confused with
export const CATEGORY_INFO = {
  Visual: {
    definition:
      "Something looks or reads wrong on screen, but the feature itself still works: typos, misaligned or overlapping elements, wrong colors, cut-off text, broken images.",
    askYourself: "Does it look or read wrong, even though it does its job?",
    example: "On a phone, a product photo covers the price, so you cannot read it.",
    tellApart:
      "If the app behaves wrongly (a wrong result, a rejected input), it is not Visual. Visual bugs are about presentation only.",
  },
  Validation: {
    definition:
      "A field accepts input that its rules say it must reject, or rejects input its rules say it must accept. Validation is about checking what the user types against a stated format or rule.",
    askYourself: "Is a field letting through (or blocking) something that its written rules say otherwise?",
    example: "An 'Age' field accepts -5 and the word 'abc', although the rules say a whole number from 0 to 120.",
    tellApart:
      "Validation is about ONE field and its format. If the rule involves comparing fields or calculating something, think Logic. If the field obeys its rules for almost everything and fails only on one rare value or limit, think Edge case.",
  },
  "Edge case": {
    definition:
      "Everything works for normal input, but it fails at an unusual, extreme or boundary value: the minimum or maximum length, an empty value, zero, or a rarely used character.",
    askYourself: "Does it work for typical values but break for one unusual or extreme one?",
    example: "A comment box works up to 499 characters and crashes at exactly 500, the stated limit.",
    tellApart:
      "Edge cases hide behind working behaviour: most values are fine, one special value is not. If it fails for ordinary input too, it is more likely Validation or Logic.",
  },
  Logic: {
    definition:
      "A business rule is missing, ignored or implemented wrongly, so the app decides or calculates the wrong thing, even though the screen looks fine and each field is filled in.",
    askYourself: "Is a rule or calculation not being applied the way the requirement says?",
    example: "A '20% off' code takes 10% off, or a cart total forgets to add the shipping cost.",
    tellApart:
      "Logic is about the rule itself, often involving more than one value (comparing, adding, deciding). Checking the format of one field is Validation instead.",
  },
  Behavior: {
    definition:
      "The problem is in how the app reacts to the way you use it over time: repeated or fast actions, order of steps, timing, refreshing, going back, or waiting.",
    askYourself: "Does it only go wrong because of HOW or WHEN I interact (repeating, rushing, changing the order)?",
    example: "Pressing the browser Back button after paying shows the checkout again and lets you pay twice.",
    tellApart:
      "If you can reproduce it with one calm, normal action, it is probably not Behavior. Behavior bugs need an interaction pattern: twice, quickly, out of order, or after a wait.",
  },
};

export const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
