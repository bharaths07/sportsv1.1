import React, { useMemo, useState } from 'react';
import { Match, ScoreEvent } from '../../domain/match';
import { useGlobalState } from '../../app/AppProviders';

interface Props {
  match: Match;
}

interface CommentaryBall {
  id: string;
  over: number;
  ball: number;
  displayOver: string; // "13.2"
  type: string; // 'run', 'wicket', 'extra', 'boundary'
  runs: number;
  isWicket: boolean;
  isBoundary: boolean;
  isExtra: boolean;
  text: string;
  bowler: string;
  batter: string;
}

interface OverGroup {
  overNumber: number;
  runs: number;
  wickets: number;
  scoreAtEnd: string; // "58/9"
  balls: CommentaryBall[];
  bowler: string; // Primary bowler for the over
  batterStats: { name: string; score: string }[]; // Snapshot of batters
}

export const MatchCommentaryTab: React.FC<Props> = ({ match }) => {
  const { players } = useGlobalState();
  
  // State for Filters
  const initialInnings = match.currentBattingTeamId === match.awayParticipant.id ? 'away' : 'home';
  const [activeInnings, setActiveInnings] = useState<'home' | 'away'>(initialInnings);
  const [filterType, setFilterType] = useState<'all' | 'wickets' | 'boundaries'>('all');

  const battingTeam = activeInnings === 'home' ? match.homeParticipant : match.awayParticipant;
  const bowlingTeam = activeInnings === 'home' ? match.awayParticipant : match.homeParticipant;

  // --- Process Events into Commentary Structure ---
  const commentaryGroups = useMemo(() => {
    // 1. Filter events for current innings
    const events = (match.events || [])
      .filter(e => e.teamId === battingTeam.id)
      // Sort reverse chronological for display (newest first)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 2. Enrich and Group
    const groups: Record<number, OverGroup> = {};
    let currentScore = battingTeam.score || 0; // Ideally we calculate backwards from total? 
                                               // Or forward from 0? Forward is easier for cumulative.
                                               // But we want to display reverse. 
                                               // Strategy: Calculate forward first to tag scores, then reverse for display.
    
    // Let's re-sort chronological to calculate running score
    const chronologicalEvents = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    let runningScore = 0;
    let runningWickets = 0;
    const enrichedBalls: CommentaryBall[] = [];

    chronologicalEvents.forEach((e, index) => {
        // Parse Over/Ball from description if available (e.g. "13.2 Bowler to Batter")
        // Or assume sequential if missing.
        const overMatch = e.description.match(/(\d+)\.(\d+)/);
        let over = 0;
        let ball = 0;
        
        if (overMatch) {
            over = parseInt(overMatch[1]);
            ball = parseInt(overMatch[2]);
        } else {
            // Fallback logic if description doesn't have over number
            // (Just for robustness)
            over = Math.floor(index / 6);
            ball = (index % 6) + 1;
        }

        const isWicket = e.type === 'wicket';
        const isBoundary = e.points === 4 || e.points === 6;
        const isExtra = e.type === 'extra';
        
        if (isWicket) runningWickets++;
        runningScore += e.points;

        enrichedBalls.push({
            id: e.id,
            over,
            ball,
            displayOver: `${over}.${ball}`,
            type: e.type,
            runs: e.points,
            isWicket,
            isBoundary,
            isExtra,
            text: e.description,
            bowler: 'Bowler Name', // In real app, extract from description or event
            batter: 'Batter Name', // In real app, extract from description or event
        });
    });

    // 3. Group by Over (Reverse Order for display)
    // We iterate the enriched balls and bucket them.
    enrichedBalls.forEach(b => {
        if (!groups[b.over]) {
            groups[b.over] = {
                overNumber: b.over,
                runs: 0,
                wickets: 0,
                scoreAtEnd: '', // Will fill later
                balls: [],
                bowler: '', // TODO: Extract
                batterStats: []
            };
        }
        groups[b.over].balls.push(b);
        groups[b.over].runs += b.runs;
        if (b.isWicket) groups[b.over].wickets++;
    });

    // 4. Finalize Groups (Sort balls descending within over, set end scores)
    // Actually we need the cumulative score at the END of the over.
    // We can calculate this by running through groups in order.
    let cumulativeScore = 0;
    let cumulativeWickets = 0;
    const sortedOverNumbers = Object.keys(groups).map(Number).sort((a, b) => a - b);

    sortedOverNumbers.forEach(overNum => {
        cumulativeScore += groups[overNum].runs;
        cumulativeWickets += groups[overNum].wickets;
        groups[overNum].scoreAtEnd = `${cumulativeScore}/${cumulativeWickets}`;
        // Reverse balls for display (13.6 -> 13.1)
        groups[overNum].balls.sort((a, b) => b.ball - a.ball);
    });

    // Return as array sorted by Over descending (19, 18, 17...)
    return sortedOverNumbers.reverse().map(num => groups[num]);

  }, [match.events, activeInnings, battingTeam]);

  // Apply Filter (Full / Wickets / Boundaries)
  const filteredGroups = useMemo(() => {
    if (filterType === 'all') return commentaryGroups;
    
    return commentaryGroups.map(group => {
        const filteredBalls = group.balls.filter(b => {
            if (filterType === 'wickets') return b.isWicket;
            if (filterType === 'boundaries') return b.isBoundary;
            return false;
        });
        
        if (filteredBalls.length === 0) return null;
        
        return {
            ...group,
            balls: filteredBalls
        };
    }).filter(g => g !== null) as OverGroup[];

  }, [commentaryGroups, filterType]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Header: Innings & Filter Switcher */}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px'
      }}>
          {/* Innings Selector */}
          <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                  onClick={() => setActiveInnings('home')}
                  style={{
                      fontWeight: activeInnings === 'home' ? 700 : 500,
                      color: activeInnings === 'home' ? '#0f172a' : '#64748b',
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: '14px'
                  }}
              >
                  {match.homeParticipant.name}
              </button>
              <div style={{ width: 1, height: 16, backgroundColor: '#cbd5e1' }} />
              <button 
                  onClick={() => setActiveInnings('away')}
                  style={{
                      fontWeight: activeInnings === 'away' ? 700 : 500,
                      color: activeInnings === 'away' ? '#0f172a' : '#64748b',
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: '14px'
                  }}
              >
                  {match.awayParticipant.name}
              </button>
          </div>

          {/* Type Filter */}
          <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#475569',
                  outline: 'none'
              }}
          >
              <option value="all">Full Commentary</option>
              <option value="wickets">Wickets</option>
              <option value="boundaries">Boundaries</option>
          </select>
      </div>

      {/* 2. Commentary List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredGroups.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No commentary available for this innings yet.
              </div>
          ) : (
              filteredGroups.map(group => (
                  <div key={group.overNumber} style={{ display: 'flex', flexDirection: 'column' }}>
                      
                      {/* Balls */}
                      {group.balls.map(ball => (
                          <div key={ball.id} style={{ 
                              display: 'flex', 
                              gap: '16px', 
                              padding: '16px 0', 
                              borderBottom: '1px solid #f1f5f9' 
                          }}>
                              {/* Left: Ball Badge */}
                              <div style={{ width: '48px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{ball.displayOver}</div>
                                  <div style={{ 
                                      width: '32px', 
                                      height: '32px', 
                                      borderRadius: '50%', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      fontSize: '13px',
                                      fontWeight: 700,
                                      backgroundColor: ball.isWicket ? '#fee2e2' : ball.isBoundary ? '#dcfce7' : '#f1f5f9',
                                      color: ball.isWicket ? '#dc2626' : ball.isBoundary ? '#16a34a' : '#64748b',
                                      border: `1px solid ${ball.isWicket ? '#fecaca' : ball.isBoundary ? '#bbf7d0' : '#e2e8f0'}`
                                  }}>
                                      {ball.isWicket ? 'W' : ball.isExtra ? (ball.text.includes('Wide') ? 'wd' : 'nb') : ball.runs}
                                  </div>
                              </div>

                              {/* Right: Content */}
                              <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', marginBottom: '4px' }}>
                                      {ball.text}
                                  </div>
                                  {ball.isWicket && (
                                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>
                                          Dismissal details here (e.g. b Bowler)
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}

                      {/* Over Summary (Only show if viewing Full and it's the end of an over block) */}
                      {filterType === 'all' && (
                          <div style={{ 
                              margin: '12px 0 24px 0', 
                              backgroundColor: '#f8fafc', 
                              borderRadius: '8px', 
                              border: '1px solid #e2e8f0',
                              padding: '12px 16px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                          }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ 
                                        backgroundColor: '#cbd5e1', 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        fontSize: '11px', 
                                        fontWeight: 700, 
                                        color: '#334155',
                                        textTransform: 'uppercase'
                                    }}>
                                        Over {group.overNumber + 1}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[...group.balls].reverse().map((b, i) => (
                                            <span key={i} style={{ 
                                                fontSize: '13px', 
                                                fontWeight: 600, 
                                                color: b.isWicket ? '#dc2626' : b.isBoundary ? '#16a34a' : '#64748b' 
                                            }}>
                                                {b.isWicket ? 'W' : b.runs}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                                    {group.runs} Runs • {group.wickets} Wkts
                                </div>
                              </div>
                              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                                  {group.scoreAtEnd}
                              </div>
                          </div>
                      )}
                  </div>
              ))
          )}
      </div>
    </div>
  );
};
