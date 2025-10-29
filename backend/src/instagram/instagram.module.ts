import { Module } from '@nestjs/common';
import { InstagramController } from './controllers/instagram.controller';
import { InstagramService } from './services/instagram.service';

@Module({
  controllers: [InstagramController],
  providers: [InstagramService],
  exports: [InstagramService],
})
export class InstagramModule {}

