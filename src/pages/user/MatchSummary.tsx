import React from 'react';
import { useParams } from 'react-router-dom';
import { matches, teams, sports, certificates } from '../../data/mockData';

const MatchSummary: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  
  // Use matchId from params
  const match = matches.find(m => m.id === matchId);
  
  // Check if current user (u1) has a certificate for this match
  // In a real app, userId would come from auth context
  const currentUserId = 'u1';
  // Note: Certificates might be derived automatically for completed matches in mockData
  // We need to re-fetch/filter from certificates array which might be updated if logic was dynamic
  const userCertificate = certificates.find(c => c.matchId === matchId && c.userId === currentUserId);
  // Also check derived ones if logic in mockData was purely functional without pushing to array, 
  // but in our mockData implementation, we exported a static array combined with derived ones.
  // However, derived ones are calculated at module load time. 
  // If a NEW match is completed, it won't be in the exported 'certificates' array unless we push to it or re-derive.
  
  // For this MVP, let's assume certificates are available if match is completed.
  // We can simulate a certificate availability for ANY completed match for the current user.
  const hasCertificate = match?.status === 'completed';

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    },
    header: {
      borderBottom: '2px solid #333',
      paddingBottom: '15px',
      marginBottom: '20px',
      textAlign: 'center' as const
    },
    section: {
      border: '1px solid #ccc',
      padding: '15px',
      marginBottom: '20px',
      borderRadius: '4px'
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: '10px',
      display: 'block',
      borderBottom: '1px dashed #ccc',
      paddingBottom: '5px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '30px'
    },
    button: {
      padding: '10px 20px',
      cursor: 'pointer',
      border: '1px solid #999',
      backgroundColor: 'transparent',
      fontSize: '16px',
      borderRadius: '4px'
    },
    primaryButton: {
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '16px',
        borderRadius: '4px'
    }
  };

  if (!match) {
      return <div style={styles.container}>Match not found</div>;
  }

  const sport = sports.find(s => s.id === match.sportId);
  const teamA = teams.find(t => t.id === match.teamAId);
  const teamB = teams.find(t => t.id === match.teamBId);

  return (
    <div style={styles.container}>
      {/* 1. Page Header */}
      <header style={styles.header}>
        <h1 style={{ margin: 0, marginBottom: '10px' }}>
            {teamA ? teamA.name : 'Team A'} vs {teamB ? teamB.name : 'Team B'}
        </h1>
        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
            Result: {match.score || 'Completed'}
        </div>
        <div style={{ marginTop: '5px', color: match.status === 'completed' ? 'green' : '#666' }}>
            Status: {match.status.toUpperCase()}
        </div>
      </header>

      {/* 2. Final Score Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Final Score</span>
        <div style={{ fontSize: '1.5em', textAlign: 'center', padding: '10px' }}>
          {match.score}
        </div>
      </section>

      {/* 3. Match Details Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Match Details</span>
        <div>Sport: {sport ? sport.name : 'Unknown Sport'}</div>
        <div>Date: {match.date.replace('T', ' ')}</div>
        <div>Venue: {match.location}</div>
        <div>Type: League Match</div>
      </section>

      {/* 4. Player / Team Performance Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Performance Stats</span>
        <div>{teamA ? teamA.name : 'Team A'}: High intensity gameplay</div>
        <div>{teamB ? teamB.name : 'Team B'}: Good defensive strategy</div>
      </section>

      {/* 5. Timeline / Highlights Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Highlights & Events</span>
        <div>Match completed successfully.</div>
        <div>Winner declared based on points.</div>
      </section>

      {/* 6. Action Section */}
      <div style={styles.buttonGroup}>
        {hasCertificate ? (
             <button 
                style={styles.primaryButton} 
                onClick={() => alert(`Certificate Available!\nFor Match: ${match.id}\nUser: ${currentUserId}`)}
             >
                View Certificate
             </button>
        ) : (
             <button style={{...styles.button, opacity: 0.5, cursor: 'not-allowed'}} disabled>
                No Certificate Available
             </button>
        )}
        <button style={styles.button} onClick={() => window.location.href = '/home'}>Back to Home</button>
      </div>
    </div>
  );
};

export default MatchSummary;
