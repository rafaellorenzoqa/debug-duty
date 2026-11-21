// Scores live in the browser (localStorage). No accounts and no database yet.
// Only call these from the browser (event handlers), never during server rendering.

const KEY_PREFIX = "debugDuty.bestResult.";

// Saves the result if it beats the stored best. Returns the best result.
export function saveBestResult(levelId, result) {
  const key = KEY_PREFIX + levelId;
  let best = result;
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored && stored.score >= result.score) {
      best = stored;
    }
    localStorage.setItem(key, JSON.stringify(best));
  } catch {
    // localStorage can be unavailable (private mode, blocked). The game still works.
  }
  return best;
}
