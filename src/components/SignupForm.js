"use client";

// "use client" tells Next.js this component runs in the browser (it needs state
// and click handlers). Components without it are rendered on the server.

import { useRef, useState } from "react";
import styles from "./SignupForm.module.css";
import Logo from "./Logo";
import {
  FIELD_RULES,
  getBugFlags,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "@/lib/signupValidation";

// Fake network delay (ms). The double-submit bug needs a gap between
// the first click and the account being created.
const SUBMIT_DELAY = 400;

// The written rules under a field. QAs test the field against this list.
function Rules({ title, rules, cy }) {
  return (
    <div className={styles.rules} data-cy={cy}>
      <p>{title}</p>
      <ul>
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </div>
  );
}

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
        <span className={styles.logo}>
          <Logo />
        </span>
        <h1 data-cy="store-name">
          Sole <span>Mate</span>
        </h1>
        <p data-cy="tagline">Join the club. Hit Sign Up to get first dibs on new drops.</p>
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
        <Rules title="Valid email:" rules={FIELD_RULES.email} cy="email-rules" />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-cy="password-input"
        />
        <p className={styles.error} data-cy="password-error">{errors.password}</p>
        <Rules title="Password rules:" rules={FIELD_RULES.password} cy="password-rules" />

        <label htmlFor="confirm">Confirm password</label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          data-cy="confirm-password-input"
        />
        <p className={styles.error} data-cy="confirm-password-error">{errors.confirm}</p>
        <Rules title="Confirm password:" rules={FIELD_RULES.confirm} cy="confirm-password-rules" />

        <button
          type="submit"
          className={styles.submit}
          disabled={!bugs.doubleSubmitCreatesTwo && submitting}
          data-cy="submit-button"
        >
          {/* BUG 1: the label is misspelled in the buggy version */}
          {bugs.buttonTypo ? "Sing Up" : "Sign Up"}
        </button>

        <p className={styles.rulesNote} data-cy="submit-rules">
          One submission creates exactly one account, even if you click more than once.
        </p>

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
