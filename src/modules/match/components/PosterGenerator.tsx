import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../../app/AppProviders';
import { ImpactScore } from '../../../utils/cricketMetrics';
import { generatePosterImage } from './PosterCanvasEngine';
import { Match } from '../../../domain/match';

interface Props {
  data: { player?: ImpactScore, type: 'icon' | 'performance' | 'team_win' } | null;
  match: Match;
  onClose: () => void;
}

export const PosterGenerator: React.FC<Props> = ({ data, match, onClose }) => {
  const { players } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data && match) {
        setLoading(true);
        setImageUrl(null);
        
        const player = data.player ? players.find(p => p.id === data.player!.playerId) : undefined;
        
        // Prepare config
        const config: any = {
            type: data.type,
            matchInfo: {
                homeTeam: match.homeParticipant.name,
                awayTeam: match.awayParticipant.name,
                date: new Date(match.date).toLocaleDateString(),
                result: match.status === 'completed' && match.winnerId 
                    ? `${match.winnerId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name} won`
                    : undefined,
                winnerColor: match.winnerId === match.homeParticipant.id ? '#10b981' : '#3b82f6' // Mock colors
            }
        };

        if (player && data.player) {
            config.player = {
                firstName: player.firstName,
                lastName: player.lastName,
                initials: `${player.firstName[0]}${player.lastName[0]}`,
                teamColor: undefined
            };
            config.stats = data.player;
        }

        // Generate the poster using the Canvas Engine
        generatePosterImage(config).then(url => {
            setImageUrl(url);
            setLoading(false);
        }).catch(err => {
            console.error("Poster Generation Failed", err);
            setLoading(false);
        });
    }
  }, [data, match, players]);

  if (!data) return null;

  const handleDownload = () => {
      if (imageUrl) {
          const link = document.createElement('a');
          link.href = imageUrl;
          const filename = data.type === 'team_win' 
              ? `ScoreHeroes_Poster_Match_${match.id}.png`
              : `ScoreHeroes_Poster_${data.player?.playerId || 'player'}.png`;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };

  return (
    <div style={{ 
        position: 'fixed', inset: 0, zIndex: 9999, 
        backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
        {/* Close Button */}
        <button 
            onClick={onClose}
            style={{ 
                position: 'absolute', top: '20px', right: '20px', 
                background: 'rgba(255,255,255,0.1)', border: 'none', 
                color: 'white', fontSize: '24px', cursor: 'pointer',
                width: '40px', height: '40px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            ×
        </button>

        {loading && (
            <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: '40px', marginBottom: '20px', animation: 'spin 1s linear infinite' }}>⚙️</div>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>Generating Pro Poster...</div>
                <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px' }}>Using High-Fidelity Canvas Engine</div>
            </div>
        )}

        {!loading && imageUrl && (
            <>
                <div style={{ marginBottom: '20px', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                    Ready to Share
                </div>

                {/* Poster Preview */}
                <div style={{ 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
                    maxHeight: '70vh', 
                    maxWidth: '90vw',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <img src={imageUrl} alt="Generated Poster" style={{ maxHeight: '100%', maxWidth: '100%', display: 'block' }} />
                </div>

                {/* Actions */}
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleDownload}
                        style={{ 
                        padding: '12px 24px', borderRadius: '100px', border: 'none', 
                        background: '#25D366', color: 'white', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                    }}>
                        <span>⬇️</span> Download / Share
                    </button>
                </div>
                <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '12px' }}>
                    High-Res (1080x1350) • Generated Locally
                </div>
            </>
        )}
    </div>
  );
};
