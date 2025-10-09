# Gamyo WhatsApp Business API Integration Prototype

A complete local prototype for WhatsApp Business API integration featuring **1:1 messaging**, **broadcasts**, and **Channels**. Built with NestJS (backend) and React + TypeScript (frontend).

## Features

- **1:1 Messaging**: Send individual messages to WhatsApp users
- **Broadcast Messages**: Send bulk messages to multiple contacts (with opt-in compliance)
- **Channel Updates**: Post updates to your WhatsApp Channel
- **Webhook Handling**: Receive and process WhatsApp events (messages, delivery status)
- **Database Logging**: Track all sent messages with PostgreSQL
- **Modern UI**: Beautiful Material-UI interface

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for PostgreSQL
- **PostgreSQL** - Database for contacts, templates, and message logs
- **Axios** - HTTP client for WhatsApp API

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Axios** - API communication

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Docker** (for PostgreSQL) or PostgreSQL installed locally
- **Meta Developer Account** with WhatsApp Business API access
- **ngrok** (for webhook testing)

## Quick Start

### 1. Clone and Setup

```bash
cd gamyo.ai-wab-integration-trail
```

### 2. Start PostgreSQL

Using Docker:
```bash
docker-compose up -d
```

Or if you have PostgreSQL installed locally, create a database:
```sql
CREATE DATABASE gamyo_whatsapp;
```

### 3. Configure Backend

Create a `.env` file in the `backend` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your credentials:

```env
# WhatsApp Business API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_CHANNEL_ID=your_channel_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token_here

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp

# Server Configuration
PORT=3000
```

### 4. Install and Run Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend will run on `http://localhost:3000`

### 5. Install and Run Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3001`

### 6. Setup Webhook (Optional but Recommended)

To receive WhatsApp events (messages, delivery status), you need to expose your local server:

1. Install ngrok:
```bash
# Windows (using chocolatey)
choco install ngrok

# macOS
brew install ngrok
```

2. Start ngrok:
```bash
ngrok http 3000
```

