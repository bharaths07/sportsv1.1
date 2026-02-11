import React from "react";
import { TopNavbar } from "./navigation/TopNavbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  console.log("MainLayout mounting");
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Top Navbar */}
      <TopNavbar onMenuClick={() => {}} />

      {/* Main Content + Sidebar */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-6">

        {/* Main Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

        {/* Right Sidebar */}
        {/* Sidebar removed as per requirement */}

      </div>
    </div>
  );
};
