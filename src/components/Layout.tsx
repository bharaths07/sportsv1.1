import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
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
    navLinks: {
      display: 'flex',
      gap: '20px'
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer'
    },
    bodyContainer: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden'
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
        <Link to="/home" style={{ ...styles.link, fontWeight: 'bold' }}>SportSync</Link>
        <div style={styles.navLinks}>
          <Link to="/home" style={styles.link}>Home</Link>
          <Link to="/my-matches" style={styles.link}>My Game</Link>
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
          <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={styles.profileSection}>
              <div style={{ fontWeight: 'bold' }}>[User Name]</div>
              <div style={{ fontSize: '0.9em', color: '#555' }}>[Email / Phone]</div>
              <div style={{ fontSize: '0.8em', color: '#888', marginTop: '5px' }}>[User Type]</div>
            </div>
          </Link>
          
          {/* Primary Actions */}
          <div style={styles.sidebarGroup}>
            <div style={styles.groupTitle}>ACTIONS</div>
            <div>Upgrade your plan</div>
            <Link to="/start-tournament" style={styles.link}>Start Tournament / Series</Link>
            <Link to="/start-match" style={styles.link}>Start Match</Link>
          </div>

          {/* Navigation Items */}
          <div style={styles.sidebarGroup}>
             <div style={styles.groupTitle}>NAVIGATION</div>
             <Link to="/home" style={styles.link}>Home</Link>
             <Link to="/my-matches" style={styles.link}>My Matches</Link>
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
             <Link to="/leaderboard" style={styles.link}>Leaderboard</Link>
             <Link to="/certificates" style={styles.link}>Certificates</Link>
             <Link to="/news-feed" style={styles.link}>News & Feed</Link>
          </div>

        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main style={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
