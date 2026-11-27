// Pricing and rules for the 1Up Bakery cake builder (Level 2).
// Pure functions: no React, no browser, so Node can unit test them.
//
// Every deliberate bug is controlled by one switch in `getBugFlags`.
// - Buggy version: all switches are ON  (the bugs are present).
// - Clean version: all switches are OFF (everything works correctly).
// Both versions run the same code; only the switches differ (like signupValidation.js).
//
// An "order" is a plain object describing what the player picked:
//   { cakeType, size, fillingCount, firstFilling, secondFilling, color, staleSecondCharge }
// secondFilling is "" while "Choose a filling" is shown.
// staleSecondCharge is only ever non-zero in the buggy version (see BUG 5).

import { CAKE_TYPES, COLORS, FLAVORS, SIZES } from "../data/bakeryMenu.js";

export const DUPLICATE_FILLING_ERROR = "Pick two different fillings.";

export function getBugFlags(isClean) {
  const bugged = !isClean;
  return {
    blushSwatchWrong: bugged, // Bug 1 (Visual): the Blush Pink swatch is yellow
    fondantFreeOn25cm: bugged, // Bug 2 (Logic): Fondant adds $0 on the 25cm cake
    duplicateFillingAllowed: bugged, // Bug 3 (Logic): the same flavor twice is accepted
    lastFlavorFreeInSecond: bugged, // Bug 4 (Edge case): Pistachio Cream as second filling is free
    staleSecondFilling: bugged, // Bug 5 (Behavior): a removed second filling stays in the total
  };
}

// ---- Prices of each part ----

function findByName(list, name) {
  return list.find((item) => item.name === name);
}

export function sizePrice(size) {
  return findByName(SIZES, size).price;
}

export function cakeTypeSurcharge(cakeType, size, bugs) {
  // BUG 2: the 25cm Fondant surcharge is skipped, so it costs the same as Buttercream.
  if (bugs.fondantFreeOn25cm && cakeType === "Fondant" && size === "25cm") return 0;
  return findByName(CAKE_TYPES, cakeType).surcharge[size];
}

export function firstFillingPrice(flavor) {
  return findByName(FLAVORS, flavor).price;
}

// The second dropdown has its own lookup (in real code this often happens when a
// feature is added later and someone writes a new loop instead of reusing the old one).
export function secondFillingPrice(flavor, bugs) {
  // BUG 4: an "off-by-one" mistake. The loop stops one item before the end of the list,
  // so the last flavor (Pistachio Cream) is never found and costs $0.
  const end = bugs.lastFlavorFreeInSecond ? FLAVORS.length - 1 : FLAVORS.length;
  for (let i = 0; i < end; i++) {
    if (FLAVORS[i].name === flavor) return FLAVORS[i].price;
  }
  return 0; // Rule 4: no second filling chosen yet ("") adds $0
}

export function colorPrice(color) {
  return findByName(COLORS, color).price;
}

// The colour of the little square beside the colour dropdown.
export function swatchColor(color, bugs) {
  // BUG 1: Blush Pink shows Butter Yellow's colour.
  if (bugs.blushSwatchWrong && color === "Blush Pink") return findByName(COLORS, "Butter Yellow").swatch;
  return findByName(COLORS, color).swatch;
}

// ---- Rules ----

// Rule 3: with 2 fillings, the two flavors must be different.
// Returns the error text, or "" when there is no error.
export function duplicateFillingError(order, bugs) {
  // BUG 3: the check is skipped, so the same flavor is accepted (and charged twice).
  if (bugs.duplicateFillingAllowed) return "";
  const duplicate = order.fillingCount === 2 && order.secondFilling === order.firstFilling;
  return duplicate ? DUPLICATE_FILLING_ERROR : "";
}

// Rule 2: going from 2 fillings back to 1 resets the second filling.
// Returns the new order (the old one is not changed).
export function changeFillingCount(order, count, bugs) {
  if (count === 2) return { ...order, fillingCount: 2 };

  // The dropdown is reset to "Choose a filling" in BOTH versions, so the controls look right.
  // BUG 5: the buggy version keeps charging what the second filling cost.
  const stale = bugs.staleSecondFilling
    ? (order.staleSecondCharge || 0) + secondFillingPrice(order.secondFilling, bugs)
    : 0;
  return { ...order, fillingCount: 1, secondFilling: "", staleSecondCharge: stale };
}

// Total in dollars, or null when the order has an error (the page then shows "—").
// Total = size + cake type surcharge + first filling + second filling (if 2) + colour.
export function calculateTotal(order, bugs) {
  if (duplicateFillingError(order, bugs)) return null;

  let total =
    sizePrice(order.size) +
    cakeTypeSurcharge(order.cakeType, order.size, bugs) +
    firstFillingPrice(order.firstFilling) +
    colorPrice(order.color);

  if (order.fillingCount === 2) total += secondFillingPrice(order.secondFilling, bugs);

  // Always 0 in the clean version (see changeFillingCount).
  total += order.staleSecondCharge || 0;
  return total;
}

// 34 -> "$34.00". null -> "—" (an em dash: no total until the error is fixed).
export function formatPrice(amount) {
  if (amount === null) return "—";
  return `$${amount.toFixed(2)}`;
}
