import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const PlaceholderScreen: React.FC = () => {
  const location = useLocation();
  const title = location.pathname.substring(1).replace(/-/g, ' ').toUpperCase();

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚧</div>
      <h2 style={{ marginBottom: '10px', textTransform: 'capitalize' }}>{title || 'Page'}</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        This is a placeholder for the <strong>{location.pathname}</strong> route.
        <br />
        It exists to verify the navigation flow contract.
      </p>
      <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
        Return to Live
      </Link>
    </div>
  );
};
