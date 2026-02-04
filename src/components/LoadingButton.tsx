import React from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({ 
  isLoading = false, 
  loadingText = 'Loading...', 
  children, 
  variant = 'primary',
  style,
  disabled,
  ...props 
}) => {
  let backgroundColor = 'var(--color-neon-cyan)';
  let color = '#000';

  if (variant === 'secondary') {
    backgroundColor = 'rgba(255,255,255,0.1)';
    color = 'var(--color-text-primary)';
  } else if (variant === 'danger') {
    backgroundColor = 'var(--color-neon-orange)';
    color = 'white';
  }

  const baseStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: (isLoading || disabled) ? 'not-allowed' : 'pointer',
    opacity: (isLoading || disabled) ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s',
    backgroundColor,
    color,
    width: '100%', // Mobile friendly default
    ...style
  };

  return (
    <button 
      disabled={isLoading || disabled} 
      style={baseStyle} 
      {...props}
    >
      {isLoading && (
        <span style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderRightColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {isLoading ? loadingText : children}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
