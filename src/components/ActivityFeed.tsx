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
        icon={<Activity size={48} className="text-slate-300" />} 
        message="No recent activity yet" 
        description="Match updates and tournament changes will appear here once events begin."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors flex gap-4">
            <div className={`
              h-10 w-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
              ${item.type === 'match_update' ? 'bg-blue-50 text-blue-600' : 
                item.type === 'achievement' ? 'bg-amber-50 text-amber-600' : 
                'bg-slate-50 text-slate-600'}
            `}>
              {item.type === 'match_update' ? '🏏' : item.type === 'achievement' ? '🏆' : '📢'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-slate-900 truncate pr-2">{item.title}</span>
                <span className="text-xs text-slate-500 whitespace-nowrap">{formatRelativeTime(item.publishedAt)}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
