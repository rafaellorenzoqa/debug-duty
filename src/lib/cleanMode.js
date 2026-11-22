// Decides whether the hidden clean version of a level may be shown.
//
// The clean version exists only for automated tests. Rule:
//   - during development (`npm run dev`) it is always available
//   - in a production build it is available ONLY when the environment variable
//     ENABLE_CLEAN_MODE is exactly "true"
//
// CI sets ENABLE_CLEAN_MODE=true (see the `test:e2e` script). Vercel does not set it,
// so on the live site the query parameter is ignored and players always get the buggy page.
//
// Not prefixed with NEXT_PUBLIC_ on purpose: this variable is read on the server only
// and is never sent to the player's browser.

export function isCleanModeAllowed(env = process.env) {
  return env.NODE_ENV !== "production" || env.ENABLE_CLEAN_MODE === "true";
}

// `modeParam` is the value of ?mode= from the URL.
export function shouldShowCleanVersion(modeParam, env = process.env) {
  return modeParam === "clean" && isCleanModeAllowed(env);
}
