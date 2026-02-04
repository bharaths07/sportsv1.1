export type FeedType = 'news' | 'match_update' | 'achievement' | 'announcement';

export interface FeedItem {
  id: string;
  type: FeedType;
  title: string;
  content: string;
  authorId?: string; // User ID or System
  relatedEntityId?: string; // MatchID, PlayerID, etc.
  imageUrl?: string;
  publishedAt: string;
  visibility: 'public' | 'institution' | 'private';
  institutionId?: string; // If specific to an institution
}
