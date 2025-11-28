# FLY.IO DEPLOYMENT REHBERI

## 1. HAZIRLIK

### Fly.io CLI Kurulumu
```bash
# MacOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### Giriş Yapma
```bash
fly auth login
```

## 2. APP OLUŞTURMA

### İlk Kurulum
```bash
cd packages/backend
fly launch --no-deploy
```

Sorulara cevaplar:
- App name: `nitor` (veya istediğiniz isim)
- Region: `iad` (US East, veya size yakın region)
- PostgreSQL: `Yes` (Ücretsiz PostgreSQL ekleyin)
- Redis: `No` (Şimdilik hayır, gerekirse sonra ekleyebilirsiniz)

## 3. SECRETS EKLEME

### ÖNEMLİ: Secrets vs Environment Variables

**Secrets** (Hassas bilgiler):
- API keys
- Passwords
- Client secrets
- JWT secrets

**Environment Variables** (Genel ayarlar):
- Port numbers
- Feature flags
- Public URLs

### Tüm Secrets'ları Bir Komutla Ekleme

**NOT:** Gerçek credential'larınız `YOUR_CREDENTIALS.md` dosyasında!

```bash
fly secrets set \
  GEMINI_API_KEY="YOUR_GEMINI_API_KEY" \
  SPRING_MAIL_PASSWORD="YOUR_SENDGRID_API_KEY" \
  JWT_SECRET="$(openssl rand -base64 64 | tr -d '\n')" \
  SPRING_DATASOURCE_PASSWORD="$(openssl rand -base64 32 | tr -d '\n')" \
  MINIO_ACCESS_KEY="YOUR_AWS_ACCESS_KEY" \
  MINIO_SECRET_KEY="YOUR_AWS_SECRET_KEY" \
  OAUTH_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID" \
  OAUTH_GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET" \
  OAUTH_GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID" \
  OAUTH_GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET" \
  OAUTH_LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID" \
  OAUTH_LINKEDIN_CLIENT_SECRET="YOUR_LINKEDIN_CLIENT_SECRET"
```

### Secrets'ları Tek Tek Ekleme

#### 1. Gemini API Key
```bash
fly secrets set GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```
Gerçek değeriniz: `YOUR_CREDENTIALS.md` dosyasına bakın

#### 2. SendGrid Email API (Eklemeniz Gerekiyor)
```bash
fly secrets set SPRING_MAIL_PASSWORD="SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```
Alın: https://sendgrid.com → Settings → API Keys → Create API Key

#### 3. JWT Secret (Otomatik Oluştur)
```bash
fly secrets set JWT_SECRET="$(openssl rand -base64 64 | tr -d '\n')"
```

#### 4. Database Password (Otomatik Oluştur)
```bash
fly secrets set SPRING_DATASOURCE_PASSWORD="$(openssl rand -base64 32 | tr -d '\n')"
```

#### 5. AWS S3 Credentials (Eklemeniz Gerekiyor)
```bash
fly secrets set \
  MINIO_ACCESS_KEY="AKIAXXXXXXXXXXXXXXXX" \
  MINIO_SECRET_KEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
  MINIO_BUCKET_NAME="nitor-files-12345"
```
Alın: https://aws.amazon.com → IAM → Users → Create Access Key

#### 6. Google OAuth
```bash
fly secrets set \
  OAUTH_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID" \
  OAUTH_GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
```
Gerçek değerleriniz: `YOUR_CREDENTIALS.md` dosyasına bakın

Google OAuth için Redirect URI ekleyin:
- Google Cloud Console → APIs & Services → Credentials
- OAuth 2.0 Client ID'nizi seçin
- Authorized redirect URIs'e ekleyin: `https://nitor.fly.dev/api/auth/oauth2/callback/google`

#### 7. GitHub OAuth
```bash
fly secrets set \
  OAUTH_GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID" \
  OAUTH_GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET"
```
Gerçek değerleriniz: `YOUR_CREDENTIALS.md` dosyasına bakın

