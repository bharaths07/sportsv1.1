import React from 'react';
import { Match } from '../../domain/match';
import { CricketScorecard } from './components/CricketScorecard';
import { FootballScorecard } from './components/FootballScorecard';

interface Props {
  match: Match;
}

export const MatchScorecardTab: React.FC<Props> = ({ match }) => {
  if (match.sportId === 's3') {
    return <FootballScorecard match={match} />;
  }
  return <CricketScorecard match={match} />;
};
