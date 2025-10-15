# 🚀 GET STARTED - Quick Instructions

## Your Project is READY! Just 3 steps to go:

---

## Step 1️⃣: Get WhatsApp API Credentials (15 min)

### Go to Meta Developer Portal
1. Open: **https://developers.facebook.com/**
2. Click **"Get Started"** → Log in with Facebook
3. Click **"My Apps"** → **"Create App"** → Choose **"Business"**
4. Name your app: `Gamyo WhatsApp`
5. Click **"Create App"**

### Add WhatsApp Product
1. In your app, find **"WhatsApp"** → Click **"Set up"**
2. You'll see the setup page with test credentials

### Copy These 3 Things:
1. **Phone Number ID** - Copy the long number under "From"
2. **Access Token** - Click "Copy" next to "Temporary access token"
3. **Your Phone** - Add your WhatsApp number to test with

📝 **Save these values!** You'll need them in the next step.

---

## Step 2️⃣: Update Your .env File (2 min)

1. Open the file: `backend/.env` in your code editor
2. Replace these 2 lines with YOUR credentials:

```env
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here  ← PASTE YOUR PHONE NUMBER ID
WHATSAPP_ACCESS_TOKEN=your_access_token_here        ← PASTE YOUR ACCESS TOKEN
```

3. **Save the file** (Ctrl+S)

---

## Step 3️⃣: Start Everything (5 min)

### A. Start Database
Open terminal (PowerShell/CMD):
```bash
cd C:\Users\radhi\Desktop\gamyo.ai-wab-integration-trail
docker-compose up -d
```

### B. Start Backend
Open NEW terminal:
```bash
cd C:\Users\radhi\Desktop\gamyo.ai-wab-integration-trail\backend
npm install
npm run start:dev
```

Wait for: `🚀 Application is running on: http://localhost:3000`  
**Keep this terminal open!**

### C. Start Frontend
Open ANOTHER NEW terminal:
```bash
cd C:\Users\radhi\Desktop\gamyo.ai-wab-integration-trail\frontend
npm install
npm start
```

Your browser will open to: **http://localhost:3001**

---

## Step 4️⃣: Send Your First Message! 🎉

1. In the browser at http://localhost:3001
2. Find the **"1:1 Messaging"** section
3. Enter YOUR phone number (format: `919876543210` - no spaces, no +)
4. Type: `Hello from Gamyo! 🚀`
5. Click **"Send Message"**
6. **Check your WhatsApp!** You should receive the message!

---

## ✅ Success!

If you received the message, your WhatsApp API integration is working! 🎊

---

## 📚 What's Next?

- **Detailed Guide**: See `STEP_BY_STEP_SETUP.md` for complete instructions
- **Quick Checklist**: Use `QUICK_CHECKLIST.md` to track your progress
- **Setup Webhooks**: See `SETUP_GUIDE.md` to receive messages
- **Production**: See `README.md` for deployment guide

---

## 🆘 Having Issues?

### "Invalid access token"
→ Your token expired. Get a new one from Meta Dashboard.

### "Can't connect to database"
→ Make sure Docker Desktop is running: Open Docker Desktop app

### Backend won't start
→ Check if something is using port 3000. Try closing other apps.

### Message not sending
→ Check phone number format: `[country code][number]` like `919876543210`

---

## 🎯 What You Have:

✅ **Backend API** - NestJS server with WhatsApp integration  
✅ **Frontend UI** - React app to send messages  
✅ **Database** - PostgreSQL to track messages  
✅ **Documentation** - Complete guides for setup  
✅ **Features**: 1:1 messaging, broadcasts, channels, webhooks

## 🔧 Files You Need to Update:

1. **backend/.env** ← Update with YOUR credentials (THIS IS THE ONLY FILE YOU NEED TO EDIT!)

That's it! Update the .env file and run the commands above.

---

**You're 15 minutes away from sending WhatsApp messages!** 🚀

Need help? Check the detailed guides:
- 📖 **STEP_BY_STEP_SETUP.md** - Complete walkthrough with screenshots guide
- ✅ **QUICK_CHECKLIST.md** - Track your progress
- 📘 **README.md** - Full documentation
- 🔧 **SETUP_GUIDE.md** - Advanced configuration

---

**Let's do this! 💪**


