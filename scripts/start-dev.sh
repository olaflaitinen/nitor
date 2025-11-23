#!/bin/bash

# Nitor Development Startup Script

set -e

echo "🚀 Starting Nitor Development Environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please update .env with your configuration (especially GEMINI_API_KEY)"
fi

# Start services with Docker Compose
echo "🐳 Starting Docker containers..."
docker-compose -f infrastructure/docker/docker-compose.yml up -d

echo ""
echo "✅ Nitor is starting up!"
echo ""
echo "📡 Services:"
echo "   - Frontend:  http://localhost:3000"
echo "   - Backend:   http://localhost:8080"
echo "   - Swagger:   http://localhost:8080/swagger-ui.html"
echo "   - AI Service: http://localhost:3001"
echo "   - MinIO:     http://localhost:9001"
echo ""
echo "📊 View logs with: docker-compose -f infrastructure/docker/docker-compose.yml logs -f"
echo "🛑 Stop services with: ./scripts/stop-dev.sh"
