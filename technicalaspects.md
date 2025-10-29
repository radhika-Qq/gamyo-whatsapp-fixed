# Technical Aspects & Implementation Details

Comprehensive technical documentation for the Gamyo WhatsApp Business API Integration.

## 🏛️ Architecture & Design

### System Architecture

The application follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION TIER (Frontend)                       │
│  React 18 + TypeScript + Material-UI               │
│  Single Page Application (SPA)                      │
│  Port: 3001                                         │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ REST API (JSON)
                   │ HTTP/HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│  APPLICATION TIER (Backend)                         │
│  NestJS + TypeScript                                │
│  RESTful API Server                                 │
│  Port: 3000                                         │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │  Controllers (HTTP Layer)                │      │
│  │  - Request handling                      │      │
│  │  - Response formatting                   │      │
│  │  - Validation (DTOs)                     │      │
│  └──────────────┬──────────────────────────┘      │
│                 │                                   │
│  ┌─────────────────────────────────────────┐      │
│  │  Services (Business Logic)               │      │
│  │  - Core functionality                    │      │
│  │  - External API integration             │      │
│  │  - Data processing                       │      │
│  └──────────────┬──────────────────────────┘      │
│                 │                                   │
│  ┌─────────────────────────────────────────┐      │
│  │  Repository Layer (Data Access)          │      │
│  │  - TypeORM repositories                  │      │
│  │  - Database operations                   │      │
│  └──────────────┬──────────────────────────┘      │
└─────────────────┼───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  DATA TIER (Persistence)                            │
│  PostgreSQL 14                                      │
│  Port: 5432                                         │
└─────────────────────────────────────────────────────┘
```

### Design Patterns

**Backend (NestJS):**
- **Dependency Injection (DI)** - IoC container for loose coupling
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Data validation and transformation
- **Module Pattern** - Feature-based organization
- **Decorator Pattern** - Metadata for routing and validation

**Frontend (React):**
- **Component Pattern** - Reusable UI building blocks
- **Container/Presentational** - Logic separation
- **Hooks Pattern** - State management with useState/useEffect
- **Provider Pattern** - Theme and context distribution

## 🔧 Technology Stack Deep Dive

### Backend Technologies

#### NestJS Framework
- **Version**: 10.x
- **Architecture**: Modular, scalable Node.js framework
- **Features Used**:
  - Dependency Injection
  - Decorators (@Controller, @Injectable, @Get, @Post)
  - Middleware and Guards
  - Exception Filters
  - Validation Pipes

#### TypeORM
- **Version**: 0.3.17
- **Pattern**: Data Mapper (Repository pattern)
- **Features**:
  - Entity decorators (@Entity, @Column, @PrimaryGeneratedColumn)
  - Auto schema synchronization (development only)
  - Query builder
  - Transactions support
  - Migrations (production)

#### PostgreSQL
- **Version**: 14
- **Deployment**: Docker container
- **Configuration**:
  - Database: `gamyo_whatsapp`
  - Port: 5432
  - User: postgres
  - Persistent volume: postgres_data

#### Additional Backend Libraries
- **class-validator**: DTO validation with decorators
- **class-transformer**: Object transformation and serialization
- **axios**: HTTP client for WhatsApp API calls
- **rxjs**: Reactive programming for async operations

### Frontend Technologies

#### React
- **Version**: 18.2.0
- **Features Used**:
  - Functional components
  - Hooks (useState, useEffect)
  - StrictMode for development checks
  - Synthetic events

#### Material-UI (MUI)
- **Version**: 5.14.0
- **Components Used**:
  - Layout: Container, Box, Grid, Paper
  - Navigation: Tabs, Tab, AppBar, Toolbar
  - Inputs: TextField, Button, Checkbox
  - Feedback: Snackbar, CircularProgress, Alert
  - Data Display: Typography, Divider
- **Theming**: Custom WhatsApp green theme (#25D366)

#### TypeScript
- **Version**: 4.9.5 (Frontend) / 5.1.3 (Backend)
- **Benefits**:
  - Type safety at compile time
  - IntelliSense support
  - Better refactoring
  - Self-documenting code

## 📊 Database Design

### Entity-Relationship Diagram

```
┌─────────────────────────────────────────┐
│           contacts                      │
├─────────────────────────────────────────┤
│ id: SERIAL PRIMARY KEY                  │
│ phone: VARCHAR(20) UNIQUE NOT NULL      │
│ name: VARCHAR(255)                      │
│ optedIn: BOOLEAN DEFAULT false          │
│ createdAt: TIMESTAMP DEFAULT NOW()      │
│ updatedAt: TIMESTAMP DEFAULT NOW()      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           templates                     │
├─────────────────────────────────────────┤
│ id: SERIAL PRIMARY KEY                  │
│ name: VARCHAR(255) UNIQUE NOT NULL      │
│ content: TEXT                           │
│ language: VARCHAR(10) DEFAULT 'en_US'   │
│ status: VARCHAR(50) DEFAULT 'APPROVED'  │
│ createdAt: TIMESTAMP DEFAULT NOW()      │
│ updatedAt: TIMESTAMP DEFAULT NOW()      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        sent_messages                    │
├─────────────────────────────────────────┤
│ id: SERIAL PRIMARY KEY                  │
│ phone: VARCHAR(20) NOT NULL             │
│ message: TEXT                           │
│ whatsappMessageId: VARCHAR(255)         │
│ status: VARCHAR(50) DEFAULT 'pending'   │
│ errorMessage: TEXT                      │
│ messageType: VARCHAR(50)                │
│ templateName: VARCHAR(255)              │
│ createdAt: TIMESTAMP DEFAULT NOW()      │
└─────────────────────────────────────────┘
```

### Indexes

**Automatic Indexes:**
- Primary keys (id columns) - B-tree index
- Unique constraints (phone, template name) - B-tree index

**Recommended Additional Indexes for Production:**
```sql
CREATE INDEX idx_sent_messages_phone ON sent_messages(phone);
CREATE INDEX idx_sent_messages_status ON sent_messages(status);
CREATE INDEX idx_sent_messages_created ON sent_messages(createdAt DESC);
CREATE INDEX idx_contacts_opted_in ON contacts(optedIn) WHERE optedIn = true;
```

### Message Status Flow

```
pending → sent → delivered → read
   ↓
