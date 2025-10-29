import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FacebookController } from './controllers/facebook.controller';
import { FacebookService } from './services/facebook.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [FacebookController],
  providers: [FacebookService],
  exports: [FacebookService],
})
export class FacebookModule {}

