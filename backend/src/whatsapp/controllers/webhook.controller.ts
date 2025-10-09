import { Controller, Post, Get, Body, Query, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  private readonly VERIFY_TOKEN: string;

  constructor(private readonly configService: ConfigService) {
    this.VERIFY_TOKEN = this.configService.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN', 'YOUR_WEBHOOK_VERIFY_TOKEN');
  }

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    this.logger.log('Webhook verification request received');

    if (mode === 'subscribe' && token === this.VERIFY_TOKEN) {
      this.logger.log('Webhook verified successfully');
      return challenge;
    } else {
      this.logger.warn('Webhook verification failed');
      return 'Verification failed';
    }
  }

  @Post()
  async handleWebhook(@Body() body: any) {
    this.logger.log('Webhook event received:', JSON.stringify(body, null, 2));

    try {
      // Check if this is a WhatsApp Business API event
      if (body.object === 'whatsapp_business_account') {
        // Process each entry
        for (const entry of body.entry || []) {
          // Process each change
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              await this.handleMessageEvent(change.value);
            }
          }
        }
      }

      return { status: 'EVENT_RECEIVED' };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      return { status: 'ERROR', message: error.message };
    }
  }

  private async handleMessageEvent(value: any) {
    const { messages, statuses, contacts } = value;

    // Handle incoming messages
    if (messages) {
      for (const message of messages) {
        this.logger.log(`Received message from ${message.from}: ${message.text?.body || '[Media]'}`);
        
        // Here you can:
        // 1. Store the message in the database
        // 2. Trigger auto-responses
        // 3. Send notifications to your application
        // 4. Update customer support tickets
        
        // Example: Log message details
        this.logger.log({
          messageId: message.id,
          from: message.from,
          timestamp: message.timestamp,
          type: message.type,
          text: message.text?.body,
        });
      }
    }

    // Handle message status updates (sent, delivered, read, failed)
    if (statuses) {
      for (const status of statuses) {
        this.logger.log(`Message ${status.id} status: ${status.status}`);
        
        // Here you can:
        // 1. Update the message status in your database
        // 2. Trigger notifications based on delivery status
        // 3. Handle failed messages
        
        // Example: Log status details
        this.logger.log({
          messageId: status.id,
          status: status.status,
          timestamp: status.timestamp,
          recipient: status.recipient_id,
        });
      }
    }

    // Handle contact information
    if (contacts) {
      for (const contact of contacts) {
        this.logger.log(`Contact info: ${contact.profile?.name} (${contact.wa_id})`);
      }
    }
  }
}

