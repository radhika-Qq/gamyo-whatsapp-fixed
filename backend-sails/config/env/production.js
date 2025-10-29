/**
 * Production environment settings
 * (sails.config.*)
 */

module.exports = {

  /**************************************************************************
   * Production-specific overrides                                          *
   **************************************************************************/

  port: process.env.PORT || 3000,

  datastores: {
    default: {
      ssl: true,
    },
  },

  sockets: {
    onlyAllowOrigins: [
      process.env.FRONTEND_URL || 'https://gamyo.ai',
    ],
  },

  session: {
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  },

  security: {
    cors: {
      allRoutes: true,
      allowOrigins: [
        process.env.FRONTEND_URL || 'https://gamyo.ai',
      ],
      allowCredentials: true,
    },
  },

  log: {
    level: 'info',
  },

};

