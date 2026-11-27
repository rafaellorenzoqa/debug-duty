// Fast unit test for the Level 2 pricing rules (src/lib/cakePricing.js): no browser, no server.
// Runs with Node's built-in test runner:  npm run test:unit
//
// Every expected total below is typed by hand from the price table in the spec.
// They are NOT imported from bakeryMenu.js, so a wrong price in the code makes this test fail
// instead of agreeing with it.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  calculateTotal,
  changeFillingCount,
  duplicateFillingError,
  formatPrice,
  getBugFlags,
  swatchColor,
} from "../../src/lib/cakePricing.js";

const CLEAN = getBugFlags(true);
const BUGGY = getBugFlags(false);

// Clean flags with exactly one bug switched on, to test each bug on its own.
const onlyBug = (flag) => ({ ...CLEAN, [flag]: true });

// The page's starting order. Each test overrides only what it cares about.
const order = (overrides = {}) => ({
  cakeType: "Buttercream",
  fillingCount: 1,
  firstFilling: "Vanilla Cream",
  secondFilling: "",
  color: "Cloud White",
  size: "15cm",
  ...overrides,
});

const total = (overrides, bugs = CLEAN) => formatPrice(calculateTotal(order(overrides), bugs));

describe("clean version: the six hand-checked totals", () => {
  const cases = [
    [{}, "$34.00"],
    [{ cakeType: "Fondant", size: "20cm", firstFilling: "Chocolate Ganache", color: "Sky Blue" }, "$62.00"],
    [{ cakeType: "Fondant", size: "25cm", firstFilling: "Lemon Curd", color: "Blush Pink" }, "$90.00"],
    [
      { size: "25cm", fillingCount: 2, firstFilling: "Dulce de Leche", secondFilling: "Pistachio Cream", color: "Chocolate Brown" },
      "$86.00",
    ],
    [
      { cakeType: "Fondant", fillingCount: 2, firstFilling: "Strawberry Jam", secondFilling: "Lemon Curd", color: "Lavender" },
      "$52.00",
    ],
    [
      { cakeType: "Fondant", size: "25cm", fillingCount: 2, firstFilling: "Vanilla Cream", secondFilling: "Pistachio Cream", color: "Mint Green" },
      "$94.00",
    ],
  ];
  for (const [overrides, expected] of cases) {
    it(`${expected}: ${JSON.stringify(overrides)}`, () => assert.equal(total(overrides), expected));
  }
});

describe("clean version: rules", () => {
  it("a second filling that is not chosen yet adds $0", () => {
    assert.equal(total({ fillingCount: 2, secondFilling: "" }), "$34.00");
  });

  it("the same flavor twice is an error and the total is an em dash", () => {
    const duplicate = order({ fillingCount: 2, secondFilling: "Vanilla Cream" });
    assert.equal(duplicateFillingError(duplicate, CLEAN), "Pick two different fillings.");
    assert.equal(formatPrice(calculateTotal(duplicate, CLEAN)), "—");
  });

  it("going back to 1 filling resets the second filling and removes its price", () => {
    const two = order({ fillingCount: 2, secondFilling: "Lemon Curd" }); // $34 + $6
    assert.equal(formatPrice(calculateTotal(two, CLEAN)), "$40.00");
    const one = changeFillingCount(two, 1, CLEAN);
    assert.equal(one.secondFilling, "");
    assert.equal(formatPrice(calculateTotal(one, CLEAN)), "$34.00");
  });

  it("every swatch matches its own colour", () => {
    assert.equal(swatchColor("Blush Pink", CLEAN), "#F7C6D0");
    assert.equal(swatchColor("Butter Yellow", CLEAN), "#FFE680");
  });
});

