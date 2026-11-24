"use client";

import { useState } from "react";
import styles from "./Game.module.css";
import { CATEGORIES, CATEGORY_INFO } from "@/data/categories";

// The "Report bug" form: a category dropdown and a one-line description.
// It does not judge the report itself. It hands it to `onReport`.
//
// As soon as a category is picked, a short lesson about it appears next to the form,
// so the player can make an educated choice BEFORE submitting.
export default function ReportForm({ onReport, feedback }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const info = CATEGORY_INFO[category];

  function handleSubmit(event) {
    event.preventDefault();
    const outcome = onReport(category, description);
    // Clear the text after a real attempt, but keep it when the form was incomplete.
    if (outcome.status !== "invalid") setDescription("");
  }

  return (
    <form className={styles.reportForm} onSubmit={handleSubmit} data-cy="report-form">
      <div className={styles.reportFields}>
        <label htmlFor="report-category">Category</label>
        <select
          id="report-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          data-cy="report-category"
        >
          <option value="">Choose a category…</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <label htmlFor="report-description">What is the bug? (one line)</label>
        <input
          id="report-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is it about, and what goes wrong?"
          data-cy="report-description"
        />

        <button type="submit" className={styles.primaryButton} data-cy="report-submit">
          Submit report
        </button>
      </div>

      <aside className={styles.categoryHelp} data-cy="category-help" aria-live="polite">
        {info ? (
          <>
            <h3>{category} bugs</h3>
            <p>{info.definition}</p>
            <p>
              <strong>Ask yourself:</strong> {info.askYourself}
            </p>
            <p>
              <strong>Example in another app:</strong> {info.example}
            </p>
            <p>
              <strong>Tell it apart:</strong> {info.tellApart}
            </p>
          </>
        ) : (
          <p>
            <strong>Not sure which type to pick?</strong> Choose a category and its meaning appears here,
            with an example, so you can decide before you submit. Choosing the right type earns full
            points.
          </p>
        )}
      </aside>

      {feedback && <Feedback feedback={feedback} />}
    </form>
  );
}

// The result of a report. Found bugs get a header with the points in a big badge,
// then the lesson. Other results (wrong, duplicate, incomplete) are one plain message.
function Feedback({ feedback }) {
  const isFound = feedback.status === "correct" || feedback.status === "partial";

  return (
    <div
      className={`${styles.feedback} ${styles[feedback.status]}`}
      role="status"
      data-cy="report-feedback"
      data-status={feedback.status}
    >
      {isFound ? (
        <>
          <div className={styles.feedbackHead}>
            <strong data-cy="report-headline">{feedback.headline}</strong>
            <span className={styles.pointsBadge} data-cy="report-points">
              {feedback.pointsLabel}
            </span>
          </div>
          {feedback.sections.map((section) => (
            <p key={section.label} className={styles.lesson}>
              <strong>{section.label}:</strong> {section.text}
            </p>
          ))}
        </>
      ) : (
        <p className={styles.lesson}>{feedback.message}</p>
      )}
    </div>
  );
}
