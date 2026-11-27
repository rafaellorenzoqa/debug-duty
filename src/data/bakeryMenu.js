// Level 2: the 1Up Bakery menu. This is the ONLY place prices live.
// The price list card on the page and the options in every dropdown are generated
// from these lists, so what the page promises and what the code charges cannot drift apart.
//
// Prices are whole US dollars. The page formats them (e.g. 34 -> "$34.00").
// No imports on purpose: plain data that Node can read in the unit tests.

// The order of each list is the order shown on the page.

export const SIZES = [
  { name: "15cm", price: 30 },
  { name: "20cm", price: 45 },
  { name: "25cm", price: 65 },
];

// The fondant surcharge depends on the size. Buttercream is always $0 extra.
export const CAKE_TYPES = [
  { name: "Buttercream", surcharge: { "15cm": 0, "20cm": 0, "25cm": 0 } },
  { name: "Fondant", surcharge: { "15cm": 8, "20cm": 12, "25cm": 16 } },
];

export const FLAVORS = [
  { name: "Vanilla Cream", price: 4 },
  { name: "Chocolate Ganache", price: 5 },
  { name: "Strawberry Jam", price: 5 },
  { name: "Lemon Curd", price: 6 },
  { name: "Dulce de Leche", price: 7 },
  { name: "Pistachio Cream", price: 9 },
];

// `swatch` is the colour of the little square shown beside the dropdown.
export const COLORS = [
  { name: "Cloud White", price: 0, swatch: "#FFFFFF" },
  { name: "Sky Blue", price: 0, swatch: "#8FD3F4" },
  { name: "Mint Green", price: 0, swatch: "#A8E6CF" },
  { name: "Butter Yellow", price: 0, swatch: "#FFE680" },
  { name: "Blush Pink", price: 3, swatch: "#F7C6D0" },
  { name: "Lavender", price: 3, swatch: "#CDB8F0" },
  { name: "Peach", price: 3, swatch: "#FFCBA4" },
  { name: "Chocolate Brown", price: 5, swatch: "#6B4226" },
];

// What the page shows when it first loads.
export const DEFAULT_ORDER = {
  cakeType: "Buttercream",
  fillingCount: 1,
  firstFilling: "Vanilla Cream",
  secondFilling: "", // "" = "Choose a filling" (nothing chosen yet)
  color: "Cloud White",
  size: "15cm",
};
