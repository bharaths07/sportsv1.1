import React, { useMemo, useState } from 'react';
import { useGlobalState } from '../app/AppProviders';
import { Link } from 'react-router-dom';
import { MatchCard } from './MatchCard';
import './match-strip.css';

export const MatchStrip: React.FC = () => {
  const { matches, followedTeams, followedMatches } = useGlobalState();
  const [tab, setTab] = useState<'top' | 'live'>('top');

  const getMatchScore = (match: any) => {
    let score = 0;
    // Check if teams are followed
    if (followedTeams.includes(match.homeParticipant.id) || followedTeams.includes(match.awayParticipant.id)) {
      score += 2;
    }
    // Check if tournament is followed (assuming we had a tournamentId on match, for now we don't really have it in Match interface explicitly as tournamentId, but let's pretend or use sportId/location as proxy or strict to what we have)
    // Actually, in the real app, Match would have tournamentId. Our mock doesn't really.
    // However, we implemented followedTournaments.
    // Let's assume matches might have a `tournamentId` field we can check or we skip for now if data is missing.
    // Looking at Match interface: `sportId` is there. No `tournamentId`.
    // But `TournamentScreen` mocked filtering by `matches.slice(0, 4)`.
    // Let's stick to Team following prioritization for now which is robust.
    return score;
  };

  const sortMatches = (matchList: any[]) => {
    return [...matchList].sort((a, b) => {
      const scoreA = getMatchScore(a);
      const scoreB = getMatchScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA; // Higher score first
      // Then by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  const liveMatches = useMemo(() => sortMatches(matches.filter(m => m.status === 'live')), [matches, followedTeams]);
  const topMatches = useMemo(() => sortMatches(matches.filter(m => m.status === 'draft')), [matches, followedTeams]);

  const data = tab === 'top' ? topMatches : liveMatches;

  return (
    <section className="nu-strip">
      <div className="nu-strip-header">
        <div className="nu-tabs">
          <button className={`nu-tab ${tab === 'top' ? 'active' : ''}`} onClick={() => setTab('top')}>
            Top Matches
          </button>
          <button className={`nu-tab ${tab === 'live' ? 'active' : ''}`} onClick={() => setTab('live')}>
            Live ({liveMatches.length})
          </button>
        </div>
        <Link to="/matches" className="nu-schedule">Cricket Schedule &gt;</Link>
      </div>

      <div className="nu-cards-row">
        {data.map(m => {
           const isTeamFollowed = followedTeams.includes(m.homeParticipant.id) || followedTeams.includes(m.awayParticipant.id);
           const isMatchFollowed = followedMatches.includes(m.id);
           const isFollowed = isMatchFollowed || isTeamFollowed;
           return <MatchCard key={m.id} match={m} isFollowed={isFollowed} />;
        })}
      </div>
    </section>
  );
};
