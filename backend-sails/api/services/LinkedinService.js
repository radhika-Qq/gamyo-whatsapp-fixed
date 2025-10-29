/**
 * LinkedinService.js
 *
 * Service for LinkedIn API integration
 */

const axios = require('axios');

module.exports = {

  /**
   * Upload media to LinkedIn
   * @param mediaUrl - URL of media to upload
   * @returns The asset URN that can be used in posts
   */
  async uploadMedia(mediaUrl) {
    try {
      const { apiUrl, accessToken, organizationUrn } = sails.config.custom.linkedin;

      if (!accessToken || !organizationUrn) {
        throw new Error('LinkedIn credentials not configured');
      }

      sails.log.info(`Uploading media to LinkedIn from URL: ${mediaUrl}`);

      // Step 1: Register upload with LinkedIn
      const registerResponse = await axios.post(
        `${apiUrl}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            owner: organizationUrn,
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            serviceRelationships: [
              {
                identifier: 'urn:li:userGeneratedContent',
                relationshipType: 'OWNER',
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      const uploadUrl = registerResponse.data.value.uploadMechanism[
        'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
      ].uploadUrl;
      const assetUrn = registerResponse.data.value.asset;

      sails.log.info(`Upload URL obtained: ${uploadUrl}`);
      sails.log.info(`Asset URN: ${assetUrn}`);

      // Step 2: Fetch media from provided URL
      const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });

      // Step 3: Upload media to LinkedIn
      await axios.put(uploadUrl, mediaResponse.data, {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });

      sails.log.info('Media uploaded successfully to LinkedIn');

      return {
        success: true,
        assetUrn: assetUrn,
        message: 'Media uploaded successfully',
      };
    } catch (error) {
      sails.log.error('LinkedinService.uploadMedia error:', error.response?.data || error.message);
      throw new Error(`Failed to upload media: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Publish a post to LinkedIn
   * @param text - Post text content
   * @param mediaUrn - Optional media asset URN
   * @returns Response from LinkedIn API
   */
  async publishPost(text, mediaUrn = null) {
    try {
      const { apiUrl, accessToken, organizationUrn } = sails.config.custom.linkedin;

      if (!accessToken || !organizationUrn) {
        throw new Error('LinkedIn credentials not configured');
      }

      sails.log.info(`Publishing post to LinkedIn: ${text.substring(0, 50)}...`);

      const postData = {
        author: organizationUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text,
            },
            shareMediaCategory: mediaUrn ? 'IMAGE' : 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      // Add media if provided
      if (mediaUrn) {
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            media: mediaUrn,
          },
        ];
      }

      const response = await axios.post(`${apiUrl}/ugcPosts`, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      sails.log.info('Post published successfully to LinkedIn');

      return {
        success: true,
        postId: response.data.id,
        message: 'Post published successfully to LinkedIn',
        data: response.data,
      };
    } catch (error) {
      sails.log.error('LinkedinService.publishPost error:', error.response?.data || error.message);
      throw new Error(`Failed to publish post: ${error.response?.data?.message || error.message}`);
    }
  },

  /**
   * Get organization info to verify credentials
   * @returns Organization information
   */
  async getOrganizationInfo() {
    try {
      const { apiUrl, accessToken, organizationUrn } = sails.config.custom.linkedin;

      if (!accessToken || !organizationUrn) {
        throw new Error('LinkedIn credentials not configured');
      }

      const organizationId = organizationUrn.split(':').pop();
      sails.log.info(`Fetching LinkedIn organization info for: ${organizationId}`);

      const response = await axios.get(
        `${apiUrl}/organizations/${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('LinkedinService.getOrganizationInfo error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch organization info: ${error.response?.data?.message || error.message}`);
    }
  },

};

