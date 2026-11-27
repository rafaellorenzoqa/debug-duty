# 0006: One shared game panel, one visual identity per level

Status: accepted

## Context
Level 2 (1Up Bakery, a cake builder) joins Level 1 (Sole Mate, a signup page), and up to five levels are planned. Each level is meant to feel like testing a different product, the way a QA moves between real projects. At the same time, the player must always know how to play: where the markers, counter, score and Report bug button are.

## Decision
- **The game panel is shared and never restyled.** Every level page renders its product inside `<Game>` (`src/components/game/Game.js`). The panel, report form and results screen keep the Debug Duty identity (near-black and caution-tape yellow, `--duty-*` variables in `globals.css`).
- **Each level owns its look.** A level's colours, fonts, layout and logo live only in its own CSS module, declared on the level page's wrapper element (`SignupForm.module.css` for Level 1, `bakery/CakeBuilder.module.css` for Level 2). Nothing level-specific goes into `globals.css`.
- **Each level follows the same code pattern**, so the project reads as one codebase:
  - a page in `src/app/level-N/page.js` that reads `?mode=clean` through `shouldShowCleanVersion`;
  - a data file `src/data/levels/levelN.js` with the bugs, word groups and lessons, listed in the registry `src/data/levels/index.js`;
  - the rules in a pure module in `src/lib` with one named flag per bug (`getBugFlags(isClean)`);
  - phrases in `tests/matching/phrases.js`, checked by the same unit test for every registered level.
- A level's own data (such as Level 2's prices in `src/data/bakeryMenu.js`) lives in one file, and both the page's written spec (price list, field rules) and the code read from it.

## Consequences
- Players learn the controls once; each new level still looks like a new product.
- A level can be restyled without risk to the game or to other levels, because CSS module class names are scoped to their component.
- Cypress tests reach the panel through the same `data-cy` attributes in every level, so game-flow commands (`reportBug`) are reused.
- Each level needs its own design work and its own contrast check (WCAG AA), since there is no shared level theme.
