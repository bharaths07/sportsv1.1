import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTournamentStats } from '../stats/useTournamentStats';
import { LeaderboardCategory } from '../stats/types';

export const TournamentLeaderboard: React.FC<{ tournamentId?: string }> = ({ tournamentId: propTournamentId }) => {
  const { tournamentId: paramTournamentId } = useParams();
  const tournamentId = propTournamentId || paramTournamentId || '';
  
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('BAT');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [minInnings, setMinInnings] = useState<number>(1);
  const [minOvers, setMinOvers] = useState<number>(1);

  const { leaderboardData, matchCount } = useTournamentStats(tournamentId, activeCategory);

  // Filter Logic
  const filteredData = leaderboardData.filter(p => {
    if (teamFilter !== 'All' && p.teamName !== teamFilter) return false;
    if (activeCategory === 'BAT' && p.innings < minInnings) return false;
    if (activeCategory === 'BOWL' && p.overs < minOvers) return false;
    return true;
  });

  const topPerformer = filteredData[0];
  const otherPerformers = filteredData.slice(1, 10); // Top 10
  
  // Extract unique teams from data for filter
  const uniqueTeams = Array.from(new Set(leaderboardData.map(p => p.teamName)));
  const isTournamentEnded = false; // Could be derived from tournament status

  // Empty State: No matches
  if (matchCount === 0) {
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

      {/* Filters */}
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
            <option value="All">All Teams</option>
            {uniqueTeams.map(team => (
              <option key={team} value={team}>{team}</option>
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
              src={topPerformer.avatar || `https://ui-avatars.com/api/?name=${topPerformer.name}&background=random`} 
              alt={topPerformer.name} 
              style={{ 
                width: '90px', height: '90px', borderRadius: '50%', 
                border: '4px solid rgba(255,255,255,0.3)',
                objectFit: 'cover'
              }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '2px', lineHeight: 1.2 }}>{topPerformer.name}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 500, marginBottom: '16px' }}>{topPerformer.teamName}</div>
              
              <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1 }}>
                    {activeCategory === 'BAT' && topPerformer.runs}
                    {activeCategory === 'BOWL' && topPerformer.wickets}
                    {activeCategory === 'FIELD' && (topPerformer.catches + topPerformer.runOuts + topPerformer.stumpings)}
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
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.battingAvg.toFixed(1)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Avg</div>
                      </div>
                    </>
                  )}
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
                        <div style={{ fontSize: '16px', fontWeight: 700 }}>{topPerformer.economy.toFixed(1)}</div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          No players match the current filters.
        </div>
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
                  src={player.avatar || `https://ui-avatars.com/api/?name=${player.name}&background=random`} 
                  alt={player.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', backgroundColor: '#f1f5f9' }} 
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{player.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{player.teamName}</div>
                </div>
              </div>

              {activeCategory === 'BAT' && (
                <>
                  <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{player.runs}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.battingAvg.toFixed(1)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.battingSr.toFixed(0)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.innings}</div>
                </>
              )}

              {activeCategory === 'BOWL' && (
                <>
                  <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{player.wickets}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.bowlingAvg.toFixed(1)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.economy.toFixed(1)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.overs}</div>
                </>
              )}

              {activeCategory === 'FIELD' && (
                <>
                  <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{player.catches + player.runOuts + player.stumpings}</div>
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
                    <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569' }}>{player.catches + player.runOuts + player.stumpings}</div>
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
          </div>
        </div>
      )}
    </div>
  );
};
