const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

// set up base url
module.exports = {
  e2e: {
    baseUrl: 'http://127.0.0.1:5000', // Flask app URL
  },
};

