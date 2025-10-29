# 🚀 Facebook Integration - Quick Start Guide

## ✅ What's Been Implemented

Your Gamyo platform now includes **full Facebook Page integration** with:

✅ **Photo & Video Upload** - Upload media directly to your Facebook Page  
✅ **Post Publishing** - Publish text posts with or without media  
✅ **Post Scheduling** - Schedule posts up to 75 days in advance  
✅ **Insights & Analytics** - Fetch engagement metrics for posts and pages  
✅ **Beautiful Frontend UI** - React component with Material-UI design  

---

## 🏗️ Project Structure

### Backend (NestJS)

```
backend/src/facebook/
├── controllers/
│   └── facebook.controller.ts       # API endpoints
├── services/
│   └── facebook.service.ts          # Business logic & Graph API calls
├── dto/
│   ├── create-post.dto.ts           # Post validation
│   └── upload-media.dto.ts          # Media upload validation
└── facebook.module.ts               # Module configuration
```

### Frontend (React + TypeScript)

```
frontend/src/components/
└── FacebookComposer.tsx             # UI component for Facebook posting
```

---

## 🔧 Setup Steps

### 1️⃣ Get Your Facebook Credentials

Follow the detailed guide in `FACEBOOK_INTEGRATION.md` to:
1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com/)
2. Get your **Page Access Token** (long-lived, never expires)
3. Get your **Page ID**

**Quick Token Generation:**

```bash
# Step 1: Get long-lived user token (60 days)
curl "https://graph.facebook.com/v21.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id=YOUR_APP_ID&\
client_secret=YOUR_APP_SECRET&\
fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"

# Step 2: Get page token (never expires)
curl "https://graph.facebook.com/v21.0/me/accounts?\
access_token=YOUR_LONG_LIVED_USER_TOKEN"
```

### 2️⃣ Configure Environment Variables

Create or update `backend/.env`:

```env
# Facebook API Configuration
FACEBOOK_API_URL=https://graph.facebook.com/v21.0
FACEBOOK_PAGE_ID=123456789012345
FACEBOOK_ACCESS_TOKEN=EAABwz...XYZ123
```

### 3️⃣ Install Dependencies (if needed)

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 4️⃣ Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm start
```

The backend runs on `http://localhost:3000`  
The frontend runs on `http://localhost:3001`

---

## 🎯 Using the Facebook Integration

### Via Frontend UI

1. Open your browser to `http://localhost:3001`
2. Click the **"Facebook"** tab
3. Follow the 2-step process:
   - **Step 1:** Upload media (optional)
   - **Step 2:** Compose your post and publish

**Features:**
- 📷 Upload photos or videos
- ✍️ Write post messages
- 📅 Schedule posts for future publishing
- ✅ See success confirmations with post IDs

### Via API (cURL Examples)

#### 1. Upload a Photo

```bash
curl -X POST http://localhost:3000/facebook/upload \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "https://picsum.photos/800/600",
    "caption": "Amazing sunset from Gamyo!",
    "mediaType": "photo"
  }'
```

**Response:**
```json
{
  "success": true,
  "mediaId": "1234567890",
  "data": { "id": "1234567890" }
}
```

#### 2. Publish a Text Post

```bash
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from Gamyo! 🚀 Our multi-platform integration is live!"
  }'
```

#### 3. Publish Post with Media

```bash
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Check out this amazing product! 🎨",
    "mediaId": "1234567890"
  }'
```

#### 4. Schedule a Post (1 hour from now)

```bash
# Calculate timestamp (Unix seconds)
TIMESTAMP=$(date -d "+1 hour" +%s)

curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"This post will be published in 1 hour!\",
    \"scheduledTime\": $TIMESTAMP
  }"
```

#### 5. Get Post Insights

```bash
curl http://localhost:3000/facebook/insights/post/123456789012345_987654321098765
```

**Response:**
```json
{
  "success": true,
  "insights": [
    { "name": "post_impressions", "values": [{ "value": 1234 }] },
    { "name": "post_engaged_users", "values": [{ "value": 89 }] }
  ]
}
```

#### 6. Get Page Insights

```bash
curl http://localhost:3000/facebook/insights/page
```

---

## 🧪 Testing the Integration

### Quick Test Workflow

```bash
# 1. Upload a test image
curl -X POST http://localhost:3000/facebook/upload \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "https://picsum.photos/800/600",
    "mediaType": "photo"
  }'

# Save the mediaId from response

# 2. Publish with that media
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test post from Gamyo API 🎉",
    "mediaId": "YOUR_MEDIA_ID_HERE"
  }'

# 3. Check your Facebook Page!
```

---

## 📊 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/facebook/upload` | Upload photo/video |
| `POST` | `/facebook/post` | Publish post (with optional media/scheduling) |
| `GET` | `/facebook/insights/post/:postId` | Get post analytics |
| `GET` | `/facebook/insights/page` | Get page analytics |

---

## 🎨 Frontend Component Features

The `FacebookComposer` component includes:

- ✅ **Media Type Selection** - Choose between photo or video
- ✅ **URL-based Upload** - Upload from any public URL
- ✅ **Caption Support** - Add captions to media
- ✅ **Character Counter** - Track message length
- ✅ **Scheduled Publishing** - Date/time picker for future posts
- ✅ **Visual Feedback** - Loading states, success/error alerts
- ✅ **Media Preview** - Chip showing attached media type
- ✅ **Validation** - Client-side validation for all inputs

---

## 🔒 Security Notes

⚠️ **Never commit your `.env` file!**

- Facebook Page Access Tokens are sensitive
- Add `.env` to your `.gitignore`
- Use `.env.example` as a template
- Rotate tokens periodically

---

## 🐛 Troubleshooting

### "Invalid OAuth access token"
→ Your token has expired or is invalid. Generate a new long-lived page token.

### "Invalid parameter"
→ Check that your Page ID is correct and the media URL is publicly accessible.

### "Permissions error"
→ Ensure your token has these permissions:
  - `pages_manage_posts`
  - `pages_read_engagement`

### "Failed to upload media"
→ Verify the media URL is:
  - Publicly accessible (not behind authentication)
  - A direct link to the file (not an HTML page)
  - The correct format (JPG/PNG for photos, MP4 for videos)

---

## 📚 Additional Resources

- 📖 [Full Integration Guide](./FACEBOOK_INTEGRATION.md) - Detailed setup instructions
- 🔗 [Meta Graph API Docs](https://developers.facebook.com/docs/graph-api/)
- 🔗 [Facebook Pages API](https://developers.facebook.com/docs/pages-api/)
- 🛠️ [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)

---

## 🎉 What's Next?

Now that Facebook is integrated, your Gamyo platform supports:

✅ **WhatsApp** - 1:1 messages, broadcasts, and channel posts  
✅ **LinkedIn** - Company and personal post publishing  
✅ **Facebook** - Page posts, media, and scheduled content  

You can extend this further with:
- **Instagram** (similar to Facebook, uses Graph API)
- **Twitter/X** (v2 API)
- **Thread scheduling & queuing**
- **Analytics dashboard**
- **Content calendar view**

---

**Happy posting! 🚀**

Questions? Check the main [README.md](./README.md) or open an issue.

