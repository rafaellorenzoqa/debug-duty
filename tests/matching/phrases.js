// Phrase fixture for the report matching (src/lib/matching.js).
//
// shouldMatch    - phrasings a player might write; the bug must be the BEST match.
// shouldNotMatch - praise, vague remarks, off-topic text or descriptions of correct
//                  behaviour; this bug must NOT match.
// Add a phrase here whenever a real report is judged wrongly, then fix the word lists.

export const phrases = {
  "visual-button-typo": {
    shouldMatch: [
      "the button says sing up",
      "sign up button is misspelled",
      "typo in the submit button text",
      "button label has a spelling mistake",
      "the cta says sing up instead of sign up",
      "wrong letter in the button text",
      "submit button text is spelt wrong",
    ],
    shouldNotMatch: [
      "the button is blue",
      "the submit button works",
      "the button is too small",
      "the sign up button looks great",
      "I clicked the button and nothing broke",
      "the form is missing upload instructions", // "sing up" hides inside "missing upload"
      "the confirm password label is nice and the same size",
    ],
  },

  "validation-email-format": {
    shouldMatch: [
      "email field accepts text with no at sign",
      "email accepts invalid formats like two @ or spaces",
      "the email field allows addresses with no domain",
      "email validation is missing, anything can be typed",
      "i typed a@@b.com and the email was accepted",
      "email field accepts spaces",
      "email does not follow the a@b.com mask",
    ],
    shouldNotMatch: [
      "the email field looks fine",
      "email address is displayed correctly",
      "the email is valid and works",
      "email field accepts a valid address",
      "the email label is too small",
      "password field is valid",
      "a confirmation email is sent after signup",
    ],
  },

  "edge-password-special-char": {
    shouldMatch: [
      "ampersand password rejected",
      "password rejects the & special character",
      "the password field does not accept the & symbol",
      "password with & is refused as invalid",
      "special character & not allowed in password",
      "password says invalid characters when i use &",
      "can't use ampersand in password",
    ],
    shouldNotMatch: [
      "password field is valid",
      "password has a problem",
      "the password label is nice",
      "password accepts special characters fine",
      "password must have 8 characters",
      "special offers banner is cut off",
      "the confirm password label is nice and the same size",
    ],
  },

  "logic-confirm-password-mismatch": {
    shouldMatch: [
      "confirm password is not compared",
      "confirm password does not match but is accepted",
      "i can retype a different password in the second box and it is accepted",
      "confirm password accepts anything",
      "confirm password mismatch is accepted",
      "confirm field ignores what i typed in password",
      "the confirm password check is not checked at all",
    ],
    shouldNotMatch: [
      "the confirm password label is nice and the same size",
      "confirm password field looks fine",
      "the confirm password matches the page style",
      "confirm password field is empty on load",
      "the confirm button is green",
      "the password label looks different on mobile",
      "email field accepts text with no at sign",
    ],
  },

  "behavior-double-submit": {
    shouldMatch: [
      "clicking submit twice makes two accounts",
      "double click creates a duplicate account",
      "two accounts created from one click",
      "pressing sign up quickly creates duplicate users",
      "double submit creates two users",
      "repeated clicks on submit create extra accounts",
      "i double clicked sign up and got 2 accounts",
    ],
    shouldNotMatch: [
      "I clicked the button and nothing broke",
      "the page loads again after refresh",
      "the submit button is twice as big",
      "the double border on the submit button looks odd",
      "account was created successfully after one click",
      "the accounts created counter is displayed correctly",
      "clicking submit creates one account",
    ],
  },
};

// Phrases that describe no bug at all: they must match nothing (every bug is checked).
export const matchNothing = [
  "the email field looks fine",
  "the button is blue",
  "password field is valid",
  "the submit button works",
  "I clicked the button and nothing broke",
  "the page loads again after refresh",
  "email address is displayed correctly",
  "the confirm password label is nice and the same size",
  "the page background is too blue",
  "great game",
];

// When a phrase matches more than one bug, the bug with the most matched words wins.
export const ranking = [
  {
    text: "the email and the confirm password accept anything",
    winner: "validation-email-format",
    alsoMatches: ["logic-confirm-password-mismatch"],
  },
];
