import Game from "@/components/game/Game";
import SignupForm from "@/components/SignupForm";
import { level1 } from "@/data/levels/level1";
import { shouldShowCleanVersion } from "@/lib/cleanMode";

// Route: /level-1
//
// Testing switch (deliberately NOT shown anywhere in the player UI):
//   /level-1?mode=clean  ->  the version with no bugs
//   /level-1             ->  the buggy version players see
//
// In the App Router, a page receives the URL's query string as `searchParams`.
// In recent Next.js versions it is a Promise, so we `await` it.
export default async function Level1Page({ searchParams }) {
  const params = await searchParams;
  // On the live site the flag is off, so the parameter is ignored (see src/lib/cleanMode.js).
  const isClean = shouldShowCleanVersion(params.mode);

  // <Game> adds the game panel and results screen around the level page.
  return (
    <Game level={level1}>
      <SignupForm isClean={isClean} />
    </Game>
  );
}