// Each bug with ONLY its own flag on, so we also prove the bugs are independent.
describe("each bug on its own", () => {
  it("Bug 1: the Blush Pink swatch is yellow", () => {
    assert.equal(swatchColor("Blush Pink", onlyBug("blushSwatchWrong")), "#FFE680");
    assert.equal(swatchColor("Lavender", onlyBug("blushSwatchWrong")), "#CDB8F0");
  });

  it("Bug 2: Fondant on 25cm adds $0; 15cm and 20cm are still right", () => {
    const bugs = onlyBug("fondantFreeOn25cm");
    assert.equal(total({ cakeType: "Fondant", size: "25cm" }, bugs), "$69.00"); // should be $85.00
    assert.equal(total({ cakeType: "Fondant", size: "15cm" }, bugs), "$42.00");
    assert.equal(total({ cakeType: "Fondant", size: "20cm" }, bugs), "$61.00");
  });

  it("Bug 3: the same flavor twice has no error and is charged twice", () => {
    const bugs = onlyBug("duplicateFillingAllowed");
    const duplicate = order({ fillingCount: 2, secondFilling: "Vanilla Cream" });
    assert.equal(duplicateFillingError(duplicate, bugs), "");
    assert.equal(formatPrice(calculateTotal(duplicate, bugs)), "$38.00");
  });

  it("Bug 4: Pistachio Cream as the second filling adds $0, as the first it costs $9", () => {
    const bugs = onlyBug("lastFlavorFreeInSecond");
    assert.equal(total({ fillingCount: 2, secondFilling: "Pistachio Cream" }, bugs), "$34.00"); // should be $43.00
    assert.equal(total({ firstFilling: "Pistachio Cream" }, bugs), "$39.00");
    assert.equal(total({ fillingCount: 2, secondFilling: "Dulce de Leche" }, bugs), "$41.00");
  });

  it("Bug 5: after going back to 1 filling, the second filling's price stays in the total", () => {
    const bugs = onlyBug("staleSecondFilling");
    const two = order({ fillingCount: 2, secondFilling: "Lemon Curd" });
    const one = changeFillingCount(two, 1, bugs);
    assert.equal(one.secondFilling, ""); // the dropdown looks reset...
    assert.equal(formatPrice(calculateTotal(one, bugs)), "$40.00"); // ...but the total is still $34 + $6
  });
});

// Bug 5 keeps what the second filling was CHARGED. With all buggy flags on, Bug 4 makes
// Pistachio Cream as the second filling cost $0, so that is what stays behind.
// Every cake starts from the default ($30 + Vanilla Cream $4 = $34).
describe("buggy version: Bug 5 keeps what the second filling was charged", () => {
  it("(a) Lemon Curd second, back to 1 filling: $6 stays ($40.00)", () => {
    const two = order({ fillingCount: 2, secondFilling: "Lemon Curd" });
    const one = changeFillingCount(two, 1, BUGGY);
    assert.equal(formatPrice(calculateTotal(one, BUGGY)), "$40.00"); // 34 + 6
  });

  it("(b) Pistachio Cream second, back to 1 filling: $0 stays, because Bug 4 charged it $0 ($34.00)", () => {
    const two = order({ fillingCount: 2, secondFilling: "Pistachio Cream" });
    assert.equal(formatPrice(calculateTotal(two, BUGGY)), "$34.00"); // charged $0 while chosen
    const one = changeFillingCount(two, 1, BUGGY);
    assert.equal(formatPrice(calculateTotal(one, BUGGY)), "$34.00"); // 34 + 0
  });

  it("(c) Lemon Curd, back to 1, then Chocolate Ganache, back to 1: $11 stays ($45.00)", () => {
    const firstTwo = order({ fillingCount: 2, secondFilling: "Lemon Curd" });
    const firstOne = changeFillingCount(firstTwo, 1, BUGGY); // $6 stays
    const secondTwo = { ...changeFillingCount(firstOne, 2, BUGGY), secondFilling: "Chocolate Ganache" };
    const secondOne = changeFillingCount(secondTwo, 1, BUGGY); // another $5 stays
    assert.equal(formatPrice(calculateTotal(secondOne, BUGGY)), "$45.00"); // 34 + 6 + 5
  });
});

describe("buggy version: hand-checked totals that the bugs change", () => {
  it("Fondant 25cm Lemon Curd Blush Pink is $74.00 instead of $90.00", () => {
    assert.equal(total({ cakeType: "Fondant", size: "25cm", firstFilling: "Lemon Curd", color: "Blush Pink" }, BUGGY), "$74.00");
  });
  it("Buttercream 25cm Dulce de Leche + Pistachio Cream Chocolate Brown is $77.00 instead of $86.00", () => {
    assert.equal(
      total({ size: "25cm", fillingCount: 2, firstFilling: "Dulce de Leche", secondFilling: "Pistachio Cream", color: "Chocolate Brown" }, BUGGY),
      "$77.00",
    );
  });
});

describe("formatPrice", () => {
  it("always shows two decimals", () => assert.equal(formatPrice(34), "$34.00"));
  it("shows an em dash when there is no total", () => assert.equal(formatPrice(null), "—"));
});
