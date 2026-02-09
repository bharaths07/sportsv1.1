import React from 'react';
import { Tournament } from '../../../domain/tournament';
import { Avatar } from '../../../components/ui/Avatar';

interface TournamentHeaderProps {
  tournament: Tournament;
}

export const TournamentHeader: React.FC<TournamentHeaderProps> = ({ tournament }) => {
  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '32px 0', borderBottom: '1px solid #1e293b' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Left Side: Navigation + Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Left Arrow */}
          <button style={{ 
            width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #334155', 
            background: 'transparent', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            ←
          </button>

          {/* Tournament Info */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Logo */}
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              backgroundColor: '#1e293b'
            }}>
              <Avatar 
                src={tournament.bannerUrl} 
                alt={tournament.name} 
                fallback={tournament.name.charAt(0)}
                className="w-full h-full rounded-none"
              />
            </div>
            
            {/* Text */}
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'white' }}>
                {tournament.name}
              </h1>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                {tournament.dates}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Next Tournament Preview + Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Up Next</span>
              <span style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: 500 }}>World Legends</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>T20 2026</span>
            </div>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', 
              backgroundColor: '#1e293b'
            }}>
              <Avatar 
                src="https://placehold.co/100x100/4f46e5/ffffff?text=WL" 
                alt="Next" 
                fallback="WL"
                className="w-full h-full rounded-none"
              />
            </div>
          </div>
          
          {/* Right Arrow */}
          <button style={{ 
            width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #334155', 
            background: 'transparent', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            →
          </button>
        </div>

      </div>
    </div>
  );
};
