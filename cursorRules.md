# ========================================================
# 🧠 Cursor Rules — Gamyo.ai Project
# ========================================================
# Purpose:
# Enforce a unified architecture and tech stack for Gamyo.ai
# across backend (Sails.js + Node.js + MongoDB) and
# frontend (React + TypeScript + Tailwind).
# ========================================================

project:
  name: "Gamyo.ai"
  description: "AI-powered social media management app for MSMEs — supports WhatsApp, Facebook, Instagram, and LinkedIn integrations."
  goal: "Ensure Cursor suggestions strictly follow the modernized Sails.js + React TypeScript stack, with AI, scheduling, and analytics readiness."

# ========================================================
# 🚀 BACKEND RULES (Node.js + Sails.js + MongoDB)
# ========================================================
backend:
  language: "JavaScript"
  framework: "Sails.js v1.5.14+"
  runtime: "Node.js v22 LTS"
  database: "MongoDB Atlas (sails-mongo v2.1.2)"
  caching: "Redis v4.7+"
  scheduler: "BullMQ (Redis-backed)"
  file_storage: "AWS S3"
  ai_integration: "Python FastAPI microservice via REST"
  authentication: ["JWT (jsonwebtoken)", "bcryptjs"]
  environment_management: "dotenv"
  logging: ["Winston", "Sentry"]
  deployment: ["Docker", "Nginx"]
  coding_guidelines:
    - Keep MVC structure (controllers, models, services).
    - Define all integrations (WhatsApp, Facebook, Instagram, LinkedIn) inside `api/services/`.
    - Use `AiService.js` to call the FastAPI microservice for AI content and image generation.
    - Queue all scheduled posts using BullMQ workers (`scripts/queueWorker.js`).
    - Use Redis for caching and queue management.
    - Store uploaded media and generated images on AWS S3.
    - Keep config variables in `.env` and load with dotenv.
    - Maintain consistent async/await syntax.
    - All routes should be defined in `config/routes.js` and point to controllers.
    - Follow modular and reusable service patterns.

  folder_structure:
    backend/
      api/
        controllers/
          AiController.js
          PostController.js
          AnalyticsController.js
        models/
          Post.js
          User.js
          Schedule.js
        services/
          AiService.js
          WhatsAppService.js
          FacebookService.js
          InstagramService.js
          LinkedInService.js
        helpers/
          generateHashtags.js
      config/
        datastores.js
        session.js
        routes.js
        custom.js
      hooks/
        scheduler/
      scripts/
        queueWorker.js
      .env
      package.json
      app.js

# ========================================================
# 🎨 FRONTEND RULES (React + TypeScript + Tailwind)
# ========================================================
frontend:
  language: "TypeScript"
  framework: "React v19"
  build_tool: "Vite (preferred) or Create React App"
  styling: ["Tailwind CSS 3.4+", "Sass (optional)"]
  state_management: "Zustand"
  routing: "React Router DOM 7"
  api_client: "Axios"
  charts: ["Recharts", "Chart.js"]
  forms: ["React Hook Form", "Yup"]
  ui_library: ["Lucide React", "Heroicons", "Ant Design"]
  notifications: "React Toastify"
  testing: ["Jest", "React Testing Library"]
  hosting: ["Vercel", "Netlify"]
  coding_guidelines:
    - Use `.tsx` files for all components.
    - Keep reusable UI components inside `/components/`.
    - Define pages/screens inside `/screens/`.
    - Centralize API calls in `/services/axiosClient.ts`.
    - Use Zustand stores for app-wide states in `/store/`.
    - Configure Tailwind via `tailwind.config.js`.
    - Maintain responsive design with mobile-first layout.
    - Prefer functional components with hooks.
    - Ensure clear separation of UI and logic.

  folder_structure:
    frontend/
      src/
        components/
        screens/
        hooks/
        store/
        services/
        assets/
        App.tsx
      tailwind.config.js
      tsconfig.json
      package.json

# ========================================================
# 🤖 AI LAYER RULES (Python FastAPI)
# ========================================================
ai_service:
  framework: "FastAPI"
  runtime: "Python 3.12+"
  integrations:
    - OpenAI API (GPT / DALL·E)
    - Bhashini or AI4Bharat (for regional language processing)
    - Whisper API (optional, speech-to-text)
  usage:
    - Provide REST endpoints to generate text (captions, posts, hashtags).
    - Provide image generation endpoint (for marketing visuals).
    - Support translation and voice input for multilingual posts.
  communication:
    - Sails `AiService.js` should call FastAPI endpoints using Axios or Node fetch.
  containerization:
    - Must be Dockerized and run alongside Node backend via docker-compose.

# ========================================================
# 🧱 SYSTEM INTEGRATION FLOW
# ========================================================
architecture_flow: |
  React (TSX + Tailwind)
     ↓
  Axios → Sails.js (Node backend)
     ↓
  Controllers → Services (AI, WhatsApp, Facebook, LinkedIn)
     ↓
  FastAPI (Python) → AI Generation (OpenAI, Bhashini, DALL·E)
     ↓
  MongoDB Atlas + Redis + AWS S3

# ========================================================
# 🛠️ DEVELOPMENT & DEPLOYMENT RULES
# ========================================================
devops:
  containerization: "Docker + Docker Compose"
  ci_cd: "GitHub Actions"
  environment_files: [".env", ".env.local"]
  deployment_targets:
    - Frontend: Vercel / Netlify
    - Backend: Render / AWS ECS / DigitalOcean
    - Database: MongoDB Atlas
    - Cache: Redis Cloud
  monitoring: ["Sentry", "PM2", "Winston logs"]
  documentation:
    - Maintain up-to-date `README.md` for both frontend and backend.
    - Include setup instructions and environment variable samples.
    - Generate OpenAPI documentation for backend APIs if possible.

# ========================================================
# ✅ BEST PRACTICES ENFORCED
# ========================================================
best_practices:
  - Use consistent naming: camelCase for JS, PascalCase for React components.
  - Avoid inline styling — use Tailwind utilities or reusable components.
  - Use `.env` for all API keys and sensitive credentials.
  - Prefer async/await over callbacks.
  - Keep each controller focused on one domain (AI, Post, Analytics, etc.).
  - Document every API route and service function.
  - Keep backend logs structured and frontend errors handled gracefully.
  - Always test core API endpoints and frontend forms before commits.

# ========================================================
# END OF RULES
# ========================================================
