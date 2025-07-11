export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  lastDoc?: any;
  totalCount?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  retry?: () => void;
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  matchScore: number;
  sharedInterests: string[];
  sharedGoals: string[];
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  mediaUrl?: string;
  createdAt: Date;
  isRead: boolean;
  isEdited: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'match' | 'group' | 'post' | 'message' | 'system';
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export interface SearchResult {
  users: User[];
  groups: Group[];
  posts: Post[];
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: Theme;
  language: string;
  notifications: boolean;
  autoPlay: boolean;
  dataUsage: 'low' | 'medium' | 'high';
} 