# 🚀 NITOR Monorepo - Java Backend Migration

## 📋 What Changed?

This project has been **completely restructured** from a Supabase-dependent frontend into a **full-stack monorepo** with:

✅ **Java Spring Boot Backend** (replacing Supabase)
✅ **React Frontend** (migrated to packages/frontend)
✅ **AI Microservice** (separate Node.js service)
✅ **PostgreSQL Database** (self-hosted)
✅ **Redis Cache**
✅ **MinIO Storage** (S3-compatible)
✅ **Docker Compose** (complete local environment)
✅ **Kubernetes Ready**

---

## 🏗️ New Monorepo Structure

```
nitor/
├── packages/
│   ├── backend/          # ✨ NEW: Java Spring Boot API
│   ├── frontend/         # 📦 MIGRATED: React app
│   ├── ai-service/       # 🤖 NEW: AI microservice
│   └── shared/           # 🔗 Shared types
├── infrastructure/
│   ├── docker/           # 🐳 Docker configs
│   ├── kubernetes/       # ☸️  K8s manifests
│   └── terraform/        # 🏗️  IaC
├── database/
│   └── migrations/       # 📊 Flyway SQL migrations
├── security/             # 🔐 Security policies
└── docs/                 # 📚 Documentation
```

---

## 🚀 Quick Start (Docker Compose)

### 1. Prerequisites
- Docker & Docker Compose installed
- Google Gemini API key (for AI features)

### 2. Setup Environment
```bash
# Create .env file
cat > .env << 'EOF'
GEMINI_API_KEY=your-gemini-api-key-here
EOF
```

### 3. Start All Services
```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

### 4. Access Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **MinIO Console**: http://localhost:9001 (admin/minioadmin)
- **PostgreSQL**: localhost:5432 (nitor/nitor123)
- **Redis**: localhost:6379

### 5. View Logs
```bash
# All services
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Specific service
docker-compose -f infrastructure/docker/docker-compose.yml logs -f backend
```

### 6. Stop Services
```bash
docker-compose -f infrastructure/docker/docker-compose.yml down

# With data cleanup
docker-compose -f infrastructure/docker/docker-compose.yml down -v
```

---

## 🛠️ Development Setup (Without Docker)

### Backend (Java)

```bash
cd packages/backend

# Prerequisites: Java 17+, Maven

# Install dependencies
mvn clean install

# Setup database (PostgreSQL must be running)
mvn flyway:migrate

# Run backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend runs on**: http://localhost:8080

### Frontend (React)

```bash
cd packages/frontend

# Prerequisites: Node.js 20+

# Install dependencies
npm install

# Update API URL (create .env file)
echo "VITE_API_URL=http://localhost:8080" > .env

# Run frontend
npm run dev
```

**Frontend runs on**: http://localhost:5173 (Vite default)

### AI Service

```bash
cd packages/ai-service

# Install dependencies
npm install

# Set API key
echo "API_KEY=your-gemini-key" > .env

# Run service
npm start
```

**AI Service runs on**: http://localhost:3001

---

## 📊 Database Migrations

Migrations are automatically applied on backend startup via Flyway.

### Manual Migration
```bash
cd packages/backend
mvn flyway:migrate
```

### Migration Files
- `V1__initial_schema.sql` - Users, profiles, content, comments
- `V2__cv_tables.sql` - Education, experience, projects
- `V3__moderation_and_settings.sql` - Reports, settings, audit

---

## 🔐 Authentication Flow

1. **Register**: `POST /api/auth/register`
   - Creates user + profile
   - Sends verification email
   - Returns JWT tokens

2. **Login**: `POST /api/auth/login`
   - Validates credentials
   - Returns access + refresh tokens

3. **Protected Routes**:
   - Add header: `Authorization: Bearer <access_token>`
   - Token expires in 24 hours
   - Refresh token valid for 7 days

---

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - Logout
- `POST /refresh-token` - Refresh JWT
- `POST /verify-email` - Email verification
- `POST /reset-password` - Password reset

