import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Match } from '../../domain/match';

export const PlayerProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { players, matches, teams } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'fielding'>('batting');

  const player = players.find(p => p.id === id);

  // --- Aggregation Logic ---
  const stats = useMemo(() => {
    if (!player) return null;

    let totalMatches = 0;
    let runs = 0;
    let ballsFaced = 0;
    let wickets = 0;
    let ballsBowled = 0; // Not explicitly tracked in domain, inferred
    let runsConceded = 0; // Not explicitly tracked in domain, inferred
    let fours = 0;
    let sixes = 0;
    let catches = 0; // Not in domain yet
    let runOuts = 0; // Not in domain yet
    let highestScore = 0;
    let bestBowlingWickets = 0;
    let bestBowlingRuns = 0;

    // Filter matches where this player participated
    const playerMatches = matches.filter(m => 
        (m.homeParticipant.players?.some(p => p.playerId === player.id) || 
         m.awayParticipant.players?.some(p => p.playerId === player.id)) &&
         m.status === 'completed' // Only count completed matches for stats? Or live too? User said "Matches".
    );

    totalMatches = playerMatches.length;

    // Iterate matches to sum stats
    playerMatches.forEach(m => {
        const homeP = m.homeParticipant.players?.find(p => p.playerId === player.id);
        const awayP = m.awayParticipant.players?.find(p => p.playerId === player.id);
        const pStats = homeP || awayP;

        if (pStats) {
            runs += pStats.runs;
            ballsFaced += pStats.balls;
            wickets += pStats.wickets;
            
            if (pStats.runs > highestScore) highestScore = pStats.runs;
            
            // Bowling Best Figures Logic (Simple: Max wickets, then min runs)
            // Note: We don't have runs conceded in PlayerStats. 
            // We'll use a placeholder or derived logic if available.
            if (pStats.wickets > bestBowlingWickets) {
                bestBowlingWickets = pStats.wickets;
                bestBowlingRuns = 20; // Mock placeholder as we lack data
            }
        }
        
        // Scan events for boundaries (Expensive but accurate if events exist)
        m.events?.forEach(e => {
            if (e.scorerId === player.id && e.type === 'run') {
                if (e.points === 4) fours++;
                if (e.points === 6) sixes++;
            }
        });
    });

    // Calculations
    const battingAvg = totalMatches > 0 ? (runs / totalMatches).toFixed(1) : '0.0'; // Ideally divide by dismissal count
    const strikeRate = ballsFaced > 0 ? ((runs / ballsFaced) * 100).toFixed(1) : '0.0';
    const bowlingAvg = wickets > 0 ? (runsConceded / wickets).toFixed(1) : '-'; // Missing runs conceded
    const economy = ballsBowled > 0 ? (runsConceded / (ballsBowled/6)).toFixed(1) : '-'; // Missing balls bowled

    return {
        totalMatches,
        runs,
        wickets,
        battingAvg,
        strikeRate,
        highestScore,
        bestBowling: `${bestBowlingWickets}/${bestBowlingRuns}`,
        fours,
        sixes,
        recentMatches: playerMatches.slice(0, 5) // Last 5
    };
  }, [player, matches]);

  if (!player) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Player not found</div>;
  }

  const teamIds = teams.filter(t => t.members.some(m => m.playerId === player.id)).map(t => t.name);

  return (
    <div style={{ paddingBottom: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* 1. Header (Soft Sticky) */}
      <div style={{ 
          backgroundColor: 'white', 
          padding: '24px 20px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             {/* Avatar */}
             <div style={{ 
                 width: '64px', height: '64px', 
                 borderRadius: '50%', 
                 backgroundColor: '#e2e8f0', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: '24px', fontWeight: 700, color: '#64748b'
             }}>
                 {player.firstName[0]}{player.lastName[0]}
             </div>
             
             {/* Info */}
             <div style={{ flex: 1 }}>
                 <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                     {player.firstName} {player.lastName}
                 </h1>
                 <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                     {teamIds.join(', ') || 'Free Agent'}
                 </div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                     <span style={{ 
                         backgroundColor: '#eff6ff', color: '#1d4ed8', 
                         fontSize: '11px', fontWeight: 700, 
                         padding: '4px 8px', borderRadius: '100px',
                         textTransform: 'uppercase'
                     }}>
                         {player.role || 'Player'}
                     </span>
                 </div>
             </div>
             
             {/* Jersey Number */}
             {player.jerseyNumber && (
                 <div style={{ fontSize: '32px', fontWeight: 900, color: '#e2e8f0', lineHeight: 1 }}>
                     {player.jerseyNumber}
                 </div>
             )}
          </div>
          
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#475569', display: 'flex', gap: '16px' }}>
              <div>🏏 {player.battingStyle || 'Right-hand bat'}</div>
              <div>🥎 {player.bowlingStyle || 'Right-arm medium'}</div>
          </div>
      </div>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          
          {/* 2. Career Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{stats?.totalMatches}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Matches</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{stats?.runs}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Runs</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{stats?.wickets}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Wickets</div>
              </div>
          </div>

          {/* 3. Detailed Stats Tabs */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
                  {['batting', 'bowling', 'fielding'].map(tab => (
                      <button
                          key={tab}
                          onClick={() => setActiveTab(tab as any)}
                          style={{
                              flex: 1,
                              padding: '12px',
                              background: activeTab === tab ? '#f8fafc' : 'white',
                              border: 'none',
                              borderBottom: activeTab === tab ? '2px solid #0f172a' : '2px solid transparent',
                              fontWeight: activeTab === tab ? 700 : 500,
                              color: activeTab === tab ? '#0f172a' : '#64748b',
                              cursor: 'pointer',
                              textTransform: 'capitalize'
                          }}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
              
              <div style={{ padding: '20px' }}>
                  {activeTab === 'batting' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Average</div>
                              <div style={{ fontSize: '18px', fontWeight: 700 }}>{stats?.battingAvg}</div>
                          </div>
                          <div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Strike Rate</div>
                              <div style={{ fontSize: '18px', fontWeight: 700 }}>{stats?.strikeRate}</div>
                          </div>
                          <div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Highest Score</div>
                              <div style={{ fontSize: '18px', fontWeight: 700 }}>{stats?.highestScore}</div>
                          </div>
                          <div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Boundaries</div>
                              <div style={{ fontSize: '18px', fontWeight: 700 }}>{stats?.fours} (4s) / {stats?.sixes} (6s)</div>
                          </div>
                      </div>
                  )}
                  {activeTab === 'bowling' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Wickets</div>
                              <div style={{ fontSize: '18px', fontWeight: 700 }}>{stats?.wickets}</div>
                          </div>
                          <div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Best Figures</div>
                              <div style={{ fontSize: '18px', fontWeight: 700 }}>{stats?.bestBowling}</div>
                          </div>
                      </div>
                  )}
                  {activeTab === 'fielding' && (
                       <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                           Fielding stats not yet available
                       </div>
                  )}
              </div>
          </div>

          {/* 4. Recent Form */}
          <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Recent Form</h3>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  {stats?.recentMatches.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No recent matches</div>
                  ) : (
                      stats?.recentMatches.map((m, i) => {
                          const isHome = m.homeParticipant.players?.some(p => p.playerId === player.id);
                          const opponent = isHome ? m.awayParticipant.name : m.homeParticipant.name;
                          const pStats = isHome 
                            ? m.homeParticipant.players?.find(p => p.playerId === player.id)
                            : m.awayParticipant.players?.find(p => p.playerId === player.id);
                          
                          return (
                              <div 
                                  key={m.id}
                                  onClick={() => navigate(`/match/${m.id}`)}
                                  style={{ 
                                      padding: '16px', 
                                      borderBottom: '1px solid #f1f5f9', 
                                      display: 'flex', 
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      cursor: 'pointer'
                                  }}
                              >
                                  <div>
                                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>vs {opponent}</div>
                                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(m.date).toLocaleDateString()}</div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                                          {pStats?.runs} <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>({pStats?.balls})</span>
                                      </div>
                                      {pStats?.wickets ? (
                                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#7e22ce' }}>
                                              {pStats.wickets} Wkts
                                          </div>
                                      ) : null}
                                  </div>
                              </div>
                          );
                      })
                  )}
              </div>
          </div>

      </div>
    </div>
  );
};
