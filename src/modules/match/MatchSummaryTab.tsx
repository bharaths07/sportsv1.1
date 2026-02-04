import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../../domain/match';
import { useGlobalState } from '../../app/AppProviders';
import { getMatchImpactRankings, ImpactScore } from '../../utils/cricketMetrics';
import { IconsOfTheMatch } from './components/IconsOfTheMatch';
import { IconPerformances } from './components/IconPerformances';
import { PosterGenerator } from './components/PosterGenerator';

interface Props {
  match: Match;
  onTabChange: (tab: any) => void;
}

export const MatchSummaryTab: React.FC<Props> = ({ match, onTabChange }) => {
  const navigate = useNavigate();
  const { achievements } = useGlobalState();
  const [posterData, setPosterData] = useState<{ player?: ImpactScore, type: 'icon' | 'performance' | 'team_win' } | null>(null);

  // --- 1. Match Status Logic ---
  const statusText = useMemo(() => {
    if (match.status === 'upcoming' || match.status === 'draft') {
      const start = new Date(match.date);
      const now = new Date();
      if (now < start) return `Starts at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      return 'Toss delayed';
    }
    if (match.status === 'completed' || match.status === 'locked') {
        if (match.winnerId) {
            const winner = match.winnerId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name;
            return `${winner} won the match`;
        }
        return 'Match Tied';
    }
    return 'Match is Live';
  }, [match]);

  // --- 2. Score Snapshot Logic ---
  const homeScore = match.homeParticipant.score || 0;
  const homeWickets = match.homeParticipant.wickets || 0;
  const homeOvers = match.homeParticipant.overs || 0;
  
  const awayScore = match.awayParticipant.score || 0;
  const awayWickets = match.awayParticipant.wickets || 0;
  const awayOvers = match.awayParticipant.overs || 0;

  // --- 4. Moments / Highlights (Mock/Derived) ---
  const highlights = useMemo(() => {
    return [
      { id: 1, icon: '🔥', text: 'Powerplay: 45/1', time: '6.0 ov' },
      { id: 2, icon: '🏏', text: '50 partnership for 3rd wkt', time: '12.4 ov' },
      { id: 3, icon: '🎯', text: 'Strategic Timeout taken', time: '14.0 ov' }
    ];
  }, []);

  // --- 5. Milestones Logic ---
  const milestones = useMemo(() => {
    const ms: any[] = [];
    [match.homeParticipant, match.awayParticipant].forEach(team => {
        team.players?.forEach(p => {
            if (p.runs >= 50) ms.push({ type: 'runs', player: p.playerId, value: p.runs, label: 'Runs' });
            if (p.wickets >= 3) ms.push({ type: 'wickets', player: p.playerId, value: p.wickets, label: 'Wickets' });
        });
    });
    return ms.slice(0, 3);
  }, [match]);

  // --- 6. Impact Rankings (New Logic) ---
  const { icons, performances } = useMemo(() => {
      const rankings = getMatchImpactRankings(match);
      return {
          icons: rankings.slice(0, 3),
          performances: rankings.slice(3, 9)
      };
  }, [match]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. Match Status Strip */}
      <div 
        onClick={() => {
            if (match.status === 'live') {
                onTabChange('comms');
            }
        }}
        style={{ 
        padding: '12px 16px', 
        backgroundColor: match.status === 'live' ? '#eff6ff' : '#f8fafc', 
        borderRadius: '8px',
        border: `1px solid ${match.status === 'live' ? '#bfdbfe' : '#e2e8f0'}`,
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        cursor: match.status === 'live' ? 'pointer' : 'default'
      }}>
        <div style={{ 
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: match.status === 'live' ? '#ef4444' : match.status === 'upcoming' ? '#f59e0b' : '#64748b',
          color: 'white',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          {match.status === 'live' ? 'LIVE' : match.status === 'upcoming' ? 'UPCOMING' : 'COMPLETED'}
        </div>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: 600, 
          color: match.status === 'live' ? '#1e40af' : '#475569' 
        }}>
          {statusText}
        </span>
      </div>

      {/* 2. Score Snapshot */}
      <div 
        onClick={() => onTabChange('scorecard')}
        style={{ 
          cursor: 'pointer',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{match.homeParticipant.name}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {homeScore}/{homeWickets} <span style={{ fontSize: '16px', fontWeight: 500, color: '#64748b' }}>({homeOvers})</span>
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#64748b' }}>
            VS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{match.awayParticipant.name}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {awayScore}/{awayWickets} <span style={{ fontSize: '16px', fontWeight: 500, color: '#64748b' }}>({awayOvers})</span>
            </div>
          </div>
        </div>
        
        {match.winnerId && (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
             <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#16a34a' }}>
               {match.winnerId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name} won
             </div>
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    setPosterData({ type: 'team_win' });
                }}
                style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px'
                }}
             >
                 <span>📤</span> Share Result
             </button>
           </div>
        )}
      </div>

      {/* 3. Quick Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button 
            onClick={() => navigate(`/tournament/${match.tournamentId || 't1'}`, { state: { activeTab: 'Points Table' } })}
            style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
        >
            📋 Points Table
        </button>
        <button 
            onClick={() => navigate(`/tournament/${match.tournamentId || 't1'}`, { state: { activeTab: 'Leaderboard' } })}
            style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
        >
            🏆 Leaderboard
        </button>
      </div>

      {/* 4. Moments / Highlights */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>Moments</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px' }}>{h.icon}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{h.text}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{h.time}</div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 5. Milestones Section */}
      {milestones.length > 0 && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>Achievements</h3>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {milestones.map((m, i) => (
                    <div key={i} style={{ 
                        minWidth: '120px', 
                        padding: '12px', 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        backgroundColor: '#fff',
                        display: 'flex', flexDirection: 'column', gap: '4px'
                    }}>
                        <div style={{ fontSize: '20px' }}>
                            {m.type === 'runs' ? '🏏' : '🎯'}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                            {m.value} {m.label}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                            {m.player}
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* 6. Icons & Performances */}
      <IconsOfTheMatch icons={icons} onGeneratePoster={(player, type) => setPosterData({ player, type })} />
      <IconPerformances performances={performances} onGeneratePoster={(player, type) => setPosterData({ player, type })} />

      {/* Poster Generator Modal */}
      <PosterGenerator data={posterData} match={match} onClose={() => setPosterData(null)} />
    </div>
  );
};
