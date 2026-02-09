import React from 'react';
import { Match } from '../../../domain/match';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../app/AppProviders';
import { Card } from '../../../components/ui/Card';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface Props {
  match: Match;
  isFollowed?: boolean;
  className?: string;
  showTournamentContext?: boolean;
}

export const MatchCard: React.FC<Props> = ({ match, isFollowed, className = '', showTournamentContext = true }) => {
  const navigate = useNavigate();
  const { toggleFollowMatch, tournaments } = useGlobalState();

  const isLive = match.status === 'live';
  const isFinished = match.status === 'completed' || match.status === 'locked' || match.status === 'cancelled';
  const isUpcoming = match.status === 'draft' || match.status === 'scheduled' || match.status === 'created';

  const date = new Date(match.date);
  const timeText = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateText = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

  // Resolve Tournament Name
  const tournament = tournaments.find(t => t.id === match.tournamentId);
  const tournamentName = tournament ? tournament.name : "Friendly Match";
  const isFootball = match.sportId === 's3';

  const formatScore = (p: any) => {
    if (p.score === undefined) return '-';
    if (isFootball) return `${p.score}`;
    return p.wickets !== undefined ? `${p.score}/${p.wickets}` : `${p.score}/0`;
  };

  const formatOvers = (p: any) => {
    if (isFootball) return null;
    return p.overs !== undefined ? `${p.overs} ov` : '0.0 ov';
  };

  return (
    <Card 
      onClick={() => navigate(`/match/${match.id}`)}
      hoverable
      className={`relative overflow-hidden flex flex-col ${className}`}
    >
      {/* Header: Status & Tournament */}
      <div className="flex justify-between items-start mb-4">
        <div>
          {showTournamentContext && (
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              {tournamentName} {match.stage && <span className="text-text-secondary">• {match.stage}</span>}
            </div>
          )}
          {isLive && (
            <span className="badge badge-live animate-pulse flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              LIVE
            </span>
          )}
          {isFinished && (
            <span className="badge badge-finished">
              FINISHED
            </span>
          )}
          {isUpcoming && (
            <span className="badge badge-upcoming">
              UPCOMING
            </span>
          )}
        </div>
        
        {/* Follow Button (Optional) */}
        {/* <button onClick={(e) => { e.stopPropagation(); toggleFollowMatch(match.id); }}>...</button> */}
      </div>

      {/* Teams & Scores */}
      <div className="flex-1 space-y-3">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-text-secondary border border-border">
              {match.homeParticipant.name.charAt(0)}
            </div>
            <span className={`font-semibold ${match.winnerId === match.homeParticipant.id ? 'text-text-primary' : 'text-text-secondary'}`}>
              {match.homeParticipant.name}
            </span>
          </div>
          <div className="text-right">
            <div className="font-bold text-text-primary">
              {formatScore(match.homeParticipant)}
            </div>
            {!isFootball && (
              <div className="text-xs text-text-muted">
                {formatOvers(match.homeParticipant)}
              </div>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-text-secondary border border-border">
              {match.awayParticipant.name.charAt(0)}
            </div>
            <span className={`font-semibold ${match.winnerId === match.awayParticipant.id ? 'text-text-primary' : 'text-text-secondary'}`}>
              {match.awayParticipant.name}
            </span>
          </div>
          <div className="text-right">
            <div className="font-bold text-text-primary">
              {formatScore(match.awayParticipant)}
            </div>
            {!isFootball && (
              <div className="text-xs text-text-muted">
                {formatOvers(match.awayParticipant)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Result / Context */}
      <div className="mt-4 pt-3 border-t border-border text-xs text-text-muted flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Calendar size={14} className="text-text-muted" />
          <span>{dateText}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-text-muted" />
          <span>{timeText}</span>
        </div>
        {match.location && (
          <div className="flex items-center gap-1 ml-auto">
            <MapPin size={14} className="text-text-muted" />
            <span className="truncate max-w-[100px]">{match.location}</span>
          </div>
        )}
      </div>
      
      {isFinished && match.winnerId && (
        <div className="mt-2 text-xs font-medium text-blue-600">
          {match.winnerId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name} won
        </div>
      )}
    </Card>
  );
};
