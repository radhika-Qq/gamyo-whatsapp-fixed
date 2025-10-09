import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { SentMessage } from '../entities/sent-message.entity';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private readonly WHATSAPP_API_URL: string;
  private readonly PHONE_NUMBER_ID: string;
  private readonly ACCESS_TOKEN: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(SentMessage)
    private readonly sentMessageRepository: Repository<SentMessage>,
  ) {
    this.WHATSAPP_API_URL = this.configService.get('WHATSAPP_API_URL', 'https://graph.facebook.com/v18.0');
    this.PHONE_NUMBER_ID = this.configService.get('WHATSAPP_PHONE_NUMBER_ID', 'YOUR_PHONE_NUMBER_ID');
    this.ACCESS_TOKEN = this.configService.get('WHATSAPP_ACCESS_TOKEN', 'YOUR_ACCESS_TOKEN');
  }

  async sendMessage(phone: string, message: string): Promise<any> {
    try {
      const url = `${this.WHATSAPP_API_URL}/${this.PHONE_NUMBER_ID}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message },
      };

      this.logger.log(`Sending message to ${phone}`);

      const { data } = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: { 
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      // Log message to database
      const sentMessage = this.sentMessageRepository.create({
        phone,
        message,
        whatsappMessageId: data.messages?.[0]?.id,
        status: 'sent',
        messageType: 'text',
      });
      await this.sentMessageRepository.save(sentMessage);

      this.logger.log(`Message sent successfully to ${phone}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to send message to ${phone}:`, error.response?.data || error.message);
      
      // Log failed message
      const sentMessage = this.sentMessageRepository.create({
        phone,
        message,
        status: 'failed',
        errorMessage: error.response?.data?.error?.message || error.message,
        messageType: 'text',
      });
      await this.sentMessageRepository.save(sentMessage);

      throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async sendTemplateMessage(phone: string, templateName: string, parameters: any[] = []): Promise<any> {
    try {
      const url = `${this.WHATSAPP_API_URL}/${this.PHONE_NUMBER_ID}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en_US' },
          components: parameters.length > 0 ? [
            {
              type: 'body',
              parameters: parameters,
            },
          ] : [],
        },
      };

      this.logger.log(`Sending template message (${templateName}) to ${phone}`);

      const { data } = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: { 
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      // Log message to database
      const sentMessage = this.sentMessageRepository.create({
        phone,
        message: `Template: ${templateName}`,
        whatsappMessageId: data.messages?.[0]?.id,
        status: 'sent',
        messageType: 'template',
        templateName,
      });
      await this.sentMessageRepository.save(sentMessage);

      this.logger.log(`Template message sent successfully to ${phone}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to send template message to ${phone}:`, error.response?.data || error.message);
      
      // Log failed message
      const sentMessage = this.sentMessageRepository.create({
        phone,
        message: `Template: ${templateName}`,
        status: 'failed',
        errorMessage: error.response?.data?.error?.message || error.message,
        messageType: 'template',
        templateName,
      });
      await this.sentMessageRepository.save(sentMessage);

      throw new Error(`Failed to send template message: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

