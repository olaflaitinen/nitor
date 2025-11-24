# NITOR Local Deployment Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-24
**Deployment Type:** Local Development & Testing

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
- [Manual Deployment (No Docker)](#manual-deployment-no-docker)
- [Configuration](#configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Development Workflow](#development-workflow)

---

## Overview

This guide provides complete instructions for deploying NITOR locally for development, testing, and evaluation purposes. Two deployment methods are available:

1. **Docker Compose (Recommended)** - Automated deployment with all dependencies
2. **Manual Deployment** - Individual service deployment for development

---

## Prerequisites

### For Docker Deployment

**Required:**
- Docker 24+ ([Installation Guide](https://docs.docker.com/get-docker/))
- Docker Compose 2.20+ (included with Docker Desktop)
- Git 2.30+
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

**Optional:**
- make (for convenience scripts)
- curl (for health checks)

### For Manual Deployment

**Required:**
- Java 17+ ([Download OpenJDK](https://adoptium.net/))
- Maven 3.8+ ([Installation Guide](https://maven.apache.org/install.html))
- Node.js 20+ and npm 10+ ([Download](https://nodejs.org/))
- PostgreSQL 15+ ([Installation Guide](https://www.postgresql.org/download/))
- Redis 7+ ([Installation Guide](https://redis.io/download))
- Git 2.30+

**Optional:**
- MinIO (for file storage) ([Download](https://min.io/download))
- PostgreSQL GUI (pgAdmin, DBeaver)
- Redis GUI (RedisInsight)

---

## Quick Start (Docker)

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/olaflaitinen/nitor.git
cd nitor

# Verify you're in the correct directory
pwd  # Should end with /nitor
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables (required)
nano .env  # or vim, code, etc.
```

**Required Configuration:**

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=nitor
DB_USER=nitor
DB_PASSWORD=your_secure_password_here

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT (Generate a strong 256-bit secret)
JWT_SECRET=your_256_bit_secret_key_here
JWT_ACCESS_TOKEN_EXPIRATION=86400000
JWT_REFRESH_TOKEN_EXPIRATION=604800000

# Email (SendGrid)
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_FROM=no-reply@nitor.io

# AI Service (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# MinIO (Object Storage)
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_BUCKET_NAME=nitor-files

# OAuth (Optional)
GOOGLE_OAUTH_ENABLED=false
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_OAUTH_ENABLED=false
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

LINKEDIN_OAUTH_ENABLED=false
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### Step 3: Start All Services

```bash
# Method 1: Using convenience script (recommended)
./scripts/start-dev.sh

# Method 2: Direct docker-compose command
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Method 3: Using make (if available)
make start
```

**Expected Output:**

```
[+] Running 6/6
 ✓ Container nitor-postgres     Started
 ✓ Container nitor-redis        Started
 ✓ Container nitor-minio        Started
 ✓ Container nitor-backend      Started
 ✓ Container nitor-ai-service   Started
 ✓ Container nitor-frontend     Started
```

### Step 4: Verify Deployment

```bash
# Check all services are running
docker-compose -f infrastructure/docker/docker-compose.yml ps

# Check logs
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Test health endpoints
curl http://localhost:8080/actuator/health  # Backend
curl http://localhost:3001/health           # AI Service
curl http://localhost:5173                   # Frontend
```

### Step 5: Access Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React Application |
| **Backend API** | http://localhost:8080 | REST API |
| **API Docs** | http://localhost:8080/swagger-ui.html | Interactive API Documentation |
| **AI Service** | http://localhost:3001 | Gemini AI Service |
| **MinIO Console** | http://localhost:9001 | File Storage Console |
| **Health Check** | http://localhost:8080/actuator/health | System Health Status |
| **Metrics** | http://localhost:8080/actuator/prometheus | Prometheus Metrics |

**Default Credentials:**

```
Email: test@example.com
Password: password123

MinIO Console:
Username: minioadmin
Password: minioadmin
```

### Step 6: Stop Services

```bash
# Method 1: Using convenience script
./scripts/stop-dev.sh

# Method 2: Direct docker-compose command
docker-compose -f infrastructure/docker/docker-compose.yml down

# To also remove volumes (clean slate)
docker-compose -f infrastructure/docker/docker-compose.yml down -v
```

---

## Manual Deployment (No Docker)

### Step 1: Install Dependencies

#### PostgreSQL Setup

```bash
# Install PostgreSQL 15
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-15 postgresql-contrib

# macOS (Homebrew)
brew install postgresql@15

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql@15  # macOS
```

#### Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE nitor;
CREATE USER nitor WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nitor TO nitor;

# Exit psql
\q
```

#### Redis Setup

```bash
# Install Redis 7
# Ubuntu/Debian
sudo apt install redis-server

# macOS (Homebrew)
brew install redis

# Start Redis
sudo systemctl start redis  # Linux
brew services start redis  # macOS

# Verify Redis is running
redis-cli ping  # Should return PONG
```

#### MinIO Setup (Optional)

```bash
# Download MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Start MinIO
mkdir -p ~/minio/data
minio server ~/minio/data --console-address ":9001"

# Create bucket
# Access http://localhost:9001 and create bucket named "nitor-files"
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your local configuration
nano .env
```

**Update for local development:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nitor
DB_USER=nitor
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379

# Rest of configuration same as Docker setup
```

### Step 3: Deploy Backend

```bash
# Navigate to backend directory
cd packages/backend

# Install dependencies and compile
mvn clean install

# Run database migrations (Flyway runs automatically)
# On first startup, all migrations will be applied

# Start backend in development mode
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or build and run JAR
mvn clean package -DskipTests
java -jar target/nitor-backend-1.0.0.jar --spring.profiles.active=dev
```

**Backend should start on port 8080:**

```
Started NitorApplication in 12.345 seconds
```

**Verify Backend:**

```bash
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}

curl http://localhost:8080/api/auth/health
# Expected: {"status":"healthy"}
```

### Step 4: Deploy AI Service

```bash
# Navigate to AI service directory
cd packages/ai-service

# Install dependencies
npm install

# Start AI service
npm start

# Or for development with auto-reload
npm run dev
```

**AI Service should start on port 3001:**

```
AI Service running on http://localhost:3001
```

**Verify AI Service:**

```bash
curl http://localhost:3001/health
# Expected: {"status":"healthy","model":"gemini-2.5-pro"}
```

### Step 5: Deploy Frontend

```bash
# Navigate to frontend directory
cd packages/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

**Frontend should start on port 5173:**

```
VITE v6.0.0  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Verify Frontend:**

Open browser and navigate to http://localhost:5173

### Step 6: Seed Database (Optional)

```bash
# Navigate to backend
cd packages/backend

# Run with dev profile (seeds automatically)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or manually via SQL
psql -U nitor -d nitor -f src/main/resources/db/seed/seed-dev-data.sql
```

---

## Configuration

### Database Configuration

**application.yml (Backend):**

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:nitor}
    username: ${DB_USER:nitor}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: ${SHOW_SQL:false}
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
```

### Redis Configuration

```yaml
spring:
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    timeout: 60000
```

### JWT Configuration

```yaml
jwt:
  secret: ${JWT_SECRET}
  access-token-expiration: ${JWT_ACCESS_TOKEN_EXPIRATION:86400000}
  refresh-token-expiration: ${JWT_REFRESH_TOKEN_EXPIRATION:604800000}
```

### Email Configuration

```yaml
spring:
  mail:
    host: ${MAIL_HOST:smtp.sendgrid.net}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

---

## Verification

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Backend metrics
curl http://localhost:8080/actuator/prometheus

# AI Service health
curl http://localhost:3001/health

# Test AI endpoint
curl -X POST http://localhost:3001/api/ai/refine-text \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a test sentence."}'
```

### Database Verification

```bash
# Connect to database
psql -U nitor -d nitor

# Check tables
\dt

# Check migrations
SELECT * FROM flyway_schema_history;

# Check users
SELECT id, email, full_name FROM users LIMIT 5;

# Exit
\q
```

### API Testing

```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "fullName": "Test User",
    "handle": "testuser"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port
lsof -i :8080  # Backend
lsof -i :5173  # Frontend
lsof -i :3001  # AI Service

# Kill process
kill -9 <PID>

# Or use different ports
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

#### 2. Database Connection Failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Test connection
psql -U nitor -d nitor -h localhost

# Reset database
dropdb nitor
createdb nitor
```

#### 3. Flyway Migration Error

```bash
# Clean Flyway metadata
psql -U nitor -d nitor
DELETE FROM flyway_schema_history;

# Or repair
mvn flyway:repair

# Or clean and restart
mvn flyway:clean
mvn spring-boot:run
```

#### 4. Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# Restart Redis
sudo systemctl restart redis  # Linux
brew services restart redis  # macOS

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

#### 5. AI Service Error

```bash
# Check Gemini API key
echo $GEMINI_API_KEY

# Test Gemini API directly
curl -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'

# Check AI service logs
cd packages/ai-service
npm start  # Check console output
```

#### 6. Docker Issues

```bash
# Check Docker is running
docker ps

# View container logs
docker-compose -f infrastructure/docker/docker-compose.yml logs backend
docker-compose -f infrastructure/docker/docker-compose.yml logs ai-service
docker-compose -f infrastructure/docker/docker-compose.yml logs frontend

# Restart specific service
docker-compose -f infrastructure/docker/docker-compose.yml restart backend

# Complete reset
docker-compose -f infrastructure/docker/docker-compose.yml down -v
docker system prune -a
./scripts/start-dev.sh
```

### Log Locations

**Docker Logs:**
```bash
docker-compose -f infrastructure/docker/docker-compose.yml logs -f
docker logs nitor-backend -f
docker logs nitor-ai-service -f
docker logs nitor-frontend -f
```

**Manual Deployment Logs:**
- Backend: `packages/backend/logs/nitor.log`
- AI Service: Console output
- Frontend: Console output
- PostgreSQL: `/var/log/postgresql/postgresql-15-main.log`
- Redis: `/var/log/redis/redis-server.log`

---

## Development Workflow

### Hot Reload Development

**Backend (Spring Boot DevTools):**
```bash
cd packages/backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Changes to Java files will trigger automatic restart
```

**Frontend (Vite HMR):**
```bash
cd packages/frontend
npm run dev

# Changes to React components will hot reload instantly
```

**AI Service (nodemon):**
```bash
cd packages/ai-service
npm run dev

# Changes to JS files will trigger automatic restart
```

### Database Management

**Create Migration:**
```bash
cd packages/backend/src/main/resources/db/migration

# Create new migration file
# Format: V{version}__{description}.sql
# Example: V4__add_bookmarks_table.sql

CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    content_id BIGINT NOT NULL REFERENCES content(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);
```

**Apply Migration:**
```bash
# Migrations apply automatically on next backend startup
mvn spring-boot:run
```

### Testing

**Backend Tests:**
```bash
cd packages/backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Run with coverage
mvn test jacoco:report
```

**Frontend Tests:**
```bash
cd packages/frontend

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Building for Production

**Backend:**
```bash
cd packages/backend
mvn clean package -DskipTests
# Output: target/nitor-backend-1.0.0.jar
```

**Frontend:**
```bash
cd packages/frontend
npm run build
# Output: dist/
```

**AI Service:**
```bash
cd packages/ai-service
npm install --production
# Ready to deploy with: node src/server.js
```

---

## Performance Optimization

### Database

```sql
-- Add indexes for common queries
CREATE INDEX idx_content_author ON content(author_id);
CREATE INDEX idx_content_created ON content(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_profiles_handle ON profiles(handle);

-- Analyze tables
ANALYZE users;
ANALYZE profiles;
ANALYZE content;
```

### Redis Caching

```yaml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 3600000  # 1 hour
      cache-null-values: false
```

### Backend

```yaml
# application-prod.yml
server:
  port: 8080
  compression:
    enabled: true
  tomcat:
    max-threads: 200
    max-connections: 10000

spring:
  jpa:
    show-sql: false
    properties:
      hibernate:
        jdbc:
          batch_size: 20
```

---

## Security Checklist

- [ ] Change default passwords in .env
- [ ] Generate strong JWT secret (256+ bits)
- [ ] Enable HTTPS in production
- [ ] Configure CORS for production domain
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure secure headers
- [ ] Regular dependency updates
- [ ] Database encryption at rest
- [ ] Backup strategy configured

---

## Next Steps

After successful local deployment:

1. **Explore the Application**
   - Create account at http://localhost:5173
   - Test all features
   - Review API documentation at http://localhost:8080/swagger-ui.html

2. **Development**
   - Read [CONTRIBUTING.md](../CONTRIBUTING.md)
   - Set up IDE with proper formatting
   - Enable hot reload for efficient development

3. **Production Deployment**
   - Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - Set up production infrastructure
   - Configure CI/CD pipeline

---

## Support

**Documentation:**
- [API Documentation](API_DOCUMENTATION.md)
- [User Guide](USER_GUIDE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)

**Issues:**
- GitHub Issues: https://github.com/olaflaitinen/nitor/issues
- Email: support@nitor.io

---

**NITOR Local Deployment Guide v1.0.0** • [Back to Documentation](../README.md)
