/**
 * InstagramService.js
 *
 * Service for Instagram Graph API integration
 */

const axios = require('axios');

module.exports = {

  /**
   * Create a media container for Instagram post
   * This is the first step in the Instagram posting workflow
   */
  async createMediaContainer(mediaUrl, caption = '') {
    try {
      const { apiUrl, userId, accessToken } = sails.config.custom.instagram;

      if (!userId || !accessToken) {
        throw new Error('Instagram credentials not configured');
      }

      sails.log.info(`Creating Instagram media container with URL: ${mediaUrl}`);
      
      const url = `${apiUrl}/${userId}/media`;
      
      const response = await axios.post(url, {
        image_url: mediaUrl,
        caption: caption,
        access_token: accessToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      sails.log.info(`Media container created successfully: ${response.data.id}`);
      
      return {
        success: true,
        creationId: response.data.id,
        message: 'Media container created successfully',
      };
    } catch (error) {
      sails.log.error('InstagramService.createMediaContainer error:', error.response?.data || error.message);
      throw new Error(`Failed to create media container: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Publish a media container to Instagram feed
   * This is the second step - publishes the container created in step 1
   */
  async publishContainer(creationId) {
    try {
      const { apiUrl, userId, accessToken } = sails.config.custom.instagram;

      if (!userId || !accessToken) {
        throw new Error('Instagram credentials not configured');
      }

      sails.log.info(`Publishing Instagram container: ${creationId}`);
      
      const url = `${apiUrl}/${userId}/media_publish`;
      
      const response = await axios.post(url, {
        creation_id: creationId,
        access_token: accessToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      sails.log.info(`Post published successfully: ${response.data.id}`);
      
      return {
        success: true,
        mediaId: response.data.id,
        message: 'Post published to Instagram successfully',
      };
    } catch (error) {
      sails.log.error('InstagramService.publishContainer error:', error.response?.data || error.message);
      throw new Error(`Failed to publish post: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Get insights for a published Instagram media
   * Metrics include impressions, reach, and engagement
   */
  async getInsights(mediaId) {
    try {
      const { apiUrl, accessToken } = sails.config.custom.instagram;

      if (!accessToken) {
        throw new Error('Instagram credentials not configured');
      }

      sails.log.info(`Fetching insights for Instagram media: ${mediaId}`);
      
      const url = `${apiUrl}/${mediaId}/insights`;
      
      const response = await axios.get(url, {
        params: {
          metric: 'impressions,reach,engagement',
          access_token: accessToken,
        },
      });

      sails.log.info(`Insights fetched successfully for media: ${mediaId}`);
      
      return {
        success: true,
        insights: response.data.data,
        mediaId: mediaId,
      };
    } catch (error) {
      sails.log.error('InstagramService.getInsights error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch insights: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Get account insights for Instagram Business account
   * Includes follower count, impressions, reach, etc.
   */
  async getAccountInsights() {
    try {
      const { apiUrl, userId, accessToken } = sails.config.custom.instagram;

      if (!userId || !accessToken) {
        throw new Error('Instagram credentials not configured');
      }

      sails.log.info('Fetching Instagram account insights');
      
      const url = `${apiUrl}/${userId}/insights`;
      
      const response = await axios.get(url, {
        params: {
          metric: 'impressions,reach,follower_count,profile_views',
          period: 'day',
          access_token: accessToken,
        },
      });

      sails.log.info('Account insights fetched successfully');
      
      return {
        success: true,
        insights: response.data.data,
      };
    } catch (error) {
      sails.log.error('InstagramService.getAccountInsights error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch account insights: ${error.response?.data?.error?.message || error.message}`);
    }
  },

};

