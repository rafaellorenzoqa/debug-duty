// Emails that break the written format (text@domain.ext): no @, two @, a space, no domain...
const INVALID_EMAILS = ["not-an-email", "a@@b.com", "a@b@c.com", "a b@c.com", "a@b", "@b.com", "a@.com"];
const VALID_EMAILS = ["a@b.com", "name@example.com", "first.last+tag@sub.example.co"];

// For each of the five bugs: one test proves the bug IS present in the buggy
// version, and one proves it is ABSENT in the clean version (same steps,
// inverted assertions). The clean version is the hidden /level-1?mode=clean.

// The written rules are the spec a tester checks the page against. They must be
// the same in both versions: only the code's behaviour differs.
["buggy", "clean"].forEach((mode) => {
  describe(`Level 1: field rules are shown (${mode} version)`, () => {
    beforeEach(() => {
      cy.visitLevel1(mode);
    });

    it("explains what a valid email is", () => {
      cy.get("[data-cy=email-rules]")
        .should("contain", "Exactly one @")
        .and("contain", "dot")
        .and("contain", "No spaces");
    });

    it("lists the password rules, including every allowed special character", () => {
      cy.get("[data-cy=password-rules]")
        .should("contain", "At least 8 characters")
        .and("contain", "1 letter and 1 number")
        .and("contain", "! @ # $ % ^ & * ( ) _ + - = . , ?");
    });

    it("says the confirm password must be the same as the password", () => {
      cy.get("[data-cy=confirm-password-rules]").should("contain", "exactly the same");
    });

    it("says one submission creates one account, and the tagline spells the button label", () => {
      cy.get("[data-cy=submit-rules]").should("contain", "exactly one account");
      cy.get("[data-cy=tagline]").should("contain", "Sign Up");
    });
  });
});

describe("Level 1: buggy version (each bug is present)", () => {
  beforeEach(() => {
    cy.visitLevel1("buggy");
  });

  it("Bug 1 (Visual): the submit button is misspelled", () => {
    cy.get("[data-cy=submit-button]").should("have.text", "Sing Up");
  });

  it("Bug 2 (Validation): emails that break the a@b.com format are accepted", () => {
    INVALID_EMAILS.forEach((email) => {
      cy.fillSignup({ email });
      cy.get("[data-cy=submit-button]").click();
      cy.get("[data-cy=email-error]").should("be.empty");
    });
    cy.get("[data-cy=success-message]").should("be.visible");
  });

  it("Bug 3 (Edge case): every other listed special character is accepted, only & fails", () => {
    "!@#$%^*()_+-=.,?".split("").forEach((char) => {
      cy.fillSignup({ password: `Pass${char}word1`, confirm: `Pass${char}word1` });
      cy.get("[data-cy=submit-button]").click();
      cy.get("[data-cy=password-error]").should("be.empty");
    });
  });

  it("Bug 3 (Edge case): a password with & is rejected", () => {
    cy.fillSignup({ password: "Pass&word1", confirm: "Pass&word1" });
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=password-error]").should("have.text", "Password contains invalid characters");
    cy.get("[data-cy=success-message]").should("not.exist");
  });

  it("Bug 4 (Logic): a confirm password that does not match is accepted", () => {
    cy.fillSignup({ confirm: "Different1!" });
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=confirm-password-error]").should("be.empty");
    cy.get("[data-cy=success-message]").should("be.visible");
  });

  it("Bug 5 (Behavior): double clicking submit creates two accounts", () => {
    cy.fillSignup();
    cy.get("[data-cy=submit-button]").dblclick();
    cy.get("[data-cy=accounts-created]").should("have.text", "2");
  });
});

describe("Level 1: clean version (no bugs)", () => {
  beforeEach(() => {
    cy.visitLevel1("clean");
  });

  it("Bug 1 absent: the submit button is spelled correctly", () => {
    cy.get("[data-cy=submit-button]").should("have.text", "Sign Up");
  });

  it("Bug 2 absent: every email that breaks the a@b.com format is rejected", () => {
    INVALID_EMAILS.forEach((email) => {
      cy.fillSignup({ email });
      cy.get("[data-cy=submit-button]").click();
      cy.get("[data-cy=email-error]").should("have.text", "Enter a valid email address");
      cy.get("[data-cy=success-message]").should("not.exist");
    });
  });

  it("Bug 2 absent: emails that follow the format are accepted", () => {
    VALID_EMAILS.forEach((email) => {
      cy.fillSignup({ email });
      cy.get("[data-cy=submit-button]").click();
      cy.get("[data-cy=email-error]").should("be.empty");
    });
  });

  it("Bug 3 absent: a password with & is accepted", () => {
    cy.fillSignup({ password: "Pass&word1", confirm: "Pass&word1" });
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=password-error]").should("be.empty");
    cy.get("[data-cy=success-message]").should("be.visible");
  });

  it("Bug 4 absent: a confirm password that does not match is rejected", () => {
    cy.fillSignup({ confirm: "Different1!" });
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=confirm-password-error]").should("have.text", "Passwords do not match");
    cy.get("[data-cy=success-message]").should("not.exist");
  });

  it("Bug 5 absent: double clicking submit creates only one account", () => {
    cy.fillSignup();
    cy.get("[data-cy=submit-button]").dblclick();
    cy.get("[data-cy=success-message]").should("be.visible");
    cy.get("[data-cy=accounts-created]").should("have.text", "1");
  });
});
