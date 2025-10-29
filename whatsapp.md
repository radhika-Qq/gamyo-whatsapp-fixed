# 💬 WhatsApp Business API Integration - Complete Guide

## Table of Contents

1. [Overview](#overview)
2. [Quick Start (10 Minutes)](#quick-start-10-minutes)
3. [Prerequisites](#prerequisites)
4. [Architecture](#architecture)
5. [Installation & Setup](#installation--setup)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Frontend Integration](#frontend-integration)
8. [Webhook Configuration](#webhook-configuration)
9. [Database Schema](#database-schema)
10. [Testing Guide](#testing-guide)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)
13. [Rate Limits & Pricing](#rate-limits--pricing)
14. [Resources](#resources)

---

## Overview

The WhatsApp Business API integration enables your Gamyo application to send messages, broadcasts, and channel updates through WhatsApp using Meta's Graph API v18.0.

### ✅ Features

✅ **1:1 Messaging** - Send individual messages to WhatsApp users  
✅ **Broadcast Messaging** - Send template messages to multiple contacts  
✅ **Channel Updates** - Post updates to your WhatsApp Channel  
✅ **Webhook Events** - Receive incoming messages and delivery status updates  
✅ **Message Logging** - Track all sent messages in database  
✅ **Error Handling** - Comprehensive error tracking and retry logic  
✅ **Rate Limiting** - Built-in delays to respect API limits  
✅ **Template Support** - Send pre-approved message templates  

### 🎯 What You Can Do Now

#### Messaging
✅ Send text messages to individual users  
✅ Send template messages (pre-approved by Meta)  
✅ Broadcast to multiple contacts simultaneously  
✅ Post updates to WhatsApp Channels  
✅ Send media (images, videos) via channels  

#### Tracking & Analytics
✅ Log all sent messages  
✅ Track message status (pending, sent, delivered, read, failed)  
✅ Store delivery timestamps  
✅ Monitor failed messages with error details  
✅ Batch processing with success/failure reporting  

#### Webhooks
✅ Receive incoming messages  
✅ Get message delivery status updates  
✅ Handle read receipts  
✅ Process contact information  

---

## Quick Start (10 Minutes)

### Prerequisites Checklist

- [ ] Meta Developer Account
- [ ] WhatsApp Business Phone Number
- [ ] Meta Business verification
- [ ] Test phone number for receiving messages

---

### Step 1: Create Meta App (3 minutes)

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** as the app type
4. Fill in your app details and create the app
5. Click **"Add Product"** and add **"WhatsApp"**

---

### Step 2: Get API Credentials (3 minutes)

1. In WhatsApp product settings, find:
   - **Phone Number ID** (from "From" section)
   - **Temporary Access Token** (24-hour token)
   - **WhatsApp Business Account ID**

2. For production, create a **System User Token** (never expires):
   - Go to Business Settings → System Users
   - Create system user
   - Generate token with `whatsapp_business_messaging` permission

3. Add test phone number:
   - Go to API Setup → "To" section
   - Click "Add phone number"
   - Enter your phone and verify with OTP

---

### Step 3: Get Channel ID (Optional, 1 minute)

If using WhatsApp Channels:
1. Create a channel in WhatsApp
2. Go to Channel Settings → Details
3. Copy the Channel ID from the URL

---

### Step 4: Configure Environment (1 minute)

Create/update `backend/.env`:

```env
# WhatsApp API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_CHANNEL_ID=your_channel_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token_12345

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp
```

---

### Step 5: Start Services (2 minutes)

```bash
# Start database
docker-compose up -d

# Start backend
cd backend
npm install
npm run start:dev

# Start frontend (new terminal)
cd frontend
npm install
npm start
```

✅ Open `http://localhost:3001` → Try sending a message!

---

### Quick Test (30 seconds)

```bash
curl -X POST http://localhost:3000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "919876543210",
    "message": "Hello from Gamyo! 🚀"
  }'
```

**Expected:** Message delivered to your WhatsApp

---

## Prerequisites

### 1. Meta Developer Account

**Create Account:**
1. Go to https://developers.facebook.com/
2. Sign up with your Facebook account
3. Complete developer registration

### 2. WhatsApp Business Account

**Requirements:**
- Active business (can be personal business)
- Facebook Business Manager account
- Business verification (for production)
- Phone number (not previously used with WhatsApp)

### 3. WhatsApp Business Phone Number

**Get Phone Number:**
- **Option A:** Use Meta's test number (limited)
- **Option B:** Buy new number from phone provider
- **Option C:** Port existing business number

**Important:** 
- Number cannot be registered on regular WhatsApp
- Must be dedicated to WhatsApp Business API
- Supports SMS for 2FA verification

### 4. Business Verification

**For Production:**
- Required for higher message limits
- Verify business identity with Meta
- Provide business documents
- Can take 1-3 weeks for approval

**Test Mode:**
- No verification needed
- Limited to 5 test numbers
- 1,000 conversations/month
- Perfect for development

---

## Architecture

### Backend Structure

```
backend/src/whatsapp/
├── whatsapp.module.ts              # Module configuration
├── controllers/
│   ├── whatsapp.controller.ts      # Main API endpoints (4 endpoints)
│   └── webhook.controller.ts       # Webhook verification & events
├── services/
│   ├── messaging.service.ts        # 1:1 messaging logic
│   ├── broadcast.service.ts        # Bulk messaging logic
│   └── channel.service.ts          # Channel updates logic
├── dto/
│   ├── send-message.dto.ts         # Message validation
│   ├── send-broadcast.dto.ts       # Broadcast validation
│   └── send-channel.dto.ts         # Channel validation
└── entities/
    ├── sent-message.entity.ts      # Message tracking
    ├── contact.entity.ts           # Contact management
    └── template.entity.ts          # Template storage
```

### Frontend Structure

```
frontend/src/components/
├── MessageComposer.tsx             # 1:1 messaging UI
├── BroadcastComposer.tsx           # Broadcast messaging UI
└── ChannelManager.tsx              # Channel updates UI
```

### Technology Stack

```
┌─────────────────────────────────────┐
│         React Frontend              │
│  (Message/Broadcast/Channel)        │
└──────────────┬──────────────────────┘
               │ HTTP/REST
               ▼
┌─────────────────────────────────────┐
│      NestJS Backend                 │
│  ┌──────────────────────────────┐   │
│  │  WhatsappController          │   │
│  │  (4 REST endpoints)          │   │
│  │  WebhookController           │   │
│  │  (2 webhook endpoints)       │   │
│  └──────────┬───────────────────┘   │
│             ▼                        │
│  ┌──────────────────────────────┐   │
│  │  MessagingService            │   │
│  │  BroadcastService            │   │
│  │  ChannelService              │   │
│  └──────────┬───────────────────┘   │
│             ▼                        │
│  ┌──────────────────────────────┐   │
│  │  PostgreSQL Database         │   │
│  │  (Message logging)           │   │
│  └──────────────────────────────┘   │
└─────────────┼───────────────────────┘
              │ HTTPS
              ▼
┌─────────────────────────────────────┐
│    Meta Graph API v18.0             │
│  (WhatsApp Business API)            │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│    WhatsApp Platform                │
│  (User's WhatsApp App)              │
└─────────────────────────────────────┘
```

### Consistent Design Pattern

Your WhatsApp module follows the **same architecture** as other platforms:

```
✅ Facebook    → Module + Service + Controller + DTOs
✅ LinkedIn    → Module + Service + Controller + DTOs  
✅ Instagram   → Module + Service + Controller + DTOs
✅ WhatsApp    → Module + Service + Controller + DTOs
```

---

## Installation & Setup

### Step 1: Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd gamyo.ai-wab-integration-trail

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Database Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Database will be created automatically
# Tables: sent_messages, contacts, templates
```

### Step 3: Environment Configuration

Create `backend/.env`:

```env
# WhatsApp API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAABwz...XYZ123
WHATSAPP_CHANNEL_ID=120363...@newsletter
WHATSAPP_WEBHOOK_VERIFY_TOKEN=my_custom_token_12345

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp

# Server Configuration
PORT=3000
```

### Step 4: Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm start
```

**Verify:**
- Backend: http://localhost:3000/whatsapp/health
- Frontend: http://localhost:3001

---

## API Endpoints Reference

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/whatsapp/health` | Service health check |
| `POST` | `/whatsapp/send` | Send 1:1 message |
| `POST` | `/whatsapp/broadcast` | Send broadcast to multiple contacts |
| `POST` | `/whatsapp/channel` | Post channel update |
| `GET` | `/webhook` | Webhook verification (Meta requirement) |
| `POST` | `/webhook` | Receive webhook events |

---

### 1. Health Check

**Endpoint:** `GET /whatsapp/health`

**Description:** Verify the WhatsApp service is running

**Response:**
```json
{
  "status": "ok",
  "message": "WhatsApp API is running"
}
```

**cURL Example:**
```bash
curl http://localhost:3000/whatsapp/health
```

✅ **Pass**: Returns status "ok"  
❌ **Fail**: Connection error

---

### 2. Send 1:1 Message

**Endpoint:** `POST /whatsapp/send`

**Description:** Send a message to a single WhatsApp user

**Request Body:**
```json
{
  "phone": "919876543210",
  "message": "Hello from Gamyo! 🚀"
}
```

**Validation Rules:**
- `phone`: Required, string, 10-15 digits (with country code)
- `message`: Required, string, min 1 character

**Response:**
```json
{
  "messages": [
    {
      "id": "wamid.HBgNOTE5ODc2NTQzMjEwFQIAERgSQzc4NzFBNjA4QUMxRkU5OUFB"
    }
  ],
  "contacts": [
    {
      "input": "919876543210",
      "wa_id": "919876543210"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Message sent successfully
- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

**cURL Example:**
```bash
curl -X POST http://localhost:3000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "919876543210",
    "message": "Hello from Gamyo!"
  }'
```

**Database Logging:**
- Message stored in `sent_messages` table
- Status tracked (pending → sent → delivered → read)
- WhatsApp message ID saved for tracking

---

### 3. Send Broadcast Message

**Endpoint:** `POST /whatsapp/broadcast`

**Description:** Send a template message to multiple contacts

**Request Body:**
```json
{
  "templateName": "hello_world",
  "contacts": [
    "919876543210",
    "918765432109",
    "917654321098"
  ]
}
```

**Validation Rules:**
- `templateName`: Required, string, must match Meta-approved template
- `contacts`: Required, array of phone numbers (10-15 digits each)

**Response:**
```json
{
  "total": 3,
  "successful": 3,
  "failed": 0,
  "errors": []
}
```

**Features:**
- **Batch Processing:** Processes 250 contacts per batch
- **Rate Limiting:** 1 second delay between messages
- **Error Tracking:** Failed messages logged with reasons
- **Success Reporting:** Detailed results per contact

**cURL Example:**
```bash
curl -X POST http://localhost:3000/whatsapp/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "templateName": "hello_world",
    "contacts": ["919876543210", "918765432109"]
  }'
```

**Important Notes:**
- Only use Meta-approved message templates
- Test mode limited to 250 messages/day
- Production allows 10,000+ messages/day (with verification)

---

### 4. Post Channel Update

**Endpoint:** `POST /whatsapp/channel`

**Description:** Post an update to your WhatsApp Channel

**Request Body:**
```json
{
  "message": "🎉 New product launch tomorrow! Stay tuned!"
}
```

**Validation Rules:**
- `message`: Required, string, max 1,024 characters

**Response:**
```json
{
  "messages": [
    {
      "id": "wamid.HBgNMTIwMzYzM..."
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/whatsapp/channel \
  -H "Content-Type: application/json" \
  -d '{
    "message": "New product launch tomorrow!"
  }'
```

**Channel Requirements:**
- Must have WhatsApp Channel created
- Need Channel ID from WhatsApp settings
- Channel must be active
- Admins can post updates

---

### 5. Send Channel Media

**Method:** POST (via ChannelService)

**Description:** Post media (image) to WhatsApp Channel

**Parameters:**
- `mediaUrl`: string (publicly accessible URL)
- `caption`: string (optional)

**Example Code:**
```typescript
await channelService.sendChannelMedia(
  'https://example.com/image.jpg',
  'Check out our new product! 🚀'
);
```

**Supported Media:**
- Images: JPG, PNG (max 5MB)
- Videos: MP4 (max 16MB)
- Documents: PDF, DOCX (max 100MB)

---

## Frontend Integration

### Component Features

#### MessageComposer Component
- 📱 Phone number input with validation
- ✍️ Message textarea
- 📤 Send button with loading state
- ✅ Success/error feedback
- 📊 Message history display

#### BroadcastComposer Component
- 📋 Template name selection
- 👥 Contact list management
- ➕ Add multiple contacts
- 🗑️ Remove contacts
- 📊 Broadcast results tracking

#### ChannelManager Component
- 📢 Channel message composer
- 🖼️ Media upload for channels
- 📝 Caption editor
- 📤 Post to channel button
- 📊 Post status tracking

### Using the Frontend

#### 1:1 Messaging
1. Open `http://localhost:3001`
2. Navigate to **"1:1 Messaging"** tab
3. Enter phone number (e.g., `919876543210`)
4. Type your message
5. Click **"Send Message"**
6. Check recipient's WhatsApp

#### Broadcast Messaging
1. Go to **"Broadcast"** tab
2. Select approved template
3. Add contact phone numbers
4. Click **"Send Broadcast"**
5. View success/failure report

#### Channel Updates
1. Go to **"Channel"** tab
2. Type your update message
3. (Optional) Add media URL
4. Click **"Post to Channel"**
5. Verify in WhatsApp Channel

---

## Webhook Configuration

### Why Webhooks?

Webhooks allow you to:
- Receive incoming messages from users
- Get delivery status updates (sent, delivered, read)
- Handle message failures
- Process user replies
- Auto-respond to messages

### Step 1: Expose Local Server

**Option A: ngrok (Recommended for development)**
```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Option B: Deploy to cloud** (for production)
- Deploy to Heroku, AWS, DigitalOcean, etc.
- Ensure HTTPS is enabled
- Use your production domain

### Step 2: Configure Webhook in Meta

1. Go to WhatsApp Product Configuration
2. Click "Configuration" in sidebar
3. Find "Webhook" section
4. Click "Edit"

**Webhook Settings:**
- **Callback URL:** `https://your-domain.com/webhook`
- **Verify Token:** Your custom token (match `.env` value)

**Example:**
- Callback URL: `https://abc123.ngrok.io/webhook`
- Verify Token: `my_custom_token_12345`

5. Click "Verify and Save"
6. Subscribe to webhook fields:
   - ✅ messages
   - ✅ message_status_updates

### Step 3: Test Webhook

**Verify Endpoint:**
```bash
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=my_custom_token_12345"
```

**Expected:** Returns `test123`

**Send Test Message:**
- Send message to your WhatsApp Business number
- Check backend logs for incoming webhook event

### Webhook Event Types

#### Incoming Message Event
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "field": "messages",
      "value": {
        "messages": [{
          "from": "919876543210",
          "id": "wamid.HBgN...",
          "timestamp": "1699887600",
          "type": "text",
          "text": {
            "body": "Hello!"
          }
        }]
      }
    }]
  }]
}
```

#### Message Status Update
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "field": "messages",
      "value": {
        "statuses": [{
          "id": "wamid.HBgN...",
          "status": "delivered",
          "timestamp": "1699887660",
          "recipient_id": "919876543210"
        }]
      }
    }]
  }]
}
```

### Handling Webhook Events

The `WebhookController` automatically handles:
- ✅ Message verification (GET request)
- ✅ Incoming messages (POST request)
- ✅ Status updates (delivered, read, failed)
- ✅ Contact information extraction
- ✅ Event logging

**Extend webhook handler:**
```typescript
// In webhook.controller.ts
private async handleMessageEvent(value: any) {
  const { messages } = value;
  
  if (messages) {
    for (const message of messages) {
      // Auto-reply logic
      if (message.text?.body?.toLowerCase() === 'hello') {
        await this.messagingService.sendMessage(
          message.from,
          'Hi! How can I help you today?'
        );
      }
      
      // Store in database
      // Trigger notifications
      // Update CRM
    }
  }
}
```

---

## Database Schema

### Tables Overview

#### 1. sent_messages Table

**Purpose:** Track all sent WhatsApp messages

**Schema:**
```typescript
{
  id: number (Primary Key, Auto-increment),
  phone: string (Required, 10-15 digits),
  message: string (Required),
  whatsappMessageId: string (Nullable, from Meta API),
  status: string (pending/sent/delivered/read/failed),
  errorMessage: string (Nullable),
  messageType: string (text/template/channel),
  templateName: string (Nullable),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```sql
CREATE INDEX idx_sent_messages_phone ON sent_messages(phone);
CREATE INDEX idx_sent_messages_status ON sent_messages(status);
CREATE INDEX idx_sent_messages_created ON sent_messages(createdAt DESC);
```

**Query Examples:**
```typescript
// Get all messages for a phone number
const messages = await sentMessageRepository.find({
  where: { phone: '919876543210' },
  order: { createdAt: 'DESC' }
});

// Get failed messages
const failed = await sentMessageRepository.find({
  where: { status: 'failed' }
});

// Count messages by status
const stats = await sentMessageRepository
  .createQueryBuilder('msg')
  .select('status, COUNT(*) as count')
  .groupBy('status')
  .getRawMany();
```

#### 2. contacts Table

**Purpose:** Store contact information

**Schema:**
```typescript
{
  id: number (Primary Key),
  phone: string (Unique, Required),
  name: string (Nullable),
  optedIn: boolean (Default: false),
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. templates Table

**Purpose:** Store Meta-approved message templates

**Schema:**
```typescript
{
  id: number (Primary Key),
  name: string (Unique, Required),
  language: string (Default: 'en_US'),
  status: string (pending/approved/rejected),
  content: string,
  createdAt: Date
}
```

### Message Status Flow

```
pending → sent → delivered → read
   ↓
failed (with errorMessage)
```

---

## Testing Guide

### ✅ Pre-Testing Requirements

Before you begin testing, ensure you have:

- [x] Meta Developer Account created
- [x] WhatsApp Business API access
- [x] Phone Number ID and Access Token
- [x] Test phone number added and verified
- [x] Environment variables configured in `.env`
- [x] Database running (PostgreSQL)
- [x] Backend running on `http://localhost:3000`
- [x] Frontend running on `http://localhost:3001`

---

### Test 1: Health Check

**Purpose:** Verify the WhatsApp service is running

```bash
curl http://localhost:3000/whatsapp/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "WhatsApp API is running"
}
```

✅ **Pass**: Returns status "ok"  
❌ **Fail**: Connection error or no response

---

### Test 2: Send 1:1 Message

**Purpose:** Test sending a message to your test number

```bash
curl -X POST http://localhost:3000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "YOUR_TEST_PHONE_NUMBER",
    "message": "Test message from Gamyo!"
  }'
```

**Expected Response:**
```json
{
  "messages": [{
    "id": "wamid.HBgN..."
  }],
  "contacts": [{
    "input": "YOUR_TEST_PHONE_NUMBER",
    "wa_id": "YOUR_TEST_PHONE_NUMBER"
  }]
}
```

**Verification:**
1. Check your test WhatsApp number
2. You should receive the "hello_world" template message
3. Check backend logs for success message
4. Verify database entry in `sent_messages` table

✅ **Pass**: Message received on WhatsApp  
❌ **Fail**: Error response or message not delivered

---

### Test 3: Send Broadcast

**Purpose:** Test broadcast to multiple numbers

```bash
curl -X POST http://localhost:3000/whatsapp/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "templateName": "hello_world",
    "contacts": [
      "YOUR_TEST_PHONE_1",
      "YOUR_TEST_PHONE_2"
    ]
  }'
```

**Expected Response:**
```json
{
  "total": 2,
  "successful": 2,
  "failed": 0,
  "errors": []
}
```

**Verification:**
1. Both phone numbers should receive template message
2. Check database for 2 message entries
3. Verify 1-second delay between messages (rate limiting)

✅ **Pass**: All contacts received messages  
❌ **Fail**: Some contacts failed or no delay between messages

---

### Test 4: Post Channel Update

**Purpose:** Test channel posting (if channel configured)

```bash
curl -X POST http://localhost:3000/whatsapp/channel \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test channel update from API! 🚀"
  }'
```

**Expected Response:**
```json
{
  "messages": [{
    "id": "wamid.HBgN..."
  }]
}
```

**Verification:**
1. Open your WhatsApp Channel
2. Verify the update appears
3. Check database for channel message entry

✅ **Pass**: Update appears in channel  
❌ **Fail**: Error or update not visible

---

### Test 5: Webhook Verification

**Purpose:** Verify webhook endpoint setup

```bash
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.challenge=TEST_CHALLENGE&hub.verify_token=YOUR_VERIFY_TOKEN"
```

**Expected Response:**
```
TEST_CHALLENGE
```

✅ **Pass**: Returns the challenge string  
❌ **Fail**: Returns "Verification failed" or error

---

### Test 6: Frontend UI Testing

#### Test 6.1: Send Message via UI

**Steps:**
1. Open `http://localhost:3001`
2. Go to "1:1 Messaging" tab
3. Enter phone: `YOUR_TEST_PHONE`
4. Enter message: "Testing from UI!"
5. Click "Send Message"

**Verify:**
- Loading indicator appears
- Success message displays
- Message received on WhatsApp
- Message appears in history

✅ **Pass**: Complete workflow works  
❌ **Fail**: Error or message not delivered

#### Test 6.2: Broadcast via UI

**Steps:**
1. Go to "Broadcast" tab
2. Select template name
3. Add 2-3 test numbers
4. Click "Send Broadcast"

**Verify:**
- Progress indicator shows
- Success/failure report displays
- All contacts receive messages
- Results match actual delivery

✅ **Pass**: Broadcast completes successfully  
❌ **Fail**: Messages not sent or incorrect results

---

### Test 7: Database Verification

**Purpose:** Verify message logging

```sql
-- Connect to PostgreSQL
psql -h localhost -U postgres -d gamyo_whatsapp

-- Check sent messages
SELECT * FROM sent_messages ORDER BY "createdAt" DESC LIMIT 10;

-- Check message status distribution
SELECT status, COUNT(*) FROM sent_messages GROUP BY status;

-- Check failed messages
SELECT * FROM sent_messages WHERE status = 'failed';
```

**Verify:**
- Messages are logged correctly
- Status values are accurate
- WhatsApp message IDs are stored
- Timestamps are correct

✅ **Pass**: All data properly logged  
❌ **Fail**: Missing or incorrect data

---

### Test 8: Error Handling

#### Test 8.1: Invalid Phone Number

```bash
curl -X POST http://localhost:3000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "123",
    "message": "Test"
  }'
```

**Expected:** 400 Bad Request error with validation message

#### Test 8.2: Invalid Access Token

**Steps:**
1. Temporarily change `WHATSAPP_ACCESS_TOKEN` in `.env` to invalid value
2. Restart backend
3. Try sending a message

**Expected:** Error about invalid access token

**Remember to restore correct token!**

✅ **Pass**: Errors handled gracefully  
❌ **Fail**: Server crash or unclear errors

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Invalid access token"

**Causes:**
- Token expired (temporary tokens last 24 hours)
- Incorrect token copied
- Token doesn't have required permissions

**Solutions:**
1. Generate new access token from Meta dashboard
2. For production, create System User token (never expires)
3. Verify token has `whatsapp_business_messaging` permission
4. Update `WHATSAPP_ACCESS_TOKEN` in `.env`
5. Restart backend

---

#### Issue: "Phone number not registered"

**Causes:**
- Test phone not added to Meta app
- Phone verification not completed
- Using number registered on regular WhatsApp

**Solutions:**
1. Go to Meta WhatsApp Product → API Setup
2. Add phone number to "To" field
3. Verify with OTP code
4. Ensure number is not on regular WhatsApp
5. Wait 5 minutes after adding number

---

#### Issue: "Unable to send message"

**Causes:**
- Recipient hasn't messaged you first (24-hour window)
- Using custom message instead of template
- Rate limits exceeded

**Solutions:**
1. Use template messages (like "hello_world")
2. Have recipient message you first to open 24-hour window
3. Check rate limits (250 messages/day in test mode)
4. Implement proper rate limiting (1 second delay)

---

#### Issue: "Database connection failed"

**Causes:**
- PostgreSQL not running
- Incorrect database credentials
- Database not created

**Solutions:**
```bash
# Check if PostgreSQL is running
docker ps

# Start database
docker-compose up -d

# Check logs
docker-compose logs postgres

# Verify .env database settings
cat backend/.env | grep DB_
```

---

#### Issue: "Webhook verification failed"

**Causes:**
- Incorrect verify token
- URL not accessible
- Wrong endpoint path

**Solutions:**
1. Verify `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in `.env` matches Meta config
2. Ensure ngrok or public URL is running
3. Test webhook endpoint locally first
4. Check that endpoint is `/webhook` not `/api/webhook`

---

#### Issue: "Template not found"

**Causes:**
- Template not created in Meta
- Template name typo
- Template not approved

**Solutions:**
1. Go to Meta WhatsApp → Message Templates
2. Create template or verify existing one
3. Wait for approval (can take a few hours)
4. Use exact template name in API call
5. Default template "hello_world" is pre-approved

---

#### Issue: "Messages not appearing in database"

**Causes:**
- Database entity not registered
- TypeORM synchronization disabled
- Table creation failed

**Solutions:**
```bash
# Check if tables exist
psql -h localhost -U postgres -d gamyo_whatsapp -c "\dt"

# Enable TypeORM sync in app.module.ts
synchronize: true  # Only for development!

# Restart backend to create tables
npm run start:dev
```

---

## Best Practices

### 1. Message Templates

**Why Use Templates?**
- Required for messages outside 24-hour window
- Pre-approved by Meta
- Faster delivery
- Higher success rate

**Best Practices:**
- Create templates for common use cases
- Use variables for personalization
- Keep templates simple and clear
- Get approval before launch
- Test templates thoroughly

**Example Templates:**
```
Order Confirmation:
"Hi {{1}}, your order #{{2}} has been confirmed. Expected delivery: {{3}}."

Appointment Reminder:
"Hello {{1}}, this is a reminder of your appointment on {{2}} at {{3}}."

OTP Verification:
"Your verification code is {{1}}. Valid for 10 minutes."
```

### 2. Rate Limiting

**Implementation:**
```typescript
// In broadcast.service.ts
for (const phone of batch) {
  await sendMessage(phone, message);
  await delay(1000); // 1 second delay
}
```

**Recommendations:**
- 1 second delay between messages
- Batch processing (250 contacts/batch)
- Implement retry logic for failures
- Monitor API usage

### 3. Error Handling

**Always Log Errors:**
```typescript
try {
  await sendMessage(phone, message);
  // Log success
  await logSuccess(phone, messageId);
} catch (error) {
  // Log failure with details
  await logFailure(phone, error.message);
  // Don't throw, continue with next message
}
```

**Track Failed Messages:**
- Store error messages in database
- Implement retry queue
- Alert on high failure rates
- Review errors daily

### 4. Database Management

**Message Retention:**
```typescript
// Clean old messages (30+ days)
async cleanOldMessages() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  await sentMessageRepository.delete({
    createdAt: LessThan(thirtyDaysAgo),
    status: In(['delivered', 'read'])
  });
}
```

**Regular Backups:**
```bash
# Daily backup script
pg_dump -h localhost -U postgres gamyo_whatsapp > backup_$(date +%Y%m%d).sql
```

### 5. Security

**Token Management:**
- Use System User tokens in production (never expire)
- Rotate tokens every 90 days
- Never commit `.env` to Git
- Use environment-specific tokens

**Webhook Security:**
- Validate webhook signature (if available)
- Use strong verify token
- Implement HTTPS only
- Rate limit webhook endpoint

### 6. Monitoring

**Key Metrics to Track:**
- Message success rate
- Average delivery time
- Failed message count
- API response times
- Daily message volume

**Implementation:**
```typescript
// Daily stats
async getDailyStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return await sentMessageRepository
    .createQueryBuilder('msg')
    .select([
      'COUNT(*) as total',
      'SUM(CASE WHEN status = "sent" THEN 1 ELSE 0 END) as sent',
      'SUM(CASE WHEN status = "failed" THEN 1 ELSE 0 END) as failed'
    ])
    .where('createdAt >= :today', { today })
    .getRawOne();
}
```

### 7. Compliance

**GDPR/Privacy:**
- Store only necessary data
- Implement data deletion requests
- Provide opt-out mechanism
- Secure personal information

**WhatsApp Policies:**
- Don't send spam or promotional messages without opt-in
- Respect 24-hour messaging window
- Use templates for marketing messages
- Don't share user data

---

## Rate Limits & Pricing

### Test Mode (Development)

**Free Tier Limits:**
- **Conversations:** 1,000 free conversations/month
- **Messages:** 250 messages/day
- **Test Numbers:** 5 maximum
- **API Calls:** No specific limit
- **Access Token:** 24-hour temporary tokens

**What Counts as a Conversation:**
- Business-initiated: First message to user (after 24h window)
- User-initiated: User messages you first

### Production Mode (After Verification)

**Tier 1 (Default):**
- **Messages:** 1,000 messages/day
- **Scaling:** Increases automatically based on quality
- **Cost:** Varies by country ($0.005-0.10 per conversation)

**Tier 2+ (Auto-scaled):**
- **Messages:** 10,000+ messages/day
- **Unlimited conversations:** Based on usage
- **Priority support:** Available

**Rate Limiting Guidelines:**
- Throughput: 80 messages/second (business-initiated)
- Burst: 200 messages/second (short bursts)
- Recommended: 1 message/second for broadcasts

### Pricing (USD)

**Conversation-based pricing** (first 1,000 free/month):

| Region | Marketing | Utility | Authentication | Service |
|--------|-----------|---------|----------------|---------|
| India | $0.0088 | $0.0042 | $0.0035 | $0.0088 |
| US | $0.0255 | $0.0175 | $0.0085 | $0.0240 |
| Brazil | $0.0750 | $0.0440 | $0.0210 | $0.0550 |
| Others | Check Meta pricing page | | | |

**Conversation Types:**
- **Marketing:** Promotional messages
- **Utility:** Account updates, order status
- **Authentication:** OTP, verification codes
- **Service:** Customer support responses

### Cost Optimization Tips

1. **Use Templates Wisely:**
   - Utility templates cost less than marketing
   - Authentication templates are cheapest

2. **Respond Within 24 Hours:**
   - User-initiated conversations are free
   - Reply within 24-hour window

3. **Batch Messages:**
   - Send updates in single message vs multiple
   - Combine notifications where possible

4. **Monitor Usage:**
   - Track conversation types
   - Analyze cost per customer
   - Optimize message frequency

---

## Resources

### Official Documentation

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp/)
- [Cloud API Quick Start](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates/)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Pricing](https://developers.facebook.com/docs/whatsapp/pricing)

### Tools

- [Meta for Developers](https://developers.facebook.com/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [WhatsApp Manager](https://business.facebook.com/wa/manage/)
- [API Test Console](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages)

### Community

- [WhatsApp Business Platform Community](https://www.facebook.com/groups/wadevs/)
- [Meta Developers Community](https://developers.facebook.com/community/)
- [Stack Overflow WhatsApp Tag](https://stackoverflow.com/questions/tagged/whatsapp-business-api)

### Support

**For Issues:**
1. Check this troubleshooting guide
2. Review Meta's documentation
3. Test in Meta's API Console
4. Check Meta status page
5. Contact Meta support (business verified accounts)

---

## Platform Comparison

Your system now supports 4 major platforms:

| Platform | Messaging | Posts | Scheduling | Insights | Media | Broadcast |
|----------|-----------|-------|------------|----------|-------|-----------|
| WhatsApp | ✅ | ❌ | ⚠️* | ❌ | ✅ | ✅ |
| LinkedIn | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Facebook | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Instagram | ❌ | ✅ | ⚠️* | ✅ | ✅ | ❌ |

*Scheduling requires custom implementation (job queue)

---

## 🎉 Congratulations!

You've successfully integrated **WhatsApp Business API**! You can now:

✅ Send 1:1 messages to customers  
✅ Broadcast to multiple contacts  
✅ Post updates to WhatsApp Channels  
✅ Receive incoming messages via webhooks  
✅ Track all messages in database  
✅ Handle delivery status updates  
✅ Use pre-approved templates  
✅ Implement rate limiting  

Your Gamyo platform now supports:
- **WhatsApp** - Messaging, Broadcasting & Channels
- **LinkedIn** - Professional content posting
- **Facebook** - Social media with scheduling & insights
- **Instagram** - Visual content with insights

All unified under a single, powerful platform! 🚀

---

**Version:** 1.0.0  
**Last Updated:** October 29, 2025  
**Status:** ✅ Production Ready  
**API Version:** Meta Graph API v18.0

