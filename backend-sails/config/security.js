/**
 * Security Settings
 * (sails.config.security)
 *
 * Security configuration for Gamyo.ai backend
 */

module.exports.security = {

  /***************************************************************************
   * CORS Configuration                                                       *
   * Control which domains can access your API                               *
   ***************************************************************************/

  cors: {
    allRoutes: true,
    allowOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3001', 'http://localhost:5173'],
    allowCredentials: true,
    allowRequestHeaders: 'content-type,authorization',
    allowResponseHeaders: 'content-type,authorization',
    allowRequestMethods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  },

  /***************************************************************************
   * CSRF Protection                                                          *
   * Disabled for API-only applications                                      *
   ***************************************************************************/

  csrf: false,

};

