# WhatsApp Business API Setup Guide

This guide will walk you through setting up your WhatsApp Business API integration from scratch.

## Part 1: Meta Developer Account Setup

### Step 1: Create Meta Developer Account

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. Click **Get Started** in the top right
3. Log in with your Facebook account (or create one)
4. Complete the registration process

### Step 2: Create a Business App

1. In the Meta Developer dashboard, click **My Apps**
2. Click **Create App**
3. Select **Business** as the app type
4. Fill in the app details:
   - **App Name**: Gamyo WhatsApp Integration
   - **App Contact Email**: your-email@example.com
   - **Business Account**: Create new or select existing
5. Click **Create App**

### Step 3: Add WhatsApp Product

1. In your app dashboard, find **Add Products to Your App**
2. Locate **WhatsApp** and click **Set up**
3. You'll be taken to the WhatsApp setup page

## Part 2: WhatsApp Business API Configuration

### Step 1: Get Test Credentials

On the WhatsApp setup page, you'll see:

1. **From Phone Number ID** - Copy this (needed for `.env`)
2. **To** - Add your phone number here to test
3. **Temporary Access Token** - Click to copy (needed for `.env`)

### Step 2: Test the Connection

1. Click **Send Message** on the setup page
2. You should receive a test message on your phone
3. If successful, your phone number is verified!

### Step 3: Get Permanent Access Token (Production)

For production use, create a permanent token:

1. Go to **Business Settings** (left sidebar)
2. Navigate to **System Users**
3. Click **Add** to create a new system user
4. Assign the user to your WhatsApp app
5. Click **Generate New Token**
6. Select permissions:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
7. Copy and save the token securely

## Part 3: Create WhatsApp Channel (Optional)

### Step 1: Create Channel

