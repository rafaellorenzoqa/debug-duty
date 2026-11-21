import SignupForm from "@/components/SignupForm";

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
  const isClean = params.mode === "clean";
  return <SignupForm isClean={isClean} />;
}
