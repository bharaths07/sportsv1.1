import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';

export const MatchSummaryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { matches, achievements, players, certificates } = useGlobalState();
  const match = matches.find(m => m.id === id);

  if (!match) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Match not found</h2>
        <Link to="/" style={{ color: '#007bff' }}>Return Home</Link>
      </div>
    );
  }

  const matchAchievements = achievements.filter(a => a.matchId === match.id);
  const potm = matchAchievements.find(a => a.type === 'player_of_the_match');
  const otherAchievements = matchAchievements.filter(a => a.type !== 'player_of_the_match');

  const matchCertificates = certificates.filter(c => c.matchId === match.id);
  const participationCount = matchCertificates.filter(c => c.type === 'participation').length;
  const achievementCertificates = matchCertificates.filter(c => c.type === 'achievement');

  const homeScore = match.homeParticipant.score || 0;
  const awayScore = match.awayParticipant.score || 0;
  const homeWickets = match.homeParticipant.wickets || 0;
  const awayWickets = match.awayParticipant.wickets || 0;

  let resultText = "Match Drawn";
  if (match.winnerId) {
    const winnerName = match.winnerId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name;
    const runDiff = Math.abs(homeScore - awayScore);
    resultText = `${winnerName} won by ${runDiff} runs`;
  }

  // Mock Officials for now
  const organizerName = "Rahul Kumar"; 
  const scorerName = "Rahul Kumar";

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.firstName + ' ' + players.find(p => p.id === playerId)?.lastName || 'Unknown Player';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>← Back to Home</Link>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        {/* Status Banner */}
        <div style={{ backgroundColor: '#2e7d32', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }}>
          {match.status.toUpperCase()}
        </div>

        <div style={{ padding: '30px', textAlign: 'center' }}>
          {/* Teams */}
          <div style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
            {match.homeParticipant.name} vs {match.awayParticipant.name}
          </div>

          {/* Big Score */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', color: '#888' }}>{match.homeParticipant.name}</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{homeScore}/{homeWickets}</div>
             </div>
             <div style={{ fontSize: '24px', color: '#ccc' }}>-</div>
             <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', color: '#888' }}>{match.awayParticipant.name}</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{awayScore}/{awayWickets}</div>
             </div>
          </div>

          {/* Official Result */}
          <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', color: '#2e7d32', fontWeight: 'bold', fontSize: '18px', marginBottom: '30px' }}>
            🏆 {resultText}
          </div>

          {/* Achievements Section */}
          {matchAchievements.length > 0 && (
            <div style={{ marginBottom: '30px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#d32f2f' }}>Match Honours</h3>
              
              {/* POTM Card */}
              {potm && (
                <div style={{ 
                  backgroundColor: '#fff8e1', 
                  border: '1px solid #ffe0b2', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{ fontSize: '30px' }}>⭐</div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#f57c00', fontWeight: 'bold', textTransform: 'uppercase' }}>Player of the Match</div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{getPlayerName(potm.playerId)}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{potm.description}</div>
                  </div>
                </div>
              )}

              {/* Other Achievements */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {otherAchievements.map(ach => (
                  <div key={ach.id} style={{ 
                    border: '1px solid #eee', 
                    borderRadius: '8px', 
                    padding: '10px',
                    fontSize: '13px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#1976d2' }}>{ach.title}</div>
                    <div>{getPlayerName(ach.playerId)}</div>
                    <div style={{ color: '#888', fontSize: '11px' }}>{ach.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Awarded Section */}
          {matchCertificates.length > 0 && (
              <div style={{ marginBottom: '30px', textAlign: 'left', backgroundColor: '#fafafa', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '16px', borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#666', marginTop: 0 }}>
                      Certificates Awarded
                  </h3>
                  <div style={{ fontSize: '14px', color: '#444' }}>
                      <div style={{ marginBottom: '5px' }}>📜 <strong>{participationCount}</strong> Participation Certificates issued.</div>
                      {achievementCertificates.length > 0 && (
                          <div style={{ marginTop: '10px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Performance Certificates:</div>
                              <ul style={{ margin: '0', paddingLeft: '20px', color: '#555' }}>
                                  {achievementCertificates.map(c => (
                                      <li key={c.id}>
                                          {c.title} - {getPlayerName(c.playerId)}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {/* Match Details (Trust Section) */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'left' }}>
             <h3 style={{ fontSize: '14px', color: '#999', textTransform: 'uppercase', marginBottom: '15px' }}>Official Match Record</h3>
             
             <div style={detailRow}>
               <span style={labelStyle}>Date</span>
               <span>{new Date(match.date).toLocaleDateString()} {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
             </div>
             <div style={detailRow}>
               <span style={labelStyle}>Location</span>
               <span>{match.location}</span>
             </div>
             <div style={detailRow}>
               <span style={labelStyle}>Organizer</span>
               <span>{organizerName}</span>
             </div>
             <div style={detailRow}>
               <span style={labelStyle}>Official Scorer</span>
               <span>{scorerName}</span>
             </div>
             <div style={detailRow}>
               <span style={labelStyle}>Match ID</span>
               <span style={{ fontFamily: 'monospace', color: '#888' }}>{match.id}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
  fontSize: '14px',
  color: '#333'
};

const labelStyle = {
  color: '#888',
  fontWeight: '500'
};
