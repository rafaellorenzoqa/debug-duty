// The level registry: every level of the game, in play order.
// Code that needs "all levels" (the matching test, the start screen, the Next level link)
// reads this list, so adding a level means adding one line here.
// Relative imports with .js on purpose: Node's test runner reads this file too.

import { level1 } from "./level1.js";
import { level2 } from "./level2.js";

export const LEVELS = [level1, level2];

// The level whose page is at `path` (e.g. "/level-2"), or undefined.
export function findLevelByPath(path) {
  return LEVELS.find((level) => level.path === path);
}

// How many bugs of each difficulty, in words: "1 easy, 3 medium, 1 hard".
export function difficultyMix(level) {
  return ["easy", "medium", "hard"]
    .map((difficulty) => [difficulty, level.bugs.filter((bug) => bug.difficulty === difficulty).length])
    .filter(([, count]) => count > 0)
    .map(([difficulty, count]) => `${count} ${difficulty}`)
    .join(", ");
}
