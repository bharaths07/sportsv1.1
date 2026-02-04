import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Match } from '../../domain/match';
import { LoginModal } from '../../components/LoginModal';
import { LoadingButton } from '../../components/LoadingButton';

export const CreateMatchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { addMatch, currentUser } = useGlobalState();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [sportId, setSportId] = useState('s1'); // Default Cricket
  const [teamAName, setTeamAName] = useState('');
  const [teamBName, setTeamBName] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setShowLoginModal(true);
    }
  }, [currentUser]);

  const handleModalClose = () => {
    setShowLoginModal(false);
    if (!currentUser) {
      navigate('/');
    }
  };

  const handleCreate = () => {
    // 1. Validation
    if (!teamAName.trim() || !teamBName.trim()) {
      setError('Both team names are required.');
      return;
    }
    if (teamAName.trim().toLowerCase() === teamBName.trim().toLowerCase()) {
      setError('Team names must be different.');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);

    // Simulate network delay for UX
    setTimeout(() => {
      // 2. Create Match Object
      const newMatchId = `m-${Date.now()}`;
      const newMatch: Match = {
        id: newMatchId,
        sportId,
        date: new Date().toISOString(),
        status: 'draft',
        location: institution || 'Unknown Location',
        createdByUserId: currentUser.id,
        homeParticipant: {
          id: `t-${Date.now()}-1`,
          name: teamAName,
          score: 0
        },
        awayParticipant: {
          id: `t-${Date.now()}-2`,
          name: teamBName,
          score: 0
        },
        events: [],
        officials: [{ userId: currentUser.id, role: 'scorer' }]
      };

      // 3. Add to Global State
      addMatch(newMatch);

      // 4. Redirect to Live Scoring
      navigate(`/match/${newMatchId}/live`);
    }, 800);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleModalClose} 
        message="Please login to start a new match."
      />
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-text-secondary)', marginBottom: '20px', display: 'inline-block' }}>← Cancel</Link>
      <h1 style={{ marginBottom: '30px', color: 'var(--color-text-primary)' }}>Start a New Match</h1>
      
      {error && (
        <div style={{ backgroundColor: 'rgba(198, 40, 40, 0.1)', color: '#ef5350', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(198, 40, 40, 0.2)' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Sport</label>
        <select 
          value={sportId} 
          onChange={(e) => setSportId(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            fontSize: '16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-glass)',
            backgroundColor: 'var(--color-bg-input)',
            color: 'var(--color-text-primary)'
          }}
        >
          <option value="s1">Cricket</option>
          <option value="s2">Kabaddi</option>
          <option value="s3">Football</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Team A Name</label>
        <input 
          type="text" 
          value={teamAName}
          onChange={(e) => setTeamAName(e.target.value)}
          placeholder="e.g. Royal Strikers"
          style={{ 
            width: '100%', 
            padding: '12px', 
            fontSize: '16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-glass)',
            backgroundColor: 'var(--color-bg-input)',
            color: 'var(--color-text-primary)'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Team B Name</label>
        <input 
          type="text" 
          value={teamBName}
          onChange={(e) => setTeamBName(e.target.value)}
          placeholder="e.g. Thunder 11"
          style={{ 
            width: '100%', 
            padding: '12px', 
            fontSize: '16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-glass)',
            backgroundColor: 'var(--color-bg-input)',
            color: 'var(--color-text-primary)'
          }}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Institution (Optional)</label>
        <input 
          type="text" 
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="e.g. National College"
          style={{ 
            width: '100%', 
            padding: '12px', 
            fontSize: '16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-glass)',
            backgroundColor: 'var(--color-bg-input)',
            color: 'var(--color-text-primary)'
          }}
        />
      </div>

      <LoadingButton 
        onClick={handleCreate}
        isLoading={isSubmitting}
        loadingText="Creating Match..."
      >
        Create & Start Match
      </LoadingButton>
    </div>
  );
};