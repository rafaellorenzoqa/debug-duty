// Pure game logic: no React, no browser APIs. Easy to read and easy to unit test.

import { CATEGORY_DEFINITIONS } from "@/data/categories";

// Points for a bug reported under the wrong category: half, rounded down.
export function halfPoints(bug) {
  return Math.floor(bug.points / 2);
}

// Checks one player report against the level's bug list.
//
// Matching rule (kept simple on purpose):
//   1. A bug is a candidate when the description contains at least one of its
//      keywords (case-insensitive).
//   2. If a candidate also has the chosen category, the player earns full points.
//   3. If the only candidates have a different category, the player found the bug
//      but mislabelled it: half points and an explanation of the real category.
//
// Returns { status, message, bug?, points? } where status is one of:
//   "invalid"   - the form was incomplete, nothing was checked
//   "correct"   - a new bug was found with the right category (`bug`, `points`)
//   "partial"   - a new bug was found but the category was wrong (`bug`, `points`)
//   "duplicate" - the bug matches, but was already reported
//   "wrong"     - nothing in the bug list matches
export function checkReport(level, foundIds, category, description) {
  const text = (description || "").trim().toLowerCase();

  if (!category) {
    return { status: "invalid", message: "Pick a bug category first." };
  }
  if (text.length < 3) {
    return { status: "invalid", message: "Describe the bug in a few words." };
  }

  const candidates = level.bugs.filter((bug) =>
    bug.keywords.some((keyword) => text.includes(keyword.toLowerCase())),
  );

  if (candidates.length === 0) {
    return {
      status: "wrong",
      message: "No known bug matches that report. No points awarded.",
    };
  }

  // Right category first: if one matches, the report is judged against those bugs only.
  const sameCategory = candidates.filter((bug) => bug.category === category);
  const pool = sameCategory.length > 0 ? sameCategory : candidates;

  const newBug = pool.find((bug) => !foundIds.includes(bug.id));
  if (!newBug) {
    return {
      status: "duplicate",
      message: "You already reported that bug. No points awarded.",
    };
  }

  if (newBug.category === category) {
    return {
      status: "correct",
      bug: newBug,
      points: newBug.points,
      message: `Bug found: ${newBug.title}! +${newBug.points} points.`,
    };
  }

  const points = halfPoints(newBug);
  return {
    status: "partial",
    bug: newBug,
    points,
    message:
      `You found a real bug: ${newBug.title}! But it is not a ${category} bug, ` +
      `it is a ${newBug.category} bug. ${newBug.category} means ${CATEGORY_DEFINITIONS[newBug.category]} ` +
      `${newBug.typeExplanation} Half points: +${points}.`,
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
