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
      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent Activity</h2>
        </div>
        <div className="p-8">
          <EmptyState 
            icon={<Activity size={48} className="text-slate-300" />} 
            message="No recent activity yet" 
            description="Match updates and tournament changes will appear here once events begin."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent Activity</h2>
      </div>
      <div className="px-8 py-6 space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className={`group flex gap-5 ${index !== items.length - 1 ? 'pb-6 border-b border-slate-50' : ''}`}>
            <div className={`
              h-12 w-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm
              ${item.type === 'match_update' ? 'bg-blue-50 text-blue-600' : 
                item.type === 'achievement' ? 'bg-amber-50 text-amber-600' : 
                'bg-slate-50 text-slate-600'}
            `}>
              {item.type === 'match_update' ? '🏏' : item.type === 'achievement' ? '🏆' : '📢'}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex justify-between items-start mb-1.5">
                <span className="font-bold text-slate-900 truncate pr-2 group-hover:text-blue-600 transition-colors">{item.title}</span>
                <span className="text-xs font-medium text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-full">{formatRelativeTime(item.publishedAt)}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
