import React from 'react';
import { Match } from '../domain/match';
import { MatchCard } from './MatchCard';

interface MatchListCardProps {
  title: string;
  matches: Match[];
}

export const MatchListCard: React.FC<MatchListCardProps> = ({ title, matches }) => {
  if (matches.length === 0) return null;

  return (
    <div className="match-list-card" style={{ marginBottom: '24px' }}>
      <h3 className="list-card-title" style={{ 
        fontSize: '18px', 
        fontWeight: 700, 
        marginBottom: '16px', 
        color: '#111',
        paddingLeft: '4px' 
      }}>
        {title}
      </h3>
      <div className="list-card-content" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0px', // MatchCard has borderBottom
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #eee',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
};
