/**
 * Post.js
 *
 * Post model for managing social media posts across platforms
 */

module.exports = {

  attributes: {

    // Post content
    content: {
      type: 'string',
      required: true,
      columnType: 'text',
    },

    // Media URLs (images, videos)
    mediaUrls: {
      type: 'json',
      defaultsTo: [],
      description: 'Array of media URLs attached to post',
    },

    // Media IDs from platforms
    mediaIds: {
      type: 'json',
      defaultsTo: {},
      description: 'Platform-specific media IDs (Facebook, Instagram, etc.)',
    },

    // Target platforms
    platforms: {
      type: 'json',
      required: true,
      defaultsTo: [],
      description: 'Array of platforms: whatsapp, facebook, instagram, linkedin',
    },

    // Post type
    postType: {
      type: 'string',
      isIn: ['text', 'image', 'video', 'carousel', 'story'],
      defaultsTo: 'text',
    },

    // Post status
    status: {
      type: 'string',
      isIn: ['draft', 'scheduled', 'published', 'failed'],
      defaultsTo: 'draft',
    },

    // Scheduled publication time
    scheduledAt: {
      type: 'ref',
      columnType: 'datetime',
      description: 'When the post should be published',
    },

    // Actual publication time
    publishedAt: {
      type: 'ref',
      columnType: 'datetime',
      description: 'When the post was actually published',
    },

    // Platform-specific post IDs
    platformPostIds: {
      type: 'json',
      defaultsTo: {},
      description: 'Post IDs from each platform after publishing',
    },

    // AI-generated content flag
    isAiGenerated: {
      type: 'boolean',
      defaultsTo: false,
    },

    // AI generation metadata
    aiMetadata: {
      type: 'json',
      defaultsTo: {},
      description: 'Stores AI generation parameters and prompts',
    },

    // Analytics data
    analytics: {
      type: 'json',
      defaultsTo: {},
      description: 'Engagement metrics from each platform',
    },

    // Hashtags
    hashtags: {
      type: 'json',
      defaultsTo: [],
      description: 'Array of hashtags used in the post',
    },

    // Error messages (if any)
    errorMessages: {
      type: 'json',
      defaultsTo: {},
      description: 'Error messages per platform if publishing failed',
    },

    // Relationships
    owner: {
      model: 'user',
      required: true,
    },

  },

};

