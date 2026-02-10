import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Input } from '../ui/Input';

interface TopNavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const { currentUser } = useGlobalState();

  return (
    <header 
      className="sticky top-0 z-40 bg-surface border-b border-border h-16"
    >
      <div 
        className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }} 
            />
            <span className="text-xl font-bold tracking-tight text-text-primary group-hover:text-primary transition-colors">PlayLegends</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
             <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-primary bg-blue-50/50' : 'text-text-secondary hover:text-text-primary hover:bg-muted'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/matches" 
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-primary bg-blue-50/50' : 'text-text-secondary hover:text-text-primary hover:bg-muted'}`
              }
            >
              Matches
            </NavLink>
            <NavLink 
              to="/tournaments" 
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-primary bg-blue-50/50' : 'text-text-secondary hover:text-text-primary hover:bg-muted'}`
              }
            >
              Tournaments
            </NavLink>
            <NavLink 
              to="/teams" 
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-primary bg-blue-50/50' : 'text-text-secondary hover:text-text-primary hover:bg-muted'}`
              }
            >
              Teams
            </NavLink>
            <NavLink 
              to="/stats" 
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-primary bg-blue-50/50' : 'text-text-secondary hover:text-text-primary hover:bg-muted'}`
              }
            >
              Stats
            </NavLink>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-muted hover:bg-muted rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-surface"></span>
          </button>
          
          <div className="flex items-center pl-2 border-l border-border">
            <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-text-primary">{currentUser?.name || 'Guest'}</div>
                <div className="text-xs text-text-muted">View Profile</div>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-text-muted hover:text-text-primary"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
