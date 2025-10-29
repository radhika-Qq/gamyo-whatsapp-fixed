# 📸 Instagram Integration - Complete Guide

## Overview

The Instagram integration allows you to publish images and videos to your Instagram Business account using Meta's Graph API v21.0. This module follows the same architectural pattern as the Facebook, LinkedIn, and WhatsApp integrations.

## Features

✅ **Media Container Creation** - Upload images/videos to Instagram  
✅ **Post Publishing** - Publish media containers to your Instagram feed  
✅ **Post Insights** - Fetch performance metrics (impressions, reach, engagement)  
✅ **Account Insights** - Get account-level analytics  
✅ **Two-Step Publishing** - Create container → Publish workflow  
✅ **Error Handling** - Comprehensive error messages and logging  

---

## Architecture

### Backend Structure

```
backend/src/instagram/
├── instagram.module.ts          # Module definition
├── controllers/
│   └── instagram.controller.ts  # REST API endpoints
├── services/
│   └── instagram.service.ts     # Business logic & API calls
└── dto/
    ├── upload-media.dto.ts      # Media upload validation
    └── create-post.dto.ts       # Post publishing validation
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/instagram/upload` | Create a media container |
| `POST` | `/instagram/publish` | Publish container to Instagram |
| `GET` | `/instagram/insights/:mediaId` | Get post insights |
| `GET` | `/instagram/insights` | Get account insights |

---

## Prerequisites

### 1. Instagram Business Account

You need an **Instagram Business** or **Creator** account connected to a Facebook Page.

**Convert to Business Account:**
1. Go to Instagram app → Settings → Account
2. Tap "Switch to Professional Account"
3. Choose "Business" or "Creator"
4. Connect to your Facebook Page

### 2. Facebook Page

Your Instagram account must be connected to a Facebook Page:
1. Go to Facebook Page Settings
2. Click "Instagram" in the left menu
3. Click "Connect Account"
4. Log in to your Instagram account

### 3. Access Token

You need a **long-lived access token** with the following permissions:
- `instagram_basic`
- `instagram_content_publish`
- `pages_read_engagement`
- `pages_show_list`

**Get Access Token:**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create or select your app
3. Add "Instagram Graph API" product
4. Use Graph API Explorer to generate token
5. Exchange short-lived token for long-lived token (60 days)

### 4. Instagram User ID

Get your Instagram Business Account ID:

```bash
curl -X GET "https://graph.facebook.com/v21.0/me/accounts?access_token=YOUR_PAGE_ACCESS_TOKEN"
```

Then get the Instagram account ID:

```bash
curl -X GET "https://graph.facebook.com/v21.0/PAGE_ID?fields=instagram_business_account&access_token=YOUR_ACCESS_TOKEN"
```

---

## Installation & Setup

### Step 1: Environment Variables

Add to `backend/.env`:

```env
# Instagram API Configuration
INSTAGRAM_API_URL=https://graph.facebook.com/v21.0
INSTAGRAM_USER_ID=your_instagram_business_user_id
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token
```

### Step 2: Verify Module Registration

The Instagram module is automatically registered in `backend/src/app.module.ts`:

```typescript
import { InstagramModule } from './instagram/instagram.module';

@Module({
  imports: [
    // ... other modules
    InstagramModule,
  ],
})
```

### Step 3: Start the Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend will run on `http://localhost:3000`.

### Step 4: Start the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3001` (or 3000 if backend is separate).

---

## Usage

### Frontend Interface

1. Navigate to the **Instagram** tab in the application
2. Enter a publicly accessible image/video URL
3. Add an optional caption
4. Click **"Create Container"** to prepare the media
5. Click **"Publish Post"** to publish to Instagram
6. Click **"Get Insights"** to view performance metrics

### API Usage

#### 1. Create Media Container

**Request:**
```bash
POST http://localhost:3000/instagram/upload
Content-Type: application/json

{
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Check out this amazing photo! #instagram #photo"
}
```

**Response:**
```json
{
  "success": true,
  "creationId": "17895695668004550",
  "message": "Media container created successfully"
}
```

#### 2. Publish Container

**Request:**
```bash
POST http://localhost:3000/instagram/publish
Content-Type: application/json

{
  "creationId": "17895695668004550"
}
```

**Response:**
```json
{
  "success": true,
  "mediaId": "17895695668004551",
  "message": "Post published to Instagram successfully"
}
```

#### 3. Get Post Insights

**Request:**
```bash
GET http://localhost:3000/instagram/insights/17895695668004551
```

**Response:**
```json
{
  "success": true,
  "mediaId": "17895695668004551",
  "insights": [
    {
      "name": "impressions",
      "period": "lifetime",
      "values": [{ "value": 1250 }],
      "title": "Impressions",
      "description": "Total number of times the media object has been seen"
    },
    {
      "name": "reach",
      "period": "lifetime",
      "values": [{ "value": 980 }],
      "title": "Reach",
      "description": "Total number of unique accounts that have seen the media object"
    },
    {
      "name": "engagement",
      "period": "lifetime",
      "values": [{ "value": 145 }],
      "title": "Engagement",
      "description": "Total number of likes and comments on the media object"
    }
  ]
}
```

