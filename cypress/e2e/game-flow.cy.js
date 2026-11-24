// Game flow: start screen, reporting bugs, markers, counter, results screen.
// Cypress clears localStorage between tests, so the best score starts empty each time.

// One valid report per bug (category + a description accurate enough to match the bug).
const REPORTS = [
  { id: "visual-button-typo", category: "Visual", text: "The button has a typo", points: 10 },
  { id: "validation-email-format", category: "Validation", text: "Email accepts invalid formats like two @ or spaces", points: 10 },
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

  it("a correct report explains the type and shows the points in a badge", () => {
    cy.reportBug("Validation", "Email accepts invalid formats like two @ or spaces");

    cy.get("[data-cy=report-feedback]")
      .should("have.attr", "data-status", "correct")
      .and("contain", "Why this is a Validation bug")
      .and("contain", 'What "Validation" means')
      .and("contain", "Testing tip")
      .and("contain", "equivalence partitioning");
    cy.get("[data-cy=report-points]").should("have.text", "+10 pts");
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

  it("a real bug under the wrong category gives half points and names the real category", () => {
    cy.reportBug("Logic", "The button has a typo");

    cy.get("[data-cy=report-feedback]")
      .should("have.attr", "data-status", "partial")
      .and("contain", 'You chose "Logic"')
      .and("contain", 'The correct type is "Visual"')
      .and("contain", "Why this is a Visual bug")
      .and("contain", "How to tell them apart")
      .and("contain", "Testing tip");
    cy.get("[data-cy=report-points]").should("have.text", "+5 of 10 pts");
    cy.get("[data-cy=marker-visual-button-typo]").should("have.attr", "data-found", "true");
    cy.get("[data-cy=bug-counter]").should("have.text", "1 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "5");
  });

  it("a half-points bug cannot be reported again, not even under the right category", () => {
    cy.reportBug("Logic", "The button has a typo");
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "partial");

    cy.reportBug("Visual", "The button has a typo");
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "duplicate");
    cy.get("[data-cy=score]").should("have.text", "5");
  });

  it("every bug pays half points under a wrong category", () => {
    // Each bug reported under a category that is not its own.
    const wrongCategory = {
      "visual-button-typo": "Behavior",
      "validation-email-format": "Visual",
      "edge-password-special-char": "Validation",
      "logic-confirm-password-mismatch": "Edge case",
      "behavior-double-submit": "Logic",
    };
    let expected = 0;
    REPORTS.forEach(({ id, text, points }, index) => {
      expected += points / 2;
      cy.reportBug(wrongCategory[id], text);
      if (index < REPORTS.length - 1) {
        cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "partial");
        cy.get("[data-cy=score]").should("have.text", String(expected));
      }
    });
    // The fifth bug finishes the level, so the results screen replaces the panel.
    cy.get("[data-cy=results-score]").should("have.text", String(expected));
  });

  it("a vague report that only names the area does not match", () => {
    cy.reportBug("Validation", "email");
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "wrong");

    cy.reportBug("Visual", "The email label looks small");
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "wrong");

    cy.reportBug("Edge case", "password has a problem");
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "wrong");

    cy.get("[data-cy=score]").should("have.text", "0");
  });

  it("an accurate report in different words still matches", () => {
    cy.reportBug("Validation", "The email field allows addresses with no domain");
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "correct");

    cy.reportBug("Logic", "I can retype a different password in the second box and it is accepted");
    cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "correct");
  });

  it("a category with no matching bug text is still wrong", () => {
    cy.reportBug("Logic", "The page background is too blue");

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

describe("Category help in the report form", () => {
  beforeEach(() => {
    cy.visitLevel1();
    cy.get("[data-cy=report-bug-button]").click();
  });

  it("invites the player to pick a category before one is chosen", () => {
    cy.get("[data-cy=category-help]").should("contain", "Not sure which type to pick?");
  });

  it("explains each category as soon as it is selected, before submitting", () => {
    const expected = {
      Visual: "looks or reads wrong",
      Validation: "accepts input that its rules say it must reject",
      "Edge case": "unusual, extreme or boundary value",
      Logic: "business rule is missing, ignored or implemented wrongly",
      Behavior: "how the app reacts to the way you use it",
    };
    Object.entries(expected).forEach(([category, text]) => {
      cy.get("[data-cy=report-category]").select(category);
      cy.get("[data-cy=category-help]")
        .should("contain", `${category} bugs`)
        .and("contain", text)
        .and("contain", "Ask yourself")
        .and("contain", "Example in another app")
        .and("contain", "Tell it apart");
    });
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

  it("the results screen shows half points for bugs reported under the wrong category", () => {
    cy.visitLevel1();
    cy.reportBug("Logic", "The button has a typo"); // Visual bug, wrong category: 5 of 10
    REPORTS.slice(1).forEach(({ category, text }) => cy.reportBug(category, text));

    cy.get("[data-cy=results-score]").should("have.text", "95");
    cy.get("[data-cy=result-visual-button-typo]")
      .should("have.attr", "data-partial", "true")
      .and("contain", "5 pts")
      .and("contain", "it is a Visual bug");
    cy.get("[data-cy=result-validation-email-format]").should("have.attr", "data-partial", "false");
  });

  it("Play again starts a fresh game", () => {
    cy.visitLevel1();
    REPORTS.forEach(({ category, text }) => cy.reportBug(category, text));
    cy.get("[data-cy=play-again]").click();

    cy.get("[data-cy=bug-counter]").should("have.text", "0 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "0");
  });
});
