import { Match, ScoreEvent } from '../domain/match';

export const scoreEngine = {
  /**
   * Applies a score event to the match state, updating team scores and player stats.
   * Returns a new Match object (immutable update).
   */
  applyEvent(match: Match, event: ScoreEvent): Match {
    const updatedMatch = { ...match }; // Shallow copy
    
    // Ensure liveState exists
    if (!updatedMatch.liveState) {
      updatedMatch.liveState = {
        currentOver: 0,
        ballsInCurrentOver: 0
      };
    }

    // --- Football Logic ---
    if (match.sportId === 's3') {
        const teamId = event.teamId || updatedMatch.homeParticipant.id;
        const isHome = teamId === updatedMatch.homeParticipant.id;
        const team = isHome ? { ...updatedMatch.homeParticipant } : { ...updatedMatch.awayParticipant };
        
        if (!team.players) team.players = [];

        // Update Team Score
        if (event.type === 'goal') {
            team.score = (team.score || 0) + 1;
        }

        // Update Player Stats
        if (event.scorerId) {
            let player = team.players.find(p => p.playerId === event.scorerId);
            if (!player) {
                player = { 
                    playerId: event.scorerId, 
                    runs: 0, balls: 0, wickets: 0, catches: 0, // Legacy defaults
                    goals: 0, assists: 0, yellowCards: 0, redCards: 0 
                };
                team.players.push(player);
            }

            if (event.type === 'goal') {
                player.goals = (player.goals || 0) + 1;
            }
            if (event.type === 'card') {
                if (event.cardType === 'yellow') player.yellowCards = (player.yellowCards || 0) + 1;
                if (event.cardType === 'red') player.redCards = (player.redCards || 0) + 1;
            }
            
            team.players = team.players.map(p => p.playerId === event.scorerId ? player! : p);
        }
        
        // Handle Assists
        if (event.assistId) {
             let assistant = team.players.find(p => p.playerId === event.assistId);
             if (!assistant) {
                assistant = {
                    playerId: event.assistId,
                    runs: 0, balls: 0, wickets: 0, catches: 0,
                    goals: 0, assists: 0, yellowCards: 0, redCards: 0
                };
                team.players.push(assistant);
             }
             assistant.assists = (assistant.assists || 0) + 1;
             team.players = team.players.map(p => p.playerId === event.assistId ? assistant! : p);
        }

        // Commit Changes
        if (isHome) updatedMatch.homeParticipant = team;
        else updatedMatch.awayParticipant = team;
        
        updatedMatch.events = [event, ...(updatedMatch.events || [])];
        return updatedMatch;
    }

    // Determine Batting Team
    const battingTeamId = event.teamId || updatedMatch.currentBattingTeamId || updatedMatch.homeParticipant.id;
    const isHomeBatting = battingTeamId === updatedMatch.homeParticipant.id;
    
    const battingSide = isHomeBatting ? { ...updatedMatch.homeParticipant } : { ...updatedMatch.awayParticipant };
    const bowlingSide = isHomeBatting ? { ...updatedMatch.awayParticipant } : { ...updatedMatch.homeParticipant };

    // Initialize players arrays if missing
    if (!battingSide.players) battingSide.players = [];
    if (!bowlingSide.players) bowlingSide.players = [];

    // --- 1. Update Team Score ---
    battingSide.score = (battingSide.score || 0) + event.points;
    
    // Update Wickets
    if (event.isWicket) {
      battingSide.wickets = (battingSide.wickets || 0) + 1;
    }

    // Update Overs/Balls (Team Level)
    // Only legal deliveries count towards overs
    const isLegalDelivery = event.type === 'delivery' || (event.type === 'wicket' && !event.extras?.type);
    const isWideOrNoBall = event.extras?.type === 'wide' || event.extras?.type === 'no_ball';
    
    if (isLegalDelivery || (event.extras && !isWideOrNoBall)) {
        battingSide.balls = (battingSide.balls || 0) + 1;
        battingSide.overs = Math.floor(battingSide.balls / 6);
    }

    // --- 2. Update Batter Stats ---
    if (event.batterId) {
      let batter = battingSide.players.find(p => p.playerId === event.batterId);
      if (!batter) {
        batter = { playerId: event.batterId, runs: 0, balls: 0, wickets: 0, catches: 0 };
        battingSide.players.push(batter);
      }
      
      // Runs off bat
      if (event.runsScored !== undefined) {
        batter.runs = (batter.runs || 0) + event.runsScored;
      }
      
      // Balls faced (Wides don't count for batter)
      if (!isWideOrNoBall) {
        batter.balls = (batter.balls || 0) + 1;
      }
      
      // Update array reference
      battingSide.players = battingSide.players.map(p => p.playerId === event.batterId ? batter! : p);
    }

    // --- 3. Update Bowler Stats ---
    if (event.bowlerId) {
      let bowler = bowlingSide.players.find(p => p.playerId === event.bowlerId);
      if (!bowler) {
        bowler = { playerId: event.bowlerId, runs: 0, balls: 0, wickets: 0, catches: 0, ballsBowled: 0, runsConceded: 0 };
        bowlingSide.players.push(bowler);
      }

      // Runs conceded (Batter runs + Wides + No Balls)
      // Byes/Leg Byes do NOT count against bowler
      const runsToCharge = (event.runsScored || 0) + (isWideOrNoBall ? (event.extras?.runs || 0) : 0);
      bowler.runsConceded = (bowler.runsConceded || 0) + runsToCharge;

      // Balls bowled (Legal only)
      if (!isWideOrNoBall) {
        bowler.ballsBowled = (bowler.ballsBowled || 0) + 1;
      }

      // Wickets (Run outs don't count for bowler)
      if (event.isWicket && event.dismissal?.type !== 'run_out') {
        bowler.wickets = (bowler.wickets || 0) + 1;
      }

      bowlingSide.players = bowlingSide.players.map(p => p.playerId === event.bowlerId ? bowler! : p);
    }

    // --- 4. Update Fielder Stats (Catch/Run Out) ---
    if (event.dismissal?.fielderId) {
      let fielder = bowlingSide.players.find(p => p.playerId === event.dismissal?.fielderId);
      if (!fielder) {
        fielder = { playerId: event.dismissal.fielderId, runs: 0, balls: 0, wickets: 0, catches: 0 };
        bowlingSide.players.push(fielder);
      }
      
      if (event.dismissal.type === 'caught') {
        fielder.catches = (fielder.catches || 0) + 1;
      }
      if (event.dismissal.type === 'run_out') {
         fielder.runouts = (fielder.runouts || 0) + 1;
      }
      
      bowlingSide.players = bowlingSide.players.map(p => p.playerId === event.dismissal?.fielderId ? fielder! : p);
    }

    // --- 5. Update Live State (Strike Rotation) ---
    const liveState = { ...updatedMatch.liveState };
    
    // Set active players if provided in event
    if (event.batterId) liveState.strikerId = event.batterId;
    if (event.nonStrikerId) liveState.nonStrikerId = event.nonStrikerId;
    if (event.bowlerId) liveState.bowlerId = event.bowlerId;

    // Rotate strike on odd runs
    const runsForRotation = (event.runsScored || 0); // Only run runs cause rotation (plus overthrows? Assuming simple for now)
    // Note: If it's a boundary (4/6), no rotation usually. 
    // If they physically ran 1 or 3, rotate.
    // If it's a wide + 1 run, they crossed? Detailed logic needed.
    // Simplified: If runsScored is odd, rotate.
    if (runsForRotation % 2 !== 0) {
      const temp = liveState.strikerId;
      liveState.strikerId = liveState.nonStrikerId;
      liveState.nonStrikerId = temp;
    }
    
    // Update Over Count
    if (!isWideOrNoBall) {
        liveState.ballsInCurrentOver += 1;
        if (liveState.ballsInCurrentOver >= 6) {
             liveState.currentOver += 1;
             liveState.ballsInCurrentOver = 0;
             // End of over: Rotate strike
             const temp = liveState.strikerId;
             liveState.strikerId = liveState.nonStrikerId;
             liveState.nonStrikerId = temp;
             
             // Clear bowler (must pick new one)
             liveState.bowlerId = undefined;
        }
    }
    
    updatedMatch.liveState = liveState;

    // --- 6. Commit Changes ---
    if (isHomeBatting) {
      updatedMatch.homeParticipant = battingSide;
      updatedMatch.awayParticipant = bowlingSide;
    } else {
      updatedMatch.awayParticipant = battingSide;
      updatedMatch.homeParticipant = bowlingSide;
    }
    
    updatedMatch.events = [event, ...updatedMatch.events];

    return updatedMatch;
  }
};
