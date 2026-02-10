import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Avatar } from '../ui/Avatar';
import { X, Settings, LogOut, ChevronRight, Trophy, PlayCircle, PlusCircle, Zap } from 'lucide-react';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useGlobalState();

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Backdrop - Closes on click */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', // Slightly darker for focus
          zIndex: 40,
          backdropFilter: 'blur(1px)', // Subtle blur for calm focus
        }}
        onClick={onClose}
      />
      
      {/* Sidebar Panel - Fixed Layout */}
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '320px',
          height: '100vh',
          backgroundColor: 'var(--bg-surface)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        }}
      >
        {/* 1. User Identity (Header) - Anchor & Trust */}
        <div 
          style={{
            height: '72px', // Taller for comfortable click target
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid var(--border-default)',
            flexShrink: 0,
          }}
        >
          <Link 
            to="/profile" 
            onClick={onClose}
            className="flex items-center gap-3 flex-1 group"
          >
             <Avatar
              src={currentUser?.avatarUrl || currentUser?.profilePhoto}
              fallback={currentUser?.firstName?.charAt(0) || 'G'}
              className="w-10 h-10 bg-primary text-white font-semibold text-sm shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate max-w-[160px]">
                {currentUser?.name || 'Guest User'}
              </span>
              <span className="text-xs text-text-secondary group-hover:text-primary/80 flex items-center transition-colors">
                View Profile <ChevronRight size={12} className="ml-0.5" />
              </span>
            </div>
          </Link>
          
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-text-muted hover:text-text-primary rounded-full hover:bg-muted transition-colors"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          
          {/* 2. Primary Actions (High Importance) */}
          <div className="py-6 border-b border-border">
            <div className="px-6 mb-3">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Create
              </h4>
            </div>
            <div className="space-y-1 px-3">
              <ActionItem 
                icon={<PlayCircle size={18} />} 
                label="Start Match" 
                path="/start-match" 
                onClick={onClose}
                highlight
              />
              <ActionItem 
                icon={<Trophy size={18} />} 
                label="Create Tournament" 
                path="/tournament/create" 
                onClick={onClose}
                highlight
              />
              <ActionItem 
                icon={<PlusCircle size={18} />} 
                label="Create Team" 
                path="/team/create" 
                onClick={onClose}
                highlight
              />
            </div>
          </div>

          {/* 3. Personal Shortcuts (Medium Importance) */}
          <div className="py-6 border-b border-border">
            <div className="px-6 mb-3">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                My Sports
              </h4>
            </div>
            <div className="space-y-1 px-3">
              <NavItem label="My Matches" path="/my-matches" onClick={onClose} />
              <NavItem label="My Tournaments" path="/saved-tournaments" onClick={onClose} />
              <NavItem label="My Teams" path="/my-teams" onClick={onClose} />
            </div>
          </div>

          {/* 4. Content & Recognition (Low Importance) */}
          <div className="py-6">
            <div className="px-6 mb-3">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Discover
              </h4>
            </div>
            <div className="space-y-1 px-3">
              <NavItem label="News & Announcements" path="/news" onClick={onClose} />
              <NavItem label="Awards & Legends" path="/awards" onClick={onClose} />
            </div>
          </div>
        </div>

        {/* 5. System Actions (Footer) - Sticky Bottom */}
        <div className="mt-auto border-t border-border bg-bg-surface/50">
          <div className="p-4 space-y-1">
            <NavItem 
              label="Settings" 
              path="/settings" 
              icon={<Settings size={16} />} 
              onClick={onClose} 
            />
            <NavItem 
              label="Upgrade Plan" 
              path="/upgrade" 
              icon={<Zap size={16} />} 
              onClick={onClose} 
            />
            <button 
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2"
              onClick={() => {
                // Handle logout logic here
                onClose();
              }}
            >
              <LogOut size={16} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Helper Components
const ActionItem = ({ icon, label, path, onClick, highlight }: { icon: React.ReactNode, label: string, path: string, onClick: () => void, highlight?: boolean }) => {
  return (
    <Link 
      to={path} 
      onClick={onClick}
      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all group
        ${highlight 
          ? 'text-text-primary hover:bg-primary/5 hover:text-primary' 
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted'
        }`}
    >
      <span className={`mr-3 ${highlight ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
};

const NavItem = ({ label, path, icon, onClick }: { label: string, path: string, icon?: React.ReactNode, onClick: () => void }) => {
  return (
    <Link 
      to={path} 
      onClick={onClick}
      className="flex items-center px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors"
    >
      {icon && <span className="mr-3 text-text-muted">{icon}</span>}
      {!icon && <span className="w-4 mr-3"></span>} {/* Indent for alignment */}
      {label}
    </Link>
  );
};
