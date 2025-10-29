# LinkedIn Integration Guide

## Overview

This document explains the LinkedIn integration added to the Gamyo multi-platform messaging system. The LinkedIn module enables posting content and uploading media to LinkedIn company pages via the LinkedIn API v2.

## Architecture

The LinkedIn integration follows the same modular architecture as the WhatsApp module:

```
backend/src/linkedin/
├── controllers/
│   └── linkedin.controller.ts    # HTTP endpoints for LinkedIn operations
├── services/
│   └── linkedin.service.ts       # Business logic and LinkedIn API integration
├── dto/
│   ├── post-content.dto.ts       # Data validation for post content
│   └── upload-media.dto.ts       # Data validation for media uploads
└── linkedin.module.ts            # Module configuration
```

## Setup Instructions

### 1. LinkedIn API Credentials

To use the LinkedIn integration, you need:

1. **LinkedIn Organization Page** - You must have admin access to a LinkedIn company page
2. **LinkedIn Developer App** - Create an app at [LinkedIn Developers](https://www.linkedin.com/developers/)
3. **Access Token** - Generate an OAuth 2.0 access token with the following permissions:
   - `w_organization_social` - Post content to organization pages
   - `r_organization_social` - Read organization content

### 2. Configure Environment Variables

Add the following to your `backend/.env` file:

```env
# LinkedIn API Configuration
LINKEDIN_API_URL=https://api.linkedin.com/v2
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token_here
LINKEDIN_ORGANIZATION_URN=urn:li:organization:123456789
```

**Finding Your Organization URN:**
1. Go to your LinkedIn company page
2. The organization ID is in the URL: `https://www.linkedin.com/company/[ORGANIZATION_ID]/`
3. Format as: `urn:li:organization:[ORGANIZATION_ID]`

**Generating Access Token:**
1. Create a LinkedIn app at https://www.linkedin.com/developers/apps
2. Add your company page as an authorized organization
3. Use OAuth 2.0 flow to generate an access token
4. Note: Access tokens typically expire after 60 days

### 3. Install Dependencies

All required dependencies are already included in the project:
- `@nestjs/axios` - HTTP client for API calls
- `rxjs` - Reactive programming support
- `class-validator` - DTO validation

## API Endpoints

### 1. Upload Media

**POST** `/linkedin/upload`

Upload media (images) to LinkedIn before including them in posts.

**Request Body:**
```json
{
  "mediaUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "assetUrn": "urn:li:digitalmediaAsset:C4D03AQHxyz...",
  "message": "Media uploaded successfully"
}
```

### 2. Publish Post

**POST** `/linkedin/post`

Publish a post to your LinkedIn organization page.

**Request Body:**
```json
{
  "text": "Check out our latest update! #innovation",
  "media": "urn:li:digitalmediaAsset:C4D03AQHxyz..."  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "postId": "urn:li:share:123456789",
  "message": "Post published successfully to LinkedIn"
}
```

### 3. Get Organization Info

**GET** `/linkedin/organization`

Verify your LinkedIn credentials and get organization details.

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Your Company Name",
    "id": 123456789,
    // ... other organization data
  }
}
```

### 4. Health Check

**GET** `/linkedin/health`

Check if the LinkedIn service is running.

**Response:**
```json
{
  "status": "ok",
  "service": "LinkedIn Integration",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

## Frontend Integration

The LinkedIn integration includes a React component `LinkedInComposer.tsx` with:

### Features:
- **Two-step workflow**: Upload media first (optional), then compose post
- **Rich text editor**: Multi-line text input with character counter
- **Media upload**: Direct URL-based media upload
- **Error handling**: Clear error messages and validation
- **Success feedback**: Confirmation messages with post IDs

### Usage:
The LinkedIn tab is integrated into the main app interface alongside WhatsApp features. Users can:
1. Optionally upload an image by providing a URL
2. Compose their post text
3. Publish to their LinkedIn company page
4. See immediate feedback on success or failure

## LinkedIn API Limitations

### Rate Limits:
- **100 posts per day** per organization
- **Throttling**: 500 API calls per user per day

### Media Requirements:
- **Supported formats**: JPG, PNG
- **Max file size**: 8 MB
- **Recommended dimensions**: 1200 x 627 pixels

### Access Token Lifecycle:
- **Expiration**: 60 days by default
- **Refresh**: Implement OAuth refresh flow for production
- **Security**: Never commit tokens to version control

## Testing

### 1. Health Check
```bash
curl http://localhost:3000/linkedin/health
```

### 2. Test Organization Access
```bash
curl http://localhost:3000/linkedin/organization \
  -H "Content-Type: application/json"
```

### 3. Publish a Simple Post
```bash
curl -X POST http://localhost:3000/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from Gamyo.ai! Testing our LinkedIn integration."
  }'
```

### 4. Upload and Post with Media
```bash
# Step 1: Upload media
curl -X POST http://localhost:3000/linkedin/upload \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "https://example.com/image.jpg"
  }'

# Step 2: Use returned assetUrn in post
curl -X POST http://localhost:3000/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Check out this image!",
    "media": "urn:li:digitalmediaAsset:RETURNED_URN_HERE"
  }'
```

## Error Handling

The service includes comprehensive error handling:

### Common Errors:
1. **401 Unauthorized**: Invalid or expired access token
2. **403 Forbidden**: Insufficient permissions or invalid organization URN
3. **400 Bad Request**: Invalid media URL or malformed request
4. **429 Too Many Requests**: Rate limit exceeded

### Error Response Format:
```json
{
  "status": 500,
  "error": "Failed to publish post to LinkedIn",
  "details": {
    "message": "Specific error from LinkedIn API",
    "serviceErrorCode": 100
  }
}
```

## Production Considerations

### 1. Access Token Management
- Implement OAuth 2.0 refresh token flow
- Store tokens securely (e.g., encrypted in database)
- Handle token expiration gracefully

### 2. Media Storage
- Consider hosting media on CDN instead of direct URLs
- Validate media before upload (format, size, dimensions)
- Implement media caching strategy

### 3. Rate Limiting
- Implement request queuing for high-volume scenarios
- Add retry logic with exponential backoff
- Monitor API usage and quotas

### 4. Monitoring
- Log all API calls for debugging
- Track success/failure rates
- Set up alerts for quota limits

## Future Enhancements

### Planned Features:
1. **Scheduled Posting**: Queue posts for future publishing
2. **Analytics**: Track post performance and engagement
3. **Multi-image Posts**: Support carousel posts with multiple images
4. **Video Upload**: Add support for video content
5. **Comment Management**: Reply to comments on posts
6. **Employee Advocacy**: Allow employees to share company content

### Integration Extensions:
1. **Instagram**: Similar posting workflow for Instagram Business
2. **Facebook**: Leverage Graph API for Facebook pages
3. **Twitter/X**: Add support for Twitter posts
4. **Cross-posting**: Publish to multiple platforms simultaneously

## Support & Documentation

### LinkedIn API Documentation:
- [LinkedIn Marketing Developer Platform](https://docs.microsoft.com/en-us/linkedin/)
- [Share on LinkedIn API](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api)
- [LinkedIn Asset API](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/vector-asset-api)

### Troubleshooting:
1. Verify your app has the correct permissions
2. Check that your organization is authorized in the app settings
3. Ensure access token hasn't expired
4. Validate organization URN format
5. Check LinkedIn API status page for outages

## License

This integration is part of the Gamyo.ai platform and follows the same license as the main project.

---

**Last Updated**: October 29, 2025  
**Version**: 1.0.0  
**Maintainer**: Gamyo.ai Development Team

