# NITOR - Ücretsiz Platform Deployment Kılavuzu

**Versiyon:** 1.0.0
**Son Güncelleme:** 28 Kasım 2025
**Durum:** Tüm Servisler için Ücretsiz Deployment

---

## İçindekiler

- [Giriş - Ücretsiz Deployment Seçenekleri](#giriş---ücretsiz-deployment-seçenekleri)
- [Gerekli API Anahtarları (Ücretsiz)](#gerekli-api-anahtarları-ücretsiz)
- [Yöntem 1: Render.com (ÖNERİLEN - Hepsi Bir Arada)](#yöntem-1-rendercom-önerilen---hepsi-bir-arada)
- [Yöntem 2: Railway.app (Alternatif)](#yöntem-2-railwayapp-alternatif)
- [Yöntem 3: Vercel + Render (Hybrid)](#yöntem-3-vercel--render-hybrid)
- [Yöntem 4: Fly.io (Docker Tabanlı)](#yöntem-4-flyio-docker-tabanlı)
- [Hata Ayıklama ve Log Takibi](#hata-ayıklama-ve-log-takibi)
- [Performans ve Limitler](#performans-ve-limitler)

---

## Giriş - Ücretsiz Deployment Seçenekleri

NITOR 6 farklı servisten oluşuyor. Ücretsiz platformlarda çalıştırmak için en iyi seçenekler:

### Platform Karşılaştırması

| Platform | Frontend | Backend (Java) | AI Service (Node) | PostgreSQL | Redis | MinIO/S3 | Toplam Maliyet |
|----------|----------|----------------|-------------------|------------|-------|----------|----------------|
| **Render.com** | ✓ Ücretsiz | ✓ Ücretsiz | ✓ Ücretsiz | ✓ Ücretsiz | ✗ Ücretli | AWS S3 Free | **$0** |
| **Railway.app** | ✓ $5 Kredi | ✓ $5 Kredi | ✓ $5 Kredi | ✓ $5 Kredi | ✓ $5 Kredi | AWS S3 Free | **$0** (İlk ay) |
| **Fly.io** | ✓ Ücretsiz | ✓ Ücretsiz | ✓ Ücretsiz | ✓ Ücretsiz | ✗ Ücretli | AWS S3 Free | **$0** |
| **Vercel + Render** | ✓ Ücretsiz | ✓ Ücretsiz | ✓ Ücretsiz | ✓ Ücretsiz | ✗ Ücretli | AWS S3 Free | **$0** |

**ÖNERİ:** Render.com - En kolay ve tamamen ücretsiz

---

## Gerekli API Anahtarları (Ücretsiz)

Deployment öncesi bu API anahtarlarını alın. **Hepsi ücretsiz:**

### 1. Google Gemini API Key (Ücretsiz - AI Özellikleri İçin)

**Adımlar:**
1. https://makersuite.google.com/app/apikey adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" tıklayın
4. Projeyi seçin veya yeni proje oluşturun
5. API anahtarını kopyalayın (örn: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX`)

**Limit:** 60 istek/dakika (ücretsiz)

**Test edin:**
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'
```

### 2. SendGrid API Key (Ücretsiz - Email İçin)

**Adımlar:**
1. https://signup.sendgrid.com/ adresine gidin
2. Ücretsiz hesap oluşturun (100 email/gün ücretsiz)
3. Email adresinizi doğrulayın
4. Settings → API Keys → Create API Key
5. "Full Access" seçin
6. API anahtarını kopyalayın (örn: `SG.XXXXXXXXXXXXXXXXXXXXXXXX`)

**Limit:** 100 email/gün (ücretsiz)

### 3. Google OAuth Credentials (Ücretsiz - Google Login İçin)

**Adımlar:**
1. https://console.cloud.google.com adresine gidin
2. Yeni proje oluşturun: "NITOR"
3. "APIs & Services" → "Credentials"
4. "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs ekleyin:
   - `https://your-app-name.onrender.com/api/auth/oauth2/callback/google`
   - `http://localhost:8080/api/auth/oauth2/callback/google` (test için)
7. Client ID ve Client Secret'ı kopyalayın

**Format:**
```
Client ID: 123456789-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
Client Secret: GOCSPX-XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 4. GitHub OAuth Credentials (Ücretsiz - GitHub Login İçin)

**Adımlar:**
1. https://github.com/settings/developers adresine gidin
2. "OAuth Apps" → "New OAuth App"
3. Bilgileri doldurun:
   - Application name: `NITOR`
   - Homepage URL: `https://your-app-name.onrender.com`
   - Authorization callback URL: `https://your-app-name.onrender.com/api/auth/oauth2/callback/github`
4. "Register application"
5. Client ID ve "Generate a new client secret"
6. Client Secret'ı kopyalayın

**Format:**
```
Client ID: Iv1.XXXXXXXXXXXXXXXX
Client Secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 5. AWS S3 (Ücretsiz - Dosya Depolama İçin)

**Adımlar:**
1. https://aws.amazon.com/free/ adresine gidin
2. AWS hesabı oluşturun (kredi kartı gerekli ama ücret yok)
3. IAM → Users → Create User: "nitor-s3"
4. Permissions: "AmazonS3FullAccess"
5. Security credentials → Create access key
6. Access Key ID ve Secret Access Key'i kopyalayın
7. S3 → Create bucket:
   - Bucket name: `nitor-files-{random-number}`
   - Region: `us-east-1`
   - Block all public access: **OFF** (dosyalar public olmalı)
   - Create bucket

**Format:**
```
Access Key ID: AKIAXXXXXXXXXXXXXXXX
Secret Access Key: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Bucket Name: nitor-files-12345
Region: us-east-1
```

**Limit:** 5GB depolama, 20,000 GET, 2,000 PUT (ücretsiz/ay)

---

## Yöntem 1: Render.com (ÖNERİLEN - Hepsi Bir Arada)

**Neden Render.com?**
- ✓ Tamamen ücretsiz (kredi kartı gerekmez)
- ✓ PostgreSQL veritabanı dahil
- ✓ Otomatik SSL sertifikası
- ✓ Git'ten otomatik deploy
- ✓ Kolay log takibi
- ✓ 750 saat/ay ücretsiz (yeterli)

**Limitler:**
- Her servis 512MB RAM
- 15 dakika aktivite yoksa uyur (ilk istek 30sn sürer)
- Aylık 100GB bant genişliği

### Adım 1: Render.com Hesabı

1. https://render.com adresine gidin
2. "Get Started" → GitHub ile giriş yapın
3. GitHub'da NITOR repository'ye erişim verin

### Adım 2: PostgreSQL Veritabanı Oluşturma

1. Dashboard → "New" → "PostgreSQL"
2. Bilgileri doldurun:
   - **Name:** `nitor-database`
   - **Database:** `nitor`
   - **User:** `nitor`
   - **Region:** Oregon (US West) - en yakın
   - **PostgreSQL Version:** 15
   - **Plan:** Free
3. "Create Database"
4. Database oluşturulunca **Internal Database URL**'yi kopyalayın:
   ```
   postgresql://nitor:XXXXXXXX@dpg-XXXXXXX-a/nitor
   ```

### Adım 3: Backend (Spring Boot) Deploy

1. Dashboard → "New" → "Web Service"
2. "Build and deploy from a Git repository"
3. GitHub repository seçin: `olaflaitinen/nitor`
4. Ayarları yapın:

**Basic Settings:**
```
Name: nitor-backend
Region: Oregon (US West)
Branch: main
Root Directory: packages/backend
Runtime: Java
Build Command: ./mvnw clean package -DskipTests
Start Command: java -jar target/nitor-backend-1.0.0.jar
```

**Plan:** Free

5. **Environment Variables** ekleyin (Advanced → Environment):

```bash
# Database (Internal URL kullanın - yukarıda kopyaladınız)
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-XXXXXXX-a/nitor
SPRING_DATASOURCE_USERNAME=nitor
SPRING_DATASOURCE_PASSWORD=XXXXXXXXXXXXXXXX

# JPA & Flyway
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_FLYWAY_ENABLED=true
SPRING_FLYWAY_BASELINE_ON_MIGRATE=true

# Redis (Render'da ücretsiz Redis yok - devre dışı)
SPRING_REDIS_ENABLED=false
SPRING_CACHE_TYPE=simple

# AWS S3 (Yukarıda oluşturduğunuz)
MINIO_ENDPOINT=https://s3.amazonaws.com
MINIO_ACCESS_KEY=AKIAXXXXXXXXXXXXXXXX
MINIO_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MINIO_BUCKET_NAME=nitor-files-12345
MINIO_REGION=us-east-1
MINIO_USE_SSL=true

# JWT Secret (Random 64 karakter)
JWT_SECRET=xK8vN3mQ9pL2wE5rT7yU1iO0pA4sD6fG8hJ9kL1zX3cV5bN7mQ0wE2rT4yU6iO8pA
JWT_ACCESS_TOKEN_EXPIRATION=86400000
JWT_REFRESH_TOKEN_EXPIRATION=604800000

# Email (SendGrid - yukarıda oluşturduğunuz)
SPRING_MAIL_HOST=smtp.sendgrid.net
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=apikey
SPRING_MAIL_PASSWORD=SG.XXXXXXXXXXXXXXXXXXXXXXXX
SPRING_MAIL_FROM=noreply@yourdomain.com

# OAuth - Google (yukarıda oluşturduğunuz)
OAUTH_GOOGLE_ENABLED=true
OAUTH_GOOGLE_CLIENT_ID=123456789-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
OAUTH_GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXXXXXXXXXXXXXXXXXXXX
OAUTH_GOOGLE_REDIRECT_URI=https://nitor-backend.onrender.com/api/auth/oauth2/callback/google

# OAuth - GitHub (yukarıda oluşturduğunuz)
OAUTH_GITHUB_ENABLED=true
OAUTH_GITHUB_CLIENT_ID=Iv1.XXXXXXXXXXXXXXXX
OAUTH_GITHUB_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OAUTH_GITHUB_REDIRECT_URI=https://nitor-backend.onrender.com/api/auth/oauth2/callback/github

# CORS (Frontend URL ekleyin - sonra güncelleyeceksiniz)
CORS_ALLOWED_ORIGINS=https://nitor-frontend.onrender.com

# AI Service URL (sonra güncelleyeceksiniz)
APP_AI_SERVICE_URL=https://nitor-ai.onrender.com

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
LOGGING_LEVEL_ROOT=INFO
```

6. "Create Web Service"

**Deploy süresi:** ~10-15 dakika (Java build uzun sürer)

**URL:** `https://nitor-backend.onrender.com`

**Test:**
```bash
curl https://nitor-backend.onrender.com/actuator/health
# Beklenen: {"status":"UP"}
```

### Adım 4: AI Service (Node.js) Deploy

1. Dashboard → "New" → "Web Service"
2. Repository: `olaflaitinen/nitor`
3. Ayarlar:

**Basic Settings:**
```
Name: nitor-ai
Region: Oregon (US West)
Branch: main
Root Directory: packages/ai-service
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Plan:** Free

4. **Environment Variables:**

```bash
# Server
PORT=10000
NODE_ENV=production

# Gemini API (yukarıda oluşturduğunuz)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
GEMINI_MODEL=gemini-2.5-pro

# CORS (Frontend ve Backend URL)
CORS_ORIGIN=https://nitor-frontend.onrender.com,https://nitor-backend.onrender.com

# Logging
LOG_LEVEL=info
```

5. "Create Web Service"

**Deploy süresi:** ~3-5 dakika

**URL:** `https://nitor-ai.onrender.com`

**Test:**
```bash
curl https://nitor-ai.onrender.com/health
# Beklenen: {"status":"healthy"}
```

### Adım 5: Frontend (React) Deploy

1. Dashboard → "New" → "Static Site"
2. Repository: `olaflaitinen/nitor`
3. Ayarlar:

**Basic Settings:**
```
Name: nitor-frontend
Branch: main
Root Directory: packages/frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

4. **Environment Variables:**

```bash
# API URLs (Backend ve AI service URL'leri)
VITE_API_URL=https://nitor-backend.onrender.com
VITE_AI_SERVICE_URL=https://nitor-ai.onrender.com

# App Config
VITE_APP_NAME=NITOR Academic Network
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_AI_FEATURES=true
VITE_GOOGLE_OAUTH_ENABLED=true
VITE_GITHUB_OAUTH_ENABLED=true
```

5. "Create Static Site"

**Deploy süresi:** ~5-7 dakika

**URL:** `https://nitor-frontend.onrender.com`

### Adım 6: CORS ve Redirect URI Güncelleme

**Önemli:** Artık tüm URL'leri biliyorsunuz. Güncelleyin:

**6.1. Backend CORS Güncelleme:**
1. Render Dashboard → nitor-backend → Environment
2. `CORS_ALLOWED_ORIGINS` değişkenini güncelleyin:
   ```
   https://nitor-frontend.onrender.com
   ```
3. "Save Changes" → Otomatik yeniden deploy

**6.2. Google OAuth Redirect URI:**
1. https://console.cloud.google.com → Credentials
2. OAuth Client'ınızı düzenleyin
3. Authorized redirect URIs ekleyin:
   ```
   https://nitor-backend.onrender.com/api/auth/oauth2/callback/google
   ```
4. Save

**6.3. GitHub OAuth Redirect URI:**
1. https://github.com/settings/developers
2. OAuth App'inizi düzenleyin
3. Authorization callback URL:
   ```
   https://nitor-backend.onrender.com/api/auth/oauth2/callback/github
   ```
4. Update application

### Adım 7: Deployment Doğrulama

**7.1. Backend Health Check:**
```bash
curl https://nitor-backend.onrender.com/actuator/health
```

**Beklenen Çıktı:**
```json
{"status":"UP"}
```

**7.2. AI Service Health:**
```bash
curl https://nitor-ai.onrender.com/health
```

**7.3. Frontend Test:**
1. Tarayıcıda açın: `https://nitor-frontend.onrender.com`
2. Kayıt ol sayfasını deneyin
3. Google/GitHub ile giriş butonlarını test edin

**7.4. Full Flow Test:**
```bash
# 1. Kayıt ol
curl -X POST https://nitor-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User",
    "handle": "testuser"
  }'

# 2. Giriş yap
curl -X POST https://nitor-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Render.com - Hata Ayıklama

**Logları Görüntüleme:**
1. Dashboard → Service seçin
2. "Logs" tab
3. Real-time loglar görünür

**Yaygın Hatalar:**

**Hata 1: "Service Unavailable"**
- Neden: Servis ilk istekten sonra 15dk uykuda
- Çözüm: 30sn bekleyin, sayfa yenilenecek

**Hata 2: "Database connection failed"**
- Neden: Database URL yanlış
- Çözüm: Environment variables kontrol edin
- Internal URL kullanın: `postgresql://...`

**Hata 3: "Build failed - Maven"**
- Neden: Java 17 gerekli
- Çözüm: `render.yaml` dosyası ekleyin:
```yaml
services:
  - type: web
    name: nitor-backend
    env: java
    buildCommand: ./mvnw clean package -DskipTests
    startCommand: java -jar target/nitor-backend-1.0.0.jar
```

**Hata 4: "CORS Error"**
- Neden: CORS_ALLOWED_ORIGINS yanlış
- Çözüm: Tam URL ekleyin (trailing slash yok)

---

## Yöntem 2: Railway.app (Alternatif)

**Avantajları:**
- ✓ $5 ücretsiz kredi/ay
- ✓ PostgreSQL + Redis dahil
- ✓ Daha hızlı (uyuma yok)
- ✓ 8GB RAM (ücretsiz plan)

**Dezavantajları:**
- ✗ Kredi kartı gerekli
- ✗ $5 kredi bitince ücretli

### Adım 1: Railway Hesabı

1. https://railway.app adresine gidin
2. "Start a New Project" → GitHub ile giriş
3. Kredi kartı ekleyin (şarj edilmez, $5 ücretsiz)

### Adım 2: PostgreSQL Oluşturma

1. "New Project" → "Provision PostgreSQL"
2. Database otomatik oluşturulur
3. "Variables" tab → Connection URL'yi kopyalayın:
   ```
   postgresql://postgres:XXXXXXXX@containers-us-west-XX.railway.app:5432/railway
   ```

### Adım 3: Redis Oluşturma

1. Aynı project'te → "New Service" → "Database" → "Redis"
2. Redis URL'yi kopyalayın:
   ```
   redis://default:XXXXXXXX@containers-us-west-XX.railway.app:6379
   ```

### Adım 4: Backend Deploy

1. Project → "New Service" → "GitHub Repo" → `nitor`
2. Settings:
   - **Root Directory:** `packages/backend`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/nitor-backend-1.0.0.jar`
3. "Variables" tab - Environment variables ekleyin:

```bash
# Database (Railway connection string)
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-XX.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=XXXXXXXXXXXXXXXX

# Redis (Railway Redis)
SPRING_REDIS_HOST=containers-us-west-XX.railway.app
SPRING_REDIS_PORT=6379
SPRING_REDIS_PASSWORD=XXXXXXXXXXXXXXXX

# S3, JWT, Email, OAuth (Render ile aynı)
# ... (yukarıdaki gibi)
```

4. "Deploy"

### Adım 5: AI Service Deploy

1. "New Service" → GitHub Repo → `nitor`
2. Settings:
   - **Root Directory:** `packages/ai-service`
   - **Start Command:** `npm start`
3. Variables (Render ile aynı)
4. "Deploy"

### Adım 6: Frontend Deploy

**Railway frontend için iyi değil. Vercel kullanın:**

1. https://vercel.com adresine gidin
2. "Import Project" → GitHub → `nitor`
3. Settings:
   - **Root Directory:** `packages/frontend`
   - **Framework:** Vite
4. Environment Variables:
   ```bash
   VITE_API_URL=https://nitor-backend.up.railway.app
   VITE_AI_SERVICE_URL=https://nitor-ai.up.railway.app
   ```
5. "Deploy"

**Railway URL'ler:**
- Backend: `https://nitor-backend.up.railway.app`
- AI: `https://nitor-ai.up.railway.app`
- Frontend: `https://nitor.vercel.app` (Vercel)

---

## Yöntem 3: Vercel + Render (Hybrid)

**En iyi performans için:**
- **Vercel:** Frontend (CDN, çok hızlı)
- **Render:** Backend + AI + Database (ücretsiz)

### Vercel (Frontend)

1. https://vercel.com → "New Project"
2. Import `nitor` repository
3. Settings:
   - **Root Directory:** `packages/frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Environment Variables:
   ```bash
   VITE_API_URL=https://nitor-backend.onrender.com
   VITE_AI_SERVICE_URL=https://nitor-ai.onrender.com
   ```
5. "Deploy"

**URL:** `https://nitor-{random}.vercel.app`

### Render (Backend + AI)

Yukarıdaki Render.com adımlarını takip edin.

**Avantajlar:**
- Frontend CDN üzerinde (çok hızlı)
- Backend ücretsiz
- Custom domain kolay

---

## Yöntem 4: Fly.io (Docker Tabanlı)

**Avantajları:**
- ✓ Docker native
- ✓ Ücretsiz 3 VM
- ✓ PostgreSQL dahil
- ✓ Global deployment

### Adım 1: Fly.io Setup

```bash
# Fly CLI kur
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# PostgreSQL oluştur
flyctl postgres create --name nitor-db --region sjc

# Connection string al
flyctl postgres db list -a nitor-db
```

### Adım 2: Backend Deploy

`packages/backend` içinde `fly.toml` oluşturun:

```toml
app = "nitor-backend"

[build]
  builder = "paketobuildpacks/builder:base"
  buildpacks = ["gcr.io/paketo-buildpacks/java"]

[env]
  PORT = "8080"
  SPRING_PROFILES_ACTIVE = "prod"

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

Deploy:
```bash
cd packages/backend
flyctl launch --no-deploy
flyctl secrets set SPRING_DATASOURCE_URL=jdbc:postgresql://...
flyctl secrets set JWT_SECRET=...
flyctl deploy
```

### Adım 3: AI Service Deploy

```bash
cd packages/ai-service
flyctl launch
flyctl secrets set GEMINI_API_KEY=...
flyctl deploy
```

---

## Hata Ayıklama ve Log Takibi

### Render.com Logs

**Real-time logs:**
```bash
# Dashboard → Service → Logs tab
# Veya CLI:
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.render.com/v1/services/YOUR_SERVICE_ID/logs
```

**Yaygın hatalar:**

**1. "Application failed to bind to $PORT"**
```bash
# Çözüm: Start command'ı düzeltin
java -Dserver.port=$PORT -jar target/nitor-backend-1.0.0.jar
```

**2. "Connection to database failed"**
```bash
# Logs'ta tam hatayı görün:
# Dashboard → nitor-backend → Logs

# Database URL test:
psql "postgresql://nitor:XXX@dpg-XXX-a/nitor"
```

**3. "OAuth redirect_uri mismatch"**
```
# Google Console'da URI kontrol:
https://console.cloud.google.com → Credentials

# Tam URL olmalı:
https://nitor-backend.onrender.com/api/auth/oauth2/callback/google
```

### Railway Logs

```bash
# CLI kurulum:
npm i -g @railway/cli

# Login:
railway login

# Logs:
railway logs
```

### Vercel Logs

```bash
# CLI:
npm i -g vercel

# Logs:
vercel logs nitor-frontend
```

---

## Performans ve Limitler

### Render.com Free Tier

| Kaynak | Limit | Not |
|--------|-------|-----|
| RAM | 512 MB | Her servis için |
| CPU | Shared | Yeterli performans |
| Bant genişliği | 100 GB/ay | ~3M istek |
| Build dakikası | 500/ay | Build süreleri sayılır |
| Uyku | 15 dk inaktif | İlk istek 30sn |
| Storage | 1 GB | PostgreSQL için |

**Optimizasyon:**
- Frontend: Static site (uyumaz)
- Backend: Cron job ile 14dk'da ping (uyanık kalır)
- Database: Otomatik yedekleme yok (manual export)

**Cron ile Backend Uyanık Tutma:**
1. https://cron-job.org ücretsiz hesap
2. URL: `https://nitor-backend.onrender.com/actuator/health`
3. Interval: Her 14 dakika
4. Save

### Railway Free Tier

| Kaynak | Limit |
|--------|-------|
| Kredi | $5/ay |
| RAM | 8 GB |
| CPU | Shared |
| Storage | Unlimited |
| Uyku | Yok |

**$5 kredi tüketimi:**
- ~512MB RAM kullanımı = $5/ay
- 3-4 servis çalıştırabilir

### AWS S3 Free Tier

| Kaynak | Limit | Süre |
|--------|-------|------|
| Storage | 5 GB | 12 ay |
| GET requests | 20,000 | 12 ay |
| PUT requests | 2,000 | 12 ay |

**Optimizasyon:**
- Sadece avatar ve profil fotoları
- Max 2MB dosya boyutu
- CloudFront CDN ekleyin (ücretsiz)

---

## Deployment Checklist

**Deployment öncesi:**
- [ ] Google Gemini API key aldınız
- [ ] SendGrid API key aldınız
- [ ] Google OAuth credentials aldınız
- [ ] GitHub OAuth credentials aldınız
- [ ] AWS S3 bucket oluşturdunuz
- [ ] JWT secret oluşturdunuz (64 karakter random)

**Deployment sırası:**
1. [ ] PostgreSQL database (Render/Railway)
2. [ ] Backend deploy (environment variables ile)
3. [ ] AI Service deploy
4. [ ] Frontend deploy
5. [ ] CORS ayarları güncelleme
6. [ ] OAuth redirect URI güncelleme

**Test checklist:**
- [ ] Backend health: `/actuator/health`
- [ ] AI service health: `/health`
- [ ] Frontend yükleniyor
- [ ] Kayıt ol çalışıyor
- [ ] Giriş yap çalışıyor
- [ ] Google OAuth çalışıyor
- [ ] GitHub OAuth çalışıyor
- [ ] AI text refinement çalışıyor
- [ ] Profil fotoğrafı yükleme çalışıyor

---

## Hızlı Deployment (5 Dakika)

**En hızlı yol - Render.com:**

```bash
# 1. API Keys al (5 dakika):
# - Gemini: https://makersuite.google.com/app/apikey
# - SendGrid: https://sendgrid.com
# - AWS S3: https://aws.amazon.com

# 2. Render hesabı aç:
# https://render.com

# 3. PostgreSQL oluştur (1 dakika)
# New → PostgreSQL → Free → Create

# 4. Backend deploy (10 dakika):
# New → Web Service → nitor → packages/backend
# Environment variables ekle (yukarıdaki liste)

# 5. AI Service deploy (3 dakika):
# New → Web Service → nitor → packages/ai-service
# Environment variables ekle

# 6. Frontend deploy (5 dakika):
# New → Static Site → nitor → packages/frontend
# Environment variables ekle

# 7. Test:
curl https://nitor-backend.onrender.com/actuator/health
```

**Toplam süre:** ~20-30 dakika (build süreleri dahil)

---

## Sorun Giderme

### Backend Başlamıyor

**Log kontrol:**
```bash
# Render dashboard → nitor-backend → Logs

# Yaygın hatalar:
# "Port already in use" → SERVER_PORT=$PORT ekleyin
# "Database connection failed" → DB URL kontrol
# "ClassNotFoundException" → Build command: mvn clean package
```

### Frontend API'ye Bağlanamıyor

**CORS hatası:**
```
Access to XMLHttpRequest at 'https://nitor-backend.onrender.com'
from origin 'https://nitor-frontend.onrender.com' has been blocked by CORS
```

**Çözüm:**
```bash
# Backend environment variables:
CORS_ALLOWED_ORIGINS=https://nitor-frontend.onrender.com

# Virgülle ayırarak birden fazla:
CORS_ALLOWED_ORIGINS=https://nitor-frontend.onrender.com,https://nitor.vercel.app
```

### AI Service Çalışmıyor

**Gemini API testi:**
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'

# Hata: "API_KEY_INVALID"
# Çözüm: https://makersuite.google.com/app/apikey yeni key al
```

### OAuth Çalışmıyor

**Redirect URI mismatch:**
```
Error: redirect_uri_mismatch
```

**Çözüm:**
1. Google Console → Credentials → Edit
2. Authorized redirect URIs ekle:
   ```
   https://nitor-backend.onrender.com/api/auth/oauth2/callback/google
   ```
3. Tam URL (trailing slash yok)
4. https (http değil)

---

## Production URL'ler (Örnek)

**Render.com deployment sonrası:**

```
Frontend:  https://nitor-frontend.onrender.com
Backend:   https://nitor-backend.onrender.com
AI:        https://nitor-ai.onrender.com
Database:  dpg-XXXXXXXX-a.oregon-postgres.render.com
```

**Vercel + Render hybrid:**

```
Frontend:  https://nitor.vercel.app
Backend:   https://nitor-backend.onrender.com
AI:        https://nitor-ai.onrender.com
```

**Railway deployment:**

```
Frontend:  https://nitor.vercel.app
Backend:   https://nitor-backend.up.railway.app
AI:        https://nitor-ai.up.railway.app
```

---

## Custom Domain (Opsiyonel)

### Render.com

1. Domain satın alın (Namecheap, GoDaddy, CloudFlare)
2. Render Dashboard → Service → Settings
3. "Custom Domain" → Add
4. Domain provider'da CNAME ekleyin:
   ```
   nitor.yourdomain.com → nitor-frontend.onrender.com
   api.yourdomain.com   → nitor-backend.onrender.com
   ```
5. SSL otomatik (Let's Encrypt)

### Vercel

1. Vercel Dashboard → Settings → Domains
2. Add domain: `nitor.yourdomain.com`
3. DNS records ekleyin (otomatik gösterir)
4. SSL otomatik

---

## Maliyet Hesaplama (Aylık)

**Tamamen Ücretsiz Seçenek:**

```
Render.com (Frontend + Backend + AI):    $0
PostgreSQL (Render):                      $0
AWS S3 (5GB, 12 ay):                      $0
Google Gemini API (60 req/min):           $0
SendGrid (100 email/gün):                 $0
-----------------------------------------------
TOPLAM:                                   $0
```

**Limitler geçilirse (Production):**

```
Render.com Starter ($7/servis):          $21 (3 servis)
PostgreSQL (1GB):                         $7
Redis (256MB):                            $5
AWS S3 (50GB):                            $1.15
SendGrid (40k email):                     $15
-----------------------------------------------
TOPLAM:                                  ~$50/ay
```

---

## Destek ve Kaynaklar

**Render.com:**
- Docs: https://render.com/docs
- Status: https://status.render.com
- Community: https://community.render.com

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Vercel:**
- Docs: https://vercel.com/docs
- Status: https://vercel-status.com

**NITOR:**
- GitHub: https://github.com/olaflaitinen/nitor
- Issues: https://github.com/olaflaitinen/nitor/issues

---

**NITOR Free Deployment Guide v1.0.0**
**Last Updated:** 28 Kasım 2025
**Status:** Production Ready - Fully Tested
