# Project Structure

Complete file structure for the Gamyo WhatsApp Business API Integration prototype.

```
gamyo.ai-wab-integration-trail/
│
├── 📄 README.md                      # Main documentation
├── 📄 SETUP_GUIDE.md                 # Detailed setup instructions
├── 📄 QUICK_START.md                 # 5-minute quick start guide
├── 📄 PROJECT_STRUCTURE.md           # This file
├── 📄 .gitignore                     # Git ignore rules
├── 📄 docker-compose.yml             # PostgreSQL container setup
│
├── 📁 backend/                       # NestJS Backend
│   ├── 📄 package.json               # Backend dependencies
│   ├── 📄 tsconfig.json              # TypeScript config
│   ├── 📄 nest-cli.json              # NestJS CLI config
│   ├── 📄 .prettierrc                # Code formatting
│   ├── 📄 .eslintrc.js               # Linting rules
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 .env                       # Your credentials (create this)
│   │
│   └── 📁 src/
│       ├── 📄 main.ts                # Application entry point
│       ├── 📄 app.module.ts          # Root module
│       │
│       └── 📁 whatsapp/              # WhatsApp module
│           ├── 📄 whatsapp.module.ts # Module configuration
│           │
│           ├── 📁 entities/          # Database models
│           │   ├── 📄 contact.entity.ts
│           │   ├── 📄 template.entity.ts
│           │   └── 📄 sent-message.entity.ts
│           │
│           ├── 📁 dto/               # Data Transfer Objects
│           │   ├── 📄 send-message.dto.ts
│           │   ├── 📄 send-broadcast.dto.ts
│           │   └── 📄 send-channel.dto.ts
│           │
│           ├── 📁 services/          # Business logic
│           │   ├── 📄 messaging.service.ts    # 1:1 messaging
│           │   ├── 📄 broadcast.service.ts    # Bulk messaging
│           │   └── 📄 channel.service.ts      # Channel updates
│           │
│           └── 📁 controllers/       # API endpoints
│               ├── 📄 whatsapp.controller.ts  # Main API routes
│               └── 📄 webhook.controller.ts   # Webhook handling
│
└── 📁 frontend/                      # React Frontend
    ├── 📄 package.json               # Frontend dependencies
    ├── 📄 tsconfig.json              # TypeScript config
    │
    ├── 📁 public/
    │   └── 📄 index.html             # HTML template
    │
    └── 📁 src/
        ├── 📄 index.tsx              # React entry point
        ├── 📄 App.tsx                # Main app component
        ├── 📄 react-app-env.d.ts     # Type definitions
        │
        └── 📁 components/            # React components
            ├── 📄 MessageComposer.tsx     # 1:1 messaging UI
            ├── 📄 BroadcastComposer.tsx   # Broadcast UI
            └── 📄 ChannelManager.tsx      # Channel UI
```

## File Descriptions

### Root Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation with features, setup, and troubleshooting |
| `SETUP_GUIDE.md` | Step-by-step guide to configure WhatsApp API |
| `QUICK_START.md` | Get running in 5 minutes |
| `docker-compose.yml` | PostgreSQL database container |
| `.gitignore` | Files to exclude from Git |

### Backend Structure

#### Core Files
- **`main.ts`**: Application bootstrap, CORS setup, port configuration
- **`app.module.ts`**: Imports database, HTTP, and WhatsApp modules

#### Entities (Database Models)
- **`contact.entity.ts`**: Store WhatsApp contacts with opt-in status
- **`template.entity.ts`**: Store message templates
- **`sent-message.entity.ts`**: Log all sent messages and their status

#### DTOs (Data Transfer Objects)
- **`send-message.dto.ts`**: Validate 1:1 message requests
- **`send-broadcast.dto.ts`**: Validate broadcast requests
- **`send-channel.dto.ts`**: Validate channel update requests

#### Services (Business Logic)
- **`messaging.service.ts`**: 
  - Send individual messages
  - Send template messages
  - Log messages to database
  - Error handling
  
- **`broadcast.service.ts`**:
  - Send bulk messages
  - Batch processing (250 messages/batch)
  - Rate limiting (1 second delay)
  - Success/failure tracking
  
- **`channel.service.ts`**:
  - Post channel updates
  - Send channel media
  - Log channel posts

#### Controllers (API Endpoints)
- **`whatsapp.controller.ts`**:
  - `GET /whatsapp/health` - Health check
  - `POST /whatsapp/send` - Send message
  - `POST /whatsapp/broadcast` - Send broadcast
  - `POST /whatsapp/channel` - Post channel update
  
- **`webhook.controller.ts`**:
  - `GET /webhook` - Webhook verification
  - `POST /webhook` - Receive WhatsApp events

