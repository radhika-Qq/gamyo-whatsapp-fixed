# 🚀 Instagram Integration - Quick Start Guide

## 5-Minute Setup

### Prerequisites Checklist

- [ ] Instagram Business or Creator account
- [ ] Facebook Page connected to Instagram
- [ ] Meta Developer account
- [ ] Long-lived access token

---

## Step 1: Get Instagram Credentials

### A. Get Your Page Access Token

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Click "Generate Access Token"
4. Select permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_show_list`
5. Copy the token

### B. Exchange for Long-Lived Token

```bash
curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

### C. Get Instagram User ID

```bash
# Get your Page ID
curl -X GET "https://graph.facebook.com/v21.0/me/accounts?access_token=YOUR_TOKEN"

# Get Instagram Business Account ID
curl -X GET "https://graph.facebook.com/v21.0/{PAGE_ID}?fields=instagram_business_account&access_token=YOUR_TOKEN"
```

---

## Step 2: Configure Environment

Create/update `backend/.env`:

```env
# Instagram Configuration
INSTAGRAM_API_URL=https://graph.facebook.com/v21.0
INSTAGRAM_USER_ID=17841405793187218
INSTAGRAM_ACCESS_TOKEN=EAABwz...your_long_lived_token
```

---

## Step 3: Test Installation

### Start Backend

```bash
cd backend
npm install
npm run start:dev
```

### Start Frontend

```bash
cd frontend
npm install
npm start
```

---

## Step 4: Test Your First Post

### Option A: Using the UI

1. Open `http://localhost:3001`
2. Click the **Instagram** tab
3. Enter a test image URL: `https://picsum.photos/800/800`
4. Add caption: "Testing Instagram integration! 🚀"
5. Click **Create Container**
6. Click **Publish Post**
7. Check your Instagram profile!

### Option B: Using cURL

**Create Container:**
```bash
curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "https://picsum.photos/800/800",
    "caption": "Testing Instagram integration! 🚀"
  }'
```

**Publish Post:**
```bash
curl -X POST http://localhost:3000/instagram/publish \
  -H "Content-Type: application/json" \
  -d '{
    "creationId": "CREATION_ID_FROM_PREVIOUS_RESPONSE"
  }'
```

---

## Step 5: Verify Success

### Check Your Instagram

1. Open Instagram app or web
2. Go to your profile
3. You should see your new post!

### Get Insights (after 24 hours)

```bash
curl -X GET http://localhost:3000/instagram/insights/YOUR_MEDIA_ID
```

---

## Common First-Time Issues

### ❌ "Invalid OAuth access token"

**Fix:** Regenerate your access token with correct permissions

### ❌ "Media URL couldn't be downloaded"

**Fix:** Use HTTPS URLs only, ensure publicly accessible

### ❌ "Unsupported post request"

**Fix:** 
1. Verify Instagram account is Business/Creator
2. Check Facebook Page connection
3. Ensure Page is verified

### ❌ "Rate limit exceeded"

**Fix:** Wait 1 hour, Instagram allows 25 posts per hour

---

## Next Steps

✅ **Post your first image** - Done!  
⬜ **Try video posts** - Use `.mp4` URLs  
⬜ **Create carousel posts** - Multiple images  
⬜ **Add hashtags** - Boost discoverability  
⬜ **Track insights** - Monitor performance  
⬜ **Schedule posts** - Implement scheduling  

---

## Test Media URLs

Use these free URLs for testing:

**Images:**
```
https://picsum.photos/1080/1080
https://picsum.photos/1080/1350
https://source.unsplash.com/random/1080x1080
```

**Videos:**
```
https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4
```

---

## Need Help?

1. Check `INSTAGRAM_INTEGRATION.md` for detailed guide
2. Review troubleshooting section
3. Test in Graph API Explorer first
4. Check Meta's status page

---

## Quick Reference

### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/instagram/upload` | POST | Create container |
| `/instagram/publish` | POST | Publish post |
| `/instagram/insights/:id` | GET | Post insights |
| `/instagram/insights` | GET | Account insights |

### Key Files

```
backend/src/instagram/
├── services/instagram.service.ts
├── controllers/instagram.controller.ts
├── dto/upload-media.dto.ts
└── dto/create-post.dto.ts

frontend/src/components/
└── InstagramComposer.tsx
```

---

**You're all set! 🎉**

Your Instagram integration is ready to use. Start posting!

