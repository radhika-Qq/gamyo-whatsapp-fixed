# 🧪 Instagram Integration - Testing Guide

## Overview

This guide provides comprehensive testing procedures for the Instagram integration to ensure everything works correctly before going to production.

---

## Prerequisites for Testing

✅ Instagram Business or Creator account  
✅ Facebook Page connected to Instagram  
✅ Valid long-lived access token  
✅ Instagram User ID  
✅ Backend running on `http://localhost:3000`  
✅ Frontend running on `http://localhost:3001`  

---

## 1. Environment Setup Testing

### Test 1.1: Verify Environment Variables

**Check `.env` file:**
```bash
cd backend
cat .env | grep INSTAGRAM
```

**Expected output:**
```env
INSTAGRAM_API_URL=https://graph.facebook.com/v21.0
INSTAGRAM_USER_ID=17841405793187218
INSTAGRAM_ACCESS_TOKEN=EAABwz...
```

✅ **Pass**: All three variables present with valid values  
❌ **Fail**: Missing or empty variables

---

### Test 1.2: Verify Module Registration

**Check `app.module.ts`:**
```bash
cd backend/src
grep -n "InstagramModule" app.module.ts
```

**Expected output:**
```
9:import { InstagramModule } from './instagram/instagram.module';
37:    InstagramModule,
```

✅ **Pass**: Module imported and registered  
❌ **Fail**: Module not found in imports

---

## 2. Backend API Testing

### Test 2.1: Health Check (via other endpoint)

Since Instagram doesn't have a dedicated health endpoint, we'll test the service directly.

**Method 1: Check service initialization**
```bash
cd backend
npm run start:dev
```

Look for log output:
```
[Nest] INFO [InstagramService] Service initialized
[Nest] INFO [InstagramController] Controller initialized
```

✅ **Pass**: No errors during startup  
❌ **Fail**: Module loading errors

---

### Test 2.2: Create Media Container

**cURL Test:**
```bash
curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{
    "mediaUrl": "https://picsum.photos/1080/1080",
    "caption": "Test post from Instagram integration 🚀"
  }'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "creationId": "17895695668004550",
  "message": "Media container created successfully"
}
```

**Expected Response (Error - Invalid Token):**
```json
{
  "statusCode": 500,
  "message": "Failed to create media container: Invalid OAuth access token"
}
```

**Save the `creationId` for next test!**

✅ **Pass**: Returns 200 status with `creationId`  
❌ **Fail**: Error response or missing `creationId`

---

### Test 2.3: Publish Container

**cURL Test:**
```bash
curl -X POST http://localhost:3000/instagram/publish \
  -H "Content-Type: application/json" \
  -d '{
    "creationId": "YOUR_CREATION_ID_FROM_PREVIOUS_TEST"
  }'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "mediaId": "17895695668004551",
  "message": "Post published to Instagram successfully"
}
```

**Verification:**
1. Open Instagram app or web
2. Go to your profile
3. Verify the post appears in your feed

✅ **Pass**: Returns 200 status with `mediaId`, post visible on Instagram  
❌ **Fail**: Error response or post not visible

---

### Test 2.4: Get Post Insights

**Note:** Insights are only available 24 hours after publishing.

**cURL Test:**
```bash
curl -X GET http://localhost:3000/instagram/insights/YOUR_MEDIA_ID
```

**Expected Response (Success):**
```json
{
  "success": true,
  "mediaId": "17895695668004551",
  "insights": [
    {
      "name": "impressions",
      "period": "lifetime",
      "values": [{ "value": 1250 }],
      "title": "Impressions"
    },
    {
      "name": "reach",
      "period": "lifetime",
      "values": [{ "value": 980 }],
      "title": "Reach"
    },
    {
      "name": "engagement",
      "period": "lifetime",
      "values": [{ "value": 145 }],
      "title": "Engagement"
    }
  ]
}
```

**Expected Response (Too Early):**
```json
{
  "statusCode": 500,
  "message": "Insights are not available yet. Please try again after 24 hours."
}
```

