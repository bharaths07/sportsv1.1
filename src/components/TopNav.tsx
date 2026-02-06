import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalState } from '../app/AppProviders';
import './TopNav.css';

import { SideMenu } from './SideMenu';
import { GlobalSearch } from './GlobalSearch';

export const TopNav: React.FC = () => {
  const { currentUser } = useGlobalState();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <>
      <nav className="top-nav">
        {/* 1. Brand (Far Left) - Identity & Reset */}
        <div className="nav-left">
          <Link to="/" className="nav-brand">
            SPORTSYNC
          </Link>
        </div>

        {/* 2. Primary Sections (Center) - Destinations Only */}
        <div className="nav-center">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/matches" className={isActive('/matches')}>Matches</Link>
          <Link to="/tournaments" className={isActive('/tournaments')}>Tournaments</Link>
          <Link to="/teams" className={isActive('/teams')}>Teams</Link>
          <Link to="/stats" className={isActive('/stats')}>Stats</Link>
        </div>

        {/* 3. Utilities (Far Right) - Global Utilities */}
        <div className="nav-right">
          <button className="icon-btn" aria-label="Search" onClick={() => setShowSearch(true)}>
            <span className="material-icon">🔍</span>
          </button>
          
          <button className="icon-btn" aria-label="Notifications">
            <span className="material-icon">🔔</span>
          </button>

          <div className="avatar-container" onClick={() => setShowMenu(true)}>
            <div className="avatar-circle">
              {currentUser ? (
                <span>{currentUser.firstName.charAt(0).toUpperCase()}</span>
              ) : (
                <span>👤</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Menu Overlay */}
      <SideMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />

      {/* Global Search Overlay */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};
