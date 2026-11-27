# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/); commits follow [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Fixed (Level 2 polish)
- Report matching: duplicate-filling reports that name a flavor followed by "for both" or "in both" now match (for example "i can choose vanilla for both fillings", "i can pick lemon curd in both"). Plain "for both" / "in both" were too broad, so the words are a flavor word plus the phrase. Three should-match and three should-not-match phrases added to the fixture first.
- American spelling in the text players see: "color" and "flavor" on the 1Up Bakery page, the Blush Pink bug's title and explanation, and the Visual category definition (shown in both levels). Word lists and fixture phrases keep both spellings, so reports in either spelling still match.

### Changed (Level 2 polish)
- The interaction between Level 2 bugs 4 and 5 is now documented (comment on `changeFillingCount`, ADR 0006) and pinned by three unit tests: Bug 5 keeps what the second filling was charged, so a stale Pistachio Cream leaves $0 and repeated removals add up. No behaviour change.

### Fixed (Level 1 confirm-password phrasing)
- Report matching: confirm-password reports that say the passwords are different now match, for example "The account is created even when password and confirm password are different". New words are tied to the password ("password are different", "differs from the password", "passwords are not identical"...). The bare words "different", "differs" and "not identical" stay out, because they also appear in praise ("the confirm button is different"). Four should-match and eight should-not-match phrases added to the fixture first.

### Added (half points rounding test)
- Unit test `tests/game/game.test.js`: half points are rounded down (15 -> 7, 1 -> 0), in `halfPoints`, `checkReport` and `calculateScore`, using a made-up level with odd points (every real bug has even points, so the rounding was not tested anywhere). `npm run test:unit` runs it.

### Changed (half points rounding test)
- `src/lib/game.js` imports with relative paths instead of the `@/` alias, so Node's test runner can load it. No behaviour change.

### Added (Level 2 Cypress tests)
- Written by the `test-writer` agent and reviewed twice by the `test-reviewer` agent.
- `cypress/e2e/level2-bugs.cy.js`: a present (buggy) and absent (clean) test for each of the five Level 2 bugs.
- `cypress/e2e/level2-bakery.cy.js`: clean-version prices and rules: the default and six hand-checked totals, every size x cake type, every flavor in each dropdown, every colour and swatch, the dropdown option lists, the second dropdown's enable/disable/reset, the duplicate error and the em dash total; the price list in both versions.
- `cypress/e2e/level2-game-flow.cy.js`: reports through the game panel (markers in order, counter, score, half points, duplicates, vague reports), the results screen of the last level (no Next level), Play again, the start-level-2 card and Level 1's Next level button.
- Guard test: `/level-2?mode=clean` serves the buggy page when `ENABLE_CLEAN_MODE` is off.
- Commands `visitLevel2(mode)` and `buildCake(overrides)`; `buildCake` asserts every value stuck, so a select that silently failed cannot pass.
- Mutation check: flipping each Level 2 bug flag on its own fails exactly that bug's tests and nothing else.

### Added (level navigation)
- Start screen: a "More levels" card for every level after the first (`data-cy="start-level-2"` for 1Up Bakery), with its summary and difficulty mix. The briefing and the Start button are unchanged. All levels are open, nothing is locked.
- Results screen: a **Next level: 1Up Bakery** button (`data-cy="next-level"`) when the finished level has a next one. Play again and Back to start stay; when Next level is shown, Play again becomes an outlined button so there is one main action.
- Level data: `path`, `name`, `summary`, and `next` (`level1.next = "/level-2"`; Level 2 has none yet). Registry helpers `findLevelByPath` and `difficultyMix` in `src/data/levels/index.js`.
- README: two levels, how to move between them, and how to add a level.

