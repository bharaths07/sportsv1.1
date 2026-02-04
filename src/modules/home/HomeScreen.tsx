import React from 'react';
import { useGlobalState } from '../../app/AppProviders';
import { MatchStrip } from '../../newui/MatchStrip';
import { TopHeadlines } from '../../newui/TopHeadlines';

export const HomeScreen: React.FC = () => {
  useGlobalState(); // keep context available if needed

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', background: '#fff' }}>
      <MatchStrip />
      <TopHeadlines />
    </div>
  );
};
