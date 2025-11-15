export interface Community {
  id: string;
  name: string;
  description?: string;
  platformId: string;
  thumbnail?: string;
  memberCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  communityId?: string;
  platformId?: string;
  createdAt: any;
  updatedAt?: any;
  likes?: number;
  comments?: number;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  communityId: string;
  replies?: ForumReply[];
  createdAt: any;
  updatedAt?: any;
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
}

