import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { InstagramService } from '../services/instagram.service';
import { UploadMediaDto } from '../dto/upload-media.dto';
import { CreatePostDto } from '../dto/create-post.dto';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  /**
   * Create a media container for Instagram post
   * POST /instagram/upload
   */
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  async createMediaContainer(@Body() dto: UploadMediaDto) {
    return this.instagramService.createMediaContainer(dto);
  }

  /**
   * Publish a media container to Instagram feed
   * POST /instagram/publish
   */
  @Post('publish')
  @HttpCode(HttpStatus.OK)
  async publishContainer(@Body() dto: CreatePostDto) {
    return this.instagramService.publishContainer(dto);
  }

  /**
   * Get insights for a specific Instagram media post
   * GET /instagram/insights/:mediaId
   */
  @Get('insights/:mediaId')
  async getInsights(@Param('mediaId') mediaId: string) {
    return this.instagramService.getInsights(mediaId);
  }

  /**
   * Get account-level insights
   * GET /instagram/insights
   */
  @Get('insights')
  async getAccountInsights() {
    return this.instagramService.getAccountInsights();
  }
}

