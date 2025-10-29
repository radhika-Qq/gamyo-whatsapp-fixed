# 📘 Facebook Integration Guide

## Overview

The Facebook module enables your Gamyo application to publish posts, upload media, and fetch insights directly to Facebook Pages using the Meta Graph API v21.0.

---

## 🔑 Getting Your Facebook Credentials

### Step 1: Create a Facebook App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** as the app type
4. Fill in your app details and create the app

### Step 2: Add Facebook Login & Pages API

1. In your app dashboard, click **"Add Product"**
2. Add **"Facebook Login"**
3. Add **"Facebook Pages"** (if available)

### Step 3: Get Your Page Access Token

1. Go to **Tools** → **Graph API Explorer**
2. Select your app from the dropdown
3. Click **"Generate Access Token"**
4. Grant the following permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_manage_engagement`
   - `pages_read_user_content`
5. Copy the generated **User Access Token**

### Step 4: Convert to Long-Lived Page Token

Run this command to convert your user token to a long-lived page token:

```bash
curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_USER_ACCESS_TOKEN"
```

This returns a **long-lived user token** (60 days). Then get the Page token:

```bash
curl -X GET "https://graph.facebook.com/v21.0/me/accounts?access_token=YOUR_LONG_LIVED_USER_TOKEN"
```

Find your page in the response and copy its `access_token` - this is your **Page Access Token** (never expires).

### Step 5: Get Your Page ID

From the same API response above, copy your page's `id` field.

---

## ⚙️ Environment Configuration

Add these variables to your `backend/.env` file:

```env
# Facebook API Configuration
FACEBOOK_API_URL=https://graph.facebook.com/v21.0
FACEBOOK_PAGE_ID=your_facebook_page_id_here
FACEBOOK_ACCESS_TOKEN=your_long_lived_page_access_token_here
```

**Example:**
```env
FACEBOOK_API_URL=https://graph.facebook.com/v21.0
FACEBOOK_PAGE_ID=123456789012345
FACEBOOK_ACCESS_TOKEN=EAABwz...XYZ123
```

---

## 🚀 API Endpoints

### 1. Upload Media (Photo/Video)

**Endpoint:** `POST /facebook/upload`

**Request Body:**
```json
{
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Optional caption text",
  "mediaType": "photo"
}
```

**Media Types:**
- `photo` - For images (JPG, PNG, GIF)
- `video` - For videos (MP4, MOV)

**Response:**
```json
{
  "success": true,
  "mediaId": "1234567890",
  "data": {
    "id": "1234567890"
  }
}
```

---

### 2. Publish a Post

**Endpoint:** `POST /facebook/post`

**Request Body (Text Only):**
```json
{
  "message": "Hello from Gamyo! 🚀"
}
```

**Request Body (With Media):**
```json
{
  "message": "Check out this amazing product!",
  "mediaId": "1234567890"
}
```

**Request Body (Scheduled Post):**
```json
{
  "message": "This post will be published later",
  "scheduledTime": 1735689600
}
```

> **Note:** `scheduledTime` must be a Unix timestamp (in seconds) between 10 minutes and 75 days from now.

**Response:**
```json
{
  "success": true,
  "postId": "123456789012345_987654321098765",
  "message": "Post published successfully on Facebook Page",
  "data": {
    "id": "123456789012345_987654321098765"
  }
}
```

---

### 3. Get Post Insights

**Endpoint:** `GET /facebook/insights/post/:postId`

**Example:** `GET /facebook/insights/post/123456789012345_987654321098765`

**Response:**
```json
{
  "success": true,
  "insights": [
    {
      "name": "post_impressions",
      "period": "lifetime",
      "values": [
        {
          "value": 1234
        }
      ]
    },
    {
      "name": "post_engaged_users",
      "period": "lifetime",
      "values": [
        {
          "value": 89
        }
      ]
    }
  ]
}
```

---

### 4. Get Page Insights

**Endpoint:** `GET /facebook/insights/page`

**Response:**
```json
{
  "success": true,
  "insights": [
    {
      "name": "page_impressions",
      "period": "day",
      "values": [
        {
          "value": 5678,
          "end_time": "2025-10-29T07:00:00+0000"
        }
      ]
    }
  ]
}
```

---

## 🧪 Testing the Integration

### Using cURL

**1. Upload a Photo:**
```bash
curl -X POST http://localhost:3000/facebook/upload \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "https://picsum.photos/800/600",
    "caption": "Test image from Gamyo",
    "mediaType": "photo"
  }'
```

**2. Publish a Simple Post:**
```bash
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from Gamyo API! 🎉"
  }'
```

**3. Publish Post with Media:**
```bash
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Check out this product!",
    "mediaId": "YOUR_MEDIA_ID_FROM_UPLOAD"
  }'
```

**4. Schedule a Post (for 1 hour from now):**
```bash
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Scheduled post from Gamyo",
    "scheduledTime": '$(date -d "+1 hour" +%s)'
  }'
```

---

## 📊 Workflow Example

### Complete Post with Image

```typescript
// Step 1: Upload the image
const uploadResponse = await fetch('http://localhost:3000/facebook/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mediaUrl: 'https://example.com/my-image.jpg',
    caption: 'Product showcase',
    mediaType: 'photo'
  })
});

const { mediaId } = await uploadResponse.json();

// Step 2: Publish the post with the uploaded media
const postResponse = await fetch('http://localhost:3000/facebook/post', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Check out our new product! 🚀',
    mediaId: mediaId
  })
});

const result = await postResponse.json();
console.log('Post published:', result.postId);
```

---

## 🔒 Security Best Practices

1. **Never commit your `.env` file** - Always use `.env.example` as a template
2. **Page Access Tokens** are sensitive - Store them securely
3. **Use long-lived tokens** - They don't expire unless revoked
4. **Rotate tokens periodically** for enhanced security
5. **Test in Development** before publishing to production pages

---

## 🐛 Common Issues

### Error: "Invalid OAuth access token"
- Your access token may have expired or been revoked
- Generate a new long-lived Page Access Token

### Error: "Invalid parameter"
- Check that your Page ID is correct
- Ensure media URLs are publicly accessible
- Verify scheduled timestamps are in Unix format (seconds)

### Error: "Permissions error"
- Ensure your access token has the required permissions:
  - `pages_manage_posts`
  - `pages_read_engagement`

---

## 📚 Additional Resources

- [Meta Graph API Documentation](https://developers.facebook.com/docs/graph-api/)
- [Facebook Pages API](https://developers.facebook.com/docs/pages-api/)
- [Page Publishing Guide](https://developers.facebook.com/docs/pages/publishing/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)

---

## ✅ Next Steps

1. Set up your Facebook App and get credentials
2. Add credentials to `.env`
3. Test endpoints with cURL or Postman
4. Integrate the Facebook frontend component
5. Start publishing to your Facebook Page! 🎉

---

**Need help?** Check the [official Facebook for Developers documentation](https://developers.facebook.com/docs/) or open an issue in this repository.