3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. Configure in Meta Developer Portal:
   - Go to [Meta Developer Portal](https://developers.facebook.com/)
   - Navigate to your WhatsApp app
   - Go to **Webhooks** section
   - Add webhook URL: `https://abc123.ngrok.io/webhook`
   - Add verify token: (the value from `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in your `.env`)
   - Subscribe to webhook events: `messages`, `message_status`

## Getting WhatsApp API Credentials

### Step 1: Create Meta Developer Account

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Sign up or log in with your Facebook account
3. Create a new app and select **Business** type

### Step 2: Add WhatsApp Product

1. In your app dashboard, click **Add Product**
2. Find **WhatsApp** and click **Set Up**
3. You'll get a **Test Phone Number** (temporary)

### Step 3: Get Your Credentials

- **Phone Number ID**: Found in WhatsApp > API Setup > Phone Number ID
- **Access Token**: Found in WhatsApp > API Setup > Temporary Access Token
  - For production, create a permanent token in Business Settings
- **Channel ID**: Create a channel in [WhatsApp Business Manager](https://business.whatsapp.com/)

## Usage

### Testing 1:1 Messaging

1. Open `http://localhost:3001`
2. In the **1:1 Messaging** section:
   - Enter phone number with country code (e.g., `919876543210`)
   - Type your message
   - Click **Send Message**

### Testing Broadcasts

1. In the **Broadcast Messages** section:
   - Select a template
   - Enter phone numbers (one per line)
   - Check the opt-in confirmation checkbox
   - Click **Send Broadcast**

**Important**: Only send broadcasts to users who have **opted in** to receive messages. This is required by WhatsApp's policies.

### Testing Channel Updates

1. In the **Channel Updates** section:
   - Type your announcement
   - Click **Post Channel Update**

**Note**: You must have a WhatsApp Channel created and its ID configured in your `.env` file.

## API Endpoints

### Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/whatsapp/health` | GET | Health check |
| `/whatsapp/send` | POST | Send 1:1 message |
| `/whatsapp/broadcast` | POST | Send broadcast message |
| `/whatsapp/channel` | POST | Post channel update |
| `/webhook` | GET | Webhook verification |
| `/webhook` | POST | Receive WhatsApp events |

### Example API Requests

**Send 1:1 Message:**
```bash
curl -X POST http://localhost:3000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "919876543210",
    "message": "Hello from Gamyo!"
  }'
```

**Send Broadcast:**
```bash
curl -X POST http://localhost:3000/whatsapp/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "templateName": "diwali_offer",
    "contacts": ["919876543210", "918765432109"]
  }'
```

**Post Channel Update:**
```bash
curl -X POST http://localhost:3000/whatsapp/channel \
  -H "Content-Type: application/json" \
  -d '{
    "message": "New product launch tomorrow!"
  }'
```

## Database Schema

### Tables

**contacts**
- `id`: Primary key
- `phone`: Phone number (unique)
- `name`: Contact name
- `optedIn`: Opt-in status
- `createdAt`, `updatedAt`: Timestamps

**templates**
- `id`: Primary key
- `name`: Template name (unique)
- `content`: Template content
- `language`: Language code (default: en_US)
- `status`: Approval status
- `createdAt`, `updatedAt`: Timestamps

**sent_messages**
- `id`: Primary key
- `phone`: Recipient phone
- `message`: Message content
- `whatsappMessageId`: WhatsApp's message ID
- `status`: Message status (pending, sent, delivered, read, failed)
- `errorMessage`: Error details (if failed)
- `messageType`: Type (text, template, channel)
- `templateName`: Template name (if applicable)
- `createdAt`: Timestamp

## Troubleshooting

### Issue: 401 Unauthorized

**Solution**: Verify your `ACCESS_TOKEN` and `PHONE_NUMBER_ID` in `backend/.env`

### Issue: Webhook not receiving events

**Solution**: 
- Check ngrok is running
- Verify webhook URL in Meta Developer Portal
- Check `WHATSAPP_WEBHOOK_VERIFY_TOKEN` matches

### Issue: PostgreSQL connection error

**Solution**: 
- Ensure Docker is running: `docker-compose up -d`
- Check database credentials in `.env`
- Verify PostgreSQL is accessible on port 5432

### Issue: Rate limit errors

**Solution**: The broadcast service includes 1-second delays between messages. For large broadcasts, consider implementing a queue system.

### Issue: Template rejection

**Solution**: WhatsApp templates must be approved before use. Submit templates in [Meta Business Manager](https://business.facebook.com/wa/manage/message-templates/).

### Issue: CORS errors in frontend

**Solution**: Backend is configured to allow `http://localhost:3001`. If using a different port, update `main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:YOUR_PORT',
  credentials: true,
});
```

## WhatsApp Business API Limits

### Free Tier (Test Mode)
- 1,000 conversations per month
- 250 messages per day
- Limited to 5 phone numbers

### Paid Plans
- Conversations-based pricing
- Higher rate limits
- Production phone numbers

For details, see [WhatsApp Business Pricing](https://developers.facebook.com/docs/whatsapp/pricing)

## Important Notes

### Compliance
- **Opt-in Required**: Only message users who have opted in
- **24-Hour Window**: After user messages you, you have 24 hours to respond freely
- **Templates Required**: Outside the 24-hour window, use approved templates
- **No Spam**: Follow WhatsApp's policies to avoid account suspension

### Status Posts
- **Not Supported**: WhatsApp Business API doesn't support Status posts
- **Alternative**: Use Channels for broadcast announcements

### Production Considerations
- Replace test phone number with a verified business number
- Use permanent access tokens (not temporary ones)
- Implement proper error handling and retry logic
- Set up monitoring and logging
- Use environment-specific configurations
- Implement rate limiting and queue systems for large broadcasts

## Project Structure

```
gamyo-whatsapp-prototype/
├── backend/
│   ├── src/
│   │   ├── whatsapp/
│   │   │   ├── entities/          # Database entities
│   │   │   ├── dto/               # Data transfer objects
│   │   │   ├── services/          # Business logic
│   │   │   ├── controllers/       # API endpoints
│   │   │   └── whatsapp.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Next Steps

1. **Replace Credentials**: Update `.env` with your actual Meta credentials
2. **Test with Real Numbers**: Test with opted-in phone numbers
3. **Create Templates**: Submit templates in Meta Business Manager
4. **Add Features**: 
   - Contact management UI
   - Template management
   - Message history viewer
   - Analytics dashboard
5. **Deploy**: Deploy to production (Vercel, Railway, AWS, etc.)

## Additional Resources

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Developer Portal](https://developers.facebook.com/)
- [WhatsApp Business Manager](https://business.whatsapp.com/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)

## License

MIT License - Feel free to use this prototype for your projects!

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review WhatsApp API documentation
3. Check Meta Developer Community forums

---

**Happy Building!** 🚀

Built with ❤️ for Gamyo.ai

