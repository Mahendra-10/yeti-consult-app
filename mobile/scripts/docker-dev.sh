#!/bin/bash

# Yeti-Consult Development Environment Script
# This script helps you start your development environment with Docker

set -e  # Exit on any error

echo "🚀 Starting Yeti-Consult Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose down
}

# Set up cleanup on script exit
trap cleanup EXIT

# Build and start the development environment
echo "📦 Building development image..."
docker-compose build

echo "🔄 Starting development services..."
docker-compose up

echo "✅ Development environment is running!"
echo "📱 Your app should be available at: http://localhost:8081"
echo "🔧 Expo DevTools: http://localhost:19000"
echo ""
echo "Press Ctrl+C to stop the development environment" 