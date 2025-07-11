import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, AuthUser } from '../types/user';

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: User = {
        uid: user.uid,
        email: user.email!,
        name: userData.name || '',
        profilePicture: userData.profilePicture,
        currentLocation: userData.currentLocation || 'Nepal',
        destinationCountry: userData.destinationCountry || '',
        destinationState: userData.destinationState,
        destinationCity: userData.destinationCity,
        university: userData.university,
        studyField: userData.studyField,
        interests: userData.interests || [],
        goals: userData.goals || [],
        preferences: userData.preferences || {
          privacyLevel: 'public',
          notificationSettings: {
            matches: true,
            groupActivities: true,
            feedUpdates: true,
            messages: true,
            pushNotifications: true,
          },
          language: 'en',
          timezone: 'Asia/Kathmandu',
        },
        expoPushToken: userData.expoPushToken,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        bio: userData.bio,
        contactInfo: userData.contactInfo,
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update Firebase Auth display name
      if (userData.name) {
        await updateFirebaseProfile(user, {
          displayName: userData.name,
          photoURL: userData.profilePicture,
        });
      }

      return userProfile;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      // Return basic user info from Firebase Auth if Firestore is unavailable
      if (auth.currentUser) {
        return {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email || '',
          name: auth.currentUser.displayName || '',
          profilePicture: auth.currentUser.photoURL || undefined,
          currentLocation: 'Nepal',
          destinationCountry: '',
          destinationState: '',
          destinationCity: '',
          university: '',
          studyField: '',
          interests: [],
          goals: [],
          preferences: {
            privacyLevel: 'public',
            notificationSettings: {
              matches: true,
              groupActivities: true,
              feedUpdates: true,
              messages: true,
              pushNotifications: true,
            },
            language: 'en',
            timezone: 'Asia/Kathmandu',
          },
          expoPushToken: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          bio: '',
          contactInfo: {},
        };
      }
      return null;
    }
  }

  // Update user profile
  static async updateProfile(uid: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Update Firebase Auth display name if name is being updated
      if (updates.name && auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: updates.name,
          photoURL: updates.profilePicture,
        });
      }
    } catch (error: any) {
      throw new Error('Failed to update profile');
    }
  }

  // Update push token
  static async updatePushToken(uid: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        expoPushToken: token,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating push token:', error);
    }
  }

  // Search users
  static async searchUsers(query: string, currentUserId: string): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('isActive', '==', true),
        where('uid', '!=', currentUserId)
      );
      
      const snapshot = await getDocs(q);
      const users = snapshot.docs
        .map(doc => doc.data() as User)
        .filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.studyField?.toLowerCase().includes(query.toLowerCase()) ||
          user.university?.toLowerCase().includes(query.toLowerCase())
        );

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Get user by ID
  static async getUserById(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) return null;
      return userDoc.data() as User;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Auth state listener
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Error message mapping
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long';
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  }
} 