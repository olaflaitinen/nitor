# NITOR Nginx Configuration

This directory contains Nginx configuration files for the NITOR application.

## Files

- **nginx.conf**: Main Nginx configuration with performance optimizations
- **nitor.conf**: Production site configuration with SSL/TLS
- **nitor-dev.conf**: Development configuration without SSL

## Production Setup

### 1. Install Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 2. Install Certbot for Let's Encrypt

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### 3. Configure SSL Certificates

```bash
# Obtain SSL certificate
sudo certbot certonly --nginx -d nitor.io -d www.nitor.io

# Auto-renewal (already configured in most installations)
sudo certbot renew --dry-run
```

### 4. Deploy Configuration

```bash
# Copy configurations
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp nitor.conf /etc/nginx/sites-available/nitor.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/nitor.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Development Setup

```bash
# Copy development configuration
sudo cp nitor-dev.conf /etc/nginx/sites-available/nitor-dev.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/nitor-dev.conf /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## Docker Setup

For containerized deployment:

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nitor.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - backend
      - frontend

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

## Rate Limiting

The configuration includes multiple rate limiting zones:

- **api_limit**: 100 requests/second for general API endpoints
- **auth_limit**: 5 requests/second for authentication endpoints

## Security Headers

All responses include security headers:
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content-Security-Policy

## Performance Optimizations

- Gzip compression for text assets
- Browser caching for static assets (1 year)
- HTTP/2 support
- Connection keep-alive
- Upstream connection pooling

## Monitoring

Access logs: `/var/log/nginx/access.log`
Error logs: `/var/log/nginx/error.log`

Logs include upstream response times for performance monitoring.

## Troubleshooting

### Check Nginx status
```bash
sudo systemctl status nginx
```

### View error logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Test configuration
```bash
sudo nginx -t
```

### Reload without downtime
```bash
sudo nginx -s reload
```
