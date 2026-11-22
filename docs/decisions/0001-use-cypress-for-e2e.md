# 0001: Use Cypress for end-to-end tests

Status: accepted

## Context
The game is a web app and its bugs are visible in the browser (a typo, a rejected character, a double click). The tests need to drive a real browser, and the project is meant to show test automation skills in JavaScript.

## Decision
Use Cypress with JavaScript. Select elements only through `data-cy` attributes.

## Consequences
- Tests read like the manual steps a tester would follow, and failures come with screenshots and videos.
- `data-cy` attributes keep tests stable when styles or markup change.
- Cypress is browser-focused and runs one browser tab at a time, which is enough here.
- Alternatives considered: Playwright (also good, but Cypress was chosen for the author's experience with it) and unit tests only (would not prove the bugs are visible to a user).
