// Pure game logic: no React, no browser APIs. Easy to read and easy to unit test.
// Relative imports with .js on purpose (not the "@/" shortcut): Node's test runner
// reads this file too (tests/game/game.test.js), and only Next.js understands "@/".

import { CATEGORY_INFO } from "../data/categories.js";
import { rankBugs } from "./matching.js";

// Points for a bug reported under the wrong category: half, rounded down.
export function halfPoints(bug) {
  return Math.floor(bug.points / 2);
}

// Checks one player report against the level's bug list.
//
// Matching rule (kept simple on purpose):
//   1. A bug is a candidate when the description is somewhat accurate: it must contain
//      at least one word from EVERY word group in the bug's `match` list, as whole words
//      (see src/lib/matching.js). "email" alone is not enough; "email accepts no @" is.
//      Candidates are ranked by how many listed words the description contains.
//   2. If a candidate also has the chosen category, the player earns full points.
//   3. If the only candidates have a different category, the player found the bug
//      but mislabelled it: half points and an explanation of the real category.
//
// Returns { status, message, ... } where status is one of:
//   "invalid"   - the form was incomplete, nothing was checked
//   "correct"   - a new bug was found with the right category
//   "partial"   - a new bug was found but the category was wrong
//   "duplicate" - the bug matches, but was already reported
//   "wrong"     - nothing in the bug list matches
//
// "correct" and "partial" also carry teaching content for the screen:
//   bug, points, headline, pointsLabel, and `sections` ([{ label, text }]).
// Every status has a plain-text `message` as well.
export function checkReport(level, foundIds, category, description) {
  const text = (description || "").trim();

  if (!category) {
    return { status: "invalid", message: "Pick a bug category first." };
  }
  if (text.length < 3) {
    return { status: "invalid", message: "Describe the bug in a few words." };
  }

  // Best match first (see src/lib/matching.js).
  const candidates = rankBugs(level.bugs, text);

  if (candidates.length === 0) {
    return {
      status: "wrong",
      message:
        "No known bug matches that report. No points awarded. Tip: say what the bug is about AND what goes wrong, for example which field and what it does that it should not.",
    };
  }

  // Right category first: if one matches, the report is judged against those bugs only.
  const sameCategory = candidates.filter((entry) => entry.bug.category === category);
  const pool = sameCategory.length > 0 ? sameCategory : candidates;

  // Judge the BEST match only. Among equally good matches, prefer one not found yet.
  const bestScore = pool[0].score;
  const best = pool.filter((entry) => entry.score === bestScore).map((entry) => entry.bug);
  const newBug = best.find((bug) => !foundIds.includes(bug.id));
  if (!newBug) {
    return {
      status: "duplicate",
      message: "You already reported that bug. No points awarded.",
    };
  }

  const real = CATEGORY_INFO[newBug.category];
  const whyThisType = {
    label: `Why this is a ${newBug.category} bug`,
    text: newBug.typeExplanation,
  };
  const tip = { label: "Testing tip", text: newBug.lesson };

  if (newBug.category === category) {
    return {
      status: "correct",
      bug: newBug,
      points: newBug.points,
      headline: `Bug found: ${newBug.title}`,
      pointsLabel: `+${newBug.points} pts`,
      message: `Bug found: ${newBug.title}! +${newBug.points} points.`,
      sections: [
        whyThisType,
        { label: `What "${newBug.category}" means`, text: real.definition },
        tip,
      ],
    };
  }

  const points = halfPoints(newBug);
  const chosen = CATEGORY_INFO[category];
  return {
    status: "partial",
    bug: newBug,
    points,
    headline: `Real bug, wrong type: ${newBug.title}`,
    pointsLabel: `+${points} of ${newBug.points} pts`,
    message:
      `You found a real bug: ${newBug.title}! But it is not a ${category} bug, ` +
      `it is a ${newBug.category} bug. Half points: +${points}.`,
    sections: [
      {
        label: `You chose "${category}"`,
        text: `${chosen.definition} That does not describe this bug.`,
      },
      {
        label: `The correct type is "${newBug.category}"`,
        text: real.definition,
      },
      whyThisType,
      { label: "How to tell them apart", text: real.tellApart },
      tip,
    ],
  };
}

// `partialIds` are the bugs found under the wrong category: they score half.
export function calculateScore(level, foundIds, partialIds = []) {
  return level.bugs
    .filter((bug) => foundIds.includes(bug.id))
    .reduce(
      (total, bug) => total + (partialIds.includes(bug.id) ? halfPoints(bug) : bug.points),
      0,
    );
}

export function maxScore(level) {
  return level.bugs.reduce((total, bug) => total + bug.points, 0);
}