### Added (Level 2: 1Up Bakery)
- New level at `/level-2`: **1Up Bakery**, a cake builder with five hidden bugs (1 easy, 3 medium, 1 hard; 100 points; categories Visual, Logic, Logic, Edge case, Behavior). Same game panel as Level 1, its own look: light blue and green, rounded, form on the left and a cake summary with the live total on the right (stacked on phones), and an original logo (a cake with a green 1UP badge).
- `src/data/bakeryMenu.js`: every price in one file. The price list card on the page and every dropdown's options are generated from it.
- `src/lib/cakePricing.js`: pure pricing and rule functions with one named flag per bug (`blushSwatchWrong`, `fondantFreeOn25cm`, `duplicateFillingAllowed`, `lastFlavorFreeInSecond`, `staleSecondFilling`). The clean version is `/level-2?mode=clean`, blocked in production like Level 1.
- `src/data/levels/level2.js`: the five bugs with word groups, type explanations and lessons.
- `src/data/levels/index.js`: a level registry (`LEVELS`). The matching unit test checks every registered level.
- Unit test `tests/pricing/cakePricing.test.js`: the six hand-checked totals and each bug on its own. `npm run test:unit` now runs it too.
- ADR 0006: one shared game panel, one visual identity per level.

### Changed (Level 2: 1Up Bakery)
- Game panel: the difficulty markers wrap onto a second line on narrow screens. Before, on phones the last markers were cut off and the panel scrolled sideways (both levels).
- `tests/matching/matching.test.js` loops over every registered level instead of Level 1 only. Assertions are unchanged; test names now start with the level or bug id.
- `tests/matching/phrases.js`: 7 should-match and 7 should-not-match phrases for each Level 2 bug; `matchNothing` and `ranking` are now grouped by level id.

### Added (test agents)
- Two project subagents in `.claude/agents/`: `test-writer` (writes and maintains the Cypress tests) and `test-reviewer` (read-only review of the tests against a checklist; runs lint and the Cypress suite itself).
- Cypress spec `cypress/e2e/level1-banner.cy.js`: checks that the Level 1 banner paints the navy blue `#0b1f4b` (`rgb(11, 31, 75)`, the middle stop of the banner gradient) in the buggy and clean versions. The banner is reached as the parent of `[data-cy=store-name]` for now; a `data-cy="banner"` on the header is planned in a follow-up branch.

### Changed (matching accuracy)
- Report matching moved to `src/lib/matching.js` (no imports, so Node can test it) and made stricter, still plain text matching with no AI:
  - player text and word lists are normalised the same way (lowercase, curly quotes, apostrophes removed, punctuation to spaces);
  - words match as whole words from their first letter ("accept" matches "accepted"; "sing up" no longer matches inside "missing upload"); phrases match as consecutive words; `@` and `&` still match anywhere;
  - when several bugs match, the one with the most matched words wins; the chosen category is still preferred.
- Word groups in `level1.js` trimmed to words specific to each bug (for example "not the same" instead of "same"; the email and double-click bugs now need three groups).
- Fixes false positives such as "the confirm password label is nice and the same size".

### Added (matching accuracy)
- Phrase fixture `tests/matching/phrases.js` (7 should-match and 7 should-not-match phrases per bug, plus phrases that must match nothing) and a fast Node test `npm run test:unit` (no browser). CI runs it before the build.
- ADR 0005: matching stays text-based, no LLM judge.

### Added (educational feedback)
- Category help: picking a category in the report form shows what it means, a question to ask yourself, an example from a different app, and how to tell it from similar categories, before the player submits (`CATEGORY_INFO` in `categories.js`).
- Teaching feedback for every found bug, also when the type is right: why this bug belongs to its category, what the category means, and a reusable testing tip (`typeExplanation` and new `lesson` per bug in `level1.js`). A wrong type adds a side-by-side of the chosen and correct type and how to tell them apart.
- The result card is clearer: green header for full points, yellow header for the right bug with the wrong type, and the points in a large badge instead of the end of a sentence.
- The report form is two columns on wide screens; the game bar scrolls internally when the lesson is long.

### Changed (email bug)
- Bug 2 is now "Email field does not check the format": the buggy field accepts anything (no @, two @, spaces, no domain), not only a missing @. Bug id renamed to `validation-email-format`; code flag renamed to `emailSkipsFormatCheck`.
- The email rules now state the format (`text@domain.ext`, e.g. a@b.com).
- Cypress tests try seven malformed emails in the buggy and clean versions, and three valid ones in the clean version.
- The "no match" message now explains how to describe a bug (what it is about and what goes wrong).

### Changed (separate identities for the game and each level)
- Debug Duty (start screen, game bar, report form, results screen) now has its own identity: near-black and caution-tape yellow, with a magnifier logo (`DutyLogo.js`) and a hazard-stripe header. Variables `--duty-*` in `globals.css`.
- Sole Mate's colours moved from the global styles to the level 1 page wrapper (`SignupForm.module.css`), so each future level can define its own brand without touching the game.

