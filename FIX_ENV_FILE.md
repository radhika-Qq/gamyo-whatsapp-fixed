# ⚠️ IMPORTANT: Fix Your .env File

Your `backend/.env` file has the **wrong variable names**. You need to update it manually.

## 🔧 How to Fix:

### Option 1: Edit Manually (Recommended)

1. Open: `backend/.env` in Notepad or your code editor
2. **Delete everything** in the file
3. **Copy and paste** this entire block:

```env
# WhatsApp Business API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_CHANNEL_ID=your_channel_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=gamyo_webhook_verify_token_2024

# Database Configuration (for Docker PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp

# Server Configuration
PORT=3000
NODE_ENV=development
```

4. **Replace these 2 lines** with YOUR actual credentials from Meta:
   - `WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here` ← Put YOUR Phone Number ID
   - `WHATSAPP_ACCESS_TOKEN=your_access_token_here` ← Put YOUR Access Token

5. **Save the file** (Ctrl+S)

### Option 2: Delete and Recreate

1. Delete the current `backend/.env` file
2. Copy `backend/.env.example` to `backend/.env`:
   ```bash
   cd backend
   copy .env.example .env
   ```
3. Edit `backend/.env` and add YOUR credentials

---

## ❌ Problem with Current .env

Your current file uses:
- `DATABASE_HOST` ❌ (wrong)
- `DATABASE_PORT` ❌ (wrong)
- `DATABASE_USER` ❌ (wrong)
- `DATABASE_PASSWORD` ❌ (wrong)
- `DATABASE_NAME` ❌ (wrong)

But the app expects:
- `DB_HOST` ✅ (correct)
- `DB_PORT` ✅ (correct)
- `DB_USERNAME` ✅ (correct)
- `DB_PASSWORD` ✅ (correct)
- `DB_DATABASE` ✅ (correct)

---

## ✅ What You Need to Do:

1. **Fix the .env file** (use the template above)
2. **Add YOUR credentials**:
   - Get Phone Number ID from Meta Dashboard
   - Get Access Token from Meta Dashboard
3. **Save the file**
4. **Start the backend**: `npm run start:dev`

---

## 🎯 Where to Get Credentials:

### Meta Developer Dashboard
1. Go to: https://developers.facebook.com/apps/
2. Select your app
3. Go to: **WhatsApp** > **API Setup**
4. Copy:
   - **Phone Number ID** (under "From")
   - **Temporary Access Token** (click Copy button)

---

**After fixing the .env file, your backend will start successfully!** ✅


