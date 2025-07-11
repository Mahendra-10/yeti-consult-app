# Yeti-Consult 🏔️

A social networking platform for Nepali international students, built with React Native and Firebase.

## Features 🌟

- **User Authentication** - Secure login and registration
- **Smart Matching** - Connect with fellow Nepali students
- **Groups** - Join and create study groups
- **Messaging** - Real-time chat with matches
- **Global Feed** - Share experiences and updates
- **Profile Management** - Complete user profiles

## Tech Stack 🛠️

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Firestore, Functions, Auth)
- **Development**: Docker containerization
- **Deployment**: CI/CD with GitHub Actions

## Quick Start 🚀

### Prerequisites
- Docker Desktop
- Node.js 18+
- Expo CLI

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yeti-consult.git
   cd yeti-consult
   ```

2. **Start with Docker**
   ```bash
   cd mobile
   docker-compose up --build
   ```

3. **Access the app**
   - Web: http://localhost:8081
   - Mobile: Scan QR code with Expo Go app

### Local Development (without Docker)

1. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

## Project Structure 📁

```
yeti-consult/
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens
│   │   ├── services/       # API and Firebase services
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── navigation/     # Navigation setup
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Development container
│   └── docker-compose.yml  # Multi-container setup
├── backend/                # Firebase Functions (future)
├── docs/                   # Documentation
└── shared/                 # Shared types and constants
```

## Docker Development 🐳

### Development Environment
```bash
# Start development environment
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

### Benefits
- **Consistent environment** across all developers
- **Isolated dependencies** from system
- **Easy onboarding** for new team members
- **Production-like** testing environment

## CI/CD Pipeline 🔄

### GitHub Actions Workflow
- **Automatic testing** on pull requests
- **Docker image building** and pushing
- **Deployment** to staging/production
- **Security scanning** and vulnerability checks

### Deployment Stages
1. **Development** - Local Docker environment
2. **Staging** - Automated testing and validation
3. **Production** - Live deployment with rollback capability

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines 📋

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

### Git Workflow
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: New features
- **hotfix/***: Critical bug fixes

## Environment Variables 🔐

Create a `.env` file in the `mobile` directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Testing 🧪

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Deployment 🚀

### Staging
- Automatic deployment on `develop` branch
- Firebase hosting for web version
- TestFlight/Google Play for mobile

### Production
- Manual deployment from `main` branch
- Blue-green deployment strategy
- Automated rollback on failure

## Monitoring 📊

- **Performance**: Firebase Performance Monitoring
- **Errors**: Firebase Crashlytics
- **Analytics**: Firebase Analytics
- **Logs**: Cloud Logging

## Security 🔒

- **Authentication**: Firebase Auth
- **Data**: Firestore security rules
- **API**: Firebase Functions with authentication
- **Storage**: Firebase Storage with access control

## Support 💬

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: `/docs` folder
- **Wiki**: GitHub Wiki

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- **Expo** for the amazing React Native development platform
- **Firebase** for the comprehensive backend services
- **React Native community** for the excellent ecosystem
- **Nepali student community** for inspiration and feedback

---

**Built with ❤️ for the Nepali international student community** 