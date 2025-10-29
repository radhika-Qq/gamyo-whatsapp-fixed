import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { UploadMediaDto } from '../dto/upload-media.dto';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);
  private readonly apiUrl = process.env.INSTAGRAM_API_URL || 'https://graph.facebook.com/v21.0';
  private readonly userId = process.env.INSTAGRAM_USER_ID;
  private readonly accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  /**
   * Create a media container for Instagram post
   * This is the first step in the Instagram posting workflow
   */
  async createMediaContainer(dto: UploadMediaDto) {
    try {
      this.logger.log(`Creating media container with URL: ${dto.mediaUrl}`);
      
      const url = `${this.apiUrl}/${this.userId}/media`;
      
      const response = await axios.post(
        url,
        {
          image_url: dto.mediaUrl,
          caption: dto.caption || '',
          access_token: this.accessToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Media container created successfully: ${response.data.id}`);
      return {
        success: true,
        creationId: response.data.id,
        message: 'Media container created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating media container:', error.response?.data || error.message);
      throw new Error(
        `Failed to create media container: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Publish a media container to Instagram feed
   * This is the second step - publishes the container created in step 1
   */
  async publishContainer(dto: CreatePostDto) {
    try {
      this.logger.log(`Publishing container: ${dto.creationId}`);
      
      const url = `${this.apiUrl}/${this.userId}/media_publish`;
      
      const response = await axios.post(
        url,
        {
          creation_id: dto.creationId,
          access_token: this.accessToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Post published successfully: ${response.data.id}`);
      return {
        success: true,
        mediaId: response.data.id,
        message: 'Post published to Instagram successfully',
      };
    } catch (error) {
      this.logger.error('Error publishing container:', error.response?.data || error.message);
      throw new Error(
        `Failed to publish post: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Get insights for a published Instagram media
   * Metrics include impressions, reach, and engagement
   */
  async getInsights(mediaId: string) {
    try {
      this.logger.log(`Fetching insights for media: ${mediaId}`);
      
      const url = `${this.apiUrl}/${mediaId}/insights`;
      
      const response = await axios.get(url, {
        params: {
          metric: 'impressions,reach,engagement',
          access_token: this.accessToken,
        },
      });

      this.logger.log(`Insights fetched successfully for media: ${mediaId}`);
      return {
        success: true,
        insights: response.data.data,
        mediaId,
      };
    } catch (error) {
      this.logger.error('Error fetching insights:', error.response?.data || error.message);
      throw new Error(
        `Failed to fetch insights: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Get account insights for Instagram Business account
   * Includes follower count, impressions, reach, etc.
   */
  async getAccountInsights() {
    try {
      this.logger.log('Fetching account insights');
      
      const url = `${this.apiUrl}/${this.userId}/insights`;
      
      const response = await axios.get(url, {
        params: {
          metric: 'impressions,reach,follower_count,profile_views',
          period: 'day',
          access_token: this.accessToken,
        },
      });

      this.logger.log('Account insights fetched successfully');
      return {
        success: true,
        insights: response.data.data,
      };
    } catch (error) {
      this.logger.error('Error fetching account insights:', error.response?.data || error.message);
      throw new Error(
        `Failed to fetch account insights: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }
}

