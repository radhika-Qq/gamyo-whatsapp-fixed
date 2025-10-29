/**
 * Custom Configuration
 * (sails.config.custom)
 *
 * Custom app-level settings for Gamyo.ai
 */

module.exports.custom = {

  /***************************************************************************
   * Base URL for the application                                            *
   ***************************************************************************/
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',

  /***************************************************************************
   * JWT Configuration                                                        *
   ***************************************************************************/
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',

  /***************************************************************************
   * Redis Configuration                                                      *
   ***************************************************************************/
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB) || 0,
  },

  /***************************************************************************
   * AWS S3 Configuration                                                     *
   ***************************************************************************/
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || 'gamyo-media',
  },

  /***************************************************************************
   * WhatsApp Business API Configuration                                     *
   ***************************************************************************/
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v21.0',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  },

  /***************************************************************************
   * Facebook API Configuration                                               *
   ***************************************************************************/
  facebook: {
    apiUrl: process.env.FACEBOOK_API_URL || 'https://graph.facebook.com/v21.0',
    pageId: process.env.FACEBOOK_PAGE_ID,
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
  },

  /***************************************************************************
   * Instagram API Configuration                                              *
   ***************************************************************************/
  instagram: {
    apiUrl: process.env.INSTAGRAM_API_URL || 'https://graph.facebook.com/v21.0',
    userId: process.env.INSTAGRAM_USER_ID,
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
  },

  /***************************************************************************
   * LinkedIn API Configuration                                               *
   ***************************************************************************/
  linkedin: {
    apiUrl: process.env.LINKEDIN_API_URL || 'https://api.linkedin.com/v2',
    accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
    organizationUrn: process.env.LINKEDIN_ORGANIZATION_URN,
  },

  /***************************************************************************
   * AI Microservice Configuration                                            *
   ***************************************************************************/
  aiService: {
    url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    apiKey: process.env.AI_SERVICE_API_KEY,
  },

  /***************************************************************************
   * OpenAI API Configuration                                                 *
   ***************************************************************************/
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },

  /***************************************************************************
   * Sentry Configuration                                                     *
   ***************************************************************************/
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
  },

};

