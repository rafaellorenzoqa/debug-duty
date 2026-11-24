import Link from "next/link";
import styles from "./Game.module.css";
import { halfPoints } from "@/lib/game";

export default function ResultsScreen({ level, score, maxPoints, partialIds = [], best, onPlayAgain }) {
  return (
    <main className={styles.results} data-cy="results-screen">
      <h1>Sign-off complete!</h1>
      <p>All {level.bugs.length} bugs found. The release can ship (almost).</p>

      <p className={styles.bigScore}>
        Score: <strong data-cy="results-score">{score}</strong> / {maxPoints}
      </p>
      <p data-cy="results-found">
        Bugs found: {level.bugs.length} of {level.bugs.length}
      </p>
      <p data-cy="results-best">Best score on this browser: {best.score}</p>

      <ul className={styles.foundList} data-cy="results-list">
        {level.bugs.map((bug) => {
          const partial = partialIds.includes(bug.id);
          return (
            <li key={bug.id} data-cy={`result-${bug.id}`} data-partial={partial ? "true" : "false"}>
              <span className={`${styles.marker} ${styles[bug.difficulty]} ${styles.lit}`}>
                {partial ? halfPoints(bug) : bug.points} pts
              </span>{" "}
              {bug.title}
              {partial && ` (half points: it is a ${bug.category} bug)`}
            </li>
          );
        })}
      </ul>

      <div className={styles.resultsActions}>
        <button type="button" className={styles.primaryButton} onClick={onPlayAgain} data-cy="play-again">
          Play again
        </button>
        <Link href="/" className={styles.linkButton} data-cy="back-to-start">
          Back to start
        </Link>
      </div>
    </main>
  );
}
