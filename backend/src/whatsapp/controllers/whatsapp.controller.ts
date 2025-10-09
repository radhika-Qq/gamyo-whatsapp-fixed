import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { MessagingService } from '../services/messaging.service';
import { BroadcastService } from '../services/broadcast.service';
import { ChannelService } from '../services/channel.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { SendBroadcastDto } from '../dto/send-broadcast.dto';
import { SendChannelDto } from '../dto/send-channel.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly broadcastService: BroadcastService,
    private readonly channelService: ChannelService,
  ) {}

  @Get('health')
  health() {
    return { status: 'ok', message: 'WhatsApp API is running' };
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const { phone, message } = sendMessageDto;
    return await this.messagingService.sendMessage(phone, message);
  }

  @Post('broadcast')
  @HttpCode(HttpStatus.OK)
  async sendBroadcast(@Body() sendBroadcastDto: SendBroadcastDto) {
    const { templateName, contacts } = sendBroadcastDto;
    return await this.broadcastService.sendBroadcast(templateName, contacts);
  }

  @Post('channel')
  @HttpCode(HttpStatus.OK)
  async sendChannelUpdate(@Body() sendChannelDto: SendChannelDto) {
    const { message } = sendChannelDto;
    return await this.channelService.sendChannelUpdate(message);
  }
}

