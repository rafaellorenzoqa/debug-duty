// The level registry: every level of the game, in play order.
// Code that needs "all levels" (the matching test, the start screen, the Next level link)
// reads this list, so adding a level means adding one line here.
// Relative imports with .js on purpose: Node's test runner reads this file too.

import { level1 } from "./level1.js";
import { level2 } from "./level2.js";

export const LEVELS = [level1, level2];
