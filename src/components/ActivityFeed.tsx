import React from 'react';
import { FeedItem } from '../domain/feed';
import { formatRelativeTime } from '../utils/dateUtils';

interface ActivityFeedProps {
  items: FeedItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => {
  if (items.length === 0) {
    return <div className="activity-empty">No recent activity</div>;
  }

  return (
    <div className="activity-feed">
      <h3 className="feed-title">Activity & Updates</h3>
      <div className="feed-list">
        {items.map(item => (
          <div key={item.id} className="feed-item">
            <div className="feed-icon">
              {item.type === 'match_update' ? '🏏' : item.type === 'achievement' ? '🏆' : '📢'}
            </div>
            <div className="feed-content">
              <div className="feed-header">
                <span className="feed-item-title">{item.title}</span>
                <span className="feed-time">{formatRelativeTime(item.publishedAt)}</span>
              </div>
              <p className="feed-text">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
