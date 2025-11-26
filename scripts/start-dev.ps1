# Nitor Development Startup Script (PowerShell)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Nitor Development Environment..." -ForegroundColor Cyan

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Please update .env with your configuration (especially GEMINI_API_KEY)" -ForegroundColor Yellow
}

# Start services with Docker Compose
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Cyan
docker compose -f infrastructure/docker/docker-compose.yml up -d

Write-Host ""
Write-Host "✅ Nitor is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Services:" -ForegroundColor Cyan
Write-Host "   - Frontend:  http://localhost:3000"
Write-Host "   - Backend:   http://localhost:8080"
Write-Host "   - Swagger:   http://localhost:8080/swagger-ui.html"
Write-Host "   - AI Service: http://localhost:3001"
Write-Host "   - MinIO:     http://localhost:9001"
Write-Host ""
Write-Host "📊 View logs with: docker compose -f infrastructure/docker/docker-compose.yml logs -f" -ForegroundColor Yellow
Write-Host "🛑 Stop services with: .\scripts\stop-dev.ps1" -ForegroundColor Yellow
