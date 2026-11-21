"use client";

import { useState } from "react";
import styles from "./Game.module.css";
import { CATEGORIES } from "@/data/categories";

// The "Report bug" form: a category dropdown and a one-line description.
// It does not judge the report itself. It hands it to `onReport`.
export default function ReportForm({ onReport, feedback }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const outcome = onReport(category, description);
    // Clear the text after a real attempt, but keep it when the form was incomplete.
    if (outcome.status !== "invalid") setDescription("");
  }

  return (
    <form className={styles.reportForm} onSubmit={handleSubmit} data-cy="report-form">
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
        data-cy="report-description"
      />

      <button type="submit" className={styles.primaryButton} data-cy="report-submit">
        Submit report
      </button>

      {feedback && (
        <p
          className={`${styles.feedback} ${styles[feedback.status]}`}
          role="status"
          data-cy="report-feedback"
          data-status={feedback.status}
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}
