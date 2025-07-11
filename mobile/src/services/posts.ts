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
import { Post, Comment, PostFormData, ReactionType } from '../types/post';
import { User } from '../types/user';

export class PostsService {
  // Create a new post
  static async createPost(user: User, postData: PostFormData): Promise<string> {
    try {
      const post: Omit<Post, 'id'> = {
        authorId: user.uid,
        authorName: user.name,
        authorProfilePicture: user.profilePicture,
        content: postData.content,
        images: postData.images || [],
        links: postData.links || [],
        reactions: {},
        commentCount: 0,
        shareCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isEdited: false,
        tags: postData.tags || [],
        location: postData.location,
        visibility: postData.visibility,
      };

      const docRef = await addDoc(collection(db, 'posts'), {
        ...post,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  // Get posts for feed with pagination
  static async getFeedPosts(
    currentUserId: string,
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    pageSize: number = 10
  ): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      let q = query(
        collection(db, 'posts'),
        where('isActive', '==', true),
        where('visibility', 'in', ['public']),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Post[];

      return {
        posts,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (error) {
      console.error('Error getting feed posts:', error);
      throw new Error('Failed to load posts');
    }
  }

  // Get user's posts
  static async getUserPosts(userId: string): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('authorId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Post[];
    } catch (error) {
      console.error('Error getting user posts:', error);
      return [];
    }
  }

  // Update post
  static async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        isEdited: true,
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post');
    }
  }

  // Delete post
  static async deletePost(postId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post');
    }
  }

  // Add reaction to post
  static async addReaction(postId: string, reaction: ReactionType, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        [`reactions.${reaction}`]: increment(1),
        updatedAt: serverTimestamp(),
      });

      // Add user reaction to reactions collection for tracking
      await addDoc(collection(db, 'postReactions'), {
        postId,
        userId,
        reaction,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw new Error('Failed to add reaction');
    }
  }

  // Remove reaction from post
  static async removeReaction(postId: string, reaction: ReactionType, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        [`reactions.${reaction}`]: increment(-1),
        updatedAt: serverTimestamp(),
      });

      // Remove user reaction from reactions collection
      const reactionsRef = collection(db, 'postReactions');
      const q = query(
        reactionsRef,
        where('postId', '==', postId),
        where('userId', '==', userId),
        where('reaction', '==', reaction)
      );
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw new Error('Failed to remove reaction');
    }
  }

  // Add comment to post
  static async addComment(postId: string, user: User, content: string, parentCommentId?: string): Promise<string> {
    try {
      const comment: Omit<Comment, 'id'> = {
        postId,
        authorId: user.uid,
        authorName: user.name,
        authorProfilePicture: user.profilePicture,
        content,
        parentCommentId,
        reactions: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        isEdited: false,
      };

      const docRef = await addDoc(collection(db, 'comments'), {
        ...comment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Increment comment count on post
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  }

  // Get comments for a post
  static async getComments(postId: string): Promise<Comment[]> {
    try {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Comment[];
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  }

  // Update comment
  static async updateComment(commentId: string, content: string): Promise<void> {
    try {
      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        content,
        updatedAt: serverTimestamp(),
        isEdited: true,
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error('Failed to update comment');
    }
  }

  // Delete comment
  static async deleteComment(commentId: string, postId: string): Promise<void> {
    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);

      // Decrement comment count on post
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(-1),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error('Failed to delete comment');
    }
  }

  // Real-time listener for posts
  static subscribeToPosts(callback: (posts: Post[]) => void) {
    const q = query(
      collection(db, 'posts'),
      where('isActive', '==', true),
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Post[];
      callback(posts);
    });
  }

  // Search posts
  static async searchPosts(query: string): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('isActive', '==', true),
        where('visibility', '==', 'public'),
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
        .filter(post => 
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        ) as Post[];
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }
} 