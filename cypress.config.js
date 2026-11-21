const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Tests use cy.visit("/level-1"), which is resolved against this address.
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    video: true,
    screenshotOnRunFailure: true,
  },
});
