/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run before your actions.
 */

module.exports.policies = {

  /***************************************************************************
   * Default policy for all controllers and actions, unless overridden       *
   * (`true` allows public access)                                           *
   ***************************************************************************/

  '*': 'isAuthenticated',

  /***************************************************************************
   * Public routes (no authentication required)                              *
   ***************************************************************************/

  HealthController: {
    check: true,
  },

  AuthController: {
    login: true,
    register: true,
  },

  WebhookController: {
    verify: true,
    receive: true,
  },

  /***************************************************************************
   * Protected routes (authentication required)                              *
   ***************************************************************************/

  AiController: {
    '*': 'isAuthenticated',
  },

  WhatsappController: {
    '*': 'isAuthenticated',
  },

  FacebookController: {
    '*': 'isAuthenticated',
  },

  InstagramController: {
    '*': 'isAuthenticated',
  },

  LinkedinController: {
    '*': 'isAuthenticated',
  },

  PostController: {
    '*': 'isAuthenticated',
  },

  AnalyticsController: {
    '*': 'isAuthenticated',
  },

};

