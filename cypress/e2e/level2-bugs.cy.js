// For each of the five Level 2 bugs: one test proves the bug IS present in the buggy
// version, and one proves it is ABSENT in the clean version (same steps, inverted
// assertions). The clean version is the hidden /level-2?mode=clean.
//
// Every expected total is worked out by hand from the price list, never read from
// the app's code: if the code were wrong, a test that copied it would agree with it.
//
// In the buggy version all five bugs are on at the same time, so each test picks
// values that only the bug under test can affect. For example, no test about
// fillings uses Pistachio Cream as the second filling (Bug 4 makes it free) or
// Fondant on 25cm (Bug 2 makes it free).

describe("Level 2: buggy version (each bug is present)", () => {
  beforeEach(() => {
    cy.visitLevel2("buggy");
  });

  it("Bug 1 (Visual): the Blush Pink swatch is yellow", () => {
    cy.buildCake({ color: "Blush Pink" });
    // rgb(255, 230, 128) is Butter Yellow's colour, not Blush Pink's.
    cy.get("[data-cy=color-swatch]").should("have.css", "background-color", "rgb(255, 230, 128)");
  });

  it("Bug 2 (Logic): Fondant on 25cm adds $0, so it costs the same as Buttercream", () => {
    // Fondant 25cm, Vanilla Cream, Cloud White: $65 + $0 (should be $16) + $4 + $0 = $69.
    cy.buildCake({ cakeType: "Fondant", size: "25cm" });
    // Fondant really is selected, so the $69 is not just the Buttercream price.
    cy.get("[data-cy=cake-type-select]").should("have.value", "Fondant");
    cy.get("[data-cy=total]").should("have.text", "$69.00");
  });

  it("Bug 3 (Logic): the same flavor twice is accepted with no error and charged twice", () => {
    // Buttercream 15cm, Lemon Curd + Lemon Curd, Cloud White: $30 + $6 + $6 = $42.
    cy.buildCake({ fillingCount: 2, firstFilling: "Lemon Curd", secondFilling: "Lemon Curd" });
    // The total shows both Lemon Curds were charged, so the duplicate state was reached...
    cy.get("[data-cy=total]").should("have.text", "$42.00");
    // ...and yet there is no error.
    cy.get("[data-cy=filling-2-error]").should("be.empty");
  });

  it("Bug 4 (Edge case): Pistachio Cream as the second filling adds $0", () => {
    // Buttercream 15cm, Vanilla Cream + Pistachio Cream: $30 + $4 + $0 (should be $9) = $34.
    cy.buildCake({ fillingCount: 2, secondFilling: "Pistachio Cream" });
    // Pistachio Cream really is the second filling, so the $34 is not just "no second filling".
    cy.get("[data-cy=filling-2-select]").should("have.value", "Pistachio Cream");
    cy.get("[data-cy=total]").should("have.text", "$34.00");
  });

  it("Bug 5 (Behavior): after going back to 1 filling, the removed second filling is still charged", () => {
    cy.buildCake({ fillingCount: 2, secondFilling: "Lemon Curd" });
    cy.get("[data-cy=total]").should("have.text", "$40.00");

    cy.get("[data-cy=filling-count-1]").check({ force: true });
    // The controls look reset, which is what makes this bug hard to spot...
    cy.get("[data-cy=filling-2-select]").should("be.disabled").and("have.value", "");
    // ...but Lemon Curd's $6 stays in the total: $30 + $4 + $6 = $40 instead of $34.
    cy.get("[data-cy=total]").should("have.text", "$40.00");
  });
});

// Some of these clean tests overlap with level2-bakery.cy.js on purpose: every bug
// needs its own present/absent pair in this file, so do not delete either copy.
describe("Level 2: clean version (no bugs)", () => {
  beforeEach(() => {
    cy.visitLevel2("clean");
  });

  it("Bug 1 absent: the Blush Pink swatch is pink", () => {
    cy.buildCake({ color: "Blush Pink" });
    // #F7C6D0 from the approved spec.
    cy.get("[data-cy=color-swatch]").should("have.css", "background-color", "rgb(247, 198, 208)");
  });

  it("Bug 2 absent: Fondant on 25cm adds its $16 surcharge", () => {
    // Fondant 25cm, Vanilla Cream, Cloud White: $65 + $16 + $4 + $0 = $85.
    cy.buildCake({ cakeType: "Fondant", size: "25cm" });
    cy.get("[data-cy=cake-type-select]").should("have.value", "Fondant");
    cy.get("[data-cy=total]").should("have.text", "$85.00");
  });

  it("Bug 3 absent: the same flavor twice shows an error and no total", () => {
    cy.buildCake({ fillingCount: 2, firstFilling: "Lemon Curd", secondFilling: "Lemon Curd" });
    cy.get("[data-cy=filling-2-error]").should("have.text", "Pick two different fillings.");
    cy.get("[data-cy=total]").should("have.text", "—");
  });

  it("Bug 4 absent: Pistachio Cream as the second filling adds its $9", () => {
    // Buttercream 15cm, Vanilla Cream + Pistachio Cream: $30 + $4 + $9 = $43.
    cy.buildCake({ fillingCount: 2, secondFilling: "Pistachio Cream" });
    cy.get("[data-cy=filling-2-select]").should("have.value", "Pistachio Cream");
    cy.get("[data-cy=total]").should("have.text", "$43.00");
  });

  it("Bug 5 absent: going back to 1 filling removes the second filling from the total", () => {
    cy.buildCake({ fillingCount: 2, secondFilling: "Lemon Curd" });
    cy.get("[data-cy=total]").should("have.text", "$40.00");

    cy.get("[data-cy=filling-count-1]").check({ force: true });
    cy.get("[data-cy=filling-2-select]").should("be.disabled").and("have.value", "");
    // Back to the default cake: $30 + $4 = $34.
    cy.get("[data-cy=total]").should("have.text", "$34.00");
  });
});
