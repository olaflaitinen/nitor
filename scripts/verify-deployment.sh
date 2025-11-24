#!/bin/bash

# NITOR Deployment Verification Script
# This script checks if all services are running and healthy

set -e

echo "======================================"
echo "NITOR Deployment Verification"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=$3

    echo -n "Checking $service_name... "

    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null); then
        if [ "$response" -eq "$expected_status" ]; then
            echo -e "${GREEN}[OK]${NC} (HTTP $response)"
            return 0
        else
            echo -e "${YELLOW}[WARNING]${NC} (HTTP $response, expected $expected_status)"
            return 1
        fi
    else
        echo -e "${RED}[FAILED]${NC} (Service not responding)"
        return 1
    fi
}

# Function to check Docker container
check_docker_container() {
    local container_name=$1

    echo -n "Checking Docker container $container_name... "

    if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        local status=$(docker inspect --format='{{.State.Status}}' "$container_name")
        if [ "$status" = "running" ]; then
            echo -e "${GREEN}[OK]${NC} (running)"
            return 0
        else
            echo -e "${RED}[FAILED]${NC} (status: $status)"
            return 1
        fi
    else
        echo -e "${RED}[NOT FOUND]${NC}"
        return 1
    fi
}

# Check if Docker is running
echo "1. Docker Status"
echo "----------------"
if docker ps >/dev/null 2>&1; then
    echo -e "${GREEN}[OK]${NC} Docker is running"
    DOCKER_MODE=true
else
    echo -e "${YELLOW}[INFO]${NC} Docker not available, checking manual deployment"
    DOCKER_MODE=false
fi
echo ""

# Check Docker containers if Docker mode
if [ "$DOCKER_MODE" = true ]; then
    echo "2. Docker Containers"
    echo "--------------------"
    check_docker_container "nitor-postgres"
    check_docker_container "nitor-redis"
    check_docker_container "nitor-minio"
    check_docker_container "nitor-backend"
    check_docker_container "nitor-ai-service"
    check_docker_container "nitor-frontend"
    echo ""
fi

# Check service health endpoints
echo "3. Service Health Checks"
echo "------------------------"
check_service "Backend API" "http://localhost:8080/actuator/health" 200
check_service "Backend Auth" "http://localhost:8080/api/auth/health" 200
check_service "AI Service" "http://localhost:3001/health" 200
check_service "Frontend" "http://localhost:5173" 200
echo ""

# Check database connection
echo "4. Database Connection"
echo "----------------------"
echo -n "Checking PostgreSQL... "
if PGPASSWORD="${DB_PASSWORD:-nitor}" psql -h localhost -U nitor -d nitor -c "SELECT 1" >/dev/null 2>&1; then
    echo -e "${GREEN}[OK]${NC}"
else
    echo -e "${RED}[FAILED]${NC}"
fi
echo ""

# Check Redis connection
echo "5. Redis Connection"
echo "-------------------"
echo -n "Checking Redis... "
if redis-cli -h localhost ping >/dev/null 2>&1; then
    echo -e "${GREEN}[OK]${NC}"
else
    echo -e "${RED}[FAILED]${NC}"
fi
echo ""

# Check MinIO
if [ "$DOCKER_MODE" = true ]; then
    echo "6. MinIO Storage"
    echo "----------------"
    check_service "MinIO Console" "http://localhost:9001" 200
    echo ""
fi

# API Endpoint Tests
echo "7. API Endpoint Tests"
echo "---------------------"

# Test registration endpoint
echo -n "Testing registration endpoint... "
reg_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test_'$(date +%s)'@example.com","password":"Test123!","fullName":"Test User","handle":"test'$(date +%s)'"}' 2>/dev/null || echo "000")

if [ "$reg_response" -eq 201 ] || [ "$reg_response" -eq 200 ]; then
    echo -e "${GREEN}[OK]${NC} (HTTP $reg_response)"
elif [ "$reg_response" -eq 409 ]; then
    echo -e "${YELLOW}[INFO]${NC} (User exists, endpoint working)"
else
    echo -e "${RED}[FAILED]${NC} (HTTP $reg_response)"
fi

# Test AI service
echo -n "Testing AI service endpoint... "
ai_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/ai/refine-text \
  -H "Content-Type: application/json" \
  -d '{"text":"Test"}' 2>/dev/null || echo "000")

if [ "$ai_response" -eq 200 ]; then
    echo -e "${GREEN}[OK]${NC} (HTTP $ai_response)"
else
    echo -e "${RED}[FAILED]${NC} (HTTP $ai_response)"
fi
echo ""

# Summary
echo "======================================"
echo "Verification Summary"
echo "======================================"
echo ""
echo "Access Points:"
echo "  - Frontend:    http://localhost:5173"
echo "  - Backend API: http://localhost:8080"
echo "  - API Docs:    http://localhost:8080/swagger-ui.html"
echo "  - AI Service:  http://localhost:3001"
if [ "$DOCKER_MODE" = true ]; then
    echo "  - MinIO:       http://localhost:9001"
fi
echo ""
echo "For detailed logs:"
if [ "$DOCKER_MODE" = true ]; then
    echo "  docker-compose -f infrastructure/docker/docker-compose.yml logs -f"
else
    echo "  Check individual service consoles"
fi
echo ""
echo -e "${GREEN}Verification complete!${NC}"
