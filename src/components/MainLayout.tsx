import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export const MainLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};
