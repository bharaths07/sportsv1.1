import React from 'react';
import { matches, teams, sports } from '../../data/mockData';

const Home: React.FC = () => {
  const styles = {
    section: {
      marginBottom: '20px'
    },
    card: {
      border: '1px dashed #999',
      padding: '10px',
      marginBottom: '10px'
    },
    matchInfo: {
      marginBottom: '5px'
    },
    score: {
      fontWeight: 'bold' as const
    },
    sportTag: {
      fontSize: '0.8em',
      backgroundColor: '#eee',
      padding: '2px 6px',
      borderRadius: '4px',
      marginRight: '10px'
    }
  };

  // Helper functions to get names
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const getSportName = (sportId: string) => {
    const sport = sports.find(s => s.id === sportId);
    return sport ? sport.name : 'Unknown Sport';
  };

  // Filter matches
  const liveMatches = matches.filter(m => m.status === 'live');
  const recentMatches = matches.filter(m => m.status === 'completed');

  return (
    <div>
      {/* Header */}
      <header style={styles.section}>
        <h1>Matches around you</h1>
        <p>City / District</p>
      </header>

      {/* Live Matches */}
      <section style={styles.section}>
        <h2>Live Matches</h2>
        {liveMatches.length > 0 ? (
          liveMatches.map(match => (
            <div key={match.id} style={styles.card}>
              <div style={styles.matchInfo}>
                <span style={styles.sportTag}>{getSportName(match.sportId)}</span>
                <span>{getTeamName(match.teamAId)} vs {getTeamName(match.teamBId)}</span>
              </div>
              <div style={styles.score}>
                {match.score || 'Score pending'}
              </div>
            </div>
          ))
        ) : (
          <p>No live matches right now</p>
        )}
      </section>

      {/* Recent Matches */}
      <section style={styles.section}>
        <h2>Recent Matches</h2>
        {recentMatches.length > 0 ? (
          recentMatches.map(match => (
            <div key={match.id} style={styles.card}>
              <div style={styles.matchInfo}>
                <span style={styles.sportTag}>{getSportName(match.sportId)}</span>
                <span>{getTeamName(match.teamAId)} vs {getTeamName(match.teamBId)}</span>
              </div>
              <div style={styles.score}>
                Result: {match.score || 'N/A'}
              </div>
            </div>
          ))
        ) : (
          <p>No recent matches</p>
        )}
      </section>
    </div>
  );
};

export default Home;
