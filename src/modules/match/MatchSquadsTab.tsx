import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../../domain/match';
import { useGlobalState } from '../../app/AppProviders';

interface Props {
  match: Match;
}

export const MatchSquadsTab: React.FC<Props> = ({ match }) => {
  const navigate = useNavigate();
  const { players, teams } = useGlobalState();
  
  // Initialize with team batting in the latest innings (or home if match just started)
  const initialTeamId = match.currentBattingTeamId || match.homeParticipant.id;
  const [activeTeamId, setActiveTeamId] = useState(initialTeamId);

  // Helper to get team details
  const getTeamDetails = (participantId: string) => {
    // Participant ID in Match might be Team ID. 
    // In current data structure, homeParticipant.id IS the Team ID.
    return {
      id: participantId,
      name: participantId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name,
      participant: participantId === match.homeParticipant.id ? match.homeParticipant : match.awayParticipant
    };
  };

  const activeTeam = getTeamDetails(activeTeamId);
  const homeTeam = getTeamDetails(match.homeParticipant.id);
  const awayTeam = getTeamDetails(match.awayParticipant.id);

  // Helper to find Captain/WK roles from Global Team Data
  // (Assuming Team ID matches Participant ID)
  const teamData = teams.find(t => t.id === activeTeamId);

  const getPlayerRoleBadge = (playerId: string) => {
    const p = players.find(x => x.id === playerId);
    if (!p || !p.role) return null;
    
    const roleMap: Record<string, string> = {
        'Batsman': 'BAT',
        'Bowler': 'BOWL',
        'All-Rounder': 'AR',
        'Wicket Keeper': 'WK'
    };
    return roleMap[p.role] || p.role.substring(0, 3).toUpperCase();
  };

  const getPlayerLeadership = (playerId: string) => {
    if (!teamData) return null;
    const member = teamData.members.find(m => m.playerId === playerId);
    if (member?.role === 'captain') return 'C';
    // WK is usually a skill role, not leadership, but sometimes marked similarly in UI.
    // We'll use the Player.role for WK, and Team.members for Captain.
    return null;
  };

  const getPlayerDetails = (playerId: string) => {
      return players.find(p => p.id === playerId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Team Switcher */}
      <div style={{ 
          display: 'flex', 
          backgroundColor: '#f1f5f9', 
          borderRadius: '8px', 
          padding: '4px',
          marginBottom: '8px'
      }}>
          <button 
              onClick={() => setActiveTeamId(homeTeam.id)}
              style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTeamId === homeTeam.id ? '#ffffff' : 'transparent',
                  color: activeTeamId === homeTeam.id ? '#0f172a' : '#64748b',
                  fontWeight: activeTeamId === homeTeam.id ? 700 : 500,
                  boxShadow: activeTeamId === homeTeam.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
              }}
          >
              {homeTeam.name}
          </button>
          <button 
              onClick={() => setActiveTeamId(awayTeam.id)}
              style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTeamId === awayTeam.id ? '#ffffff' : 'transparent',
                  color: activeTeamId === awayTeam.id ? '#0f172a' : '#64748b',
                  fontWeight: activeTeamId === awayTeam.id ? 700 : 500,
                  boxShadow: activeTeamId === awayTeam.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
              }}
          >
              {awayTeam.name}
          </button>
      </div>

      {/* 2. Playing XI List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
              fontSize: '12px', 
              fontWeight: 700, 
              color: '#64748b', 
              textTransform: 'uppercase', 
              marginBottom: '12px',
              paddingLeft: '4px'
          }}>
              Playing XI
          </div>

          {(activeTeam.participant.players || []).slice(0, 11).map((matchPlayer, index) => {
              const profile = getPlayerDetails(matchPlayer.playerId);
              const leadership = getPlayerLeadership(matchPlayer.playerId);
              const roleBadge = getPlayerRoleBadge(matchPlayer.playerId);
              const isWK = profile?.role === 'Wicket Keeper';

              return (
                  <div 
                      key={matchPlayer.playerId}
                      onClick={() => navigate(`/player/${matchPlayer.playerId}`)}
                      style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '12px 4px', 
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer'
                      }}
                  >
                      {/* Avatar / Index */}
                      <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          backgroundColor: '#e2e8f0', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginRight: '12px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#64748b'
                      }}>
                          {profile ? `${profile.firstName[0]}${profile.lastName[0]}` : index + 1}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                                  {profile ? `${profile.firstName} ${profile.lastName}` : `Player ${index+1}`}
                              </span>
                              
                              {/* Captain / WK Tags */}
                              {leadership === 'C' && (
                                  <span style={{ 
                                      backgroundColor: '#1e293b', color: 'white', 
                                      fontSize: '10px', fontWeight: 700, 
                                      padding: '2px 6px', borderRadius: '4px' 
                                  }}>C</span>
                              )}
                              {isWK && (
                                  <span style={{ 
                                      backgroundColor: '#0f766e', color: 'white', 
                                      fontSize: '10px', fontWeight: 700, 
                                      padding: '2px 6px', borderRadius: '4px' 
                                  }}>WK</span>
                              )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {profile?.battingStyle || 'Right-hand bat'} • {profile?.bowlingStyle || 'Right-arm medium'}
                          </div>
                      </div>

                      {/* Role Badge */}
                      {roleBadge && (
                          <div style={{ 
                              fontSize: '11px', 
                              fontWeight: 700, 
                              color: '#475569', 
                              backgroundColor: '#f1f5f9',
                              padding: '4px 8px', 
                              borderRadius: '100px' 
                          }}>
                              {roleBadge}
                          </div>
                      )}
                  </div>
              );
          })}
          
          {(!activeTeam.participant.players || activeTeam.participant.players.length === 0) && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  No players listed for this team.
              </div>
          )}
      </div>

      {/* 3. Bench (Players beyond 11) */}
      {(activeTeam.participant.players || []).length > 11 && (
        <div style={{ marginTop: '20px' }}>
            <div style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: '#94a3b8', 
                textTransform: 'uppercase', 
                marginBottom: '8px',
                paddingLeft: '4px'
            }}>
                Bench
            </div>
            
            {(activeTeam.participant.players || []).slice(11).map((matchPlayer, index) => {
                const profile = getPlayerDetails(matchPlayer.playerId);

                return (
                    <div 
                        key={matchPlayer.playerId}
                        onClick={() => navigate(`/player/${matchPlayer.playerId}`)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '10px 4px', 
                            borderBottom: '1px solid #f8fafc',
                            cursor: 'pointer',
                            opacity: 0.7 // Muted styling
                        }}
                    >
                        {/* Smaller Avatar */}
                        <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: '#f1f5f9', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#94a3b8'
                        }}>
                            {profile ? `${profile.firstName[0]}${profile.lastName[0]}` : 'B'}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                                {profile ? `${profile.firstName} ${profile.lastName}` : `Player ${index+12}`}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                {profile?.role || 'Substitute'}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      )}
    </div>
  );
};
