/**
 * PostController
 *
 * Post management controller for cross-platform publishing
 */

module.exports = {

  /**
   * Create a new post
   */
  create: async function (req, res) {
    try {
      const {
        content,
        mediaUrls,
        platforms,
        postType,
        scheduledAt,
        hashtags,
        isAiGenerated,
        aiMetadata,
      } = req.body;

      if (!content || !platforms || platforms.length === 0) {
        return res.badRequest({
          error: 'content and platforms are required',
        });
      }

      const post = await Post.create({
        content: content,
        mediaUrls: mediaUrls || [],
        platforms: platforms,
        postType: postType || 'text',
        status: scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        hashtags: hashtags || [],
        isAiGenerated: isAiGenerated || false,
        aiMetadata: aiMetadata || {},
        owner: req.user.id,
      }).fetch();

      return res.json({
        success: true,
        post: post,
        message: 'Post created successfully',
      });
    } catch (error) {
      sails.log.error('PostController.create error:', error);
      return res.serverError({
        error: 'Failed to create post',
        details: error.message,
      });
    }
  },

  /**
   * List posts
   */
  list: async function (req, res) {
    try {
      const { page = 1, limit = 20, status, platform } = req.query;

      const skip = (page - 1) * limit;

      const criteria = { owner: req.user.id };
      if (status) criteria.status = status;
      if (platform) criteria.platforms = { contains: platform };

      const posts = await Post.find(criteria)
        .sort('createdAt DESC')
        .limit(limit)
        .skip(skip);

      const total = await Post.count(criteria);

      return res.json({
        success: true,
        posts: posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      sails.log.error('PostController.list error:', error);
      return res.serverError({
        error: 'Failed to fetch posts',
        details: error.message,
      });
    }
  },

  /**
   * Get single post
   */
  findOne: async function (req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findOne({ id: id, owner: req.user.id });

      if (!post) {
        return res.notFound({
          error: 'Post not found',
        });
      }

      return res.json({
        success: true,
        post: post,
      });
    } catch (error) {
      sails.log.error('PostController.findOne error:', error);
      return res.serverError({
        error: 'Failed to fetch post',
        details: error.message,
      });
    }
  },

  /**
   * Update post
   */
  update: async function (req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check if post exists and belongs to user
      const existingPost = await Post.findOne({ id: id, owner: req.user.id });
      if (!existingPost) {
        return res.notFound({
          error: 'Post not found',
        });
      }

      // Prevent updating published posts
      if (existingPost.status === 'published') {
        return res.badRequest({
          error: 'Cannot update published posts',
        });
      }

      const post = await Post.updateOne({ id: id }).set(updates);

      return res.json({
        success: true,
        post: post,
        message: 'Post updated successfully',
      });
    } catch (error) {
      sails.log.error('PostController.update error:', error);
      return res.serverError({
        error: 'Failed to update post',
        details: error.message,
      });
    }
  },

  /**
   * Delete post
   */
  delete: async function (req, res) {
    try {
      const { id } = req.params;

      // Check if post exists and belongs to user
      const post = await Post.findOne({ id: id, owner: req.user.id });
      if (!post) {
        return res.notFound({
          error: 'Post not found',
        });
      }

      await Post.destroyOne({ id: id });

      return res.json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      sails.log.error('PostController.delete error:', error);
      return res.serverError({
        error: 'Failed to delete post',
        details: error.message,
      });
    }
  },

  /**
   * Schedule post for later publishing
   */
  schedule: async function (req, res) {
    try {
      const { id } = req.params;
      const { scheduledAt } = req.body;

      if (!scheduledAt) {
        return res.badRequest({
          error: 'scheduledAt is required',
        });
      }

      const post = await Post.findOne({ id: id, owner: req.user.id });
      if (!post) {
        return res.notFound({
          error: 'Post not found',
        });
      }

      // Update post with schedule
      await Post.updateOne({ id: id }).set({
        scheduledAt: new Date(scheduledAt),
        status: 'scheduled',
      });

      // Add to BullMQ queue
      if (global.postScheduleQueue) {
        const job = await global.postScheduleQueue.add(
          'publish-post',
          { postId: id, userId: req.user.id },
          {
            delay: new Date(scheduledAt).getTime() - Date.now(),
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
          }
        );

        // Create schedule record
        await Schedule.create({
          post: id,
          executeAt: new Date(scheduledAt),
          status: 'pending',
          jobId: job.id,
          owner: req.user.id,
        });
      }

      return res.json({
        success: true,
        message: 'Post scheduled successfully',
      });
    } catch (error) {
      sails.log.error('PostController.schedule error:', error);
      return res.serverError({
        error: 'Failed to schedule post',
        details: error.message,
      });
    }
  },

  /**
   * Publish post immediately
   */
  publish: async function (req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findOne({ id: id, owner: req.user.id });
      if (!post) {
        return res.notFound({
          error: 'Post not found',
        });
      }

      // Publish to each platform
      const results = await sails.helpers.publishPost(post);

      // Update post status
      await Post.updateOne({ id: id }).set({
        status: 'published',
        publishedAt: new Date(),
        platformPostIds: results.platformPostIds,
        errorMessages: results.errors,
      });

      return res.json({
        success: true,
        message: 'Post published successfully',
        results: results,
      });
    } catch (error) {
      sails.log.error('PostController.publish error:', error);
      return res.serverError({
        error: 'Failed to publish post',
        details: error.message,
      });
    }
  },

};

