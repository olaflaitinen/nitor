#!/bin/bash

# Nitor Development Stop Script

echo "🛑 Stopping Nitor Development Environment..."

docker-compose -f infrastructure/docker/docker-compose.yml down

echo "✅ All services stopped."
echo "💾 Data is preserved. Use 'docker-compose down -v' to remove volumes."
