# 0004: Hidden clean version selected by a query parameter

Status: accepted, with a known limitation

## Context
To prove a bug exists, a test also needs to prove it is gone in a fixed version of the same page. Both versions must come from the same code so they cannot drift apart.

## Decision
Each bug sits behind one named switch (`src/lib/signupValidation.js`). A query parameter on the level URL turns all switches off. The parameter is not linked or mentioned in the player UI. The tests use it through a helper in `cypress/support/commands.js`.

## Consequences
- Every bug has a "present" test and an inverted "absent" test against the same page.
- The CI tests run against the production build, so the parameter must work in production builds. That means it also works on the live site, and a player could find it.
- Fix, as its own small iteration: an environment flag that is on in CI and off on Vercel.
