/**
 * Development environment settings
 * (sails.config.*)
 */

module.exports = {

  /**************************************************************************
   * Development-specific overrides                                         *
   **************************************************************************/

  port: process.env.PORT || 3000,

  datastores: {
    default: {
      ssl: false,
    },
  },

  security: {
    cors: {
      allRoutes: true,
      allowOrigins: '*',
      allowCredentials: true,
    },
  },

  log: {
    level: 'debug',
  },

};

