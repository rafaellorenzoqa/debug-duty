"use client";

// Level 2: the 1Up Bakery cake builder.
// "use client" = this component runs in the browser, because it remembers the player's
// choices (state) and reacts to every change.
//
// All prices come from src/data/bakeryMenu.js and all rules from src/lib/cakePricing.js.
// This file only shows things and passes the player's choices along.

import { useState } from "react";
import styles from "./CakeBuilder.module.css";
import BakeryLogo from "./BakeryLogo";
import { CAKE_TYPES, COLORS, DEFAULT_ORDER, FLAVORS, SIZES } from "@/data/bakeryMenu";
import {
  calculateTotal,
  changeFillingCount,
  duplicateFillingError,
  formatPrice,
  getBugFlags,
  swatchColor,
} from "@/lib/cakePricing";

// The price list card: the spec players check the total against.
// Generated from the menu, so it always shows the real prices (same in both versions).
function PriceList() {
  const fondant = CAKE_TYPES.find((type) => type.name === "Fondant");
  return (
    <section className={styles.priceList} data-cy="price-list" aria-labelledby="price-list-title">
      <h2 id="price-list-title">Price list</h2>

      <h3>Size (base price)</h3>
      <ul>
        {SIZES.map((size) => (
          <li key={size.name}>
            <span>{size.name}</span> <span>{formatPrice(size.price)}</span>
          </li>
        ))}
      </ul>

      <h3>Cake type</h3>
      <ul>
        <li>
          <span>Buttercream</span> <span>{formatPrice(0)}</span>
        </li>
        {SIZES.map((size) => (
          <li key={size.name}>
            <span>Fondant on {size.name}</span> <span>+{formatPrice(fondant.surcharge[size.name])}</span>
          </li>
        ))}
      </ul>

      <h3>Fillings (each)</h3>
      <ul>
        {FLAVORS.map((flavor) => (
          <li key={flavor.name}>
            <span>{flavor.name}</span> <span>{formatPrice(flavor.price)}</span>
          </li>
        ))}
      </ul>

      <h3>Outside colour</h3>
      <ul>
        {COLORS.map((color) => (
          <li key={color.name}>
            <span>{color.name}</span> <span>{formatPrice(color.price)}</span>
          </li>
        ))}
      </ul>

      <p className={styles.formula}>
        Total = size + Fondant surcharge (if Fondant) + first filling + second filling (if 2 fillings) + colour
      </p>
    </section>
  );
}

export default function CakeBuilder({ isClean = false }) {
  const bugs = getBugFlags(isClean);
  const [order, setOrder] = useState({ ...DEFAULT_ORDER, staleSecondCharge: 0 });

  // Changes one field of the order, e.g. update("size", "20cm").
  function update(field, value) {
    setOrder({ ...order, [field]: value });
  }

  const twoFillings = order.fillingCount === 2;
  const fillingError = duplicateFillingError(order, bugs);
  const total = formatPrice(calculateTotal(order, bugs));

  return (
    <div className={styles.page} data-cy="bakery-page" data-mode={isClean ? "clean" : "buggy"}>
      <header className={styles.header}>
        <BakeryLogo />
        <div>
          <h1 data-cy="bakery-name">
            1Up <span>Bakery</span>
          </h1>
          <p>Build your cake. We bake it, you level up.</p>
        </div>
      </header>

      <div className={styles.layout}>
        <form className={styles.builder} onSubmit={(e) => e.preventDefault()} data-cy="cake-form">
          <h2>Build your cake</h2>

          <div className={styles.field}>
            <label htmlFor="cake-type">Cake type</label>
            <select
              id="cake-type"
              value={order.cakeType}
              onChange={(e) => update("cakeType", e.target.value)}
              data-cy="cake-type-select"
            >
              {CAKE_TYPES.map((type) => (
                <option key={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* A fieldset groups related radio buttons; its legend is the group's label. */}
          <fieldset className={styles.fillingCount}>
            <legend>Filling</legend>
            <div className={styles.pills}>
              {[1, 2].map((count) => (
                <label key={count} className={styles.pill}>
                  <input
                    type="radio"
                    name="filling-count"
                    value={count}
                    checked={order.fillingCount === count}
                    onChange={() => setOrder(changeFillingCount(order, count, bugs))}
                    data-cy={`filling-count-${count}`}
                  />
                  <span>{count === 1 ? "1 filling" : "2 fillings"}</span>
                </label>
              ))}
            </div>
            <p className={styles.hint}>With 2 fillings, pick two different flavours.</p>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor="filling-1">First filling</label>
            <select
              id="filling-1"
              value={order.firstFilling}
              onChange={(e) => update("firstFilling", e.target.value)}
              data-cy="filling-1-select"
            >
              {FLAVORS.map((flavor) => (
                <option key={flavor.name}>{flavor.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="filling-2">Second filling</label>
            <select
              id="filling-2"
              value={twoFillings ? order.secondFilling : ""}
              onChange={(e) => update("secondFilling", e.target.value)}
              disabled={!twoFillings}
              aria-invalid={fillingError ? "true" : "false"}
              aria-describedby={fillingError ? "filling-2-error" : undefined}
              data-cy="filling-2-select"
            >
              <option value="">Choose a filling</option>
              {FLAVORS.map((flavor) => (
                <option key={flavor.name}>{flavor.name}</option>
              ))}
            </select>
            <p id="filling-2-error" className={styles.error} data-cy="filling-2-error">
              {fillingError}
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="color">Outside colour</label>
            <div className={styles.colorRow}>
              <select
                id="color"
                value={order.color}
                onChange={(e) => update("color", e.target.value)}
                data-cy="color-select"
              >
                {COLORS.map((color) => (
                  <option key={color.name}>{color.name}</option>
                ))}
              </select>
              {/* Decorative: the dropdown already names the colour for screen readers. */}
              <span
                className={styles.swatch}
                style={{ backgroundColor: swatchColor(order.color, bugs) }}
                aria-hidden="true"
                data-cy="color-swatch"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="size">Size</label>
            <select
              id="size"
              value={order.size}
              onChange={(e) => update("size", e.target.value)}
              data-cy="size-select"
            >
              {SIZES.map((size) => (
                <option key={size.name}>{size.name}</option>
              ))}
            </select>
          </div>
        </form>

        <aside className={styles.side}>
          <section className={styles.summary} aria-labelledby="summary-title" data-cy="cake-summary">
            <h2 id="summary-title">Your cake</h2>
            <dl>
              <dt>Cake</dt>
              <dd>
                {order.cakeType}, {order.size}
              </dd>
              <dt>{twoFillings ? "Fillings" : "Filling"}</dt>
              <dd>
                {order.firstFilling}
                {twoFillings && order.secondFilling && ` + ${order.secondFilling}`}
              </dd>
              <dt>Outside</dt>
              <dd>{order.color}</dd>
            </dl>
            {/* aria-live="polite": screen readers announce the new total after each change. */}
            <p className={styles.total} aria-live="polite" aria-atomic="true">
              <span>Total</span>
              <output data-cy="total">{total}</output>
              {fillingError && <span className={styles.srOnly}> (fix the fillings to see the total)</span>}
            </p>
          </section>

          <PriceList />
        </aside>
      </div>
    </div>
  );
}