✅ **Pass**: Returns insights data (after 24h) or appropriate error message  
❌ **Fail**: Unexpected error or invalid data

---

### Test 2.5: Get Account Insights

**cURL Test:**
```bash
curl -X GET http://localhost:3000/instagram/insights
```

**Expected Response:**
```json
{
  "success": true,
  "insights": [
    {
      "name": "impressions",
      "period": "day",
      "values": [{ "value": 3456 }]
    },
    {
      "name": "reach",
      "period": "day",
      "values": [{ "value": 2890 }]
    },
    {
      "name": "follower_count",
      "period": "day",
      "values": [{ "value": 1523 }]
    }
  ]
}
```

✅ **Pass**: Returns account-level insights  
❌ **Fail**: Error or missing data

---

## 3. Frontend UI Testing

### Test 3.1: Component Loading

1. Open `http://localhost:3001`
2. Click the **Instagram** tab
3. Verify the InstagramComposer component loads

✅ **Pass**: Component displays without errors  
❌ **Fail**: Blank page or React errors

---

### Test 3.2: Media URL Input

**Test Cases:**

| Test | Input | Expected |
|------|-------|----------|
| Valid URL | `https://picsum.photos/1080/1080` | Accepted |
| Invalid URL | `not-a-url` | Still accepted (validation is server-side) |
| Empty URL | `` | Button disabled |
| HTTPS URL | `https://example.com/image.jpg` | Accepted |
| HTTP URL | `http://example.com/image.jpg` | Accepted (will fail on server) |

✅ **Pass**: All test cases behave as expected  
❌ **Fail**: Unexpected validation behavior

---

### Test 3.3: Caption Input

**Test Cases:**

| Test | Input | Expected |
|------|-------|----------|
| Short caption | `Hello!` | Accepted |
| Long caption | 2000 character text | Accepted |
| Emojis | `🚀💯🔥` | Accepted |
| Hashtags | `#instagram #test` | Accepted |
| Mentions | `@username` | Accepted |
| Special chars | `Hello "world" & test` | Accepted |

✅ **Pass**: All characters accepted  
❌ **Fail**: Character encoding issues

---

### Test 3.4: Create Container Flow

**Steps:**
1. Enter media URL: `https://picsum.photos/1080/1080`
2. Enter caption: `Test post 🚀`
3. Click **"Create Container"**
4. Observe:
   - Button shows loading state: `⏳ Processing...`
   - Success message appears
   - Container ID displays
   - Button changes to: `✓ Container Created`

✅ **Pass**: Full workflow completes successfully  
❌ **Fail**: Errors or UI not updating

---

### Test 3.5: Publish Post Flow

**Steps:**
1. Complete Test 3.4 first (create container)
2. Click **"Publish Post"** button
3. Observe:
   - Button shows loading state
   - Success message appears
   - Published Media ID displays
   - Button changes to: `✓ Published`

✅ **Pass**: Post publishes successfully  
❌ **Fail**: Errors or post not appearing on Instagram

---

### Test 3.6: Get Insights Flow

**Steps:**
1. Wait 24 hours after publishing a post
2. Enter the Media ID
3. Click **"Get Insights"**
4. Observe:
   - Button shows loading state
   - Insights data displays in formatted JSON
   - Success message appears

✅ **Pass**: Insights display correctly  
❌ **Fail**: Errors or missing data

---

### Test 3.7: Error Handling

**Test Cases:**

| Test | Action | Expected Error |
|------|--------|----------------|
| Invalid token | Create container | "Invalid OAuth access token" |
| Invalid URL | Create container | "Media URL couldn't be downloaded" |
| Invalid creation ID | Publish | "Invalid parameter" |
| Network error | Any action | Network error message |
| Server down | Any action | Connection error |

✅ **Pass**: Errors display in red alert box  
❌ **Fail**: Errors not caught or displayed

---

### Test 3.8: Reset Functionality