GitHub OAuth için Redirect URI güncelleyin:
- https://github.com/settings/developers
- OAuth App'inizi seçin
- Authorization callback URL: `https://nitor.fly.dev/api/auth/oauth2/callback/github`

#### 8. LinkedIn OAuth
```bash
fly secrets set \
  OAUTH_LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID" \
  OAUTH_LINKEDIN_CLIENT_SECRET="YOUR_LINKEDIN_CLIENT_SECRET"
```
Gerçek değerleriniz: `YOUR_CREDENTIALS.md` dosyasına bakın

LinkedIn OAuth için Redirect URI güncelleyin:
- https://www.linkedin.com/developers/apps
- App'inizi seçin
- Redirect URLs: `https://nitor.fly.dev/api/auth/oauth2/callback/linkedin`

## 4. ENVIRONMENT VARIABLES (FLY.TOML)

fly.toml dosyasına hassas olmayan ayarları ekleyin:

```toml
[env]
  # Server
  SERVER_PORT = "8080"
  SPRING_PROFILES_ACTIVE = "prod"

  # Database (URL otomatik eklenir)
  SPRING_DATASOURCE_URL = "jdbc:postgresql://nitor-db.internal:5432/nitor"
  SPRING_DATASOURCE_USERNAME = "nitor"

  # Redis (opsiyonel)
  SPRING_REDIS_HOST = "nitor-redis.internal"
  SPRING_REDIS_PORT = "6379"
  SPRING_CACHE_TYPE = "simple"

  # OAuth Enables
  OAUTH_GOOGLE_ENABLED = "true"
  OAUTH_GITHUB_ENABLED = "true"
  OAUTH_LINKEDIN_ENABLED = "true"

  # CORS
  CORS_ALLOWED_ORIGINS = "https://nitor.fly.dev,https://nitor.vercel.app"

  # Email
  SPRING_MAIL_HOST = "smtp.sendgrid.net"
  SPRING_MAIL_PORT = "587"
  SPRING_MAIL_USERNAME = "apikey"

  # S3
  MINIO_ENDPOINT = "https://s3.amazonaws.com"
  MINIO_REGION = "us-east-1"
```

## 5. POSTGRESQL DATABASE AYARLARI

### Database Oluşturma
```bash
fly postgres create --name nitor-db
```

Seçenekler:
- Configuration: Development (256MB RAM, 1GB storage) - ÜCRETSİZ
- Region: Aynı region (iad)

### Database Bağlama
```bash
fly postgres attach nitor-db
```

Bu komut otomatik olarak `DATABASE_URL` secret'ını ekler.

### Database URL'i Manuel Ayarlama (Gerekirse)
```bash
fly secrets set SPRING_DATASOURCE_URL="jdbc:postgresql://nitor-db.internal:5432/nitor"
```

## 6. SECRETS'LARI GÖRÜNTÜLEME

### Tüm Secrets Listesi
```bash
fly secrets list
```

### Belirli Bir Secret'ın Değerini Görme
**NOT:** Fly.io güvenlik için secret değerlerini göstermez. Sadece isimlerini gösterir.

## 7. DEPLOYMENT

### İlk Deploy
```bash
fly deploy
```

### Deploy Sonrası Kontrol
```bash
# App durumu
fly status

# Logları görüntüle
fly logs

# App URL'ini aç
fly open
```

## 8. SECRETS YÖNETİMİ

### Secret Güncelleme
```bash
fly secrets set SECRET_NAME="new-value"
```

### Secret Silme
```bash
fly secrets unset SECRET_NAME
```

### Birden Fazla Secret Güncelleme
```bash
fly secrets set \
  SECRET1="value1" \
  SECRET2="value2" \
  SECRET3="value3"
```

## 9. WEB ARAYÜZÜ İLE SECRETS EKLEME

1. https://fly.io/dashboard adresine gidin
2. "nitor" app'inizi seçin
3. Sol menüden **Secrets** sekmesine tıklayın
4. **Add Secret** butonuna tıklayın
5. Name ve Value girin
6. **Save** butonuna tıklayın

**ÖNEMLİ:** Her secret eklediğinizde app otomatik olarak yeniden başlar.

