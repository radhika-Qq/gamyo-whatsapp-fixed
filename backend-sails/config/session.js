/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use sessions to keep track of user state using Redis
 */

module.exports.session = {

  /***************************************************************************
   * Session secret is automatically generated when your new app is created *
   * Replace at your own risk in production-- you will invalidate the       *
   * cookies of your users, forcing them to log in again.                   *
   ***************************************************************************/
  secret: process.env.SESSION_SECRET || 'f3b8d1c9-a7e2-4f5d-9c8b-1a2e3d4c5b6a',

  /***************************************************************************
   * Customize when built-in session support is skipped.                    *
   ***************************************************************************/
  isSessionDisabled: (req) => {
    // Sessions disabled for API requests (using JWT instead)
    return req.path.indexOf('/api/') === 0;
  },

  /***************************************************************************
   * Session store configuration                                             *
   * Using Redis for production, memory for development                     *
   ***************************************************************************/
  adapter: process.env.NODE_ENV === 'production' ? '@sailshq/connect-redis' : undefined,
  
  // Redis configuration (when adapter is '@sailshq/connect-redis')
  url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  
  /***************************************************************************
   * Session cookie settings                                                 *
   ***************************************************************************/
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },

};

