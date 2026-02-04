import React from 'react';

interface TournamentStatusProps {
  stage: string;
  progress: string; // e.g. "12 of 30 matches completed"
  nextMatch: string; // e.g. "AFG vs WI – Feb 4, 3:00 PM"
}

export const TournamentStatus: React.FC<TournamentStatusProps> = ({ stage, progress, nextMatch }) => {
  return (
    <div style={{ 
      marginBottom: '32px', 
      padding: '20px 24px', 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>
            Current Stage
          </h2>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
            {stage}
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            {progress}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>
            Up Next
          </h2>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
            {nextMatch}
          </div>
        </div>
      </div>
    </div>
  );
};
