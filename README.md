# Gamyo Multi-Platform Integration

A complete multi-platform messaging integration featuring **WhatsApp Business API** and **LinkedIn** integrations. Built with NestJS backend and React frontend.

## 🚀 Features

### WhatsApp Business Integration
- **1:1 Messaging** - Send individual messages to WhatsApp users
- **Broadcast Messages** - Send bulk messages to multiple contacts with opt-in compliance
- **Channel Updates** - Post announcements to your WhatsApp Channel
- **Webhook Integration** - Receive and process incoming messages and delivery status
- **Message Tracking** - Complete database logging of all sent messages

### LinkedIn Integration ✨ NEW
- **Post Publishing** - Publish posts to LinkedIn company pages
- **Media Upload** - Upload and attach images to posts
- **Organization Management** - Manage LinkedIn company page content
- **API Integration** - Full LinkedIn API v2 integration

### Common Features
- **Modern UI** - Beautiful Material-UI interface with platform-specific theming
- **Modular Architecture** - Easy to extend with additional platforms (Instagram, Facebook, etc.)

## 📋 Tech Stack

### Backend
- **NestJS 10** - Progressive Node.js framework with TypeScript
- **TypeORM 0.3** - ORM for PostgreSQL database operations
- **PostgreSQL 14** - Relational database for data persistence
- **Axios** - HTTP client for WhatsApp Business API calls
- **class-validator** - DTO validation

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Material-UI (MUI) 5** - Component library with WhatsApp theme
- **Axios** - API communication with backend
- **Emotion** - CSS-in-JS styling

### Infrastructure
- **Docker Compose** - PostgreSQL containerization
- **ngrok** - Local webhook testing and development

## ⚡ Quick Start

### Prerequisites

