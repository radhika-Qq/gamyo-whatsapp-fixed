# Project Structure

Complete file structure and architectural overview for the Gamyo WhatsApp Business API Integration.

## 📂 Directory Structure

```
gamyo.ai-wab-integration-trail/
│
├── 📄 README.md                          # Main documentation
├── 📄 projectstructure.md                # This file - project structure details
├── 📄 technicalaspects.md                # Technical implementation details
├── 📄 docker-compose.yml                 # PostgreSQL container configuration
├── 📄 .gitignore                         # Git ignore rules
│
├── 📁 backend/                           # NestJS Backend Application
│   ├── 📄 package.json                   # Backend dependencies and scripts
│   ├── 📄 package-lock.json              # Locked dependency versions
│   ├── 📄 tsconfig.json                  # TypeScript configuration
│   ├── 📄 nest-cli.json                  # NestJS CLI configuration
│   ├── 📄 .prettierrc                    # Code formatting rules
│   ├── 📄 .eslintrc.js                   # Linting configuration
│   ├── 📄 .env                           # Environment variables (create this)
│   │
│   ├── 📁 dist/                          # Compiled JavaScript output
│   │   ├── main.js
│   │   ├── app.module.js
│   │   └── whatsapp/                     # Compiled WhatsApp module
│   │
│   ├── 📁 node_modules/                  # Installed dependencies
│   │
│   └── 📁 src/                           # Source code
│       ├── 📄 main.ts                    # Application entry point & bootstrap
│       ├── 📄 app.module.ts              # Root module with imports
│       │
│       └── 📁 whatsapp/                  # WhatsApp Business Module
│           ├── 📄 whatsapp.module.ts     # Module configuration & DI
│           │
│           ├── 📁 entities/              # TypeORM Database Entities
│           │   ├── 📄 contact.entity.ts         # Contact model
│           │   ├── 📄 template.entity.ts        # Message template model
│           │   └── 📄 sent-message.entity.ts    # Sent message log model
│           │
│           ├── 📁 dto/                   # Data Transfer Objects
│           │   ├── 📄 send-message.dto.ts       # 1:1 message validation
│           │   ├── 📄 send-broadcast.dto.ts     # Broadcast validation
│           │   └── 📄 send-channel.dto.ts       # Channel update validation
│           │
│           ├── 📁 services/              # Business Logic Layer
│           │   ├── 📄 messaging.service.ts      # 1:1 messaging operations
│           │   ├── 📄 broadcast.service.ts      # Bulk messaging operations
│           │   └── 📄 channel.service.ts        # Channel update operations
│           │
│           └── 📁 controllers/           # HTTP Request Handlers
│               ├── 📄 whatsapp.controller.ts    # Main API endpoints
│               └── 📄 webhook.controller.ts     # Webhook endpoints
│
└── 📁 frontend/                          # React Frontend Application
    ├── 📄 package.json                   # Frontend dependencies and scripts
    ├── 📄 package-lock.json              # Locked dependency versions
    ├── 📄 tsconfig.json                  # TypeScript configuration
    │
    ├── 📁 node_modules/                  # Installed dependencies
    │
    ├── 📁 public/                        # Static assets
    │   └── 📄 index.html                 # HTML template
    │
    └── 📁 src/                           # Source code
        ├── 📄 index.tsx                  # React entry point & DOM rendering
        ├── 📄 App.tsx                    # Main app component & routing
        ├── 📄 react-app-env.d.ts         # React type definitions
        │
        └── 📁 components/                # React Components
            ├── 📄 MessageComposer.tsx    # 1:1 messaging UI component
            ├── 📄 BroadcastComposer.tsx  # Broadcast messaging UI component
            └── 📄 ChannelManager.tsx     # Channel updates UI component
```

