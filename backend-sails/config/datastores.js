/**
 * Datastores Configuration
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 */

module.exports.datastores = {

  /**
   * MongoDB Atlas - Primary Database
   */
  default: {
    adapter: 'sails-mongo',
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/gamyo',
    
    // Additional MongoDB options
    ssl: process.env.NODE_ENV === 'production',
    poolSize: 10,
    
    // Retry configuration
    retryWrites: true,
    w: 'majority',
  },

};

