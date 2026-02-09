export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role?: 'user' | 'admin';
  avatarUrl?: string;
  
  // Legacy / Extended fields (kept for compatibility with existing UI)
  firstName?: string;
  lastName?: string;
  location?: string;
  bio?: string;
  memberSince?: string;
  followersCount?: number;
  followingCount?: number;
  profileViews?: number;
  type?: 'user' | 'organizer' | 'admin';
  plan?: 'free' | 'premium' | 'enterprise';
}