### Added (branding)
- Visual identity for the fake store: navy and orange palette (CSS variables in `globals.css`), an SVG logo (`Logo.js`), a branded hero header, a card-style signup form and an orange call-to-action button.
- The game bar is now dark navy with an orange underline and bright difficulty markers, so they are easy to see. Start screen, report form and results screen follow the same palette.

### Changed (branding and matching)
- Field rules are now small red helper text under each field instead of grey boxes. Error messages stay bigger and bolder.
- Bug matching is stricter: each bug has `match` word groups and a report must contain a word from every group (what it is about + what is wrong). "email" alone no longer matches; "email accepts no @" does. This also applies to half-points reports. Replaces the old `keywords` list.
- New Cypress tests for vague reports (rejected) and accurate reports in different words (accepted).

### Added (field rules and category feedback)
- The signup page now shows its own requirements, so testers have something to validate against: what a valid email is, the password rules with the full list of allowed special characters (including the `&` that the buggy version rejects), the confirm password rule, and a note that one submission creates one account. Same text in both versions.
- The tagline now says "Hit Sign Up", so the misspelled button can be compared with it.
- Reporting a real bug under the wrong category now gives half points (rounded down) and explains the real category: a general definition (`CATEGORY_DEFINITIONS`) plus a bug-specific `typeExplanation` in `level1.js`. The bug counts as found and cannot be reported again.
- Results screen shows which bugs paid half points.
- Special characters are now defined once (`PASSWORD_SPECIAL_CHARS`) and used for both the validation and the text on the page, so the two cannot drift apart.
- New Cypress tests for the rules, every other special character being accepted in the buggy version, and half-points reports.

### Changed (field rules and category feedback)
- The test "the right text under the wrong category is not accepted" became "gives half points and names the real category".

### Changed (clean mode in production)
- The hidden clean version is now blocked in production builds unless `ENABLE_CLEAN_MODE=true` is set on the server (`src/lib/cleanMode.js`). Always available in `npm run dev`.
- `npm run test:e2e` sets the flag; Vercel does not, so the live site ignores the query parameter.
- New guard spec `cypress/e2e/clean-mode-blocked.cy.js` and script `test:e2e:guard`; CI runs it with the flag off.
- Added `cross-env` so the flag works on Windows, macOS and Linux.
- README and ADR 0004 updated; removed the known limitation.

### Added (docs)
- Complete README: what the game is, how to play, run locally, run tests, CI, project layout, tech stack, roadmap, known limitations, CI status badge.
- Architecture decision records in `docs/decisions`: Cypress, no database yet, trunk-based development with a CI gate, clean-mode switch.

### Added (game engine)
- Start screen at `/` with mission briefing and Start button.
- Persistent game panel on `/level-1`: five difficulty markers (dimmed until found), "N of 5 found" counter, score, Report bug button.
- Report form (category dropdown and one-line description) with clear feedback for correct, duplicate, wrong and incomplete reports.
- Bug matching in `src/lib/game.js`: category match plus keyword match, case-insensitive.
- Results screen with score, bugs found and best score; "Play again" and "Back to start".
- Best score stored in localStorage (`src/lib/storage.js`).
- `title` field added to each bug in `level1.js`.
- README "How to play".

### Added (level 1)
- Level 1 "Sole Mate" signup page at `/level-1` with five deliberate bugs (typo on button, email without `@`, `&` rejected in password, confirm password not compared, double click creates two accounts).
- Hidden clean version at `/level-1?mode=clean` (not linked or mentioned in the player UI).
- `src/data/levels/level1.js`: the bug list (id, difficulty, category, keywords, points).
- `data-cy` attributes on all form elements for Cypress.
- `AGENTS.md`, auto-generated by `next dev` (guidance for AI coding agents).

### Added
- Next.js (App Router, JavaScript) project scaffold.
- Folder structure: `src/app`, `src/components`, `src/data/levels`, `src/lib`, `docs/decisions`, `tests/k6`.
- ESLint configuration (`npm run lint`).
- Pull request template and this changelog.
- README skeleton.