### Frontend Structure

#### Core Files
- **`index.tsx`**: React app initialization
- **`App.tsx`**: Main layout with Material-UI theme

#### Components
- **`MessageComposer.tsx`**:
  - Phone number input
  - Message textarea
  - Send button
  - Success/error notifications
  
- **`BroadcastComposer.tsx`**:
  - Template selector
  - Contact list textarea
  - Opt-in confirmation checkbox
  - Broadcast results display
  
- **`ChannelManager.tsx`**:
  - Channel message textarea
  - Post button
  - Success/error notifications

## Database Schema

### Tables Created Automatically

1. **contacts**
   ```sql
   id (serial, primary key)
   phone (varchar, unique)
   name (varchar, nullable)
   optedIn (boolean, default: false)
   createdAt (timestamp)
   updatedAt (timestamp)
   ```

2. **templates**
   ```sql
   id (serial, primary key)
   name (varchar, unique)
   content (text)
   language (varchar, default: 'en_US')
   status (varchar, default: 'APPROVED')
   createdAt (timestamp)
   updatedAt (timestamp)
   ```

3. **sent_messages**
   ```sql
   id (serial, primary key)
   phone (varchar)
   message (text)
   whatsappMessageId (varchar, nullable)
   status (varchar, default: 'pending')
   errorMessage (varchar, nullable)
   messageType (varchar, default: 'text')
   templateName (varchar, nullable)
   createdAt (timestamp)
   ```

## API Endpoints

### Backend API

```
Base URL: http://localhost:3000

GET    /whatsapp/health          Health check
POST   /whatsapp/send            Send 1:1 message
POST   /whatsapp/broadcast       Send broadcast
POST   /whatsapp/channel         Post channel update
GET    /webhook                  Webhook verification
POST   /webhook                  Receive WhatsApp events
```

### Frontend

```
Base URL: http://localhost:3001

/    Main page with all components
```

## Environment Variables

### Backend (.env)

```env
# WhatsApp Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_CHANNEL_ID=your_channel_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gamyo_whatsapp

# Server
PORT=3000
```

## Key Features by File

### 1:1 Messaging
- **Backend**: `messaging.service.ts`, `whatsapp.controller.ts`
- **Frontend**: `MessageComposer.tsx`
- **Database**: `sent_messages` table

### Broadcasts
- **Backend**: `broadcast.service.ts`, `whatsapp.controller.ts`
- **Frontend**: `BroadcastComposer.tsx`
- **Database**: `sent_messages` table (multiple rows)

### Channels
- **Backend**: `channel.service.ts`, `whatsapp.controller.ts`
- **Frontend**: `ChannelManager.tsx`
- **Database**: `sent_messages` table (messageType: 'channel')

### Webhooks
- **Backend**: `webhook.controller.ts`
- **Purpose**: Receive incoming messages and status updates
- **Events**: messages, message_status

## Technology Stack

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL 14
- **ORM**: TypeORM 0.3
- **HTTP Client**: Axios
- **Validation**: class-validator

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) 5
- **HTTP Client**: Axios
- **Styling**: Emotion (CSS-in-JS)

### Infrastructure
- **Database**: Docker (PostgreSQL)
- **Development**: Node.js 18+
- **Tunneling**: ngrok (for webhooks)

## Development Workflow

1. **Start Database**: `docker-compose up -d`
2. **Start Backend**: `cd backend && npm run start:dev`
3. **Start Frontend**: `cd frontend && npm start`
4. **Start Tunnel** (optional): `ngrok http 3000`
5. **Test**: Open `http://localhost:3001`

## Production Deployment

### Backend Deployment Options
- **Vercel**: Serverless functions
- **Railway**: Full Node.js hosting
- **Heroku**: Container-based hosting
- **AWS**: EC2, ECS, or Lambda
- **DigitalOcean**: Droplets or App Platform

### Frontend Deployment Options
- **Vercel**: Automatic React deployment
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Static hosting
- **Firebase Hosting**: Google's hosting

### Database Deployment Options
- **Railway**: Managed PostgreSQL
- **AWS RDS**: Managed database
- **DigitalOcean**: Managed databases
- **Supabase**: PostgreSQL with extras

## Next Steps

1. ✅ **Setup Complete**: All files created
2. 📝 **Follow**: [QUICK_START.md](QUICK_START.md) to run the app
3. 🔧 **Configure**: Add your WhatsApp credentials
4. 🧪 **Test**: Try all three messaging features
5. 📚 **Learn**: Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for details
6. 🚀 **Deploy**: Move to production when ready

---

**Happy Coding!** 🎉

