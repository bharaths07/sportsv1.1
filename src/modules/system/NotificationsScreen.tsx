import React from 'react';
import { useGlobalState } from '../../app/AppProviders';
import { Link } from 'react-router-dom';

export const NotificationsScreen: React.FC = () => {
  const { notifications } = useGlobalState();
  const items = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const label = (t: string) => {
    if (t === 'match_start') return 'Match Start';
    if (t === 'match_result') return 'Match Result';
    return 'Tournament';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>Notifications</h1>
      {items.length === 0 ? (
        <div style={{ padding: '24px', border: '1px dashed #ccc', borderRadius: '8px', color: '#666' }}>
          No notifications yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map(n => (
            <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '12px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#d32f2f' }}>{label(n.type)}</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#222' }}>{n.title}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>{n.body}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{new Date(n.timestamp).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {n.relatedMatchId && (
                  <Link to={`/match/${n.relatedMatchId}`} style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #eee', textDecoration: 'none', color: '#333' }}>
                    View Match
                  </Link>
                )}
                {n.relatedTournamentId && (
                  <Link to={`/tournament/${n.relatedTournamentId}`} style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #eee', textDecoration: 'none', color: '#333' }}>
                    View Tournament
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
