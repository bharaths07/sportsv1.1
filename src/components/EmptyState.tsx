import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: (e: React.MouseEvent) => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  actionLabel, 
  actionLink, 
  onAction,
  icon = '📭'
}) => {
  return (
    <div style={{ 
      padding: '40px 20px', 
      textAlign: 'center', 
      backgroundColor: 'rgba(255,255,255,0.05)', 
      borderRadius: '12px',
      border: '1px dashed rgba(255,255,255,0.2)',
      margin: '20px 0'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>{icon}</div>
      <p style={{ 
        fontSize: '18px', 
        color: 'var(--color-text-secondary)', 
        marginBottom: (actionLabel && (actionLink || onAction)) ? '30px' : '0' 
      }}>
        {message}
      </p>
      
      {actionLabel && actionLink && (
        <Link 
          to={actionLink}
          style={{ 
            display: 'inline-block',
            backgroundColor: 'var(--color-neon-cyan)', 
            color: '#000', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          style={{ 
            backgroundColor: 'var(--color-neon-cyan)', 
            color: '#000', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
