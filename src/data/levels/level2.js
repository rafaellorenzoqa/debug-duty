// Level 2: the "1Up Bakery" cake builder.
// This is the single source of truth for the bugs in this level. It follows the same
// format as level1.js; see the comments there for how `match` word groups work.
// The phrase fixture tests/matching/phrases.js is the test for these lists.
//
// Teaching content shown after a report:
//   typeExplanation - why THIS bug belongs to its category
//   lesson          - a testing technique the player can reuse on any page

export const level2 = {
  id: "level-2",
  title: "1Up Bakery cake builder",
  path: "/level-2",
  name: "1Up Bakery",
  summary: "An online cake builder with a live price.",
  // No `next` yet: this is the last level, so the results screen shows no Next level button.
  bugs: [
    {
      id: "visual-blush-swatch",
      title: "Blush Pink swatch shows the wrong color",
      difficulty: "easy", // green
      category: "Visual",
      points: 10,
      match: [
        // what it is about
        ["swatch", "preview", "square", "colour sample", "color sample", "colour box", "color box"],
        // what is wrong (specific phrases: the bare word "yellow" is also a real colour here)
        [
          "shows yellow", "is yellow", "turns yellow", "looks yellow", "a yellow", "yellow instead",
          "wrong", "different colo", "incorrect colo", "not pink",
          "not match", "doesnt match", "does not match", "dont match", "mismatch",
        ],
      ],
      typeExplanation:
        "When you pick Blush Pink, the little color square beside the dropdown turns yellow. The price is right and the order is right: only the picture is wrong. A problem with how the page looks, and not with what it does, is a Visual bug.",
      lesson:
        "Whenever a page shows the same thing twice, as a word and as a picture (a swatch, an icon, a preview), check that the two agree. Then cycle through ALL the options, not only the default: a page that is right on load can still be wrong for the sixth item in a list.",
    },
    {
      id: "logic-fondant-25cm",
      title: "Fondant is free on the 25cm cake",
      difficulty: "medium", // orange
      category: "Logic",
      points: 20,
      match: [
        // what it is about
        ["fondant"],
        // which size
        ["25", "biggest", "largest", "big cake", "large cake"],
        // what is wrong
        [
          "same as buttercream", "same price", "free", "missing", "no extra", "no surcharge",
          "nothing", "0", "zero", "not added", "not charged", "not includ",
          "doesnt add", "does not add", "doesnt change", "does not change", "not change",
        ],
      ],
      typeExplanation:
        "The price list says Fondant adds $16 on a 25cm cake, but the total adds $0, so it costs the same as Buttercream. Every control works; the calculation behind them uses the wrong rule. A missing or wrong business rule, often a calculation, is a Logic bug.",
      lesson:
        "When a price depends on two choices, test every combination. Here that is a small table: 2 cake types by 3 sizes, so 6 totals. Fondant was right on 15cm and 20cm, and one working combination proves nothing about the others. This is called pairwise or combination testing.",
    },
    {
      id: "logic-duplicate-filling",
      title: "The same filling can be chosen twice",
      difficulty: "medium", // orange
      category: "Logic",
      points: 20,
      match: [
        // what it is about
        ["filling", "flavo", "vanilla", "chocolate", "strawberry", "lemon", "dulce", "pistachio"],
        // what is wrong: the same choice twice ("different" alone is praise, so only its negations)
        [
          "same filling", "same flavo", "same one", "twice", "duplicate", "two of the same", "identical",
          "both the same", "are the same", "can be the same", "both fillings can be", "both can be",
          "dont have to be different", "doesnt have to be different", "not have to be different",
          // A flavor named right before "in both" ("lemon curd in both"), or before "for both
          // fillings" / "for both dropdowns" ("vanilla for both fillings"). Plain "for both" or
          // "in both" is too broad: it also matches praise such as "the filling in both dropdowns
          // looks nice". A flavor plus "for both" is still too broad, because prices are
          // described that way ("vanilla cream for both sizes costs $4"), so "for both" needs
          // the word after it as well. One word of each flavor name, so short and full names
          // both work ("lemon in both", "lemon curd in both").
          // Known limit: "<flavor> in both" also matches "lemon curd in both sizes costs $6".
          // It cannot be narrowed the same way without losing "i can pick lemon curd in both",
          // which ends right after "in both".
          "vanilla in both", "cream in both", "chocolate in both", "ganache in both",
          "strawberry in both", "jam in both", "lemon in both", "curd in both",
          "dulce in both", "leche in both", "pistachio in both",
          "vanilla for both fillings", "vanilla for both dropdowns",
          "cream for both fillings", "cream for both dropdowns",
          "chocolate for both fillings", "chocolate for both dropdowns",
          "ganache for both fillings", "ganache for both dropdowns",
          "strawberry for both fillings", "strawberry for both dropdowns",
          "jam for both fillings", "jam for both dropdowns",
          "lemon for both fillings", "lemon for both dropdowns",
          "curd for both fillings", "curd for both dropdowns",
          "dulce for both fillings", "dulce for both dropdowns",
          "leche for both fillings", "leche for both dropdowns",
          "pistachio for both fillings", "pistachio for both dropdowns",
        ],
      ],
      typeExplanation:
        "The rule says two fillings must be different flavors, but the page accepts the same flavor in both dropdowns, shows no error and charges it twice. Each dropdown on its own is fine; the rule that compares the two is missing. A rule that compares or combines values, and is missing or wrong, is a Logic bug.",
      lesson:
        "For any rule that involves two fields (two passwords, a start and end date, two fillings), try the same value in both. Then try values that break the rule in the other direction. A rule you never try to break is a rule you never tested.",
    },
    {
      id: "edge-last-flavor-second-filling",
      title: "The last flavor is free as the second filling",
      difficulty: "medium", // orange
      category: "Edge case",
      points: 20,
      match: [
        // which flavor
        ["pistachio", "last flavo", "last item", "last option", "last one"],
        // where: the second dropdown only
        ["second", "2nd", "other dropdown"],
        // what is wrong
        [
          "free", "nothing", "0", "zero", "not charged", "no charge", "not added", "not includ",
          "doesnt add", "does not add", "doesnt change", "does not change", "not change", "missing",
        ],
      ],
      typeExplanation:
        "Pistachio Cream costs $9 as the first filling, but adds $0 as the second. Every other flavor is priced correctly in both dropdowns: only the last item in one list fails. Something that works for normal values and breaks for one item at the end of a list is an Edge case.",
      lesson:
        "Always try the first and the last item of every list: code that loops through a list often stops one item too early (an 'off-by-one' error). And test the same list in every place it appears. Two dropdowns with the same flavors can each have their own code behind them.",
    },
    {
      id: "behavior-stale-second-filling",
      title: "A removed second filling stays in the total",
      difficulty: "hard", // red
      category: "Behavior",
      points: 30,
      match: [
        // the sequence: going back from 2 fillings to 1
        [
          "back to", "go back", "going back", "went back", "switch back", "switching back",
          "from two", "from 2", "to one", "to 1", "one filling", "1 filling", "remov",
        ],
        // what is wrong: the old value stays ("resets" alone is correct behaviour)
        [
          "still", "stays", "stay", "kept", "keeps", "keep", "remain", "left over", "leftover", "stale",
          "not go down", "doesnt go down", "not remove", "doesnt remove", "not removed",
          "not reset", "doesnt reset", "is wrong", "wrong total", "not updat", "doesnt updat",
        ],
        // where it shows: the price
        ["total", "price", "charge", "cost", "paid", "pay"],
      ],
      typeExplanation:
        "Choose a second filling, then switch back to 1 filling: the dropdown resets and is disabled, so it looks right, but its price stays in the total. No single choice is wrong; the bug only appears after going forward and then back. A bug that depends on the order of your actions is a Behavior bug.",
      lesson:
        "Go forward, then back: pick something, undo it, and check that everything returns to how it was. Look at the calculated values (the total), not only at the controls, because a control can look reset while the data behind it is not. A value left over from an earlier step is called stale state.",
    },
  ],
};
