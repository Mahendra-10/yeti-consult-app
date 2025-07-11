import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '../types/user';
import { Match } from '../types/common';

export class MatchingService {
  // Calculate match score between two users
  static calculateMatchScore(user1: User, user2: User): number {
    let score = 0;

    // Same destination country (30 points)
    if (user1.destinationCountry === user2.destinationCountry) {
      score += 30;
    }

    // Same destination state (20 points)
    if (user1.destinationState === user2.destinationState) {
      score += 20;
    }

    // Same destination city (15 points)
    if (user1.destinationCity === user2.destinationCity) {
      score += 15;
    }

    // Same university (25 points)
    if (user1.university === user2.university) {
      score += 25;
    }

    // Same study field (20 points)
    if (user1.studyField === user2.studyField) {
      score += 20;
    }

    // Shared interests (5 points each)
    const sharedInterests = user1.interests.filter(interest =>
      user2.interests.includes(interest)
    );
    score += sharedInterests.length * 5;

    // Shared goals (5 points each)
    const sharedGoals = user1.goals.filter(goal =>
      user2.goals.includes(goal)
    );
    score += sharedGoals.length * 5;

    return Math.min(score, 100);
  }

  // Get recommended users for a given user
  static async getRecommendedUsers(
    currentUser: User,
    limit: number = 20
  ): Promise<User[]> {
    try {
      // Get all users except current user
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('isActive', '==', true),
        where('uid', '!=', currentUser.uid),
        orderBy('uid'),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      const users: User[] = [];

      snapshot.forEach((doc) => {
        const userData = doc.data() as User;
        if (userData.uid !== currentUser.uid) {
          users.push(userData);
        }
      });

      // Calculate match scores and sort by score
      const usersWithScores = users.map(user => ({
        user,
        matchScore: this.calculateMatchScore(currentUser, user)
      }));

      usersWithScores.sort((a, b) => b.matchScore - a.matchScore);

      return usersWithScores.map(item => item.user);
    } catch (error) {
      console.error('Error getting recommended users:', error);
      throw error;
    }
  }

  // Send connection request
  static async sendConnectionRequest(
    fromUserId: string,
    toUserId: string
  ): Promise<string> {
    try {
      const matchData: Omit<Match, 'id'> = {
        userId1: fromUserId,
        userId2: toUserId,
        matchScore: 0, // Will be calculated when accepted
        sharedInterests: [],
        sharedGoals: [],
        createdAt: new Date(),
        status: 'pending',
      };

      const docRef = await addDoc(collection(db, 'matches'), matchData);
      return docRef.id;
    } catch (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
  }

  // Accept connection request
  static async acceptConnectionRequest(matchId: string): Promise<void> {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        status: 'accepted',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error accepting connection request:', error);
      throw error;
    }
  }

  // Reject connection request
  static async rejectConnectionRequest(matchId: string): Promise<void> {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error rejecting connection request:', error);
      throw error;
    }
  }

  // Get pending connection requests
  static async getPendingRequests(userId: string): Promise<Match[]> {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(
        matchesRef,
        where('userId2', '==', userId),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);
      const matches: Match[] = [];

      snapshot.forEach((doc) => {
        matches.push({
          id: doc.id,
          ...doc.data(),
        } as Match);
      });

      return matches;
    } catch (error) {
      console.error('Error getting pending requests:', error);
      throw error;
    }
  }

  // Get user connections
  static async getUserConnections(userId: string): Promise<User[]> {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(
        matchesRef,
        where('status', '==', 'accepted'),
        where('userId1', '==', userId)
      );

      const snapshot = await getDocs(q);
      const connectedUserIds: string[] = [];

      snapshot.forEach((doc) => {
        const match = doc.data() as Match;
        connectedUserIds.push(match.userId2);
      });

      // Get user details for connected users
      const users: User[] = [];
      for (const connectedUserId of connectedUserIds) {
        const userDoc = await getDoc(doc(db, 'users', connectedUserId));
        if (userDoc.exists()) {
          users.push(userDoc.data() as User);
        }
      }

      return users;
    } catch (error) {
      console.error('Error getting user connections:', error);
      throw error;
    }
  }

  // Block user
  static async blockUser(
    fromUserId: string,
    toUserId: string
  ): Promise<void> {
    try {
      // Create or update match with blocked status
      const matchData: Omit<Match, 'id'> = {
        userId1: fromUserId,
        userId2: toUserId,
        matchScore: 0,
        sharedInterests: [],
        sharedGoals: [],
        createdAt: new Date(),
        status: 'blocked',
      };

      await addDoc(collection(db, 'matches'), matchData);
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  // Unblock user
  static async unblockUser(
    fromUserId: string,
    toUserId: string
  ): Promise<void> {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(
        matchesRef,
        where('userId1', '==', fromUserId),
        where('userId2', '==', toUserId),
        where('status', '==', 'blocked')
      );

      const snapshot = await getDocs(q);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  }

  // Get blocked users
  static async getBlockedUsers(userId: string): Promise<User[]> {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(
        matchesRef,
        where('userId1', '==', userId),
        where('status', '==', 'blocked')
      );

      const snapshot = await getDocs(q);
      const blockedUserIds: string[] = [];

      snapshot.forEach((doc) => {
        const match = doc.data() as Match;
        blockedUserIds.push(match.userId2);
      });

      // Get user details for blocked users
      const users: User[] = [];
      for (const blockedUserId of blockedUserIds) {
        const userDoc = await getDoc(doc(db, 'users', blockedUserId));
        if (userDoc.exists()) {
          users.push(userDoc.data() as User);
        }
      }

      return users;
    } catch (error) {
      console.error('Error getting blocked users:', error);
      throw error;
    }
  }
} 