import Link from "next/link";
import styles from "@/components/game/Game.module.css";
import DutyLogo from "@/components/game/DutyLogo";
import { LEVELS, difficultyMix } from "@/data/levels";

// In the App Router, src/app/page.js is the home page ("/"): the start screen.
export default function StartScreen() {
  return (
    <div className={styles.startPage}>
      <div className={styles.stripe} />
      <main className={styles.start} data-cy="start-screen">
        <span className={styles.dutyLogo}>
          <DutyLogo />
        </span>
        <h1>
          Debug <span>Duty</span>
        </h1>
        <p className={styles.tagline}>QA training, one bug at a time</p>
        <p className={styles.briefingTitle}>Mission briefing</p>
        <div className={styles.briefing}>
          <p>
            QA wants this signup page signed off by five o&apos;clock. Find the bugs.
          </p>
          <ul>
            <li>There are exactly five bugs: two easy, two medium, one hard.</li>
            <li>Use the Report bug button: pick a category and describe the bug in one line.</li>
            <li>Correct reports light up a marker and score points. Wrong or repeated reports score nothing.</li>
          </ul>
        </div>
        <Link href="/level-1" className={styles.primaryLink} data-cy="start-button">
          Start
        </Link>

        {/* Every level after the first, read from the level registry. All levels are open. */}
        <section className={styles.levelCards} aria-labelledby="more-levels-title">
          <h2 id="more-levels-title" className={styles.briefingTitle}>
            More levels
          </h2>
          <ul>
            {LEVELS.slice(1).map((level, index) => (
              <li key={level.id}>
                <Link href={level.path} className={styles.levelCard} data-cy={`start-${level.id}`}>
                  <strong>
                    Level {index + 2}: {level.name}
                  </strong>
                  <span>{level.summary}</span>
                  <span>
                    {level.bugs.length} bugs: {difficultyMix(level)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
