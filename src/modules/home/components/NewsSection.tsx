import React, { useMemo } from 'react';
import { useGlobalState } from '../../../app/AppProviders';
import { Card } from '../../../components/ui/Card';
import { Clock } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { feedItems } = useGlobalState();

  const newsItems = useMemo(() => {
    return feedItems.filter(item => item.type === 'news').sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [feedItems]);

  if (newsItems.length === 0) return null;

  const primaryNews = newsItems[0];
  const secondaryNews = newsItems.slice(1, 4);

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-text-primary mb-6">Top Headlines</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Headline (Large) */}
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg transition-shadow">
          <div 
            className="h-64 lg:h-80 bg-cover bg-center bg-muted group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{ backgroundImage: `url(${primaryNews.media?.[0]?.url || 'https://placehold.co/800x400/e2e8f0/64748b?text=News'})` }} 
          />
          <div className="p-6 bg-surface relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-1 rounded">News</span>
              {primaryNews.relatedEntityId && (
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Related</span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
              {primaryNews.title}
            </h3>
            <p className="text-text-secondary mb-4 line-clamp-2">
              {primaryNews.content}
            </p>
            <div className="flex items-center text-xs text-text-muted font-medium">
              <Clock size={14} className="mr-1.5" />
              {new Date(primaryNews.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </Card>

        {/* Secondary Headlines (List) */}
        <div className="space-y-4">
          {secondaryNews.map(news => (
            <Card key={news.id} className="flex gap-4 p-3 hover:bg-muted cursor-pointer transition-colors group">
              {news.media?.[0]?.url && (
                <div 
                  className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${news.media[0].url})` }}
                />
              )}
              <div className="flex flex-col justify-center">
                <h4 className="font-bold text-text-primary text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title}
                </h4>
                <div className="text-xs text-text-muted font-medium">
                  {new Date(news.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
