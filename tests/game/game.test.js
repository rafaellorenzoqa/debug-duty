// Fast unit test for the scoring rules in src/lib/game.js: no browser, no server.
// Runs with Node's built-in test runner:  npm run test:unit
//
// Rule under test: a real bug reported under the wrong category scores HALF its points,
// ROUNDED DOWN. Every bug in Levels 1 and 2 has even points, so the rounding cannot be
// seen in the game itself (or in Cypress). These tests use a tiny made-up level with
// odd point values instead. Expected values are typed by hand.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { calculateScore, checkReport, halfPoints, maxScore } from "../../src/lib/game.js";

// A made-up level: one bug worth 15 points (odd) and one worth 10 (even).
const level = {
  id: "test-level",
  bugs: [
    { id: "odd-bug", category: "Logic", points: 15, match: [["discount"], ["wrong"]], typeExplanation: "x", lesson: "y" },
    { id: "even-bug", category: "Visual", points: 10, match: [["logo"], ["blurry"]], typeExplanation: "x", lesson: "y" },
  ],
};

describe("halfPoints: half, rounded down", () => {
  it("15 points -> 7 (7.5 rounded down)", () => assert.equal(halfPoints({ points: 15 }), 7));
  it("1 point -> 0 (0.5 rounded down)", () => assert.equal(halfPoints({ points: 1 }), 0));
  it("10 points -> 5 (even values are exact)", () => assert.equal(halfPoints({ points: 10 }), 5));
});

describe("a wrong category on an odd-point bug", () => {
  it("checkReport gives 7 of 15 points", () => {
    const outcome = checkReport(level, [], "Visual", "the discount is wrong");
    assert.equal(outcome.status, "partial");
    assert.equal(outcome.bug.id, "odd-bug");
    assert.equal(outcome.points, 7);
    assert.equal(outcome.pointsLabel, "+7 of 15 pts");
  });

  it("the right category still gives all 15 points", () => {
    const outcome = checkReport(level, [], "Logic", "the discount is wrong");
    assert.equal(outcome.status, "correct");
    assert.equal(outcome.points, 15);
  });
});

describe("calculateScore", () => {
  it("adds 7 for the odd bug at half points and 10 for the even bug at full points: 17", () => {
    assert.equal(calculateScore(level, ["odd-bug", "even-bug"], ["odd-bug"]), 17);
  });

  it("both at half points: 7 + 5 = 12", () => {
    assert.equal(calculateScore(level, ["odd-bug", "even-bug"], ["odd-bug", "even-bug"]), 12);
  });

  it("the maximum is still the full 25", () => {
    assert.equal(maxScore(level), 25);
  });
});
