# ✅ Quick Setup Checklist

Use this checklist to track your progress!

## 🎯 Meta Developer Setup

- [ ] **Create Meta Developer account** (https://developers.facebook.com/)
- [ ] **Create new app** (Business type)
- [ ] **Add WhatsApp product** to your app
- [ ] **Get Phone Number ID** → Copy and save it
- [ ] **Get Temporary Access Token** → Copy and save it
- [ ] **Add your test phone number** (with country code)
- [ ] **Verify your test number** (enter OTP code)
- [ ] **Test send a message** from Meta Dashboard (optional but recommended)

## 🔑 Credentials to Collect

Write these down or save them in a secure note:

```
Phone Number ID: ___________________________________
Access Token: ______________________________________
Verify Token (create your own): ____________________
```

## 💻 Local Project Setup

- [ ] **Install Node.js v18+** (check: `node --version`)
- [ ] **Install Docker Desktop** 
- [ ] **Start Docker Desktop** (make sure it's running)
- [ ] **Navigate to project folder** in terminal
- [ ] **Update backend/.env file** with your credentials
- [ ] **Start PostgreSQL**: `docker-compose up -d`
- [ ] **Verify database is running**: `docker ps`

## 🚀 Run the Application

### Backend:
- [ ] Open terminal
- [ ] `cd backend`
- [ ] `npm install` (first time only)
- [ ] `npm run start:dev`
- [ ] Wait for "🚀 Application is running on: http://localhost:3000"
- [ ] **Keep this terminal open**

### Frontend:
- [ ] Open NEW terminal
- [ ] `cd frontend`
- [ ] `npm install` (first time only)
- [ ] `npm start`
- [ ] Browser should open to http://localhost:3001
- [ ] **Keep this terminal open**

## 📱 Test Your First Message!

- [ ] Open http://localhost:3001 in browser
- [ ] Go to "1:1 Messaging" section
- [ ] Enter YOUR phone number (format: 919876543210 - no spaces, no +)
- [ ] Type a message: "Hello from Gamyo! 🚀"
- [ ] Click "Send Message"
- [ ] **Check your WhatsApp** - you should receive the message!
- [ ] 🎉 **SUCCESS!**

## 🌐 Optional: Setup Webhooks (to receive messages)

- [ ] **Install ngrok** (https://ngrok.com/download)
- [ ] **Start ngrok**: `ngrok http 3000`
- [ ] **Copy the HTTPS URL** (https://abc123.ngrok.io)
- [ ] **Go to Meta Dashboard** → WhatsApp → Configuration → Webhooks
- [ ] **Add webhook URL**: https://YOUR-NGROK-URL/webhook
- [ ] **Add verify token**: (from your .env file)
- [ ] **Verify and Save**
- [ ] **Subscribe to events**: messages, message_status
- [ ] **Test**: Send a WhatsApp message to your business number
- [ ] **Check backend terminal** - you should see webhook logs

## 🎓 Learn More

- [ ] Read **STEP_BY_STEP_SETUP.md** for detailed instructions
- [ ] Read **SETUP_GUIDE.md** for production setup
- [ ] Check **README.md** for API documentation
- [ ] Explore the Meta Developer docs: https://developers.facebook.com/docs/whatsapp

## 🆘 Common Issues

**Problem: "Invalid access token"**
→ Token expired. Get a new one from Meta Dashboard.

**Problem: Database connection error**
→ Make sure Docker is running: `docker ps`

**Problem: Backend won't start**
→ Check if port 3000 is in use. Close other apps on that port.

**Problem: Message not sending**
→ Verify phone number format (no +, no spaces, just digits with country code)

---

## 📊 Current Status

### What files you need:

✅ **backend/.env.example** - Template created  
✅ **backend/.env** - Exists but needs your credentials  
✅ **STEP_BY_STEP_SETUP.md** - Detailed guide created  
✅ **QUICK_CHECKLIST.md** - This file (quick reference)

### What you need to do NOW:

1. **Update backend/.env with your Meta credentials**
   - Open: `backend/.env`
   - Replace: `your_phone_number_id_here` with your actual Phone Number ID
   - Replace: `your_access_token_here` with your actual Access Token
   - Save the file

2. **Start everything**:
   ```bash
   # Terminal 1: Start database
   docker-compose up -d
   
   # Terminal 2: Start backend
   cd backend
   npm install
   npm run start:dev
   
   # Terminal 3: Start frontend
   cd frontend
   npm install
   npm start
   ```

3. **Send your first message!** 🚀

---

**You're almost there! Just update the .env file and start the servers!** 🎉


