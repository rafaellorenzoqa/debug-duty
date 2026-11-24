"use client";

// The game wrapper. It holds all game state and shows:
//   - a persistent panel (markers, counter, score, Report bug button) above the level page
//   - the buggy page itself (`children`)
//   - the results screen once every bug has been found
//
// "State" is data React remembers between renders; when it changes, the screen updates.

import { useState } from "react";
import styles from "./Game.module.css";
import DifficultyMarkers from "./DifficultyMarkers";
import ReportForm from "./ReportForm";
import ResultsScreen from "./ResultsScreen";
import { calculateScore, checkReport, maxScore } from "@/lib/game";
import { saveBestResult } from "@/lib/storage";

export default function Game({ level, children }) {
  const [foundIds, setFoundIds] = useState([]);
  // Bugs found under the wrong category: they score half points.
  const [partialIds, setPartialIds] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [best, setBest] = useState(null);

  const score = calculateScore(level, foundIds, partialIds);
  const finished = foundIds.length === level.bugs.length;

  function handleReport(category, description) {
    const outcome = checkReport(level, foundIds, category, description);
    setFeedback(outcome);

    if (outcome.status === "correct" || outcome.status === "partial") {
      const newFoundIds = [...foundIds, outcome.bug.id];
      const newPartialIds =
        outcome.status === "partial" ? [...partialIds, outcome.bug.id] : partialIds;
      setFoundIds(newFoundIds);
      setPartialIds(newPartialIds);
      if (newFoundIds.length === level.bugs.length) {
        setBest(
          saveBestResult(level.id, {
            score: calculateScore(level, newFoundIds, newPartialIds),
            bugsFound: newFoundIds.length,
          }),
        );
      }
    }
    return outcome;
  }

  function handlePlayAgain() {
    setFoundIds([]);
    setPartialIds([]);
    setFeedback(null);
    setReportOpen(false);
    setBest(null);
  }

  if (finished && best) {
    return (
      <ResultsScreen
        level={level}
        score={score}
        partialIds={partialIds}
        maxPoints={maxScore(level)}
        best={best}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <>
      <section className={styles.panel} data-cy="game-panel">
        <div className={styles.panelMain}>
          <DifficultyMarkers level={level} foundIds={foundIds} />
          <p className={styles.counter} data-cy="bug-counter">
            {foundIds.length} of {level.bugs.length} found
          </p>
        </div>
        <div className={styles.panelSide}>
          <p className={styles.score}>
            Score: <strong data-cy="score">{score}</strong>
          </p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setReportOpen((open) => !open)}
            aria-expanded={reportOpen}
            data-cy="report-bug-button"
          >
            {reportOpen ? "Close report" : "Report bug"}
          </button>
        </div>
        {reportOpen && <ReportForm onReport={handleReport} feedback={feedback} />}
      </section>

      {children}
    </>
  );
}
