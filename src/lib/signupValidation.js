// Validation rules for the Sole Mate signup form.
//
// Every deliberate bug is controlled by one switch in `getBugFlags`.
// - Buggy version: all switches are ON  (the bugs are present).
// - Clean version: all switches are OFF (everything works correctly).
// Keeping the bugs behind named switches keeps the two versions from drifting apart.

// The special characters the password may contain. The form shows this exact list
// to the player (it is the "requirement" a tester checks the field against), and the
// validation below uses the same list, so the two can never disagree by accident.
export const PASSWORD_SPECIAL_CHARS = "!@#$%^&*()_+-=.,?";

// The written rules shown on the form. In BOTH versions the text is the same: it is the
// spec. In the buggy version the code does not follow the spec, and that is the bug.
export const FIELD_RULES = {
  email: [
    "Exactly one @, with text before it",
    "A domain after the @ with a dot in it and text on both sides, like example.com",
    "No spaces",
    "Valid: name@example.com",
  ],
  password: [
    "At least 8 characters",
    "At least 1 letter and 1 number",
    `Allowed special characters: ${PASSWORD_SPECIAL_CHARS.split("").join(" ")}`,
    "No spaces and no other characters",
  ],
  confirm: ["Must be exactly the same as the password"],
};

export function getBugFlags(isClean) {
  const bugged = !isClean;
  return {
    buttonTypo: bugged, // Bug 1 (Visual): button says "Sing Up"
    emailAcceptsNoAt: bugged, // Bug 2 (Validation): email without "@" is accepted
    passwordRejectsAmpersand: bugged, // Bug 3 (Edge case): "&" is wrongly rejected
    confirmIgnoresValue: bugged, // Bug 4 (Logic): mismatching confirm password is accepted
    doubleSubmitCreatesTwo: bugged, // Bug 5 (Behavior): double click creates two accounts
  };
}

export function validateEmail(email, bugs) {
  if (!email) return "Email is required";
  if (bugs.emailAcceptsNoAt) return ""; // BUG: any non-empty text passes
  const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return looksValid ? "" : "Enter a valid email address";
}

export function validatePassword(password, bugs) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain a letter and a number";
  }
  // Allowed: letters, numbers and the special characters listed above.
  // BUG: in the buggy version "&" is left out, although the rules list it.
  const allowedSpecials = bugs.passwordRejectsAmpersand
    ? PASSWORD_SPECIAL_CHARS.replace("&", "")
    : PASSWORD_SPECIAL_CHARS;
  const allAllowed = [...password].every(
    (char) => /[A-Za-z0-9]/.test(char) || allowedSpecials.includes(char),
  );
  return allAllowed ? "" : "Password contains invalid characters";
}

export function validateConfirmPassword(password, confirm, bugs) {
  if (!confirm) return "Please confirm your password";
  if (bugs.confirmIgnoresValue) return ""; // BUG: the value is never compared
  return confirm === password ? "" : "Passwords do not match";
}
