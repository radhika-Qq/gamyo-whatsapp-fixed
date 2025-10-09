import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

// Entities
import { Contact } from './entities/contact.entity';
import { Template } from './entities/template.entity';
import { SentMessage } from './entities/sent-message.entity';

// Services
import { MessagingService } from './services/messaging.service';
import { BroadcastService } from './services/broadcast.service';
import { ChannelService } from './services/channel.service';

// Controllers
import { WhatsappController } from './controllers/whatsapp.controller';
import { WebhookController } from './controllers/webhook.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, Template, SentMessage]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [WhatsappController, WebhookController],
  providers: [MessagingService, BroadcastService, ChannelService],
  exports: [MessagingService, BroadcastService, ChannelService],
})
export class WhatsappModule {}

