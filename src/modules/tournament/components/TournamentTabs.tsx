import React from 'react';

interface TournamentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TournamentTabs: React.FC<TournamentTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = ['Overview', 'Matches', 'Squads', 'Points Table', 'Leaderboard'];

  return (
    <div style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '32px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '16px 0',
              color: activeTab === tab ? '#ffffff' : '#94a3b8',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
              transition: 'all 0.2s',
              position: 'relative',
              top: '1px' // Push border down to overlap container border
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
