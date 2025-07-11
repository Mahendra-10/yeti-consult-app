# Use Node.js 18 Alpine as the base image
# Alpine is lightweight and secure - perfect for containers
FROM node:18-alpine

# Set the working directory inside the container
# This is where your app code will live
WORKDIR /app

# Install system dependencies needed for Expo and React Native
# apk is Alpine's package manager (like apt on Ubuntu)
RUN apk add --no-cache \
    git \
    curl \
    bash \
    python3 \
    make \
    g++

# Install Expo CLI and EAS CLI globally
# These are the tools you use to develop and build your Expo app
RUN npm install -g @expo/cli eas-cli

# Copy package.json and package-lock.json first
# This is a Docker best practice for better caching
# Docker will cache this layer and only re-run if these files change
COPY package*.json ./

# Install Node.js dependencies
# This installs all your React Native, Expo, and Firebase dependencies
RUN npm install

# Copy the rest of your application code
# This includes your src/, app/, assets/, etc.
COPY . .

# Expose port 8081 - this is the default Expo development server port
# This tells Docker that your app will use this port
EXPOSE 8081

# Set environment variables for Expo development
# These help Expo work properly in a containerized environment
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV NODE_ENV=development

# Default command to start the Expo development server
# This is what runs when you start the container
CMD ["npm", "start"] 