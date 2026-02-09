import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Avatar } from './ui/Avatar';
import './Layout.css';

const Layout: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useUser();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout-container">
      {/* 1. TOP BAR */}
      <div className="top-bar">
        <div className="brand-section">
          <Link to="/home" className="brand-logo" style={{ textDecoration: 'none', fontWeight: 800, fontSize: '20px', color: 'var(--text-primary)' }}>
            SPORT<span style={{ color: 'var(--brand-accent)' }}>SYNC</span>
          </Link>
        </div>

        <div className="nav-links" style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Link to="/home" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }} className={isActive('/home')}>Home</Link>
          <Link to="/my-teams" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }} className={isActive('/my-teams')}>My Teams</Link>
          <Link to="/start-match" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }} className={isActive('/start-match')}>Play</Link>
        </div>

        <div className="top-actions" style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div className="action-icon">SEARCH</div>
          <div className="action-icon">NOTIFICATIONS</div>
        </div>
      </div>

      <div className="body-container">
        {/* 2. LEFT SIDEBAR */}
        <aside className="sidebar">
          
          {/* Profile Section */}
          <Link to="/profile" style={{ textDecoration: 'none', display: 'block', marginBottom: 'var(--space-5)' }}>
            <div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Avatar 
                src={currentUser?.profilePhoto} 
                alt="Profile"
                fallback={currentUser ? currentUser.name.charAt(0) : 'G'}
                className="w-10 h-10 rounded-full bg-slate-200"
              />
              <div className="profile-info">
                <h3 style={{ fontSize: '14px', margin: 0, color: 'var(--text-primary)' }}>{currentUser ? currentUser.name : 'Guest'}</h3>
                <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-secondary)' }}>{currentUser ? currentUser.type : 'Viewer'}</p>
              </div>
            </div>
          </Link>
          
          {/* Primary Actions */}
          <div className="sidebar-group" style={{ marginBottom: 'var(--space-5)' }}>
            <div className="group-title" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 'var(--space-2)', letterSpacing: '0.5px' }}>QUICK ACTIONS</div>
            <Link to="/tournament/create" style={{ display: 'block', padding: '8px 0', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px' }}>
              🏆 Start Tournament
            </Link>
            <Link to="/start-match" style={{ display: 'block', padding: '8px 0', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px' }}>
              Start Match
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="sidebar-group" style={{ marginBottom: 'var(--space-5)' }}>
            <div className="group-title" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 'var(--space-2)', letterSpacing: '0.5px' }}>MAIN MENU</div>
            {['Home', 'My Teams', 'Leaderboard', 'Certificates', 'News Feed'].map(item => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-')}`} 
                style={{ display: 'block', padding: '8px 0', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px' }}
              >
                {item}
              </Link>
            ))}
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
