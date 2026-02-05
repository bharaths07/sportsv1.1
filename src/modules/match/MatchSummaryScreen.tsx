import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { MatchSummaryTab } from './MatchSummaryTab';
import { MatchInfoTab } from './MatchInfoTab';
import { MatchScorecardTab } from './MatchScorecardTab';
import { MatchCommentaryTab } from './MatchCommentaryTab';
import { MatchSquadsTab } from './MatchSquadsTab';

export const MatchSummaryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { matches, followedMatches, toggleFollowMatch } = useGlobalState();
  const [activeTab, setActiveTab] = useState<'summary' | 'scorecard' | 'comms' | 'squads' | 'info'>('summary');
  const match = matches.find(m => m.id === id);
  const isFollowed = match ? followedMatches.includes(match.id) : false;

  // Navigation State Handling
  const navState = location.state as { returnPath?: string; tournamentId?: string; stage?: string } | null;
  const backLink = navState?.returnPath || '/';

  if (!match) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Match not found</h2>
        <Link to="/" style={{ color: '#007bff' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Link to={backLink} style={{ textDecoration: 'none', color: '#666' }}>
          ← {navState?.returnPath ? 'Back to Tournament' : 'Back'}
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {match.status !== 'completed' && match.status !== 'locked' && (
            <>
              <button
                onClick={() => toggleFollowMatch(match.id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '100px',
                  border: isFollowed ? '1px solid #2196F3' : '1px solid #e2e8f0',
                  backgroundColor: isFollowed ? '#e3f2fd' : 'white',
                  color: isFollowed ? '#1976D2' : '#64748b',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {isFollowed ? (
                  <>
                    <span style={{ fontSize: '16px', lineHeight: 0 }}>•</span> Following
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '16px', lineHeight: 0 }}>+</span> Follow Match
                  </>
                )}
              </button>
              <div style={{ width: 1, height: 20, backgroundColor: '#e2e8f0' }}></div>
            </>
          )}
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 0 }}>
             {['summary', 'scorecard', 'comms', 'squads', 'info'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab ? '3px solid #0f172a' : '3px solid transparent',
                    padding: '8px 4px',
                    cursor: 'pointer',
                    fontWeight: activeTab === tab ? 700 : 500,
                    color: activeTab === tab ? '#0f172a' : '#64748b',
                    fontSize: '14px',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'comms' ? 'Commentary' : tab}
                </button>
             ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #eee', overflow: 'hidden' }}>
        <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {match.homeParticipant.name.charAt(0)}
            </div>
            <div style={{ fontWeight: 800 }}>{match.homeParticipant.name}</div>
            <div style={{ color: '#94a3b8' }}>vs</div>
            <div style={{ fontWeight: 800 }}>{match.awayParticipant.name}</div>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {match.awayParticipant.name.charAt(0)}
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {navState?.stage || match.stage || (match.tournamentId ? match.tournamentId.replace(/-/g, ' ').toUpperCase() : 'Match Details')}
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {activeTab === 'summary' && <MatchSummaryTab match={match} onTabChange={setActiveTab} />}
                  {activeTab === 'scorecard' && <MatchScorecardTab match={match} />}
                  {activeTab === 'comms' && <MatchCommentaryTab match={match} />}
                  {activeTab === 'squads' && <MatchSquadsTab match={match} />}
                  {activeTab === 'info' && <MatchInfoTab match={match} />}
        </div>
      </div>
    </div>
  );
};