## 🏗️ Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│                                                          │
│  Frontend (React + TypeScript + Material-UI)            │
│  - MessageComposer: 1:1 messaging UI                    │
│  - BroadcastComposer: Bulk messaging UI                 │
│  - ChannelManager: Channel updates UI                   │
│                                                          │
│  http://localhost:3001                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │ (Axios)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│                                                          │
│  Backend (NestJS + TypeScript)                          │
│  ┌─────────────────────────────────────────────┐       │
│  │ Controllers                                  │       │
│  │ - WhatsappController: API endpoints         │       │
│  │ - WebhookController: Webhook handling       │       │
│  └───────────────────┬─────────────────────────┘       │
│                      │                                  │
│  ┌─────────────────────────────────────────────┐       │
│  │ Services (Business Logic)                    │       │
│  │ - MessagingService: 1:1 messaging           │       │
│  │ - BroadcastService: Bulk operations         │       │
│  │ - ChannelService: Channel updates           │       │
│  └───────────────────┬─────────────────────────┘       │
│                      │                                  │
│  ┌─────────────────────────────────────────────┐       │
│  │ DTOs & Validation                            │       │
│  │ - Request validation with class-validator   │       │
│  └─────────────────────────────────────────────┘       │
│                                                          │
│  http://localhost:3000                                   │
└──────────┬─────────────────────────┬────────────────────┘
           │                         │
           │ TypeORM                 │ HTTP/HTTPS
           │                         │ (Axios)
           ▼                         ▼
┌─────────────────────┐    ┌─────────────────────────────┐
│   DATA LAYER        │    │   EXTERNAL SERVICE          │
│                     │    │                             │
│  PostgreSQL         │    │  WhatsApp Business API      │
│  - contacts         │    │  (Meta Graph API)           │
│  - templates        │    │  https://graph.facebook.com │
│  - sent_messages    │    │                             │
│                     │    │  - Send messages            │
│  localhost:5432     │    │  - Template messages        │
└─────────────────────┘    │  - Channel updates          │
                           │  - Webhook events           │
                           └─────────────────────────────┘
```

## 📄 File Descriptions

### Root Directory

| File | Purpose | Key Content |
|------|---------|-------------|
| `README.md` | Main documentation | Quick start, features, API reference, troubleshooting |
| `projectstructure.md` | Structure documentation | This file - directory layout and architecture |
| `technicalaspects.md` | Technical documentation | Implementation details, API specs, database schema |
| `docker-compose.yml` | Docker configuration | PostgreSQL 14 container with persistent volumes |
| `.gitignore` | Git exclusions | node_modules, .env, dist, build artifacts |

### Backend Structure

#### Core Files

**`src/main.ts`** - Application Bootstrap
- Creates NestJS application instance
- Configures CORS for frontend origin
- Enables global validation pipes
- Starts HTTP server on port 3000

**`src/app.module.ts`** - Root Module
- Imports ConfigModule for environment variables
- Configures TypeORM with PostgreSQL connection
- Imports HttpModule for API calls
- Registers WhatsappModule

#### WhatsApp Module

**`whatsapp/whatsapp.module.ts`** - Module Configuration
- Registers entities (Contact, Template, SentMessage)
- Provides services (Messaging, Broadcast, Channel)
- Registers controllers (Whatsapp, Webhook)
- Dependency injection configuration

#### Entities (Database Models)

**`entities/contact.entity.ts`**
```typescript
- id: number (primary key)
- phone: string (unique)
- name: string (nullable)
- optedIn: boolean (default: false)
- createdAt: Date
- updatedAt: Date
```

**`entities/template.entity.ts`**
```typescript
- id: number (primary key)
- name: string (unique)
- content: string
- language: string (default: 'en_US')
- status: string (default: 'APPROVED')
- createdAt: Date
- updatedAt: Date
```

**`entities/sent-message.entity.ts`**
```typescript
- id: number (primary key)
- phone: string
- message: string
- whatsappMessageId: string (nullable)
- status: string (pending/sent/delivered/read/failed)
- errorMessage: string (nullable)
- messageType: string (text/template/channel)
- templateName: string (nullable)
- createdAt: Date
```

#### DTOs (Data Transfer Objects)

**`dto/send-message.dto.ts`**
- Validates 1:1 message requests
- Required fields: phone, message
- Phone format validation

**`dto/send-broadcast.dto.ts`**
- Validates broadcast requests
- Required fields: templateName, contacts[]
- Contact list validation

**`dto/send-channel.dto.ts`**
- Validates channel update requests
- Required fields: message
- Content validation

#### Services (Business Logic)

**`services/messaging.service.ts`** - 1:1 Messaging
- `sendMessage(phone, message)` - Send individual message
- `sendTemplateMessage(phone, templateName, params)` - Send template
- Phone number validation
- WhatsApp API integration
- Database logging (success/failure)
- Error handling and retry logic

**`services/broadcast.service.ts`** - Bulk Messaging
- `sendBroadcast(templateName, contacts)` - Send to multiple users
- Batch processing (250 messages/batch)
- Rate limiting (1 second delay between messages)
- Success/failure tracking per contact
- Aggregate results reporting

**`services/channel.service.ts`** - Channel Updates
- `postChannelUpdate(message)` - Post to WhatsApp Channel
- `sendChannelMedia(mediaUrl, caption)` - Post media content
- Channel-specific API integration
- Update logging

#### Controllers (HTTP Endpoints)

**`controllers/whatsapp.controller.ts`** - Main API
- `GET /whatsapp/health` - Health check endpoint
- `POST /whatsapp/send` - Send 1:1 message
- `POST /whatsapp/broadcast` - Send broadcast message
- `POST /whatsapp/channel` - Post channel update
- Request validation with DTOs
- Error response formatting

**`controllers/webhook.controller.ts`** - Webhook Handler
- `GET /webhook` - Webhook verification (Meta requirement)
- `POST /webhook` - Receive WhatsApp events
- Event types: messages, message_status
- Signature verification
- Event processing and logging

### Frontend Structure

#### Core Files

**`src/index.tsx`** - Application Entry
- React 18 root creation
- StrictMode wrapper
- DOM rendering to #root element

**`src/App.tsx`** - Main Component
- Material-UI theme provider (WhatsApp green)
- Tab navigation (1:1, Broadcast, Channel)
- Component routing and state management
- Responsive layout with MUI Grid

#### Components

**`components/MessageComposer.tsx`** - 1:1 Messaging UI
- Phone number input field
- Message textarea
- Send button with loading state
- Success/error notifications (Snackbar)
- Form validation
- API call to backend `/whatsapp/send`

**`components/BroadcastComposer.tsx`** - Broadcast UI
- Template name selector
- Contact list textarea (one per line)
- Opt-in confirmation checkbox
- Send broadcast button
- Results display (success/failed counts)
- API call to backend `/whatsapp/broadcast`

**`components/ChannelManager.tsx`** - Channel UI
- Channel message textarea
- Character counter
- Post button with loading state
- Success/error notifications
- API call to backend `/whatsapp/channel`

## 🔄 Data Flow

### Sending a Message (1:1)

```
1. User enters phone + message in MessageComposer
   ↓
