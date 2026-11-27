// Level 2 (1Up Bakery): the rules and prices of the CLEAN version, checked against
// the written spec. Every expected total below is typed in by hand from the price
// list (never imported from the app's code), so a pricing mistake in the code
// makes these tests fail instead of agreeing with it.
//
// Default cake on load: Buttercream, 15cm, 1 filling (Vanilla Cream), Cloud White
// = $30 + $0 + $4 + $0 = $34.00. Tables that change one field keep the others at
// these defaults, so each expected total is "$34 adjusted by one price".

// The text a <select> shows: the label of its selected option.
function shouldShowOption($select, text) {
  expect($select[0].selectedOptions[0].text).to.eq(text);
}

// The text of every option of a <select>, in order.
function optionTexts($select) {
  return [...$select[0].options].map((option) => option.text);
}

// The six totals checked by hand in the spec.
const HAND_CHECKED_CAKES = [
  {
    name: "Fondant 20cm, Chocolate Ganache, Sky Blue",
    cake: { cakeType: "Fondant", size: "20cm", firstFilling: "Chocolate Ganache", color: "Sky Blue" },
    total: "$62.00", // 45 + 12 + 5 + 0
  },
  {
    name: "Fondant 25cm, Lemon Curd, Blush Pink",
    cake: { cakeType: "Fondant", size: "25cm", firstFilling: "Lemon Curd", color: "Blush Pink" },
    total: "$90.00", // 65 + 16 + 6 + 3
  },
  {
    name: "Buttercream 25cm, Dulce de Leche + Pistachio Cream, Chocolate Brown",
    cake: {
      size: "25cm",
      fillingCount: 2,
      firstFilling: "Dulce de Leche",
      secondFilling: "Pistachio Cream",
      color: "Chocolate Brown",
    },
    total: "$86.00", // 65 + 0 + 7 + 9 + 5
  },
  {
    name: "Fondant 15cm, Strawberry Jam + Lemon Curd, Lavender",
    cake: {
      cakeType: "Fondant",
      fillingCount: 2,
      firstFilling: "Strawberry Jam",
      secondFilling: "Lemon Curd",
      color: "Lavender",
    },
    total: "$52.00", // 30 + 8 + 5 + 6 + 3
  },
  {
    name: "Fondant 25cm, Vanilla Cream + Pistachio Cream, Mint Green",
    cake: {
      cakeType: "Fondant",
      size: "25cm",
      fillingCount: 2,
      secondFilling: "Pistachio Cream",
      color: "Mint Green",
    },
    total: "$94.00", // 65 + 16 + 4 + 9 + 0
  },
];

// Size x cake type, with Vanilla Cream and Cloud White ($4 + $0).
const SIZE_AND_TYPE = [
  { cakeType: "Buttercream", size: "15cm", total: "$34.00" }, // 30 + 0 + 4
  { cakeType: "Buttercream", size: "20cm", total: "$49.00" }, // 45 + 0 + 4
  { cakeType: "Buttercream", size: "25cm", total: "$69.00" }, // 65 + 0 + 4
  { cakeType: "Fondant", size: "15cm", total: "$42.00" }, // 30 + 8 + 4
  { cakeType: "Fondant", size: "20cm", total: "$61.00" }, // 45 + 12 + 4
  { cakeType: "Fondant", size: "25cm", total: "$85.00" }, // 65 + 16 + 4
];

// Each flavor as the only filling on the default cake: $30 + flavor.
const FIRST_FILLINGS = [
  { flavor: "Vanilla Cream", total: "$34.00" }, // 30 + 4
  { flavor: "Chocolate Ganache", total: "$35.00" }, // 30 + 5
  { flavor: "Strawberry Jam", total: "$35.00" }, // 30 + 5
  { flavor: "Lemon Curd", total: "$36.00" }, // 30 + 6
  { flavor: "Dulce de Leche", total: "$37.00" }, // 30 + 7
  { flavor: "Pistachio Cream", total: "$39.00" }, // 30 + 9
];

// Each flavor as the SECOND filling. The first filling is Vanilla Cream ($4), except
// when the second is Vanilla Cream too: then the first is Chocolate Ganache ($5),
// because two equal fillings are an error.
const SECOND_FILLINGS = [
  { first: "Chocolate Ganache", second: "Vanilla Cream", total: "$39.00" }, // 30 + 5 + 4
  { first: "Vanilla Cream", second: "Chocolate Ganache", total: "$39.00" }, // 30 + 4 + 5
  { first: "Vanilla Cream", second: "Strawberry Jam", total: "$39.00" }, // 30 + 4 + 5
  { first: "Vanilla Cream", second: "Lemon Curd", total: "$40.00" }, // 30 + 4 + 6
  { first: "Vanilla Cream", second: "Dulce de Leche", total: "$41.00" }, // 30 + 4 + 7
  { first: "Vanilla Cream", second: "Pistachio Cream", total: "$43.00" }, // 30 + 4 + 9
];

