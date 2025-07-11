# Yeti-Consult: International Student Networking App

A comprehensive React Native Expo app designed to help Nepali international students connect with each other based on their study abroad destinations, interests, and goals.

## 🚀 Features

### Core Functionality
- **User Authentication & Profile Management**
  - Email/password authentication with Firebase Auth
  - Comprehensive user profiles with study information
  - Profile picture upload and management
  - Privacy settings and preferences

- **Smart Matching System**
  - Algorithm-based user matching
  - Match scoring based on shared interests, goals, and destinations
  - Connection requests and management
  - User discovery and search

- **Group Discovery & Creation**
  - Automated group recommendations
  - Manual group creation with custom criteria
  - Group categories (location, university, study field, interests)
  - Join/leave group functionality
  - Group posts and discussions

- **Global Community Feed**
  - Facebook-style news feed for all authenticated users
  - Post types: text, images, links
  - Real-time updates using Firestore listeners
  - Infinite scroll with pagination
  - Post engagement features (reactions, comments, shares)
  - Rich text editor for posts

- **In-App Messaging**
  - Real-time messaging between users
  - Conversation management
  - Message notifications
  - Media sharing in chats

- **Additional Features**
  - Push notifications for matches, group activities, and feed updates
  - Search functionality for users and groups
  - User blocking/reporting system
  - Settings and privacy controls
  - Dark mode support
  - Offline capability

## 🛠 Tech Stack

### Frontend
- **Expo SDK 50+** - React Native development platform
- **Expo Router** - File-based navigation
- **React Native Paper** - Material Design components
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **React Native Reanimated 3** - Animations
- **React Native Gesture Handler** - Touch interactions

### Backend (Firebase)
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - Real-time database
- **Firebase Cloud Storage** - File uploads
- **Firebase Cloud Functions** - Backend logic
- **Firebase Cloud Messaging** - Push notifications
- **Firebase Analytics** - User tracking
- **Firebase Performance Monitoring** - Performance tracking

### Additional Services
- **Expo Notifications** - Push notification handling
- **Expo Image Picker** - Photo selection
- **Expo Camera** - Profile pictures
- **Expo Location** - Location services
- **Expo Secure Store** - Secure local storage
- **Expo Linear Gradient** - UI enhancements

## 📱 App Structure

```
mobile/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Authentication routes
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx            # Home feed
│   │   ├── discover.tsx         # User matching
│   │   ├── groups.tsx           # Groups discovery
│   │   ├── chats.tsx            # Messages
│   │   ├── profile.tsx          # User profile
│   │   └── _layout.tsx
│   ├── (modals)/                # Modal screens
│   │   ├── create-post.tsx
│   │   ├── create-group.tsx
│   │   └── edit-profile.tsx
│   ├── onboarding/              # Onboarding flow
│   │   ├── welcome.tsx
│   │   ├── profile-setup.tsx
│   │   └── preferences.tsx
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 page
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── common/              # Common components
│   │   ├── forms/               # Form components
│   │   ├── feed/                # Feed-related components
│   │   ├── matching/            # Matching components
│   │   └── groups/              # Group components
│   ├── services/                 # API calls and Firebase config
│   │   ├── firebase.ts          # Firebase configuration
│   │   ├── auth.ts              # Authentication service
│   │   ├── posts.ts             # Posts service
│   │   ├── groups.ts            # Groups service
│   │   ├── storage.ts           # Cloud Storage operations
│   │   └── notifications.ts     # Push notifications
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Helper functions
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.tsx      # Authentication context
│   │   └── ThemeContext.tsx     # Theme context
│   ├── types/                    # TypeScript type definitions
│   │   ├── user.ts              # User types
│   │   ├── post.ts              # Post types
│   │   ├── group.ts             # Group types
│   │   └── common.ts            # Common types
│   └── styles/                   # Styling files
│       ├── colors.ts            # Color scheme
│       ├── typography.ts        # Typography system
│       └── spacing.ts           # Spacing system
├── assets/                       # Images, fonts, etc.
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Firebase project
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Cloud Storage
   - Get your Firebase config

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   EXPO_PUBLIC_PROJECT_ID=your_expo_project_id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage
   - Cloud Functions (optional)
   - Cloud Messaging
   - Analytics
   - Performance Monitoring

3. Set up Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Posts are readable by all authenticated users
       match /posts/{postId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
       }
       
       // Groups are readable by all authenticated users
       match /groups/{groupId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == resource.data.creatorId;
       }
     }
   }
   ```

