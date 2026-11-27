import Game from "@/components/game/Game";
import CakeBuilder from "@/components/bakery/CakeBuilder";
import { level2 } from "@/data/levels/level2";
import { shouldShowCleanVersion } from "@/lib/cleanMode";

// Route: /level-2 (the folder name becomes the URL).
//
// Testing switch (deliberately NOT shown anywhere in the player UI):
//   /level-2?mode=clean  ->  the version with no bugs
//   /level-2             ->  the buggy version players see
// On the live site the flag is off, so the parameter is ignored (see src/lib/cleanMode.js).
export default async function Level2Page({ searchParams }) {
  const params = await searchParams;
  const isClean = shouldShowCleanVersion(params.mode);

  // The same <Game> panel as Level 1; only the page inside it has its own look.
  return (
    <Game level={level2}>
      <CakeBuilder isClean={isClean} />
    </Game>
  );
}
