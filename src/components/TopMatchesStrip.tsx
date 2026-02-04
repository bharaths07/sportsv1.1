import React, { useMemo, useState } from 'react';
import { useGlobalState } from '../app/AppProviders';
import { MatchStripCard } from './MatchStripCard';
import { Link } from 'react-router-dom';

export const TopMatchesStrip: React.FC = () => {
  const { matches } = useGlobalState();
  const [tab, setTab] = useState<'top' | 'live'>('top');

  const liveMatches = useMemo(() => matches.filter(m => m.status === 'live'), [matches]);
  const topMatches = useMemo(() => matches.filter(m => m.status === 'draft'), [matches]);

  const data = tab === 'top' ? topMatches : liveMatches;

  return (
    <section style={{ marginBottom: 24 }}>
      {/* Header with Tabs (Left) + Schedule Link (Right) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={() => setTab('top')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontWeight: tab === 'top' ? 800 : 600,
              color: tab === 'top' ? '#111' : '#666'
            }}
          >
            Top Matches
          </button>
          <button
            onClick={() => setTab('live')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontWeight: tab === 'live' ? 800 : 600,
              color: tab === 'live' ? '#111' : '#666'
            }}
          >
            Live ({liveMatches.length})
          </button>
        </div>
        <div>
          <Link to="/matches" style={{ fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}>
            Cricket Schedule →
          </Link>
        </div>
      </div>

      {/* Horizontal row of equal cards with overflow scroll */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 4
        }}
      >
        {data.map(m => (
          <MatchStripCard key={m.id} match={m} />
        ))}
      </div>
    </section>
  );
};
