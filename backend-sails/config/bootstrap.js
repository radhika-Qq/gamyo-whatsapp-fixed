/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up data, run jobs, or perform some special logic.
 */

const winston = require('winston');
const Sentry = require('@sentry/node');

module.exports.bootstrap = async function (done) {

  // Initialize Winston Logger
  global.logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'gamyo-backend' },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });

  // Initialize Sentry for error tracking
  if (sails.config.custom.sentry.dsn) {
    Sentry.init({
      dsn: sails.config.custom.sentry.dsn,
      environment: sails.config.custom.sentry.environment,
      tracesSampleRate: 1.0,
    });
    sails.log.info('✅ Sentry initialized');
  }

  // Log startup information
  sails.log.info('🚀 Gamyo.ai Backend Bootstrap Started');
  sails.log.info(`📝 Environment: ${sails.config.environment}`);
  sails.log.info(`🌐 Port: ${sails.config.port}`);
  sails.log.info(`💾 Database: ${sails.config.datastores.default.adapter}`);
  
  // Check critical environment variables
  const criticalEnvVars = [
    'JWT_SECRET',
    'MONGO_URI',
  ];

  const missingVars = criticalEnvVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    sails.log.warn(`⚠️  Missing critical environment variables: ${missingVars.join(', ')}`);
  }

  // Initialize Redis connection (for BullMQ)
  try {
    const Redis = require('ioredis');
    global.redisClient = new Redis({
      host: sails.config.custom.redis.host,
      port: sails.config.custom.redis.port,
      password: sails.config.custom.redis.password,
      db: sails.config.custom.redis.db,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      sails.log.info('✅ Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      sails.log.error('❌ Redis connection error:', err);
    });
  } catch (err) {
    sails.log.error('❌ Failed to initialize Redis:', err);
  }

  // Initialize BullMQ Queues
  try {
    const { Queue } = require('bullmq');
    
    // Create post scheduling queue
    global.postScheduleQueue = new Queue('post-schedule', {
      connection: {
        host: sails.config.custom.redis.host,
        port: sails.config.custom.redis.port,
        password: sails.config.custom.redis.password,
      },
    });

    sails.log.info('✅ BullMQ queues initialized');
  } catch (err) {
    sails.log.error('❌ Failed to initialize BullMQ:', err);
  }

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};

