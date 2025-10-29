/**
 * HealthController
 *
 * Health check endpoint
 */

module.exports = {

  /**
   * Check application health
   */
  check: async function (req, res) {
    try {
      // Check database connection
      const dbStatus = await sails.getDatastore().leaseConnection(async (db) => {
        return 'connected';
      });

      // Check Redis connection
      const redisStatus = global.redisClient ? (global.redisClient.status === 'ready' ? 'connected' : 'disconnected') : 'not configured';

      return res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        environment: sails.config.environment,
        services: {
          database: dbStatus,
          redis: redisStatus,
        },
      });
    } catch (error) {
      return res.serverError({
        status: 'unhealthy',
        error: error.message,
      });
    }
  },

};