2. Click "Send Message" button
   ↓
3. Frontend validates input
   ↓
4. Axios POST to http://localhost:3000/whatsapp/send
   ↓
5. WhatsappController receives request
   ↓
6. DTO validates request data
   ↓
7. MessagingService.sendMessage() called
   ↓
8. Service calls WhatsApp Business API
   ↓
9. WhatsApp API sends message to user
   ↓
10. Service logs to sent_messages table
    ↓
11. Success response returned to frontend
    ↓
12. UI shows success notification
```

### Receiving a Webhook Event

```
1. User sends WhatsApp message to business number
   ↓
2. WhatsApp servers call webhook endpoint
   ↓
3. GET /webhook for verification (if first time)
   ↓
4. POST /webhook with event data
   ↓
5. WebhookController receives event
   ↓
6. Verifies signature (security)
   ↓
7. Parses event data (message or status)
   ↓
8. Logs event to console/database
   ↓
9. Processes business logic (auto-reply, etc.)
   ↓
10. Returns 200 OK to WhatsApp
```

## 🗃️ Database Schema Relationships

```
┌─────────────────┐
│    contacts     │
├─────────────────┤
│ id (PK)         │
│ phone (UNIQUE)  │
│ name            │
│ optedIn         │─────┐
│ createdAt       │     │
│ updatedAt       │     │
└─────────────────┘     │
                        │
                        │ (Logical relation)
                        │
┌─────────────────┐     │
│  sent_messages  │     │
├─────────────────┤     │
│ id (PK)         │     │
│ phone           │◄────┘
│ message         │
│ messageType     │─────┐
│ templateName    │     │
│ whatsappMsgId   │     │ (References template.name)
│ status          │     │
│ errorMessage    │     │
│ createdAt       │     │
└─────────────────┘     │
                        │
┌─────────────────┐     │
│   templates     │     │
├─────────────────┤     │
│ id (PK)         │     │
│ name (UNIQUE)   │◄────┘
│ content         │
│ language        │
│ status          │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

