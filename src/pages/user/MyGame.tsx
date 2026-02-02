import React from 'react';
import { matches, teams, sports, users } from '../../data/mockData';

const MyGame: React.FC = () => {
  // 2. Assume current user
  const currentUser = users[0]; // Rahul Kumar (player)

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px',
      borderBottom: '1px solid #000',
      paddingBottom: '10px'
    },
    section: {
      marginBottom: '30px'
    },
    card: {
      border: '1px dashed #000',
      padding: '15px',
      marginBottom: '10px'
    },
    matchInfo: {
      marginBottom: '5px'
    },
    status: {
      fontSize: '0.9em',
      color: '#555',
      fontStyle: 'italic'
    },
    sportTag: {
      fontSize: '0.8em',
      backgroundColor: '#eee',
      padding: '2px 6px',
      borderRadius: '4px',
      marginRight: '10px'
    }
  };

  // Helper functions
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const getSportName = (sportId: string) => {
    const sport = sports.find(s => s.id === sportId);
    return sport ? sport.name : 'Unknown Sport';
  };

  // 3. Page Binding - Filter matches
  // Note: Since data models lack explicit participant/creator links, 
  // we assume the current user is involved in all matches for this mock.
  const myLiveMatches = matches.filter(m => m.status === 'live');
  const myUpcomingMatches = matches.filter(m => m.status === 'upcoming');
  const myCompletedMatches = matches.filter(m => m.status === 'completed');

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <header style={styles.header}>
        <h1>My Game</h1>
        <p>Matches you created, scored, or played</p>
        <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
          Viewing as: {currentUser.name} ({currentUser.type})
        </div>
      </header>

      {/* Live Matches Section */}
      <section style={styles.section}>
        <h2>Live</h2>
        {myLiveMatches.length > 0 ? (
          myLiveMatches.map(match => (
            <div key={match.id} style={styles.card}>
              <div style={styles.matchInfo}>
                <span style={styles.sportTag}>{getSportName(match.sportId)}</span>
                <span>{getTeamName(match.teamAId)} vs {getTeamName(match.teamBId)}</span>
              </div>
              <div style={styles.status}>
                Status: {match.score || 'Live'}
              </div>
            </div>
          ))
        ) : (
          <p>No live matches</p>
        )}
      </section>

      {/* Upcoming Matches Section */}
      <section style={styles.section}>
        <h2>Upcoming</h2>
        {myUpcomingMatches.length > 0 ? (
          myUpcomingMatches.map(match => (
            <div key={match.id} style={styles.card}>
              <div style={styles.matchInfo}>
                <span style={styles.sportTag}>{getSportName(match.sportId)}</span>
                <span>{getTeamName(match.teamAId)} vs {getTeamName(match.teamBId)}</span>
              </div>
              <div style={styles.status}>
                Scheduled: {new Date(match.date).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <p>No upcoming matches</p>
        )}
      </section>

      {/* Completed Matches Section */}
      <section style={styles.section}>
        <h2>Completed</h2>
        {myCompletedMatches.length > 0 ? (
          myCompletedMatches.map(match => (
            <div key={match.id} style={styles.card}>
              <div style={styles.matchInfo}>
                <span style={styles.sportTag}>{getSportName(match.sportId)}</span>
                <span>{getTeamName(match.teamAId)} vs {getTeamName(match.teamBId)}</span>
              </div>
              <div style={styles.status}>
                Result: {match.score || 'Completed'}
              </div>
            </div>
          ))
        ) : (
          <p>No completed matches</p>
        )}
      </section>
    </div>
  );
};

export default MyGame;