1. Go to [business.whatsapp.com](https://business.whatsapp.com/)
2. Log in with your business account
3. Navigate to **Channels**
4. Click **Create Channel**
5. Follow the setup wizard:
   - Choose channel name
   - Add description
   - Set up profile picture

### Step 2: Get Channel ID

1. Once created, go to Channel Settings
2. Look for the **Channel ID** (usually starts with numbers)
3. Copy this ID for your `.env` file

## Part 4: Backend Configuration

### Step 1: Create .env File

In the `backend/` directory, create a `.env` file:

```bash
cd backend
cp .env.example .env
```

### Step 2: Update .env with Your Credentials

Open `backend/.env` and update:

```env
# WhatsApp API URL (use v18.0 or latest)
WHATSAPP_API_URL=https://graph.facebook.com/v18.0

# Phone Number ID from Meta Dashboard
WHATSAPP_PHONE_NUMBER_ID=123456789012345

# Access Token (temporary for testing, permanent for production)
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxx

# Channel ID (if you created a channel)
WHATSAPP_CHANNEL_ID=1234567890123456

# Custom token for webhook verification (choose any secure string)
WHATSAPP_WEBHOOK_VERIFY_TOKEN=my_secure_verify_token_123

# Database Configuration (default for Docker)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp

# Server Port
PORT=3000
```

### Step 3: Secure Your Token

**Important**: Never commit `.env` to Git! It's already in `.gitignore`.

## Part 5: Webhook Setup

### Step 1: Install ngrok

```bash
# Windows (using chocolatey)
choco install ngrok

# macOS
brew install ngrok

# Linux
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok
```

### Step 2: Authenticate ngrok (Optional but Recommended)

1. Sign up at [ngrok.com](https://ngrok.com/)
2. Get your authtoken from the dashboard
3. Run:
```bash
ngrok authtoken YOUR_AUTH_TOKEN
```

### Step 3: Start ngrok

```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 4: Configure Webhook in Meta

1. Go to your app in Meta Developer Dashboard
2. Navigate to **WhatsApp > Configuration**
3. Find the **Webhook** section
4. Click **Edit**
5. Enter:
   - **Callback URL**: `https://abc123.ngrok.io/webhook`
   - **Verify Token**: The value from `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in your `.env`
6. Click **Verify and Save**

### Step 5: Subscribe to Webhook Events

1. In the Webhook section, click **Manage**
2. Subscribe to:
   - ✅ `messages` - Receive incoming messages
   - ✅ `message_status` - Get delivery/read receipts
3. Click **Subscribe**

## Part 6: Database Setup

### Option A: Using Docker (Recommended)

```bash
# Make sure Docker is running
docker --version

# Start PostgreSQL
docker-compose up -d

# Verify it's running
docker ps
```

### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE gamyo_whatsapp;

# Exit
\q
```

Update `backend/.env` with your local PostgreSQL credentials.

## Part 7: Start the Application

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Start Backend Server

```bash
npm run start:dev
```

You should see:
```
🚀 Application is running on: http://localhost:3000
```

### Step 3: Test Backend Health

Open a new terminal:
```bash
curl http://localhost:3000/whatsapp/health
```

Expected response:
```json
{"status":"ok","message":"WhatsApp API is running"}
```

### Step 4: Install Frontend Dependencies

In a new terminal:
```bash
cd frontend
npm install
```

### Step 5: Start Frontend

```bash
npm start
```

Frontend will open automatically at `http://localhost:3001`

## Part 8: Testing

### Test 1: Send 1:1 Message

1. Open `http://localhost:3001`
2. In the **1:1 Messaging** section:
   - Enter your phone number (with country code, e.g., `919876543210`)
   - Type: "Hello, this is a test!"
   - Click **Send Message**
3. Check your WhatsApp - you should receive the message

### Test 2: Webhook (Receive Messages)

1. Send a WhatsApp message to your test number
2. Check your backend terminal - you should see webhook logs:
```
Webhook event received: {...}
Received message from 919876543210: Hello!
```

### Test 3: Broadcast (if you have multiple test numbers)

1. In the **Broadcast Messages** section:
   - Select a template
   - Enter multiple phone numbers (one per line)
   - Check the opt-in confirmation
   - Click **Send Broadcast**
2. All numbers should receive the message

### Test 4: Channel Update (if you set up a channel)

1. In the **Channel Updates** section:
   - Type: "Welcome to our channel!"
   - Click **Post Channel Update**
2. Check your WhatsApp Channel - the update should appear

## Part 9: Create Message Templates (Production)

For production use outside the 24-hour messaging window, you need approved templates.

### Step 1: Go to Business Manager

1. Visit [business.facebook.com/wa/manage/message-templates](https://business.facebook.com/wa/manage/message-templates)
2. Select your WhatsApp Business Account

### Step 2: Create Template

1. Click **Create Template**
2. Fill in:
   - **Category**: Choose appropriate (Marketing, Utility, Authentication)
   - **Name**: `diwali_offer` (lowercase, underscores only)
   - **Language**: English (US)
   - **Header**: Optional (text, image, video, or document)
   - **Body**: Your message content
     - Example: "🎉 Special Diwali offer! Get {{1}} off on all products. Use code {{2}}. Valid until {{3}}."
   - **Footer**: Optional footer text
   - **Buttons**: Optional (Call to action, Quick reply)
3. Click **Submit**

### Step 3: Wait for Approval

- Templates are reviewed by Meta
- Usually approved within 24-48 hours
- Check status in the templates dashboard

### Step 4: Use Template in Code

Once approved, update your broadcast service to use the template:

```typescript
await this.messagingService.sendTemplateMessage(
  phone, 
  'diwali_offer',
  [
    { type: 'text', text: '20%' },      // {{1}}
    { type: 'text', text: 'DIWALI20' }, // {{2}}
    { type: 'text', text: '31st Oct' }  // {{3}}
  ]
);
```

## Troubleshooting

### Issue: "Invalid OAuth access token"

**Solution**: 
- Token expired (temporary tokens last 24 hours)
- Create a permanent token (see Part 2, Step 3)
- Update `WHATSAPP_ACCESS_TOKEN` in `.env`

### Issue: "Phone number not verified"

**Solution**:
- Add your phone number in Meta Dashboard
- Go to WhatsApp > API Setup > To
- Click **Add phone number** and verify with OTP

### Issue: Webhook verification failed

**Solution**:
- Ensure backend is running
- Check ngrok is active
- Verify `WHATSAPP_WEBHOOK_VERIFY_TOKEN` matches in Meta and `.env`
- Check webhook URL format: `https://xxx.ngrok.io/webhook`

### Issue: Messages not sending

**Solution**:
- Check access token is valid
- Verify phone number ID is correct
- Ensure recipient number is in E.164 format (no + or spaces)
- Check rate limits (250 messages/day for test mode)

### Issue: Can't connect to database

**Solution**:
- Verify Docker is running: `docker ps`
- Check database credentials in `.env`
- Ensure port 5432 is not in use by another service

## Next Steps

1. ✅ **Verify Setup**: Test all features
2. ✅ **Create Templates**: Submit templates for approval
3. ✅ **Add Phone Numbers**: Verify business phone numbers
4. ✅ **Security**: Use permanent tokens and secure storage
5. ✅ **Compliance**: Ensure all contacts have opted in
6. ✅ **Deploy**: Move to production hosting

## Production Checklist

Before going live:

- [ ] Replace temporary token with permanent token
- [ ] Use verified business phone number (not test number)
- [ ] All templates approved by Meta
- [ ] Implement opt-in mechanism for users
- [ ] Set up proper error handling and logging
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Secure environment variables
- [ ] Set `synchronize: false` in TypeORM (use migrations)
- [ ] Configure HTTPS for production webhook
- [ ] Review WhatsApp Business policies
- [ ] Test with small user group first

## Support Resources

- **WhatsApp API Docs**: https://developers.facebook.com/docs/whatsapp
- **Meta Business Help**: https://www.facebook.com/business/help
- **Community Forum**: https://developers.facebook.com/community
- **API Status**: https://developers.facebook.com/status/dashboard/

---

**Setup Complete!** 🎉

You're now ready to integrate WhatsApp messaging into your application!

