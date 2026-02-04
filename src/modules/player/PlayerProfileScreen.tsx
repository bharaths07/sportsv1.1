import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { EmptyState } from '../../components/EmptyState';

import { Certificate } from '../../domain/certificate';

const SPORTS_MAP: Record<string, string> = {
  's1': 'Cricket',
  's2': 'Football'
};

export const PlayerProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { players, matches, teams, achievements, certificates, currentUser } = useGlobalState();
  const player = players.find(p => p.id === id);

  if (!player) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Player not found</div>;
  }

  const isOwnProfile = currentUser?.id === player.id;

  // 1. Calculate Stats & History
  const playerMatches = matches.filter(m => {
    // Check if player is in the detailed players list (completed matches)
    const inHomeStats = m.homeParticipant.players?.some(p => p.playerId === player.id);
    const inAwayStats = m.awayParticipant.players?.some(p => p.playerId === player.id);
    if (inHomeStats || inAwayStats) return true;

    // Fallback: Check team membership
    const homeTeam = teams.find(t => t.id === m.homeParticipant.id);
    const awayTeam = teams.find(t => t.id === m.awayParticipant.id);
    const inHomeTeam = homeTeam?.members.some(mem => mem.playerId === player.id);
    const inAwayTeam = awayTeam?.members.some(mem => mem.playerId === player.id);
    
    return inHomeTeam || inAwayTeam;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const playerAchievements = achievements.filter(a => a.playerId === player.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const playerCertificates = certificates.filter(c => c.playerId === player.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const uniqueTeamIds = new Set<string>();
  playerMatches.forEach(m => {
    const homeTeam = teams.find(t => t.id === m.homeParticipant.id);
    const awayTeam = teams.find(t => t.id === m.awayParticipant.id);
    if (homeTeam?.members.some(mem => mem.playerId === player.id)) uniqueTeamIds.add(homeTeam.id);
    if (awayTeam?.members.some(mem => mem.playerId === player.id)) uniqueTeamIds.add(awayTeam.id);
  });
  
  // Also check current team memberships directly from Teams data
  teams.forEach(t => {
      if (t.members.some(m => m.playerId === player.id)) uniqueTeamIds.add(t.id);
  });

  const primarySport = SPORTS_MAP[player.primarySportId || 's1'] || 'Unknown Sport';
  const institutionName = "Greenwood High"; // Mock for now as per requirements

  const [selectedCertificate, setSelectedCertificate] = React.useState<Certificate | null>(null);

  const handleDownload = (cert: Certificate) => {
    setSelectedCertificate(cert);
  };

  const closeCertificate = () => {
    setSelectedCertificate(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>
      {selectedCertificate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            border: '10px solid #ddd'
          }}>
            <button 
              onClick={closeCertificate}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            
            <div id="printable-certificate">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
              <h1 style={{ fontFamily: 'serif', color: '#1a237e', marginBottom: '10px' }}>{selectedCertificate.title}</h1>
              <p style={{ fontSize: '18px', color: '#666', fontStyle: 'italic', marginBottom: '30px' }}>This certifies that</p>
              
              <h2 style={{ fontSize: '36px', color: '#000', borderBottom: '2px solid #1a237e', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                {player.firstName} {player.lastName}
              </h2>
              
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>{selectedCertificate.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '40px 0', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '20px' }}>
                <div><strong>Match:</strong> {selectedCertificate.metadata.matchName}</div>
                <div><strong>Date:</strong> {new Date(selectedCertificate.date).toLocaleDateString()}</div>
                <div><strong>Sport:</strong> {selectedCertificate.metadata.sportName}</div>
                <div><strong>Location:</strong> {selectedCertificate.metadata.location}</div>
                {selectedCertificate.metadata.teamName && <div><strong>Team:</strong> {selectedCertificate.metadata.teamName}</div>}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'cursive', fontSize: '20px', marginBottom: '5px' }}>{selectedCertificate.metadata.organizerName}</div>
                  <div style={{ fontSize: '12px', borderTop: '1px solid #999', paddingTop: '5px', width: '150px' }}>Organizer</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>SportSync</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Generated by SportSync</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => window.print()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                🖨️ Print / Save as PDF
              </button>
              <button 
                onClick={closeCertificate}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Close
              </button>
            </div>
            
            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-certificate, #printable-certificate * {
                  visibility: visible;
                }
                #printable-certificate {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 20px;
                  border: 5px solid #1a237e;
                }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        marginBottom: '40px', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: '#e3f2fd', 
          color: '#1565c0',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '32px',
          border: '4px solid #fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          {player.firstName[0]}{player.lastName[0]}
        </div>
        <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#1a237e' }}>
            {player.firstName} {player.lastName}
          </h1>
          <div style={{ fontSize: '14px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#1565c0' }}>{primarySport}</span>
            <span style={{ color: '#ccc' }}>|</span>
            <span>{institutionName}</span>
            <span style={{ color: '#ccc' }}>|</span>
            <span style={{ 
              backgroundColor: player.active ? '#e8f5e9' : '#ffebee', 
              color: player.active ? '#2e7d32' : '#c62828',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {player.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* CAREER SNAPSHOT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard label="Matches Played" value={playerMatches.length.toString()} icon="🏏" />
        <StatCard label="Achievements" value={playerAchievements.length.toString()} icon="🏆" />
        <StatCard label="Teams" value={uniqueTeamIds.size.toString()} icon="👕" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        {/* MATCH HISTORY */}
        <div>
          <h2 style={{ fontSize: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            Match History
          </h2>
          {playerMatches.length === 0 ? (
            <EmptyState message="No matches played yet." icon="🏏" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {playerMatches.map(match => {
                 // Determine player's team and result
                 const homeTeam = teams.find(t => t.id === match.homeParticipant.id);
                 const awayTeam = teams.find(t => t.id === match.awayParticipant.id);
                 
                 let myTeamId = '';
                 let opponentName = '';

                 // Check detailed stats first
                 const inHomeStats = match.homeParticipant.players?.some(p => p.playerId === player.id);
                 const inAwayStats = match.awayParticipant.players?.some(p => p.playerId === player.id);
                 
                 if (inHomeStats) {
                    myTeamId = match.homeParticipant.id;
                    opponentName = match.awayParticipant.name;
                 } else if (inAwayStats) {
                    myTeamId = match.awayParticipant.id;
                    opponentName = match.homeParticipant.name;
                 } else {
                    // Fallback to membership
                     if (homeTeam?.members.some(m => m.playerId === player.id)) {
                        myTeamId = match.homeParticipant.id;
                        opponentName = match.awayParticipant.name;
                     } else if (awayTeam?.members.some(m => m.playerId === player.id)) {
                        myTeamId = match.awayParticipant.id;
                        opponentName = match.homeParticipant.name;
                     }
                 }

                 let result = 'Pending';
                 let resultColor = '#757575';
                 
                 if (match.status === 'completed') {
                    if (!match.winnerId) {
                        result = 'Draw';
                        resultColor = '#f57c00';
                    } else if (match.winnerId === myTeamId) {
                        result = 'Win';
                        resultColor = '#2e7d32';
                    } else {
                        result = 'Loss';
                        resultColor = '#c62828';
                    }
                 } else {
                     result = match.status; // Live or Scheduled
                     resultColor = match.status === 'live' ? '#d32f2f' : '#1976d2';
                 }

                 return (
                   <Link to={`/match/${match.id}`} key={match.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <div style={{ 
                       padding: '15px', 
                       backgroundColor: 'white', 
                       borderRadius: '12px', 
                       border: '1px solid #eee',
                       transition: 'transform 0.2s',
                       display: 'flex',
                       justifyContent: 'space-between',
                       alignItems: 'center'
                     }}>
                       <div>
                         <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>
                           {new Date(match.date).toLocaleDateString()}
                         </div>
                         <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                           vs {opponentName}
                         </div>
                       </div>
                       <div style={{ 
                         padding: '6px 12px', 
                         borderRadius: '20px', 
                         backgroundColor: resultColor + '20', 
                         color: resultColor,
                         fontWeight: 'bold',
                         fontSize: '14px',
                         textTransform: 'capitalize'
                       }}>
                         {result}
                       </div>
                     </div>
                   </Link>
                 );
              })}
            </div>
          )}
        </div>

        {/* ACHIEVEMENTS & CERTIFICATES */}
        <div>
          <h2 style={{ fontSize: '20px', borderBottom: '2px solid #f57c00', paddingBottom: '10px', marginBottom: '20px' }}>
            Achievements
          </h2>
          
          {playerAchievements.length === 0 ? (
            <EmptyState message="No achievements yet — keep playing!" icon="🏆" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
              {playerAchievements.map(ach => (
                <div key={ach.id} style={{ 
                  padding: '15px', 
                  backgroundColor: ach.type === 'player_of_the_match' ? '#fff8e1' : 'white', 
                  borderLeft: `4px solid ${ach.type === 'player_of_the_match' ? '#f57c00' : '#1976d2'}`,
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: ach.type === 'player_of_the_match' ? '#e65100' : '#0d47a1' }}>
                      {ach.title}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#999' }}>{new Date(ach.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#555' }}>{ach.description}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                      Match: <Link to={`/match/${ach.matchId}`} style={{ color: '#666' }}>View Summary</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CERTIFICATES - PUBLIC LIST, PRIVATE DOWNLOAD */}
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '20px', borderBottom: '2px solid #9c27b0', paddingBottom: '10px', marginBottom: '20px' }}>
              Certificates
            </h2>
            
            {playerCertificates.length === 0 ? (
               <EmptyState message="No certificates awarded yet." icon="📜" />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                {playerCertificates.map(cert => (
                  <div key={cert.id} style={{ 
                    padding: '20px', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #f3e5f5',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', backgroundColor: '#f3e5f5', borderRadius: '0 0 0 40px' }}></div>
                    
                    <div style={{ fontSize: '30px', marginBottom: '10px' }}>📜</div>
                    <div style={{ fontWeight: 'bold', color: '#7b1fa2', marginBottom: '5px' }}>{cert.title}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>{cert.metadata.matchName}</div>
                    
                    {isOwnProfile ? (
                      <button 
                        onClick={() => handleDownload(cert)}
                        style={{ 
                          width: '100%', 
                          padding: '8px', 
                          backgroundColor: '#9c27b0', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }}
                      >
                        Download PDF
                      </button>
                    ) : (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#999', 
                        fontStyle: 'italic', 
                        textAlign: 'center',
                        backgroundColor: '#f5f5f5',
                        padding: '5px',
                        borderRadius: '4px'
                      }}>
                        Awarded {new Date(cert.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '12px', 
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  }}>
    <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>{value}</div>
    <div style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
  </div>
);
