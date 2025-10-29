/**
 * FacebookController
 *
 * Facebook API integration controller
 */

module.exports = {

  /**
   * Upload media to Facebook
   */
  uploadMedia: async function (req, res) {
    try {
      const { mediaUrl, mediaType, caption } = req.body;

      if (!mediaUrl || !mediaType) {
        return res.badRequest({
          error: 'mediaUrl and mediaType are required',
        });
      }

      const result = await FacebookService.uploadMedia(mediaUrl, mediaType, caption);

      return res.json(result);
    } catch (error) {
      sails.log.error('FacebookController.uploadMedia error:', error);
      return res.serverError({
        error: 'Failed to upload media to Facebook',
        details: error.message,
      });
    }
  },

  /**
   * Create post on Facebook
   */
  createPost: async function (req, res) {
    try {
      const { message, mediaId, scheduledTime } = req.body;

      if (!message) {
        return res.badRequest({
          error: 'Message is required',
        });
      }

      const result = await FacebookService.createPost(message, mediaId, scheduledTime);

      return res.json(result);
    } catch (error) {
      sails.log.error('FacebookController.createPost error:', error);
      return res.serverError({
        error: 'Failed to create Facebook post',
        details: error.message,
      });
    }
  },

  /**
   * Get post insights
   */
  getPostInsights: async function (req, res) {
    try {
      const { postId } = req.params;

      if (!postId) {
        return res.badRequest({
          error: 'postId is required',
        });
      }

      const result = await FacebookService.getPostInsights(postId);

      return res.json(result);
    } catch (error) {
      sails.log.error('FacebookController.getPostInsights error:', error);
      return res.serverError({
        error: 'Failed to fetch post insights',
        details: error.message,
      });
    }
  },

  /**
   * Get page insights
   */
  getPageInsights: async function (req, res) {
    try {
      const result = await FacebookService.getPageInsights();

      return res.json(result);
    } catch (error) {
      sails.log.error('FacebookController.getPageInsights error:', error);
      return res.serverError({
        error: 'Failed to fetch page insights',
        details: error.message,
      });
    }
  },

};

