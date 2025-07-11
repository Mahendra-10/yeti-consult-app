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
  startAfter,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Group, GroupFormData, GroupMember, GroupPost } from '../types/group';
import { User } from '../types/user';

export class GroupsService {
  // Create a new group
  static async createGroup(user: User, groupData: GroupFormData): Promise<string> {
    try {
      const group: Omit<Group, 'id'> = {
        name: groupData.name,
        description: groupData.description,
        coverImage: groupData.coverImage,
        creatorId: user.uid,
        creatorName: user.name,
        criteria: groupData.criteria,
        memberIds: [user.uid], // Creator is automatically a member
        memberCount: 1,
        isPublic: groupData.isPublic,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: groupData.tags || [],
        rules: groupData.rules || [],
        category: groupData.category,
        location: groupData.location,
      };

      const docRef = await addDoc(collection(db, 'groups'), {
        ...group,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add creator as admin member
      await addDoc(collection(db, 'groupMembers'), {
        groupId: docRef.id,
        userId: user.uid,
        userName: user.name,
        userProfilePicture: user.profilePicture,
        role: 'admin',
        joinedAt: serverTimestamp(),
        isActive: true,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw new Error('Failed to create group');
    }
  }

  // Get groups with pagination
  static async getGroups(
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    pageSize: number = 10
  ): Promise<{ groups: Group[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      let q = query(
        collection(db, 'groups'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Group[];

      return {
        groups,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (error) {
      console.error('Error getting groups:', error);
      throw new Error('Failed to load groups');
    }
  }

  // Get user's groups
  static async getUserGroups(userId: string): Promise<Group[]> {
    try {
      const q = query(
        collection(db, 'groups'),
        where('memberIds', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Group[];
    } catch (error) {
      console.error('Error getting user groups:', error);
      return [];
    }
  }

  // Get group by ID
  static async getGroupById(groupId: string): Promise<Group | null> {
    try {
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      if (!groupDoc.exists()) return null;

      return {
        id: groupDoc.id,
        ...groupDoc.data(),
        createdAt: groupDoc.data().createdAt?.toDate(),
        updatedAt: groupDoc.data().updatedAt?.toDate(),
      } as Group;
    } catch (error) {
      console.error('Error getting group by ID:', error);
      return null;
    }
  }

  // Join group
  static async joinGroup(groupId: string, user: User): Promise<void> {
    try {
      const groupRef = doc(db, 'groups', groupId);
      
      // Add user to group members
      await updateDoc(groupRef, {
        memberIds: arrayUnion(user.uid),
        memberCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      // Add user to group members collection
      await addDoc(collection(db, 'groupMembers'), {
        groupId,
        userId: user.uid,
        userName: user.name,
        userProfilePicture: user.profilePicture,
        role: 'member',
        joinedAt: serverTimestamp(),
        isActive: true,
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw new Error('Failed to join group');
    }
  }

  // Leave group
  static async leaveGroup(groupId: string, userId: string): Promise<void> {
    try {
      const groupRef = doc(db, 'groups', groupId);
      
      // Remove user from group members
      await updateDoc(groupRef, {
        memberIds: arrayRemove(userId),
        memberCount: increment(-1),
        updatedAt: serverTimestamp(),
      });

      // Remove user from group members collection
      const membersRef = collection(db, 'groupMembers');
      const q = query(
        membersRef,
        where('groupId', '==', groupId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error leaving group:', error);
      throw new Error('Failed to leave group');
    }
  }

  // Get group members
  static async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const q = query(
        collection(db, 'groupMembers'),
        where('groupId', '==', groupId),
        where('isActive', '==', true),
        orderBy('joinedAt', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        joinedAt: doc.data().joinedAt?.toDate(),
      })) as GroupMember[];
    } catch (error) {
      console.error('Error getting group members:', error);
      return [];
    }
  }

  // Create group post
  static async createGroupPost(groupId: string, user: User, content: string, images?: string[]): Promise<string> {
    try {
      const post: Omit<GroupPost, 'id'> = {
        groupId,
        authorId: user.uid,
        authorName: user.name,
        authorProfilePicture: user.profilePicture,
        content,
        images: images || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
        isEdited: false,
      };

      const docRef = await addDoc(collection(db, 'groupPosts'), {
        ...post,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating group post:', error);
      throw new Error('Failed to create group post');
    }
  }

  // Get group posts
  static async getGroupPosts(groupId: string): Promise<GroupPost[]> {
    try {
      const q = query(
        collection(db, 'groupPosts'),
        where('groupId', '==', groupId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as GroupPost[];
    } catch (error) {
      console.error('Error getting group posts:', error);
      return [];
    }
  }

  // Search groups
  static async searchGroups(query: string): Promise<Group[]> {
    try {
      const q = query(
        collection(db, 'groups'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }))
        .filter(group => 
          group.name.toLowerCase().includes(query.toLowerCase()) ||
          group.description.toLowerCase().includes(query.toLowerCase()) ||
          group.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        ) as Group[];
    } catch (error) {
      console.error('Error searching groups:', error);
      return [];
    }
  }

  // Get recommended groups for user
  static async getRecommendedGroups(user: User): Promise<Group[]> {
    try {
      const q = query(
        collection(db, 'groups'),
        where('isPublic', '==', true),
        orderBy('memberCount', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Group[];

      // Filter out groups user is already a member of
      return groups.filter(group => !group.memberIds.includes(user.uid));
    } catch (error) {
      console.error('Error getting recommended groups:', error);
      return [];
    }
  }

  // Update group
  static async updateGroup(groupId: string, updates: Partial<Group>): Promise<void> {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating group:', error);
      throw new Error('Failed to update group');
    }
  }

  // Delete group
  static async deleteGroup(groupId: string): Promise<void> {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await deleteDoc(groupRef);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Failed to delete group');
    }
  }

  // Real-time listener for groups
  static subscribeToGroups(callback: (groups: Group[]) => void) {
    const q = query(
      collection(db, 'groups'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Group[];
      callback(groups);
    });
  }
} 