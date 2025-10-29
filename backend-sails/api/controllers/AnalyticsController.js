/**
 * AnalyticsController
 *
 * Analytics and insights controller
 */

module.exports = {

  /**
   * Get overview analytics
   */
  overview: async function (req, res) {
    try {
      const userId = req.user.id;

      // Get post counts by status
      const draftCount = await Post.count({ owner: userId, status: 'draft' });
      const scheduledCount = await Post.count({ owner: userId, status: 'scheduled' });
      const publishedCount = await Post.count({ owner: userId, status: 'published' });
      const failedCount = await Post.count({ owner: userId, status: 'failed' });

      // Get recent posts
      const recentPosts = await Post.find({
        owner: userId,
        status: 'published',
      })
        .sort('publishedAt DESC')
        .limit(10);

      return res.json({
        success: true,
        overview: {
          totalPosts: draftCount + scheduledCount + publishedCount + failedCount,
          draft: draftCount,
          scheduled: scheduledCount,
          published: publishedCount,
          failed: failedCount,
        },
        recentPosts: recentPosts,
      });
    } catch (error) {
      sails.log.error('AnalyticsController.overview error:', error);
      return res.serverError({
        error: 'Failed to fetch analytics overview',
        details: error.message,
      });
    }
  },

  /**
   * Get engagement metrics
   */
  engagement: async function (req, res) {
    try {
      const userId = req.user.id;

      // Get published posts with analytics data
      const posts = await Post.find({
        owner: userId,
        status: 'published',
      })
        .sort('publishedAt DESC')
        .limit(50);

      // Aggregate engagement metrics
      let totalImpressions = 0;
      let totalEngagements = 0;
      let totalReach = 0;

      posts.forEach(post => {
        if (post.analytics) {
          totalImpressions += post.analytics.impressions || 0;
          totalEngagements += post.analytics.engagements || 0;
          totalReach += post.analytics.reach || 0;
        }
      });

      const engagementRate = totalImpressions > 0 
        ? ((totalEngagements / totalImpressions) * 100).toFixed(2)
        : 0;

      return res.json({
        success: true,
        engagement: {
          totalImpressions: totalImpressions,
          totalEngagements: totalEngagements,
          totalReach: totalReach,
          engagementRate: engagementRate,
          postsAnalyzed: posts.length,
        },
      });
    } catch (error) {
      sails.log.error('AnalyticsController.engagement error:', error);
      return res.serverError({
        error: 'Failed to fetch engagement metrics',
        details: error.message,
      });
    }
  },

  /**
   * Get platform breakdown
   */
  platformBreakdown: async function (req, res) {
    try {
      const userId = req.user.id;

      const publishedPosts = await Post.find({
        owner: userId,
        status: 'published',
      });

      // Count posts per platform
      const platformCounts = {
        whatsapp: 0,
        facebook: 0,
        instagram: 0,
        linkedin: 0,
      };

      publishedPosts.forEach(post => {
        if (post.platforms && Array.isArray(post.platforms)) {
          post.platforms.forEach(platform => {
            if (platformCounts.hasOwnProperty(platform)) {
              platformCounts[platform]++;
            }
          });
        }
      });

      return res.json({
        success: true,
        platformBreakdown: platformCounts,
        totalPosts: publishedPosts.length,
      });
    } catch (error) {
      sails.log.error('AnalyticsController.platformBreakdown error:', error);
      return res.serverError({
        error: 'Failed to fetch platform breakdown',
        details: error.message,
      });
    }
  },

};

