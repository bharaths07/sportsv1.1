import React from 'react';
import { Match, MatchParticipant } from '../domain/match';
import { useNavigate } from 'react-router-dom';

interface MatchStripCardProps {
  match: Match;
}

export const MatchStripCard: React.FC<MatchStripCardProps> = ({ match }) => {
  const navigate = useNavigate();

  const formatScore = (p: MatchParticipant) => {
    const runs = p.score || 0;
    const wickets = p.wickets || 0;
    const balls = p.balls || 0;
    const overs = Math.floor(balls / 6);
    const ballInOver = balls % 6;
    return `${runs}/${wickets} (${overs}.${ballInOver})`;
  };

  const getStateBlock = () => {
    if (match.status === 'live') {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
          <span>{formatScore(match.homeParticipant)}</span>
          <span>{formatScore(match.awayParticipant)}</span>
        </div>
      );
    }
    if (match.status === 'completed' || match.status === 'locked') {
      let resultText = 'Result unavailable';
      if (match.winnerId) {
        const winnerName =
          match.winnerId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name;
        resultText = `${winnerName} won`;
      } else if (match.homeParticipant.result && match.awayParticipant.result) {
        if (match.homeParticipant.result === 'draw' || match.awayParticipant.result === 'draw') {
          resultText = 'Match drawn';
        } else {
          const winnerName =
            match.homeParticipant.result === 'win' ? match.homeParticipant.name : match.awayParticipant.name;
          resultText = `${winnerName} won`;
        }
      }
      return <div style={{ color: '#444', fontWeight: 600 }}>{resultText}</div>;
    }
    // Upcoming / Draft
    const time = new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' });
    return <div style={{ color: '#666', fontWeight: 600 }}>{day} · {time}</div>;
  };

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      style={{
        width: 260,
        minWidth: 260,
        border: '1px solid #eee',
        borderRadius: 12,
        padding: 14,
        backgroundColor: '#fff',
        cursor: 'pointer'
      }}
    >
      {/* Tournament / Series (fallback to location) */}
      <div style={{ fontSize: 11, color: '#666', fontWeight: 700, marginBottom: 8 }}>
        {match.location || 'Fixture'}
      </div>

      {/* Teams */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, color: '#111' }}>{match.homeParticipant.name}</span>
        <span style={{ color: '#999', fontSize: 12 }}>vs</span>
        <span style={{ fontWeight: 700, color: '#111' }}>{match.awayParticipant.name}</span>
      </div>

      {/* Single state block */}
      {getStateBlock()}
    </div>
  );
};
