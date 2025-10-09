import { Injectable, Logger } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Injectable()
export class BroadcastService {
  private readonly logger = new Logger(BroadcastService.name);

  constructor(private readonly messagingService: MessagingService) {}

  async sendBroadcast(templateName: string, contacts: string[]): Promise<any> {
    this.logger.log(`Starting broadcast to ${contacts.length} contacts with template: ${templateName}`);

    const results = {
      total: contacts.length,
      successful: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Split into batches to avoid overwhelming the API
    const batches = this.chunk(contacts, 250); // WhatsApp's recommended batch size
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      this.logger.log(`Processing batch ${batchIndex + 1}/${batches.length}`);

      for (const phone of batch) {
        try {
          // For demo purposes, we'll send as template messages
          // In production, you'd want to use approved templates
          await this.messagingService.sendMessage(phone, `🎉 Your ${templateName} offer! Check it out now!`);
          results.successful++;
          
          // Rate limiting: 1 second delay between messages
          await this.delay(1000);
        } catch (error) {
          this.logger.error(`Failed to send to ${phone}:`, error.message);
          results.failed++;
          results.errors.push({
            phone,
            error: error.message,
          });
        }
      }
    }

    this.logger.log(`Broadcast completed: ${results.successful} successful, ${results.failed} failed`);
    return results;
  }

  async sendTemplateBroadcast(templateName: string, contacts: string[], parameters: any[] = []): Promise<any> {
    this.logger.log(`Starting template broadcast to ${contacts.length} contacts`);

    const results = {
      total: contacts.length,
      successful: 0,
      failed: 0,
      errors: [] as any[],
    };

    const batches = this.chunk(contacts, 250);
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      this.logger.log(`Processing batch ${batchIndex + 1}/${batches.length}`);

      for (const phone of batch) {
        try {
          await this.messagingService.sendTemplateMessage(phone, templateName, parameters);
          results.successful++;
          
          // Rate limiting: 1 second delay between messages
          await this.delay(1000);
        } catch (error) {
          this.logger.error(`Failed to send template to ${phone}:`, error.message);
          results.failed++;
          results.errors.push({
            phone,
            error: error.message,
          });
        }
      }
    }

    this.logger.log(`Template broadcast completed: ${results.successful} successful, ${results.failed} failed`);
    return results;
  }

  private chunk(array: any[], size: number): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

