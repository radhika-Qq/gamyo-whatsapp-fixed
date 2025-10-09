# Quick Start Guide - 5 Minutes Setup

Get your WhatsApp integration running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be v18+
docker --version  # Should be installed
```

## Step 1: Start Database (30 seconds)

```bash
docker-compose up -d
```

## Step 2: Configure Backend (1 minute)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your credentials:
- Get them from: https://developers.facebook.com/apps (WhatsApp > API Setup)

```env
WHATSAPP_PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID
WHATSAPP_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
```

## Step 3: Start Backend (2 minutes)

```bash
npm install
npm run start:dev
```

Wait for: `🚀 Application is running on: http://localhost:3000`

## Step 4: Start Frontend (2 minutes)

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Browser opens automatically at `http://localhost:3001`

## Step 5: Test It!

1. Enter your phone number (e.g., `919876543210`)
2. Type a message
3. Click **Send Message**
4. Check your WhatsApp!

## That's It! 🎉

You're now running WhatsApp Business API integration locally!

## Next Steps

- **Setup Webhook**: See [SETUP_GUIDE.md](SETUP_GUIDE.md#part-5-webhook-setup)
- **Test Broadcasts**: Add multiple numbers
- **Create Channel**: See [SETUP_GUIDE.md](SETUP_GUIDE.md#part-3-create-whatsapp-channel)

## Common Issues

### "Can't connect to database"
```bash
docker-compose down
docker-compose up -d
```

### "401 Unauthorized"
- Check your `WHATSAPP_ACCESS_TOKEN` in `backend/.env`
- Token might be expired (get a new one)

### "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## Get Help

- Full setup guide: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Detailed docs: [README.md](README.md)
- WhatsApp API docs: https://developers.facebook.com/docs/whatsapp

