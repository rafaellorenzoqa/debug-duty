// Game flow: start screen, reporting bugs, markers, counter, results screen.
// Cypress clears localStorage between tests, so the best score starts empty each time.

// One valid report per bug (category + description that matches its keywords).
const REPORTS = [
  { id: "visual-button-typo", category: "Visual", text: "The button has a typo", points: 10 },
  { id: "validation-email-no-at", category: "Validation", text: "Email accepted without an @", points: 10 },
  { id: "edge-password-special-char", category: "Edge case", text: "Password rejects the & special character", points: 20 },
  { id: "logic-confirm-password-mismatch", category: "Logic", text: "Confirm password does not match but is accepted", points: 20 },
  { id: "behavior-double-submit", category: "Behavior", text: "Double click creates a duplicate account", points: 40 },
];

describe("Start screen", () => {
  it("shows the briefing and the Start button opens Level 1", () => {
    cy.visit("/");
    cy.get("[data-cy=start-screen]").should("contain", "QA wants this signup page signed off by five o'clock");
    cy.get("[data-cy=start-button]").click();
    cy.location("pathname").should("eq", "/level-1");
    cy.get("[data-cy=game-panel]").should("be.visible");
  });
});

describe("Game panel at the start", () => {
  it("shows five dimmed markers (2 easy, 2 medium, 1 hard) and 0 of 5 found", () => {
    cy.visitLevel1();
    cy.get("[data-cy=markers] > li").should("have.length", 5);
    cy.get("[data-cy=markers] [data-difficulty=easy]").should("have.length", 2);
    cy.get("[data-cy=markers] [data-difficulty=medium]").should("have.length", 2);
    cy.get("[data-cy=markers] [data-difficulty=hard]").should("have.length", 1);
    cy.get("[data-cy=markers] [data-found=true]").should("not.exist");
    cy.get("[data-cy=bug-counter]").should("have.text", "0 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "0");
  });
});

describe("Reporting bugs", () => {
  beforeEach(() => {
    cy.visitLevel1();
  });

  it("a correct report lights the right marker, updates the counter and scores", () => {
    const { id, category, text, points } = REPORTS[0];
    cy.reportBug(category, text);

    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "correct");
    cy.get(`[data-cy=marker-${id}]`).should("have.attr", "data-found", "true");
    cy.get("[data-cy=markers] [data-found=true]").should("have.length", 1);
    cy.get("[data-cy=bug-counter]").should("have.text", "1 of 5 found");
    cy.get("[data-cy=score]").should("have.text", String(points));
  });

  it("a duplicate report is rejected and gives no points", () => {
    const { category, text, points } = REPORTS[0];
    cy.reportBug(category, text);
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "correct");

    cy.reportBug(category, text);
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "duplicate");
    cy.get("[data-cy=bug-counter]").should("have.text", "1 of 5 found");
    cy.get("[data-cy=score]").should("have.text", String(points));
  });

  it("a wrong report gives no points and lights no marker", () => {
    cy.reportBug("Visual", "The page background is too blue");

    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "wrong");
    cy.get("[data-cy=markers] [data-found=true]").should("not.exist");
    cy.get("[data-cy=bug-counter]").should("have.text", "0 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "0");
  });

  it("the right text under the wrong category is not accepted", () => {
    cy.reportBug("Logic", "The button has a typo");

    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "wrong");
    cy.get("[data-cy=score]").should("have.text", "0");
  });

  it("an incomplete report (no category) asks for more and scores nothing", () => {
    cy.get("[data-cy=report-bug-button]").click();
    cy.get("[data-cy=report-description]").type("The button has a typo");
    cy.get("[data-cy=report-submit]").click();

    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "invalid");
    cy.get("[data-cy=score]").should("have.text", "0");
  });
});

describe("Finishing the level", () => {
  it("finding all five bugs shows the results screen with the full score", () => {
    cy.visitLevel1();
    REPORTS.forEach(({ category, text }, index) => {
      cy.reportBug(category, text);
      if (index < REPORTS.length - 1) {
        cy.get("[data-cy=bug-counter]").should("have.text", `${index + 1} of 5 found`);
      }
    });

    cy.get("[data-cy=results-screen]").should("be.visible");
    cy.get("[data-cy=results-score]").should("have.text", "100");
    cy.get("[data-cy=results-found]").should("contain", "5 of 5");
    cy.get("[data-cy=results-best]").should("contain", "100");
  });

  it("Play again starts a fresh game", () => {
    cy.visitLevel1();
    REPORTS.forEach(({ category, text }) => cy.reportBug(category, text));
    cy.get("[data-cy=play-again]").click();

    cy.get("[data-cy=bug-counter]").should("have.text", "0 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "0");
  });
});
