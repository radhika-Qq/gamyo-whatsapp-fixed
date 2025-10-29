/**
 * WhatsappService.js
 *
 * Service for WhatsApp Business API integration
 */

const axios = require('axios');
const FormData = require('form-data');

module.exports = {

  /**
   * Send a 1:1 message to a WhatsApp user
   */
  async sendMessage(to, message, mediaUrl = null) {
    try {
      const { apiUrl, phoneNumberId, accessToken } = sails.config.custom.whatsapp;

      if (!phoneNumberId || !accessToken) {
        throw new Error('WhatsApp credentials not configured');
      }

      const url = `${apiUrl}/${phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
      };

      if (mediaUrl) {
        // Send media message
        payload.type = 'image'; // or 'video', 'document', etc.
        payload.image = {
          link: mediaUrl,
          caption: message,
        };
      } else {
        // Send text message
        payload.type = 'text';
        payload.text = {
          body: message,
        };
      }

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('WhatsappService.sendMessage error:', error.response?.data || error.message);
      throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Send broadcast message to multiple recipients
   */
  async sendBroadcast(recipients, message, mediaUrl = null) {
    try {
      const results = {
        successful: [],
        failed: [],
      };

      for (const recipient of recipients) {
        try {
          const result = await this.sendMessage(recipient, message, mediaUrl);
          results.successful.push({
            recipient: recipient,
            messageId: result.messageId,
          });
        } catch (error) {
          results.failed.push({
            recipient: recipient,
            error: error.message,
          });
        }
      }

      return {
        success: true,
        total: recipients.length,
        successful: results.successful.length,
        failed: results.failed.length,
        results: results,
      };
    } catch (error) {
      sails.log.error('WhatsappService.sendBroadcast error:', error);
      throw new Error(`Failed to send broadcast: ${error.message}`);
    }
  },

  /**
   * Send message to WhatsApp Channel
   */
  async sendChannelMessage(channelId, message, mediaUrl = null) {
    try {
      const { apiUrl, accessToken } = sails.config.custom.whatsapp;

      if (!accessToken) {
        throw new Error('WhatsApp credentials not configured');
      }

      // Note: Channel API might differ - this is a placeholder
      const url = `${apiUrl}/${channelId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        type: mediaUrl ? 'image' : 'text',
      };

      if (mediaUrl) {
        payload.image = {
          link: mediaUrl,
          caption: message,
        };
      } else {
        payload.text = {
          body: message,
        };
      }

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('WhatsappService.sendChannelMessage error:', error.response?.data || error.message);
      throw new Error(`Failed to send channel message: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Upload media to WhatsApp
   */
  async uploadMedia(mediaUrl) {
    try {
      const { apiUrl, phoneNumberId, accessToken } = sails.config.custom.whatsapp;

      if (!phoneNumberId || !accessToken) {
        throw new Error('WhatsApp credentials not configured');
      }

      // Download media first
      const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      
      // Create form data
      const formData = new FormData();
      formData.append('messaging_product', 'whatsapp');
      formData.append('file', Buffer.from(mediaResponse.data), {
        filename: 'media',
        contentType: mediaResponse.headers['content-type'],
      });

      const url = `${apiUrl}/${phoneNumberId}/media`;
      
      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        success: true,
        mediaId: response.data.id,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('WhatsappService.uploadMedia error:', error.response?.data || error.message);
      throw new Error(`Failed to upload media: ${error.response?.data?.error?.message || error.message}`);
    }
  },

};