**Steps:**
1. Fill in form with data
2. Create container
3. Publish post
4. Click **"Reset"** button
5. Verify:
   - All inputs cleared
   - Container ID cleared
   - Media ID cleared
   - Insights cleared
   - Messages cleared
   - Form ready for new post

✅ **Pass**: Form resets completely  
❌ **Fail**: Data remains after reset

---

## 4. Integration Testing

### Test 4.1: End-to-End Post Flow

**Complete workflow:**
```bash
# 1. Create container
CREATION_ID=$(curl -s -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl":"https://picsum.photos/1080/1080","caption":"E2E Test"}' \
  | jq -r '.creationId')

echo "Creation ID: $CREATION_ID"

# 2. Publish post
MEDIA_ID=$(curl -s -X POST http://localhost:3000/instagram/publish \
  -H "Content-Type: application/json" \
  -d "{\"creationId\":\"$CREATION_ID\"}" \
  | jq -r '.mediaId')

echo "Media ID: $MEDIA_ID"

# 3. Verify on Instagram (manual)
echo "Check Instagram profile for new post"

# 4. Get insights (after 24h)
sleep 86400  # Wait 24 hours
curl -X GET http://localhost:3000/instagram/insights/$MEDIA_ID
```

✅ **Pass**: Full workflow completes without errors  
❌ **Fail**: Any step fails

---

### Test 4.2: Multiple Posts

**Test rapid posting:**
```bash
for i in {1..3}; do
  curl -X POST http://localhost:3000/instagram/upload \
    -H "Content-Type: application/json" \
    -d "{\"mediaUrl\":\"https://picsum.photos/1080/1080\",\"caption\":\"Test $i\"}"
  
  sleep 5
done
```

✅ **Pass**: All posts create successfully  
❌ **Fail**: Rate limiting or errors

---

### Test 4.3: Different Media Types

**Test image formats:**
```bash
# JPG image
curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl":"https://picsum.photos/1080/1080.jpg","caption":"JPG test"}'

# PNG image (via URL)
curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl":"https://via.placeholder.com/1080x1080.png","caption":"PNG test"}'
```

✅ **Pass**: Both formats accepted  
❌ **Fail**: Format errors

---

## 5. Error Handling Testing

### Test 5.1: Invalid Access Token

**Steps:**
1. Change `INSTAGRAM_ACCESS_TOKEN` in `.env` to invalid value
2. Restart backend
3. Try to create container

**Expected:**
```json
{
  "statusCode": 500,
  "message": "Failed to create media container: Invalid OAuth access token"
}
```

✅ **Pass**: Clear error message  
❌ **Fail**: Server crash or unclear error

---

### Test 5.2: Expired Token

**Steps:**
1. Use an expired token (60+ days old)
2. Try to create container

**Expected:**
```json
{
  "statusCode": 500,
  "message": "Failed to create media container: Error validating access token"
}
```

✅ **Pass**: Detects expired token  
❌ **Fail**: Misleading error

---

### Test 5.3: Invalid Media URL

**Test Cases:**
```bash
# Non-existent URL
curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl":"https://example.com/nonexistent.jpg"}'

# Non-image URL
curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl":"https://google.com"}'

# HTTP (not HTTPS)
curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl":"http://example.com/image.jpg"}'
```

**Expected:**
All should return error messages about media URL

✅ **Pass**: Appropriate errors for each case  
❌ **Fail**: Accepts invalid URLs

---

### Test 5.4: Invalid Container ID

**Steps:**
```bash
curl -X POST http://localhost:3000/instagram/publish \
  -H "Content-Type: application/json" \
  -d '{"creationId":"invalid_id_12345"}'
```

**Expected:**
```json
{
  "statusCode": 500,
  "message": "Failed to publish post: Invalid parameter"
}
```

✅ **Pass**: Detects invalid container ID  
❌ **Fail**: Server error or unclear message

---

## 6. Performance Testing

### Test 6.1: Response Times

**Measure API response times:**
```bash
# Create container
time curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl":"https://picsum.photos/1080/1080","caption":"Performance test"}'
```

