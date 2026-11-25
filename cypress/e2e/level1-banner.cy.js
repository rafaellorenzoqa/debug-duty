// The Level 1 banner is the brand header of the Sole Mate page. Its navy blue is
// --navy: #0b1f4b (src/components/SignupForm.module.css), which the browser
// reports as rgb(11, 31, 75). The banner paints it as the middle stop of a gradient.
const NAVY = "rgb(11, 31, 75)";

// The banner has no data-cy of its own, so we reach it as the parent of the store name.
["buggy", "clean"].forEach((mode) => {
  describe(`Level 1: banner colour (${mode} version)`, () => {
    beforeEach(() => {
      cy.visitLevel1(mode);
    });

    it("paints the banner with the navy blue from the source", () => {
      cy.get("[data-cy=store-name]")
        .parent()
        .should("have.css", "background-image")
        .and("contain", NAVY);
    });
  });
});
