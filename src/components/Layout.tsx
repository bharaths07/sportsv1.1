import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Layout.css';

const Layout: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useUser();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout-container">
      {/* 1. TOP BAR (Floating Glass) */}
      <div className="top-bar">
        <div className="brand-section">
          <Link to="/home" className="brand-logo">
            SPORT<span style={{ color: 'var(--color-neon-orange)' }}>SYNC</span>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/home" className={`nav-link ${isActive('/home')}`}>Home</Link>
          <Link to="/my-teams" className={`nav-link ${isActive('/my-teams')}`}>My Teams</Link>
          <Link to="/start-match" className={`nav-link ${isActive('/start-match')}`}>Play</Link>
        </div>

        <div className="top-actions">
          <div className="action-icon">SEARCH</div>
          <div className="action-icon">NOTIFICATIONS</div>
        </div>
      </div>

      <div className="body-container">
        {/* 2. LEFT SIDEBAR (Floating Glass) */}
        <aside className="sidebar">
          
          {/* Profile Section */}
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div className="profile-card">
              <div className="profile-avatar">
                {currentUser?.profilePhoto ? (
                  <img 
                    src={currentUser.profilePhoto} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                  />
                ) : (
                  // Fallback initials or default
                  currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'
                )}
              </div>
              <div className="profile-info">
                <h3>{currentUser ? currentUser.name : 'Guest'}</h3>
                <p>{currentUser ? currentUser.type : 'Viewer'}</p>
              </div>
            </div>
          </Link>
          
          {/* Primary Actions */}
          <div className="sidebar-group">
            <div className="group-title">QUICK ACTIONS</div>
            <Link to="/tournament/create" className={`sidebar-link ${isActive('/tournament/create')}`}>
              🏆 START TOURNAMENT / SERIES
            </Link>
            <Link to="/start-match" className={`sidebar-link ${isActive('/start-match')}`}>
              Start Match
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="sidebar-group">
            <div className="group-title">MAIN MENU</div>
            <Link to="/home" className={`sidebar-link ${isActive('/home')}`}>
              Home
            </Link>
            <Link to="/my-teams" className={`sidebar-link ${isActive('/my-teams')}`}>
              My Teams
            </Link>
            <Link to="/leaderboard" className={`sidebar-link ${isActive('/leaderboard')}`}>
              Leaderboard
            </Link>
            <Link to="/certificates" className={`sidebar-link ${isActive('/certificates')}`}>
              Certificates
            </Link>
            <Link to="/news-feed" className={`sidebar-link ${isActive('/news-feed')}`}>
              News Feed
            </Link>
          </div>

          {/* Sports Section */}
          <div className="sidebar-group">
            <div className="group-title">SPORTS</div>
            <div className="sidebar-link">Cricket</div>
            <div className="sidebar-link">Kabaddi</div>
            <div className="sidebar-link">Football</div>
          </div>

        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
