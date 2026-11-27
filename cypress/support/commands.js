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

// Opens Level 2 (1Up Bakery). Pass "clean" to get the version with no bugs
// (the hidden testing switch: /level-2?mode=clean).
Cypress.Commands.add("visitLevel2", (mode = "buggy") => {
  cy.visit(mode === "clean" ? "/level-2?mode=clean" : "/level-2");
  cy.get("[data-cy=bakery-page]").should("have.attr", "data-mode", mode);
});

// Builds a cake on the Level 2 form. Any field you leave out keeps the page's
// default (Buttercream, 15cm, 1 filling of Vanilla Cream, Cloud White), so each
// test only spells out what it cares about.
// secondFilling is only picked when fillingCount is 2, because the second
// dropdown is disabled with 1 filling.
// After every change we assert the value stuck. Otherwise a select that silently
// failed could leave a cake whose total happens to equal the expected one.
//
// Warning: in the BUGGY version, calling this with fillingCount 1 on a page that
// already has a 2-filling cake triggers Bug 5 (the old second filling stays in the
// total). Start each cake from a fresh page.
Cypress.Commands.add("buildCake", (overrides = {}) => {
  const cake = {
    cakeType: "Buttercream",
    size: "15cm",
    fillingCount: 1,
    firstFilling: "Vanilla Cream",
    secondFilling: "",
    color: "Cloud White",
    ...overrides,
  };
  cy.get("[data-cy=cake-type-select]").select(cake.cakeType).should("have.value", cake.cakeType);
  cy.get("[data-cy=size-select]").select(cake.size).should("have.value", cake.size);
  // The radios are visually hidden inside pill labels, so force the check.
  cy.get(`[data-cy=filling-count-${cake.fillingCount}]`).check({ force: true }).should("be.checked");
  cy.get("[data-cy=filling-1-select]").select(cake.firstFilling).should("have.value", cake.firstFilling);
  if (cake.fillingCount === 2 && cake.secondFilling) {
    cy.get("[data-cy=filling-2-select]").select(cake.secondFilling).should("have.value", cake.secondFilling);
  }
  cy.get("[data-cy=color-select]").select(cake.color).should("have.value", cake.color);
});
