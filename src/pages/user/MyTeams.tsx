import React from 'react';
import { teams, sports, matches } from '../../data/mockData';
import { Team } from '../../types/models';

const MyTeams: React.FC = () => {
  const currentUserId = 'u1'; // Mock logged-in user (Rahul Kumar)

  // Helper to determine if a team was created by the current user
  // Since the Team model doesn't have createdByUserId yet, we simulate it:
  // 1. Mock IDs 't1' and 't3' are assumed to be created by u1.
  // 2. Any dynamically created team (ID starts with 't-') is assumed to be created by u1 in this session.
  const isCreatedByCurrentUser = (team: Team) => {
    const isMockCreated = ['t1', 't3'].includes(team.id);
    const isDynamicCreated = team.id.startsWith('t-');
    return isMockCreated || isDynamicCreated;
  };

  // Helper to determine if the user played for a team
  // We assume u1 plays for t1, t3, and t5 based on the mock scenario.
  // For dynamic teams, if u1 created it, we assume they play for it too (though we filter "Created" ones out for the second section).
  // But strictly, we check if the team is in the "played" list.
  const userPlayedTeamIds = ['t1', 't3', 't5'];
  
  const hasUserPlayedForTeam = (team: Team) => {
    // Check hardcoded mock participation
    if (userPlayedTeamIds.includes(team.id)) return true;
    
    // Check dynamic matches for participation (if any match involves this team)
    // Note: StartMatch adds matches to the 'matches' array.
    // If a match exists with this team, and u1 created the match (which StartMatch does), u1 is involved.
    const involvedInMatch = matches.some(m => m.teamAId === team.id || m.teamBId === team.id);
    if (team.id.startsWith('t-') && involvedInMatch) return true;
    
    return false;
  };

  // 1. Teams I Created
  const myCreatedTeams = teams.filter(t => isCreatedByCurrentUser(t));

  // 2. Teams I Played For (Participated AND NOT Created)
  const myPlayedTeams = teams.filter(t => {
    const played = hasUserPlayedForTeam(t);
    const created = isCreatedByCurrentUser(t);
    return played && !created;
  });

  // Styles
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'sans-serif'
    },
    header: {
      marginBottom: '30px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '10px'
    },
    section: {
      marginBottom: '30px'
    },
    sectionTitle: {
      fontSize: '1.2em',
      fontWeight: 'bold',
      marginBottom: '15px',
      borderBottom: '1px dashed #ccc',
      paddingBottom: '5px'
    },
    cardList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px'
    },
    card: {
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '4px',
      backgroundColor: '#fff'
    },
    emptyState: {
      fontStyle: 'italic',
      color: '#666',
      padding: '10px 0'
    }
  };

  const renderTeamCard = (team: Team, isCreatedByMe: boolean) => {
    const sport = sports.find(s => s.id === team.sportId);
    return (
      <div key={team.id} style={styles.card}>
        <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{team.name}</div>
        <div style={{ marginTop: '5px' }}>Sport: {sport?.name || 'Unknown'}</div>
        <div style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
          Created By: {isCreatedByMe ? 'You' : 'Other'}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* 1. Page Header */}
      <header style={styles.header}>
        <h1 style={{ margin: '0 0 5px 0' }}>My Teams</h1>
        <div style={{ color: '#666' }}>Teams you created or played for</div>
      </header>

      {/* 2. Teams I Created Section */}
      <section style={styles.section}>
        <div style={styles.sectionTitle}>Teams I Created</div>
        <div style={styles.cardList}>
          {myCreatedTeams.length > 0 ? (
            myCreatedTeams.map(team => renderTeamCard(team, true))
          ) : (
            <div style={styles.emptyState}>You haven’t created any teams yet</div>
          )}
        </div>
      </section>

      {/* 3. Teams I Played For Section */}
      <section style={styles.section}>
        <div style={styles.sectionTitle}>Teams I Played For</div>
        <div style={styles.cardList}>
          {myPlayedTeams.length > 0 ? (
            myPlayedTeams.map(team => renderTeamCard(team, false))
          ) : (
            <div style={styles.emptyState}>No teams played for yet</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyTeams;
