import React, { useMemo } from 'react';
import { useGlobalState } from '../app/AppProviders';
import './top-headlines.css';

interface NewsItem {
  id: string;
  title: string;
  summary?: string; // Only for primary
  time: string;
  tags?: string[]; // Only for primary
  imageUrl?: string;
  isPrimary: boolean;
  relatedEntityIds?: string[]; // IDs of teams/tournaments this news relates to
}

// Mock IDs mapping to tags:
// "INDIA" -> "t1" (mock team id)
// "T20 WC" -> "t20-wc-2026" (mock tournament id)
// "IPL" -> "ipl-2026"

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "India Announces Squad for T20 World Cup 2026: Young Stars Included",
    summary: "The BCCI has revealed the 15-member squad for the upcoming T20 World Cup, with several surprise inclusions and key senior players rested.",
    time: "2h ago",
    tags: ["T20 WC", "INDIA"],
    imageUrl: "https://placehold.co/600x340/e0e0e0/333333?text=T20+WC",
    isPrimary: true,
    relatedEntityIds: ['t1', 't20-wc-2026'] // Mock IDs
  },
  {
    id: '2',
    title: "IPL 2026 Auction: Dates and Venue Confirmed by Governing Council",
    time: "4h ago",
    imageUrl: "https://placehold.co/100x100/e0e0e0/333333?text=IPL",
    isPrimary: false,
    relatedEntityIds: ['ipl-2026']
  },
  {
    id: '3',
    title: "Starc Ruled Out of Fourth Ashes Test Due to Heel Injury",
    time: "5h ago",
    imageUrl: "https://placehold.co/100x100/e0e0e0/333333?text=Starc",
    isPrimary: false,
    relatedEntityIds: ['t-aus'] // Mock
  },
  {
    id: '4',
    title: "Women's Premier League 2026 Schedule Announced",
    time: "6h ago",
    imageUrl: "https://placehold.co/100x100/e0e0e0/333333?text=WPL",
    isPrimary: false,
    relatedEntityIds: ['wpl-2026']
  }
];

export const TopHeadlines: React.FC = () => {
  const { followedTeams, followedTournaments } = useGlobalState();

  // Actually, let's just sort the secondary list. Primary is editorial choice usually.
  // Unless we want to fully dynamic the Primary slot.
  // Let's stick to reordering secondary list for now to be safe.
  
  const primaryNews = MOCK_NEWS.find(n => n.isPrimary);
  const secondaryNewsRaw = MOCK_NEWS.filter(n => !n.isPrimary);
  
  const secondaryNews = useMemo(() => {
    return [...secondaryNewsRaw].sort((a, b) => {
       const isAFollowed = a.relatedEntityIds?.some(id => followedTeams.includes(id) || followedTournaments.includes(id));
       const isBFollowed = b.relatedEntityIds?.some(id => followedTeams.includes(id) || followedTournaments.includes(id));
       if (isAFollowed && !isBFollowed) return -1;
       if (!isAFollowed && isBFollowed) return 1;
       return 0;
    }).slice(0, 3);
  }, [secondaryNewsRaw, followedTeams, followedTournaments]);

  if (!primaryNews) return null;

  return (
    <section className="nu-headlines-section">
      <h2 className="nu-section-title">Top Headlines</h2>
      
      <div className="nu-headlines-grid">
        {/* Primary Headline (Left) */}
        <div className="nu-headline-primary">
          <div className="nu-primary-image" style={{ backgroundImage: `url(${primaryNews.imageUrl})` }} />
          <div className="nu-primary-content">
            <div className="nu-tags">
              {primaryNews.tags?.map(tag => (
                <span key={tag} className="nu-tag">{tag}</span>
              ))}
            </div>
            <h3 className="nu-primary-title">{primaryNews.title}</h3>
            <p className="nu-primary-summary">{primaryNews.summary}</p>
            <div className="nu-time">{primaryNews.time}</div>
          </div>
        </div>

        {/* Secondary Headlines (Right) */}
        <div className="nu-headline-secondary-list">
          {secondaryNews.map(news => (
            <div key={news.id} className="nu-secondary-item">
              <div className="nu-secondary-content">
                <h4 className="nu-secondary-title">{news.title}</h4>
                <div className="nu-time">{news.time}</div>
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
