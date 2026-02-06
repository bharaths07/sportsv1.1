import React from 'react';
import { Match, MatchParticipant } from '../../../domain/match';

interface MatchCardProps {
  match: Match;
}

const TOURNAMENT_NAMES: Record<string, string> = {
  'hasiruvalli-premier-league': 'HASIRUVALLI PANCHAYATH PREMIER LEAGUE',
  'gully-cricket-championship': 'GULLY CRICKET CHAMPIONSHIP',
  't20-wc-2026': 'T20 WORLD CUP 2026',
  'ipl-2026': 'IPL 2026',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  }).format(date).replace(/ /g, '-');
};

const formatScore = (p: MatchParticipant) => {
  if (p.score === undefined) return '-';
  const wickets = p.wickets !== undefined ? `/${p.wickets}` : '/0';
  const overs = p.overs !== undefined ? `(${p.overs.toFixed(1)} Ov)` : '';
  return `${p.score}${wickets} ${overs}`;
};

const getResultText = (match: Match) => {
  if (match.status !== 'completed' || !match.winnerId) return '';
  
  const winner = match.homeParticipant.id === match.winnerId ? match.homeParticipant : match.awayParticipant;
  
  if (match.id === 'm_prompt_1' || match.id === 'm_prompt_2') {
     const wicketsLeft = 10 - (winner.wickets || 0);
     return `${winner.name} won by ${wicketsLeft} wickets`;
  }
  
  return `${winner.name} won`;
};

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const leagueName = match.tournamentId ? (TOURNAMENT_NAMES[match.tournamentId] || match.tournamentId) : 'Unknown League';
  const dateStr = formatDate(match.date);
  
  const isHomeWinner = match.winnerId === match.homeParticipant.id;
  const isAwayWinner = match.winnerId === match.awayParticipant.id;

  return (
    <div className="mb-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
      {/* 1. Meta Row */}
      <div className="mb-3 text-xs leading-relaxed text-slate-500">
        {match.status === 'completed' && (
          <span className="float-right ml-2 rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Result
          </span>
        )}
        <div className="mb-0.5 font-bold text-slate-700">
          {match.stage}, {leagueName}
        </div>
        <div>
          {dateStr} | {match.homeParticipant.overs || 0} Ov. | {match.location}
        </div>
      </div>

      {/* 2. Teams & Scores */}
      <div className="mb-3">
        {/* Team A */}
        <div className={`mb-2 flex items-center justify-between text-sm ${isHomeWinner ? 'font-bold text-slate-900' : 'text-slate-900'}`}>
          <span className="uppercase">{match.homeParticipant.name}</span>
          <span>{formatScore(match.homeParticipant)}</span>
        </div>
        {/* Team B */}
        <div className={`flex items-center justify-between text-sm ${isAwayWinner ? 'font-bold text-slate-900' : 'text-slate-900'}`}>
          <span className="uppercase">{match.awayParticipant.name}</span>
          <span>{formatScore(match.awayParticipant)}</span>
        </div>
      </div>

      {/* 3. Result Text */}
      <div className="mb-4 border-b border-slate-100 pb-4 text-[13px] text-slate-500">
        {getResultText(match)}
      </div>

      {/* 4. Actions Row */}
      <div className="flex justify-between">
        <button className="flex-1 rounded py-2 text-center text-[13px] font-semibold text-sky-500 transition-colors hover:bg-slate-50">Insights</button>
        <div className="my-1 w-px bg-slate-200"></div>
        <button className="flex-1 rounded py-2 text-center text-[13px] font-semibold text-sky-500 transition-colors hover:bg-slate-50">Table</button>
        <div className="my-1 w-px bg-slate-200"></div>
        <button className="flex-1 rounded py-2 text-center text-[13px] font-semibold text-sky-500 transition-colors hover:bg-slate-50">Leaderboard</button>
      </div>
    </div>
  );
};
