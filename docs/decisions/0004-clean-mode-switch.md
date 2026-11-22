# 0004: Hidden clean version selected by a query parameter

Status: accepted (flag added after the first version, see below)

## Context
To prove a bug exists, a test also needs to prove it is gone in a fixed version of the same page. Both versions must come from the same code so they cannot drift apart.

## Decision
Each bug sits behind one named switch (`src/lib/signupValidation.js`). A query parameter on the level URL turns all switches off. The parameter is not linked or mentioned in the player UI. The tests use it through a helper in `cypress/support/commands.js`.

## Consequences
- Every bug has a "present" test and an inverted "absent" test against the same page.
- The CI tests run against the production build, so the parameter has to work in production builds. Without protection it would also have worked on the live site.

## Update: production flag
A server-side environment variable, `ENABLE_CLEAN_MODE`, now decides (`src/lib/cleanMode.js`):
- `npm run dev`: clean mode always available.
- Production build: available only when `ENABLE_CLEAN_MODE=true`.
- `npm run test:e2e` (and so CI) sets it. Vercel does not, so the live site ignores the parameter.
- The variable is not `NEXT_PUBLIC_`, so it never reaches the browser.
- `npm run test:e2e:guard` starts the production build without the flag and checks the clean version is unreachable. CI runs it after the main suite.
