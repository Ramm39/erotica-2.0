export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  language: string;
  role: 'user' | 'author' | 'moderator' | 'admin';
  createdAt: string;
  isVerified?: boolean;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  language: string;
  authorId: string;
  author: User;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  stats: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  readTime: number;
  createdAt: string;
  updatedAt: string;
  progress?: {
    position: number;
    percentage: number;
  };
}

export interface Confession {
  id: string;
  content: string;
  tags: string[];
  reactions: {
    relatable: number;
    hot: number;
    wild: number;
    supportive: number;
  };
  userReaction?: 'relatable' | 'hot' | 'wild' | 'supportive';
  createdAt: string;
  authorId?: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  avatar?: string;
  memberCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  moderators: User[];
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  community: Community;
  authorId: string;
  author: User;
  content: string;
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
  };
  reactions: {
    like: number;
    love: number;
    laugh: number;
  };
  comments: number;
  isPinned: boolean;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessageRequest {
  id: string;
  fromUserId: string;
  fromUser: User;
  preview: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  storyId?: string;
  confessionId?: string;
  postId?: string;
  authorId: string;
  author: User;
  content: string;
  likes: number;
  replies?: Comment[];
  createdAt: string;
}

export interface ReadingProgress {
  storyId: string;
  position: number;
  percentage: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'message' | 'follow' | 'story_approved' | 'story_rejected';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  count: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

