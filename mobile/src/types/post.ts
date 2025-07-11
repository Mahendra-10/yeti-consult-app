export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorProfilePicture?: string;
  content: string;
  images?: string[];
  links?: PostLink[];
  reactions: PostReactions;
  commentCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isEdited: boolean;
  tags: string[];
  location?: string;
  visibility: 'public' | 'friends' | 'private';
}

export interface PostLink {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface PostReactions {
  [key: string]: number; // reactionType: count
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorProfilePicture?: string;
  content: string;
  parentCommentId?: string; // For nested replies
  reactions: PostReactions;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

export interface PostFormData {
  content: string;
  images?: string[];
  links?: PostLink[];
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  location?: string;
}

export type ReactionType = '❤️' | '👍' | '😊' | '🎉' | '🤔' | '😢'; 