/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do when it receives an HTTP request.
 */

module.exports.routes = {

  /***************************************************************************
   * CORE ROUTES                                                              *
   ***************************************************************************/
  
  'GET /': { view: 'pages/homepage' },
  'GET /health': 'HealthController.check',

  /***************************************************************************
   * AUTHENTICATION & USER MANAGEMENT                                         *
   ***************************************************************************/
  
  'POST /api/auth/register': 'AuthController.register',
  'POST /api/auth/login': 'AuthController.login',
  'GET /api/auth/me': 'AuthController.me',
  'POST /api/auth/logout': 'AuthController.logout',

  /***************************************************************************
   * AI ENDPOINTS                                                             *
   ***************************************************************************/
  
  'POST /api/ai/generate-caption': 'AiController.generateCaption',
  'POST /api/ai/generate-hashtags': 'AiController.generateHashtags',
  'POST /api/ai/generate-image': 'AiController.generateImage',
  'POST /api/ai/translate': 'AiController.translate',

  /***************************************************************************
   * WHATSAPP ENDPOINTS                                                       *
   ***************************************************************************/
  
  'POST /api/whatsapp/send-message': 'WhatsappController.sendMessage',
  'POST /api/whatsapp/send-broadcast': 'WhatsappController.sendBroadcast',
  'POST /api/whatsapp/send-channel': 'WhatsappController.sendChannel',
  'POST /api/whatsapp/upload-media': 'WhatsappController.uploadMedia',
  
  // Webhook endpoints
  'GET /api/whatsapp/webhook': 'WebhookController.verify',
  'POST /api/whatsapp/webhook': 'WebhookController.receive',

  /***************************************************************************
   * FACEBOOK ENDPOINTS                                                       *
   ***************************************************************************/
  
  'POST /api/facebook/upload-media': 'FacebookController.uploadMedia',
  'POST /api/facebook/create-post': 'FacebookController.createPost',
  'GET /api/facebook/insights/:postId': 'FacebookController.getPostInsights',
  'GET /api/facebook/page-insights': 'FacebookController.getPageInsights',

  /***************************************************************************
   * INSTAGRAM ENDPOINTS                                                      *
   ***************************************************************************/
  
  'POST /api/instagram/create-container': 'InstagramController.createContainer',
  'POST /api/instagram/publish': 'InstagramController.publish',
  'GET /api/instagram/insights/:mediaId': 'InstagramController.getInsights',
  'GET /api/instagram/account-insights': 'InstagramController.getAccountInsights',

  /***************************************************************************
   * LINKEDIN ENDPOINTS                                                       *
   ***************************************************************************/
  
  'POST /api/linkedin/upload-media': 'LinkedinController.uploadMedia',
  'POST /api/linkedin/publish': 'LinkedinController.publish',
  'GET /api/linkedin/organization': 'LinkedinController.getOrganization',

  /***************************************************************************
   * POST MANAGEMENT & SCHEDULING                                            *
   ***************************************************************************/
  
  'POST /api/posts': 'PostController.create',
  'GET /api/posts': 'PostController.list',
  'GET /api/posts/:id': 'PostController.findOne',
  'PATCH /api/posts/:id': 'PostController.update',
  'DELETE /api/posts/:id': 'PostController.delete',
  'POST /api/posts/:id/schedule': 'PostController.schedule',
  'POST /api/posts/:id/publish': 'PostController.publish',

  /***************************************************************************
   * ANALYTICS ENDPOINTS                                                      *
   ***************************************************************************/
  
  'GET /api/analytics/overview': 'AnalyticsController.overview',
  'GET /api/analytics/engagement': 'AnalyticsController.engagement',
  'GET /api/analytics/platforms': 'AnalyticsController.platformBreakdown',

};

