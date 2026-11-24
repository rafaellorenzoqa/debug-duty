# 0005: Report matching stays text-based, with no AI judge

Status: accepted

## Context
A player describes a bug in one line and the game decides which known bug it is about. A language model could judge this by meaning, which would catch more phrasings. The first text matcher (word lists, plain substring search) also let wrong reports through, for example "the confirm password label is nice and the same size" matched the confirm-password bug, because it contains "confirm" and "same".

## Decision
Matching stays plain text matching in `src/lib/matching.js`. There is no LLM judge, no API call and no backend. Instead, the matcher is made stricter and is tested:
- Player text and word lists are normalised the same way (lowercase, curly quotes straight, apostrophes removed, punctuation to spaces).
- Words match as whole words from their first letter (`accept` matches `accepted`, `sing up` does not match inside `missing upload`). Phrases match as consecutive words. Symbols such as `@` and `&` may match anywhere.
- A bug needs a word from every group in its `match` list; when several bugs match, the one with the most matched words wins, and the chosen category is still preferred.
- Word lists in `src/data/levels/level1.js` keep only words specific to a bug (phrases such as "not the same" instead of "same").
- `tests/matching/phrases.js` holds phrases that must and must not match each bug, and `npm run test:unit` (Node's built-in test runner, no browser) checks them. CI runs it on every pull request.

## Why not an LLM judge
- **Cost exposure:** the game is public. A judge called per report would make every visitor a possible bill, and rate limiting or key protection would need more machinery.
- **Deterministic tests:** the same report must always give the same result, so the Cypress suite and the phrase fixture can assert it. A model's answer can change between runs and between versions.
- **No backend:** the project has no server code yet (see ADR 0002). A model call would need one to keep the API key secret.

## Consequences
- Matching is predictable and free, and a wrong judgement becomes a new fixture phrase and a word list change.
- Known limit: text matching cannot understand meaning, it can only be strict and predictable. Two reports that look alike to it can mean opposite things, for example "the confirm password does not match error is shown" (correct behaviour) and "confirm password does not match but is accepted" (the bug) both contain "does not match". Players who describe a real bug in words that are not on the lists are told no bug matches. Each level's lists have to be maintained by hand against the fixture.
- Revisit this decision if a backend exists and the cost can be capped.
