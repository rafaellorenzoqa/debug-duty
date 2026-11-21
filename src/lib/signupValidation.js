// Validation rules for the Sole Mate signup form.
//
// Every deliberate bug is controlled by one switch in `getBugFlags`.
// - Buggy version: all switches are ON  (the bugs are present).
// - Clean version: all switches are OFF (everything works correctly).
// Keeping the bugs behind named switches keeps the two versions from drifting apart.

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
  // Allowed: letters, numbers and common special characters.
  const allowed = bugs.passwordRejectsAmpersand
    ? /^[A-Za-z0-9!@#$%^*()_+\-=.,?]+$/ // BUG: "&" is missing from this list
    : /^[A-Za-z0-9!@#$%^&*()_+\-=.,?]+$/;
  return allowed.test(password) ? "" : "Password contains invalid characters";
}

export function validateConfirmPassword(password, confirm, bugs) {
  if (!confirm) return "Please confirm your password";
  if (bugs.confirmIgnoresValue) return ""; // BUG: the value is never compared
  return confirm === password ? "" : "Passwords do not match";
}
