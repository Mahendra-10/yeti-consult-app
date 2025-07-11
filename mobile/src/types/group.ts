export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  creatorId: string;
  creatorName: string;
  criteria: GroupCriteria;
  memberIds: string[];
  memberCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  rules?: string[];
  category: GroupCategory;
  location?: string;
}

export interface GroupCriteria {
  destinationCountry?: string;
  destinationState?: string;
  destinationCity?: string;
  university?: string;
  studyField?: string;
  interests?: string[];
  ageRange?: {
    min: number;
    max: number;
  };
}

export type GroupCategory = 
  | 'location'
  | 'university'
  | 'study-field'
  | 'interests'
  | 'general'
  | 'academic'
  | 'social';

export interface GroupMember {
  userId: string;
  userName: string;
  userProfilePicture?: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  isActive: boolean;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorProfilePicture?: string;
  content: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isEdited: boolean;
}

export interface GroupFormData {
  name: string;
  description: string;
  coverImage?: string;
  criteria: GroupCriteria;
  isPublic: boolean;
  tags: string[];
  rules?: string[];
  category: GroupCategory;
  location?: string;
} 