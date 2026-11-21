// Custom commands: small reusable helpers. All selectors use data-cy attributes.

// Opens Level 1. Pass "clean" to get the version with no bugs
// (the hidden testing switch: /level-1?mode=clean).
Cypress.Commands.add("visitLevel1", (mode = "buggy") => {
  cy.visit(mode === "clean" ? "/level-1?mode=clean" : "/level-1");
  cy.get("[data-cy=signup-page]").should("have.attr", "data-mode", mode);
});

// Fills the signup form. Any field you leave out gets a valid default,
// so each test only spells out the value it cares about.
Cypress.Commands.add("fillSignup", (overrides = {}) => {
  const values = {
    email: "tester@solemate.com",
    password: "Passw0rd!",
    confirm: "Passw0rd!",
    ...overrides,
  };
  cy.get("[data-cy=email-input]").clear().type(values.email);
  cy.get("[data-cy=password-input]").clear().type(values.password);
  cy.get("[data-cy=confirm-password-input]").clear().type(values.confirm);
});

// Sends a bug report through the game panel.
Cypress.Commands.add("reportBug", (category, description) => {
  // Open the report form only if it is closed. We look inside <body> because
  // cy.get would fail (and retry) when the form is not on the page.
  cy.get("body").then(($body) => {
    if ($body.find("[data-cy=report-form]").length === 0) {
      cy.get("[data-cy=report-bug-button]").click();
    }
  });
  cy.get("[data-cy=report-category]").select(category);
  cy.get("[data-cy=report-description]").clear().type(description);
  cy.get("[data-cy=report-submit]").click();
});
