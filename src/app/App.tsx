import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../routes';
import { AppProviders } from './AppProviders';

export const App: React.FC = () => {
  // App Entry Point
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
