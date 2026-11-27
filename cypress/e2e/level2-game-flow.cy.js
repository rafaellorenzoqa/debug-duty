// Level 2 game flow: reporting the bakery's bugs through the same game panel as
// Level 1, the results screen of the last level, and the navigation between levels.
// Cypress clears localStorage between tests, so the best score starts empty each time.

// One valid report per Level 2 bug, in marker order (1 easy, 3 medium, 1 hard).
const REPORTS = [
  { id: "visual-blush-swatch", difficulty: "easy", category: "Visual", text: "blush pink swatch shows yellow", points: 10 },
  { id: "logic-fondant-25cm", difficulty: "medium", category: "Logic", text: "fondant on the 25cm cake costs the same as buttercream", points: 20 },
  { id: "logic-duplicate-filling", difficulty: "medium", category: "Logic", text: "i can pick the same filling twice", points: 20 },
  { id: "edge-last-flavor-second-filling", difficulty: "medium", category: "Edge case", text: "pistachio cream as second filling adds nothing to the total", points: 20 },
  { id: "behavior-stale-second-filling", difficulty: "hard", category: "Behavior", text: "after switching back to one filling the total still includes the second filling", points: 30 },
];

// Level 1 reports, only used to finish Level 1 and reach its Next level button.
const LEVEL1_REPORTS = [
  { category: "Visual", text: "The button has a typo" },
  { category: "Validation", text: "Email accepts invalid formats like two @ or spaces" },
  { category: "Edge case", text: "Password rejects the & special character" },
  { category: "Logic", text: "Confirm password does not match but is accepted" },
  { category: "Behavior", text: "Double click creates a duplicate account" },
];

