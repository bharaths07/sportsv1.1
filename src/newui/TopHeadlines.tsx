import React, { useMemo } from 'react';
import { useGlobalState } from '../app/AppProviders';
import { FeedItem } from '../domain/feed';
import './top-headlines.css';

export const TopHeadlines: React.FC = () => {
  const { feedItems, followedTeams, followedTournaments } = useGlobalState();

  const newsItems = useMemo(() => {
    return feedItems.filter(item => item.type === 'news').sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [feedItems]);

  if (newsItems.length === 0) return null;

  const primaryNews = newsItems[0];
  const secondaryNews = newsItems.slice(1, 4);

  return (
    <section className="nu-headlines-section">
      <h2 className="nu-section-title">Top Headlines</h2>
      
      <div className="nu-headlines-grid">
        {/* Primary Headline (Left) */}
        <div className="nu-headline-primary">
          <div className="nu-primary-image" style={{ backgroundImage: `url(${primaryNews.imageUrl || 'https://placehold.co/600x340/e0e0e0/333333?text=News'})` }} />
          <div className="nu-primary-content">
            <div className="nu-tags">
               <span className="nu-tag">News</span>
               {primaryNews.relatedEntityId && <span className="nu-tag">Related</span>}
            </div>
            <h3 className="nu-primary-title">{primaryNews.title}</h3>
            <p className="nu-primary-summary">{primaryNews.content}</p>
            <div className="nu-time">{primaryNews.publishedAt}</div>
          </div>
        </div>

        {/* Secondary Headlines (Right) */}
        <div className="nu-headline-secondary-list">
          {secondaryNews.map(news => (
            <div key={news.id} className="nu-secondary-item">
              <div className="nu-secondary-content">
                <h4 className="nu-secondary-title">{news.title}</h4>
                <div className="nu-time">{news.publishedAt}</div>
              </div>
              {news.imageUrl && (
                <div className="nu-secondary-image" style={{ backgroundImage: `url(${news.imageUrl})` }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
