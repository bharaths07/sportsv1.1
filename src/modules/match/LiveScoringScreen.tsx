import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { LoginModal } from '../../components/LoginModal';
import { LoadingButton } from '../../components/LoadingButton';

export const LiveScoringScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matches, currentUser, scoreMatch, endMatch, startMatch } = useGlobalState();
  const match = matches.find(m => m.id === id);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isEnding, setIsEnding] = useState(false); // Double-click protection
  
  // Dev toggle for Viewer/Scorer mode verification
  const [isSimulatingViewer, setIsSimulatingViewer] = useState(false);

  if (!match) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Match not found</h2>
        <Link to="/" style={{ color: '#007bff' }}>Return Home</Link>
      </div>
    );
  }

  // Determine permissions
  const isCreator = currentUser && (match.createdByUserId === currentUser.id || !match.createdByUserId);
  const isScorer = match.officials?.some(o => o.userId === currentUser?.id && o.role === 'scorer');
  const hasPermission = isCreator || isScorer;
  const canScore = !isSimulatingViewer && hasPermission;

  const battingTeamId = match.currentBattingTeamId || match.homeParticipant.id;
  const isHomeBatting = battingTeamId === match.homeParticipant.id;
  const battingParticipant = isHomeBatting ? match.homeParticipant : match.awayParticipant;

  const runs = battingParticipant.score || 0;
  const wickets = battingParticipant.wickets || 0;
  const balls = battingParticipant.balls || 0;
  const overs = Math.floor(balls / 6);
  const ballsInOver = balls % 6;

  const handleStartMatch = () => {
    if (!canScore) {
       // Friendly error (although UI shouldn't show button)
       alert("Only the match creator can start the match.");
       return;
    }
    if (window.confirm('Start the match? This will enable scoring.')) {
        startMatch(match.id);
    }
  };

  const handleScore = (points: number, isWicket: boolean) => {
    if (match.status !== 'live') return;
    scoreMatch(match.id, points, isWicket);
  };

  const handleEndMatch = () => {
    if (isEnding) return; // Prevent double clicks
    
    if (window.confirm('Finish the game? This will create awards for everyone.')) {
      setIsEnding(true);
      endMatch(match.id);
      // Navigate after a short delay to ensure state updates
      setTimeout(() => {
          navigate(`/match/${match.id}`); // Go to summary
      }, 500);
    }
  };

  const scoreBtnStyle = {
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    minHeight: '60px', // Touch target size
    touchAction: 'manipulation' as 'manipulation' // Improve touch response
  };

  return (
    <div style={{ padding: '20px', width: '100%', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }}>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        message="Login required to score."
      />

      {/* 1. Match Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', color: '#555' }}>
          {match.homeParticipant.name} vs {match.awayParticipant.name}
        </div>
        <div style={{ 
          display: 'inline-block', 
          backgroundColor: match.status === 'live' ? '#ff4444' : (match.status === 'draft' ? '#ff9800' : '#666'), 
          color: 'white', 
          padding: '4px 12px', 
          borderRadius: '12px',
          fontSize: '12px',
          marginTop: '8px',
          fontWeight: 'bold'
        }}>
          {match.status.toUpperCase()}
        </div>
      </div>

      {/* 2. Big Score Display */}
      <div style={{ 
        textAlign: 'center', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '30px'
      }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
          Batting: {battingParticipant.name}
        </div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: '1', color: '#333' }}>
          {runs}/{wickets}
        </div>
        <div style={{ fontSize: '20px', color: '#666', marginTop: '10px' }}>
          Overs: {overs}.{ballsInOver}
        </div>
      </div>

      {/* 3. Scoring Controls */}
      {match.status === 'draft' && canScore && (
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <LoadingButton 
                onClick={handleStartMatch}
                variant="primary"
                style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '18px'
                }}
              >
                Start Match
              </LoadingButton>
              <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
                Teams can still be edited in this state.
              </p>
          </div>
      )}

      {match.status === 'live' && (
        canScore ? (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#444' }}>Scoring Controls</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button onClick={() => handleScore(0, false)} style={scoreBtnStyle}>0</button>
              <button onClick={() => handleScore(1, false)} style={scoreBtnStyle}>1</button>
              <button onClick={() => handleScore(2, false)} style={scoreBtnStyle}>2</button>
              <button onClick={() => handleScore(3, false)} style={scoreBtnStyle}>3</button>
              <button onClick={() => handleScore(4, false)} style={{...scoreBtnStyle, backgroundColor: '#e3f2fd', color: '#1565c0'}}>4</button>
              <button onClick={() => handleScore(6, false)} style={{...scoreBtnStyle, backgroundColor: '#e8f5e9', color: '#2e7d32'}}>6</button>
            </div>
            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => handleScore(0, true)} style={{...scoreBtnStyle, backgroundColor: '#ffebee', color: '#c62828'}}>WICKET</button>
              <button onClick={() => handleScore(1, false)} style={{...scoreBtnStyle, backgroundColor: '#fff3e0', color: '#ef6c00'}}>WIDE/NB</button>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '30px', textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            {currentUser ? (
              <div style={{ color: '#666' }}>
                 🔒 You are viewing this match. <br/>
                 <span style={{ fontSize: '12px' }}>Only the organizer or scorer can score.</span>
              </div>
            ) : (
              <LoadingButton 
                onClick={() => setShowLoginModal(true)}
                variant="secondary"
                style={{
                  padding: '10px 20px',
                  borderRadius: '4px'
                }}
              >
                Login to Score
              </LoadingButton>
            )}
          </div>
        )
      )}
      
      {(match.status === 'completed' || match.status === 'locked') && (
          <div style={{ marginBottom: '30px', textAlign: 'center', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', color: '#2e7d32' }}>
              <h3>Match Completed</h3>
              <p>Final scores are locked.</p>
          </div>
      )}

      {/* 4. Match Actions */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', margin: 0, color: '#444' }}>Match Actions</h3>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Viewing as: <strong>{isSimulatingViewer ? 'Viewer' : (canScore ? 'Official' : 'Viewer')}</strong>
          </div>
        </div>

        {canScore && match.status === 'live' && (
          <button 
            onClick={handleEndMatch}
            disabled={isEnding}
            style={{ 
              width: '100%', 
              padding: '15px', 
              backgroundColor: isEnding ? '#ef9a9a' : '#d32f2f', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 'bold',
              cursor: isEnding ? 'not-allowed' : 'pointer' 
            }}
          >
            {isEnding ? 'Ending Match...' : 'End Match'}
          </button>
        )}
        
        {/* Dev Toggle */}
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fafafa', borderRadius: '8px', fontSize: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={isSimulatingViewer} 
              onChange={e => setIsSimulatingViewer(e.target.checked)} 
            />
            Preview as Guest
          </label>
        </div>
      </div>
    </div>
  );
};
