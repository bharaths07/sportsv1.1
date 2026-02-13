import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../routes';
import { AppProviders, useGlobalState } from './AppProviders';
import { LoginPage } from '../modules/auth/LoginPage';
import { Loader } from '../components/ui/Loader';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authLoading, currentUser } = useGlobalState();
  
  // 1. Loading State
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader size="xl" className="text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading Legends...</p>
      </div>
    );
  }

  // 2. Unauthenticated State (Login Wall)
  if (!currentUser) {
    return <LoginPage />;
  }

  // 3. Authenticated State
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <AuthGate>
          <AppRoutes />
        </AuthGate>
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
