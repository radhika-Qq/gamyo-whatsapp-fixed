/**
 * FacebookService.js
 *
 * Service for Facebook Graph API integration
 */

const axios = require('axios');

module.exports = {

  /**
   * Upload a photo to Facebook Page
   */
  async uploadPhoto(mediaUrl, caption = '') {
    try {
      const { apiUrl, pageId, accessToken } = sails.config.custom.facebook;

      if (!pageId || !accessToken) {
        throw new Error('Facebook credentials not configured');
      }

      const url = `${apiUrl}/${pageId}/photos`;
      
      const response = await axios.post(url, {
        url: mediaUrl,
        caption: caption,
        published: false, // Unpublished so it can be attached to a post
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        success: true,
        mediaId: response.data.id,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('FacebookService.uploadPhoto error:', error.response?.data || error.message);
      throw new Error(`Failed to upload photo: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Upload a video to Facebook Page
   */
  async uploadVideo(mediaUrl, caption = '') {
    try {
      const { apiUrl, pageId, accessToken } = sails.config.custom.facebook;

      if (!pageId || !accessToken) {
        throw new Error('Facebook credentials not configured');
      }

      const url = `${apiUrl}/${pageId}/videos`;
      
      const response = await axios.post(url, {
        file_url: mediaUrl,
        description: caption,
        published: false,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        success: true,
        mediaId: response.data.id,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('FacebookService.uploadVideo error:', error.response?.data || error.message);
      throw new Error(`Failed to upload video: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Upload media based on type
   */
  async uploadMedia(mediaUrl, mediaType, caption = '') {
    if (mediaType === 'photo' || mediaType === 'image') {
      return await this.uploadPhoto(mediaUrl, caption);
    } else if (mediaType === 'video') {
      return await this.uploadVideo(mediaUrl, caption);
    } else {
      throw new Error('Invalid media type. Must be "photo" or "video"');
    }
  },

  /**
   * Create a post on Facebook Page
   */
  async createPost(message, mediaId = null, scheduledTime = null) {
    try {
      const { apiUrl, pageId, accessToken } = sails.config.custom.facebook;

      if (!pageId || !accessToken) {
        throw new Error('Facebook credentials not configured');
      }

      const url = `${apiUrl}/${pageId}/feed`;
      
      const postData = {
        message: message,
      };

      // Attach media if provided
      if (mediaId) {
        postData.attached_media = [{ media_fbid: mediaId }];
      }

      // Schedule post if scheduledTime is provided
      if (scheduledTime) {
        postData.scheduled_publish_time = Math.floor(new Date(scheduledTime).getTime() / 1000);
        postData.published = false;
      }

      const response = await axios.post(url, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        success: true,
        postId: response.data.id,
        message: scheduledTime 
          ? 'Post scheduled successfully on Facebook Page' 
          : 'Post published successfully on Facebook Page',
        data: response.data,
      };
    } catch (error) {
      sails.log.error('FacebookService.createPost error:', error.response?.data || error.message);
      throw new Error(`Failed to create post: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Get insights for a post
   */
  async getPostInsights(postId) {
    try {
      const { apiUrl, accessToken } = sails.config.custom.facebook;

      if (!accessToken) {
        throw new Error('Facebook credentials not configured');
      }

      const url = `${apiUrl}/${postId}/insights`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          metric: 'post_impressions,post_engaged_users,post_clicks,post_reactions_by_type_total',
        },
      });

      return {
        success: true,
        insights: response.data.data,
      };
    } catch (error) {
      sails.log.error('FacebookService.getPostInsights error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch post insights: ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Get page-level insights
   */
  async getPageInsights() {
    try {
      const { apiUrl, pageId, accessToken } = sails.config.custom.facebook;

      if (!pageId || !accessToken) {
        throw new Error('Facebook credentials not configured');
      }

      const url = `${apiUrl}/${pageId}/insights`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          metric: 'page_impressions,page_engaged_users,page_fans,page_post_engagements',
          period: 'day',
        },
      });

      return {
        success: true,
        insights: response.data.data,
      };
    } catch (error) {
      sails.log.error('FacebookService.getPageInsights error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch page insights: ${error.response?.data?.error?.message || error.message}`);
    }
  },

};

