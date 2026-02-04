import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { formatRelativeTime } from '../../utils/dateUtils';
import { LoginModal } from '../../components/LoginModal';
import { EmptyState } from '../../components/EmptyState';

export const HomeScreen: React.FC = () => {
  const { matches, feedItems, currentUser, logout } = useGlobalState();
  // Show live matches to everyone. Show draft matches ONLY to their creator.
  const liveMatches = matches.filter(m => 
    m.status === 'live' || 
    (currentUser && m.createdByUserId === currentUser.id && m.status === 'draft')
  );
  
  // Note: We don't block the home screen if there's no content, we just show empty states.
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateMatch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      navigate('/create-match');
    }
  };

  return (
    <div style={{ padding: '20px 16px', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-neon-cyan)' }}>SportSync</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {currentUser && (
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                👤 {currentUser.name.split(' ')[0]}
              </span>
              <button 
                onClick={logout}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-neon-orange)', 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  fontSize: '12px'
                }}
              >
                Logout
              </button>
            </div>
          )}
          <a 
            href="/create-match"
            onClick={handleCreateMatch}
            style={{ 
              backgroundColor: 'var(--color-neon-cyan)', 
              color: '#000', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            + Create Match
          </a>
        </div>
      </header>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        message="Please login to create a match"
      />
      
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-neon-orange)' }}></span>
          Live Matches
        </h2>
        
        {liveMatches.length === 0 ? (
          <EmptyState 
            message="No live matches right now." 
            actionLabel={currentUser ? "Start a Match" : "Login to Start Match"}
            onAction={handleCreateMatch}
            icon="🏏"
          />
        ) : (
          liveMatches.map(match => (
            <div key={match.id} style={{ 
              border: '1px solid var(--border-glass)', 
              padding: '20px', 
              marginBottom: '15px', 
              borderRadius: '12px',
              backgroundColor: 'var(--color-bg-card)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ 
                  backgroundColor: match.status === 'live' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(239, 108, 0, 0.1)', 
                  color: match.status === 'live' ? 'var(--color-neon-orange)' : 'var(--color-neon-gold)', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}>
                  {match.status === 'live' ? 'LIVE' : 'DRAFT'}
                </span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{match.location}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-primary)' }}>
                    {match.homeParticipant.name}
                  </h3>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{match.homeParticipant.score}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', padding: '0 10px', fontSize: '14px' }}>VS</div>
                <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-primary)' }}>
                    {match.awayParticipant.name}
                  </h3>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{match.awayParticipant.score}</div>
                </div>
              </div>

              <Link 
                to={`/match/${match.id}/live`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-neon-orange)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
              >
                View Live Action
              </Link>
            </div>
          ))
        )}
      </section>

      <section>
        <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '20px' }}>Activity Feed</h2>
        {feedItems.length === 0 ? (
           <EmptyState message="No recent activity to show." icon="📰" />
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {feedItems.map(item => (
              <li key={item.id} style={{ 
                borderBottom: '1px solid var(--border-glass)', 
                padding: '15px 0',
                display: 'flex',
                gap: '15px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>{item.title}</strong>
                    <small style={{ color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {formatRelativeTime(item.publishedAt)}
                    </small>
                  </div>
                  <p style={{ margin: '0', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>{item.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
