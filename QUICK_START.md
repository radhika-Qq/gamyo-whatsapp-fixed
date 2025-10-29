# 🚀 Quick Start Guide - Gamyo.ai v2.0

Get up and running with Gamyo.ai in under 10 minutes!

## Prerequisites Checklist

- [ ] Node.js 22+ installed
- [ ] Python 3.12+ installed  
- [ ] MongoDB Atlas account (or local MongoDB)
- [ ] Redis installed (or use Docker)
- [ ] OpenAI API key
- [ ] Social media API credentials (optional for testing)

## 🎯 Option 1: Docker Compose (Recommended)

Perfect for testing and development. Everything runs in containers!

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd gamyo.ai-wab-integration-trail

# Create environment file
cp env.example .env
```

### Step 2: Configure Environment

Edit `.env` file with your credentials:

```env
# Minimum required for testing
MONGO_USERNAME=admin
MONGO_PASSWORD=password123
JWT_SECRET=your-random-secret-key
SESSION_SECRET=your-random-session-key
OPENAI_API_KEY=sk-your-openai-key
AI_SERVICE_API_KEY=test-api-key

# Optional: Add social media credentials later
WHATSAPP_ACCESS_TOKEN=
FACEBOOK_ACCESS_TOKEN=
INSTAGRAM_ACCESS_TOKEN=
LINKEDIN_ACCESS_TOKEN=
```

### Step 3: Launch!

```bash
# Start all services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 4: Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/health
- **AI Service**: http://localhost:8000/docs
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### Step 5: Create Your Account

1. Go to http://localhost:5173
2. Click "Register"
3. Fill in your details
4. Start creating posts!

---

## 🛠 Option 2: Manual Setup

For development and customization.

### Backend Setup

```bash
cd backend-sails

# Install dependencies
npm install

# Create .env file
cp env.example .env

# Edit .env with your MongoDB URI and other credentials
# Required minimum:
# - MONGO_URI
# - JWT_SECRET
# - REDIS_HOST

# Start backend
npm start

# In a new terminal, start the worker
npm run worker
```

### Frontend Setup

```bash
cd frontend-vite

# Install dependencies
npm install

# Create .env
echo "VITE_API_URL=http://localhost:3000" > .env

# Start frontend
npm run dev
```

### AI Service Setup

```bash
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env
cp env-example.txt .env

# Edit .env and add your OpenAI API key
# Required:
# - OPENAI_API_KEY

# Start service
python main.py
```

### Access Applications

Same as Docker option above!

---

## 🧪 Testing the Setup

### 1. Health Check

```bash
# Backend
curl http://localhost:3000/health

# AI Service
curl http://localhost:8000/health
```

### 2. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### 3. Test AI Service

```bash
curl -X POST http://localhost:8000/api/ai/generate-caption \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key" \
  -d '{
    "prompt": "Write a post about AI and social media",
    "tone": "professional",
    "language": "en"
  }'
```

---

## 🔑 Getting API Credentials

### WhatsApp Business API

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app → WhatsApp → Get Started
3. Copy Phone Number ID and Access Token

### Facebook Page

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app → Facebook Login
3. Get Page Access Token from Graph API Explorer

### Instagram Business

1. Convert Instagram account to Business Account
2. Link to Facebook Page
3. Use Facebook app to get Instagram User ID and Token

### LinkedIn

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create an app
3. Request API access
4. Get Access Token and Organization URN

### OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create account and add billing
3. Generate API key from API Keys section

---

## 📱 First Steps in the App

### 1. Login/Register
- Create your account at http://localhost:5173/register
- Login with your credentials

### 2. Create Your First Post
- Go to "Composer"
- Write your content
- Select platforms (you can select without credentials for testing)
- Click "Create Post"

### 3. Try AI Features
- In Composer, click "AI Caption" to generate content
- Click "AI Hashtags" to get relevant hashtags
- Experiment with different prompts

### 4. Schedule Posts
- Go to "Schedule" to view all your posts
- Click "Publish" on a draft post
- View post status and analytics

### 5. Check Analytics
- Go to "Analytics" to see your performance
- View platform breakdown
- Track engagement metrics

---

## 🐛 Common Issues

### Port Already in Use

```bash
# Check what's using the port
# Linux/Mac:
lsof -i :3000
# Windows:
netstat -ano | findstr :3000

# Kill the process or change port in .env
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running (Docker)
docker ps | grep mongo

# Check connection string in .env
# Format: mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Redis Connection Failed

```bash
# Start Redis (Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Or install locally:
# Mac: brew install redis && brew services start redis
# Linux: sudo apt install redis-server && sudo service redis start
# Windows: Use Docker or WSL
```

### Frontend Can't Connect to Backend

- Check CORS settings in `backend-sails/config/security.js`
- Verify VITE_API_URL in frontend .env
- Check if backend is running on correct port

### AI Service Errors

- Verify OpenAI API key is valid
- Check you have credits in OpenAI account
- Ensure AI_SERVICE_URL is correct in backend .env

---

## 🎓 Next Steps

1. **Configure Social Media APIs**: Add your platform credentials to `.env`
2. **Customize**: Modify UI colors, add features, personalize
3. **Deploy**: Follow deployment guide in README-NEW.md
4. **Explore**: Check out the full documentation

---

## 📚 Additional Resources

- **Full Documentation**: [README-NEW.md](./README-NEW.md)
- **Migration Guide**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **API Routes**: Check `backend-sails/config/routes.js`
- **Components**: Browse `frontend-vite/src/components/`

---

## 💬 Need Help?

- **Documentation**: Check README-NEW.md
- **Issues**: Open a GitHub issue
- **Community**: Join our Discord (coming soon)
- **Email**: support@gamyo.ai

---

**Happy posting! 🎉**

Built with ❤️ for MSMEs worldwide

