# Migration Guide: NestJS → Sails.js Stack

## Overview

This guide will help you understand the migration from the old NestJS-based backend to the new Sails.js architecture with modernized frontend.

## 🔄 Major Changes

### Backend Changes

| Component | Old Stack | New Stack |
|-----------|-----------|-----------|
| Framework | NestJS 10 | Sails.js 1.5.14+ |
| Runtime | Node.js 20 | Node.js 22 LTS |
| Database | PostgreSQL + TypeORM | MongoDB Atlas + Waterline |
| Architecture | Decorator-based | MVC Pattern |
| Dependency Injection | @Injectable() | Global Services |

### Frontend Changes

| Component | Old Stack | New Stack |
|-----------|-----------|-----------|
| UI Library | Material-UI | Tailwind CSS 3.4+ |
| Build Tool | Create React App | Vite 5 |
| React Version | 18.2 | 19.0 |
| State Management | React Context | Zustand |
| Router | React Router 6 | React Router 7 |

## 📦 Directory Structure Comparison

### Backend

**Old Structure (NestJS):**
```
backend/
├── src/
│   ├── whatsapp/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── entities/
│   ├── facebook/
│   ├── instagram/
│   ├── linkedin/
│   └── app.module.ts
```

**New Structure (Sails.js):**
```
backend-sails/
├── api/
│   ├── controllers/
│   │   ├── WhatsappController.js
│   │   ├── FacebookController.js
│   │   ├── InstagramController.js
│   │   └── LinkedinController.js
│   ├── services/
│   │   ├── WhatsappService.js
│   │   ├── FacebookService.js
│   │   ├── InstagramService.js
│   │   └── LinkedinService.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Schedule.js
│   └── policies/
│       └── isAuthenticated.js
├── config/
│   ├── routes.js
│   ├── datastores.js
│   ├── custom.js
│   └── bootstrap.js
└── app.js
```

### Frontend

**Old Structure (CRA):**
```
frontend/
├── src/
│   ├── components/
│   │   ├── MessageComposer.tsx
│   │   ├── FacebookComposer.tsx
│   │   └── ...
│   └── App.tsx
└── package.json
```

**New Structure (Vite):**
```
frontend-vite/
├── src/
│   ├── screens/
│   │   ├── Dashboard.tsx
│   │   ├── Composer.tsx
│   │   ├── Schedule.tsx
│   │   └── Analytics.tsx
│   ├── components/
│   │   └── Layout.tsx
│   ├── store/
│   │   ├── authStore.ts
│   │   └── postStore.ts
│   ├── services/
│   │   └── api.ts
│   └── App.tsx
├── index.html
└── vite.config.ts
```

## 🔧 Code Migration Examples

### 1. Service Layer

**Old (NestJS):**
```typescript
@Injectable()
export class FacebookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createPost(dto: CreatePostDto): Promise<any> {
    // ...
  }
}
```

**New (Sails.js):**
```javascript
module.exports = {
  async createPost(message, mediaId = null, scheduledTime = null) {
    const { apiUrl, pageId, accessToken } = sails.config.custom.facebook;
    // ...
  }
};
```

### 2. Controller

**Old (NestJS):**
```typescript
@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Post('create-post')
  async createPost(@Body() dto: CreatePostDto) {
    return this.facebookService.createPost(dto);
  }
}
```

**New (Sails.js):**
```javascript
module.exports = {
  createPost: async function (req, res) {
    const { message, mediaId, scheduledTime } = req.body;
    
    const result = await FacebookService.createPost(message, mediaId, scheduledTime);
    
    return res.json(result);
  }
};
```

### 3. Authentication

**Old (NestJS):**
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

**New (Sails.js):**
```javascript
// In config/policies.js
FacebookController: {
  '*': 'isAuthenticated'
}

// In api/policies/isAuthenticated.js
module.exports = async function (req, res, proceed) {
  const token = req.headers.authorization?.substring(7);
  const decoded = jwt.verify(token, sails.config.custom.jwtSecret);
  req.user = await User.findOne({ id: decoded.id });
  return proceed();
};
```

