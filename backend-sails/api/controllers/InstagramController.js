/**
 * InstagramController
 *
 * Instagram API integration controller
 */

module.exports = {

  /**
   * Create media container (Step 1 of posting)
   */
  createContainer: async function (req, res) {
    try {
      const { mediaUrl, caption } = req.body;

      if (!mediaUrl) {
        return res.badRequest({
          error: 'mediaUrl is required',
        });
      }

      const result = await InstagramService.createMediaContainer(mediaUrl, caption);

      return res.json(result);
    } catch (error) {
      sails.log.error('InstagramController.createContainer error:', error);
      return res.serverError({
        error: 'Failed to create Instagram media container',
        details: error.message,
      });
    }
  },

  /**
   * Publish container (Step 2 of posting)
   */
  publish: async function (req, res) {
    try {
      const { creationId } = req.body;

      if (!creationId) {
        return res.badRequest({
          error: 'creationId is required',
        });
      }

      const result = await InstagramService.publishContainer(creationId);

      return res.json(result);
    } catch (error) {
      sails.log.error('InstagramController.publish error:', error);
      return res.serverError({
        error: 'Failed to publish Instagram post',
        details: error.message,
      });
    }
  },

  /**
   * Get media insights
   */
  getInsights: async function (req, res) {
    try {
      const { mediaId } = req.params;

      if (!mediaId) {
        return res.badRequest({
          error: 'mediaId is required',
        });
      }

      const result = await InstagramService.getInsights(mediaId);

      return res.json(result);
    } catch (error) {
      sails.log.error('InstagramController.getInsights error:', error);
      return res.serverError({
        error: 'Failed to fetch Instagram insights',
        details: error.message,
      });
    }
  },

  /**
   * Get account insights
   */
  getAccountInsights: async function (req, res) {
    try {
      const result = await InstagramService.getAccountInsights();

      return res.json(result);
    } catch (error) {
      sails.log.error('InstagramController.getAccountInsights error:', error);
      return res.serverError({
        error: 'Failed to fetch account insights',
        details: error.message,
      });
    }
  },

};

