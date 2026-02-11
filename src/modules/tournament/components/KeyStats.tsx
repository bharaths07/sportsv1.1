import React from 'react';
import { Avatar } from '../../../components/ui/Avatar';

interface StatItem {
  id: string;
  category: string;
  player: {
    name: string;
    team: string;
    avatar: string;
  };
  value: string;
  label: string; // e.g. "Runs"
}

interface KeyStatsProps {
  stats: StatItem[];
  variant?: 'sidebar' | 'full';
}

export const KeyStats: React.FC<KeyStatsProps> = ({ stats, variant = 'sidebar' }) => {
  const displayStats = variant === 'full' ? stats : stats.slice(0, 3);
  
  const containerStyle: React.CSSProperties = variant === 'full' 
    ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }
    : { display: 'flex', flexDirection: 'column', gap: '16px' };

  return (
    <div>
      {variant === 'sidebar' && (
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>Key Stats</h2>
      )}
      
      <div style={containerStyle}>
        {displayStats.map(stat => (
          <div 
            key={stat.id} 
            title="Stats update as tournament progresses"
            style={{ 
              backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden',
              cursor: 'help',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: variant === 'full' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (variant === 'full') {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (variant === 'full') {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }
            }}
          >
            <div style={{ 
              padding: '8px 16px', borderBottom: '1px solid #f1f5f9',  
              fontSize: '12px', fontWeight: 500, color: '#64748b',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span>{stat.category}</span>
              {variant === 'full' && <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>TOP PERFORMER</span>}
            </div>
            
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar
                  src={stat.player.avatar}
                  alt={stat.player.name}
                  fallback={stat.player.name.charAt(0)}
                  className="w-12 h-12 rounded-full bg-slate-50"
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{stat.player.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{stat.player.team}</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
