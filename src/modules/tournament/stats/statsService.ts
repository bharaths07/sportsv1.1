import { Match } from '../../../../domain/match';
import { Team } from '../../../../domain/team';
import { Player } from '../../../../domain/player';
import { TournamentPlayerStats, LeaderboardCategory } from './types';

// Helper to get initials
const getTeamCode = (name: string) => {
  if (!name) return 'UNK';
  return name.substring(0, 3).toUpperCase();
};

export const calculateTournamentStats = (
  matches: Match[],
  teams: Team[],
  players: Player[]
): TournamentPlayerStats[] => {
  const statsMap = new Map<string, TournamentPlayerStats>();

  // Helper to initialize or get player stats
  const getStats = (playerId: string, teamId: string): TournamentPlayerStats => {
    if (!statsMap.has(playerId)) {
      const player = players.find(p => p.id === playerId);
      const team = teams.find(t => t.id === teamId);
      
      statsMap.set(playerId, {
        id: playerId,
        name: player ? `${player.firstName} ${player.lastName}` : 'Unknown Player',
        teamId: teamId,
        teamName: team?.name || 'Unknown Team',
        teamCode: team?.shortName || getTeamCode(team?.name || ''),
        avatar: player?.profilePictureUrl,
        matches: 0,
        innings: 0,
        runs: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        notOuts: 0,
        highestScore: 0,
        wickets: 0,
        overs: 0,
        ballsBowled: 0,
        runsConceded: 0,
        maidens: 0, // Not tracked in basic stats yet
        bestBowlingWickets: 0,
        bestBowlingRuns: 0,
        catches: 0,
        runOuts: 0,
        stumpings: 0,
        battingAvg: 0,
        battingSr: 0,
        bowlingAvg: 0,
        economy: 0,
        mvpPoints: 0
      });
    }
    return statsMap.get(playerId)!;
  };

  matches.forEach(match => {
    if (match.status !== 'completed') return;

    // We process both sides
    const participants = [match.homeParticipant, match.awayParticipant];

    participants.forEach(participant => {
      if (!participant.players) return;

      participant.players.forEach(pStats => {
        const stats = getStats(pStats.playerId, participant.id);
        stats.matches += 1;

        // Batting
        if (pStats.runs > 0 || pStats.balls > 0) {
          stats.innings += 1;
          stats.runs += pStats.runs;
          stats.ballsFaced += pStats.balls;
          stats.highestScore = Math.max(stats.highestScore, pStats.runs);
          
          // Check for Not Out
          // We need to check events to confirm dismissal
          const isOut = match.events.some(e => 
            e.type === 'wicket' && e.scorerId === pStats.playerId
          );
          if (!isOut) {
            stats.notOuts += 1;
          }

          // Check for boundaries
          // Assuming 'run' type events with points 4 or 6 and scorerId = playerId
          const fours = match.events.filter(e => 
            e.type === 'run' && e.points === 4 && e.scorerId === pStats.playerId
          ).length;
          const sixes = match.events.filter(e => 
            e.type === 'run' && e.points === 6 && e.scorerId === pStats.playerId
          ).length;

          stats.fours += fours;
          stats.sixes += sixes;
        }

        // Bowling
        if (pStats.ballsBowled && pStats.ballsBowled > 0) {
            stats.ballsBowled += pStats.ballsBowled;
            stats.wickets += pStats.wickets;
            stats.runsConceded += (pStats.runsConceded || 0);
            stats.overs = Math.floor(stats.ballsBowled / 6) + (stats.ballsBowled % 6) / 10; // Approx display
            
            // Best Bowling Logic
            if (pStats.wickets > stats.bestBowlingWickets) {
                stats.bestBowlingWickets = pStats.wickets;
                stats.bestBowlingRuns = pStats.runsConceded || 0;
            } else if (pStats.wickets === stats.bestBowlingWickets) {
                // If wickets same, check simpler runs
                if ((pStats.runsConceded || 0) < stats.bestBowlingRuns) {
                    stats.bestBowlingRuns = pStats.runsConceded || 0;
                }
            }
        }

        // Fielding
        stats.catches += (pStats.catches || 0);
        stats.runOuts += (pStats.runouts || 0);
        // Stumpings not yet in PlayerStats interface, assume 0 or check events
        // stats.stumpings += ...
      });
    });
  });

  // Calculate Derived Stats
  return Array.from(statsMap.values()).map(s => {
    // Batting Avg
    const dismissals = s.innings - s.notOuts;
    s.battingAvg = dismissals > 0 ? s.runs / dismissals : s.runs; // If never out, avg = runs (classic cricket convention varies, usually undefined, but for sorting we use runs)

    // Strike Rate
    s.battingSr = s.ballsFaced > 0 ? (s.runs / s.ballsFaced) * 100 : 0;

    // Bowling Avg
    s.bowlingAvg = s.wickets > 0 ? s.runsConceded / s.wickets : 0;

    // Economy
    const trueOvers = s.ballsBowled / 6;
    s.economy = trueOvers > 0 ? s.runsConceded / trueOvers : 0;

    // MVP Points (Core Memory Rule)
    // Formula (Runs*1 + Wkts*25 + FieldActions*10)
    const fieldActions = s.catches + s.runOuts + s.stumpings;
    s.mvpPoints = (s.runs * 1) + (s.wickets * 25) + (fieldActions * 10);

    return s;
  });
};

export const sortLeaderboard = (
  data: TournamentPlayerStats[], 
  category: LeaderboardCategory
): TournamentPlayerStats[] => {
  const sorted = [...data];
  
  switch (category) {
    case 'BAT':
      return sorted.sort((a, b) => {
        if (b.runs !== a.runs) return b.runs - a.runs;
        if (b.battingAvg !== a.battingAvg) return b.battingAvg - a.battingAvg;
        return b.battingSr - a.battingSr;
      });
    case 'BOWL':
      return sorted.sort((a, b) => {
        if (b.wickets !== a.wickets) return b.wickets - a.wickets;
        if (a.bowlingAvg !== b.bowlingAvg) return a.bowlingAvg - b.bowlingAvg; // Lower better
        return a.economy - b.economy; // Lower better
      });
    case 'FIELD':
      return sorted.sort((a, b) => {
        const ptsA = a.catches + a.runOuts + a.stumpings;
        const ptsB = b.catches + b.runOuts + b.stumpings;
        if (ptsB !== ptsA) return ptsB - ptsA;
        return b.catches - a.catches;
      });
    case 'MVP':
      return sorted.sort((a, b) => b.mvpPoints - a.mvpPoints);
    default:
      return sorted;
  }
};
