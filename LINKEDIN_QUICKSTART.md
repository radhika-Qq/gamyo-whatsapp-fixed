# LinkedIn Quick Start Guide

Get your LinkedIn integration running in 5 minutes!

## Prerequisites Checklist

- [ ] LinkedIn Company Page (with admin access)
- [ ] LinkedIn Developer account
- [ ] Backend and frontend already running

## Step 1: Create LinkedIn App (2 minutes)

1. Go to https://www.linkedin.com/developers/apps
2. Click **"Create app"**
3. Fill in:
   - **App name**: Gamyo Integration (or your choice)
   - **LinkedIn Page**: Select your company page
   - **App logo**: Upload any logo
4. Click **"Create app"**
5. Click **"Verify"** next to your company page

## Step 2: Request API Access (1 minute)

1. In your app, go to **"Products"** tab
2. Find **"Share on LinkedIn"** or **"Marketing Developer Platform"**
3. Click **"Request access"**
4. Wait for approval (usually instant for company pages)

## Step 3: Generate Access Token (1 minute)

### Option A: Quick Token (60 days, for testing)

1. Go to **"Auth"** tab in your app
2. Scroll to **"OAuth 2.0 settings"**
3. Add redirect URL: `https://www.linkedin.com/developers/tools/oauth/redirect`
4. Copy your **Client ID** and **Client Secret**
5. Use LinkedIn's OAuth tool or this URL:

```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=https://www.linkedin.com/developers/tools/oauth/redirect&scope=w_organization_social%20r_organization_social
```

6. Authorize and get your access token

### Option B: Quick Test Token (for immediate testing)

1. In app dashboard, go to **"Auth"** tab
2. Under **"OAuth 2.0 tools"**, find **"Generate token"**
3. Select scopes: `w_organization_social` and `r_organization_social`
4. Click **"Request access token"**
5. Copy the token

## Step 4: Get Organization URN (30 seconds)

1. Go to your LinkedIn company page
2. Look at the URL: `https://www.linkedin.com/company/12345678/`
3. The number is your organization ID
4. Format as: `urn:li:organization:12345678`

## Step 5: Configure Backend (30 seconds)

Edit `backend/.env`:

```env
# Add these lines
LINKEDIN_API_URL=https://api.linkedin.com/v2
LINKEDIN_ACCESS_TOKEN=AQVXXXXXyour_token_hereXXXXX
LINKEDIN_ORGANIZATION_URN=urn:li:organization:12345678
```

**Replace**:
- `your_token_here` → Your actual access token from Step 3
- `12345678` → Your company page ID from Step 4

## Step 6: Restart Backend (30 seconds)

```bash
# Stop backend (Ctrl+C)
cd backend
npm run start:dev
```

## Step 7: Test! (30 seconds)

### Option A: Test via UI

1. Open http://localhost:3001
2. Click **"LinkedIn"** tab
3. Type: "Hello from Gamyo! 🚀"
4. Click **"Publish to LinkedIn"**
5. Check your company page - post should appear!

### Option B: Test via cURL

```bash
curl -X POST http://localhost:3000/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Gamyo! 🚀"}'
```

## ✅ Verification Checklist

Test each endpoint:

```bash
# 1. Health check (should return status: "ok")
curl http://localhost:3000/linkedin/health

# 2. Organization info (should return company details)
curl http://localhost:3000/linkedin/organization

# 3. Publish post (should return postId)
curl -X POST http://localhost:3000/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{"text": "Test post from Gamyo!"}'
```

## 🎉 Success Indicators

You'll know it's working when:

1. **Health check** returns `{"status": "ok"}`
2. **Organization endpoint** returns your company details
3. **Post endpoint** returns a `postId`
4. **Your LinkedIn page** shows the published post
5. **No errors** in backend console

## 🐛 Troubleshooting

### Error: "Invalid access token"
**Fix**: Token expired or incorrect. Generate new token from Step 3.

### Error: "403 Forbidden"
**Fix**: 
- Ensure your app has "Share on LinkedIn" product approved
- Verify organization URN is correct
- Check company page is linked to your app

### Error: "Organization not found"
**Fix**: Double-check organization URN format: `urn:li:organization:12345678`

### Error: "LINKEDIN_ACCESS_TOKEN is not configured"
**Fix**: 
- Verify `.env` file exists in `backend/` folder
- Check variable name is exactly `LINKEDIN_ACCESS_TOKEN`
- Restart backend after adding variables

### Error: "Cannot upload media"
**Fix**: 
- Ensure media URL is publicly accessible
- Check image format (JPG/PNG only)
- Max file size: 8 MB

## 📊 Rate Limits

Keep in mind:
- **100 posts per day** per organization
- **500 API calls per day** per access token
- **Access token expires** after 60 days (generate new one)

## 🔒 Security Best Practices

1. **Never commit** `.env` file to Git
2. **Use environment variables** for all credentials
3. **Rotate tokens** every 60 days
4. **Limit token scope** to only required permissions

## 🚀 Next Steps

Now that LinkedIn is working:

### 1. Test Media Upload
```bash
# Upload an image
curl -X POST http://localhost:3000/linkedin/upload \
  -H "Content-Type: application/json" \
  -d '{"mediaUrl": "https://picsum.photos/1200/627"}'

# Use returned assetUrn in post
curl -X POST http://localhost:3000/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{"text": "Check out this image!", "media": "urn:li:digitalmediaAsset:..."}'
```

### 2. Try the UI
- Upload media using the form
- See live character counter
- Test error handling with invalid URLs

### 3. Build Your Use Cases
- **Content Marketing**: Schedule posts about your products
- **Announcements**: Share company updates
- **Engagement**: Post industry insights
- **Automation**: Integrate with your CMS or dashboard

## 📚 Learn More

- Full guide: [LINKEDIN_INTEGRATION.md](LINKEDIN_INTEGRATION.md)
- Main README: [README.md](README.md)
- LinkedIn API Docs: https://docs.microsoft.com/en-us/linkedin/

## 💡 Tips for Success

1. **Start simple** - Test with text-only posts first
2. **Check limits** - Monitor your API usage
3. **Plan content** - Schedule posts during peak hours
4. **Track performance** - Use LinkedIn analytics
5. **Stay compliant** - Follow LinkedIn's posting policies

## 🎯 Example Use Cases

### Daily Update Bot
```typescript
// Post daily tips
const tips = [
  "Tip 1: Focus on user experience",
  "Tip 2: Test early and often",
  // ...
];

schedule.daily(() => {
  api.post('/linkedin/post', { text: tips[today] });
});
```

### Product Launch Campaign
```typescript
// Announce new feature with image
await api.post('/linkedin/upload', { 
  mediaUrl: 'https://cdn.example.com/feature.jpg' 
});

await api.post('/linkedin/post', { 
  text: "🚀 New feature alert! Check out our latest innovation.",
  media: assetUrn 
});
```

### Customer Success Stories
```typescript
// Share testimonials
const story = getCustomerStory();
await api.post('/linkedin/post', { 
  text: `"${story.quote}" - ${story.customer}\n\n#CustomerSuccess` 
});
```

---

**Ready to go live?** 🎉

Your LinkedIn integration is now complete! Start publishing and growing your company's presence on LinkedIn.

Need help? Check the troubleshooting section or refer to the full integration guide.

**Happy Posting!** 🚀📈