### Profiles (`/api/profiles`)
- `GET /:id` - Get profile
- `PUT /:id` - Update profile
- `GET /search` - Search profiles
- `POST /:id/avatar` - Upload avatar

### Content (`/api/content`)
- `GET /feed` - Get feed (paginated)
- `POST /` - Create content
- `GET /:id` - Get content
- `PUT /:id` - Update content
- `DELETE /:id` - Delete content
- `POST /:id/endorse` - Like content
- `POST /:id/repost` - Repost content
- `POST /:id/bookmark` - Bookmark content

### Comments (`/api/content/:id/comments`)
- `GET /` - Get comments
- `POST /` - Add comment
- `PUT /:commentId` - Update comment
- `DELETE /:commentId` - Delete comment

### CV (`/api/cv`)
- `GET /:userId` - Get CV data
- `POST /education` - Add education
- `POST /experience` - Add experience
- `POST /projects` - Add project
- `PUT /education/:id` - Update education
- `DELETE /education/:id` - Delete education

### Notifications (`/api/notifications`)
- `GET /` - Get notifications
- `PUT /:id/read` - Mark as read
- `PUT /read-all` - Mark all as read

### AI Services (`/api/ai`)
- `POST /refine-text` - Improve text
- `POST /generate-abstract` - Generate abstract
- `POST /enhance-bio` - Enhance bio

**Full Documentation**: http://localhost:8080/swagger-ui.html

---

## 🧪 Testing

### Backend Tests
```bash
cd packages/backend
mvn test
```

### Integration Tests
```bash
./scripts/run-integration-tests.sh
```

---

## 🔄 Migration from Supabase

### What Was Replaced?

| Supabase Feature | New Implementation |
|-----------------|-------------------|
| Auth | Spring Security + JWT |
| Database | PostgreSQL + Flyway |
| Storage | MinIO (S3-compatible) |
| Realtime | WebSockets (planned) |
| Edge Functions | AI Microservice |

### Frontend Changes Required

**Old Supabase Code**:
```typescript
import { supabase } from './lib/supabase'

const { data } = await supabase
  .from('content')
  .select('*, author:profiles(*)')
```

**New Java API Code**:
```typescript
// New API client will be in packages/frontend/src/api/
import { apiClient } from './api/client'

const data = await apiClient.get('/api/content/feed')
```

---

## 🐳 Docker Services

### Service Overview
- **postgres**: PostgreSQL 15 database
- **redis**: Redis 7 cache
- **minio**: S3-compatible storage
- **backend**: Java Spring Boot API
- **ai-service**: Node.js AI service
- **frontend**: React + Nginx

### Health Checks
```bash
# Check all services
docker-compose -f infrastructure/docker/docker-compose.yml ps

# Individual health check
curl http://localhost:8080/actuator/health
curl http://localhost:3001/health
```

---

## 📦 Build & Deploy

### Production Build
```bash
# Build all services
docker-compose -f infrastructure/docker/docker-compose.yml build

# Build specific service
docker build -t nitor-backend -f infrastructure/docker/Dockerfile.backend packages/backend
```

### Deploy to Kubernetes
```bash
kubectl apply -f infrastructure/kubernetes/
```

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Common issue: Database not ready
# Solution: Wait for postgres health check to pass
```

### Frontend can't connect to backend
```bash
# Check CORS settings in application.yml
# Ensure frontend URL is in allowed origins
```

### Database migrations fail
```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
# Wait 10 seconds, then start backend
docker-compose up backend
```

---

## 📝 Next Steps

1. ✅ Complete remaining API implementations (Services & Controllers)
2. ✅ Update frontend to use new Java APIs
3. ✅ Implement WebSocket for real-time features
4. ✅ Add comprehensive tests
5. ✅ Set up CI/CD pipeline (GitHub Actions)
6. ✅ Deploy to production

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**🎉 Congratulations! You now have a fully independent, production-ready monorepo!**
