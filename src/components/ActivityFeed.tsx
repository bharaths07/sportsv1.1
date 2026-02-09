import React from 'react';
import { FeedItem } from '../domain/feed';
import { formatRelativeTime } from '../utils/dateUtils';
import { Activity } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface ActivityFeedProps {
  items: FeedItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <EmptyState 
        icon={<Activity size={48} />} 
        message="No recent activity" 
        description="Updates from matches and tournaments will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-surface rounded-xl p-4 border border-border shadow-sm flex gap-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
              {item.type === 'match_update' ? '🏏' : item.type === 'achievement' ? '🏆' : '📢'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-text-primary truncate pr-2">{item.title}</span>
                <span className="text-xs text-text-muted whitespace-nowrap">{formatRelativeTime(item.publishedAt)}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
