import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matches, teams, sports } from '../../data/mockData';
import { Match } from '../../types/models';

const LiveScoring: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (matchId) {
      const foundMatch = matches.find(m => m.id === matchId);
      if (foundMatch) {
        setMatch(foundMatch);
      }
    }
  }, [matchId]);

  const handleEndMatch = () => {
    if (match) {
      // Update in-memory match object
      match.status = 'completed';
      match.score = match.score === '0 - 0' ? 'Match Ended (No Score)' : match.score; 
      // In a real app with immutable state, we'd update the store properly. 
      // Here we mutate the object in the mock array directly.
      
      // Navigate to Summary
      navigate(`/match-summary/${match.id}`);
    }
  };

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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
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
      gap: '10px',
      marginTop: '20px'
    },
    button: {
      padding: '10px 20px',
      cursor: 'pointer',
      border: '1px solid #999',
      backgroundColor: 'transparent',
      borderRadius: '4px'
    },
    primaryButton: {
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '#dc3545',
        color: 'white',
        borderRadius: '4px'
    }
  };

  if (!match) {
      return <div style={styles.container}>Match not found or no match selected.</div>;
  }

  const teamA = teams.find(t => t.id === match.teamAId);
  const teamB = teams.find(t => t.id === match.teamBId);
  const sport = sports.find(s => s.id === match.sportId);

  return (
    <div style={styles.container}>
      {/* 1. Page Header */}
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>
            {teamA ? teamA.name : 'Team A'} vs {teamB ? teamB.name : 'Team B'}
          </h1>
          <div style={{ color: '#666' }}>{sport ? sport.name : 'Sport'}</div>
        </div>
        <div>
          <strong>Status: </strong> 
          <span style={{ color: 'green', fontWeight: 'bold' }}>{match.status.toUpperCase()}</span>
        </div>
      </header>

      {/* 2. Score Summary Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Score Summary</span>
        <div style={{ fontSize: '2em', textAlign: 'center', padding: '20px' }}>
            {match.score || '0 - 0'}
        </div>
      </section>

      {/* 3. Match Info Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Match Info</span>
        <div><strong>Sport:</strong> {sport ? sport.name : 'Unknown'}</div>
        <div><strong>Venue:</strong> {match.location}</div>
        <div><strong>Date:</strong> {new Date(match.date).toLocaleDateString()}</div>
      </section>

      {/* 4. Scoring Area */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Scoring Controls</span>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
            (Scoring interface placeholder)
        </div>
      </section>

      {/* 5. Timeline / Events Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Timeline / Events</span>
        <div>Match Started</div>
      </section>

      {/* 6. Action Section */}
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => alert('Undo not implemented')}>Undo</button>
        <button style={styles.primaryButton} onClick={handleEndMatch}>End Match</button>
      </div>
    </div>
  );
};

export default LiveScoring;
