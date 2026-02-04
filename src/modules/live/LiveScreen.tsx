import React from 'react';
import { useGlobalState } from '../../app/AppProviders';
import { MatchListCard } from '../../components/MatchListCard';

export const LiveScreen: React.FC = () => {
  const { matches } = useGlobalState();
  const liveMatches = matches.filter(m => m.status === 'live');

  return (
    <div style={{ padding: '24px 20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <section>
        {liveMatches.length > 0 ? (
          <MatchListCard title="Live Matches" matches={liveMatches} />
        ) : (
          <div style={{ 
            padding: '32px', 
            textAlign: 'center', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '16px',
            border: '1px dashed #e0e0e0',
            color: '#888'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📡</div>
            <div style={{ fontWeight: '500' }}>No live matches at the moment</div>
          </div>
        )}
      </section>
    </div>
  );
}
