import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';

interface SquadPlayer {
  id: string;
  name: string;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper';
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  avatarUrl?: string;
}

interface TeamSquad {
  id: string;
  name: string;
  code: string;
  logo: string;
  squadSize: number;
  coach?: string;
  captainName?: string;
  note?: string; 
  players: SquadPlayer[];
}

interface TournamentSquadsTabProps {
  initialSelectedTeamId?: string;
}

export const TournamentSquadsTab: React.FC<TournamentSquadsTabProps> = ({ initialSelectedTeamId }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments, teams: allTeams, players: allPlayers } = useGlobalState();

  const tournament = tournaments.find(t => t.id === id);

  // Derive Squads from Real Data
  const squads: TeamSquad[] = useMemo(() => {
    if (!tournament || !tournament.teams) return [];

    const tournamentTeams = allTeams.filter(t => tournament.teams?.includes(t.id));

    return tournamentTeams.map(team => {
      // Map members to players
      const squadPlayers: SquadPlayer[] = team.members.map(member => {
        const playerProfile = allPlayers.find(p => p.id === member.playerId);
        
        // Map backend role to UI role
        let uiRole: SquadPlayer['role'] = 'All-Rounder';
        if (playerProfile?.role === 'Batsman') uiRole = 'Batter';
        else if (playerProfile?.role === 'Bowler') uiRole = 'Bowler';
        else if (playerProfile?.role === 'Wicket Keeper') uiRole = 'Wicket Keeper';
        
        return {
          id: member.playerId,
          name: playerProfile ? `${playerProfile.firstName} ${playerProfile.lastName}` : 'Unknown Player',
          role: uiRole,
          isCaptain: member.role === 'captain',
          isViceCaptain: member.role === 'vice-captain',
          avatarUrl: playerProfile?.avatarUrl
        };
      });

      // Find Captain Name
      const captain = squadPlayers.find(p => p.isCaptain);

      return {
        id: team.id,
        name: team.name,
        code: team.name.substring(0, 3).toUpperCase(), // Fallback code
        logo: team.logoUrl || '', 
        squadSize: squadPlayers.length,
        coach: team.coach,
        captainName: captain?.name,
        note: team.achievements?.[0]?.title, // Use most recent achievement as note
        players: squadPlayers
      };
    });
  }, [tournament, allTeams, allPlayers]);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(initialSelectedTeamId || (squads.length > 0 ? squads[0].id : null));

  // Update selected team if squads change (e.g. data load) and nothing selected
  React.useEffect(() => {
    if (!selectedTeamId && squads.length > 0) {
      setSelectedTeamId(squads[0].id);
    }
  }, [squads, selectedTeamId]);

  const selectedTeam = squads.find(t => t.id === selectedTeamId) || squads[0];

  if (!tournament) return <div>Tournament not found</div>;

  if (squads.length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>No Teams Added Yet</h3>
        <p style={{ fontSize: '14px' }}>Teams participating in this tournament will appear here.</p>
      </div>
    );
  }


  // Group players by role for better readability
  const groupedPlayers = {
    'Batters': selectedTeam.players.filter(p => p.role === 'Batter'),
    'Wicket Keepers': selectedTeam.players.filter(p => p.role === 'Wicket Keeper'),
    'All-Rounders': selectedTeam.players.filter(p => p.role === 'All-Rounder'),
    'Bowlers': selectedTeam.players.filter(p => p.role === 'Bowler'),
  };

  const roleOrder = ['Batters', 'Wicket Keepers', 'All-Rounders', 'Bowlers'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Team List (Entry Level) */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Participating Teams</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '16px' 
        }}>
          {squads.map((team) => {
            const isSelected = team.id === selectedTeamId;
            return (
              <div 
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                style={{
                  backgroundColor: isSelected ? '#eff6ff' : 'white',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: isSelected ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 'none'
                }}
              >
                {team.logo ? (
                  <img 
                    src={team.logo} 
                    alt={team.name} 
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🛡️
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>{team.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{team.squadSize} Players</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Selected Team Details (Master-Detail View) */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden' 
      }}>
        {/* Team Context Header */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {selectedTeam.logo ? (
              <img 
                src={selectedTeam.logo} 
                alt={selectedTeam.name} 
                style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
              />
            ) : (
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px'
              }}>
                🛡️
              </div>
            )}
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{selectedTeam.name}</h2>
              {selectedTeam.note && (
                <div style={{ 
                  marginTop: '4px', 
                  display: 'inline-block', 
                  backgroundColor: '#e0f2fe', 
                  color: '#0369a1', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  padding: '2px 8px', 
                  borderRadius: '12px' 
                }}>
                  {selectedTeam.note}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
             {selectedTeam.captainName && (
               <div style={{ fontSize: '14px', color: '#475569' }}>
                 Captain: <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTeam.captainName}</span>
               </div>
             )}
             {selectedTeam.coach && (
               <div style={{ fontSize: '14px', color: '#475569' }}>
                 Coach: <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTeam.coach}</span>
               </div>
             )}
             
             {/* 5. Team Page Link */}
             <button 
                onClick={() => navigate(`/team/${selectedTeam.id}`)}
                style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  textAlign: 'right'
                }}
             >
               View Team Profile →
             </button>
          </div>
        </div>

        {/* 3. Squad List */}
        <div style={{ padding: '24px' }}>
          {selectedTeam.players.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤷‍♂️</div>
              <p>No players added to this team yet.</p>
            </div>
          ) : (
            roleOrder.map((role) => {
              const players = groupedPlayers[role as keyof typeof groupedPlayers];
              if (!players || players.length === 0) return null;

              return (
                <div key={role} style={{ marginBottom: '24px' }}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: 700, 
                    color: '#64748b', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '8px'
                  }}>
                    {role}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                    {players.map(player => (
                      <div key={player.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '8px 12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #f1f5f9'
                      }}>
                        {player.avatarUrl ? (
                          <img 
                            src={player.avatarUrl} 
                            alt={player.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '32px', height: '32px', 
                            backgroundColor: '#e2e8f0', 
                            borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 600, color: '#64748b'
                          }}>
                            {player.name.charAt(0)}
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {player.name}
                            {player.isCaptain && (
                              <span style={{ 
                                backgroundColor: '#0f172a', color: 'white', 
                                fontSize: '10px', padding: '1px 5px', borderRadius: '4px' 
                              }}>C</span>
                            )}
                            {player.role === 'Wicket Keeper' && (
                              <span style={{ 
                                backgroundColor: '#475569', color: 'white', 
                                fontSize: '10px', padding: '1px 5px', borderRadius: '4px' 
                              }}>WK</span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{player.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
