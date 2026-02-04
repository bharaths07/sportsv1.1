import React from 'react';
import { useGlobalState } from '../../../app/AppProviders';
import { ImpactScore } from '../../../utils/cricketMetrics';
import { useNavigate } from 'react-router-dom';

interface Props {
  icons: ImpactScore[];
  onGeneratePoster: (player: ImpactScore, type: 'icon' | 'performance') => void;
}

export const IconsOfTheMatch: React.FC<Props> = ({ icons, onGeneratePoster }) => {
  const { players } = useGlobalState();
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 800, 
            color: '#0f172a', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            display: 'flex', alignItems: 'center', gap: '8px'
        }}>
            <span style={{ fontSize: '18px' }}>🏆</span> Icons of the Match
        </h3>
      </div>

      <div style={{ 
          display: 'flex', 
          gap: '16px', 
          overflowX: 'auto', 
          paddingBottom: '16px',
          scrollSnapType: 'x mandatory',
          paddingRight: '20px' // Padding for last item
      }}>
        {icons.slice(0, 3).map((icon, index) => {
            const player = players.find(p => p.id === icon.playerId);
            const isMVP = index === 0; // Assumption: Sorted by impact
            
            // Dynamic Gradient based on rank
            const bgGradient = isMVP 
                ? 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)' // Gold
                : index === 1 
                    ? 'linear-gradient(135deg, #C0C0C0 0%, #718096 100%)' // Silver
                    : 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'; // Bronze

            return (
                <div 
                    key={icon.playerId}
                    style={{ 
                        minWidth: '240px',
                        height: '320px',
                        borderRadius: '16px',
                        background: bgGradient,
                        position: 'relative',
                        overflow: 'hidden',
                        scrollSnapAlign: 'start',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onClick={() => navigate(`/player/${icon.playerId}`)}
                >
                    {/* Background Pattern/Noise */}
                    <div style={{ 
                        position: 'absolute', inset: 0, 
                        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                        zIndex: 1 
                    }} />

                    {/* Award Tag */}
                    <div style={{ 
                        position: 'absolute', top: '16px', left: '16px', right: '16px',
                        zIndex: 10,
                        display: 'flex', justifyContent: 'center'
                    }}>
                        <span style={{ 
                            backgroundColor: 'rgba(0,0,0,0.6)', 
                            color: 'white', 
                            padding: '6px 12px', 
                            borderRadius: '100px', 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            {isMVP ? 'Player of the Match' : index === 1 ? 'Top Performer' : 'Impact Player'}
                        </span>
                    </div>

                    {/* Player Visual (Cutout Placeholder) */}
                    <div style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'flex-end', 
                        justifyContent: 'center',
                        zIndex: 5,
                        marginTop: '40px'
                    }}>
                        {/* Placeholder for Cutout */}
                        <div style={{ 
                            width: '160px', 
                            height: '160px', 
                            borderRadius: '50%', 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '64px',
                            marginBottom: '20px',
                            color: 'white',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                             {player?.firstName[0]}{player?.lastName[0]}
                        </div>
                    </div>

                    {/* Content Overlay */}
                    <div style={{ 
                        padding: '16px', 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                        zIndex: 10,
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            {player?.firstName} {player?.lastName}
                        </div>
                        
                        <div style={{ 
                            marginTop: '8px', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: '12px',
                            fontSize: '14px',
                            fontWeight: 600
                        }}>
                             {icon.details.runs > 0 && (
                                 <span>{icon.details.runs} <span style={{ fontSize: '10px', opacity: 0.8 }}>RUNS</span></span>
                             )}
                             {icon.details.wicketsTaken > 0 && (
                                 <span>{icon.details.wicketsTaken} <span style={{ fontSize: '10px', opacity: 0.8 }}>WKTS</span></span>
                             )}
                        </div>

                        {/* Share / Poster Action */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onGeneratePoster(icon, 'icon');
                            }}
                            style={{ 
                                marginTop: '12px',
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                width: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                transition: 'background 0.2s'
                            }}
                        >
                            <span>✨</span> Generate Poster
                        </button>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};
