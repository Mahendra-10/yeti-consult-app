export interface User {
  uid: string;
  email: string;
  name: string;
  profilePicture?: string;
  currentLocation: string; // Nepal
  destinationCountry: string;
  destinationState?: string;
  destinationCity?: string;
  university?: string;
  studyField?: string;
  interests: string[];
  goals: string[];
  preferences: UserPreferences;
  expoPushToken?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  bio?: string;
  contactInfo?: ContactInfo;
}

export interface UserPreferences {
  privacyLevel: 'public' | 'friends' | 'private';
  notificationSettings: NotificationSettings;
  language: string;
  timezone: string;
}

export interface NotificationSettings {
  matches: boolean;
  groupActivities: boolean;
  feedUpdates: boolean;
  messages: boolean;
  pushNotifications: boolean;
}

export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
}

export interface UserProfile extends Omit<User, 'uid' | 'email'> {
  id: string;
  isFollowing?: boolean;
  isBlocked?: boolean;
  mutualConnections?: number;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
} 