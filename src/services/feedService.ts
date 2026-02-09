import { supabase } from '../lib/supabase';
import { FeedItem } from '../domain/feed';

export const feedService = {
  async createFeedItem(item: FeedItem): Promise<FeedItem> {
    const dbItem = {
      type: item.type,
      title: item.title,
      content: item.content,
      published_at: item.publishedAt,
      related_entity_id: item.relatedEntityId,
      visibility: item.visibility,
      metadata: item.metadata
    };

    const { data, error } = await supabase
      .from('feed_items')
      .insert(dbItem)
      .select()
      .single();

    if (error) {
      console.error('Error creating feed item:', error);
      throw error;
    }

    return mapToDomain(data);
  },

  async getAllFeedItems(): Promise<FeedItem[]> {
    const { data, error } = await supabase
      .from('feed_items')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50); // Limit for performance

    if (error) {
      console.error('Error fetching feed items:', error);
      return [];
    }

    return data.map(mapToDomain);
  }
};

function mapToDomain(db: any): FeedItem {
  return {
    id: db.id,
    type: db.type,
    title: db.title,
    content: db.content,
    publishedAt: db.published_at,
    relatedEntityId: db.related_entity_id,
    visibility: db.visibility,
    metadata: db.metadata
  };
}
