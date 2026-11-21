# 0003: Trunk-based development with CI as a merge gate

Status: accepted

## Context
Vercel deploys every merge to `main` on its own, separately from GitHub Actions. A failing CI check does not stop a deploy by itself.

## Decision
- Short-lived branches, one pull request per iteration, Conventional Commits, no direct commits to `main`.
- CI (lint, build, Cypress) runs on pull requests and on pushes to `main`. It does not run on every branch push, to avoid two checks per commit.
- Branch protection on `main` requires the **Lint, build and Cypress** check to pass before merging.

## Consequences
- A red CI blocks the merge, so broken code does not reach Vercel.
- Failed runs upload Cypress screenshots and videos as artifacts for debugging.
- The failure upload was verified once with a deliberately failing commit (kept in the history of PR #5).
