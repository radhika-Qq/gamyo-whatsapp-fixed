import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PostContentDto } from '../dto/post-content.dto';
import { UploadMediaDto } from '../dto/upload-media.dto';

@Injectable()
export class LinkedInService {
  private readonly logger = new Logger(LinkedInService.name);
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly organizationUrn: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('LINKEDIN_API_URL', 'https://api.linkedin.com/v2');
    this.accessToken = this.configService.get<string>('LINKEDIN_ACCESS_TOKEN', '');
    this.organizationUrn = this.configService.get<string>('LINKEDIN_ORGANIZATION_URN', '');

    if (!this.accessToken) {
      this.logger.warn('LINKEDIN_ACCESS_TOKEN is not configured');
    }
    if (!this.organizationUrn) {
      this.logger.warn('LINKEDIN_ORGANIZATION_URN is not configured');
    }
  }

  /**
   * Upload media to LinkedIn
   * @param uploadMediaDto - Contains mediaUrl to upload
   * @returns The asset URN that can be used in posts
   */
  async uploadMedia(uploadMediaDto: UploadMediaDto): Promise<any> {
    try {
      const { mediaUrl } = uploadMediaDto;
      this.logger.log(`Uploading media from URL: ${mediaUrl}`);

      // Step 1: Register upload with LinkedIn
      const registerUploadResponse = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/assets?action=registerUpload`,
          {
            registerUploadRequest: {
              owner: this.organizationUrn,
              recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
              serviceRelationships: [
                {
                  identifier: 'urn:li:userGeneratedContent',
                  relationshipType: 'OWNER',
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
              'X-Restli-Protocol-Version': '2.0.0',
            },
          },
        ),
      );

      const uploadUrl = registerUploadResponse.data.value.uploadMechanism[
        'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
      ].uploadUrl;
      const assetUrn = registerUploadResponse.data.value.asset;

      this.logger.log(`Upload URL obtained: ${uploadUrl}`);
      this.logger.log(`Asset URN: ${assetUrn}`);

      // Step 2: Fetch media from provided URL
      const mediaResponse = await firstValueFrom(
        this.httpService.get(mediaUrl, { responseType: 'arraybuffer' }),
      );

      // Step 3: Upload media to LinkedIn
      await firstValueFrom(
        this.httpService.put(uploadUrl, mediaResponse.data, {
          headers: {
            'Content-Type': 'image/jpeg',
          },
        }),
      );

      this.logger.log('Media uploaded successfully');

      return {
        success: true,
        assetUrn,
        message: 'Media uploaded successfully',
      };
    } catch (error) {
      this.logger.error('Error uploading media to LinkedIn:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Publish a post to LinkedIn
   * @param postContentDto - Contains text and optional media URN
   * @returns Response from LinkedIn API
   */
  async publishPost(postContentDto: PostContentDto): Promise<any> {
    try {
      const { text, media } = postContentDto;
      this.logger.log(`Publishing post to LinkedIn: ${text.substring(0, 50)}...`);

      const postData: any = {
        author: this.organizationUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text,
            },
            shareMediaCategory: media ? 'IMAGE' : 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      // Add media if provided
      if (media) {
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            media: media,
          },
        ];
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/ugcPosts`, postData, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }),
      );

      this.logger.log('Post published successfully');

      return {
        success: true,
        postId: response.data.id,
        message: 'Post published successfully to LinkedIn',
        data: response.data,
      };
    } catch (error) {
      this.logger.error('Error publishing post to LinkedIn:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get organization info to verify credentials
   * @returns Organization information
   */
  async getOrganizationInfo(): Promise<any> {
    try {
      const organizationId = this.organizationUrn.split(':').pop();
      this.logger.log(`Fetching organization info for: ${organizationId}`);

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/organizations/${organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'X-Restli-Protocol-Version': '2.0.0',
            },
          },
        ),
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.logger.error('Error fetching organization info:', error.response?.data || error.message);
      throw error;
    }
  }
}

