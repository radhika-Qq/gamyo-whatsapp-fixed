/**
 * Helper: publish-post
 *
 * Publishes a post to all configured platforms
 */

module.exports = {

  friendlyName: 'Publish post',

  description: 'Publish a post to all configured platforms',

  inputs: {
    post: {
      type: 'ref',
      required: true,
      description: 'The post record to publish',
    },
  },

  exits: {
    success: {
      description: 'Post published successfully',
    },
  },

  fn: async function (inputs) {
    const post = inputs.post;
    const platforms = post.platforms || [];
    const platformPostIds = {};
    const errors = {};

    sails.log.info(`Publishing post ${post.id} to platforms: ${platforms.join(', ')}`);

    // Publish to Facebook
    if (platforms.includes('facebook')) {
      try {
        let mediaId = null;

        // Upload media if exists
        if (post.mediaUrls && post.mediaUrls.length > 0) {
          const mediaResult = await FacebookService.uploadMedia(
            post.mediaUrls[0],
            post.postType === 'video' ? 'video' : 'photo',
            post.content
          );
          mediaId = mediaResult.mediaId;
        }

        // Create post
        const result = await FacebookService.createPost(post.content, mediaId);
        platformPostIds.facebook = result.postId;
        sails.log.info(`Published to Facebook: ${result.postId}`);
      } catch (error) {
        sails.log.error('Failed to publish to Facebook:', error);
        errors.facebook = error.message;
      }
    }

    // Publish to Instagram
    if (platforms.includes('instagram')) {
      try {
        if (post.mediaUrls && post.mediaUrls.length > 0) {
          // Step 1: Create container
          const containerResult = await InstagramService.createMediaContainer(
            post.mediaUrls[0],
            post.content
          );

          // Step 2: Publish container
          const publishResult = await InstagramService.publishContainer(
            containerResult.creationId
          );
          platformPostIds.instagram = publishResult.mediaId;
          sails.log.info(`Published to Instagram: ${publishResult.mediaId}`);
        } else {
          errors.instagram = 'Instagram requires at least one media file';
        }
      } catch (error) {
        sails.log.error('Failed to publish to Instagram:', error);
        errors.instagram = error.message;
      }
    }

    // Publish to LinkedIn
    if (platforms.includes('linkedin')) {
      try {
        let mediaUrn = null;

        // Upload media if exists
        if (post.mediaUrls && post.mediaUrls.length > 0) {
          const mediaResult = await LinkedinService.uploadMedia(post.mediaUrls[0]);
          mediaUrn = mediaResult.assetUrn;
        }

        // Publish post
        const result = await LinkedinService.publishPost(post.content, mediaUrn);
        platformPostIds.linkedin = result.postId;
        sails.log.info(`Published to LinkedIn: ${result.postId}`);
      } catch (error) {
        sails.log.error('Failed to publish to LinkedIn:', error);
        errors.linkedin = error.message;
      }
    }

    // Publish to WhatsApp (not typically used for posts, but included for completeness)
    if (platforms.includes('whatsapp')) {
      try {
        // WhatsApp doesn't have a "post" concept like other platforms
        // This would be more for broadcasts or channel messages
        errors.whatsapp = 'WhatsApp publishing requires specific recipient configuration';
      } catch (error) {
        sails.log.error('Failed to publish to WhatsApp:', error);
        errors.whatsapp = error.message;
      }
    }

    return {
      platformPostIds: platformPostIds,
      errors: errors,
      successCount: Object.keys(platformPostIds).length,
      failureCount: Object.keys(errors).length,
    };
  },

};