## 10. PRODUCTION CHECKLIST

Deploy etmeden önce kontrol edin:

- [x] Gemini API Key eklendi
- [ ] SendGrid API Key eklendi
- [ ] AWS S3 credentials eklendi
- [ ] Google OAuth Client Secret eklendi
- [x] GitHub OAuth credentials eklendi
- [x] LinkedIn OAuth credentials eklendi
- [ ] JWT Secret oluşturuldu
- [ ] PostgreSQL database oluşturuldu ve bağlandı
- [ ] OAuth redirect URI'ler güncellendi (fly.dev URL'leri)
- [ ] CORS origins güncellendi
- [ ] Frontend URL'i ayarlandı

## 11. SORUN GİDERME

### Deployment Başarısız Olursa

#### Logları Kontrol Edin
```bash
fly logs
```

#### App'i Yeniden Başlatın
```bash
fly restart
```

#### Secrets'ları Kontrol Edin
```bash
fly secrets list
```

#### SSH ile Bağlanın
```bash
fly ssh console
```

#### Database Bağlantısını Test Edin
```bash
fly postgres connect -a nitor-db
```

### Yaygın Hatalar

**1. Database connection failed**
```bash
# Database URL'i kontrol edin
fly secrets list | grep DATABASE

# Database'in çalıştığını kontrol edin
fly status -a nitor-db
```

**2. OAuth redirect URI mismatch**
- Google/GitHub/LinkedIn console'da redirect URI'leri güncelleyin
- Format: `https://nitor.fly.dev/api/auth/oauth2/callback/{provider}`

**3. Out of memory**
```bash
# fly.toml'da memory'yi artırın
[vm]
  memory_mb = 1024  # 512'den 1024'e çıkarın
```

## 12. MALİYET OPTİMİZASYONU

### Ücretsiz Tier Limitleri

Fly.io Free Tier:
- 3 shared-cpu-1x VMs (256MB RAM)
- 3GB persistent volumes
- 160GB outbound data transfer

### Auto-scaling Ayarları
```toml
[http_service]
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0  # Kullanılmadığında durdur
```

Bu ayarlarla:
- Trafik yokken VM otomatik kapanır (ücret yok)
- İstek geldiğinde otomatik başlar (~1-2 saniye gecikme)

## 13. GÜVENLİK TAVSİYELERI

1. **Secrets'ları asla git'e commit etmeyin**
2. **Her ortam için farklı secrets kullanın** (dev, staging, prod)
3. **API key'leri düzenli olarak rotate edin**
4. **Minimum gerekli izinleri verin** (principle of least privilege)
5. **2FA'yı tüm servislerde aktif edin**
6. **HTTPS her zaman aktif** (Fly.io otomatik sağlar)

## 14. MONITORING & ALERTS

### Metrics Görüntüleme
```bash
fly metrics
```

### Grafana Dashboard
https://fly.io/dashboard/{your-app}/monitoring

## HIZLI ÖZET

```bash
# 1. CLI Kurulumu
curl -L https://fly.io/install.sh | sh

# 2. Giriş
fly auth login

# 3. App Oluştur
cd packages/backend
fly launch --no-deploy

# 4. PostgreSQL Ekle
fly postgres create --name nitor-db
fly postgres attach nitor-db

# 5. Secrets Ekle
# YOUR_CREDENTIALS.md dosyasındaki gerçek değerleri kullanın!
fly secrets set \
  GEMINI_API_KEY="YOUR_GEMINI_API_KEY" \
  JWT_SECRET="$(openssl rand -base64 64 | tr -d '\n')" \
  OAUTH_GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID" \
  OAUTH_GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET" \
  OAUTH_LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID" \
  OAUTH_LINKEDIN_CLIENT_SECRET="YOUR_LINKEDIN_CLIENT_SECRET" \
  OAUTH_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"

# 6. Deploy
fly deploy

# 7. Kontrol
fly status
fly logs
fly open
```

## DESTEK

- Fly.io Docs: https://fly.io/docs
- Community Forum: https://community.fly.io
- Discord: https://fly.io/discord
