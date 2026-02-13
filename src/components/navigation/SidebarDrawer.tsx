import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, 
  User, 
  PlusCircle, 
  Trophy, 
  Newspaper, 
  LayoutDashboard, 
  BarChart2, 
  Award, 
  Settings, 
  Zap, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Avatar } from '../ui/Avatar';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useGlobalState();

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { label: 'Start a Match', icon: PlusCircle, path: '/start-match', color: 'text-blue-600' },
    { label: 'Start Tournament', icon: Trophy, path: '/tournament/create', color: 'text-purple-600' },
    { label: 'Feed & News', icon: Newspaper, path: '/social', color: 'text-green-600' },
    { label: 'My Game', icon: LayoutDashboard, path: '/home', color: 'text-slate-600' },
    { label: 'Leaderboard', icon: BarChart2, path: '/leaderboards', color: 'text-orange-600' },
    { label: 'Game Legends Awards', icon: Award, path: '/certificates', color: 'text-yellow-600' },
    { label: 'Settings', icon: Settings, path: '/settings', color: 'text-slate-600' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-[320px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header / Profile Section */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Menu</h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div 
            className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-blue-200 transition-colors"
            onClick={() => handleNavigation('/profile/me')}
          >
            <Avatar 
              src={currentUser?.avatarUrl} 
              fallback={currentUser?.firstName?.charAt(0) || 'U'} 
              className="w-12 h-12 border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate">
                {currentUser?.name || 'Guest User'}
              </p>
              <p className="text-xs text-slate-500 truncate">View Profile</p>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-all group"
            >
              <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-slate-900">
                {item.label}
              </span>
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-50 active:bg-red-100 transition-all group mt-2 border-t border-slate-100"
          >
            <div className="p-2 rounded-lg bg-red-50 group-hover:bg-white group-hover:shadow-sm transition-all text-red-600">
              <LogOut size={20} />
            </div>
            <span className="font-medium text-slate-700 group-hover:text-red-700">
              Log Out
            </span>
          </button>
        </div>

        {/* Footer / Upgrade Plan */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => handleNavigation('/pricing')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/20">
                <Zap size={18} className="text-yellow-300" fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Upgrade Plan</p>
                <p className="text-xs text-blue-100">Unlock all features</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/70" />
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            v1.0.0 • Play Legends
          </p>
        </div>

      </div>
    </div>
  );
};
