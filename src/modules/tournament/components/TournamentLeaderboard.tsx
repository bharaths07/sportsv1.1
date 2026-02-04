import React, { useState, useMemo } from 'react';

type LeaderboardCategory = 'BAT' | 'BOWL' | 'FIELD' | 'MVP';

interface PlayerStats {
  id: string;
  name: string;
  team: string;
  teamCode: string; // e.g., 'IND'
  avatar: string;
  matches: number;
  innings: number; // Added innings explicitly
  // Batting
  runs: number;
  ballsFaced: number;
  notOuts: number;
  // Bowling
  wickets: number;
  overs: number;
  runsConceded: number;
  // Fielding
  catches: number;
  runOuts: number;
  stumpings: number;
}

// Extended Mock Data to test tie-breakers and logic
const MOCK_PLAYERS: PlayerStats[] = [
  // Top contender
  { id: 'p1', name: 'N Jagadeesan', team: 'India A', teamCode: 'IND', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=NJ', matches: 5, innings: 5, runs: 320, ballsFaced: 210, notOuts: 1, wickets: 0, overs: 0, runsConceded: 0, catches: 2, runOuts: 0, stumpings: 0 },
  // Close second (fewer runs)
  { id: 'p5', name: 'Heinrich Klaasen', team: 'South Africa', teamCode: 'RSA', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=HK', matches: 5, innings: 5, runs: 310, ballsFaced: 150, notOuts: 1, wickets: 0, overs: 0, runsConceded: 0, catches: 4, runOuts: 0, stumpings: 2 },
  // Tie-breaker scenario: Same runs as someone else, check Avg
  { id: 'p3', name: 'A Badoni', team: 'India A', teamCode: 'IND', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=AB', matches: 5, innings: 5, runs: 245, ballsFaced: 160, notOuts: 2, wickets: 2, overs: 8, runsConceded: 60, catches: 3, runOuts: 1, stumpings: 0 },
  { id: 'p7', name: 'Glenn Maxwell', team: 'Australia', teamCode: 'AUS', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=GM', matches: 5, innings: 5, runs: 245, ballsFaced: 130, notOuts: 0, wickets: 4, overs: 10, runsConceded: 85, catches: 5, runOuts: 2, stumpings: 0 },
  
  // Others
  { id: 'p2', name: 'R Ngarava', team: 'Zimbabwe', teamCode: 'ZIM', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=RN', matches: 4, innings: 2, runs: 12, ballsFaced: 10, notOuts: 0, wickets: 12, overs: 16, runsConceded: 110, catches: 1, runOuts: 0, stumpings: 0 },
  { id: 'p4', name: 'Rashid Khan', team: 'Afghanistan', teamCode: 'AFG', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=RK', matches: 3, innings: 1, runs: 45, ballsFaced: 20, notOuts: 0, wickets: 9, overs: 12, runsConceded: 80, catches: 1, runOuts: 0, stumpings: 0 },
  { id: 'p6', name: 'Trent Boult', team: 'New Zealand', teamCode: 'NZ', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=TB', matches: 4, innings: 1, runs: 5, ballsFaced: 8, notOuts: 1, wickets: 10, overs: 16, runsConceded: 96, catches: 0, runOuts: 0, stumpings: 0 },
  
  // Bowling Tie-Breaker Scenarios
  // Same wickets (10), but better average (lower runs conceded)
  { id: 'p12', name: 'Jasprit Bumrah', team: 'India A', teamCode: 'IND', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=JB', matches: 4, innings: 0, runs: 0, ballsFaced: 0, notOuts: 0, wickets: 10, overs: 16, runsConceded: 80, catches: 1, runOuts: 0, stumpings: 0 },
  
  // Same wickets (10), Same Avg (80 runs), but better Economy (more overs bowled for same runs - implies lower econ? No. 
  // Wait. Avg = Runs/Wickets. Eco = Runs/Overs.
  // Scenario: W=10, Runs=80. Avg = 8.
  // Player A: 16 overs. Eco = 80/16 = 5.0.
  // Player B: 15 overs. Eco = 80/15 = 5.33.
  // Player A wins on Economy.
  { id: 'p13', name: 'Pat Cummins', team: 'Australia', teamCode: 'AUS', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=PC', matches: 4, innings: 2, runs: 30, ballsFaced: 20, notOuts: 1, wickets: 10, overs: 15, runsConceded: 80, catches: 2, runOuts: 0, stumpings: 0 },

  // Fielding Tie-Breaker Scenarios
  // Player F1: 10 pts (5 catches, 5 RO)
  { id: 'f1', name: 'Ravindra Jadeja', team: 'India A', teamCode: 'IND', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=RJ', matches: 5, innings: 3, runs: 120, ballsFaced: 80, notOuts: 1, wickets: 8, overs: 20, runsConceded: 100, catches: 5, runOuts: 5, stumpings: 0 },
  // Player F2: 10 pts (4 catches, 6 RO) -> Lost to F1 on Catches
  { id: 'f2', name: 'Suresh Raina', team: 'India A', teamCode: 'IND', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=SR', matches: 5, innings: 4, runs: 150, ballsFaced: 100, notOuts: 0, wickets: 2, overs: 5, runsConceded: 40, catches: 4, runOuts: 6, stumpings: 0 },
  // Player F3: 10 pts (5 catches, 4 RO, 1 St) -> Tie Catches (5), Lost to F1 on RO (4 vs 5)
  { id: 'f3', name: 'MS Dhoni', team: 'India A', teamCode: 'IND', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=MSD', matches: 5, innings: 4, runs: 200, ballsFaced: 140, notOuts: 2, wickets: 0, overs: 0, runsConceded: 0, catches: 5, runOuts: 4, stumpings: 1 },

  { id: 'p8', name: 'Virat Kohli', team: 'India A', teamCode: 'IND', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=VK', matches: 5, innings: 5, runs: 210, ballsFaced: 150, notOuts: 0, wickets: 0, overs: 0, runsConceded: 0, catches: 2, runOuts: 0, stumpings: 0 },
  { id: 'p9', name: 'Steve Smith', team: 'Australia', teamCode: 'AUS', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=SS', matches: 5, innings: 5, runs: 190, ballsFaced: 160, notOuts: 1, wickets: 0, overs: 0, runsConceded: 0, catches: 4, runOuts: 0, stumpings: 0 },
  { id: 'p10', name: 'Kane Williamson', team: 'New Zealand', teamCode: 'NZ', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=KW', matches: 5, innings: 5, runs: 280, ballsFaced: 220, notOuts: 1, wickets: 0, overs: 0, runsConceded: 0, catches: 1, runOuts: 0, stumpings: 0 },
  { id: 'p11', name: 'Babar Azam', team: 'Pakistan', teamCode: 'PAK', avatar: 'https://placehold.co/100x100/e2e8f0/64748b?text=BA', matches: 5, innings: 5, runs: 260, ballsFaced: 200, notOuts: 0, wickets: 0, overs: 0, runsConceded: 0, catches: 0, runOuts: 0, stumpings: 0 },
];

const calculateBattingStats = (p: PlayerStats) => {
  const avg = p.innings - p.notOuts > 0 ? p.runs / (p.innings - p.notOuts) : p.runs; // Standard Cricket Avg: Runs / (Innings - NotOuts)
  const sr = p.ballsFaced > 0 ? (p.runs / p.ballsFaced) * 100 : 0;
  return { ...p, avg, sr };
};

const calculateBowlingStats = (p: PlayerStats) => {
  const eco = p.overs > 0 ? p.runsConceded / p.overs : 0;
  const avg = p.wickets > 0 ? p.runsConceded / p.wickets : 0;
  return { ...p, eco, bowlingAvg: avg };
};

const calculateFieldingStats = (p: PlayerStats) => {
  const points = (p.catches * 1) + (p.runOuts * 1) + (p.stumpings * 1);
  return { ...p, fieldingPoints: points };
};

export const TournamentLeaderboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('BAT');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [minInnings, setMinInnings] = useState<number>(1);
  const [minOvers, setMinOvers] = useState<number>(1);
  
  // Edge Case Props (Mocked for now)
  const isTournamentEnded = false; 
  const matchesPlayed = 15; // If 0, show empty state

  const processedData = useMemo(() => {
    return MOCK_PLAYERS.map(p => ({
      ...p,
      ...calculateBattingStats(p),
      ...calculateBowlingStats(p),
      ...calculateFieldingStats(p),
      mvpPoints: (p.runs * 1) + (p.wickets * 25) + (p.catches * 10) + (p.runOuts * 10) + (p.stumpings * 10)
    }));
  }, []);

  const uniqueTeams = useMemo(() => ['All', ...Array.from(new Set(MOCK_PLAYERS.map(p => p.team)))], []);

  const leaderboardData = useMemo(() => {
    let data = [...processedData];

    // Apply Filters
    if (teamFilter !== 'All') {
      data = data.filter(p => p.team === teamFilter);
    }
    if (activeCategory === 'BAT') {
      data = data.filter(p => p.innings >= minInnings);
    }
    if (activeCategory === 'BOWL') {
      data = data.filter(p => p.overs >= minOvers);
    }

    // Sorting Logic
    switch (activeCategory) {
      case 'BAT':
        return data.sort((a, b) => {
          // 1. Total Runs (DESC)
          if (b.runs !== a.runs) return b.runs - a.runs;
          // 2. Batting Average (DESC)
          if (b.avg !== a.avg) return b.avg - a.avg;
          // 3. Strike Rate (DESC)
          if (b.sr !== a.sr) return b.sr - a.sr;
          // 4. Innings Played (ASC - fewer is better)
          return a.innings - b.innings;
        });
      case 'BOWL':
        return data.sort((a, b) => {
          // 1. Total Wickets (DESC)
          if (b.wickets !== a.wickets) return b.wickets - a.wickets;
          // 2. Bowling Average (ASC - lower is better)
          // Handle cases where avg is 0 (no wickets) vs defined avg. But here wickets > 0 usually for leaderboard.
          // If both have wickets, lower avg is better.
          if (a.bowlingAvg !== b.bowlingAvg) return a.bowlingAvg - b.bowlingAvg;
          // 3. Economy Rate (ASC - lower is better)
          if (a.eco !== b.eco) return a.eco - b.eco;
          // 4. Overs Bowled (DESC - more is better)
          return b.overs - a.overs;
        });
      case 'FIELD':
        return data.sort((a, b) => {
          // 1. Total Fielding Points (DESC)
          if (b.fieldingPoints !== a.fieldingPoints) return b.fieldingPoints - a.fieldingPoints;
          // 2. More Catches (DESC)
          if (b.catches !== a.catches) return b.catches - a.catches;
          // 3. More Run-outs (DESC)
          if (b.runOuts !== a.runOuts) return b.runOuts - a.runOuts;
          // 4. More matches played (DESC - more involvement)
          return b.matches - a.matches;
        });
      case 'MVP':
        return data.sort((a, b) => b.mvpPoints - a.mvpPoints);
      default:
        return data;
    }
  }, [activeCategory, processedData, teamFilter, minInnings, minOvers]);

  const topPerformer = leaderboardData[0];
  const otherPerformers = leaderboardData.slice(1, 11); // Top 10 only for list

  // Empty State: No matches
  if (matchesPlayed === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏏</div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Waiting for the first ball</h3>
        <p>Batting leaderboard will appear after the first match.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* 1. Category Switcher */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px', 
        marginBottom: '24px',
        backgroundColor: 'white',
        padding: '6px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0'
      }}>
        {(['BAT', 'BOWL', 'FIELD', 'MVP'] as LeaderboardCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flex: 1,
              padding: '8px 0',
              border: 'none',
              background: activeCategory === cat ? '#0f172a' : 'transparent',
              color: activeCategory === cat ? 'white' : '#64748b',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat === 'BAT' && '🏏 BAT'}
            {cat === 'BOWL' && '🎯 BOWL'}
            {cat === 'FIELD' && '🧤 FIELD'}
            {cat === 'MVP' && '🏆 MVP'}
          </button>
        ))}
      </div>

      {/* Filters (Only visible for BAT/BOWL usually, but keeping simple) */}
      {activeCategory !== 'MVP' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
          <select 
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              color: '#334155',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            {uniqueTeams.map(team => (
              <option key={team} value={team}>{team === 'All' ? 'All Teams' : team}</option>
            ))}
          </select>
          
          {activeCategory === 'BAT' && (
             <select 
              value={minInnings}
              onChange={(e) => setMinInnings(Number(e.target.value))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                color: '#334155',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value={1}>Min Innings: 1</option>
              <option value={3}>Min Innings: 3</option>
              <option value={5}>Min Innings: 5</option>
            </select>
          )}
          
          {activeCategory === 'BOWL' && (
             <select 
              value={minOvers}
              onChange={(e) => setMinOvers(Number(e.target.value))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                color: '#334155',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value={1}>Min Overs: 1</option>
              <option value={10}>Min Overs: 10</option>
              <option value={20}>Min Overs: 20</option>
            </select>
          )}
        </div>
      )}

      {/* 2. Top Performer Card */}
      {topPerformer ? (
        <div style={{ 
          marginBottom: '32px',
          background: activeCategory === 'BAT' 
            ? 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)' // Orange for Batting
            : activeCategory === 'BOWL'
            ? 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' // Purple for Bowling
            : activeCategory === 'FIELD'
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' // Emerald for Fielding
            : activeCategory === 'MVP'
            ? 'linear-gradient(135deg, #eab308 0%, #a16207 100%)' // Gold for MVP
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', // Default dark
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
          cursor: 'pointer'
        }}
        onClick={() => console.log(`Navigate to player: ${topPerformer.name}`)}
        >
          {/* Badge */}
          <div style={{ 
            position: 'absolute', top: '20px', right: '20px', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            padding: '6px 12px', borderRadius: '100px', 
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textTransform: 'uppercase'
          }}>
            {activeCategory === 'BAT' && (isTournamentEnded ? 'BEST BATTER – TOURNAMENT' : 'ORANGE CAP HOLDER')}
            {activeCategory === 'BOWL' && (isTournamentEnded ? 'BEST BOWLER – TOURNAMENT' : 'PURPLE CAP HOLDER')}
            {activeCategory === 'FIELD' && (isTournamentEnded ? 'BEST FIELDER – TOURNAMENT' : 'BEST FIELDER')}
            {activeCategory === 'MVP' && 'TOURNAMENT MVP'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <img 
              src={topPerformer.avatar} 
              alt={topPerformer.name} 
              style={{ 
                width: '90px', height: '90px', borderRadius: '50%', 
                border: '4px solid rgba(255,255,255,0.3)',
                objectFit: 'cover'
              }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '2px', lineHeight: 1.2 }}>{topPerformer.name}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 500, marginBottom: '16px' }}>{topPerformer.team}</div>
              
              <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1 }}>
                    {activeCategory === 'BAT' && topPerformer.runs}
                    {activeCategory === 'BOWL' && topPerformer.wickets}
                    {activeCategory === 'FIELD' && topPerformer.fieldingPoints}
                    {activeCategory === 'MVP' && topPerformer.mvpPoints}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                    {activeCategory === 'BAT' && 'Total Runs'}
                    {activeCategory === 'BOWL' && 'Wickets'}
                    {activeCategory === 'FIELD' && 'Points'}
                    {activeCategory === 'MVP' && 'Points'}
                  </div>
                </div>

                {/* Secondary Stats */}
                <div style={{ display: 'flex', gap: '24px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px', paddingBottom: '4px' }}>
                  {activeCategory === 'BAT' && (
                    <>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.matches}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Mat</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.innings}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Inns</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.avg.toFixed(1)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Avg</div>
                      </div>
                    </>
                  )}
                  {/* ... other categories secondary stats ... */}
                   {activeCategory === 'BOWL' && (
                    <>
                       <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.overs}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Overs</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.bowlingAvg.toFixed(1)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Avg</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.eco.toFixed(1)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Econ</div>
                      </div>
                    </>
                  )}
                  {activeCategory === 'FIELD' && (
                    <>
                       <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.catches}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Ct</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.runOuts}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>RO</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.stumpings}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>St</div>
                      </div>
                    </>
                  )}
                  {activeCategory === 'MVP' && (
                    <>
                       <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.runs}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Runs</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.wickets}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Wkts</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.fieldingPoints}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Field</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No players found for this filter.</div>
      )}

      {/* 3. Ranked List Table */}
      {otherPerformers.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          
          {/* Table Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: (activeCategory === 'BAT' || activeCategory === 'BOWL' || activeCategory === 'FIELD' || activeCategory === 'MVP') ? '40px 3fr 1fr 1fr 1fr 1fr' : '40px 3fr 1fr', 
            padding: '0 24px 12px 24px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>#</div>
            <div>Player</div>
            {activeCategory === 'BAT' && (
              <>
                <div style={{ textAlign: 'right' }}>Runs</div>
                <div style={{ textAlign: 'right' }}>Avg</div>
                <div style={{ textAlign: 'right' }}>SR</div>
                <div style={{ textAlign: 'right' }}>Inns</div>
              </>
            )}
            {activeCategory === 'BOWL' && (
              <>
                <div style={{ textAlign: 'right' }}>Wkts</div>
                <div style={{ textAlign: 'right' }}>Avg</div>
                <div style={{ textAlign: 'right' }}>Eco</div>
                <div style={{ textAlign: 'right' }}>Overs</div>
              </>
            )}
            {activeCategory === 'FIELD' && (
              <>
                <div style={{ textAlign: 'right' }}>Pts</div>
                <div style={{ textAlign: 'right' }}>Ct</div>
                <div style={{ textAlign: 'right' }}>RO</div>
                <div style={{ textAlign: 'right' }}>St</div>
              </>
            )}
             {activeCategory === 'MVP' && (
              <>
                <div style={{ textAlign: 'right' }}>Pts</div>
                <div style={{ textAlign: 'right' }}>Runs</div>
                <div style={{ textAlign: 'right' }}>Wkts</div>
                <div style={{ textAlign: 'right' }}>Field</div>
              </>
             )}
          </div>

          {otherPerformers.map((player, index) => (
            <div 
              key={player.id} 
              onClick={() => console.log(`Navigate to player: ${player.name}`)}
              style={{ 
                backgroundColor: 'white', 
                padding: '16px 24px',
                borderBottom: '1px solid #f1f5f9',
                display: 'grid', 
                gridTemplateColumns: (activeCategory === 'BAT' || activeCategory === 'BOWL' || activeCategory === 'FIELD' || activeCategory === 'MVP') ? '40px 3fr 1fr 1fr 1fr 1fr' : '40px 3fr 1fr',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>{index + 2}</div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={player.avatar} 
                  alt={player.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', backgroundColor: '#f1f5f9' }} 
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{player.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{player.team}</div>
                </div>
              </div>

              {activeCategory === 'BAT' && (
                <>
                  <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{player.runs}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.avg.toFixed(1)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.sr.toFixed(0)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.innings}</div>
                </>
              )}

              {activeCategory === 'BOWL' && (
                <>
                  <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{player.wickets}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.bowlingAvg.toFixed(1)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.eco.toFixed(1)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.overs}</div>
                </>
              )}

              {activeCategory === 'FIELD' && (
                <>
                  <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{player.fieldingPoints}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.catches}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.runOuts}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.stumpings}</div>
                </>
              )}

              {activeCategory === 'MVP' && (
                 <>
                    <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{player.mvpPoints}</div>
                    <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.runs}</div>
                    <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.wickets}</div>
                    <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.fieldingPoints}</div>
                 </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MVP Transparency Section */}
      {activeCategory === 'MVP' && (
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>🏆 MVP SCORING MODEL</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <div>Runs: <span style={{ fontWeight: 600 }}>1 pt</span></div>
            <div>Wickets: <span style={{ fontWeight: 600 }}>25 pts</span></div>
            <div>Catches: <span style={{ fontWeight: 600 }}>10 pts</span></div>
            <div>Run-outs: <span style={{ fontWeight: 600 }}>10 pts</span></div>
            <div>Stumpings: <span style={{ fontWeight: 600 }}>10 pts</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
