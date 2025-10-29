import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LinkedInService } from '../services/linkedin.service';
import { PostContentDto } from '../dto/post-content.dto';
import { UploadMediaDto } from '../dto/upload-media.dto';

@Controller('linkedin')
export class LinkedInController {
  constructor(private readonly linkedinService: LinkedInService) {}

  /**
   * Upload media to LinkedIn
   * POST /linkedin/upload
   */
  @Post('upload')
  async uploadMedia(@Body() uploadMediaDto: UploadMediaDto) {
    try {
      return await this.linkedinService.uploadMedia(uploadMediaDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to upload media to LinkedIn',
          details: error.response?.data || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Publish a post to LinkedIn
   * POST /linkedin/post
   */
  @Post('post')
  async publishPost(@Body() postContentDto: PostContentDto) {
    try {
      return await this.linkedinService.publishPost(postContentDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to publish post to LinkedIn',
          details: error.response?.data || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get organization info (for testing/verification)
   * GET /linkedin/organization
   */
  @Get('organization')
  async getOrganizationInfo() {
    try {
      return await this.linkedinService.getOrganizationInfo();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch organization info',
          details: error.response?.data || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Health check endpoint
   * GET /linkedin/health
   */
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'LinkedIn Integration',
      timestamp: new Date().toISOString(),
    };
  }
}

