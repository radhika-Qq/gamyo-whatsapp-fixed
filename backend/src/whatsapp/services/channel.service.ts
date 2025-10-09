import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { SentMessage } from '../entities/sent-message.entity';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);
  private readonly WHATSAPP_API_URL: string;
  private readonly PHONE_NUMBER_ID: string;
  private readonly ACCESS_TOKEN: string;
  private readonly CHANNEL_ID: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(SentMessage)
    private readonly sentMessageRepository: Repository<SentMessage>,
  ) {
    this.WHATSAPP_API_URL = this.configService.get('WHATSAPP_API_URL', 'https://graph.facebook.com/v18.0');
    this.PHONE_NUMBER_ID = this.configService.get('WHATSAPP_PHONE_NUMBER_ID', 'YOUR_PHONE_NUMBER_ID');
    this.ACCESS_TOKEN = this.configService.get('WHATSAPP_ACCESS_TOKEN', 'YOUR_ACCESS_TOKEN');
    this.CHANNEL_ID = this.configService.get('WHATSAPP_CHANNEL_ID', 'YOUR_CHANNEL_ID');
  }

  async sendChannelUpdate(message: string): Promise<any> {
    try {
      const url = `${this.WHATSAPP_API_URL}/${this.PHONE_NUMBER_ID}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'channel',
        to: this.CHANNEL_ID,
        type: 'text',
        text: { body: message },
      };

      this.logger.log(`Sending channel update`);

      const { data } = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: { 
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      // Log channel message to database
      const sentMessage = this.sentMessageRepository.create({
        phone: this.CHANNEL_ID,
        message,
        whatsappMessageId: data.messages?.[0]?.id,
        status: 'sent',
        messageType: 'channel',
      });
      await this.sentMessageRepository.save(sentMessage);

      this.logger.log(`Channel update sent successfully`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to send channel update:`, error.response?.data || error.message);
      
      // Log failed message
      const sentMessage = this.sentMessageRepository.create({
        phone: this.CHANNEL_ID,
        message,
        status: 'failed',
        errorMessage: error.response?.data?.error?.message || error.message,
        messageType: 'channel',
      });
      await this.sentMessageRepository.save(sentMessage);

      throw new Error(`Failed to send channel update: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async sendChannelMedia(mediaUrl: string, caption?: string): Promise<any> {
    try {
      const url = `${this.WHATSAPP_API_URL}/${this.PHONE_NUMBER_ID}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'channel',
        to: this.CHANNEL_ID,
        type: 'image',
        image: {
          link: mediaUrl,
          caption: caption || '',
        },
      };

      this.logger.log(`Sending channel media update`);

      const { data } = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: { 
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      // Log channel message to database
      const sentMessage = this.sentMessageRepository.create({
        phone: this.CHANNEL_ID,
        message: `Media: ${mediaUrl} - ${caption}`,
        whatsappMessageId: data.messages?.[0]?.id,
        status: 'sent',
        messageType: 'channel',
      });
      await this.sentMessageRepository.save(sentMessage);

      this.logger.log(`Channel media update sent successfully`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to send channel media:`, error.response?.data || error.message);
      throw new Error(`Failed to send channel media: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

