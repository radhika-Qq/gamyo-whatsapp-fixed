/**
 * WhatsappController
 *
 * WhatsApp Business API integration controller
 */

module.exports = {

  /**
   * Send 1:1 message
   */
  sendMessage: async function (req, res) {
    try {
      const { to, message, mediaUrl } = req.body;

      if (!to || !message) {
        return res.badRequest({
          error: 'to and message are required',
        });
      }

      const result = await WhatsappService.sendMessage(to, message, mediaUrl);

      return res.json(result);
    } catch (error) {
      sails.log.error('WhatsappController.sendMessage error:', error);
      return res.serverError({
        error: 'Failed to send WhatsApp message',
        details: error.message,
      });
    }
  },

  /**
   * Send broadcast message
   */
  sendBroadcast: async function (req, res) {
    try {
      const { recipients, message, mediaUrl } = req.body;

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.badRequest({
          error: 'recipients array is required',
        });
      }

      if (!message) {
        return res.badRequest({
          error: 'message is required',
        });
      }

      const result = await WhatsappService.sendBroadcast(recipients, message, mediaUrl);

      return res.json(result);
    } catch (error) {
      sails.log.error('WhatsappController.sendBroadcast error:', error);
      return res.serverError({
        error: 'Failed to send broadcast',
        details: error.message,
      });
    }
  },

  /**
   * Send channel message
   */
  sendChannel: async function (req, res) {
    try {
      const { channelId, message, mediaUrl } = req.body;

      if (!channelId || !message) {
        return res.badRequest({
          error: 'channelId and message are required',
        });
      }

      const result = await WhatsappService.sendChannelMessage(channelId, message, mediaUrl);

      return res.json(result);
    } catch (error) {
      sails.log.error('WhatsappController.sendChannel error:', error);
      return res.serverError({
        error: 'Failed to send channel message',
        details: error.message,
      });
    }
  },

  /**
   * Upload media
   */
  uploadMedia: async function (req, res) {
    try {
      const { mediaUrl } = req.body;

      if (!mediaUrl) {
        return res.badRequest({
          error: 'mediaUrl is required',
        });
      }

      const result = await WhatsappService.uploadMedia(mediaUrl);

      return res.json(result);
    } catch (error) {
      sails.log.error('WhatsappController.uploadMedia error:', error);
      return res.serverError({
        error: 'Failed to upload media',
        details: error.message,
      });
    }
  },

};

