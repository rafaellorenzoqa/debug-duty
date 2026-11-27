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

  // ---- Level 2: 1Up Bakery ----

  "visual-blush-swatch": {
    shouldMatch: [
      "blush pink swatch shows yellow",
      "the color preview does not match the name",
      "the swatch for blush pink is yellow",
      "selecting blush pink shows a yellow swatch",
      "the colour swatch is wrong for blush pink",
      "blush pink preview shows the wrong colour",
      "pink is shown as a yellow square",
    ],
    shouldNotMatch: [
      "the swatch looks nice",
      "blush pink is a pretty color",
      "blush pink costs $3",
      "the swatch changes when i pick a color",
      "the butter yellow swatch looks right",
      "the outside color dropdown has eight colors",
      "the color preview matches the name",
    ],
  },

  "logic-fondant-25cm": {
    shouldMatch: [
      "fondant on the 25cm cake costs the same as buttercream",
      "fondant surcharge missing for the biggest size",
      "fondant is free on 25cm",
      "25cm fondant adds nothing to the price",
      "the fondant surcharge is $0 on the largest cake",
      "no extra charge for fondant on a 25 cm cake",
      "fondant on 25cm should add $16 but the total does not change",
    ],
    shouldNotMatch: [
      "fondant is more expensive than buttercream",
      "the 25cm option is listed last",
      "fondant costs extra on the 15cm cake",
      "the 25cm cake is the most expensive size",
      "buttercream is the default cake type",
      "fondant is a nice option",
      "fondant on 25cm adds $16",
    ],
  },

  "logic-duplicate-filling": {
    shouldMatch: [
      "i can pick the same filling twice",
      "both fillings can be vanilla cream",
      "the same flavor is accepted in both filling dropdowns",
      "no error when both fillings are the same",
      "duplicate filling is allowed and charged twice",
      "choosing the same flavour twice shows no error",
      "the two fillings dont have to be different",
    ],
    shouldNotMatch: [
      "the second dropdown is disabled with one filling",
      "two fillings cost more than one",
      "the second dropdown has the same six flavors",
      "i picked two different fillings and the total is right",
      "vanilla cream is the default filling",
      "the filling radio buttons work",
      "chocolate ganache filling sounds great",
    ],
  },

  "edge-last-flavor-second-filling": {
    shouldMatch: [
      "pistachio cream as second filling adds nothing to the total",
      "the last flavor in the second dropdown is free",
      "pistachio is free as the second filling",
      "second filling pistachio costs $0",
      "choosing pistachio cream as the second flavor does not change the total",
      "the last flavour is not charged in the second dropdown",
      "pistachio second filling is not added to the price",
    ],
    shouldNotMatch: [
      "pistachio cream is the most expensive flavor",
      "the second dropdown has the same six flavors",
      "pistachio cream as first filling costs $9",
      "the second filling dropdown is disabled with one filling",
      "the last flavor is pistachio cream",
      "pistachio as the second filling adds $9",
      "the second filling adds to the total",
    ],
  },

  "behavior-stale-second-filling": {
    shouldMatch: [
      "after switching back to one filling the total still includes the second filling",
      "total does not go down when i go from two fillings to one",
      "the removed second filling is still charged",
      "going back to 1 filling keeps the second filling price",
      "second filling price stays in the total after choosing one filling",
      "the total is wrong after changing from 2 fillings back to 1",
      "switching to one filling doesnt remove the second filling from the price",
    ],
    shouldNotMatch: [
      "the total updates when i change the size",
      "switching to two fillings enables the second dropdown",
      "the second dropdown resets when i choose one filling",
      "going back to one filling disables the second dropdown",
      "the total goes down when i remove the second filling",
      "one filling is the default",
      "the second filling price is listed in the price list",
    ],
  },
};

// Phrases that describe no bug at all, per level: they must match nothing (every bug of
// that level is checked).
export const matchNothing = {
  "level-1": [
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
  ],
  "level-2": [
    "the cake builder looks great",
    "the total updates when i change the size",
    "the swatch looks nice",
    "blush pink is a pretty color",
    "two fillings cost more than one",
    "pistachio cream is the most expensive flavor",
    "the price list is easy to read",
    "great game",
  ],
};

// When a phrase matches more than one bug, the bug with the most matched words wins (per level).
export const ranking = {
  "level-1": [
    {
      text: "the email and the confirm password accept anything",
      winner: "validation-email-format",
      alsoMatches: ["logic-confirm-password-mismatch"],
    },
  ],
  "level-2": [],
};
