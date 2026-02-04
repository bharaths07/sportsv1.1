import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { EmptyState } from '../../components/EmptyState';

const SPORTS_MAP: Record<string, string> = {
  's1': 'Cricket',
  's2': 'Football'
};

export const TeamScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { teams, matches, players } = useGlobalState();
  const team = teams.find(t => t.id === id);

  if (!team) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Team not found</div>;
  }

  // 1. Stats & History
  const teamMatches = matches.filter(m => 
    m.homeParticipant.id === team.id || m.awayParticipant.id === team.id
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const matchesPlayed = teamMatches.length;
  const matchesWon = teamMatches.filter(m => m.winnerId === team.id).length;
  const sportName = SPORTS_MAP[team.sportId] || 'Unknown Sport';

  // 2. Players (Past & Present)
  // Start with current roster
  const allPlayerIds = new Set<string>();
  
  // Add roster members
  team.members.forEach(m => allPlayerIds.add(m.playerId));

  // Add players from match history (if they played for this team)
  teamMatches.forEach(m => {
    const isHome = m.homeParticipant.id === team.id;
    const participant = isHome ? m.homeParticipant : m.awayParticipant;
    
    if (participant.players) {
        participant.players.forEach(p => allPlayerIds.add(p.playerId));
    }
  });

  const teamPlayers = Array.from(allPlayerIds).map(pid => {
    const playerProfile = players.find(p => p.id === pid);
    const memberInfo = team.members.find(m => m.playerId === pid);
    return {
        id: pid,
        name: playerProfile ? `${playerProfile.firstName} ${playerProfile.lastName}` : 'Unknown Player',
        role: memberInfo ? memberInfo.role : 'Alumni', // If not in current members, assume alumni/guest
        active: playerProfile?.active
    };
  }).sort((a, b) => {
      // Captain first, then members, then alumni
      const rank = (role: string) => {
          if (role === 'captain') return 0;
          if (role === 'vice-captain') return 1;
          if (role === 'member') return 2;
          return 3; 
      };
      return rank(a.role) - rank(b.role);
  });

  const institutionName = "Greenwood High"; // Mock
  const location = "Mumbai, MH"; // Mock

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#666', display: 'inline-block', marginBottom: '20px' }}>
        ← Back to Home
      </Link>

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
          borderRadius: '16px', 
          backgroundColor: '#37474f', 
          color: '#fff',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          {team.name[0]}
        </div>
        <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#263238' }}>
            {team.name}
          </h1>
          <div style={{ fontSize: '14px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#37474f' }}>{institutionName}</span>
            <span style={{ color: '#ccc' }}>|</span>
            <span>📍 {location}</span>
          </div>
        </div>
      </div>

      {/* TEAM SNAPSHOT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard label="Matches Played" value={matchesPlayed.toString()} icon="🏏" />
        <StatCard label="Matches Won" value={matchesWon.toString()} icon="🏆" />
        <StatCard label="Sport" value={sportName} icon="🏅" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        {/* PLAYERS SECTION */}
        <div>
           <h2 style={{ fontSize: '20px', borderBottom: '2px solid #37474f', paddingBottom: '10px', marginBottom: '20px' }}>
             Players (Past & Present)
           </h2>
           
           {teamPlayers.length === 0 ? (
               <EmptyState message="Players will appear after matches." icon="👥" />
           ) : (
               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                   {teamPlayers.map(player => (
                       <Link to={`/player/${player.id}`} key={player.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                           <div style={{ 
                               padding: '12px 15px', 
                               backgroundColor: 'white', 
                               borderRadius: '8px', 
                               border: '1px solid #eee',
                               display: 'flex',
                               justifyContent: 'space-between',
                               alignItems: 'center',
                               transition: 'background-color 0.2s',
                               cursor: 'pointer'
                           }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                   <div style={{ 
                                       width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eceff1', 
                                       display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                                   }}>
                                       👤
                                   </div>
                                   <span style={{ fontWeight: '500' }}>{player.name}</span>
                               </div>
                               <span style={{ 
                                   fontSize: '12px', 
                                   padding: '2px 8px', 
                                   borderRadius: '10px', 
                                   backgroundColor: player.role === 'captain' ? '#fff8e1' : '#f5f5f5',
                                   color: player.role === 'captain' ? '#f57c00' : '#757575',
                                   fontWeight: player.role === 'captain' ? 'bold' : 'normal',
                                   textTransform: 'capitalize'
                               }}>
                                   {player.role}
                               </span>
                           </div>
                       </Link>
                   ))}
               </div>
           )}
        </div>

        {/* MATCH HISTORY */}
        <div>
          <h2 style={{ fontSize: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            Match History
          </h2>
          
          {teamMatches.length === 0 ? (
            <EmptyState message="No matches played yet." icon="🏏" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {teamMatches.map(match => {
                 const isHome = match.homeParticipant.id === team.id;
                 const opponent = isHome ? match.awayParticipant : match.homeParticipant;
                 
                 let result = 'Pending';
                 let resultColor = '#757575';
                 
                 if (match.status === 'completed') {
                    if (!match.winnerId) {
                        result = 'Draw';
                        resultColor = '#f57c00';
                    } else if (match.winnerId === team.id) {
                        result = 'Win';
                        resultColor = '#2e7d32';
                    } else {
                        result = 'Loss';
                        resultColor = '#c62828';
                    }
                 } else {
                     result = match.status;
                     resultColor = match.status === 'live' ? '#d32f2f' : '#1976d2';
                 }

                 return (
                   <Link to={`/match/${match.id}`} key={match.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <div style={{ 
                       padding: '15px', 
                       backgroundColor: 'white', 
                       borderRadius: '12px', 
                       border: '1px solid #eee',
                       display: 'flex',
                       justifyContent: 'space-between',
                       alignItems: 'center'
                     }}>
                       <div>
                         <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>
                           {new Date(match.date).toLocaleDateString()}
                         </div>
                         <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                           vs {opponent.name}
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
