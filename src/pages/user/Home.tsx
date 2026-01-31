import React from 'react';

const Home: React.FC = () => {
  // Inline styles for skeleton layout structure
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      fontFamily: 'sans-serif'
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid #ccc'
    },
    bodyContainer: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' // Prevent full page scroll, let areas scroll
    },
    sidebar: {
      width: '250px',
      borderRight: '1px solid #ccc',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '30px',
      overflowY: 'auto' as const
    },
    mainContent: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto' as const
    },
    section: {
      marginBottom: '20px'
    },
    card: {
      border: '1px dashed #999',
      padding: '10px',
      marginBottom: '10px'
    },
    sidebarGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px'
    },
    groupTitle: {
      fontWeight: 'bold',
      color: '#666',
      fontSize: '0.9em',
      textTransform: 'uppercase' as const
    },
    profileSection: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '10px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* 1. TOP BAR */}
      <div style={styles.topBar}>
        <div style={{ fontWeight: 'bold' }}>SportSync</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Home</span>
          <span>My Game</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>[Search placeholder]</span>
          <span>[Notification placeholder]</span>
        </div>
      </div>

      <div style={styles.bodyContainer}>
        {/* 2. LEFT SIDEBAR */}
        <aside style={styles.sidebar}>
          
          {/* Profile Section */}
          <div style={styles.profileSection}>
            <div style={{ fontWeight: 'bold' }}>[User Name]</div>
            <div style={{ fontSize: '0.9em', color: '#555' }}>[Email / Phone]</div>
            <div style={{ fontSize: '0.8em', color: '#888', marginTop: '5px' }}>[User Type]</div>
          </div>
          
          {/* Primary Actions */}
          <div style={styles.sidebarGroup}>
            <div style={styles.groupTitle}>ACTIONS</div>
             <div>Upgrade your plan</div>
            <div>Start Tournament / Series</div>
            <div>Start Match</div>
          </div>

          {/* Navigation Items */}
          <div style={styles.sidebarGroup}>
             <div style={styles.groupTitle}>NAVIGATION</div>
             <div>Home</div>
             <div>My Game</div>
          </div>

          {/* Sports Section */}
          <div style={styles.sidebarGroup}>
             <div style={styles.groupTitle}>ALL SPORTS (Dropdown)</div>
             <div style={{ paddingLeft: '10px' }}>Cricket</div>
             <div style={{ paddingLeft: '10px' }}>Kabaddi</div>
             <div style={{ paddingLeft: '10px' }}>Football</div>
          </div>

          {/* Discovery & Records */}
          <div style={styles.sidebarGroup}>
             <div style={styles.groupTitle}>DISCOVERY & RECORDS</div>
             <div>Leaderboard</div>
             <div>Certificates</div>
             <div>News</div>
             <div>Feed</div>
          </div>

        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main style={styles.mainContent}>
          {/* Header */}
          <header style={styles.section}>
            <h1>Matches around you</h1>
            <p>City / District</p>
          </header>

          {/* Live Matches */}
          <section style={styles.section}>
            <h2>Live Matches</h2>
            <div style={styles.card}>Live match card placeholder</div>
            <div style={styles.card}>Live match card placeholder</div>
          </section>

          {/* Recent Matches */}
          <section style={styles.section}>
            <h2>Recent Matches</h2>
            <div style={styles.card}>Recent match card placeholder</div>
            <div style={styles.card}>Recent match card placeholder</div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
