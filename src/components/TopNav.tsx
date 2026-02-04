import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../app/AppProviders';
import './TopNav.css';
import { LoginModal } from './LoginModal';

export const TopNav: React.FC = () => {
  const { matches, currentUser, logout } = useGlobalState();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Live Awareness
  const liveMatchesCount = matches.filter(m => m.status === 'live').length;

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser) {
      navigate('/create-match');
    }
    // If not logged in, button shouldn't be visible per spec, 
    // but safe handling: do nothing or show login
  };

  const handleLoginClick = () => {
    setShowMenu(false);
    setShowLoginModal(true);
  };

  const handleLogoutClick = () => {
    logout();
    setShowMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav className="top-nav">
        {/* 1. Left Section - Brand */}
        <Link to="/" className="nav-brand">
          SPORTSYNC
        </Link>

        {/* 2. Center Section - Live Awareness */}
        <div className="nav-center">
          <Link to="/" className="live-status-link">
            {liveMatchesCount > 0 ? (
              <span className="live-active">
                <span className="live-dot"></span>
                LIVE · {liveMatchesCount} Match{liveMatchesCount !== 1 ? 'es' : ''}
              </span>
            ) : (
              <span className="live-inactive">No Live Matches</span>
            )}
          </Link>
        </div>

        {/* 3. Right Section - Primary Action & Avatar */}
        <div className="nav-right">
          {/* Primary Action - Only for Organizers (Logged in) */}
          {currentUser && (
            <Link to="/create-match" className="primary-action-btn">
              + Create Match
            </Link>
          )}

          {/* User Avatar / Hamburger */}
          <div className="avatar-container" onClick={() => setShowMenu(!showMenu)}>
            <div className="avatar-circle">
              {currentUser ? (
                <span>{currentUser.name.charAt(0).toUpperCase()}</span>
              ) : (
                <span>👤</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hamburger Menu Overlay */}
      {showMenu && (
        <>
          <div className="menu-overlay" onClick={() => setShowMenu(false)}></div>
          <div className="nav-menu">
            <div className="menu-header">
              {currentUser ? (
                <>
                  <strong>{currentUser.name}</strong>
                  <span className="user-role">Organizer</span>
                </>
              ) : (
                <strong>Guest Viewer</strong>
              )}
            </div>
            <ul className="menu-list">
              <li><Link to="/" onClick={() => setShowMenu(false)}>Home</Link></li>
              {currentUser && (
                <>
                  <li><Link to="/my-certificates" onClick={() => setShowMenu(false)}>My Certificates</Link></li>
                  <li><Link to="/create-match" onClick={() => setShowMenu(false)}>Create Match</Link></li>
                  <li className="menu-divider"></li>
                  <li><button onClick={handleLogoutClick} className="menu-btn danger">Logout</button></li>
                </>
              )}
              {!currentUser && (
                <li><button onClick={handleLoginClick} className="menu-btn primary">Login as Organizer</button></li>
              )}
            </ul>
          </div>
        </>
      )}

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        message="Login to manage matches"
      />
    </>
  );
};