**Expected:**
- Create container: < 5 seconds
- Publish post: < 3 seconds
- Get insights: < 2 seconds

✅ **Pass**: All within expected times  
❌ **Fail**: Significantly slower

---

### Test 6.2: Concurrent Requests

**Test multiple simultaneous requests:**
```bash
for i in {1..5}; do
  curl -X POST http://localhost:3000/instagram/upload \
    -H "Content-Type: application/json" \
    -d "{\"mediaUrl\":\"https://picsum.photos/1080/1080\",\"caption\":\"Concurrent $i\"}" &
done
wait
```

✅ **Pass**: All requests succeed  
❌ **Fail**: Some requests fail or timeout

---

## 7. Security Testing

### Test 7.1: Environment Variable Protection

**Verify token not exposed:**
```bash
# Check frontend source
curl http://localhost:3001 | grep INSTAGRAM_ACCESS_TOKEN

# Check API responses
curl http://localhost:3000/instagram/insights | grep access_token
```

**Expected:**
No tokens found in responses

✅ **Pass**: Tokens not exposed  
❌ **Fail**: Tokens visible in responses

---

### Test 7.2: Input Validation

**Test SQL injection attempts:**
```bash
curl -X POST http://localhost:3000/instagram/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl":"https://example.com/image.jpg'; DROP TABLE users--","caption":"test"}'
```

✅ **Pass**: Safely handled  
❌ **Fail**: Security vulnerability

---

## 8. Regression Testing

### Test 8.1: Other Modules Still Work

**Verify WhatsApp, LinkedIn, Facebook still functional:**
```bash
# WhatsApp health check (if available)
curl http://localhost:3000/whatsapp/health

# LinkedIn health check
curl http://localhost:3000/linkedin/health

# Facebook (test endpoint - adapt as needed)
curl http://localhost:3000/facebook/insights/page
```

✅ **Pass**: All other modules work  
❌ **Fail**: Instagram broke other modules

---

## 9. Production Readiness Checklist

Before deploying to production:

### Backend
- [ ] All tests pass
- [ ] Error handling covers edge cases
- [ ] Logging configured
- [ ] Environment variables set
- [ ] Rate limiting implemented
- [ ] Token refresh strategy in place
- [ ] Database backup (if applicable)

### Frontend
- [ ] UI/UX tested on multiple browsers
- [ ] Mobile responsiveness verified
- [ ] Loading states implemented
- [ ] Error messages user-friendly
- [ ] Analytics tracking added (optional)

### Documentation
- [ ] API documentation updated
- [ ] README updated
- [ ] Environment variables documented
- [ ] Troubleshooting guide complete

### Security
- [ ] Tokens secured
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Input validation complete

---

## 10. Test Summary Report Template

```markdown
# Instagram Integration Test Report

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** Development/Staging/Production

## Test Results

| Category | Tests | Passed | Failed | Notes |
|----------|-------|--------|--------|-------|
| Environment | 2 | 2 | 0 | ✅ |
| Backend API | 5 | 5 | 0 | ✅ |
| Frontend UI | 8 | 8 | 0 | ✅ |
| Integration | 3 | 3 | 0 | ✅ |
| Error Handling | 4 | 4 | 0 | ✅ |
| Performance | 2 | 2 | 0 | ✅ |
| Security | 2 | 2 | 0 | ✅ |
| Regression | 1 | 1 | 0 | ✅ |

## Overall Status: ✅ PASS / ❌ FAIL

## Issues Found:
1. [Issue description]
2. [Issue description]

## Recommendations:
1. [Recommendation]
2. [Recommendation]

**Approved for Production:** YES / NO
```

---

## Need Help?

If tests fail:
1. Check `INSTAGRAM_INTEGRATION.md` for setup verification
2. Review `INSTAGRAM_QUICKSTART.md` for common issues
3. Verify Instagram account is Business/Creator
4. Check access token permissions and expiration
5. Review backend logs for detailed error messages

---

**Happy Testing! 🧪**

