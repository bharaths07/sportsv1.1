import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../app/AppProviders';
import './SideMenu.css';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useGlobalState();

  if (!isOpen) return null;

  const isOrganizer = currentUser?.type === 'organizer';

  return (
    <>
      <div className="side-menu-backdrop" onClick={onClose}></div>
      <div className="side-menu-container">
        
        {/* User Context (Header) - Optional but good for context */}
        {currentUser ? (
          <div className="side-menu-header">
            <div className="user-avatar-large">
              {currentUser.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.firstName} {currentUser.lastName}</div>
              <div className="user-role">{currentUser.type}</div>
            </div>
          </div>
        ) : (
          <div className="side-menu-header">
            <div className="user-info">
              <div className="user-name">Guest</div>
            </div>
          </div>
        )}

        <div className="side-menu-content">
          {/* SECTION 1 — Primary Action */}
          <div className="menu-section">
            <h3 className="section-title">Primary Action</h3>
            <Link to="/tournament/create" className="menu-item" onClick={onClose}>🏆 Start Tournament / Series</Link>
            <Link to="/start-match" className="menu-item" onClick={onClose}>Start Match</Link>
          </div>

          {/* SECTION 2 — Personal */}
          <div className="menu-section">
            <h3 className="section-title">Personal</h3>
            <Link to="/profile" className="menu-item" onClick={onClose}>My Profile</Link>
            <Link to="/profile/cricket/me" className="menu-item" onClick={onClose}>Cricket Profile</Link>
            <Link to="/certificates" className="menu-item" onClick={onClose}>Certificates</Link>
          </div>

          {/* SECTION 3 — Activity */}
          <div className="menu-section">
            <h3 className="section-title">Activity</h3>
            <Link to="/saved-matches" className="menu-item" onClick={onClose}>Saved / Followed Matches</Link>
            <Link to="/saved-tournaments" className="menu-item" onClick={onClose}>Saved Tournaments</Link>
          </div>

          {/* SECTION 4 — Management (Role-Based, excluding Start Match) */}
          {isOrganizer && (
            <div className="menu-section">
              <h3 className="section-title">Management</h3>
              <Link to="/manage-matches" className="menu-item" onClick={onClose}>Manage Matches</Link>
              <Link to="/venues" className="menu-item" onClick={onClose}>Venues</Link>
              <Link to="/officials" className="menu-item" onClick={onClose}>Officials / Scorers</Link>
            </div>
          )}

          {/* SECTION 5 — System */}
          <div className="menu-section">
            <h3 className="section-title">System</h3>
            {currentUser ? (
              <div className="menu-item danger" onClick={() => { logout(); onClose(); }}>Logout</div>
            ) : (
              <Link to="/login" className="menu-item primary" onClick={onClose}>Login</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