describe("Level 2: navigation between levels", () => {
  it("the Level 2 card on the start screen opens /level-2", () => {
    cy.visit("/");
    cy.get("[data-cy=start-level-2]").should("contain", "1Up Bakery").click();
    cy.location("pathname").should("eq", "/level-2");
    cy.get("[data-cy=bakery-page]").should("have.attr", "data-mode", "buggy");
    cy.get("[data-cy=game-panel]").should("be.visible");
  });

  it("finishing Level 1 offers Next level: 1Up Bakery, which opens a fresh Level 2 game", () => {
    cy.visitLevel1();
    LEVEL1_REPORTS.forEach(({ category, text }) => cy.reportBug(category, text));
    cy.get("[data-cy=results-screen]").should("be.visible");

    cy.get("[data-cy=next-level]").should("have.text", "Next level: 1Up Bakery").click();
    cy.location("pathname").should("eq", "/level-2");
    cy.get("[data-cy=bakery-page]").should("have.attr", "data-mode", "buggy");
    // Level 1's finished game must not carry over.
    cy.get("[data-cy=bug-counter]").should("have.text", "0 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "0");
    cy.get("[data-cy=markers] [data-found=true]").should("not.exist");
  });
});

describe("Level 2: game panel at the start", () => {
  it("shows five dimmed markers in order (1 easy, 3 medium, 1 hard) and 0 of 5 found", () => {
    cy.visitLevel2();
    cy.get("[data-cy=markers] [data-difficulty]").should("have.length", 5);
    REPORTS.forEach(({ id, difficulty }, index) => {
      cy.get("[data-cy=markers] [data-difficulty]")
        .eq(index)
        .should("have.attr", "data-cy", `marker-${id}`)
        .and("have.attr", "data-difficulty", difficulty)
        .and("have.attr", "data-found", "false");
    });
    cy.get("[data-cy=bug-counter]").should("have.text", "0 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "0");
  });
});

describe("Level 2: reporting bugs", () => {
  beforeEach(() => {
    cy.visitLevel2();
  });

  // One test per bug: the right report lights only that bug's marker.
  REPORTS.forEach(({ id, category, text, points }) => {
    it(`a correct report of ${id} lights its marker, updates the counter and scores ${points}`, () => {
      cy.reportBug(category, text);

      cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "correct");
      cy.get("[data-cy=report-points]").should("have.text", `+${points} pts`);
      cy.get(`[data-cy=marker-${id}]`).should("have.attr", "data-found", "true");
      cy.get("[data-cy=markers] [data-found=true]").should("have.length", 1);
      cy.get("[data-cy=bug-counter]").should("have.text", "1 of 5 found");
      cy.get("[data-cy=score]").should("have.text", String(points));
    });
  });

  it("a real bug under the wrong category gives half points and names the real category", () => {
    cy.reportBug("Logic", "blush pink swatch shows yellow");

    cy.get("[data-cy=report-feedback]")
      .should("have.attr", "data-status", "partial")
      .and("contain", 'You chose "Logic"')
      .and("contain", 'The correct type is "Visual"');
    cy.get("[data-cy=report-points]").should("have.text", "+5 of 10 pts");
    cy.get("[data-cy=marker-visual-blush-swatch]").should("have.attr", "data-found", "true");
    cy.get("[data-cy=bug-counter]").should("have.text", "1 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "5");
  });

  it("every bug pays half points under a wrong category", () => {
    // Each bug reported under a category that is not its own.
    // Half points: 5, 10, 10, 10, 15 (total 50). Every bug in both levels has even
    // points, so no Cypress test can show the rounding down. It is covered by the
    // unit test tests/game/game.test.js, which uses made-up bugs with odd points.
    const wrongCategory = {
      "visual-blush-swatch": "Behavior",
      "logic-fondant-25cm": "Visual",
      "logic-duplicate-filling": "Edge case",
      "edge-last-flavor-second-filling": "Logic",
      "behavior-stale-second-filling": "Logic",
    };
    const runningScore = [5, 15, 25, 35, 50];
    REPORTS.forEach(({ id, text }, index) => {
      cy.reportBug(wrongCategory[id], text);
      if (index < REPORTS.length - 1) {
        cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "partial");
        cy.get("[data-cy=score]").should("have.text", String(runningScore[index]));
      }
    });
    // The fifth bug finishes the level, so the results screen replaces the panel.
    cy.get("[data-cy=results-score]").should("have.text", "50");
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

  // Vague reports: true or harmless, but they describe no bug.
  [
    { category: "Visual", text: "the swatch looks nice" },
    { category: "Logic", text: "two fillings cost more than one" },
    { category: "Behavior", text: "cake" },
  ].forEach(({ category, text }) => {
    it(`the vague report "${text}" does not match and scores nothing`, () => {
      cy.reportBug(category, text);

      cy.get("[data-cy=report-feedback]").should("have.attr", "data-status", "wrong");
      cy.get("[data-cy=markers] [data-found=true]").should("not.exist");
      cy.get("[data-cy=bug-counter]").should("have.text", "0 of 5 found");
      cy.get("[data-cy=score]").should("have.text", "0");
    });
  });
});

describe("Level 2: finishing the level", () => {
  beforeEach(() => {
    cy.visitLevel2();
  });

  it("finding all five bugs shows the results screen with the full score", () => {
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
    REPORTS.forEach(({ id }) => {
      cy.get(`[data-cy=result-${id}]`).should("have.attr", "data-partial", "false");
    });
  });

  it("the results screen has no Next level button, because Level 2 is the last level", () => {
    REPORTS.forEach(({ category, text }) => cy.reportBug(category, text));

    cy.get("[data-cy=results-screen]").should("be.visible");
    cy.get("[data-cy=play-again]").should("be.visible");
    cy.get("[data-cy=back-to-start]").should("be.visible");
    cy.get("[data-cy=next-level]").should("not.exist");
  });

  it("Play again starts a fresh Level 2 game", () => {
    REPORTS.forEach(({ category, text }) => cy.reportBug(category, text));
    cy.get("[data-cy=play-again]").click();

    cy.location("pathname").should("eq", "/level-2");
    cy.get("[data-cy=bakery-page]").should("be.visible");
    cy.get("[data-cy=bug-counter]").should("have.text", "0 of 5 found");
    cy.get("[data-cy=score]").should("have.text", "0");
    cy.get("[data-cy=markers] [data-found=true]").should("not.exist");
  });
});
