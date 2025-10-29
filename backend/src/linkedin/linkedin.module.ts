import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LinkedInController } from './controllers/linkedin.controller';
import { LinkedInService } from './services/linkedin.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [LinkedInController],
  providers: [LinkedInService],
  exports: [LinkedInService],
})
export class LinkedInModule {}

