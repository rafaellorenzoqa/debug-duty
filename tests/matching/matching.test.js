// Fast unit test for the report matching: no browser, no server.
// Runs with Node's built-in test runner:  npm run test:unit
//
// It feeds every phrase in phrases.js to the REAL matching function (src/lib/matching.js)
// and the REAL bug lists of every level (src/data/levels/index.js). A new level added to
// the registry is checked automatically, and fails until its phrases are in the fixture.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { normalize, rankBugs } from "../../src/lib/matching.js";
import { LEVELS } from "../../src/data/levels/index.js";
import { matchNothing, phrases, ranking } from "./phrases.js";

// A report is only ever matched against the bugs of the level being played.
for (const level of LEVELS) {
  const ids = (text) => rankBugs(level.bugs, text).map((entry) => entry.bug.id);

  describe(`${level.id}: every bug in the level has phrases in the fixture`, () => {
    for (const bug of level.bugs) {
      it(bug.id, () => {
        assert.ok(phrases[bug.id], "no phrases for this bug");
        assert.ok(phrases[bug.id].shouldMatch.length >= 5, "needs at least 5 shouldMatch phrases");
        assert.ok(phrases[bug.id].shouldNotMatch.length >= 5, "needs at least 5 shouldNotMatch phrases");
      });
    }
  });

  for (const bug of level.bugs) {
    describe(`${bug.id}: should match`, () => {
      for (const text of phrases[bug.id]?.shouldMatch ?? []) {
        it(`"${text}"`, () => {
          const found = ids(text);
          assert.equal(found[0], bug.id, `best match was ${found[0]} (all matches: ${found.join(", ") || "none"})`);
        });
      }
    });

    describe(`${bug.id}: should NOT match`, () => {
      for (const text of phrases[bug.id]?.shouldNotMatch ?? []) {
        it(`"${text}"`, () => {
          assert.ok(!ids(text).includes(bug.id), `matched ${bug.id}`);
        });
      }
    });
  }

  describe(`${level.id}: phrases that describe no bug match nothing`, () => {
    it("has phrases in the fixture", () => assert.ok(matchNothing[level.id]?.length > 0));
    for (const text of matchNothing[level.id] ?? []) {
      it(`"${text}"`, () => {
        assert.deepEqual(ids(text), []);
      });
    }
  });

  describe(`${level.id}: when more than one bug matches, the one with the most matched words wins`, () => {
    for (const { text, winner, alsoMatches } of ranking[level.id] ?? []) {
      it(`"${text}"`, () => {
        const found = ids(text);
        assert.equal(found[0], winner);
        for (const id of alsoMatches) assert.ok(found.includes(id), `${id} should also match`);
      });
    }
  });
}

describe("normalize", () => {
  const cases = [
    ["Doesn’t  MATCH!!", "doesnt match"], // curly apostrophe removed, case, punctuation, spaces
    ["it’s “broken”", "its broken"], // curly quotes
    ["e-mail, a@b.com", "e mail a@b com"], // punctuation to spaces; @ kept
    ["  Tom & Jerry  ", "tom & jerry"], // & kept
    ["", ""],
    [undefined, ""],
  ];
  for (const [input, expected] of cases) {
    it(JSON.stringify(input), () => assert.equal(normalize(input), expected));
  }
});

describe("whole-word rules (tested with a tiny made-up bug)", () => {
  const bug = { id: "x", match: [["accept", "not the same", "sing up", "@"]] };
  const matches = (text) => rankBugs([bug], text).length === 1;

  it("a word matches its endings: accepts, accepted", () => {
    assert.ok(matches("it accepts"));
    assert.ok(matches("it was accepted"));
  });
  it("a word does not match inside another word", () => {
    assert.ok(!matches("this is unacceptable"));
    assert.ok(!matches("the form is missing upload instructions"));
  });
  it("a phrase matches only as consecutive words", () => {
    assert.ok(matches("they are not the same"));
    assert.ok(!matches("not even the same"));
  });
  it("a phrase must start at a word start", () => {
    assert.ok(matches("the button says sing up"));
    assert.ok(!matches("missing upload"));
  });
  it("symbols match anywhere", () => {
    assert.ok(matches("a@b.com"));
  });
  it("case, apostrophes and punctuation are ignored", () => {
    assert.ok(matches("IT ACCEPTS!!!"));
    assert.ok(matches("Not-The-Same"));
  });
});
