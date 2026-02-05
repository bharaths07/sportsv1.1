import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { EmptyState } from '../../components/EmptyState';
import { FollowButton } from '../../components/FollowButton';

const SPORTS_MAP: Record<string, string> = {
  's1': 'Cricket',
  's2': 'Football',
  's3': 'Kabaddi',
  's4': 'Badminton'
};

type TabType = 'overview' | 'squad' | 'matches' | 'stats' | 'achievements';

// -- Sub-components --

const StatCard: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div style={{ 
    backgroundColor: '#f8fafc', 
    borderRadius: '12px', 
    padding: '16px', 
    flex: 1,
    minWidth: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e2e8f0'
  }}>
    <div style={{ fontSize: '24px', fontWeight: '800', color: color || '#0f172a', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>{label}</div>
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#0f172a', borderLeft: '4px solid #3b82f6', paddingLeft: '12px' }}>
    {children}
  </h3>
);

const Badge: React.FC<{ text: string; color: string; bg: string }> = ({ text, color, bg }) => (
  <span style={{ 
    display: 'inline-block', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    backgroundColor: bg, 
    color: color, 
    fontSize: '11px', 
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }}>
    {text}
  </span>
);

export const TeamScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { teams, matches, players } = useGlobalState();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const team = teams.find(t => t.id === id);

  // -- Data Derivation --

  // Matches Logic
  const teamMatches = useMemo(() => {
    if (!team) return [];
    return matches.filter(m => 
      m.homeParticipant.id === team.id || m.awayParticipant.id === team.id
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [matches, team]);

  const completedMatches = teamMatches.filter(m => m.status === 'completed');
  const upcomingMatches = teamMatches.filter(m => m.status === 'draft' || m.status === 'locked');

  const matchesPlayed = completedMatches.length;
  const wins = team ? completedMatches.filter(m => m.winnerId === team.id).length : 0;
  const losses = team ? completedMatches.filter(m => m.winnerId && m.winnerId !== team.id).length : 0;
  // Draws/NR logic if needed
  const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;

  // Players Logic
  const squad = useMemo(() => {
    if (!team) return [];
    return team.members.map(member => {
      const playerProfile = players.find(p => p.id === member.playerId);
      return {
        ...member,
        name: playerProfile ? `${playerProfile.firstName} ${playerProfile.lastName}` : 'Unknown Player',
        active: playerProfile?.active
      };
    }).sort((a, b) => {
      const rank = (role: string) => {
        if (role === 'captain') return 0;
        if (role === 'vice-captain') return 1;
        return 2; 
      };
      return rank(a.role) - rank(b.role);
    });
  }, [team, players]);

  if (!team) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Team not found</div>;
  }

  const captain = squad.find(m => m.role === 'captain');

  // Stats Logic (Mocked for V1 as strict aggregation requires ball-by-ball data which might be heavy here)
  // In a real app, these would be aggregated from match scorecards.
  const stats = {
    runs: 2450, // Mock
    wickets: 128, // Mock
    avgRuns: 165, // Mock
    avgWickets: 6.5 // Mock
  };

  // -- UI Helpers --

  const renderTabButton = (tab: TabType, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: '16px 24px',
        background: 'none',
        border: 'none',
        borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent',
        color: activeTab === tab ? '#0f172a' : '#64748b',
        fontWeight: activeTab === tab ? '700' : '600',
        cursor: 'pointer',
        fontSize: '15px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px', fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>
      
      {/* 1. HEADER SECTION */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '32px 24px', 
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignItems: 'center'
      }}>
        {/* Left: Avatar */}
        <div style={{ 
          width: '88px', height: '88px', 
          borderRadius: '50%', 
          backgroundColor: '#f8fafc', 
          border: '4px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', fontWeight: '800', color: '#475569',
          flexShrink: 0
        }}>
          {team.logoUrl ? (
            <img src={team.logoUrl} alt={team.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            team.name.substring(0, 2).toUpperCase()
          )}
        </div>

        {/* Center: Info */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '32px', color: '#0f172a', fontWeight: '800', lineHeight: 1.2 }}>
              {team.name}
            </h1>
            {/* Future: Verified Badge */}
            {/* <span title="Verified" style={{ color: '#3b82f6' }}>✓</span> */}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '15px', color: '#64748b', marginBottom: '12px' }}>
            <span style={{ fontWeight: '600', color: '#334155' }}>{SPORTS_MAP[team.sportId]}</span>
            <span>•</span>
            <span style={{ textTransform: 'capitalize' }}>{team.type} Team</span>
            {team.foundedYear && (
              <>
                <span>•</span>
                <span>Est. {team.foundedYear}</span>
              </>
            )}
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {team.achievements && team.achievements.length > 0 && (
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '6px', 
                backgroundColor: '#fff7ed', color: '#c2410c', 
                padding: '4px 10px', borderRadius: '20px', 
                fontSize: '12px', fontWeight: '700',
                border: '1px solid #ffedd5'
              }}>
                <span>🏆</span> {team.achievements[0].title}
              </div>
            )}
          </div>
        </div>

        {/* Right: Key People & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'right', fontSize: '14px' }}>
            {captain && (
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Captain: </span>
                <Link to={`/players/${captain.playerId}`} style={{ fontWeight: '600', color: '#0f172a', textDecoration: 'none' }}>
                  {captain.name}
                </Link>
              </div>
            )}
            {team.coach && (
              <div>
                <span style={{ color: '#94a3b8' }}>Coach: </span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{team.coach}</span>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0', 
              background: 'white', 
              cursor: 'pointer',
              color: '#64748b' 
            }} title="Share Team">
              🔗
            </button>
            <FollowButton id={team.id} type="team" label={true} />
          </div>
        </div>
      </div>

      {/* 2. STATS STRIP */}
      <div style={{ padding: '24px', backgroundColor: 'white', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          <StatCard label="Matches" value={matchesPlayed.toString()} />
          <StatCard label="Wins" value={wins.toString()} color="#22c55e" />
          <StatCard label="Losses" value={losses.toString()} color="#ef4444" />
          <StatCard label="Win %" value={`${winRate}%`} color="#8b5cf6" />
        </div>
      </div>

      {/* 3. STICKY TABS */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 10, 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        overflowX: 'auto'
      }}>
        {renderTabButton('overview', 'Overview')}
        {renderTabButton('squad', 'Squad')}
        {renderTabButton('matches', 'Matches')}
        {renderTabButton('stats', 'Stats')}
        {renderTabButton('achievements', 'Achievements')}
      </div>

      {/* 4. TAB CONTENT */}
      <div style={{ padding: '0 24px' }}>
        
        {/* -- OVERVIEW TAB -- */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Recent Form */}
            <div>
              <SectionTitle>Recent Form</SectionTitle>
              {completedMatches.length === 0 ? (
                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No matches played yet.</div>
              ) : (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {completedMatches.slice(0, 5).map(m => {
                    let result = 'D';
                    let bg = '#f1f5f9';
                    let color = '#64748b';
                    
                    if (m.winnerId === team.id) { result = 'W'; bg = '#dcfce7'; color = '#166534'; }
                    else if (m.winnerId) { result = 'L'; bg = '#fee2e2'; color = '#991b1b'; }
                    
                    return (
                      <Link to={`/matches/${m.id}`} key={m.id} style={{ textDecoration: 'none' }}>
                        <div style={{ 
                          width: '40px', height: '40px', 
                          borderRadius: '8px', 
                          backgroundColor: bg, 
                          color: color, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '800', fontSize: '14px',
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                          {result}
                        </div>
                      </Link>
                    );
                  })}
                  <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '8px' }}>Last 5 matches</span>
                </div>
              )}
            </div>

            {/* About Team */}
            <div>
              <SectionTitle>About Team</SectionTitle>
              <div style={{ lineHeight: '1.6', color: '#475569', fontSize: '15px', maxWidth: '700px' }}>
                {team.about || "No description available for this team."}
              </div>
            </div>

            {/* Active Tournaments (Mock) */}
            <div>
              <SectionTitle>Active Tournaments</SectionTitle>
              <div style={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                overflow: 'hidden',
                backgroundColor: 'white'
              }}>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>City Championship 2024</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>League Stage</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: '#22c55e' }}>#2</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Current Rank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -- SQUAD TAB -- */}
        {activeTab === 'squad' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {squad.map(member => (
                <Link to={`/players/${member.playerId}`} key={member.playerId} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    border: '1px solid #e2e8f0',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}>
                    <div style={{ 
                      width: '48px', height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f1f5f9', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', color: '#64748b'
                    }}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                        {member.name} {member.role === 'captain' && '©'} {member.role === 'vice-captain' && '(vc)'}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {member.role === 'captain' && <Badge text="Captain" color="#fff" bg="#3b82f6" />}
                        {member.role === 'vice-captain' && <Badge text="Vice Captain" color="#1e40af" bg="#dbeafe" />}
                        {member.role === 'member' && <Badge text="Player" color="#475569" bg="#f1f5f9" />}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* -- MATCHES TAB -- */}
        {activeTab === 'matches' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Upcoming */}
            <div>
              <SectionTitle>Upcoming Matches</SectionTitle>
              {upcomingMatches.length === 0 ? (
                <EmptyState message="No upcoming matches scheduled." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {upcomingMatches.map(m => (
                    <div key={m.id} style={{ 
                      padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: 'white',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                       <div>
                         <div style={{ fontWeight: '700', color: '#0f172a' }}>vs {m.homeParticipant.id === team.id ? m.awayParticipant.name : m.homeParticipant.name}</div>
                         <div style={{ fontSize: '13px', color: '#64748b' }}>{new Date(m.date).toLocaleDateString()}</div>
                       </div>
                       <div style={{ fontSize: '13px', fontWeight: '600', color: '#f59e0b', backgroundColor: '#fffbeb', padding: '4px 8px', borderRadius: '4px' }}>
                         Upcoming
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent */}
            <div>
              <SectionTitle>Recent Results</SectionTitle>
              {completedMatches.length === 0 ? (
                <EmptyState message="No completed matches." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {completedMatches.map(m => {
                     const isWin = m.winnerId === team.id;
                     return (
                      <Link to={`/matches/${m.id}`} key={m.id} style={{ textDecoration: 'none' }}>
                        <div style={{ 
                          padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: 'white',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: '700', color: '#0f172a' }}>
                              vs {m.homeParticipant.id === team.id ? m.awayParticipant.name : m.homeParticipant.name}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                              {new Date(m.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: '13px', fontWeight: '700', 
                            color: isWin ? '#166534' : '#991b1b', 
                            backgroundColor: isWin ? '#dcfce7' : '#fee2e2', 
                            padding: '4px 12px', borderRadius: '20px' 
                          }}>
                            {isWin ? 'WON' : 'LOST'}
                          </div>
                        </div>
                      </Link>
                     );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -- STATS TAB -- */}
        {activeTab === 'stats' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '16px' }}>Team Batting</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ color: '#475569' }}>Total Runs</span>
                     <span style={{ fontWeight: '700', color: '#0f172a' }}>{stats.runs}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ color: '#475569' }}>Avg / Match</span>
                     <span style={{ fontWeight: '700', color: '#0f172a' }}>{stats.avgRuns}</span>
                   </div>
                </div>
              </div>
              <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '16px' }}>Team Bowling</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ color: '#475569' }}>Total Wickets</span>
                     <span style={{ fontWeight: '700', color: '#0f172a' }}>{stats.wickets}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ color: '#475569' }}>Avg / Match</span>
                     <span style={{ fontWeight: '700', color: '#0f172a' }}>{stats.avgWickets}</span>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Leaders Mock */}
            <SectionTitle>Top Performers</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
               <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👑</div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Most Runs</div>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>Player 1</div>
                    <div style={{ fontSize: '13px', color: '#d97706', fontWeight: '600' }}>450 Runs</div>
                  </div>
               </div>
               <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎯</div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Most Wickets</div>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>Player 2</div>
                    <div style={{ fontSize: '13px', color: '#4f46e5', fontWeight: '600' }}>22 Wickets</div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* -- ACHIEVEMENTS TAB -- */}
        {activeTab === 'achievements' && (
          <div>
            {team.achievements && team.achievements.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {team.achievements.map((ach, idx) => (
                  <div key={idx} style={{ 
                    padding: '24px', 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fff 100%)', 
                    border: '1px solid #fcd34d',
                    display: 'flex', alignItems: 'center', gap: '24px'
                  }}>
                    <div style={{ fontSize: '40px' }}>🏆</div>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', color: '#92400e', fontSize: '18px' }}>{ach.title}</h3>
                      <div style={{ color: '#b45309', fontWeight: '600' }}>{ach.tournamentName} • {ach.season}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No achievements listed yet." icon="🏆" />
            )}
          </div>
        )}

      </div>
    </div>
  );
};
