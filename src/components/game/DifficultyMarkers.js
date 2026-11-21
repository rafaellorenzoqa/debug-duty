import styles from "./Game.module.css";
import { DIFFICULTY_LABELS } from "@/data/categories";

// One tag per bug, in the order of the level's bug list.
// Dimmed = still hidden. Lit (filled colour + tick) = found.
// The colour and size tell the player how tricky the bug is,
// but nothing about what or where it is.
export default function DifficultyMarkers({ level, foundIds }) {
  return (
    <ul className={styles.markers} data-cy="markers" aria-label="Bug difficulty markers">
      {level.bugs.map((bug) => {
        const found = foundIds.includes(bug.id);
        return (
          <li
            key={bug.id}
            className={`${styles.marker} ${styles[bug.difficulty]} ${found ? styles.lit : styles.dim}`}
            data-cy={`marker-${bug.id}`}
            data-difficulty={bug.difficulty}
            data-found={found ? "true" : "false"}
          >
            {found ? "✓ " : ""}
            {DIFFICULTY_LABELS[bug.difficulty]}
          </li>
        );
      })}
    </ul>
  );
}
