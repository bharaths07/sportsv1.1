import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sports, teams, matches, users } from '../../data/mockData';
import { Team, Match } from '../../types/models';

const StartMatch: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSportId, setSelectedSportId] = useState(sports[0].id);
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  
  // Inline creation state
  const [isCreatingTeamA, setIsCreatingTeamA] = useState(false);
  const [newTeamAName, setNewTeamAName] = useState('');
  
  const [isCreatingTeamB, setIsCreatingTeamB] = useState(false);
  const [newTeamBName, setNewTeamBName] = useState('');

  const [matchType, setMatchType] = useState('Friendly');

  // Filter teams by selected sport
  const availableTeams = teams.filter(t => t.sportId === selectedSportId);

  const handleCreateTeam = (name: string): string => {
    const newTeam: Team = {
      id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name,
      sportId: selectedSportId
    };
    teams.push(newTeam);
    return newTeam.id;
  };

  const handleConfirmTeamA = () => {
    if (newTeamAName.trim()) {
      const newId = handleCreateTeam(newTeamAName);
      setTeamAId(newId);
      setIsCreatingTeamA(false);
      setNewTeamAName('');
    }
  };

  const handleConfirmTeamB = () => {
    if (newTeamBName.trim()) {
      const newId = handleCreateTeam(newTeamBName);
      setTeamBId(newId);
      setIsCreatingTeamB(false);
      setNewTeamBName('');
    }
  };

  const handleStartMatch = () => {
    if (!teamAId || !teamBId) {
      alert('Please select both teams');
      return;
    }

    if (teamAId === teamBId) {
      alert('Teams must be different');
      return;
    }

    // Mock logged-in user
    const currentUserId = 'u1';

    const newMatch: Match = {
      id: `m-${Date.now()}`,
      sportId: selectedSportId,
      teamAId: teamAId,
      teamBId: teamBId,
      date: new Date().toISOString(),
      location: 'Local Ground', // Placeholder
      status: 'live',
      score: '0 - 0' // Initial score
    };

    matches.push(newMatch);
    
    // Navigate to Live Scoring with matchId
    navigate(`/live-scoring/${newMatch.id}`);
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    },
    header: {
      marginBottom: '30px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '10px'
    },
    section: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    select: {
      display: 'block',
      width: '100%',
      padding: '8px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '8px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    },
    inputGroup: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '15px'
    },
    option: {
      border: '1px solid #ddd',
      padding: '10px',
      marginBottom: '5px',
      cursor: 'pointer',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9'
    },
    selectedOption: {
        border: '1px solid #007bff',
        backgroundColor: '#e7f1ff'
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px'
    },
    smallButton: {
        padding: '5px 10px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
    },
    cancelButton: {
        padding: '5px 10px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
    },
    scorerText: {
      fontStyle: 'italic',
      color: '#555',
      marginBottom: '15px'
    }
  };

  return (
    <div style={styles.container}>
      {/* 1. Page Header */}
      <header style={styles.header}>
        <h1>Start Match</h1>
        <p>Create a new match</p>
      </header>

      {/* 2. Sport Section */}
      <section style={styles.section}>
        <div style={styles.label}>Select Sport</div>
        <div style={{ display: 'flex', gap: '10px' }}>
            {sports.map(sport => (
                <div 
                    key={sport.id}
                    style={{
                        ...styles.option,
                        ...(selectedSportId === sport.id ? styles.selectedOption : {})
                    }}
                    onClick={() => {
                        setSelectedSportId(sport.id);
                        setTeamAId(''); // Reset selection on sport change
                        setTeamBId('');
                    }}
                >
                    {sport.name}
                </div>
            ))}
        </div>
      </section>

      {/* 3. Match Type Section */}
      <section style={styles.section}>
        <div style={styles.label}>Match Type</div>
        <select 
            style={styles.select}
            value={matchType}
            onChange={(e) => setMatchType(e.target.value)}
        >
            <option value="Friendly">Friendly</option>
            <option value="Tournament">Tournament</option>
            <option value="Series">Series</option>
        </select>
      </section>

      {/* 4. Teams Section */}
      <section style={styles.section}>
        {/* Team A Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Team A</label>
          {!isCreatingTeamA ? (
              <select 
                style={styles.select} 
                value={teamAId} 
                onChange={(e) => {
                    if (e.target.value === 'new') {
                        setIsCreatingTeamA(true);
                    } else {
                        setTeamAId(e.target.value);
                    }
                }}
              >
                <option value="">-- Select Team --</option>
                {availableTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
                <option value="new">+ Create New Team</option>
              </select>
          ) : (
              <div style={styles.inputGroup}>
                  <input 
                    type="text" 
                    placeholder="Enter Team Name" 
                    style={styles.input}
                    value={newTeamAName}
                    onChange={(e) => setNewTeamAName(e.target.value)}
                  />
                  <button style={styles.smallButton} onClick={handleConfirmTeamA}>Confirm</button>
                  <button style={styles.cancelButton} onClick={() => setIsCreatingTeamA(false)}>Cancel</button>
              </div>
          )}
        </div>

        {/* Team B Selection */}
        <div>
          <label style={styles.label}>Team B</label>
          {!isCreatingTeamB ? (
              <select 
                style={styles.select} 
                value={teamBId} 
                onChange={(e) => {
                    if (e.target.value === 'new') {
                        setIsCreatingTeamB(true);
                    } else {
                        setTeamBId(e.target.value);
                    }
                }}
              >
                <option value="">-- Select Team --</option>
                {availableTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
                <option value="new">+ Create New Team</option>
              </select>
          ) : (
              <div style={styles.inputGroup}>
                  <input 
                    type="text" 
                    placeholder="Enter Team Name" 
                    style={styles.input}
                    value={newTeamBName}
                    onChange={(e) => setNewTeamBName(e.target.value)}
                  />
                  <button style={styles.smallButton} onClick={handleConfirmTeamB}>Confirm</button>
                  <button style={styles.cancelButton} onClick={() => setIsCreatingTeamB(false)}>Cancel</button>
              </div>
          )}
        </div>
      </section>

      {/* 5. Scorer Section */}
      <section style={styles.section}>
        <div style={styles.scorerText}>You (Rahul Kumar) will be the scorer for this match</div>
      </section>

      {/* 6. Action */}
      <div style={styles.section}>
        <button style={styles.button} onClick={handleStartMatch}>Start Match</button>
      </div>
    </div>
  );
};

export default StartMatch;
