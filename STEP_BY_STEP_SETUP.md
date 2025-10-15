# 🚀 Step-by-Step Setup Guide for WhatsApp API Integration

Follow these steps **in order** to get your WhatsApp integration up and running.

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] **Node.js v18+** installed → [Download](https://nodejs.org/)
- [ ] **Docker Desktop** installed (for PostgreSQL) → [Download](https://www.docker.com/products/docker-desktop)
- [ ] **Facebook/Meta account** (you'll need this for WhatsApp Business API)
- [ ] **A phone number** for testing (can be your personal WhatsApp number)

---

## Part 1️⃣: Get WhatsApp Business API Credentials (15-20 minutes)

### Step 1: Create Meta Developer Account

1. Open your browser and go to: **https://developers.facebook.com/**
2. Click **"Get Started"** (top right corner)
3. Log in with your Facebook account
4. Complete the registration if it's your first time
5. ✅ You should now see the Meta Developer Dashboard

### Step 2: Create a New App

1. In the dashboard, click **"My Apps"** (top right)
2. Click the green **"Create App"** button
3. Choose **"Business"** as the app type → Click **"Next"**
4. Fill in the form:
   - **App Name**: `Gamyo WhatsApp Integration` (or any name you prefer)
   - **App Contact Email**: Your email address
   - **Business Account**: Select existing or create new
5. Click **"Create App"**
6. Complete any security verification if prompted
7. ✅ You should now see your app dashboard

### Step 3: Add WhatsApp Product to Your App

1. In your app dashboard, scroll down to **"Add products to your app"**
2. Find **"WhatsApp"** in the list
3. Click **"Set up"** button
4. ✅ You'll be taken to the WhatsApp setup page

### Step 4: Get Your Credentials (IMPORTANT! 📝)

Now you'll collect the credentials you need. **Keep a notepad open** to copy these values!

#### A) Get Phone Number ID:
1. On the WhatsApp setup page, look for the **"From"** section
2. You'll see **"Phone number ID"** - it's a long number
3. **Copy this number** → Save it as `PHONE_NUMBER_ID`
4. Example: `123456789012345`

#### B) Get Temporary Access Token:
1. On the same page, look for **"Temporary access token"**
2. Click **"Copy"** button next to the token
3. **Save this token** → This is your `ACCESS_TOKEN`
4. ⚠️ **Important**: This token expires in 24 hours. We'll create a permanent one later.

#### C) Add Your Test Phone Number:
1. Look for the **"To"** section on the same page
2. Click **"Add phone number"**
3. Enter your phone number with country code (e.g., `+91 98765 43210`)
4. Click **"Next"** → WhatsApp will send you a verification code
5. Enter the code and verify
6. ✅ Your phone number is now added for testing

#### D) Test It! (Optional but recommended):
1. On the WhatsApp setup page, there's a pre-filled message
2. Click **"Send message"**
3. Check your WhatsApp - you should receive a "Hello World" message
4. ✅ If you got the message, everything is working!

### Step 5: Create a Webhook Verify Token

1. Open Notepad or any text editor
2. Create a random secure string (this is YOUR custom token)
3. Example: `my_secure_webhook_token_2024_xyz`
4. **Save this** → This is your `WEBHOOK_VERIFY_TOKEN`

---

## Part 2️⃣: Setup Your Project (5-10 minutes)

### Step 1: Open Your Project

1. Open **Command Prompt** or **PowerShell**
2. Navigate to your project:
   ```bash
   cd C:\Users\radhi\Desktop\gamyo.ai-wab-integration-trail
   ```

### Step 2: Create Backend .env File

1. Go to the backend folder:
   ```bash
   cd backend
   ```

2. Copy the example file:
   ```bash
   copy .env.example .env
   ```

3. Open the `.env` file in Notepad or your code editor:
   ```bash
   notepad .env
   ```

4. Replace these values with what you copied earlier:
   ```env
   WHATSAPP_PHONE_NUMBER_ID=123456789012345  ← Replace with YOUR Phone Number ID
   WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxx      ← Replace with YOUR Access Token
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=my_secure_webhook_token_2024_xyz  ← Your custom token
   ```

5. Keep the database settings as they are (for now)
6. **Save the file** (Ctrl+S)
7. ✅ Backend configuration is complete!

---

## Part 3️⃣: Start the Database (2 minutes)

### Step 1: Start Docker Desktop

1. Open **Docker Desktop** application
2. Wait for it to fully start (you'll see a green "Engine running" status)

### Step 2: Start PostgreSQL

1. In your terminal (make sure you're in the project root):
   ```bash
   cd C:\Users\radhi\Desktop\gamyo.ai-wab-integration-trail
   ```

2. Start the database:
   ```bash
   docker-compose up -d
   ```

3. You should see:
   ```
   Creating network "gamyo-whatsapp-prototype_default" ... done
   Creating gamyo-postgres ... done
   ```

4. Verify it's running:
   ```bash
   docker ps
   ```
   
   You should see a container named `gamyo-postgres` with status "Up"

5. ✅ Database is running!

---

## Part 4️⃣: Start the Backend Server (3 minutes)

### Step 1: Install Dependencies

1. Navigate to backend folder (if not already there):
   ```bash
   cd backend
   ```

2. Install packages:
   ```bash
   npm install
   ```
   
   This will take 1-2 minutes. Wait for it to complete.

### Step 2: Start the Server

1. Start the development server:
   ```bash
   npm run start:dev
   ```

2. Wait for the server to start. You should see:
   ```
   🚀 Application is running on: http://localhost:3000
   ```

3. ✅ Backend is running! **Keep this terminal open**

### Step 3: Test the Backend (Optional)

1. Open a **new terminal/PowerShell window**
2. Test the health endpoint:
   ```bash
   curl http://localhost:3000/whatsapp/health
   ```
   
3. You should see:
   ```json
   {"status":"ok","message":"WhatsApp API is running"}
   ```

---

## Part 5️⃣: Start the Frontend (3 minutes)

### Step 1: Open New Terminal

1. Open a **new Command Prompt or PowerShell window**
2. Navigate to your project:
   ```bash
   cd C:\Users\radhi\Desktop\gamyo.ai-wab-integration-trail\frontend
   ```

### Step 2: Install Dependencies

```bash
npm install
```

This will take 1-2 minutes.

### Step 3: Start the Frontend

```bash
npm start
```

### Step 4: Access the Application

1. Your browser should automatically open to **http://localhost:3001**
2. If not, manually open: http://localhost:3001
3. ✅ You should see the **"Gamyo WhatsApp Business API Prototype"** interface!

---

## Part 6️⃣: Send Your First Message! 🎉 (2 minutes)

### Test 1:1 Messaging

1. On the web interface at http://localhost:3001
2. Scroll to the **"1:1 Messaging"** section
3. In the **Phone Number** field, enter YOUR phone number (that you verified earlier):
   - **Format**: Country code + number (NO SPACES, NO +)
   - Example: If your number is +91 98765 43210
   - Enter: `919876543210`
4. In the **Message** field, type: `Hello from Gamyo! 🚀`
5. Click **"Send Message"**
6. **Check your WhatsApp** - you should receive the message within seconds!
7. ✅ If you received it, **SUCCESS!** Your integration is working! 🎉

---

## Part 7️⃣: Setup Webhooks (Optional but Recommended) (10 minutes)

Webhooks allow your app to **receive** messages from WhatsApp users.

### Step 1: Install ngrok

1. Go to https://ngrok.com/download
2. Download ngrok for Windows
3. Extract the zip file
4. Move `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
5. Add to PATH or navigate to that folder in terminal

### Step 2: Start ngrok

1. Open a **new terminal**
2. Run:
   ```bash
   ngrok http 3000
   ```

3. You'll see output like:
   ```
   Forwarding  https://abc123.ngrok.io -> http://localhost:3000
   ```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)
5. **Keep this terminal open**

### Step 3: Configure Webhook in Meta

1. Go back to **Meta Developer Dashboard**
2. Navigate to your app → **WhatsApp** → **Configuration**
3. Find the **Webhook** section
4. Click **"Edit"**
5. Fill in:
   - **Callback URL**: `https://abc123.ngrok.io/webhook` (use YOUR ngrok URL)
   - **Verify Token**: Enter the `WHATSAPP_WEBHOOK_VERIFY_TOKEN` from your `.env` file
6. Click **"Verify and Save"**
7. If successful, you'll see a green checkmark ✅

### Step 4: Subscribe to Events

1. In the same Webhook section, click **"Manage"**
2. Check these boxes:
   - ☑️ **messages** (to receive incoming messages)
   - ☑️ **message_status** (to get delivery/read receipts)
3. Click **"Done"**
4. ✅ Webhooks are configured!

### Step 5: Test Webhooks

1. Send a WhatsApp message TO your test business number
2. Check your **backend terminal** - you should see logs like:
   ```
   Webhook event received: {...}
   Received message from 919876543210: Hello!
   ```
3. ✅ If you see these logs, webhooks are working!

---

## 🎯 What's Next?

### You're All Set! Here's what you can do now:

1. ✅ **Send 1:1 Messages** - Test sending individual messages
2. ✅ **Test Broadcasts** - Send messages to multiple numbers (make sure they've opted in!)
3. ✅ **Create Templates** - For production use, create and approve message templates
4. ✅ **Set Up Channels** (Optional) - Create a WhatsApp Channel for announcements

---

## 🆘 Troubleshooting

### Problem: "Invalid access token"
**Solution**: Your token expired (temporary tokens last 24 hours). Get a new one from Meta Dashboard or create a permanent token.

### Problem: Backend won't start
**Solution**: 
- Check if port 3000 is already in use
- Make sure PostgreSQL (Docker) is running
- Verify `.env` file exists and has correct values

### Problem: "Can't connect to database"
**Solution**:
- Make sure Docker Desktop is running
- Run `docker ps` to verify container is up
- Restart Docker: `docker-compose down` then `docker-compose up -d`

### Problem: Message not sending
**Solution**:
- Verify phone number format (no spaces, no +, just digits)
- Make sure the number is added in Meta Dashboard (To section)
- Check backend terminal for error messages
- Verify your access token is correct

### Problem: Frontend won't load
**Solution**:
- Check if backend is running on port 3000
- Make sure frontend is on port 3001
- Clear browser cache or try incognito mode

---

## 📞 Need More Help?

1. Check the detailed **SETUP_GUIDE.md** for more information
2. Review **README.md** for API documentation
3. Check Meta's official docs: https://developers.facebook.com/docs/whatsapp

---

## ✅ Setup Complete!

You now have a fully functional WhatsApp Business API integration! 🎊

**Terminal Windows You Should Have Open:**
1. ✅ Backend server (`npm run start:dev`)
2. ✅ Frontend (`npm start`)
3. ✅ Docker (running in background)
4. ✅ ngrok (if using webhooks)

**Next Steps:**
- Experiment with the UI
- Try sending different types of messages
- Create message templates in Meta Business Manager
- Consider deploying to production

---

**Happy Building! 🚀**


