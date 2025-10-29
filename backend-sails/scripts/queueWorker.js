/**
 * BullMQ Queue Worker
 *
 * Processes background jobs for scheduled posts
 */

require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/worker.log' }),
  ],
});

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB) || 0,
  maxRetriesPerRequest: null,
});

// Create worker for post scheduling
const postScheduleWorker = new Worker(
  'post-schedule',
  async (job) => {
    logger.info(`Processing job ${job.id}: ${job.name}`, job.data);

    try {
      const { postId, userId } = job.data;

      // Here you would:
      // 1. Fetch the post from database
      // 2. Publish to all platforms
      // 3. Update post status
      // 4. Update schedule record

      // For now, we'll just log it
      // In production, you'd need to import your Sails models and services
      logger.info(`Publishing post ${postId} for user ${userId}`);

      // Mock implementation - replace with actual publishing logic
      // const post = await Post.findOne({ id: postId });
      // const results = await publishPost(post);
      // await Post.updateOne({ id: postId }).set({ status: 'published', publishedAt: new Date() });

      return { success: true, postId: postId };
    } catch (error) {
      logger.error('Job processing error:', error);
      throw error;
    }
  },
  {
    connection: connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 60000, // 10 jobs per minute
    },
  }
);

// Event listeners
postScheduleWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

postScheduleWorker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed:`, err);
});

postScheduleWorker.on('error', (err) => {
  logger.error('Worker error:', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker...');
  await postScheduleWorker.close();
  await connection.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing worker...');
  await postScheduleWorker.close();
  await connection.quit();
  process.exit(0);
});

logger.info('🚀 BullMQ worker started successfully');
logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`🔗 Redis: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);

