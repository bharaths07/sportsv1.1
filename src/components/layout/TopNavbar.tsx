import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Avatar } from '../ui/Avatar';

import { Input } from '../ui/Input';

interface TopNavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const { currentUser } = useGlobalState();

  return (
    <header 
      style={{ 
        borderBottom: '1px solid var(--border-default)', 
        background: 'var(--bg-surface)', 
      }}
    >
      <div 
        style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
        }}
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-text-muted hover:text-text-primary"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden lg:flex items-center gap-2 mr-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">SportSync</span>
          </div>

          <nav style={{ display: 'flex', gap: 'var(--space-4)' }} className="hidden md:flex">
             <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/matches" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`
              }
            >
              Matches
            </NavLink>
            <NavLink 
              to="/tournaments" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`
              }
            >
              Tournaments
            </NavLink>
            <NavLink 
              to="/teams" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`
              }
            >
              Teams
            </NavLink>
            <NavLink 
              to="/stats" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`
              }
            >
              Stats
            </NavLink>
          </nav>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }} className="items-center">
          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden md:block w-64">
            <Input 
              placeholder="Search..." 
              startIcon={<Search size={16} className="text-text-muted" />}
              className="h-9 bg-muted border-none focus-visible:ring-primary/20"
            />
          </div>

          <button className="relative p-2 text-text-muted hover:bg-muted rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-2 pl-2">
            <Link to="/profile">
              <Avatar
                src={currentUser?.avatarUrl || currentUser?.profilePhoto}
                fallback={currentUser?.firstName?.charAt(0) || 'G'}
                className="w-8 h-8 bg-primary-light text-primary font-semibold text-sm"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
