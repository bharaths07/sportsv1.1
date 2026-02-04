import React from 'react';
import { Link } from 'react-router-dom';

// Simple match interface for display
export interface FeaturedMatch {
  id: string;
  team1: { name: string; code: string; flag: string; score?: string; overs?: string };
  team2: { name: string; code: string; flag: string; score?: string; overs?: string };
  status: string; // e.g., "Toss Delayed", "NAM Won", "Feb 4, 3:00 PM"
  resultNote?: string; // e.g., "6th T20 WC Warm up 2026"
}

interface FeaturedMatchesProps {
  matches: FeaturedMatch[];
  onViewAllClick?: () => void;
  onMatchClick?: (matchId: string) => void;
}

export const FeaturedMatches: React.FC<FeaturedMatchesProps> = ({ matches, onViewAllClick, onMatchClick }) => {
  const displayMatches = matches.slice(0, 3);
  
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Featured Matches</h2>
        <div 
          onClick={onViewAllClick}
          style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
        >
          All Matches {'>'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayMatches.map(match => (
          <div key={match.id} style={{ 
            backgroundColor: 'white', borderRadius: '12px', padding: '16px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', transition: 'box-shadow 0.2s'
          }}
          onClick={() => onMatchClick?.(match.id)}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
          >
            {/* Team 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '30%' }}>
              <img src={match.team1.flag} alt={match.team1.code} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{match.team1.code}</div>
                {match.team1.score && (
                  <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>
                    {match.team1.score} <span style={{ color: '#64748b', fontSize: '12px' }}>{match.team1.overs}</span>
                  </div>
                )}
                {!match.team1.score && <div style={{ fontSize: '12px', color: '#94a3b8' }}>Yet to bat</div>}
              </div>
            </div>

            {/* Status / Info Center */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: match.status.includes('Won') ? '#ef4444' : '#f59e0b', marginBottom: '4px' }}>
                {match.status}
              </div>
              {match.resultNote && (
                <div style={{ fontSize: '12px', color: '#64748b' }}>{match.resultNote}</div>
              )}
            </div>

            {/* Team 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '30%', flexDirection: 'row-reverse', textAlign: 'right' }}>
              <img src={match.team2.flag} alt={match.team2.code} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{match.team2.code}</div>
                {match.team2.score && (
                  <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>
                    {match.team2.score} <span style={{ color: '#64748b', fontSize: '12px' }}>{match.team2.overs}</span>
                  </div>
                )}
                {!match.team2.score && <div style={{ fontSize: '12px', color: '#94a3b8' }}>Yet to bat</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