- **Node.js v18+** - [Download](https://nodejs.org/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Meta Developer Account** - [Sign up](https://developers.facebook.com/) *(for WhatsApp)*
- **LinkedIn Developer Account** - [Sign up](https://www.linkedin.com/developers/) *(for LinkedIn)*

### 1. Get WhatsApp API Credentials

1. Go to [Meta Developer Portal](https://developers.facebook.com/)
2. Create a new app → Select **Business** type
3. Add **WhatsApp** product to your app
4. Copy these credentials:
   - **Phone Number ID** (from "From" section)
   - **Temporary Access Token** (click copy button)
5. Add your test phone number and verify with OTP

### 2. Configure Environment

Create `backend/.env` file:

```env
# WhatsApp API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_CHANNEL_ID=your_channel_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token

# LinkedIn API Configuration
LINKEDIN_API_URL=https://api.linkedin.com/v2
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token_here
LINKEDIN_ORGANIZATION_URN=urn:li:organization:123456789

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp

# Server Configuration
PORT=3000
```

**Important**: 
- Replace WhatsApp credentials with your actual Meta credentials
- Replace LinkedIn credentials with your LinkedIn developer app credentials
- See [LINKEDIN_INTEGRATION.md](LINKEDIN_INTEGRATION.md) for detailed LinkedIn setup

### 3. Start Database

```bash
docker-compose up -d
```

### 4. Start Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend will run on `http://localhost:3000`

### 5. Start Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will automatically open at `http://localhost:3001`

### 6. Send Your First Message!

1. Open `http://localhost:3001`
2. Navigate to **"1:1 Messaging"** tab
3. Enter phone number with country code (e.g., `919876543210`)
4. Type your message
5. Click **"Send Message"**
6. Check your WhatsApp - you should receive the message!

## 📡 API Endpoints

### Backend API (http://localhost:3000)

#### WhatsApp Endpoints

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/whatsapp/health` | GET | Health check | - |
| `/whatsapp/send` | POST | Send 1:1 message | `{ "phone": "919876543210", "message": "Hello" }` |
| `/whatsapp/broadcast` | POST | Send broadcast | `{ "templateName": "hello_world", "contacts": ["919876543210"] }` |
| `/whatsapp/channel` | POST | Post channel update | `{ "message": "Announcement text" }` |
| `/webhook` | GET | Webhook verification | - |
| `/webhook` | POST | Receive WhatsApp events | - |

#### LinkedIn Endpoints ✨ NEW

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/linkedin/health` | GET | Health check | - |
| `/linkedin/upload` | POST | Upload media | `{ "mediaUrl": "https://example.com/image.jpg" }` |
| `/linkedin/post` | POST | Publish post | `{ "text": "Post content", "media": "urn:li:..." }` |
| `/linkedin/organization` | GET | Get org info | - |

### Example API Calls

**Send 1:1 Message:**
```bash
curl -X POST http://localhost:3000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "919876543210", "message": "Hello from Gamyo!"}'
```

**Send Broadcast:**
```bash
curl -X POST http://localhost:3000/whatsapp/broadcast \
  -H "Content-Type: application/json" \
  -d '{"templateName": "hello_world", "contacts": ["919876543210", "918765432109"]}'
```

**Post Channel Update:**
```bash
curl -X POST http://localhost:3000/whatsapp/channel \
  -H "Content-Type: application/json" \
  -d '{"message": "New product launch tomorrow!"}'
```

**Publish LinkedIn Post:**
```bash
curl -X POST http://localhost:3000/linkedin/post \
  -H "Content-Type: application/json" \
  -d '{"text": "Exciting news from our team! #innovation"}'
```

## 🔧 Webhook Setup (Optional)

Webhooks allow your application to receive incoming messages and delivery status updates.

### 1. Install ngrok

```bash
# Windows (using chocolatey)
choco install ngrok

# macOS
brew install ngrok

# Linux (using snap)
snap install ngrok
```

### 2. Start ngrok

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 3. Configure in Meta Developer Portal

1. Go to your app → **WhatsApp** → **Configuration**
2. Find **Webhook** section → Click **Edit**
3. Enter:
   - **Callback URL**: `https://abc123.ngrok.io/webhook`
   - **Verify Token**: Value from `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in `.env`
4. Click **Verify and Save**
5. Subscribe to webhook events:
   - ☑️ `messages` - Receive incoming messages
   - ☑️ `message_status` - Get delivery/read receipts

### 4. Test Webhooks

Send a WhatsApp message to your business number. Check backend logs - you should see:
```
Webhook event received: {...}
Received message from 919876543210: Hello!
```

## 🗄️ Database Schema

The application uses PostgreSQL with three main tables:

### contacts
```sql
id              SERIAL PRIMARY KEY
phone           VARCHAR UNIQUE
name            VARCHAR
optedIn         BOOLEAN DEFAULT false
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### templates
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR UNIQUE
content         TEXT
language        VARCHAR DEFAULT 'en_US'
status          VARCHAR DEFAULT 'APPROVED'
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### sent_messages
```sql
id                  SERIAL PRIMARY KEY
phone               VARCHAR
message             TEXT
whatsappMessageId   VARCHAR
status              VARCHAR DEFAULT 'pending'
errorMessage        VARCHAR
messageType         VARCHAR DEFAULT 'text'
templateName        VARCHAR
createdAt           TIMESTAMP
```

## 🚨 Troubleshooting

### Issue: "Invalid OAuth access token"

**Solution**: 
- Temporary tokens expire after 24 hours
- Get a new token from Meta Developer Portal
- Or create a permanent token via Business Settings → System Users

### Issue: "Can't connect to database"

**Solution**:
```bash
# Verify Docker is running
docker ps

# Restart database
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs postgres
```

### Issue: Backend won't start

**Solution**:
- Check if port 3000 is in use: `netstat -ano | findstr :3000` (Windows)
- Verify `.env` file exists in `backend/` folder
- Ensure variable names are correct (`DB_HOST` not `DATABASE_HOST`)

### Issue: Messages not sending

**Solution**:
- Verify phone number format: `919876543210` (no +, no spaces)
- Check phone number is added in Meta Dashboard
- Ensure access token is valid
- Check rate limits: 250 messages/day in test mode

### Issue: CORS errors in frontend

**Solution**: Backend is configured for `http://localhost:3001`. If using different port, update `backend/src/main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:YOUR_PORT',
  credentials: true,
});
```

## ⚖️ WhatsApp Business Compliance

### Message Templates
- Required for messages outside 24-hour conversation window
- Must be approved by Meta before use
- Create templates in [Meta Business Manager](https://business.facebook.com/wa/manage/message-templates/)

### Opt-in Requirements
- **Always required** for broadcast messages
- Users must explicitly opt-in to receive messages
- Maintain opt-in records for compliance
- Never message users who haven't opted in

### Rate Limits

**Test Mode:**
- 1,000 conversations/month
- 250 messages/day
- Limited to 5 phone numbers

**Production:**
- Conversation-based pricing
- Higher rate limits
- Requires business verification

## 📊 API Rate Limiting

The broadcast service includes built-in rate limiting:
- 1 second delay between messages
- Batches of 250 messages max
- Automatic retry logic for failed messages

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Replace temporary access token with permanent token
- [ ] Use verified business phone number (not test number)
- [ ] All message templates approved by Meta
- [ ] Implement user opt-in mechanism
- [ ] Set up proper error handling and monitoring
- [ ] Configure production webhook URL (HTTPS required)
- [ ] Set `synchronize: false` in TypeORM (use migrations)
- [ ] Review and comply with WhatsApp Business policies
- [ ] Set up database backups
- [ ] Configure environment variables securely

### Deployment Options

**Backend:**
- Vercel (Serverless functions)
- Railway (Full Node.js hosting)
- AWS (EC2, ECS, Lambda)
- DigitalOcean (Droplets, App Platform)
- Heroku (Container-based)

**Frontend:**
- Vercel (Automatic React deployment)
- Netlify (Static site hosting)
- AWS S3 + CloudFront
- Firebase Hosting

**Database:**
- Railway (Managed PostgreSQL)
- AWS RDS
- DigitalOcean Managed Databases
- Supabase

## 📚 Additional Resources

### WhatsApp
- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Developer Portal](https://developers.facebook.com/)
- [WhatsApp Business Manager](https://business.whatsapp.com/)

### LinkedIn
- [LinkedIn Marketing Developer Platform](https://docs.microsoft.com/en-us/linkedin/)
- [LinkedIn Share API Documentation](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api)
- [Detailed LinkedIn Integration Guide](LINKEDIN_INTEGRATION.md)

### Frameworks & Tools
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)

## 🤝 Contributing

This is a prototype for demonstration purposes. Feel free to fork and customize for your needs.

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 💡 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review WhatsApp API documentation
3. Visit Meta Developer Community forums
4. Check API status: https://developers.facebook.com/status/

---

**Built with ❤️ for Gamyo.ai**

*Start sending WhatsApp messages programmatically in minutes!* 🚀
