import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreatePostDto } from '../dto/create-post.dto';
import { UploadMediaDto, MediaType } from '../dto/upload-media.dto';

@Injectable()
export class FacebookService {
  private readonly apiUrl: string;
  private readonly pageId: string;
  private readonly accessToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('FACEBOOK_API_URL') || 'https://graph.facebook.com/v21.0';
    this.pageId = this.configService.get<string>('FACEBOOK_PAGE_ID');
    this.accessToken = this.configService.get<string>('FACEBOOK_ACCESS_TOKEN');

    if (!this.pageId || !this.accessToken) {
      console.warn('Facebook credentials not configured. Please set FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN in .env');
    }
  }

  /**
   * Upload a photo to Facebook Page
   */
  async uploadPhoto(dto: UploadMediaDto): Promise<any> {
    try {
      const url = `${this.apiUrl}/${this.pageId}/photos`;
      
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            url: dto.mediaUrl,
            caption: dto.caption || '',
            published: false, // Unpublished so it can be attached to a post
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        ),
      );

      return {
        success: true,
        mediaId: response.data.id,
        data: response.data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to upload photo to Facebook',
          error: error.response?.data || error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload a video to Facebook Page
   */
  async uploadVideo(dto: UploadMediaDto): Promise<any> {
    try {
      const url = `${this.apiUrl}/${this.pageId}/videos`;
      
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            file_url: dto.mediaUrl,
            description: dto.caption || '',
            published: false, // Unpublished so it can be attached to a post
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        ),
      );

      return {
        success: true,
        mediaId: response.data.id,
        data: response.data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to upload video to Facebook',
          error: error.response?.data || error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload media (photo or video) based on type
   */
  async uploadMedia(dto: UploadMediaDto): Promise<any> {
    if (dto.mediaType === MediaType.PHOTO) {
      return this.uploadPhoto(dto);
    } else if (dto.mediaType === MediaType.VIDEO) {
      return this.uploadVideo(dto);
    } else {
      throw new HttpException(
        {
          success: false,
          message: 'Invalid media type. Must be "photo" or "video"',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Create a post on Facebook Page
   */
  async createPost(dto: CreatePostDto): Promise<any> {
    try {
      const url = `${this.apiUrl}/${this.pageId}/feed`;
      
      const postData: any = {
        message: dto.message,
      };

      // Attach media if provided
      if (dto.mediaId) {
        postData.attached_media = [{ media_fbid: dto.mediaId }];
      }

      // Schedule post if scheduledTime is provided
      if (dto.scheduledTime) {
        postData.scheduled_publish_time = dto.scheduledTime;
        postData.published = false; // Must be unpublished for scheduled posts
      }

      const response = await firstValueFrom(
        this.httpService.post(url, postData, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }),
      );

      return {
        success: true,
        postId: response.data.id,
        message: dto.scheduledTime 
          ? 'Post scheduled successfully on Facebook Page' 
          : 'Post published successfully on Facebook Page',
        data: response.data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create post on Facebook',
          error: error.response?.data || error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get insights for a post
   */
  async getPostInsights(postId: string): Promise<any> {
    try {
      const url = `${this.apiUrl}/${postId}/insights`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            metric: 'post_impressions,post_engaged_users,post_clicks,post_reactions_by_type_total',
          },
        }),
      );

      return {
        success: true,
        insights: response.data.data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch post insights from Facebook',
          error: error.response?.data || error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get page-level insights
   */
  async getPageInsights(): Promise<any> {
    try {
      const url = `${this.apiUrl}/${this.pageId}/insights`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            metric: 'page_impressions,page_engaged_users,page_fans,page_post_engagements',
            period: 'day',
          },
        }),
      );

      return {
        success: true,
        insights: response.data.data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch page insights from Facebook',
          error: error.response?.data || error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

