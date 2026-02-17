import { Match } from '../domain/match';

export interface CalculatedProfileStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  formGuide: ('W' | 'L' | 'D')[]; // Last 5 matches
  bestStreak: number;
  totalRuns?: number;
  totalWickets?: number;
  averageScore?: number;
}

export const calculatePlayerStatsFromMatches = (matches: Match[], playerId: string): CalculatedProfileStats => {
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let currentStreak = 0;
  let maxStreak = 0;
  const form: ('W' | 'L' | 'D')[] = [];
  
  // Sort matches by date (descending for form guide)
  const sortedMatches = [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Completed matches only for stats
  const completedMatches = sortedMatches.filter(m => m.status === 'completed' || m.status === 'locked');

  completedMatches.forEach(match => {
    // Determine player's team
    let myTeamId: string | undefined;
    if (match.homeParticipant.players?.some(p => p.playerId === playerId) || match.homeParticipant.id === playerId) {
      myTeamId = match.homeParticipant.id;
    } else if (match.awayParticipant.players?.some(p => p.playerId === playerId) || match.awayParticipant.id === playerId) {
      myTeamId = match.awayParticipant.id;
    }

    if (!myTeamId) return; // Player not part of this match (sanity check)

    let result: 'W' | 'L' | 'D' = 'D';

    if (match.winnerId) {
      if (match.winnerId === myTeamId) {
        wins++;
        result = 'W';
        currentStreak++;
      } else {
        losses++;
        result = 'L';
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 0;
      }
    } else {
      draws++;
      result = 'D';
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 0;
    }

    // Add to form guide (limit to 5)
    if (form.length < 5) {
      form.push(result);
    }
  });
  
  // Final streak check
  maxStreak = Math.max(maxStreak, currentStreak);

  // Calculate Win Rate
  const totalCompleted = wins + losses + draws;
  const winRate = totalCompleted > 0 ? Math.round((wins / totalCompleted) * 100) : 0;

  return {
    matchesPlayed: totalCompleted,
    wins,
    losses,
    draws,
    winRate,
    formGuide: form, // This is newest first [Most Recent, ..., Oldest]
    bestStreak: maxStreak,
    // Future expansion: averageScore from playerStats
  };
};
