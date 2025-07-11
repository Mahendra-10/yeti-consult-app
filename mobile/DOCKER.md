# Docker Setup for Yeti-Consult

This document explains how to use Docker with your Yeti-Consult Expo React Native app.

## 🐳 What is Docker?

Docker is a platform that packages your application and its dependencies into lightweight, portable containers. For your Yeti-Consult app, this means:

- **Consistent Environment**: Same development environment across different machines
- **Isolated Dependencies**: No conflicts with other projects on your system
- **Easy Deployment**: Build once, run anywhere
- **Team Collaboration**: Everyone uses the exact same setup

## 📁 Docker Files Explained

### 1. `Dockerfile`
**Purpose**: Creates a development environment for your Expo app
**What it contains**:
- Node.js 18 runtime
- Expo CLI and EAS CLI
- All your React Native dependencies
- Development server configuration

### 2. `Dockerfile.prod`
**Purpose**: Creates a production-ready web build of your app
**What it contains**:
- Multi-stage build process
- Web build compilation
- Nginx web server for serving static files

### 3. `docker-compose.yml`
**Purpose**: Orchestrates development services
**What it contains**:
- Development server configuration
- Volume mounting for hot reloading
- Port mapping for Expo dev tools
- Optional Firebase emulator

### 4. `docker-compose.prod.yml`
**Purpose**: Orchestrates production services
**What it contains**:
- Production web server
- Health checks
- Production environment variables

### 5. `.dockerignore`
**Purpose**: Excludes unnecessary files from Docker build
**What it excludes**:
- `node_modules` (installed fresh in container)
- Build artifacts
- IDE files
- Environment files

## 🚀 Quick Start

### Prerequisites
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Make sure Docker is running

### Development Environment
```bash
# Start development environment
./scripts/docker-dev.sh

# Or manually:
docker-compose up --build
```

**What happens**:
1. Builds your development image
2. Starts Expo development server
3. Mounts your code for hot reloading
4. Opens ports for Expo dev tools

**Access your app**:
- Expo Dev Server: http://localhost:8081
- Expo DevTools: http://localhost:19000

### Production Environment
```bash
# Start production environment
./scripts/docker-prod.sh

# Or manually:
docker-compose -f docker-compose.prod.yml up --build
```

**What happens**:
1. Builds your app for web
2. Creates optimized production image
3. Serves with Nginx web server

**Access your app**:
- Production Web App: http://localhost:3000

## 🔧 Docker Commands Explained

### Building Images
```bash
# Build development image
docker build -t yeti-consult-dev .

# Build production image
docker build -f Dockerfile.prod -t yeti-consult-prod .
```

**What this does**:
- `-t yeti-consult-dev`: Tags the image with a name
- `-f Dockerfile.prod`: Uses a specific Dockerfile
- `.`: Uses current directory as build context

### Running Containers
```bash
# Run development container
docker run -p 8081:8081 -v $(pwd):/app yeti-consult-dev

# Run production container
docker run -p 3000:80 yeti-consult-prod
```

**What this does**:
- `-p 8081:8081`: Maps container port to host port
- `-v $(pwd):/app`: Mounts current directory for hot reloading
- `yeti-consult-dev`: Image name to run

### Managing Containers
```bash
# List running containers
docker ps

# Stop a container
docker stop <container-id>

# View container logs
docker logs <container-id>

# Execute commands in running container
docker exec -it <container-id> sh
```

## 🛠️ Development Workflow

### 1. Start Development Environment
```bash
./scripts/docker-dev.sh
```

### 2. Make Code Changes
Edit your files in your IDE. Changes are automatically reflected due to volume mounting.

### 3. Test Your App
- Open Expo Go app on your phone
- Scan the QR code from the terminal
- Or use web browser at http://localhost:8081

### 4. Stop Development Environment
Press `Ctrl+C` in the terminal or run:
```bash
docker-compose down
```

## 🏭 Production Workflow

### 1. Build Production Image
```bash
docker build -f Dockerfile.prod -t yeti-consult-prod .
```

### 2. Test Production Build
```bash
docker run -p 3000:80 yeti-consult-prod
```

### 3. Access Production App
Open http://localhost:3000 in your browser

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :8081

# Kill the process or use a different port
docker run -p 8082:8081 yeti-consult-dev
```

#### 2. Permission Denied
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

#### 3. Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t yeti-consult-dev .
```

#### 4. Hot Reloading Not Working
```bash
# Check volume mounting
docker-compose logs yeti-consult-dev

# Restart with fresh volumes
docker-compose down -v
docker-compose up --build
```

### Debugging Commands
```bash
# View container logs
docker-compose logs -f yeti-consult-dev

# Access container shell
docker-compose exec yeti-consult-dev sh

# Check container resources
docker stats
```

## 📊 Docker Benefits for Your Yeti-Consult App

### 1. **Consistent Development Environment**
- Same Node.js version across all machines
- Same Expo CLI version
- Same Firebase SDK version
- No "works on my machine" issues

### 2. **Easy Testing**
- Test different Node.js versions
- Test different dependency versions
- Isolated testing environments

### 3. **Production Confidence**
- Test exact production environment locally
- Build once, deploy anywhere
- Consistent builds across environments

### 4. **Team Collaboration**
- New developers can start immediately
- No environment setup required
- Same tools and versions for everyone

## 🔄 Next Steps

### Phase 2: CI/CD Pipeline
Once you're comfortable with Docker, we'll set up:
- GitHub Actions for automated builds
- Automated testing in containers
- Automated deployment to cloud platforms

### Phase 3: Advanced Docker
- Multi-stage builds for smaller images
- Docker networking for microservices
- Docker volumes for persistent data
- Docker secrets for secure configuration

## 📚 Learning Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Expo with Docker Guide](https://docs.expo.dev/guides/using-docker/)
- [React Native Docker Best Practices](https://reactnative.dev/docs/environment-setup)

## 🤝 Contributing

When contributing to this project:
1. Use the Docker development environment
2. Test changes in the production container
3. Update Docker documentation if needed
4. Ensure all scripts work in the containerized environment 