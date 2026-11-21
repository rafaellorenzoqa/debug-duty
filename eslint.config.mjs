import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// ESLint "flat config": a list of rule sets. We use the rules recommended by Next.js.
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", "cypress/videos/**", "cypress/screenshots/**"],
  },
];

export default eslintConfig;
