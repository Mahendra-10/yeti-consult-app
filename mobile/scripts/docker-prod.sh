#!/bin/bash

# Yeti-Consult Production Build Script
# This script builds and runs the production version of your app

set -e  # Exit on any error

echo "🏭 Building Yeti-Consult Production Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose -f docker-compose.prod.yml down
}

# Set up cleanup on script exit
trap cleanup EXIT

# Build the production image
echo "📦 Building production image..."
docker-compose -f docker-compose.prod.yml build

echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up

echo "✅ Production environment is running!"
echo "🌐 Your app should be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the production environment" 