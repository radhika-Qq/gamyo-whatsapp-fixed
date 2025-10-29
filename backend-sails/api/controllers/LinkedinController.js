/**
 * LinkedinController
 *
 * LinkedIn API integration controller
 */

module.exports = {

  /**
   * Upload media to LinkedIn
   */
  uploadMedia: async function (req, res) {
    try {
      const { mediaUrl } = req.body;

      if (!mediaUrl) {
        return res.badRequest({
          error: 'mediaUrl is required',
        });
      }

      const result = await LinkedinService.uploadMedia(mediaUrl);

      return res.json(result);
    } catch (error) {
      sails.log.error('LinkedinController.uploadMedia error:', error);
      return res.serverError({
        error: 'Failed to upload media to LinkedIn',
        details: error.message,
      });
    }
  },

  /**
   * Publish post to LinkedIn
   */
  publish: async function (req, res) {
    try {
      const { text, mediaUrn } = req.body;

      if (!text) {
        return res.badRequest({
          error: 'text is required',
        });
      }

      const result = await LinkedinService.publishPost(text, mediaUrn);

      return res.json(result);
    } catch (error) {
      sails.log.error('LinkedinController.publish error:', error);
      return res.serverError({
        error: 'Failed to publish LinkedIn post',
        details: error.message,
      });
    }
  },

  /**
   * Get organization info
   */
  getOrganization: async function (req, res) {
    try {
      const result = await LinkedinService.getOrganizationInfo();

      return res.json(result);
    } catch (error) {
      sails.log.error('LinkedinController.getOrganization error:', error);
      return res.serverError({
        error: 'Failed to fetch organization info',
        details: error.message,
      });
    }
  },

};

