# NITOR Production Deployment Guide

**Version:** 1.0.0
**Target Environment:** Production
**Infrastructure:** Docker + Kubernetes

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Infrastructure Setup](#infrastructure-setup)
- [Database Setup](#database-setup)
- [Application Deployment](#application-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Environment Configuration](#environment-configuration)
- [Security Hardening](#security-hardening)
- [Monitoring Setup](#monitoring-setup)
- [Backup Strategy](#backup-strategy)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive instructions for deploying NITOR to a production environment using Docker containers and Kubernetes orchestration.

### Deployment Architecture

```
                     ┌─────────────────────┐
                     │   Load Balancer     │
                     │     (Nginx)         │
                     └──────────┬──────────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
         ┌───────▼──────┐  ┌───▼──────┐  ┌───▼──────┐
         │   Frontend   │  │ Backend  │  │AI Service│
         │   (React)    │  │  (Java)  │  │(Node.js) │
         │   Port 80    │  │ Port 8080│  │Port 3001 │
         └──────────────┘  └─────┬────┘  └──────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
         ┌───────▼──────┐  ┌────▼─────┐  ┌──────▼──────┐
         │  PostgreSQL  │  │  Redis   │  │   MinIO     │
         │  Port 5432   │  │Port 6379 │  │  Port 9000  │
         └──────────────┘  └──────────┘  └─────────────┘
```

### System Requirements

#### Minimum Requirements
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 50 GB SSD
- **Network**: 100 Mbps

#### Recommended for Production
- **CPU**: 8+ cores
- **RAM**: 16 GB
- **Storage**: 200 GB SSD
- **Network**: 1 Gbps

---

## Prerequisites

### Required Software

1. **Docker** (24.0+)
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Docker Compose** (2.20+)
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Kubernetes** (1.28+) - *Optional for K8s deployment*
   ```bash
   # Using kubeadm
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   ```

4. **kubectl** - Kubernetes CLI
   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

### Domain and SSL

- **Domain Name**: Register a domain (e.g., nitor.io)
- **SSL Certificate**: Obtain from Let's Encrypt or commercial CA
- **DNS Configuration**: Point domain to your server IP

---

## Infrastructure Setup

### 1. Server Provisioning

#### Using Cloud Provider (AWS/GCP/Azure)

**AWS EC2 Example:**
```bash
# Launch t3.xlarge instance (4 vCPU, 16 GB RAM)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.xlarge \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx
```

**GCP Compute Engine Example:**
```bash
gcloud compute instances create nitor-production \
  --machine-type=n2-standard-4 \
  --zone=us-central1-a \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=200GB
```

### 2. Initial Server Configuration

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  htop \
  vim

# Configure firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. Create Application User

```bash
# Create nitor user
sudo useradd -m -s /bin/bash nitor
sudo usermod -aG docker nitor
sudo su - nitor
```

---

## Database Setup

### PostgreSQL Production Configuration

#### 1. Create Production Database

```bash
# Access PostgreSQL container
docker exec -it nitor-postgres psql -U postgres

-- Create production database
CREATE DATABASE nitor_production;

-- Create production user
CREATE USER nitor_prod WITH ENCRYPTED PASSWORD 'strong_production_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nitor_production TO nitor_prod;

-- Exit
\q
```

#### 2. Configure PostgreSQL for Production

Create `/var/lib/postgresql/data/postgresql.conf`:

```conf
# Connection Settings
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 20MB
maintenance_work_mem = 1GB

# WAL Settings (for backups)
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB

# Performance
random_page_cost = 1.1
effective_io_concurrency = 200
checkpoint_completion_target = 0.9

# Logging
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_min_duration_statement = 1000
```

#### 3. Run Database Migrations

```bash
cd packages/backend

# Run Flyway migrations
mvn flyway:migrate \
  -Dflyway.url=jdbc:postgresql://localhost:5432/nitor_production \
  -Dflyway.user=nitor_prod \
  -Dflyway.password=strong_production_password
```

### Redis Configuration

```bash
# Create Redis configuration
cat > /etc/redis/redis.conf <<EOF
# Network
bind 0.0.0.0
port 6379
requirepass strong_redis_password

# Persistence
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru

# Logging
loglevel notice
logfile /var/log/redis/redis.log
EOF
```

---

## Application Deployment

### 1. Clone Repository

```bash
git clone https://github.com/olaflaitinen/nitor.git
cd nitor
git checkout main
```

### 2. Configure Environment Variables

Create `.env.production`:

```bash
# ===========================================
# PRODUCTION ENVIRONMENT CONFIGURATION
# ===========================================

# Database
DB_HOST=postgres.nitor.internal
DB_PORT=5432
DB_NAME=nitor_production
DB_USER=nitor_prod
DB_PASSWORD=your_strong_db_password

# Redis
REDIS_HOST=redis.nitor.internal
REDIS_PORT=6379
REDIS_PASSWORD=your_strong_redis_password

# MinIO
MINIO_ENDPOINT=https://storage.nitor.io
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET_NAME=nitor-production-files

# JWT Security
JWT_SECRET=your_super_secure_jwt_secret_minimum_256_bits_required

# Email (SendGrid)
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_FROM=noreply@nitor.io

# OAuth (Google)
GOOGLE_OAUTH_ENABLED=true
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://nitor.io/api/auth/oauth2/callback/google

# OAuth (GitHub)
GITHUB_OAUTH_ENABLED=true
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://nitor.io/api/auth/oauth2/callback/github

# OAuth (LinkedIn)
LINKEDIN_OAUTH_ENABLED=true
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=https://nitor.io/api/auth/oauth2/callback/linkedin

# AI Service (Gemini)
GEMINI_API_KEY=your_gemini_api_key
AI_SERVICE_URL=https://ai.nitor.io

# Frontend
FRONTEND_URL=https://nitor.io
VITE_API_URL=https://api.nitor.io
VITE_AI_SERVICE_URL=https://ai.nitor.io

# CORS
CORS_ORIGINS=https://nitor.io,https://www.nitor.io

# Spring Profile
SPRING_PROFILE=prod

# Server
SERVER_PORT=8080
```

### 3. Build Docker Images

```bash
# Build backend
cd packages/backend
docker build -t nitor/backend:1.0.0 -t nitor/backend:latest .

# Build frontend
cd ../frontend
docker build -t nitor/frontend:1.0.0 -t nitor/frontend:latest .

# Build AI service
cd ../ai-service
docker build -t nitor/ai-service:1.0.0 -t nitor/ai-service:latest .
```

### 4. Push to Container Registry

```bash
# Tag for your registry
docker tag nitor/backend:latest registry.nitor.io/backend:latest
docker tag nitor/frontend:latest registry.nitor.io/frontend:latest
docker tag nitor/ai-service:latest registry.nitor.io/ai-service:latest

# Push
docker push registry.nitor.io/backend:latest
docker push registry.nitor.io/frontend:latest
docker push registry.nitor.io/ai-service:latest
```

---

## Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl create namespace nitor-production
kubectl config set-context --current --namespace=nitor-production
```

### 2. Create Secrets

```bash
# Database credentials
kubectl create secret generic nitor-db-secret \
  --from-literal=username=nitor_prod \
  --from-literal=password=your_strong_db_password

# Redis credentials
kubectl create secret generic nitor-redis-secret \
  --from-literal=password=your_strong_redis_password

# JWT secret
kubectl create secret generic nitor-jwt-secret \
  --from-literal=secret=your_super_secure_jwt_secret

# Email credentials
kubectl create secret generic nitor-email-secret \
  --from-literal=password=your_sendgrid_api_key

# OAuth credentials
kubectl create secret generic nitor-oauth-secret \
  --from-literal=google-client-secret=your_google_secret \
  --from-literal=github-client-secret=your_github_secret \
  --from-literal=linkedin-client-secret=your_linkedin_secret
```

### 3. Apply Kubernetes Manifests

```bash
# Apply in order
kubectl apply -f infrastructure/kubernetes/01-namespace.yaml
kubectl apply -f infrastructure/kubernetes/02-postgres.yaml
kubectl apply -f infrastructure/kubernetes/03-redis.yaml
kubectl apply -f infrastructure/kubernetes/04-backend.yaml
kubectl apply -f infrastructure/kubernetes/05-frontend.yaml
kubectl apply -f infrastructure/kubernetes/06-ingress.yaml

# Verify deployment
kubectl get pods
kubectl get services
kubectl get ingress
```

### 4. Configure Horizontal Pod Autoscaler

```bash
# Backend autoscaling
kubectl autoscale deployment nitor-backend \
  --cpu-percent=70 \
  --min=3 \
  --max=10

# Frontend autoscaling
kubectl autoscale deployment nitor-frontend \
  --cpu-percent=70 \
  --min=2 \
  --max=5
```

---

## Security Hardening

### 1. SSL/TLS Configuration

#### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d nitor.io -d www.nitor.io -d api.nitor.io

# Auto-renewal
sudo crontab -e
# Add: 0 0 * * * certbot renew --quiet
```

### 2. Firewall Rules

```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Security Headers (Nginx)

Add to Nginx configuration:

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 4. Database Security

```sql
-- Restrict database access
REVOKE ALL ON DATABASE nitor_production FROM PUBLIC;
GRANT CONNECT ON DATABASE nitor_production TO nitor_prod;

-- Enable SSL
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = '/path/to/server.crt';
ALTER SYSTEM SET ssl_key_file = '/path/to/server.key';
```

---

## Monitoring Setup

### 1. Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nitor-backend'
    static_configs:
      - targets: ['backend:8080']
    metrics_path: '/actuator/prometheus'

  - job_name: 'postgresql'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### 2. Grafana Dashboards

```bash
# Deploy Grafana
kubectl apply -f infrastructure/kubernetes/monitoring/grafana.yaml

# Import dashboards
# - Spring Boot Dashboard
# - PostgreSQL Dashboard
# - Redis Dashboard
# - Kubernetes Dashboard
```

### 3. Application Logging

```yaml
# Fluent Bit configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         5
        Log_Level     info

    [INPUT]
        Name              tail
        Path              /var/log/containers/nitor-*.log
        Parser            docker
        Tag               kube.*

    [OUTPUT]
        Name              es
        Match             *
        Host              elasticsearch
        Port              9200
        Index             nitor-logs
```

---

## Backup Strategy

### Database Backups

```bash
#!/bin/bash
# /usr/local/bin/backup-nitor-db.sh

BACKUP_DIR="/var/backups/nitor/db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="nitor_prod_${TIMESTAMP}.sql.gz"

# Create backup
docker exec nitor-postgres pg_dump \
  -U nitor_prod \
  -d nitor_production \
  | gzip > ${BACKUP_DIR}/${BACKUP_FILE}

# Upload to S3
aws s3 cp ${BACKUP_DIR}/${BACKUP_FILE} s3://nitor-backups/db/

# Keep only last 30 days locally
find ${BACKUP_DIR} -type f -mtime +30 -delete

# Cron: 0 2 * * * /usr/local/bin/backup-nitor-db.sh
```

### File Storage Backups

```bash
#!/bin/bash
# Backup MinIO data
mc mirror nitor-minio/nitor-production-files s3://nitor-backups/files/$(date +%Y%m%d)
```

---

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

```bash
# Check logs
kubectl logs -f deployment/nitor-backend
kubectl logs -f deployment/nitor-frontend

# Check pod status
kubectl describe pod <pod-name>

# Verify secrets
kubectl get secrets
kubectl describe secret nitor-db-secret
```

#### 2. Database Connection Issues

```bash
# Test database connectivity
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- \
  psql -h postgres -U nitor_prod -d nitor_production

# Check database logs
kubectl logs -f deployment/postgres
```

#### 3. High Memory Usage

```bash
# Check resource usage
kubectl top pods
kubectl top nodes

# Restart problematic pods
kubectl rollout restart deployment/nitor-backend
```

#### 4. SSL Certificate Issues

```bash
# Verify certificate
openssl s_client -connect nitor.io:443 -showcerts

# Check Nginx configuration
kubectl exec -it <nginx-pod> -- nginx -t

# Reload Nginx
kubectl exec -it <nginx-pod> -- nginx -s reload
```

### Performance Optimization

#### Database Query Optimization

```sql
-- Identify slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_content_author_id ON content(author_id);
CREATE INDEX CONCURRENTLY idx_content_created_at ON content(created_at DESC);
```

#### Backend Optimization

```yaml
# Increase JVM heap size
env:
  - name: JAVA_OPTS
    value: "-Xms2g -Xmx4g -XX:+UseG1GC"
```

---

## Health Checks

### Automated Health Monitoring

```bash
#!/bin/bash
# /usr/local/bin/health-check.sh

# Backend health
curl -f https://api.nitor.io/actuator/health || exit 1

# Frontend health
curl -f https://nitor.io || exit 1

# Database health
kubectl exec -it deployment/postgres -- pg_isready || exit 1

# Redis health
kubectl exec -it deployment/redis -- redis-cli ping || exit 1
```

---

## Rollback Procedure

```bash
# List deployments
kubectl rollout history deployment/nitor-backend

# Rollback to previous version
kubectl rollout undo deployment/nitor-backend

# Rollback to specific revision
kubectl rollout undo deployment/nitor-backend --to-revision=2

# Verify rollback
kubectl rollout status deployment/nitor-backend
```

---

## Support

For deployment assistance:

- **Documentation**: [https://docs.nitor.io](https://docs.nitor.io)
- **Email**: devops@nitor.io
- **GitHub Issues**: [https://github.com/olaflaitinen/nitor/issues](https://github.com/olaflaitinen/nitor/issues)

---

**NITOR v1.0.0** • Production Deployment Guide • [Back to Documentation](../README.md)
