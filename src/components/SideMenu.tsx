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
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
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
          {/* SECTION 1 — Personal (Always Visible) */}
          <div className="menu-section">
            <h3 className="section-title">Personal</h3>
            <Link to="/profile" className="menu-item" onClick={onClose}>My Profile</Link>
            <Link to="/saved-matches" className="menu-item" onClick={onClose}>Saved / Followed Matches</Link>
          </div>

          {/* SECTION 2 — Creation / Management (Role-Based) */}
          {isOrganizer && (
            <div className="menu-section">
              <h3 className="section-title">Management</h3>
              <Link to="/create-match" className="menu-item" onClick={onClose}>Create Match</Link>
              <Link to="/manage-matches" className="menu-item" onClick={onClose}>Manage Matches</Link>
              <Link to="/venues" className="menu-item" onClick={onClose}>Venues</Link>
              <Link to="/officials" className="menu-item" onClick={onClose}>Officials / Scorers</Link>
            </div>
          )}

          {/* SECTION 3 — System (Always Visible) */}
          <div className="menu-section">
            <h3 className="section-title">System</h3>
            <Link to="/notifications" className="menu-item" onClick={onClose}>Notifications</Link>
            <Link to="/settings" className="menu-item" onClick={onClose}>Settings</Link>
            <Link to="/help" className="menu-item" onClick={onClose}>Help / Support</Link>
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