## 🚀 Development Workflow

### Starting the Application

```bash
# Terminal 1: Start Database
docker-compose up -d

# Terminal 2: Start Backend
cd backend
npm install
npm run start:dev

# Terminal 3: Start Frontend
cd frontend
npm install
npm start

# Terminal 4 (Optional): Start ngrok for webhooks
ngrok http 3000
```

### Development Scripts

**Backend:**
```bash
npm run start:dev    # Development with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start:prod   # Production mode
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

**Frontend:**
```bash
npm start           # Development server (port 3001)
npm run build       # Production build
npm test            # Run tests
npm run eject       # Eject from CRA (one-way operation)
```

## 📦 Dependencies Overview

### Backend Key Packages

| Package | Version | Purpose |
|---------|---------|---------|
| @nestjs/core | ^10.0.0 | NestJS framework core |
| @nestjs/typeorm | ^10.0.0 | TypeORM integration |
| @nestjs/axios | ^3.0.0 | HTTP client module |
| @nestjs/config | ^3.0.0 | Environment configuration |
| typeorm | ^0.3.17 | ORM for PostgreSQL |
| pg | ^8.11.0 | PostgreSQL driver |
| axios | ^1.5.0 | HTTP requests |
| class-validator | ^0.14.0 | DTO validation |
| class-transformer | ^0.5.1 | Object transformation |

### Frontend Key Packages

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI library |
| react-dom | ^18.2.0 | React DOM renderer |
| @mui/material | ^5.14.0 | UI component library |
| @mui/icons-material | ^5.14.0 | Material icons |
| @emotion/react | ^11.11.1 | CSS-in-JS for MUI |
| axios | ^1.5.0 | HTTP client |
| typescript | ^4.9.5 | Type checking |
| react-scripts | 5.0.1 | Create React App scripts |

## 🔒 Environment Variables

All environment variables are stored in `backend/.env`:

```env
# WhatsApp API
WHATSAPP_API_URL              # Meta Graph API base URL
WHATSAPP_PHONE_NUMBER_ID      # Your phone number ID
WHATSAPP_ACCESS_TOKEN         # Access token (temp or permanent)
WHATSAPP_CHANNEL_ID           # Channel ID (optional)
WHATSAPP_WEBHOOK_VERIFY_TOKEN # Custom verify token

# Database
DB_HOST                       # PostgreSQL host
DB_PORT                       # PostgreSQL port (5432)
DB_USERNAME                   # Database username
DB_PASSWORD                   # Database password
DB_DATABASE                   # Database name

# Server
PORT                          # Backend port (3000)
NODE_ENV                      # Environment (development/production)
```

## 📊 Build Artifacts

### Backend Build Output (`backend/dist/`)
- Compiled JavaScript files
- Source maps (.map files)
- TypeScript declaration files (.d.ts)
- Ready for Node.js execution

### Frontend Build Output (`frontend/build/`)
- Optimized production bundle
- Minified JavaScript and CSS
- Static assets (images, fonts)
- index.html with injected scripts
- Ready for static hosting

## 🔍 Code Organization Patterns

### Backend Patterns
- **Dependency Injection** - NestJS IoC container
- **Repository Pattern** - TypeORM repositories
- **DTO Pattern** - Request/response validation
- **Service Layer** - Business logic separation
- **Controller Layer** - HTTP request handling

### Frontend Patterns
- **Component-Based** - Reusable React components
- **Hooks** - useState, useEffect for state management
- **Material-UI Theme** - Consistent styling
- **Axios Interceptors** - Centralized error handling

## 📝 Naming Conventions

### Backend
- **Files**: `kebab-case.ts` (e.g., `messaging.service.ts`)
- **Classes**: `PascalCase` (e.g., `MessagingService`)
- **Methods**: `camelCase` (e.g., `sendMessage`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `WHATSAPP_API_URL`)

### Frontend
- **Files**: `PascalCase.tsx` for components (e.g., `MessageComposer.tsx`)
- **Components**: `PascalCase` (e.g., `MessageComposer`)
- **Functions**: `camelCase` (e.g., `handleSendMessage`)
- **Constants**: `UPPER_SNAKE_CASE` or `camelCase`

---

**This structure provides a scalable, maintainable foundation for WhatsApp Business API integration.** 🏗️

