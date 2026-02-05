import React, { useRef } from 'react';

interface Squad {
  id: string;
  name: string;
  code: string;
  flag: string;
}

interface SquadListProps {
  squads: Squad[];
  onTeamClick?: (teamId: string) => void;
}

export const SquadList: React.FC<SquadListProps> = ({ squads, onTeamClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>Team Squads</h2>
      
      <div style={{ position: 'relative' }}>
        {/* Scroll Left Button - Only visible if needed in real app, keeping simple for now */}
        {/* <button onClick={() => scroll('left')} ... /> */}

        <div 
          ref={scrollRef}
          style={{ 
            display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px',
            scrollbarWidth: 'none', msOverflowStyle: 'none'
          }}
        >
          {squads.map(squad => (
            <div 
              key={squad.id} 
              onClick={() => onTeamClick?.(squad.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '64px', cursor: 'pointer' }}
            >
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '2px solid white',
                marginBottom: '8px'
              }}>
                <img src={squad.flag} alt={squad.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>{squad.code}</div>
            </div>
          ))}
          
          {/* See All Arrow Circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '64px', justifyContent: 'center' }}>
            <button style={{ 
              width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e2e8f0',
              background: 'white', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