#### 4. Get Account Insights

**Request:**
```bash
GET http://localhost:3000/instagram/insights
```

**Response:**
```json
{
  "success": true,
  "insights": [
    {
      "name": "impressions",
      "period": "day",
      "values": [{ "value": 3456, "end_time": "2024-01-15T07:59:59+0000" }]
    },
    {
      "name": "reach",
      "period": "day",
      "values": [{ "value": 2890, "end_time": "2024-01-15T07:59:59+0000" }]
    }
  ]
}
```

---

## Media Requirements

### Image Posts
- **Format:** JPG, PNG
- **Aspect Ratio:** 1.91:1 to 4:5
- **Max File Size:** 8 MB
- **Min Resolution:** 320px
- **Max Resolution:** 1440 x 1800px

### Video Posts
- **Format:** MP4, MOV
- **Aspect Ratio:** 1.91:1 to 4:5
- **Max File Size:** 100 MB
- **Max Length:** 60 seconds (feed), 15 seconds (stories)
- **Frame Rate:** 23-60 FPS

### Carousel Posts
- Use `media_type=CAROUSEL` and provide `children` array
- Up to 10 images/videos per carousel

---

## Important Notes

### ⚠️ Limitations

1. **Publicly Accessible URLs Only**
   - Media URLs must be publicly accessible
   - Instagram servers must be able to download the media

2. **No Direct Scheduling**
   - Instagram Graph API doesn't support native scheduling
   - Implement scheduling using a job queue (e.g., BullMQ, node-cron)

3. **Post Types**
   - Only feed posts are supported (no Stories, Reels via this API)
   - For Stories and Reels, use Instagram Content Publishing API

4. **Rate Limits**
   - 25 API calls per hour per Instagram account
   - 200 API calls per hour per app

5. **Insights Availability**
   - Insights are available 24 hours after post publication
   - Some metrics require business accounts

### 🔒 Security

- Never commit `.env` files to version control
- Rotate access tokens every 60 days
- Use environment-specific tokens (dev, staging, prod)
- Monitor API usage in Meta Business Suite

---

## Troubleshooting

### Error: "Invalid OAuth access token"

**Solution:**
1. Verify your access token is valid
2. Check token hasn't expired (60-day limit)
3. Regenerate token if needed
4. Ensure token has correct permissions

### Error: "Unsupported post request"

**Solution:**
1. Verify Instagram account is Business or Creator
2. Check account is connected to Facebook Page
3. Ensure Page is verified

### Error: "Media URL couldn't be downloaded"

**Solution:**
1. Verify media URL is publicly accessible
2. Test URL in browser
3. Check file size and format requirements
4. Ensure URL uses HTTPS

### Error: "Invalid parameter"

**Solution:**
1. Validate media URL format
2. Check caption length (max 2,200 characters)
3. Ensure media meets size/dimension requirements

### Insights Not Available

**Solution:**
1. Wait 24 hours after publishing
2. Verify post was published successfully
3. Check account has insights permissions
4. Ensure using Business account (not Personal)

---

## Advanced Features

### Carousel Posts

```typescript
// Create multiple containers
const container1 = await createMediaContainer({ mediaUrl: 'url1.jpg' });
const container2 = await createMediaContainer({ mediaUrl: 'url2.jpg' });

// Create carousel container
const carousel = await axios.post(
  `${API_URL}/${USER_ID}/media`,
  {
    media_type: 'CAROUSEL',
    children: [container1.creationId, container2.creationId],
    caption: 'Check out these photos!',
  }
);

// Publish carousel
await publishContainer({ creationId: carousel.data.id });
```

### Video Posts

```typescript
await createMediaContainer({
  mediaUrl: 'https://example.com/video.mp4',
  media_type: 'VIDEO',
  caption: 'Watch this video!',
});
```

### Product Tagging

```typescript
await createMediaContainer({
  mediaUrl: 'https://example.com/product.jpg',
  caption: 'New product launch!',
  product_tags: [
    { product_id: '123456', x: 0.5, y: 0.5 }
  ],
});
```

---

## Next Steps

1. **Implement Scheduling**
   - Add `scheduledTime` field to DTOs
   - Use BullMQ or node-cron for delayed publishing

2. **Add Hashtag Suggestions**
   - Integrate hashtag suggestion API
   - Analyze trending hashtags

3. **Media Library**
   - Store previously used media
   - Reuse media URLs

4. **Analytics Dashboard**
   - Visualize insights over time
   - Compare post performance

5. **Multi-Account Support**
   - Support multiple Instagram accounts
   - Switch between accounts

---

## Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Content Publishing API](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [Insights API](https://developers.facebook.com/docs/instagram-api/guides/insights)
- [Meta Business Suite](https://business.facebook.com/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Meta's Instagram API documentation
3. Check API changelog for breaking changes
4. Test endpoints in Graph API Explorer

---

**Last Updated:** January 2025  
**API Version:** v21.0  
**Status:** ✅ Production Ready

