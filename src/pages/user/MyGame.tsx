import React from 'react';

const MyGame: React.FC = () => {
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
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <header style={styles.header}>
        <h1>My Game</h1>
        <p>Matches you created, scored, or played</p>
      </header>

      {/* Live Matches Section */}
      <section style={styles.section}>
        <h2>Live</h2>
        <div style={styles.card}>My live match placeholder</div>
        <div style={styles.card}>My live match placeholder</div>
      </section>

      {/* Upcoming Matches Section */}
      <section style={styles.section}>
        <h2>Upcoming</h2>
        <div style={styles.card}>Upcoming match placeholder</div>
        <div style={styles.card}>Upcoming match placeholder</div>
      </section>

      {/* Completed Matches Section */}
      <section style={styles.section}>
        <h2>Completed</h2>
        <div style={styles.card}>Completed match placeholder</div>
        <div style={styles.card}>Completed match placeholder</div>
      </section>
    </div>
  );
};

export default MyGame;
