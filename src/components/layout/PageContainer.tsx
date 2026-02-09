import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{ background: 'var(--bg-page)' }}
    >
      <div 
        className="mx-auto w-full"
        style={{ 
          maxWidth: '1200px',
          padding: 'var(--space-xl)'
        }}
      >
        {children}
      </div>
    </div>
  );
};
