# NITOR Production Deployment - Complete Guide

**Version:** 1.0.0
**Last Updated:** November 28, 2025
**Status:** Production Ready

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Required Credentials & API Keys](#required-credentials--api-keys)
- [Environment Variables Complete List](#environment-variables-complete-list)
- [Step-by-Step Deployment](#step-by-step-deployment)
- [Cloud Platform Specific Guides](#cloud-platform-specific-guides)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides complete instructions for deploying NITOR to production environments. All required credentials, API keys, and configuration details are documented.

### Architecture Overview

```
Internet
    │
    ▼
[Load Balancer / CDN]
    │
    ├─► [Frontend - React App] (Port 80/443)
    │
    ├─► [Backend - Spring Boot] (Port 8080)
    │       │
    │       ├─► [PostgreSQL 15] (Port 5432)
    │       ├─► [Redis 7] (Port 6379)
    │       └─► [MinIO] (Port 9000/9001)
    │
    └─► [AI Service - Node.js] (Port 3001)
            │
            └─► [Google Gemini API]
```

---

## Prerequisites

### Required Software

**Development Tools:**
- Docker 24.0+ and Docker Compose 2.20+
- Git 2.30+
- Java 17+ (OpenJDK or Oracle)
- Maven 3.8+
- Node.js 20+ and npm 10+

**Production Infrastructure:**
- Domain name with DNS management
- SSL/TLS certificates (Let's Encrypt recommended)
- Cloud account (AWS/GCP/Azure/DigitalOcean)
- Email service provider (SendGrid/AWS SES)

### Minimum Server Requirements

**Single Server Deployment:**
- CPU: 4 cores (8 cores recommended)
- RAM: 8 GB (16 GB recommended)
- Storage: 50 GB SSD (200 GB recommended)
- Network: 100 Mbps (1 Gbps recommended)

**Multi-Server Deployment:**
- Application Server: 4 cores, 8 GB RAM
- Database Server: 4 cores, 16 GB RAM, 100 GB SSD
- Cache Server: 2 cores, 4 GB RAM
- Storage Server: 2 cores, 4 GB RAM, 500 GB SSD

---

## Required Credentials & API Keys

### 1. Database Credentials

**PostgreSQL:**
```
Database Name: nitor_production
Username: nitor_prod
Password: [GENERATE 32-character random password]
Host: [Your PostgreSQL host]
Port: 5432
```

**Generate Password:**
```bash
openssl rand -base64 32
```

### 2. Redis Credentials

```
Host: [Your Redis host]
Port: 6379
Password: [GENERATE 32-character random password]
```

### 3. MinIO / S3 Credentials

**MinIO Self-Hosted:**
```
Endpoint: https://storage.yourdomain.com
Access Key: [GENERATE 20-character key]
Secret Key: [GENERATE 40-character secret]
Bucket Name: nitor-production-files
Region: us-east-1
```

**AWS S3:**
```
Access Key ID: [From AWS IAM]
Secret Access Key: [From AWS IAM]
Bucket Name: nitor-production-files
Region: us-east-1
```

### 4. JWT Secret

**Generate 256-bit Secret:**
```bash
openssl rand -base64 64
```

**Example:**
```
JWT_SECRET=xK8vN3mQ9pL2wE5rT7yU1iO0pA4sD6fG8hJ9kL1zX3cV5bN7mQ0wE2rT4yU6iO8pA
```

### 5. Email Service (SendGrid)

**SendGrid Configuration:**
```
API Key: [From SendGrid Dashboard]
From Email: noreply@yourdomain.com
From Name: NITOR Academic Network
```

**Get SendGrid API Key:**
1. Sign up at https://sendgrid.com
2. Go to Settings → API Keys
3. Create API Key with "Mail Send" permission
4. Copy and save the key (shown only once)

**Alternative: AWS SES**
```
SMTP Host: email-smtp.us-east-1.amazonaws.com
SMTP Port: 587
SMTP Username: [From AWS SES]
SMTP Password: [From AWS SES]
```

### 6. Google Gemini API Key

**Required for AI Features (51 AI endpoints)**

**Get API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Enable "Generative Language API"
4. Copy API key

```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Pricing:** Free tier: 60 requests/minute

### 7. OAuth Credentials

#### Google OAuth

**Setup:**
1. Go to https://console.cloud.google.com
2. Create new project: "NITOR Production"
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://yourdomain.com/api/auth/oauth2/callback/google`

```
Client ID: XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
Client Secret: XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Redirect URI: https://yourdomain.com/api/auth/oauth2/callback/google
```

#### GitHub OAuth

**Setup:**
1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Set Homepage URL: `https://yourdomain.com`
4. Set Authorization callback URL: `https://yourdomain.com/api/auth/oauth2/callback/github`

```
Client ID: Iv1.XXXXXXXXXXXXXXXX
Client Secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Redirect URI: https://yourdomain.com/api/auth/oauth2/callback/github
```

#### LinkedIn OAuth

**Setup:**
1. Go to https://www.linkedin.com/developers/apps
2. Create new app
3. Add redirect URL: `https://yourdomain.com/api/auth/oauth2/callback/linkedin`

```
Client ID: XXXXXXXXXXXXXX
Client Secret: XXXXXXXXXXXXXXXX
Redirect URI: https://yourdomain.com/api/auth/oauth2/callback/linkedin
```

---

## Environment Variables Complete List

### Backend Environment Variables

Create `/home/user/nitor/packages/backend/.env.production`:

```bash
# ===========================================
# NITOR BACKEND - PRODUCTION CONFIGURATION
# ===========================================

# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/nitor_production
SPRING_DATASOURCE_USERNAME=nitor_prod
SPRING_DATASOURCE_PASSWORD=your_secure_database_password
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

# Database Pool Settings
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=20
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=5
SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT=30000
SPRING_DATASOURCE_HIKARI_IDLE_TIMEOUT=600000
SPRING_DATASOURCE_HIKARI_MAX_LIFETIME=1800000

# JPA Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_USE_SQL_COMMENTS=false

# Flyway Migration
SPRING_FLYWAY_ENABLED=true
SPRING_FLYWAY_BASELINE_ON_MIGRATE=true
SPRING_FLYWAY_LOCATIONS=classpath:db/migration
SPRING_FLYWAY_VALIDATE_ON_MIGRATE=true

# Redis Configuration
SPRING_REDIS_HOST=your-redis-host
SPRING_REDIS_PORT=6379
SPRING_REDIS_PASSWORD=your_secure_redis_password
SPRING_REDIS_TIMEOUT=60000
SPRING_REDIS_LETTUCE_POOL_MAX_ACTIVE=10
SPRING_REDIS_LETTUCE_POOL_MAX_IDLE=5
SPRING_REDIS_LETTUCE_POOL_MIN_IDLE=2

# MinIO / S3 Configuration
MINIO_ENDPOINT=https://storage.yourdomain.com
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET_NAME=nitor-production-files
MINIO_REGION=us-east-1
MINIO_USE_SSL=true

# JWT Security
JWT_SECRET=your_256_bit_jwt_secret_key_here
JWT_ACCESS_TOKEN_EXPIRATION=86400000
JWT_REFRESH_TOKEN_EXPIRATION=604800000
JWT_ISSUER=nitor.io

# Email Configuration (SendGrid)
SPRING_MAIL_HOST=smtp.sendgrid.net
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=apikey
SPRING_MAIL_PASSWORD=your_sendgrid_api_key
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true
SPRING_MAIL_FROM=noreply@yourdomain.com
SPRING_MAIL_FROM_NAME=NITOR Academic Network

# OAuth Configuration - Google
OAUTH_GOOGLE_ENABLED=true
OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH_GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/oauth2/callback/google
OAUTH_GOOGLE_SCOPE=openid,profile,email

# OAuth Configuration - GitHub
OAUTH_GITHUB_ENABLED=true
OAUTH_GITHUB_CLIENT_ID=your_github_client_id
OAUTH_GITHUB_CLIENT_SECRET=your_github_client_secret
OAUTH_GITHUB_REDIRECT_URI=https://yourdomain.com/api/auth/oauth2/callback/github
OAUTH_GITHUB_SCOPE=user:email

# OAuth Configuration - LinkedIn
OAUTH_LINKEDIN_ENABLED=true
OAUTH_LINKEDIN_CLIENT_ID=your_linkedin_client_id
OAUTH_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
OAUTH_LINKEDIN_REDIRECT_URI=https://yourdomain.com/api/auth/oauth2/callback/linkedin
OAUTH_LINKEDIN_SCOPE=r_liteprofile,r_emailaddress

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CORS_ALLOWED_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=*
CORS_EXPOSED_HEADERS=Authorization
CORS_ALLOW_CREDENTIALS=true
CORS_MAX_AGE=3600

# Server Configuration
SERVER_PORT=8080
SERVER_COMPRESSION_ENABLED=true
SERVER_COMPRESSION_MIME_TYPES=text/html,text/xml,text/plain,text/css,text/javascript,application/javascript,application/json
SERVER_HTTP2_ENABLED=true

# Logging Configuration
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_IO_NITOR=INFO
LOGGING_LEVEL_ORG_SPRINGFRAMEWORK=WARN
LOGGING_LEVEL_ORG_HIBERNATE=WARN
LOGGING_FILE_NAME=/var/log/nitor/backend.log
LOGGING_FILE_MAX_SIZE=100MB
LOGGING_FILE_MAX_HISTORY=30

# Actuator Configuration
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,prometheus,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=when_authorized
MANAGEMENT_METRICS_EXPORT_PROMETHEUS_ENABLED=true

# Application Configuration
SPRING_PROFILES_ACTIVE=prod
SPRING_APPLICATION_NAME=nitor-backend
APP_VERSION=1.0.0
APP_BASE_URL=https://yourdomain.com
APP_AI_SERVICE_URL=https://ai.yourdomain.com

# Rate Limiting
RATE_LIMIT_AUTH_REQUESTS_PER_MINUTE=5
RATE_LIMIT_API_REQUESTS_PER_MINUTE=100
RATE_LIMIT_SEARCH_REQUESTS_PER_MINUTE=60
```

### Frontend Environment Variables

Create `/home/user/nitor/packages/frontend/.env.production`:

```bash
# ===========================================
# NITOR FRONTEND - PRODUCTION CONFIGURATION
# ===========================================

# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_AI_SERVICE_URL=https://ai.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws

# Application Configuration
VITE_APP_NAME=NITOR Academic Network
VITE_APP_VERSION=1.0.0
VITE_APP_BASE_URL=https://yourdomain.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_AI_FEATURES=true

# OAuth Configuration
VITE_GOOGLE_OAUTH_ENABLED=true
VITE_GITHUB_OAUTH_ENABLED=true
VITE_LINKEDIN_OAUTH_ENABLED=true

# File Upload Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# External Services
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### AI Service Environment Variables

Create `/home/user/nitor/packages/ai-service/.env.production`:

```bash
# ===========================================
# NITOR AI SERVICE - PRODUCTION CONFIGURATION
# ===========================================

# Server Configuration
PORT=3001
NODE_ENV=production
HOST=0.0.0.0

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-pro
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://api.yourdomain.com
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/nitor/ai-service.log

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
```

---

## Step-by-Step Deployment

### Step 1: Server Provisioning

#### AWS EC2 Example

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.xlarge \
  --key-name nitor-production \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":200,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=nitor-production}]'
```

#### GCP Compute Engine Example

```bash
gcloud compute instances create nitor-production \
  --machine-type=n2-standard-4 \
  --zone=us-central1-a \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=200GB \
  --boot-disk-type=pd-ssd \
  --tags=http-server,https-server
```

### Step 2: Initial Server Setup

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y \
  docker.io \
  docker-compose \
  nginx \
  certbot \
  python3-certbot-nginx \
  git \
  ufw

# Configure firewall
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# Create application user
sudo useradd -m -s /bin/bash nitor
sudo usermod -aG docker nitor
```

### Step 3: Clone Repository

```bash
sudo su - nitor
git clone https://github.com/olaflaitinen/nitor.git
cd nitor
git checkout main
```

### Step 4: Configure SSL Certificates

```bash
# Obtain SSL certificate
sudo certbot certonly --nginx \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  -d ai.yourdomain.com \
  --email admin@yourdomain.com \
  --agree-tos \
  --non-interactive

# Verify certificates
sudo certbot certificates
```

### Step 5: Configure Database

```bash
# Start PostgreSQL container
docker run -d \
  --name nitor-postgres \
  --restart always \
  -e POSTGRES_DB=nitor_production \
  -e POSTGRES_USER=nitor_prod \
  -e POSTGRES_PASSWORD=your_secure_password \
  -v /var/lib/postgresql/data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15

# Wait for PostgreSQL to be ready
docker exec nitor-postgres pg_isready

# Run migrations
cd packages/backend
./mvnw flyway:migrate \
  -Dflyway.url=jdbc:postgresql://localhost:5432/nitor_production \
  -Dflyway.user=nitor_prod \
  -Dflyway.password=your_secure_password
```

### Step 6: Configure Redis

```bash
docker run -d \
  --name nitor-redis \
  --restart always \
  -e REDIS_PASSWORD=your_redis_password \
  -v /var/lib/redis:/data \
  -p 6379:6379 \
  redis:7 \
  redis-server --appendonly yes --requirepass your_redis_password
```

### Step 7: Configure MinIO

```bash
docker run -d \
  --name nitor-minio \
  --restart always \
  -e MINIO_ROOT_USER=your_access_key \
  -e MINIO_ROOT_PASSWORD=your_secret_key \
  -v /var/lib/minio:/data \
  -p 9000:9000 \
  -p 9001:9001 \
  minio/minio server /data --console-address ":9001"

# Create bucket
docker exec nitor-minio mc alias set local http://localhost:9000 your_access_key your_secret_key
docker exec nitor-minio mc mb local/nitor-production-files
docker exec nitor-minio mc anonymous set download local/nitor-production-files
```

### Step 8: Build and Deploy Backend

```bash
cd packages/backend

# Copy production environment
cp .env.production .env

# Build application
./mvnw clean package -DskipTests

# Run backend
java -jar \
  -Dspring.profiles.active=prod \
  -Xms2g -Xmx4g \
  target/nitor-backend-1.0.0.jar &

# Or use Docker
docker build -t nitor/backend:1.0.0 .
docker run -d \
  --name nitor-backend \
  --restart always \
  --env-file .env \
  -p 8080:8080 \
  nitor/backend:1.0.0
```

### Step 9: Build and Deploy AI Service

```bash
cd packages/ai-service

# Copy production environment
cp .env.production .env

# Install dependencies
npm ci --production

# Run AI service
NODE_ENV=production npm start &

# Or use Docker
docker build -t nitor/ai-service:1.0.0 .
docker run -d \
  --name nitor-ai-service \
  --restart always \
  --env-file .env \
  -p 3001:3001 \
  nitor/ai-service:1.0.0
```

### Step 10: Build and Deploy Frontend

```bash
cd packages/frontend

# Copy production environment
cp .env.production .env

# Install dependencies
npm ci

# Build for production
npm run build

# Copy to web server
sudo cp -r dist/* /var/www/nitor/

# Or use Docker
docker build -t nitor/frontend:1.0.0 .
docker run -d \
  --name nitor-frontend \
  --restart always \
  -p 3000:80 \
  nitor/frontend:1.0.0
```

### Step 11: Configure Nginx

Create `/etc/nginx/sites-available/nitor.conf`:

```nginx
# Frontend
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /var/www/nitor;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# AI Service
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ai.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/nitor.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Cloud Platform Specific Guides

### AWS Deployment

**RDS PostgreSQL:**
```bash
aws rds create-db-instance \
  --db-instance-identifier nitor-prod-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username nitor_prod \
  --master-user-password your_secure_password \
  --allocated-storage 100 \
  --storage-type gp3 \
  --backup-retention-period 7 \
  --multi-az
```

**ElastiCache Redis:**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id nitor-prod-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1
```

**S3 Bucket:**
```bash
aws s3api create-bucket \
  --bucket nitor-production-files \
  --region us-east-1

aws s3api put-bucket-cors \
  --bucket nitor-production-files \
  --cors-configuration file://cors.json
```

### GCP Deployment

**Cloud SQL PostgreSQL:**
```bash
gcloud sql instances create nitor-prod-db \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-8192 \
  --region=us-central1 \
  --root-password=your_secure_password \
  --backup \
  --backup-start-time=03:00
```

**Cloud Storage:**
```bash
gsutil mb -l us-central1 gs://nitor-production-files
gsutil cors set cors.json gs://nitor-production-files
```

### DigitalOcean Deployment

**Managed Database:**
```bash
doctl databases create nitor-prod-db \
  --engine pg \
  --version 15 \
  --size db-s-2vcpu-4gb \
  --region nyc1
```

---

## Post-Deployment Verification

### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/actuator/health

# AI Service health
curl https://ai.yourdomain.com/health

# Frontend
curl https://yourdomain.com
```

### Test Complete Flow

```bash
# 1. Register new user
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "fullName": "Test User",
    "handle": "testuser"
  }'

# 2. Login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# 3. Test AI service
curl -X POST https://ai.yourdomain.com/api/ai/refine-text \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a test sentence."}'
```

### Performance Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test backend performance
ab -n 1000 -c 10 https://api.yourdomain.com/actuator/health

# Test frontend performance
ab -n 1000 -c 10 https://yourdomain.com/
```

---

## Monitoring & Maintenance

### Prometheus Setup

Create `/etc/prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nitor-backend'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/actuator/prometheus'
```

### Grafana Dashboards

**Import Spring Boot Dashboard:**
- Dashboard ID: 4701
- URL: https://grafana.com/grafana/dashboards/4701

### Log Aggregation

```bash
# Install Filebeat
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.11.0-amd64.deb
sudo dpkg -i filebeat-8.11.0-amd64.deb

# Configure Filebeat
sudo vim /etc/filebeat/filebeat.yml
```

### Backup Strategy

**Database Backups:**
```bash
#!/bin/bash
# /usr/local/bin/backup-nitor-db.sh

BACKUP_DIR="/var/backups/nitor/db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

docker exec nitor-postgres pg_dump \
  -U nitor_prod \
  -d nitor_production \
  | gzip > ${BACKUP_DIR}/nitor_${TIMESTAMP}.sql.gz

# Upload to S3
aws s3 cp ${BACKUP_DIR}/nitor_${TIMESTAMP}.sql.gz \
  s3://nitor-backups/db/

# Keep only last 30 days
find ${BACKUP_DIR} -type f -mtime +30 -delete
```

**Automated Backups:**
```bash
# Add to crontab
sudo crontab -e
0 3 * * * /usr/local/bin/backup-nitor-db.sh
```

---

## Troubleshooting

### Common Issues

**Issue: Database connection refused**
```bash
# Check PostgreSQL is running
docker ps | grep postgres
docker logs nitor-postgres

# Test connection
psql -h localhost -U nitor_prod -d nitor_production
```

**Issue: High memory usage**
```bash
# Check memory usage
free -h
docker stats

# Restart services
sudo systemctl restart docker
docker restart nitor-backend
```

**Issue: SSL certificate errors**
```bash
# Verify certificates
sudo certbot certificates

# Renew certificates
sudo certbot renew --force-renewal

# Reload Nginx
sudo systemctl reload nginx
```

**Issue: AI service fails**
```bash
# Check Gemini API key
curl -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'

# Check AI service logs
docker logs nitor-ai-service
```

---

## Security Checklist

- [ ] All default passwords changed
- [ ] JWT secret is 256+ bits
- [ ] HTTPS enabled with valid certificates
- [ ] Firewall configured (only ports 80, 443, 22)
- [ ] Database access restricted to application server
- [ ] Redis password authentication enabled
- [ ] MinIO/S3 bucket policies configured
- [ ] OAuth credentials secured
- [ ] Email credentials secured
- [ ] Regular security updates scheduled
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers enabled

---

## Support

For deployment assistance:
- **Email**: devops@nitor.io
- **Documentation**: https://docs.nitor.io
- **GitHub Issues**: https://github.com/olaflaitinen/nitor/issues

---

**NITOR Production Deployment Guide v1.0.0**
**Last Updated**: November 28, 2025
**Status**: Production Ready
