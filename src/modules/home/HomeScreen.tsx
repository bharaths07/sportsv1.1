import React from 'react';
import { useGlobalState } from '../../app/AppProviders';
import { MatchStrip } from '../../newui/MatchStrip';
import { TopHeadlines } from '../../newui/TopHeadlines';
import { ActivityFeed } from '../../components/ActivityFeed';

export const HomeScreen: React.FC = () => {
  const { feedItems } = useGlobalState();

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', background: '#fff' }}>
      <MatchStrip />
      <TopHeadlines />
      <div style={{ padding: '0 20px 40px' }}>
        <ActivityFeed items={feedItems} />
      </div>
    </div>
  );
};
