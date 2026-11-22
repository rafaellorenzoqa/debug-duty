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
});
