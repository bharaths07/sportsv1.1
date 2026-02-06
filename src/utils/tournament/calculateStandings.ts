import { Match } from '../../domain/match';
import { Team } from '../../domain/team';
import { TeamStanding } from '../../types/tournament';

export function calculateStandings(
  teams: Team[],
  matches: Match[]
): TeamStanding[] {
  const table: Record<string, TeamStanding> = {};

  // Initialize table for all teams
  teams.forEach(team => {
    table[team.id] = {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      points: 0,
    };
  });

  // Process completed matches
  matches
    .filter(m => m.status === 'completed' || m.status === 'locked')
    .forEach(match => {
      const homeId = match.homeParticipant.id;
      const awayId = match.awayParticipant.id;

      // Ensure teams exist in the table (defensive check)
      const teamA = table[homeId];
      const teamB = table[awayId];

      if (!teamA || !teamB) return;

      teamA.played++;
      teamB.played++;

      // Check winner
      if (match.winnerId === homeId) {
        teamA.won++;
        teamA.points += 2;
        teamB.lost++;
      } else if (match.winnerId === awayId) {
        teamB.won++;
        teamB.points += 2;
        teamA.lost++;
      } else {
        // Tie or Draw (if winnerId is missing but status is completed)
        teamA.tied++;
        teamB.tied++;
        teamA.points += 1;
        teamB.points += 1;
      }
    });

  // Return sorted array
  return Object.values(table).sort((a, b) => {
    // 1. Points (Descending)
    if (b.points !== a.points) return b.points - a.points;
    
    // 2. Wins (Descending)
    if (b.won !== a.won) return b.won - a.won;
    
    // 3. Alphabetical (Ascending)
    return a.teamName.localeCompare(b.teamName);
  });
}