failed (with errorMessage)
```

## 🔌 API Documentation

### REST API Endpoints

#### 1. Health Check

**Endpoint:** `GET /whatsapp/health`

**Description:** Check if the API is running

**Response:**
```json
{
  "status": "ok",
  "message": "WhatsApp API is running"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

#### 2. Send 1:1 Message

**Endpoint:** `POST /whatsapp/send`

**Description:** Send a message to a single WhatsApp user

**Request Body:**
```json
{
  "phone": "919876543210",
  "message": "Hello from Gamyo!"
}
```

**Validation Rules:**
- `phone`: Required, string, 10-15 digits
- `message`: Required, string, min 1 character

**Response (Success):**
```json
{
  "messages": [
    {
      "id": "wamid.HBgNOTE5ODc2NTQzMjEwFQIAERgSNEI5N0M5OTY3RTk3RTI1ODAzAA=="
    }
  ],
  "contacts": [
    {
      "input": "919876543210",
      "wa_id": "919876543210"
    }
  ]
}
```

**Response (Error):**
```json
{
  "statusCode": 400,
  "message": "Failed to send message: Invalid phone number",
  "error": "Bad Request"
}
```

**Status Codes:**
- `200 OK` - Message sent successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Invalid access token
- `500 Internal Server Error` - Server error

---

#### 3. Send Broadcast Message

**Endpoint:** `POST /whatsapp/broadcast`

**Description:** Send a template message to multiple contacts

**Request Body:**
```json
{
  "templateName": "hello_world",
  "contacts": [
    "919876543210",
    "918765432109",
    "917654321098"
  ]
}
```

**Validation Rules:**
- `templateName`: Required, string
- `contacts`: Required, array of phone numbers (min 1, max 250)

**Response:**
```json
{
  "totalContacts": 3,
  "successCount": 3,
  "failedCount": 0,
  "results": [
    {
      "phone": "919876543210",
      "success": true,
      "messageId": "wamid.HBgNOTE5ODc2NTQzMjEw..."
    },
    {
      "phone": "918765432109",
      "success": true,
      "messageId": "wamid.HBgNOTE4NzY1NDMyMTA5..."
    },
    {
      "phone": "917654321098",
      "success": true,
      "messageId": "wamid.HBgNOTE3NjU0MzIxMDk4..."
    }
  ]
}
```

**Rate Limiting:**
- 1 second delay between messages
- Processes in batches of 250

**Status Codes:**
- `200 OK` - Broadcast completed (check individual results)
- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

---

#### 4. Post Channel Update

**Endpoint:** `POST /whatsapp/channel`

**Description:** Post an update to your WhatsApp Channel

**Request Body:**
```json
{
  "message": "New product launch tomorrow! Stay tuned!"
}
```

**Validation Rules:**
- `message`: Required, string, min 1 character

**Response:**
```json
{
  "success": true,
  "messageId": "wamid.HBgNOTE5ODc2NTQzMjEw..."
}
```

**Status Codes:**
- `200 OK` - Channel update posted
- `400 Bad Request` - Validation error
- `404 Not Found` - Channel ID not configured
- `500 Internal Server Error` - Server error

---

#### 5. Webhook Verification

**Endpoint:** `GET /webhook`

**Description:** Verify webhook for Meta (required for setup)

**Query Parameters:**
- `hub.mode`: "subscribe"
- `hub.challenge`: Random string from Meta
- `hub.verify_token`: Your verify token

**Response:**
- Returns the `hub.challenge` value if token matches

**Status Codes:**
- `200 OK` - Verification successful
- `403 Forbidden` - Invalid verify token

---

#### 6. Receive Webhook Events

**Endpoint:** `POST /webhook`

**Description:** Receive incoming messages and status updates from WhatsApp

**Request Body (Message Event):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "123456789",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15551234567",
              "phone_number_id": "123456789"
            },
            "messages": [
              {
                "from": "919876543210",
                "id": "wamid.HBgNOTE5ODc2NTQzMjEw...",
                "timestamp": "1634567890",
                "text": {
                  "body": "Hello!"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

**Request Body (Status Event):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "123456789",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15551234567",
              "phone_number_id": "123456789"
            },
            "statuses": [
              {
                "id": "wamid.HBgNOTE5ODc2NTQzMjEw...",
                "status": "delivered",
                "timestamp": "1634567900",
                "recipient_id": "919876543210"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "status": "EVENT_RECEIVED"
}
```

**Status Codes:**
- `200 OK` - Event received and processed

---

### WhatsApp Business API Integration

#### API Endpoints Used

**Base URL:** `https://graph.facebook.com/v18.0`

**Send Message:**
```http
POST /{phone-number-id}/messages
Content-Type: application/json
Authorization: Bearer {access-token}

{
  "messaging_product": "whatsapp",
  "to": "919876543210",
  "type": "template",
  "template": {
    "name": "hello_world",
    "language": {
      "code": "en_US"
    }
  }
}
```

**Response:**
```json
{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "919876543210",
      "wa_id": "919876543210"
    }
  ],
  "messages": [
    {
      "id": "wamid.HBgNOTE5ODc2NTQzMjEw..."
    }
  ]
}
```

#### Authentication

**Method:** Bearer Token Authentication

**Header:**
```
Authorization: Bearer {access-token}
```

**Token Types:**
1. **Temporary Access Token**
   - Valid for 24 hours
   - Generated in Meta Developer Portal
   - For testing and development

2. **Permanent System User Token**
   - No expiration
   - Generated via Business Settings → System Users
   - Required for production

#### Rate Limits

**Test Mode (Temporary Token):**
- 1,000 conversations per month
- 250 messages per day
- 5 test phone numbers maximum
- 80 API calls per second

**Production:**
- Conversation-based pricing
- Higher rate limits (10,000+ messages/day)
- Unlimited phone numbers
- 80-200 API calls per second (tier-based)

## 🔐 Security Implementation

### Environment Variables

**Security Best Practices:**
- Never commit `.env` files to Git (in .gitignore)
- Use different tokens for dev/staging/production
- Rotate access tokens periodically
- Use system user tokens in production

### CORS Configuration

```typescript
app.enableCors({
  origin: 'http://localhost:3001',  // Whitelist frontend
  methods: 'GET,POST',                // Allowed HTTP methods
  credentials: true,                  // Allow cookies
});
```

**Production CORS:**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,  // From environment variable
  methods: 'GET,POST',
  credentials: true,
});
```

### Webhook Verification

**Verification Flow:**
1. Meta sends GET request with challenge
2. Backend verifies token matches `.env` value
3. Returns challenge if valid
4. Meta enables webhook

**Implementation:**
```typescript
@Get()
verifyWebhook(@Query() query: any) {
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

  if (mode === 'subscribe' && token === this.VERIFY_TOKEN) {
    return challenge;  // Verification success
  }
  throw new ForbiddenException('Invalid verification token');
}
```

### Input Validation

**DTO Validation with class-validator:**

```typescript
import { IsNotEmpty, IsString, IsArray, Length } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
```

**Global Validation Pipe:**
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // Strip unknown properties
  forbidNonWhitelisted: true,  // Throw error on unknown properties
  transform: true,        // Auto-transform payloads
}));
```

## 📈 Performance Optimization

### Backend Optimizations

**1. Database Connection Pooling**
```typescript
TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'postgres',
    // Connection pool settings
    extra: {
      max: 20,           // Maximum connections
      min: 5,            // Minimum connections
      idleTimeoutMillis: 30000,
    },
  }),
})
```

**2. HTTP Client Configuration**
```typescript
HttpModule.register({
  timeout: 10000,      // 10 second timeout
  maxRedirects: 5,     // Maximum redirects
  httpsAgent: new https.Agent({
    keepAlive: true,   // Reuse connections
  }),
})
```

**3. Rate Limiting for Broadcasts**
```typescript
async sendBroadcast(templateName: string, contacts: string[]) {
  const results = [];
  for (const contact of contacts) {
    // Send message
    results.push(await this.sendMessage(contact));
    // Rate limit: 1 second delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return results;
}
```

### Frontend Optimizations

**1. Code Splitting**
- React.lazy() for component-level splitting
- Dynamic imports for large dependencies

**2. Memoization**
```typescript
const memoizedCallback = useCallback(() => {
  // Expensive operation
}, [dependencies]);
```

**3. Debouncing User Input**
```typescript
const debouncedSearch = useMemo(
  () => debounce((value) => {
    // Search API call
  }, 500),
  []
);
```

## 🧪 Testing Strategy

### Unit Testing

**Backend (Jest):**
```typescript
describe('MessagingService', () => {
  it('should send a message successfully', async () => {
    const result = await service.sendMessage('919876543210', 'Hello');
    expect(result.messages).toBeDefined();
    expect(result.messages[0].id).toBeTruthy();
  });

  it('should handle invalid phone number', async () => {
    await expect(
      service.sendMessage('invalid', 'Hello')
    ).rejects.toThrow('Invalid phone number');
  });
});
```

**Frontend (React Testing Library):**
```typescript
describe('MessageComposer', () => {
  it('renders phone input', () => {
    render(<MessageComposer />);
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it('shows error for empty phone', async () => {
    render(<MessageComposer />);
    fireEvent.click(screen.getByText(/send/i));
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
```

### Integration Testing

**API Testing with Supertest:**
```typescript
describe('POST /whatsapp/send', () => {
  it('should send message', () => {
    return request(app.getHttpServer())
      .post('/whatsapp/send')
      .send({ phone: '919876543210', message: 'Test' })
      .expect(200)
      .expect((res) => {
        expect(res.body.messages).toBeDefined();
      });
  });
});
```

### End-to-End Testing

**Recommended Tools:**
- **Cypress** - Frontend E2E testing
- **Playwright** - Full application E2E testing

## 🚀 Deployment Architecture

### Production Architecture

```
┌─────────────────────────────────────────────┐
│         CDN (CloudFront / Cloudflare)       │
│         Frontend Static Assets              │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         Load Balancer (ALB / Nginx)         │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌─────────────┐    ┌─────────────┐
│  Backend    │    │  Backend    │  (Multiple instances)
│  Instance 1 │    │  Instance 2 │
└──────┬──────┘    └──────┬──────┘
       │                  │
       └────────┬─────────┘
                ▼
┌─────────────────────────────────────────────┐
│     Managed PostgreSQL (RDS / Railway)      │
└─────────────────────────────────────────────┘
```

### Environment Configuration

**Development:**
- `NODE_ENV=development`
- TypeORM synchronize: `true`
- Detailed logging
- CORS: localhost

**Production:**
- `NODE_ENV=production`
- TypeORM synchronize: `false` (use migrations)
- Minimal logging
- CORS: production domain
- HTTPS only
- Database SSL enabled

### Migration Strategy

**Create Migration:**
```bash
npm run typeorm migration:create -- -n CreateContactsTable
```

**Run Migrations:**
```bash
npm run typeorm migration:run
```

**Revert Migration:**
```bash
npm run typeorm migration:revert
```

## 📊 Monitoring & Logging

### Logging Implementation

**NestJS Logger:**
```typescript
private readonly logger = new Logger(MessagingService.name);

this.logger.log('Message sent successfully');
this.logger.error('Failed to send message', error.stack);
this.logger.warn('Rate limit approaching');
this.logger.debug('Request payload: ', payload);
```

### Recommended Monitoring Tools

**Application Performance:**
- **New Relic** - APM and error tracking
- **DataDog** - Infrastructure and application monitoring
- **Sentry** - Error tracking and debugging

**Database Monitoring:**
- **pgAdmin** - PostgreSQL management
- **DataDog** - Database performance metrics
- **CloudWatch** (AWS) - RDS monitoring

**Logging Aggregation:**
- **CloudWatch Logs** (AWS)
- **Loggly** - Log management
- **ELK Stack** - Elasticsearch, Logstash, Kibana

## 🔄 CI/CD Pipeline

### Recommended Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy backend to Railway/Heroku/AWS

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build and deploy
        run: |
          cd frontend
          npm run build
          # Deploy to Vercel/Netlify/S3
```

## 📚 Additional Technical Considerations

### Scalability

**Horizontal Scaling:**
- Stateless backend design
- Load balancer distribution
- Session management (if needed): Redis

**Database Scaling:**
- Read replicas for reporting queries
- Connection pooling
- Query optimization with indexes

### High Availability

- Multi-region deployment
- Database replication
- Health checks and auto-recovery
- Webhook retry mechanism

### Data Retention

**Recommendations:**
- Archive old messages (>90 days) to cold storage
- Implement data retention policies
- Comply with GDPR/data privacy regulations

---

**This technical documentation provides a comprehensive guide for developers working on or deploying this WhatsApp Business API integration.** 🚀

