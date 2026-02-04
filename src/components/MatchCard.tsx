import React from 'react';
import { Match, MatchParticipant } from '../domain/match';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const navigate = useNavigate();

  // Helper to format score for a participant
  const getScore = (participant: MatchParticipant) => {
    // If match is draft (upcoming), usually no score, but we handle just in case
    if (match.status === 'draft' && !participant.score) return '';
    
    const runs = participant.score || 0;
    const wickets = participant.wickets || 0;
    const balls = participant.balls || 0;
    const overs = Math.floor(balls / 6);
    const ballInOver = balls % 6;
    
    return `${runs}/${wickets} (${overs}.${ballInOver})`;
  };

  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed' || match.status === 'locked';
  const isUpcoming = match.status === 'draft';

  // Determine status text/color
  let statusText = '';
  let statusColor = '#666';

  if (isLive) {
    statusText = 'LIVE';
    statusColor = '#d32f2f'; // Red
  } else if (isCompleted) {
    statusText = 'FINAL';
    statusColor = '#333';
  } else if (isUpcoming) {
    // Show time for upcoming
    statusText = new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    statusColor = '#666';
  }

  return (
    <div 
      className="match-card" 
      onClick={() => navigate(isLive ? `/live/${match.id}` : `/matches/${match.id}`)}
      style={{
        padding: '16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
    >
      {/* A. Match Context (Small, Top) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: '11px', 
        color: '#666', 
        marginBottom: '8px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        <span>{match.location || 'Unknown Location'}</span>
        {/* Optional: Add Tournament Name if available in future */}
      </div>

      {/* B. Teams (Main Focus) & C. Score (Integrated for side-by-side comparison) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Home Team */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, fontSize: '15px', color: '#111' }}>
            {match.homeParticipant.name}
          </span>
          {(isLive || isCompleted) && (
            <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#333', marginTop: '2px' }}>
              {getScore(match.homeParticipant)}
            </span>
          )}
        </div>

        {/* VS or Divider */}
        <div style={{ 
          padding: '0 12px', 
          fontSize: '12px', 
          color: '#999', 
          fontWeight: 500 
        }}>
          {isUpcoming ? 'vs' : ''}
        </div>

        {/* Away Team (Right Aligned) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
          <span style={{ fontWeight: 600, fontSize: '15px', color: '#111' }}>
            {match.awayParticipant.name}
          </span>
          {(isLive || isCompleted) && (
            <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#333', marginTop: '2px' }}>
              {getScore(match.awayParticipant)}
            </span>
          )}
        </div>
      </div>

      {/* C. Status & D. Action Hint (Bottom Row) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '10px' 
      }}>
        {/* Status */}
        <div style={{ 
          fontSize: '12px', 
          fontWeight: isLive ? 700 : 500, 
          color: statusColor,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isLive && (
            <span style={{ 
              display: 'inline-block', 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: '#d32f2f',
              marginBottom: '1px'
            }}></span>
          )}
          {statusText}
          {/* Add result text for completed matches if available */}
          {isCompleted && match.homeParticipant.result && (
            <span style={{ fontWeight: 400, color: '#666', marginLeft: '4px' }}>
               • {match.homeParticipant.result === 'win' ? match.homeParticipant.name : match.awayParticipant.name} won
            </span>
          )}
        </div>

        {/* D. Action Hint */}
        <div style={{ color: '#ccc', fontSize: '18px', lineHeight: 1 }}>
          ›
        </div>
      </div>
    </div>
  );
};
