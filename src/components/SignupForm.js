"use client";

// "use client" tells Next.js this component runs in the browser (it needs state
// and click handlers). Components without it are rendered on the server.

import { useRef, useState } from "react";
import styles from "./SignupForm.module.css";
import {
  getBugFlags,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "@/lib/signupValidation";

// Fake network delay (ms). The double-submit bug needs a gap between
// the first click and the account being created.
const SUBMIT_DELAY = 400;

export default function SignupForm({ isClean = false }) {
  const bugs = getBugFlags(isClean);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [accountsCreated, setAccountsCreated] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const inFlight = useRef(false);

  function handleSubmit(event) {
    event.preventDefault();

    // Clean version: ignore a second submit while the first one is running.
    // BUG 5: the buggy version skips this guard, so a double click creates two accounts.
    if (!bugs.doubleSubmitCreatesTwo && inFlight.current) return;

    const newErrors = {
      email: validateEmail(email, bugs),
      password: validatePassword(password, bugs),
      confirm: validateConfirmPassword(password, confirm, bugs),
    };
    setErrors(newErrors);
    setSuccess(false);
    if (newErrors.email || newErrors.password || newErrors.confirm) return;

    inFlight.current = true;
    setSubmitting(true);
    setTimeout(() => {
      setAccountsCreated((count) => count + 1);
      setSuccess(true);
      setSubmitting(false);
      inFlight.current = false;
    }, SUBMIT_DELAY);
  }

  return (
    <div
      className={styles.page}
      data-cy="signup-page"
      data-mode={isClean ? "clean" : "buggy"}
    >
      <header className={styles.brand}>
        <span className={styles.logo}>👟</span>
        <h1 data-cy="store-name">Sole Mate</h1>
        <p>Join the club. Get first dibs on new drops.</p>
      </header>

      <form className={styles.card} onSubmit={handleSubmit} noValidate data-cy="signup-form">
        <h2>Create your account</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-cy="email-input"
        />
        <p className={styles.error} data-cy="email-error">{errors.email}</p>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-cy="password-input"
        />
        <p className={styles.error} data-cy="password-error">{errors.password}</p>

        <label htmlFor="confirm">Confirm password</label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          data-cy="confirm-password-input"
        />
        <p className={styles.error} data-cy="confirm-password-error">{errors.confirm}</p>

        <button
          type="submit"
          className={styles.submit}
          disabled={!bugs.doubleSubmitCreatesTwo && submitting}
          data-cy="submit-button"
        >
          {/* BUG 1: the label is misspelled in the buggy version */}
          {bugs.buttonTypo ? "Sing Up" : "Sign Up"}
        </button>

        {success && (
          <p className={styles.success} data-cy="success-message">
            Account created. Welcome to Sole Mate!
          </p>
        )}
      </form>

      <p className={styles.counter}>
        Accounts created: <strong data-cy="accounts-created">{accountsCreated}</strong>
      </p>
    </div>
  );
}
