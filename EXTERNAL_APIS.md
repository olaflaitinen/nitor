# External APIs & Services Configuration Guide

This document lists all external APIs and services required for NITOR to function fully.

## Current Status

### [✓] Already Configured

1. **Google Gemini AI API**
   - Status: Configured
   - API Key: `AIzaSyATCeVsQi-tisEBBsupVHjMWbxDhluoopA`
   - Purpose: AI text enhancement, abstract generation, bio improvements
   - Configuration: `/packages/ai-service/.env`
   - Endpoints:
     - POST `/api/ai/refine-text`
     - POST `/api/ai/generate-abstract`
     - POST `/api/ai/enhance-bio`

### 🔴 Required (Not Configured)

2. **Email Service (SMTP)**
   - Status: **REQUIRED - Not configured**
   - Purpose: Email verification, password resets, notifications
   - Current Issue: EmailService.java exists but no real SMTP credentials
   - Configuration Needed: `.env` file
   
   **Recommended Providers:**
   - **Gmail SMTP** (Free, 500 emails/day)
     ```env
     MAIL_HOST=smtp.gmail.com
     MAIL_PORT=587
     MAIL_USERNAME=your-email@gmail.com
     MAIL_PASSWORD=your-app-password
     ```
     Setup: https://support.google.com/mail/answer/185833
   
   - **SendGrid** (Free, 100 emails/day)
     ```env
     MAIL_HOST=smtp.sendgrid.net
     MAIL_PORT=587
     MAIL_USERNAME=apikey
     MAIL_PASSWORD=your-sendgrid-api-key
     ```
     Setup: https://sendgrid.com
   
   - **AWS SES** (Production recommended)
     ```env
     MAIL_HOST=email-smtp.us-east-1.amazonaws.com
     MAIL_PORT=587
     MAIL_USERNAME=your-ses-smtp-username
     MAIL_PASSWORD=your-ses-smtp-password
     ```
     Setup: https://aws.amazon.com/ses/
   
   **What to Provide:**
   - SMTP host
   - SMTP port (usually 587 for TLS)
   - Username
   - Password/API key

### [●] Optional (Recommended for Production)

3. **OAuth Social Login Providers**
   - Status: Not implemented (JWT-only authentication currently)
   - Purpose: Social login (Google, GitHub, LinkedIn)
   - Benefits: Better UX, faster onboarding
   
   **a) Google OAuth 2.0**
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/oauth2/callback/google
   ```
   Setup: https://console.cloud.google.com/apis/credentials
   
   **b) GitHub OAuth**
   ```env
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_REDIRECT_URI=http://localhost:8080/api/auth/oauth2/callback/github
   ```
   Setup: https://github.com/settings/developers
   
   **c) LinkedIn OAuth** (Recommended for academic network)
   ```env
   LINKEDIN_CLIENT_ID=your-linkedin-client-id
   LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
   LINKEDIN_REDIRECT_URI=http://localhost:8080/api/auth/oauth2/callback/linkedin
   ```
   Setup: https://www.linkedin.com/developers/apps

4. **Cloud Storage (Production Alternative to MinIO)**
   - Status: Currently using MinIO (self-hosted)
   - Purpose: File storage for avatars, content media
   - Production Options:
   
   **a) AWS S3**
   ```env
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_S3_BUCKET=nitor-files
   AWS_REGION=us-east-1
   ```
   
   **b) Google Cloud Storage**
   ```env
   GCS_PROJECT_ID=your-project-id
   GCS_BUCKET=nitor-files
   GCS_CREDENTIALS_JSON=path/to/credentials.json
   ```
   
   **c) Cloudflare R2** (S3-compatible, cheaper)
   ```env
   R2_ACCOUNT_ID=your-account-id
   R2_ACCESS_KEY_ID=your-access-key
   R2_SECRET_ACCESS_KEY=your-secret-key
   R2_BUCKET=nitor-files
   ```

5. **Monitoring & Analytics**
   - Status: Optional
   - Purpose: Error tracking, performance monitoring
   
   **a) Sentry (Error Tracking)**
   ```env
   SENTRY_DSN=your-sentry-dsn
   SENTRY_ENVIRONMENT=production
   ```
   
   **b) Google Analytics**
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

6. **CDN (Content Delivery Network)**
   - Status: Optional
   - Purpose: Faster static asset delivery
   - Options: Cloudflare, AWS CloudFront, Fastly

## Implementation Priority

### 1. Critical (Must Have)
- [✓] Google Gemini AI - **DONE**
- 🔴 **Email SMTP** - **REQUIRED NOW**

### 2. High Priority (Production)
- [●] Cloud Storage (AWS S3 or Cloudflare R2)
- [●] Error Tracking (Sentry)

### 3. Medium Priority (UX Improvement)
- [●] OAuth Providers (Google, GitHub, LinkedIn)
- [●] CDN

### 4. Low Priority (Analytics)
- [●] Google Analytics
- [●] Monitoring dashboards

## Configuration Instructions

### Step 1: Choose Email Provider
Pick one email provider from the options above and provide the credentials.

### Step 2: Update Environment Files
Add the credentials to `.env`:

```bash
# Email Configuration (REQUIRED)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@nitor.io
```

### Step 3: Test Email Service
```bash
# Start backend
cd packages/backend
mvn spring-boot:run

# Test endpoint (create test endpoint)
curl -X POST http://localhost:8080/api/test/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "body": "Test email"}'
```

### Step 4: (Optional) Configure OAuth
If you want social login, provide OAuth credentials for each provider you want to support.

### Step 5: (Optional) Configure Production Storage
For production, replace MinIO with a cloud provider (AWS S3 recommended).

## Current System Works Without

The following features work with only Gemini API:
- [✓] User registration (email verification disabled for now)
- [✓] JWT authentication
- [✓] Profile management
- [✓] Content creation
- [✓] Comments
- [✓] CV management
- [✓] AI text enhancement
- [✓] File uploads (MinIO self-hosted)

The following features require Email SMTP:
- [✗] Email verification
- [✗] Password reset
- [✗] Welcome emails
- [✗] Notification emails

## Next Steps

**Please provide:**
1. **Email SMTP credentials** (Gmail, SendGrid, or AWS SES)
2. (Optional) OAuth provider credentials if you want social login
3. (Optional) Cloud storage credentials for production

I will then update the configuration files and test the integration.
