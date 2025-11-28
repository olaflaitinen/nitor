# ⚠️ FLY.IO DEPLOY HATASI - ÇÖZÜM

## Sorun

```
ERROR: "/pom.xml": not found
ERROR: "/src": not found
```

## Sebep

Fly.io deploy komutunu **yanlış klasörden** çalıştırıyorsunuz!

Deploy komutu **root klasöründen** çalışırsa:
- Build context: `/home/user/nitor/` (root)
- Dockerfile arar: `pom.xml` ve `src/` root'ta
- Ama bunlar: `packages/backend/pom.xml` ve `packages/backend/src/`

## ✓ ÇÖZÜM - Doğru Klasörden Deploy Et

### Yöntem 1: Deploy Script Kullan (EN KOLAY)

```bash
cd /home/user/nitor/packages/backend
./deploy.sh
```

Bu script:
- ✓ Doğru klasörde olduğunuzu kontrol eder
- ✓ Gerekli dosyaları kontrol eder
- ✓ Fly CLI kurulu mu kontrol eder
- ✓ Giriş yapmış mısınız kontrol eder
- ✓ Deploy eder

### Yöntem 2: Manuel Deploy

```bash
# 1. Backend klasörüne gidin
cd /home/user/nitor/packages/backend

# 2. Dosyaları kontrol edin
ls -la
# Şunları görmelisiniz:
# - pom.xml
# - src/
# - Dockerfile
# - fly.toml

# 3. Deploy edin
fly deploy
```

### Yöntem 3: Uzaktan Deploy (Root'tan)

Eğer mutlaka root klasöründen deploy etmek istiyorsanız:

```bash
cd /home/user/nitor
fly deploy --config packages/backend/fly.toml --dockerfile packages/backend/Dockerfile --build-arg BUILD_CONTEXT=packages/backend
```

**UYARI:** Bu yöntem tavsiye edilmez! Yöntem 1 veya 2 kullanın.

## 🎯 Deploy Adımları (Sıfırdan)

### 1. Backend Klasörüne Gidin
```bash
cd /home/user/nitor/packages/backend
```

### 2. Fly.io'ya Giriş Yapın (Tek Seferlik)
```bash
fly auth login
```

### 3. App Oluşturun (İlk Kez)
```bash
fly launch --no-deploy --name nitor --region iad
```

Sorular:
- PostgreSQL database eklemek ister misiniz? → **Yes**
- Redis eklemek ister misiniz? → **No** (şimdilik)

### 4. Secrets Ekleyin (İlk Kez)

**ÖNEMLİ:** Gerçek değerler `YOUR_CREDENTIALS.md` dosyasında!

```bash
# YOUR_CREDENTIALS.md dosyasındaki GERÇEK değerleri kullanın!
fly secrets set \
  GEMINI_API_KEY="YOUR_GEMINI_API_KEY" \
  OAUTH_GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID" \
  OAUTH_GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET" \
  OAUTH_LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID" \
  OAUTH_LINKEDIN_CLIENT_SECRET="YOUR_LINKEDIN_CLIENT_SECRET" \
  OAUTH_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID" \
  JWT_SECRET="$(openssl rand -base64 64 | tr -d '\n')"
```

Gerçek komut YOUR_CREDENTIALS.md dosyasında copy-paste hazır!

### 5. Deploy Edin
```bash
fly deploy
```

veya

```bash
./deploy.sh
```

### 6. Kontrol Edin
```bash
# Status
fly status

# Logs (canlı)
fly logs

# App'i açın
fly open

# Health check
fly checks list
```

## 🔍 Sorun Giderme

### "command not found: fly"
```bash
# Fly CLI kurun
curl -L https://fly.io/install.sh | sh

# PATH'e ekleyin
export PATH="$HOME/.fly/bin:$PATH"
```

### "not logged in"
```bash
fly auth login
```

### "app not found"
```bash
fly launch --no-deploy
```

### "build failed - permission denied"
```bash
# deploy.sh'e çalıştırma izni verin
chmod +x deploy.sh
```

### Database bağlantı hatası
```bash
# Database oluşturun
fly postgres create --name nitor-db --region iad

# Database'i bağlayın
fly postgres attach nitor-db -a nitor

# Database URL'i kontrol edin
fly secrets list | grep DATABASE
```

## 📋 Checklist

Deploy etmeden önce kontrol edin:

- [ ] `cd packages/backend` ile doğru klasördesiniz
- [ ] `ls pom.xml` komutu dosyayı buluyor
- [ ] `ls -d src` komutu klasörü buluyor
- [ ] `fly auth whoami` çalışıyor (giriş yapmışsınız)
- [ ] Secrets eklendi (fly secrets list)
- [ ] Database oluşturuldu (fly postgres list)

## 🚀 Hızlı Deploy

```bash
cd /home/user/nitor/packages/backend && ./deploy.sh
```

Tek satır, her şeyi halleder!

## ℹ️ Ek Bilgi

### Build Context Nedir?

Docker build yaparken, Dockerfile'ın hangi klasörü "root" olarak kullanacağını belirler.

**Yanlış:**
```
Build context: /home/user/nitor/
Dockerfile COPY pom.xml → /home/user/nitor/pom.xml ARAR (YOK!)
```

**Doğru:**
```
Build context: /home/user/nitor/packages/backend/
Dockerfile COPY pom.xml → /home/user/nitor/packages/backend/pom.xml (VAR!)
```

### Neden packages/backend/ İçinden Deploy?

Çünkü:
1. Dockerfile burada: `packages/backend/Dockerfile`
2. pom.xml burada: `packages/backend/pom.xml`
3. src/ burada: `packages/backend/src/`
4. fly.toml burada: `packages/backend/fly.toml`

Fly.io, komutun çalıştırıldığı klasörü build context olarak kullanır.

## 📞 Yardım

Hala sorun mu var?

1. Deploy script'i kullanın: `./deploy.sh`
2. Verbose loglara bakın: `fly deploy --verbose`
3. Fly.io docs: https://fly.io/docs/languages-and-frameworks/dockerfile/
