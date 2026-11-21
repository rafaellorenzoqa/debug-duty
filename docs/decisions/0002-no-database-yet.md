# 0002: No database or accounts in the first version

Status: accepted, to be revisited

## Context
The goal of the prototype is a playable level, a solid test suite and a CI/CD pipeline. A database and accounts would add setup, secrets and failure modes that do not help prove those goals.

## Decision
Keep the best score in the browser (localStorage). Level definitions are plain JavaScript files in the repo. Signup is simulated in the page.

## Consequences
- Zero infrastructure: the app deploys as a Next.js site on Vercel.
- Scores are per browser, can be edited by the player and cannot be compared. A leaderboard needs a backend.
- Planned next step: Supabase for accounts and a leaderboard. That is also when k6 tests for signup become relevant.
