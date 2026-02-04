import { Match, MatchParticipant, PlayerStats } from '../domain/match';

export interface ImpactScore {
  playerId: string;
  score: number;
  breakdown: {
    batting: number;
    bowling: number;
    fielding: number;
  };
  details: {
    runs: number;
    balls: number;
    wickets: number;
    wicketsTaken: number;
    overs: number;
    catches: number;
    runouts: number;
  };
}

export const calculateImpactScore = (
  playerStats: PlayerStats, 
  role: 'batter' | 'bowler' | 'all-rounder' = 'all-rounder'
): number => {
  let score = 0;
  let battingScore = 0;
  let bowlingScore = 0;
  let fieldingScore = 0;

  // --- Batting Impact ---
  if (playerStats.runs > 0) {
      battingScore += playerStats.runs * 1.0;
      
      const sr = playerStats.balls > 0 ? (playerStats.runs / playerStats.balls) * 100 : 0;
      if (playerStats.runs > 10) {
          if (sr > 150) battingScore += 10;
          else if (sr > 120) battingScore += 5;
          else if (sr < 80) battingScore -= 2;
      }
      
      // Milestones
      if (playerStats.runs >= 50) battingScore += 10;
      if (playerStats.runs >= 100) battingScore += 20;
  }

  // --- Bowling Impact ---
  if (playerStats.wickets > 0) {
      bowlingScore += playerStats.wickets * 25; // Increased weight for wickets as per MVP formula memory (25)
      if (playerStats.wickets >= 3) bowlingScore += 10;
      if (playerStats.wickets >= 5) bowlingScore += 20;
  }
  
  // Economy Rate Bonus
  // Need ballsBowled and runsConceded
  if ((playerStats.ballsBowled || 0) >= 12) { // Minimum 2 overs
      const overs = (playerStats.ballsBowled || 0) / 6;
      const eco = (playerStats.runsConceded || 0) / overs;
      
      if (eco < 6) bowlingScore += 10;
      else if (eco < 8) bowlingScore += 5;
      else if (eco > 12) bowlingScore -= 5;
  }

  // --- Fielding Impact ---
  const catches = playerStats.catches || 0;
  const runouts = playerStats.runouts || 0;
  
  fieldingScore += catches * 10;
  fieldingScore += runouts * 15;

  score = Math.floor(battingScore + bowlingScore + fieldingScore);
  return score;
};

export const getMatchImpactRankings = (match: Match): ImpactScore[] => {
    const allPlayers: ImpactScore[] = [];

    const processTeam = (team: MatchParticipant) => {
        team.players?.forEach(p => {
            const impact = calculateImpactScore(p);
            
            // Recalculate breakdown for UI
            // (Duplicated logic for breakdown, ideally refactor calculateImpactScore to return object)
            // For now, we just approximate or re-run parts if needed, 
            // but to be clean, let's just use the values we have.
            // We'll trust the total score is correct.
            
            allPlayers.push({
                playerId: p.playerId,
                score: impact,
                breakdown: { 
                    batting: p.runs, // simplified breakdown for UI
                    bowling: p.wickets * 25, 
                    fielding: (p.catches || 0) * 10 + (p.runouts || 0) * 15 
                },
                details: {
                    runs: p.runs,
                    balls: p.balls,
                    wickets: p.wickets,
                    wicketsTaken: p.wickets,
                    overs: Math.floor((p.ballsBowled || 0) / 6),
                    catches: p.catches || 0,
                    runouts: p.runouts || 0
                }
            });
        });
    };

    processTeam(match.homeParticipant);
    processTeam(match.awayParticipant);

    return allPlayers.sort((a, b) => b.score - a.score);
};
