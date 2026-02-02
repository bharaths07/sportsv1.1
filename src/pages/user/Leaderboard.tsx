import React from 'react';
import { users, matches } from '../../data/mockData';

const Leaderboard: React.FC = () => {
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
    filterSection: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px',
      padding: '15px',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd'
    },
    filterItem: {
      fontWeight: 'bold'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginBottom: '30px'
    },
    th: {
      borderBottom: '2px solid #000',
      textAlign: 'left' as const,
      padding: '10px'
    },
    td: {
      borderBottom: '1px solid #ddd',
      padding: '10px'
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '40px',
      border: '1px dashed #ccc',
      color: '#666'
    }
  };

  // Mock Leaderboard Logic
  // 1. Filter only 'player' type users
  const players = users.filter(u => u.type === 'player');

  // 2. Map to leaderboard rows
  // In a real app, this would aggregate stats. Here we mock it.
  const leaderboardData = players.map((player, index) => {
    // Mock match count (e.g., all matches / number of players)
    const matchCount = Math.floor(matches.length / (index + 1)) + 2; 
    
    // Mock performance text
    const performance = index === 0 ? 'Excellent' : 'Good';

    return {
      id: player.id,
      rank: index + 1,
      name: player.name,
      matches: matchCount,
      performance: performance
    };
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Leaderboard</h1>
        <p>Top performers</p>
      </header>

      <section style={styles.filterSection}>
        <div style={styles.filterItem}>Sport: All</div>
        <div style={styles.filterItem}>Location: Bangalore Urban</div>
        <div style={styles.filterItem}>Time: All Time</div>
      </section>

      {leaderboardData.length > 0 ? (
        <section>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Matches</th>
                <th style={styles.th}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map(row => (
                <tr key={row.id}>
                  <td style={styles.td}>{row.rank}</td>
                  <td style={styles.td}>{row.name}</td>
                  <td style={styles.td}>{row.matches}</td>
                  <td style={styles.td}>{row.performance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <div style={styles.emptyState}>
          Leaderboard data placeholder
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