4. Set up Storage security rules:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /profile-pictures/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /posts/{postId}/{allPaths=**} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
     }
   }
   ```

### Expo Configuration
The app is configured with the following Expo plugins:
- `expo-router` - File-based navigation
- `expo-font` - Custom fonts
- `expo-camera` - Camera functionality
- `expo-image-picker` - Image selection
- `expo-notifications` - Push notifications
- `expo-location` - Location services
- `expo-secure-store` - Secure storage
- `expo-linear-gradient` - UI enhancements
- `expo-build-properties` - Build configuration

## 📱 Features in Detail

### Authentication Flow
- Email/password registration and login
- Password reset functionality
- Profile creation with comprehensive user information
- Onboarding flow for new users
- Secure token management

### User Matching Algorithm
The matching algorithm considers:
- Same destination country (30 points)
- Same destination state/city (15-20 points)
- Same university (25 points)
- Same study field (20 points)
- Shared interests (5 points each)
- Shared goals (5 points each)

### Feed System
- Real-time post updates
- Infinite scroll with pagination
- Post reactions (❤️, 👍, 😊, 🎉, 🤔, 😢)
- Comment system with nested replies
- Image and link sharing
- Post visibility settings

### Group System
- Automated group recommendations
- Manual group creation
- Group categories and tags
- Member management
- Group posts and discussions
- Privacy settings

### Messaging System
- Real-time messaging
- Conversation management
- Media sharing
- Read receipts
- Push notifications

## 🚀 Deployment

### EAS Build Setup
1. Install EAS CLI:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Configure EAS Build:
   ```bash
   eas build:configure
   ```

4. Build for production:
   ```bash
   # Development build
   eas build --profile development --platform ios
   eas build --profile development --platform android
   
   # Preview build
   eas build --profile preview --platform all
   
   # Production build
   eas build --profile production --platform all
   ```

### App Store Deployment
1. Submit to App Store:
   ```bash
   eas submit --platform ios
   ```

2. Submit to Google Play Store:
   ```bash
   eas submit --platform android
   ```

### Over-the-Air Updates
1. Publish updates:
   ```bash
   eas update --branch production --message "Bug fixes and improvements"
   ```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run e2e
```

### Performance Testing
```bash
npm run test:performance
```

## 📊 Analytics & Monitoring

The app includes:
- Firebase Analytics for user behavior tracking
- Firebase Performance Monitoring for app performance
- Crash reporting and error tracking
- User engagement metrics

## 🔒 Security

- Secure authentication with Firebase Auth
- Firestore security rules for data protection
- Secure storage for sensitive data
- Input validation and sanitization
- Rate limiting for API calls
- User privacy controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ User authentication and profiles
- ✅ Feed system with posts and reactions
- ✅ User matching and discovery
- ✅ Group creation and management
- ✅ Basic messaging system

### Phase 2 (Planned)
- 🔄 Advanced matching algorithms
- 🔄 Video calling integration
- 🔄 Study group scheduling
- 🔄 Academic resource sharing
- 🔄 Mentorship program

### Phase 3 (Future)
- 📋 AI-powered recommendations
- 📋 Virtual study rooms
- 📋 Career networking features
- 📋 Alumni network
- 📋 International event coordination

---

**Built with ❤️ for the Nepali international student community** 