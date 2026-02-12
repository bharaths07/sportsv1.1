import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { useGlobalState } from "../../app/AppProviders";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const { currentUser } = useGlobalState();

  const navItem = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-medium rounded-md transition ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 tracking-tight"
          >
            Play Legends
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navItem}>
              Home
            </NavLink>
            <NavLink to="/matches" className={navItem}>
              Matches
            </NavLink>
            <NavLink to="/tournaments" className={navItem}>
              Tournaments
            </NavLink>
            <NavLink to="/teams" className={navItem}>
              Teams
            </NavLink>
            <NavLink to="/stats" className={navItem}>
              Stats / Leaderboards
            </NavLink>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu size={22} />
          </button>

          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
