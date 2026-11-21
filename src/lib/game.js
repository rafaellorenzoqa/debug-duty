// Pure game logic: no React, no browser APIs. Easy to read and easy to unit test.

// Checks one player report against the level's bug list.
//
// Matching rule (kept simple on purpose):
//   a bug matches when the category is the same AND the description
//   contains at least one of the bug's keywords (case-insensitive).
//
// Returns { status, message, bug? } where status is one of:
//   "invalid"   - the form was incomplete, nothing was checked
//   "correct"   - a new bug was found (`bug` is included)
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

  const matches = level.bugs.filter(
    (bug) =>
      bug.category === category &&
      bug.keywords.some((keyword) => text.includes(keyword.toLowerCase())),
  );

  if (matches.length === 0) {
    return {
      status: "wrong",
      message: "No known bug matches that report. No points awarded.",
    };
  }

  const newBug = matches.find((bug) => !foundIds.includes(bug.id));
  if (!newBug) {
    return {
      status: "duplicate",
      message: "You already reported that bug. No points awarded.",
    };
  }

  return {
    status: "correct",
    bug: newBug,
    message: `Bug found: ${newBug.title}! +${newBug.points} points.`,
  };
}

export function calculateScore(level, foundIds) {
  return level.bugs
    .filter((bug) => foundIds.includes(bug.id))
    .reduce((total, bug) => total + bug.points, 0);
}

export function maxScore(level) {
  return level.bugs.reduce((total, bug) => total + bug.points, 0);
}
