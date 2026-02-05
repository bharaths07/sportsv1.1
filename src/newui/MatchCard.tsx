import React from 'react';
import { Match } from '../domain/match';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../app/AppProviders';

interface Props {
  match: Match;
  isFollowed?: boolean;
  className?: string;
  showTournamentContext?: boolean;
}

const getRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export const MatchCard: React.FC<Props> = ({ match, isFollowed, className = '', showTournamentContext = true }) => {
  const navigate = useNavigate();
  const { toggleFollowMatch, tournaments } = useGlobalState();

  const isLive = match.status === 'live';
  const isFinished = match.status === 'completed' || match.status === 'locked';
  const isUpcoming = match.status === 'draft';

  const timeText = new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const relativeDay = getRelativeDate(match.date);

  // Status Badge Logic
  let statusBadge = null;
  
  if (isLive) {
    statusBadge = (
      <span className="nu-status-badge nu-status-live">
        <span className="nu-live-dot">●</span> LIVE
      </span>
    );
  } else if (isFinished) {
    statusBadge = (
      <span className="nu-status-badge nu-status-finished">
        FINISHED
      </span>
    );
  } else if (isUpcoming) {
    statusBadge = (
      <span className="nu-status-badge nu-status-upcoming">
        UPCOMING
      </span>
    );
  }

  // Result / Time Logic
  let contextInfo = null;

  if (isLive) {
    // For MVP, simple text. In real app: "CRR: 8.5"
    contextInfo = (
      <span className="nu-context-info">
        <span style={{ color: '#d32f2f', fontWeight: 700 }}>CRR: 6.2</span> • Overs 12.4
      </span>
    );
  } else if (isFinished) {
    const winnerName =
      match.winnerId
        ? (match.winnerId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name)
        : (match.homeParticipant.result === 'win' ? match.homeParticipant.name : match.awayParticipant.name);
    
    contextInfo = (
      <span className="nu-context-info nu-result-text">
        {winnerName ? `${winnerName} won` : 'Match Completed'}
      </span>
    );
  } else if (isUpcoming) {
    contextInfo = (
      <span className="nu-context-info">
        Starts {relativeDay}, {timeText}
      </span>
    );
  }

  // Resolve Tournament Name
  const tournament = tournaments.find(t => t.id === match.tournamentId);
  const tournamentName = tournament ? tournament.name : "Friendly Match";
  const displayTournament = showTournamentContext
    ? (match.stage ? `${tournamentName} • ${match.stage}` : tournamentName)
    : '';

  // Helper for logo placeholder
  const renderLogo = (name: string) => (
    <div className="nu-logo">{name.charAt(0).toUpperCase()}</div>
  );

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowMatch(match.id);
  };

  return (
    <div
      className={`nu-card ${className}`}
      onClick={() => navigate(`/match/${match.id}`)}
    >
      {/* 1. Header: Status (Left) | Tournament (Secondary) | Follow (Right) */}
      <div className="nu-card-top-row">
        <div className="nu-status-group">
           {statusBadge}
           <span className="nu-tournament-text">{displayTournament}</span>
        </div>
        
        <button 
            onClick={handleFollowClick}
            className="nu-follow-btn"
            title={isFollowed ? "Unfollow match" : "Follow match"}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill={isFollowed ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ color: isFollowed ? '#f59e0b' : '#ccc' }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
      </div>

      {/* 3. Teams Block */}
      <div className="nu-teams-block">
        {/* Home Team */}
        <div className="nu-team-row">
           <div className="nu-team-info">
             {renderLogo(match.homeParticipant.name)}
             <div className="nu-name">{match.homeParticipant.name}</div>
           </div>
           {(isLive || isFinished) && (
             <div className="nu-team-score">
               {match.homeParticipant.score || 0}-{match.homeParticipant.wickets || 0}
               <span className="nu-overs"> (20)</span>
             </div>
           )}
        </div>

        {/* Away Team */}
        <div className="nu-team-row">
           <div className="nu-team-info">
             {renderLogo(match.awayParticipant.name)}
             <div className="nu-name">{match.awayParticipant.name}</div>
           </div>
           {(isLive || isFinished) && (
             <div className="nu-team-score">
               {match.awayParticipant.score || 0}-{match.awayParticipant.wickets || 0}
               <span className="nu-overs"> (18.4)</span>
             </div>
           )}
        </div>
      </div>

      {/* 4. Score/Time Context + 5. Metadata */}
      <div className="nu-card-bottom-row">
         {contextInfo}
         <div className="nu-venue-text">{match.location}</div>
      </div>
    </div>
  );
};
