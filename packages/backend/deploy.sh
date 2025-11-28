#!/bin/bash

# ===========================================
# NITOR BACKEND - FLY.IO DEPLOY SCRIPT
# ===========================================

set -e  # Exit on error

echo "=========================================="
echo "NITOR Backend - Fly.io Deployment"
echo "=========================================="
echo ""

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io!"
    echo ""
    echo "Login with:"
    echo "  fly auth login"
    exit 1
fi

# Get to the correct directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📂 Working directory: $(pwd)"
echo ""

# Check if files exist
if [ ! -f "pom.xml" ]; then
    echo "❌ pom.xml not found!"
    echo "Make sure you're in packages/backend/ directory"
    exit 1
fi

if [ ! -d "src" ]; then
    echo "❌ src/ directory not found!"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found!"
    exit 1
fi

echo "✓ All required files found"
echo ""

# Check if app exists
if ! fly status -a nitor &> /dev/null; then
    echo "⚠️  App 'nitor' not found!"
    echo ""
    echo "Creating new app..."
    fly launch --no-deploy
    echo ""
fi

# Deploy
echo "🚀 Starting deployment..."
echo ""

fly deploy

echo ""
echo "=========================================="
echo "✓ Deployment Complete!"
echo "=========================================="
echo ""
echo "Check status:"
echo "  fly status"
echo ""
echo "View logs:"
echo "  fly logs"
echo ""
echo "Open app:"
echo "  fly open"
echo ""
