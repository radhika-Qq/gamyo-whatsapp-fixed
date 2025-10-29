/**
 * app.js
 * 
 * Entry point for Gamyo.ai backend
 * Use `sails lift` or `node app.js` to run your app.
 */

// Load environment variables
require('dotenv').config();

// Require Sails framework
const sails = require('sails');

// Attempt to lift Sails
sails.lift({
  // Custom configurations can go here
  // or in config/ directory
}, (err) => {
  if (err) {
    console.error('Error occurred lifting Sails app:', err);
    return process.exit(1);
  }

  // Sails app is now running
  console.log(`🚀 Gamyo.ai backend running on port ${sails.config.port}`);
  console.log(`📝 Environment: ${sails.config.environment}`);
  console.log(`💾 Database: ${sails.config.datastores.default.adapter}`);
});

