# Debug Duty

A QA-themed game. Each level is a small, deliberately buggy web page. Find the hidden bugs and report them.

> Status: early prototype. Level 1 (a fake sneaker-store signup page) is in progress.

## How to play
1. Read the mission briefing on the start screen and press **Start**.
2. The five tags at the top left show how many bugs exist and how tricky they are: two green (easy), two orange (medium), one red (hard). They start dimmed.
3. Explore the signup page and look for bugs.
4. Press **Report bug**, choose a category (Visual, Validation, Edge case, Logic, Behavior) and describe the bug in one line.
5. A correct report lights up the matching tag and scores points (easy 10, medium 20, hard 40). Wrong or duplicate reports score nothing.
6. Find all five bugs to reach the results screen. Your best score is saved in your browser (localStorage).

## Run locally
```bash
npm install
npm run dev     # http://localhost:3000
```

## Run tests
_Coming soon (Cypress and k6)._

## Tech stack
Next.js (App Router, JavaScript), plain CSS, Cypress, k6, GitHub Actions, Vercel.

## Roadmap
- More levels
- User accounts and a leaderboard (Supabase)
- A second game mode: fix the flaky Cypress test puzzles

## Known Limitations
- Clean version of levels can be accesses by adding the correct parameter to the URL. This should be blocked in production.