// Each colour on the default cake ($34 + colour) and its swatch from the approved spec.
const COLORS = [
  { color: "Cloud White", total: "$34.00", swatch: "rgb(255, 255, 255)" }, // #FFFFFF
  { color: "Sky Blue", total: "$34.00", swatch: "rgb(143, 211, 244)" }, // #8FD3F4
  { color: "Mint Green", total: "$34.00", swatch: "rgb(168, 230, 207)" }, // #A8E6CF
  { color: "Butter Yellow", total: "$34.00", swatch: "rgb(255, 230, 128)" }, // #FFE680
  { color: "Blush Pink", total: "$37.00", swatch: "rgb(247, 198, 208)" }, // #F7C6D0
  { color: "Lavender", total: "$37.00", swatch: "rgb(205, 184, 240)" }, // #CDB8F0
  { color: "Peach", total: "$37.00", swatch: "rgb(255, 203, 164)" }, // #FFCBA4
  { color: "Chocolate Brown", total: "$39.00", swatch: "rgb(107, 66, 38)" }, // #6B4226
];

// The price list is the spec a tester checks the total against. It must be the
// same in both versions: only the code's behaviour differs.
["buggy", "clean"].forEach((mode) => {
  describe(`Level 2: the price list shows every price (${mode} version)`, () => {
    beforeEach(() => {
      cy.visitLevel2(mode);
    });

    it("lists the base price of every size", () => {
      cy.get("[data-cy=price-list]")
        .should("contain", "15cm $30.00")
        .and("contain", "20cm $45.00")
        .and("contain", "25cm $65.00");
    });

    it("lists Buttercream as free and the Fondant surcharge for every size", () => {
      cy.get("[data-cy=price-list]")
        .should("contain", "Buttercream $0.00")
        .and("contain", "Fondant on 15cm +$8.00")
        .and("contain", "Fondant on 20cm +$12.00")
        .and("contain", "Fondant on 25cm +$16.00");
    });

    it("lists the price of every filling", () => {
      cy.get("[data-cy=price-list]")
        .should("contain", "Vanilla Cream $4.00")
        .and("contain", "Chocolate Ganache $5.00")
        .and("contain", "Strawberry Jam $5.00")
        .and("contain", "Lemon Curd $6.00")
        .and("contain", "Dulce de Leche $7.00")
        .and("contain", "Pistachio Cream $9.00");
    });

    it("lists the price of every outside colour and the total formula", () => {
      cy.get("[data-cy=price-list]")
        .should("contain", "Cloud White $0.00")
        .and("contain", "Sky Blue $0.00")
        .and("contain", "Mint Green $0.00")
        .and("contain", "Butter Yellow $0.00")
        .and("contain", "Blush Pink $3.00")
        .and("contain", "Lavender $3.00")
        .and("contain", "Peach $3.00")
        .and("contain", "Chocolate Brown $5.00")
        .and("contain", "Total = size + Fondant surcharge (if Fondant) + first filling + second filling (if 2 fillings) + color");
    });
  });
});

describe("Level 2: prices in the clean version", () => {
  beforeEach(() => {
    cy.visitLevel2("clean");
  });

  it("starts with the default cake at $34.00", () => {
    cy.get("[data-cy=cake-type-select]").should("have.value", "Buttercream");
    cy.get("[data-cy=size-select]").should("have.value", "15cm");
    cy.get("[data-cy=filling-count-1]").should("be.checked");
    cy.get("[data-cy=filling-1-select]").should("have.value", "Vanilla Cream");
    cy.get("[data-cy=color-select]").should("have.value", "Cloud White");
    cy.get("[data-cy=total]").should("have.text", "$34.00");
  });

  HAND_CHECKED_CAKES.forEach(({ name, cake, total }) => {
    it(`hand-checked total: ${name} costs ${total}`, () => {
      cy.buildCake(cake);
      cy.get("[data-cy=total]").should("have.text", total);
    });
  });

  // One test per row: each starts from a fresh page, and a failure names the row.
  SIZE_AND_TYPE.forEach(({ cakeType, size, total }) => {
    it(`prices ${cakeType} ${size} at ${total}`, () => {
      cy.buildCake({ cakeType, size });
      cy.get("[data-cy=total]").should("have.text", total);
    });
  });

  FIRST_FILLINGS.forEach(({ flavor, total }) => {
    it(`prices ${flavor} as the first filling at ${total}`, () => {
      cy.buildCake({ firstFilling: flavor });
      cy.get("[data-cy=total]").should("have.text", total);
    });
  });

  SECOND_FILLINGS.forEach(({ first, second, total }) => {
    it(`prices ${second} as the second filling (after ${first}) at ${total}`, () => {
      cy.buildCake({ fillingCount: 2, firstFilling: first, secondFilling: second });
      cy.get("[data-cy=filling-2-error]").should("be.empty");
      cy.get("[data-cy=total]").should("have.text", total);
    });
  });

  COLORS.forEach(({ color, total, swatch }) => {
    it(`prices ${color} at ${total} and shows its swatch as ${swatch}`, () => {
      cy.buildCake({ color });
      cy.get("[data-cy=total]").should("have.text", total);
      cy.get("[data-cy=color-swatch]").should("have.css", "background-color", swatch);
    });
  });
});

