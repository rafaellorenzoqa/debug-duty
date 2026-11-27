# Debug Duty

[![CI](https://github.com/rafaellorenzoqa/debug-duty/actions/workflows/ci.yml/badge.svg)](https://github.com/rafaellorenzoqa/debug-duty/actions/workflows/ci.yml)

A QA-themed web game. You play a tester. Each level is a small, deliberately buggy web page: find the hidden bugs and report them.

It is also a portfolio project for test automation: every bug is covered by an automated Cypress test, CI runs on every pull request, and the design decisions are written down in [docs/decisions](docs/decisions).

**Play it live: https://debug-duty.vercel.app/**

> Status: prototype with two levels. Level 1 is a fake sneaker-store signup page ("Sole Mate"), Level 2 a fake online cake builder ("1Up Bakery"). Each has five bugs.

## What the game is
- **Level 1, "Sole Mate":** a signup page with five hidden bugs: two easy, two medium, one hard.
- **Level 2, "1Up Bakery":** a cake builder with a live price and five hidden bugs: one easy, three medium, one hard. A price list on the page is the spec to check the total against.
- **Every level looks like a different product**, but the game panel on top (markers, counter, score, Report bug) is always the same. See [ADR 0006](docs/decisions/0006-shared-game-panel-per-level-identity.md).
- **Difficulty markers:** five tags at the top left tell you from the start how many bugs there are and how hard they are: easy (green), medium (orange), hard (red). They light up as you find bugs.
- **Reporting:** you pick a category and describe the bug in one line. The game matches the description against a known bug list (it has to say what the bug is about and what is wrong, so one vague word is not enough), then checks the category.
- **Written rules:** each level shows its own spec: Level 1 lists what each field should accept, Level 2 shows a price list. Test the page against it.
- **Scores** are stored in your browser (localStorage). There are no accounts yet.

## How to play
1. Read the mission briefing on the start screen and press **Start** for Level 1, or pick a later level from the cards below it. All levels are open.
2. Check the five tags at the top left. They start dimmed.
3. Explore the page and look for bugs.
4. Press **Report bug**, choose a category (Visual, Validation, Edge case, Logic, Behavior) and describe the bug in one line. When you pick a category, its meaning and an example appear before you submit.
5. A correct report lights up the matching tag and scores points (each level is worth 100; harder bugs pay more). Every found bug comes with an explanation of its type and a testing tip. If you find a real bug but pick the wrong category, you get half points and a side-by-side of the type you chose and the correct one. Wrong or duplicate reports score nothing.
6. Find all five bugs to reach the results screen. Your best score is saved in your browser. From there, go to the **Next level**, **Play again**, or go **Back to start** to read the briefing again.

## Run locally
Requires Node.js 20 or newer.
```bash
npm install
npm run dev     # http://localhost:3000
```

## Run tests
```bash
npm run build       # the e2e tests run against the production build
                    # (`test:e2e` sets ENABLE_CLEAN_MODE=true so tests can reach the clean version)
npm run test:e2e    # starts the app and runs all Cypress specs headlessly
npm run test:unit   # fast Node tests: report matching, Level 2 pricing, scoring (no browser)
npm run test:e2e:guard  # starts the app WITHOUT the clean-mode flag; checks the clean version is blocked
npm run cy:open     # interactive Cypress runner (start the app with `npm run dev` first)
npm run lint        # ESLint
```
- `cypress/e2e/level1-bugs.cy.js` and `level2-bugs.cy.js`: for each bug, one test proves it is present in the buggy page and one proves it is absent in the clean page.
- `cypress/e2e/level2-bakery.cy.js`: Level 2's prices and rules in the clean version (every size, cake type, flavor in both dropdowns, colour and swatch, the six hand-checked totals). Expected totals are typed in by hand, never read from the app's code.
- `cypress/e2e/level2-game-flow.cy.js`: reporting Level 2's bugs through the game panel, its results screen, and the links between levels.
- `tests/matching/`: phrases that must and must not match each bug of every level, run against the real matching code with Node's built-in test runner. Add a phrase there whenever a report is judged wrongly.
- `tests/pricing/`: Level 2's hand-checked cake totals and each bug on its own, against the real pricing code.
- `tests/game/`: scoring rules, including half points rounded down for a wrong category (with made-up odd-point bugs, since every real bug has even points).
- `cypress/e2e/game-flow.cy.js`: start screen, markers and counter, correct / half-points / duplicate / wrong reports, results screen.
- Selectors use `data-cy` attributes only, never CSS classes.
- k6 performance tests are planned for when there is a backend to test.

> Windows + VS Code: if Cypress fails with `bad option: --smoke-test`, run `unset ELECTRON_RUN_AS_NODE` (bash) or `Remove-Item Env:ELECTRON_RUN_AS_NODE` (PowerShell) first.

## Continuous integration
Production deploys automatically from `main` on Vercel. GitHub Actions runs on every pull request and on pushes to `main`: install, lint, build, then the Cypress suite. When a run fails, Cypress screenshots and videos are attached to the run as artifacts. `main` is protected: the **Lint, build and Cypress** check must pass before merging. See [ADR 0003](docs/decisions/0003-trunk-based-development-and-ci-gate.md).

## Project layout
| Path | What it holds |
| --- | --- |
| `src/app` | Pages (start screen, `/level-1`, `/level-2`) |
| `src/components` | The level pages (signup form, `bakery/` cake builder) and the game UI (panel, markers, report form, results) |
| `src/data/levels` | One file per level (bugs, match words, lessons, path, next level) and `index.js`, the list of all levels |
| `src/data/bakeryMenu.js` | Level 2's prices, the single source for the price list and the dropdowns |
| `src/lib` | Game logic (report matching, score), each level's rules with one flag per bug, localStorage |
| `cypress` | End-to-end tests and helpers |
| `docs/decisions` | Architecture decision records |

## Tech stack
Next.js (App Router, JavaScript), plain CSS modules, Cypress, GitHub Actions, Vercel. k6 is planned.

## Roadmap
- More levels, up to five: add a file in `src/data/levels`, list it in `src/data/levels/index.js`, set the previous level's `next`, and add a page in `src/app`
- User accounts and a leaderboard (Supabase)
- k6 performance tests for signup, once there is a backend
- A second game mode: fix the flaky Cypress test puzzles

## Known limitations
- Every level has a hidden clean version, used only by the automated tests. It is switched on with a URL query parameter, and in a production build only when the server has `ENABLE_CLEAN_MODE=true`. CI sets it; Vercel does not, so on the live site the parameter is ignored. A guard test checks this. See [ADR 0004](docs/decisions/0004-clean-mode-switch.md).
- Scores are per browser and can be edited by the player.
