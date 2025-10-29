/**
 * Schedule.js
 *
 * Schedule model for managing post scheduling and recurring posts
 */

module.exports = {

  attributes: {

    // Related post
    post: {
      model: 'post',
      required: true,
    },

    // Scheduled execution time
    executeAt: {
      type: 'ref',
      columnType: 'datetime',
      required: true,
    },

    // Recurrence pattern (if recurring)
    recurrencePattern: {
      type: 'string',
      isIn: ['none', 'daily', 'weekly', 'monthly'],
      defaultsTo: 'none',
    },

    // Recurrence end date
    recurrenceEnd: {
      type: 'ref',
      columnType: 'datetime',
    },

    // Job status
    status: {
      type: 'string',
      isIn: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      defaultsTo: 'pending',
    },

    // BullMQ job ID
    jobId: {
      type: 'string',
      description: 'BullMQ queue job ID for tracking',
    },

    // Number of retry attempts
    retryCount: {
      type: 'number',
      defaultsTo: 0,
    },

    // Maximum retry attempts
    maxRetries: {
      type: 'number',
      defaultsTo: 3,
    },

    // Last error message
    lastError: {
      type: 'string',
      columnType: 'text',
    },

    // Execution result
    executionResult: {
      type: 'json',
      defaultsTo: {},
      description: 'Results from executing the scheduled job',
    },

    // Owner
    owner: {
      model: 'user',
      required: true,
    },

  },

};