describe("Level 2: dropdown options in the clean version", () => {
  it("every dropdown lists exactly its options, in order", () => {
    const flavors = [
      "Vanilla Cream",
      "Chocolate Ganache",
      "Strawberry Jam",
      "Lemon Curd",
      "Dulce de Leche",
      "Pistachio Cream",
    ];
    cy.visitLevel2("clean");

    cy.get("[data-cy=cake-type-select]").should(($select) => {
      expect(optionTexts($select)).to.deep.equal(["Buttercream", "Fondant"]);
    });
    cy.get("[data-cy=size-select]").should(($select) => {
      expect(optionTexts($select)).to.deep.equal(["15cm", "20cm", "25cm"]);
    });
    cy.get("[data-cy=filling-1-select]").should(($select) => {
      expect(optionTexts($select)).to.deep.equal(flavors);
    });
    cy.get("[data-cy=filling-2-select]").should(($select) => {
      expect(optionTexts($select)).to.deep.equal(["Choose a filling", ...flavors]);
    });
    cy.get("[data-cy=color-select]").should(($select) => {
      expect(optionTexts($select)).to.deep.equal([
        "Cloud White",
        "Sky Blue",
        "Mint Green",
        "Butter Yellow",
        "Blush Pink",
        "Lavender",
        "Peach",
        "Chocolate Brown",
      ]);
    });
  });
});

describe("Level 2: filling rules in the clean version", () => {
  beforeEach(() => {
    cy.visitLevel2("clean");
  });

  it("the second filling dropdown is disabled and shows Choose a filling with 1 filling", () => {
    cy.get("[data-cy=filling-count-1]").should("be.checked");
    cy.get("[data-cy=filling-2-select]")
      .should("be.disabled")
      .and("have.value", "")
      .and(($select) => shouldShowOption($select, "Choose a filling"));
  });

  it("the second filling dropdown is enabled with 2 fillings", () => {
    cy.get("[data-cy=filling-count-2]").check({ force: true });
    cy.get("[data-cy=filling-count-2]").should("be.checked");
    cy.get("[data-cy=filling-2-select]").should("be.enabled");
  });

  // The other tests force-check the radio because it is visually hidden by design
  // (the player clicks the pill around it). This test proves the visible pill works.
  it("clicking the visible 2 fillings pill selects 2 fillings", () => {
    cy.get("[data-cy=filling-count-2]").parent().click();
    cy.get("[data-cy=filling-count-2]").should("be.checked");
    cy.get("[data-cy=filling-2-select]").should("be.enabled");
  });

  it("a second filling that is not chosen yet adds $0", () => {
    cy.get("[data-cy=filling-count-2]").check({ force: true });
    cy.get("[data-cy=filling-2-select]").should("be.enabled").and("have.value", "");
    cy.get("[data-cy=total]").should("have.text", "$34.00");
  });

  it("going back to 1 filling resets the second dropdown and removes its price", () => {
    cy.buildCake({ fillingCount: 2, secondFilling: "Lemon Curd" });
    cy.get("[data-cy=total]").should("have.text", "$40.00"); // 30 + 4 + 6

    cy.get("[data-cy=filling-count-1]").check({ force: true });
    cy.get("[data-cy=filling-2-select]")
      .should("be.disabled")
      .and("have.value", "")
      .and(($select) => shouldShowOption($select, "Choose a filling"));
    cy.get("[data-cy=total]").should("have.text", "$34.00");

    // Choosing 2 fillings again does not bring the old second filling back.
    cy.get("[data-cy=filling-count-2]").check({ force: true });
    cy.get("[data-cy=filling-2-select]").should("be.enabled").and("have.value", "");
    cy.get("[data-cy=total]").should("have.text", "$34.00");
  });

  it("the same flavor twice shows an error and an em dash total until the second filling is changed", () => {
    cy.buildCake({ fillingCount: 2, secondFilling: "Vanilla Cream" });
    cy.get("[data-cy=filling-2-error]").should("have.text", "Pick two different fillings.");
    cy.get("[data-cy=total]").should("have.text", "—");

    // Picking a different second filling clears the error and brings the total back.
    cy.get("[data-cy=filling-2-select]").select("Strawberry Jam");
    cy.get("[data-cy=filling-2-error]").should("be.empty");
    cy.get("[data-cy=total]").should("have.text", "$39.00"); // 30 + 4 + 5
  });

  it("the duplicate error also clears when the first filling is changed", () => {
    cy.buildCake({ fillingCount: 2, secondFilling: "Vanilla Cream" });
    cy.get("[data-cy=filling-2-error]").should("have.text", "Pick two different fillings.");
    cy.get("[data-cy=total]").should("have.text", "—");

    cy.get("[data-cy=filling-1-select]").select("Lemon Curd");
    cy.get("[data-cy=filling-2-error]").should("be.empty");
    cy.get("[data-cy=total]").should("have.text", "$40.00"); // 30 + 6 + 4
  });
});
