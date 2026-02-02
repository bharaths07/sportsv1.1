import React, { useState, useEffect } from 'react';
import { certificates, matches, sports, teams, users } from '../../data/mockData';
import { Certificate } from '../../types/models';

const Certificates: React.FC = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    },
    header: {
      marginBottom: '30px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '10px'
    },
    section: {
      marginBottom: '30px'
    },
    card: {
      border: '1px solid #ddd',
      padding: '15px',
      marginBottom: '10px',
      cursor: 'pointer',
      backgroundColor: '#fff',
      transition: 'background-color 0.2s',
      borderRadius: '4px'
    },
    activeCard: {
      border: '1px solid #007bff',
      backgroundColor: '#f0f7ff'
    },
    detailsBox: {
      border: '1px solid #ddd',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px'
    },
    detailItem: {
      marginBottom: '10px'
    },
    label: {
      fontWeight: 'bold',
      marginRight: '10px',
      display: 'inline-block',
      width: '120px'
    },
    buttonGroup: {
      marginTop: '20px',
      display: 'flex',
      gap: '15px'
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px'
    },
    secondaryButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: '#333',
        border: '1px solid #999',
        borderRadius: '4px'
    },
    emptyState: {
        color: '#666',
        fontStyle: 'italic'
    }
  };

  // Mock logged-in user: Rahul Kumar (u1)
  const currentUserId = 'u1';
  const currentUser = users.find(u => u.id === currentUserId);
  const userCertificates = certificates.filter(c => c.userId === currentUserId);

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Set initial selected certificate
  useEffect(() => {
    if (userCertificates.length > 0 && !selectedCert) {
      setSelectedCert(userCertificates[0]);
    }
  }, [userCertificates, selectedCert]);

  const getMatchName = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return 'Unknown Match';
    const teamA = teams.find(t => t.id === match.teamAId)?.name || 'Team A';
    const teamB = teams.find(t => t.id === match.teamBId)?.name || 'Team B';
    return `${teamA} vs ${teamB}`;
  };

  const getSportName = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return 'Unknown Sport';
    const sport = sports.find(s => s.id === match.sportId);
    return sport ? sport.name : 'Unknown Sport';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Certificates</h1>
        <p>Achievements for {currentUser ? currentUser.name : 'User'}</p>
      </header>

      <section style={styles.section}>
        <h2>Your Certificates</h2>
        {userCertificates.length > 0 ? (
          userCertificates.map(cert => (
            <div 
              key={cert.id} 
              style={{
                ...styles.card,
                ...(selectedCert?.id === cert.id ? styles.activeCard : {})
              }}
              onClick={() => setSelectedCert(cert)}
            >
              <div style={{ fontWeight: 'bold' }}>{cert.title}</div>
              <div style={{ fontSize: '0.9em', color: '#555' }}>
                {getMatchName(cert.matchId)} - {cert.date}
              </div>
            </div>
          ))
        ) : (
          <p style={styles.emptyState}>No certificates earned yet.</p>
        )}
      </section>

      {selectedCert && (
        <section style={styles.section}>
          <h2>Certificate Details</h2>
          <div style={styles.detailsBox}>
            <div style={styles.detailItem}>
              <span style={styles.label}>Certificate ID:</span>
              <span>{selectedCert.id}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Awarded To:</span>
              <span>{currentUser?.name}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Title:</span>
              <span>{selectedCert.title}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Achievement:</span>
              <span>{selectedCert.achievement}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Sport:</span>
              <span>{getSportName(selectedCert.matchId)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Match:</span>
              <span>{getMatchName(selectedCert.matchId)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Issued Date:</span>
              <span>{selectedCert.date}</span>
            </div>

            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={() => alert(`Downloading certificate: ${selectedCert.title}`)}>Download PDF</button>
              <button style={styles.secondaryButton} onClick={() => alert(`Viewing full certificate: ${selectedCert.id}`)}>View Full</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Certificates;
