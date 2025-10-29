# 🧪 Facebook Integration - Testing Checklist

This document provides a step-by-step testing guide for the Facebook integration.

---

## ✅ Pre-Testing Requirements

Before you begin testing, ensure you have:

- [x] Created a Facebook App at [developers.facebook.com](https://developers.facebook.com/)
- [x] Obtained your Facebook Page ID
- [x] Generated a long-lived Page Access Token
- [x] Added credentials to `backend/.env`
- [x] Backend server running on `http://localhost:3000`
- [x] Frontend server running on `http://localhost:3001`

---

## 🧪 Test Cases

### Test 1: Backend Health Check

**Purpose:** Verify the backend server and Facebook module are loaded

```bash
curl http://localhost:3000/
```

**Expected:** Server responds with 200 OK

---

### Test 2: Upload Photo

**Purpose:** Test photo upload to Facebook Page

```bash
curl -X POST http://localhost:3000/facebook/upload \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "https://picsum.photos/800/600",
    "caption": "Test photo from Gamyo API",
    "mediaType": "photo"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "mediaId": "1234567890",
  "data": {
    "id": "1234567890"
  }
}
```

**Verify:**
- Response includes a `mediaId`
- `success` is `true`
- Save the `mediaId` for the next test

---

### Test 3: Publish Text-Only Post

**Purpose:** Test simple text post publishing

```bash
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from Gamyo! This is a test post from our multi-platform integration. 🚀"
  }'
```

**Expected Response:**
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

**Verify:**
- Response includes a `postId`
- Visit your Facebook Page and verify the post appears
- Save the `postId` for insights test

---

### Test 4: Publish Post with Media

**Purpose:** Test post with attached photo

```bash
# Use the mediaId from Test 2
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Check out this amazing image! 📸 #GamyoTest",
    "mediaId": "YOUR_MEDIA_ID_HERE"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "postId": "123456789012345_987654321098765",
  "message": "Post published successfully on Facebook Page"
}
```

**Verify:**
- Post appears on your Facebook Page
- Image is visible in the post
- Caption is displayed correctly

---

### Test 5: Schedule a Post

**Purpose:** Test scheduled post publishing

```bash
# Calculate timestamp for 1 hour from now
# Linux/Mac:
TIMESTAMP=$(date -d "+1 hour" +%s)

# Windows PowerShell:
# $TIMESTAMP = [Math]::Floor([decimal](Get-Date).AddHours(1).ToFileTimeUtc() / 10000000 - 11644473600)

curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"This post was scheduled 1 hour in advance using Gamyo! ⏰\",
    \"scheduledTime\": $TIMESTAMP
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "postId": "123456789012345_987654321098765",
  "message": "Post scheduled successfully on Facebook Page"
}
```

**Verify:**
- Response indicates scheduling success
- Go to your Facebook Page → Publishing Tools → Scheduled Posts
- Verify the post appears in the scheduled posts list

---

### Test 6: Get Post Insights

**Purpose:** Test analytics retrieval for a post

```bash
# Use postId from Test 3
curl http://localhost:3000/facebook/insights/post/YOUR_POST_ID_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "insights": [
    {
      "name": "post_impressions",
      "period": "lifetime",
      "values": [{ "value": 123 }]
    },
    {
      "name": "post_engaged_users",
      "period": "lifetime",
      "values": [{ "value": 5 }]
    }
  ]
}
```

**Verify:**
- Insights data is returned
- Metrics include impressions and engagement

**Note:** Insights may take a few minutes to populate after post creation

---

### Test 7: Get Page Insights

**Purpose:** Test page-level analytics

```bash
curl http://localhost:3000/facebook/insights/page
```

**Expected Response:**
```json
{
  "success": true,
  "insights": [
    {
      "name": "page_impressions",
      "period": "day",
      "values": [
        {
          "value": 1234,
          "end_time": "2025-10-29T07:00:00+0000"
        }
      ]
    }
  ]
}
```

**Verify:**
- Page-level metrics are returned
- Data includes impressions and engagement

---

### Test 8: Frontend - Upload Photo via UI

**Purpose:** Test the frontend upload functionality

**Steps:**
1. Open `http://localhost:3001`
2. Click the "Facebook" tab
3. Select "Photo" from the Media Type dropdown
4. Enter a media URL: `https://picsum.photos/800/600`
5. (Optional) Add a caption
6. Click "Upload Photo"

**Verify:**
- Loading indicator appears
- Success message displays with Media ID
- Green chip shows "Media attached: 📷 Photo"

---

### Test 9: Frontend - Publish Text Post via UI

**Purpose:** Test frontend post publishing

**Steps:**
1. On the Facebook tab, scroll to "Step 2: Compose Your Post"
2. Enter a message: "Testing Gamyo Facebook integration from the UI! 🎉"
3. Click "Publish to Facebook"

**Verify:**
- Loading indicator appears
- Success alert displays with Post ID
- Message: "Post published successfully on Facebook Page! 🎉"
- Check your Facebook Page - post should appear

---

### Test 10: Frontend - Schedule Post via UI

**Purpose:** Test scheduled post functionality

**Steps:**
1. Compose a new post message
2. Click the "Scheduled Date & Time" field
3. Select a date/time at least 15 minutes in the future
4. Click "Schedule Post"

**Verify:**
- Button text changes to "Schedule Post"
- Success message indicates scheduling
- Post appears in Facebook Page → Publishing Tools → Scheduled Posts

---

### Test 11: Error Handling - Invalid Token

**Purpose:** Test error handling for authentication failures

**Steps:**
1. Temporarily change `FACEBOOK_ACCESS_TOKEN` in `.env` to an invalid value
2. Restart the backend server
3. Try to publish a post

**Expected:**
- Error response with message about invalid token
- Frontend displays error alert

**Remember to restore the correct token!**

---

### Test 12: Error Handling - Missing Required Fields

**Purpose:** Test validation

```bash
curl -X POST http://localhost:3000/facebook/post \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:**
- 400 Bad Request error
- Validation error message about missing `message` field

---

## 📊 Testing Results Template

Copy this template to track your testing:

```
✅ Test 1: Backend Health Check - PASSED / FAILED
✅ Test 2: Upload Photo - PASSED / FAILED
✅ Test 3: Publish Text-Only Post - PASSED / FAILED
✅ Test 4: Publish Post with Media - PASSED / FAILED
✅ Test 5: Schedule a Post - PASSED / FAILED
✅ Test 6: Get Post Insights - PASSED / FAILED
✅ Test 7: Get Page Insights - PASSED / FAILED
✅ Test 8: Frontend - Upload Photo - PASSED / FAILED
✅ Test 9: Frontend - Publish Post - PASSED / FAILED
✅ Test 10: Frontend - Schedule Post - PASSED / FAILED
✅ Test 11: Error Handling - Invalid Token - PASSED / FAILED
✅ Test 12: Error Handling - Validation - PASSED / FAILED
```

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid OAuth access token"

**Solution:** 
- Your token may have been revoked or is invalid
- Generate a new long-lived Page Access Token
- Update `FACEBOOK_ACCESS_TOKEN` in `.env`
- Restart the backend

### Issue: "Media upload fails"

**Solution:**
- Ensure the media URL is publicly accessible (not behind auth)
- Verify it's a direct link to the file (not an HTML page)
- Check file format (JPG/PNG for photos, MP4 for videos)
- Try with a test URL: `https://picsum.photos/800/600`

### Issue: "Scheduled post fails"

**Solution:**
- Ensure timestamp is in Unix seconds format
- Time must be 10 minutes to 75 days from now
- Your page must have permission to schedule posts

### Issue: "Post published but doesn't appear on page"

**Solution:**
- Check if your Page has country restrictions
- Verify post wasn't flagged by Facebook's spam filters
- Some posts may take a few seconds to appear
- Check the post ID in Facebook Graph API Explorer

---

## 🎯 Advanced Testing

### Performance Test

Test rapid consecutive posts (respect rate limits):

```bash
for i in {1..5}; do
  curl -X POST http://localhost:3000/facebook/post \
    -H "Content-Type: application/json" \
    -d "{\"message\": \"Test post $i from Gamyo\"}"
  sleep 2
done
```

### Video Upload Test

```bash
curl -X POST http://localhost:3000/facebook/upload \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "https://example.com/test-video.mp4",
    "caption": "Test video from Gamyo",
    "mediaType": "video"
  }'
```

---

## ✅ Testing Complete!

Once all tests pass:
- ✅ Your Facebook integration is working correctly
- ✅ Both backend API and frontend UI are functional
- ✅ Error handling is in place
- ✅ Ready for production use

---

**Questions or Issues?**
- Check [FACEBOOK_INTEGRATION.md](./FACEBOOK_INTEGRATION.md) for detailed setup
- Check [FACEBOOK_QUICKSTART.md](./FACEBOOK_QUICKSTART.md) for quick examples
- Use [Facebook Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) to verify your token

**Happy Testing! 🚀**

