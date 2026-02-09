import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, Users, BarChart2, Activity, Shield, Bookmark, Star } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Matches', path: '/matches', icon: Activity },
  { label: 'Tournaments', path: '/tournaments', icon: Trophy },
  { label: 'Teams', path: '/teams', icon: Users },
  { label: 'Stats', path: '/stats', icon: BarChart2 },
  { label: 'My Teams', path: '/my-teams', icon: Shield },
  { label: 'My Matches', path: '/my-matches', icon: Star },
  { label: 'Saved Matches', path: '/saved-matches', icon: Bookmark },
  { label: 'Saved Tournaments', path: '/saved-tournaments', icon: Bookmark },
  { label: 'Venues', path: '/venues', icon: MapPin },
  { label: 'Officials', path: '/officials', icon: Briefcase },
];


export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-[240px] transform transition-transform duration-200 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:inset-0
    bg-[#0f172a] text-[#cbd5f5] flex flex-col h-screen border-r border-slate-800
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}> 
        {/* Logo */} 
        <div className="px-4 py-5 text-lg font-semibold text-white border-b border-[#1e293b]"> 
          Sportsync 
        </div> 
  
        {/* Navigation */} 
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto"> 
          {navItems.map(item => ( 
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive 
                  ? 'bg-[#1e293b] text-white' 
                  : 'text-[#cbd5f5] hover:bg-[#1e293b]/50 hover:text-white'
                }
              `}
            > 
              <item.icon size={18} className="mr-3" />
              {item.label} 
            </NavLink> 
          ))} 
        </nav> 
  
        {/* Footer */} 
        <div className="p-4 border-t border-[#1e293b] text-[13px] text-slate-400"> 
          © Sportsync 
        </div> 
      </aside> 
    </>
  );
};
