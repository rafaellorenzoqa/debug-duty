// Report matching: decides which bugs a player's description is about.
// Pure functions, no imports, so it can be tested with plain Node (no browser, no bundler).
//
// How it works (plain text matching, no AI, same result every time):
//   1. The player's text and every word in the bug's word lists are "normalised" the same way.
//   2. A bug matches when the text contains at least one word from EVERY group in `bug.match`.
//   3. Words are matched as WHOLE WORDS, checked from their first letter:
//        "accept" matches "accepts" and "accepted", but not "unacceptable"
//        "sing up" does NOT match inside "missing upload"
//      Phrases ("not the same") must appear as consecutive words.
//      Symbols such as @ and & are not words, so they match anywhere ("a@b.com" contains "@").
//   4. Matches are ranked by how many different listed words the text contains.
//
// Limit: this compares letters, it does not understand meaning. It can be strict and
// predictable, but "the email field accepts a valid address" and "the email field accepts
// any text" look alike to it unless the word lists tell them apart.

// Makes text comparable: lowercase, curly quotes straight, apostrophes removed
// ("doesn't" -> "doesnt"), punctuation turned into spaces, repeated spaces collapsed.
// Letters, digits, @ and & are kept.
export function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[‘’‛]/g, "'") // curly single quotes -> straight
    .replace(/[“”‟]/g, '"') // curly double quotes -> straight
    .replace(/'/g, "") // apostrophes removed
    .replace(/[^\p{L}\p{N}@&]+/gu, " ") // everything else that is not a letter, digit, @ or & -> space
    .replace(/\s+/g, " ")
    .trim();
}

// True when `word` (already normalised) appears in `text` (already normalised).
function containsWord(text, word) {
  if (!word) return false;
  // A pure symbol such as "@" or "@@" is not a word: it may appear anywhere.
  if (!/[\p{L}\p{N}]/u.test(word)) return text.includes(word);
  // Otherwise it must start at the beginning of a word (the padding spaces handle the edges).
  return ` ${text} `.includes(` ${word}`);
}

// Which of the bug's listed words does the text contain? Returns them (each word once).
function matchedWords(bug, text) {
  const found = new Set();
  const everyGroupHit = bug.match.every((group) => {
    let hit = false;
    for (const raw of group) {
      const word = normalize(raw);
      if (containsWord(text, word)) {
        hit = true;
        found.add(word);
      }
    }
    return hit;
  });
  return everyGroupHit ? found : null;
}

// Returns the bugs the text describes, best match first, as [{ bug, score }].
// score = how many different listed words the text contains. Ties keep the level's order.
export function rankBugs(bugs, rawText) {
  const text = normalize(rawText);
  return bugs
    .map((bug) => ({ bug, words: matchedWords(bug, text) }))
    .filter((entry) => entry.words !== null)
    .map((entry) => ({ bug: entry.bug, score: entry.words.size }))
    .sort((a, b) => b.score - a.score); // Array.sort is stable: ties keep their order
}
