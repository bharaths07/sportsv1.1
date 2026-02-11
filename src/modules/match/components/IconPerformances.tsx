import React from 'react';
import { useGlobalState } from '../../../app/AppProviders';
import { ImpactScore } from '../../../utils/cricketMetrics';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';

interface Props {
  performances: ImpactScore[];
  onGeneratePoster: (player: ImpactScore, type: 'performance') => void;
}

export const IconPerformances: React.FC<Props> = ({ performances, onGeneratePoster }) => {
  const { players } = useGlobalState();
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: '32px' }}>
       <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 800, 
            color: '#0f172a', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '8px'
        }}>
            <span style={{ fontSize: '18px' }}>⚡</span> Icon Performances
        </h3>

        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '12px' 
        }}>
            {performances.map((perf, index) => {
                const player = players.find(p => p.id === perf.playerId);
                
                return (
                    <div 
                        key={perf.playerId}
                        style={{ 
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            padding: '12px',
                            position: 'relative',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onClick={() => navigate(`/player/${perf.playerId}`)}
                    >
                         {/* Rank Badge */}
                         <div style={{ 
                             position: 'absolute', top: '8px', left: '8px',
                             fontSize: '10px', fontWeight: 700, color: '#94a3b8'
                         }}>
                             #{index + 4}
                         </div>

                         {/* Avatar */}
                         <Avatar
                            src={player?.avatarUrl}
                            fallback={`${player?.firstName?.[0] || ''}${player?.lastName?.[0] || ''}`}
                            className="w-12 h-12 mb-3 bg-slate-100 text-slate-500 text-lg font-bold"
                         />

                         {/* Name */}
                         <div style={{ 
                             fontSize: '14px', fontWeight: 700, color: '#0f172a', 
                             marginBottom: '4px', textAlign: 'center',
                             whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'
                         }}>
                             {player?.firstName} {player?.lastName}
                         </div>

                         {/* Stat Line */}
                         <div style={{ 
                             fontSize: '12px', color: '#64748b', marginBottom: '12px',
                             display: 'flex', gap: '8px', fontWeight: 500
                         }}>
                             {perf.details.runs > 0 && <span>{perf.details.runs} R</span>}
                             {perf.details.wicketsTaken > 0 && <span>{perf.details.wicketsTaken} W</span>}
                         </div>

                         {/* Action */}
                         <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onGeneratePoster(perf, 'performance');
                            }}
                            style={{ 
                                width: '100%',
                                padding: '6px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#f8fafc',
                                color: '#475569',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                         >
                             Create Poster
                         </button>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
