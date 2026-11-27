// Guard test: when the server runs WITHOUT ENABLE_CLEAN_MODE (like the live site),
// the hidden clean version must not be reachable.
//
// This spec only makes sense against a server started without the flag, so it is
// opt-in: it runs only when `--expose EXPECT_CLEAN_MODE_BLOCKED=true` is passed
// (see `npm run test:e2e:guard`). In every other run it is reported as pending.

const expectBlocked = String(Cypress.expose("EXPECT_CLEAN_MODE_BLOCKED")) === "true";
const describeWhenGuarding = expectBlocked ? describe : describe.skip;

describeWhenGuarding("Clean mode is blocked in production", () => {
  it("ignores the clean query parameter and serves the buggy page", () => {
    cy.visit("/level-1?mode=clean");
    cy.get("[data-cy=signup-page]").should("have.attr", "data-mode", "buggy");
    cy.get("[data-cy=submit-button]").should("have.text", "Sing Up");
  });

  it("ignores the clean query parameter on Level 2 and serves the buggy bakery", () => {
    cy.visit("/level-2?mode=clean");
    cy.get("[data-cy=bakery-page]").should("have.attr", "data-mode", "buggy");
    // Bug 1 is visible: the Blush Pink swatch is yellow (Butter Yellow's colour).
    cy.get("[data-cy=color-select]").select("Blush Pink");
    cy.get("[data-cy=color-swatch]").should("have.css", "background-color", "rgb(255, 230, 128)");
  });
});
