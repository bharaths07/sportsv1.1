export type MatchStatus = 'draft' | 'live' | 'completed' | 'locked' | 'cancelled' | 'scheduled' | 'created';


export interface ScoreEvent {
  id: string;
  timestamp: string; // ISO time
  matchTime?: string; // Game clock time
  scorerId?: string; // Player who scored
  teamId?: string; // Team that scored
  
  // -- Detailed Scoring Fields --
  type: 'delivery' | 'extra' | 'wicket' | 'milestone' | 'period_start' | 'period_end' | 'info' | 'goal' | 'card' | 'substitution' | 'basket' | 'foul'; // Expanded types
  
  // Context
  batterId?: string;      // The striker
  nonStrikerId?: string;  // The partner
  bowlerId?: string;      // The bowler
  
  // Football Context
  cardType?: 'yellow' | 'red';
  assistId?: string;

  // Outcome
  runsScored?: number;    // Runs off the bat (0-6)
  extras?: {
    type: 'wide' | 'no_ball' | 'bye' | 'leg_bye' | 'penalty';
    runs: number;        // Runs from the extra itself
  };
  isWicket?: boolean;
  dismissal?: {
    type: 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket' | 'retired' | 'other';
    fielderId?: string;  // Who took the catch/runout
    batsmanId?: string;   // Who got out
  };
  
  // Metadata
  overNumber?: number;    // 0-indexed
  ballInOver?: number;    // 1-6 (valid balls)
  
  // Legacy/Generic fields
  points: number; // Total runs added to score (bat + extras)
  description: string;
}

export interface MatchLiveState {
  strikerId?: string;
  nonStrikerId?: string;
  bowlerId?: string;
  currentOver: number;
  ballsInCurrentOver: number;
}

export interface MatchOfficial {
  userId: string;
  role: 'referee' | 'umpire' | 'scorer' | 'judge';
}

export interface PlayerStats {
  playerId: string;
  // Cricket
  runs?: number;
  balls?: number; // Balls faced
  wickets?: number; // Wickets taken
  ballsBowled?: number;
  runsConceded?: number;
  catches?: number;
  runouts?: number;
  
  // Football / General
  goals?: number;
  assists?: number;
  minutesPlayed?: number;
  yellowCards?: number;
  redCards?: number;

  // Basketball
  points?: number;
  fouls?: number;
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
    goalkeeperId?: string; // Football
  };
}

export interface Toss {
  winnerTeamId: string;
  decision: 'BAT' | 'BOWL' | 'KICK_OFF' | 'DEFEND_GOAL';
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
  liveState?: MatchLiveState; // Tracks striker, non-striker, bowler, over count
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
