export interface PlayerStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  scoreAccumulated: number; // Generic score
  // Sport specific stats could be extended or stored in a flexible map
  customStats?: Record<string, number | string>;
}

export interface PlayerHistoryEntry {
  matchId: string;
  date: string;
  result: 'win' | 'loss' | 'draw';
  performanceSummary?: string;
}

export interface Player {
  id: string;
  userId?: string; // Link to auth user
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  institutionId?: string;
  primarySportId?: string;
  role?: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper';
  battingStyle?: string; // e.g., "Right-hand bat"
  bowlingStyle?: string; // e.g., "Right-arm fast"
  jerseyNumber?: number;
  stats: PlayerStats;
  history: PlayerHistoryEntry[];
  active: boolean;
}