### 4. Database Models

**Old (TypeORM):**
```typescript
@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User)
  user: User;
}
```

**New (Waterline/Sails):**
```javascript
module.exports = {
  attributes: {
    content: {
      type: 'string',
      required: true,
    },
    owner: {
      model: 'user',
      required: true,
    }
  }
};
```

### 5. Frontend Components

**Old (Material-UI):**
```tsx
import { Button, TextField, Container } from '@mui/material';

function Composer() {
  return (
    <Container>
      <TextField label="Content" />
      <Button variant="contained">Publish</Button>
    </Container>
  );
}
```

**New (Tailwind CSS):**
```tsx
function Composer() {
  return (
    <div className="container mx-auto">
      <input className="input" placeholder="Content" />
      <button className="btn-primary">Publish</button>
    </div>
  );
}
```

### 6. State Management

**Old (React Context):**
```tsx
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**New (Zustand):**
```typescript
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Usage
const { user, setUser } = useAuthStore();
```

## 🗄️ Database Migration

### PostgreSQL to MongoDB

1. **Export Data from PostgreSQL:**
```bash
pg_dump -U postgres -d gamyo_whatsapp -f backup.sql
```

2. **Transform Data:**
- Convert relational data to document format
- Handle foreign keys → embedded documents or references
- Adjust data types (timestamps, UUIDs, etc.)

3. **Import to MongoDB:**
```javascript
// migration-script.js
const users = []; // Transformed from PostgreSQL
await User.createEach(users);
```

## 🚀 Deployment Changes

### Old Deployment

- Backend: Heroku/Railway (NestJS)
- Frontend: Vercel (CRA)
- Database: PostgreSQL on Render

### New Deployment

- Backend: Render/AWS ECS (Sails.js + Docker)
- Frontend: Vercel/Netlify (Vite build)
- AI Service: AWS Lambda/Google Cloud Run
- Database: MongoDB Atlas
- Cache: Redis Cloud

## ⚙️ Configuration Migration

### Environment Variables

**Old:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=gamyo_whatsapp
```

**New:**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/gamyo
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret
```

## 🧪 Testing Migration

### Backend Tests

**Old (Jest + NestJS Testing):**
```typescript
describe('FacebookService', () => {
  let service: FacebookService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FacebookService],
    }).compile();

    service = module.get<FacebookService>(FacebookService);
  });

  it('should create post', async () => {
    // ...
  });
});
```

**New (Sails Test Helpers):**
```javascript
describe('FacebookService', () => {
  it('should create post', async function() {
    const result = await FacebookService.createPost('Test content');
    expect(result.success).toBe(true);
  });
});
```

## 📝 Checklist

- [ ] Install new dependencies (Node 22, MongoDB, Redis)
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure Redis instance
- [ ] Update environment variables
- [ ] Migrate database data
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test AI service integration
- [ ] Update frontend components
- [ ] Test routing and navigation
- [ ] Verify state management
- [ ] Test production builds
- [ ] Update deployment scripts
- [ ] Configure monitoring (Sentry)

## 🐛 Common Issues & Solutions

### Issue: Sails lifts but crashes immediately
**Solution:** Check MongoDB connection string and Redis connectivity

### Issue: JWT tokens not working
**Solution:** Verify JWT_SECRET is set and policy is correctly configured

### Issue: Frontend can't connect to backend
**Solution:** Check CORS settings in `config/security.js`

### Issue: BullMQ jobs not processing
**Solution:** Ensure Redis is running and worker script is started

### Issue: AI service returns errors
**Solution:** Verify OpenAI API key and service URL configuration

## 📚 Additional Resources

- [Sails.js Documentation](https://sailsjs.com/documentation)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Support

For migration assistance:
- Open an issue on GitHub
- Check the project Wiki
- Contact: migration-support@gamyo.ai

---

**Migration completed successfully! 🎉**

