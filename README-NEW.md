# Gamyo.ai - AI-Powered Social Media Management Platform

> **Version 2.0** - Modernized Architecture with Sails.js, React 19, and AI Integration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

Gamyo.ai is a comprehensive social media management platform designed for MSMEs (Micro, Small & Medium Enterprises). It enables seamless content creation, scheduling, and analytics across multiple platforms including WhatsApp Business, Facebook, Instagram, and LinkedIn, powered by AI for content generation and optimization.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Migration Guide](#migration-guide)

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React 19 + Vite)                │
│  Zustand • React Router 7 • Tailwind CSS • Axios            │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST
┌─────────────────────▼───────────────────────────────────────┐
│              Backend (Sails.js + Node.js 22)                │
│  Controllers • Services • Models • Policies                 │
├─────────────────────┬───────────────────────────────────────┤
│  MongoDB Atlas      │  Redis           │  BullMQ            │
│  (Database)         │  (Cache/Session) │  (Queue Worker)    │
└─────────────────────┴───────────────────┴───────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│        AI Microservice (Python FastAPI)                      │
│  OpenAI GPT-4 • DALL-E 3 • Translation                      │
└─────────────────────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│     External APIs                                            │
│  WhatsApp • Facebook • Instagram • LinkedIn                 │
└─────────────────────────────────────────────────────────────┘
```

## 🛠 Tech Stack

### Backend
- **Framework**: Sails.js v1.5.14+ (Node.js 22 LTS)
- **Database**: MongoDB Atlas (sails-mongo v2.1.2)
- **Cache**: Redis v4.7+
- **Queue**: BullMQ (Redis-backed)
- **Storage**: AWS S3
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Logging**: Winston + Sentry
- **Container**: Docker

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4+
- **State Management**: Zustand
- **Routing**: React Router DOM 7
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios
- **UI Components**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Toastify

### AI Service
- **Framework**: FastAPI (Python 3.12+)
- **AI Provider**: OpenAI (GPT-4, DALL-E 3)
- **Translation**: Multi-language support
- **Server**: Uvicorn

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (recommended)
- **Monitoring**: Sentry, Winston logs

## 📦 Prerequisites

- **Node.js**: v22 LTS or higher
- **Python**: 3.12+ (for AI service)
- **MongoDB**: Atlas account or local instance
- **Redis**: v4.7+ (local or cloud)
- **Docker**: Latest version (optional, for containerized deployment)
- **npm**: v9+ or pnpm

### API Keys Required
- OpenAI API Key (for AI features)
- WhatsApp Business API credentials
- Facebook Page Access Token
- Instagram Business Account credentials
- LinkedIn Organization credentials
- AWS S3 credentials (for media storage)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gamyo.ai-wab-integration-trail
```

### 2. Backend Setup

```bash
cd backend-sails
npm install

# Copy environment template
cp env.example .env

# Edit .env with your credentials
nano .env

# Start the backend
npm start

# In a separate terminal, start the queue worker
npm run worker
```

### 3. Frontend Setup

```bash
cd frontend-vite
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000" > .env

# Start the frontend
npm run dev
```

### 4. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt

# Copy environment template
cp env-example.txt .env

# Edit .env with OpenAI API key
nano .env

# Start the AI service
python main.py
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **AI Service**: http://localhost:8000
- **API Docs (AI)**: http://localhost:8000/docs

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Copy environment template
cp env.example .env

# Edit .env with all required credentials
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- AI Service: http://localhost:8000
- MongoDB: localhost:27017
- Redis: localhost:6379

## 📁 Project Structure

```
gamyo.ai/
├── backend-sails/              # Sails.js Backend
│   ├── api/
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # Database models
│   │   ├── services/           # Business logic
│   │   ├── policies/           # Auth middleware
│   │   └── helpers/            # Utility functions
│   ├── config/                 # Configuration files
│   ├── scripts/                # Worker scripts
│   └── package.json
│
├── frontend-vite/              # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── screens/            # Page components
│   │   ├── store/              # Zustand stores
│   │   ├── services/           # API clients
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── ai-service/                 # FastAPI AI Service
│   ├── main.py                 # Main application
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml          # Multi-container setup
└── README.md
```

## 🔧 Environment Configuration

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb+srv://...

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=gamyo-media

# Social Media APIs
WHATSAPP_ACCESS_TOKEN=...
FACEBOOK_ACCESS_TOKEN=...
INSTAGRAM_ACCESS_TOKEN=...
LINKEDIN_ACCESS_TOKEN=...

# AI Service
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=your-api-key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

### AI Service (.env)

```env
OPENAI_API_KEY=sk-...
AI_SERVICE_API_KEY=your-api-key
PORT=8000
```

## 💻 Development

### Backend Development

```bash
cd backend-sails

# Start with auto-reload
npm run dev

# Run linter
npm run lint

# Format code
npm run format
```

### Frontend Development

```bash
cd frontend-vite

# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### AI Service Development

```bash
cd ai-service

# Start with auto-reload
uvicorn main:app --reload

# Run tests
pytest
```

## 🚢 Deployment

### Production Build

**Backend:**
```bash
cd backend-sails
NODE_ENV=production node app.js
```

**Frontend:**
```bash
cd frontend-vite
npm run build
# Deploy dist/ folder to Vercel, Netlify, or static hosting
```

**AI Service:**
```bash
cd ai-service
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Deployment Platforms

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Render, AWS ECS, DigitalOcean App Platform
- **AI Service**: AWS Lambda, Google Cloud Run, Render
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud, AWS ElastiCache

## 📚 API Documentation

### Authentication

**Register**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "companyName": "Acme Inc"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### AI Services

**Generate Caption**
```
POST /api/ai/generate-caption
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Write a post about sustainable fashion",
  "tone": "professional",
  "language": "en"
}
```

**Generate Hashtags**
```
POST /api/ai/generate-hashtags
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Your post content",
  "count": 5
}
```

### Posts

**Create Post**
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Your post content",
  "platforms": ["facebook", "instagram", "linkedin"],
  "postType": "text"
}
```

**Publish Post**
```
POST /api/posts/:id/publish
Authorization: Bearer <token>
```

Full API documentation available in the codebase at `backend-sails/config/routes.js`.

## 🔄 Migration Guide

### From NestJS to Sails.js

The project has been completely refactored from NestJS to Sails.js. Key changes:

1. **Architecture**: MVC pattern with Sails.js conventions
2. **Database**: PostgreSQL → MongoDB Atlas
3. **ORM**: TypeORM → Waterline (Sails ORM)
4. **Decorators**: Removed (Sails uses plain functions)
5. **Dependency Injection**: Sails services are globally accessible

### Migration Steps

1. **Data Migration**: Export data from PostgreSQL and import to MongoDB
2. **API Endpoints**: Updated routes are in `config/routes.js`
3. **Authentication**: New JWT-based auth in `AuthController.js`
4. **Frontend**: Complete rewrite with React 19 + Vite

### Frontend Migration

From Material-UI to Tailwind CSS:
- All components rewritten with Tailwind utility classes
- Modern React 19 features (optimized rendering)
- Zustand for simpler state management
- React Router 7 for improved routing

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Sails.js team for the excellent MVC framework
- OpenAI for AI capabilities
- Meta for WhatsApp, Facebook, and Instagram APIs
- LinkedIn for their professional network API

## 📞 Support

For issues, questions, or contributions:
- GitHub Issues: [Create an issue]
- Documentation: [Wiki]
- Email: support@gamyo.ai

---

**Built with ❤️ for MSMEs worldwide**

