import Link from "next/link";

// In the App Router, src/app/page.js is the home page ("/").
// Temporary link so Level 1 can be opened; the start screen replaces this in iteration 3.
export default function HomePage() {
  return (
    <main>
      <h1>Debug Duty</h1>
      <p>The game arrives in the next iterations.</p>
      <Link href="/level-1">Open Level 1 (work in progress)</Link>
    </main>
  );
}
