/**
 * WebhookController
 *
 * WhatsApp webhook controller for receiving messages and events
 */

module.exports = {

  /**
   * Verify webhook (GET request from WhatsApp)
   */
  verify: async function (req, res) {
    try {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      const verifyToken = sails.config.custom.whatsapp.webhookVerifyToken;

      if (mode === 'subscribe' && token === verifyToken) {
        sails.log.info('Webhook verified successfully');
        return res.send(challenge);
      } else {
        sails.log.warn('Webhook verification failed');
        return res.forbidden();
      }
    } catch (error) {
      sails.log.error('WebhookController.verify error:', error);
      return res.serverError({
        error: 'Failed to verify webhook',
        details: error.message,
      });
    }
  },

  /**
   * Receive webhook events (POST request from WhatsApp)
   */
  receive: async function (req, res) {
    try {
      const body = req.body;

      sails.log.info('Received webhook event:', JSON.stringify(body));

      // Respond quickly to WhatsApp
      res.sendStatus(200);

      // Process webhook event asynchronously
      if (body.entry && body.entry.length > 0) {
        for (const entry of body.entry) {
          if (entry.changes && entry.changes.length > 0) {
            for (const change of entry.changes) {
              if (change.value && change.value.messages) {
                for (const message of change.value.messages) {
                  await this._processMessage(message, change.value);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      sails.log.error('WebhookController.receive error:', error);
      // Still return 200 to WhatsApp to avoid retries
      return res.sendStatus(200);
    }
  },

  /**
   * Process incoming message
   * @private
   */
  _processMessage: async function (message, value) {
    try {
      sails.log.info('Processing message:', {
        from: message.from,
        type: message.type,
        timestamp: message.timestamp,
      });

      // TODO: Implement message processing logic
      // - Store message in database
      // - Trigger auto-responses
      // - Notify user
      // - AI-powered responses

      // Example: Store incoming message
      // await IncomingMessage.create({
      //   from: message.from,
      //   type: message.type,
      //   text: message.text?.body,
      //   timestamp: new Date(parseInt(message.timestamp) * 1000),
      //   metadata: message,
      // });

    } catch (error) {
      sails.log.error('Error processing message:', error);
    }
  },

};

