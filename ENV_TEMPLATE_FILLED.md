# 📝 Your .env File Template (Ready to Fill)

Copy this entire block into your `backend/.env` file, then fill in YOUR credentials:

```env
# WhatsApp Business API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0

# 👇 REPLACE THIS with your Phone Number ID from Meta Dashboard
WHATSAPP_PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID_HERE

# 👇 REPLACE THIS with your Access Token from Meta Dashboard
WHATSAPP_ACCESS_TOKEN=YOUR_ACCESS_TOKEN_HERE

# 👇 OPTIONAL: Only needed if you're using WhatsApp Channels
WHATSAPP_CHANNEL_ID=your_channel_id_here

# 👇 This is YOUR custom token - you can keep this or change it to anything you want
WHATSAPP_WEBHOOK_VERIFY_TOKEN=gamyo_webhook_verify_token_2024

# Database Configuration (keep these as-is for Docker)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp

# Server Configuration (keep as-is)
PORT=3000
NODE_ENV=development
```

---

## ✅ What to Replace:

### Required (You have these from Meta):
1. **WHATSAPP_PHONE_NUMBER_ID** ← Replace with YOUR Phone Number ID
2. **WHATSAPP_ACCESS_TOKEN** ← Replace with YOUR Access Token

### Optional:
3. **WHATSAPP_WEBHOOK_VERIFY_TOKEN** ← Already set! You can keep `gamyo_webhook_verify_token_2024` or change it to anything

### Keep as-is:
- All database settings (they match Docker Compose)
- WHATSAPP_API_URL
- PORT
- NODE_ENV

---

## 📋 Example with Fake Credentials:

Here's what it looks like when filled in (with example values):

```env
# WhatsApp Business API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAABsbCS1iHgBO7ZCvLzHqpQz9x8YRgEZAu2
WHATSAPP_CHANNEL_ID=your_channel_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=gamyo_webhook_verify_token_2024

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## 🎯 Quick Steps:

1. **Open**: `backend/.env` in Notepad or VS Code
2. **Delete**: Everything in the file
3. **Copy**: The template above
4. **Paste**: Into the file
5. **Replace**: Only these 2 lines with YOUR values:
   - `WHATSAPP_PHONE_NUMBER_ID=123456789012345` ← Your real Phone Number ID
   - `WHATSAPP_ACCESS_TOKEN=EAABsbCS1iHgBO7ZCvLzHqpQz9x8YRgEZAu2` ← Your real Access Token
6. **Save**: The file (Ctrl+S)

---

## ⚠️ Important Notes:

### About the Verify Token:
- ✅ You DON'T get this from Meta
- ✅ YOU create it (any secure string)
- ✅ You already have one set: `gamyo_webhook_verify_token_2024`
- ✅ You only need it when setting up webhooks (optional for now)

### For Testing (Without Webhooks):
You don't even need to set up webhooks to start! You can:
- ✅ Send messages (1:1, broadcast, channel)
- ✅ Test the UI
- ✅ See everything work

Webhooks are only needed to **RECEIVE** messages. For **SENDING** messages, you don't need webhooks at all!

---

## 🚀 After Updating .env:

You're ready to start the backend!

```bash
cd backend
npm install
npm run start:dev
```

You should see:
```
🚀 Application is running on: http://localhost:3000
```

---

**Ready to go?** Update those 2 values in your .env and you're good to launch! 🎉


