export type MatchStatus = 'draft' | 'live' | 'completed' | 'locked' | 'cancelled' | 'scheduled' | 'created';


export interface ScoreEvent {
  id: string;
  timestamp: string; // ISO time
  matchTime?: string; // Game clock time
  scorerId?: string; // Player who scored
  teamId?: string; // Team that scored
  points: number;
  description: string;
  type: string; // e.g., 'goal', 'run', 'boundary', 'foul'
}

export interface MatchOfficial {
  userId: string;
  role: 'referee' | 'umpire' | 'scorer' | 'judge';
}

export interface PlayerStats {
  playerId: string;
  runs: number;
  balls: number; // Balls faced
  wickets: number; // Wickets taken
  ballsBowled?: number;
  runsConceded?: number;
  catches?: number;
  runouts?: number;
}

export interface MatchParticipant {
  id: string; // Team ID or Player ID
  name: string;
  score: number; // Current score
  wickets?: number; // Added for Cricket
  balls?: number;   // Added for Cricket
  overs?: number;   // Added for Cricket
  result?: 'win' | 'loss' | 'draw';
  players?: PlayerStats[]; // Added for detailed stats tracking
  squad?: {
    playerIds: string[];
    captainId?: string;
    wicketKeeperId?: string;
  };
}

export interface Toss {
  winnerTeamId: string;
  decision: 'BAT' | 'BOWL';
}

export interface Match {
  id: string;
  sportId: string;
  tournamentId?: string; // Link to Tournament
  stage?: string; // e.g., "Group Stage", "Final"
  homeParticipant: MatchParticipant;
  awayParticipant: MatchParticipant;
  currentBattingTeamId?: string; // Tracks who is currently batting
  toss?: Toss;
  date: string; // Scheduled start time
  actualStartTime?: string;
  actualEndTime?: string;
  location: string;
  status: MatchStatus;
  events: ScoreEvent[];
  officials: MatchOfficial[];
  winnerId?: string;
  createdByUserId: string;
}
