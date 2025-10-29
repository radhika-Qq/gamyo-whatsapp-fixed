import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { FacebookService } from '../services/facebook.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UploadMediaDto } from '../dto/upload-media.dto';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  /**
   * Upload media (photo or video) to Facebook Page
   * POST /facebook/upload
   */
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  async uploadMedia(@Body() uploadMediaDto: UploadMediaDto) {
    return this.facebookService.uploadMedia(uploadMediaDto);
  }

  /**
   * Create a post on Facebook Page
   * POST /facebook/post
   */
  @Post('post')
  @HttpCode(HttpStatus.OK)
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.facebookService.createPost(createPostDto);
  }

  /**
   * Get insights for a specific post
   * GET /facebook/insights/post/:postId
   */
  @Get('insights/post/:postId')
  async getPostInsights(@Param('postId') postId: string) {
    return this.facebookService.getPostInsights(postId);
  }

  /**
   * Get page-level insights
   * GET /facebook/insights/page
   */
  @Get('insights/page')
  async getPageInsights() {
    return this.facebookService.getPageInsights();
  }
}

