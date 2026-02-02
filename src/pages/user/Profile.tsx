import React from 'react';
import { users, matches, certificates, sports } from '../../data/mockData';

const Profile: React.FC = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    },
    header: {
      marginBottom: '30px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '10px'
    },
    section: {
      marginBottom: '30px',
      border: '1px solid #eee',
      padding: '15px',
      borderRadius: '4px'
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: '15px',
      display: 'block',
      fontSize: '1.2em'
    },
    row: {
      marginBottom: '10px',
      display: 'flex',
      gap: '10px'
    },
    label: {
      fontWeight: 'bold',
      width: '150px'
    },
    linkText: {
        color: 'blue',
        textDecoration: 'underline',
        cursor: 'pointer',
        marginRight: '20px'
    }
  };

  // 1. Current User (Rahul Kumar - u1)
  const currentUserId = 'u1';
  const currentUser = users.find(u => u.id === currentUserId);

  if (!currentUser) {
    return <div style={styles.container}>User not found</div>;
  }

  // 2. Derive User's Matches
  // Since models don't link players to teams/matches directly yet,
  // we assume for this mock profile that Rahul (u1) is involved in matches
  // where he has a certificate OR simply assume he plays for 'Warrior Raiders' (t3) or 'Royal Strikers' (t1) based on context.
  // However, to be "derived from user's matches" in a strict mock sense without updated models:
  // We can treat ALL matches in the mock data as "User's Matches" for the sake of the profile demo,
  // OR strictly filter by what we know.
  // Given previous tasks, we know u1 is "Rahul Kumar".
  // In `mockData.ts`, certificates link u1 to m3.
  // Let's broaden the assumption:
  // - Matches Played: All matches where user has a certificate + any others we arbitrarily assign?
  // - Better approach: Filter matches where user is involved.
  //   Since `Match` model lacks `playerIds`, and `Team` lacks `playerIds`,
  //   we will assume Rahul plays for:
  //   - Cricket: Royal Strikers (t1) -> Match m1
  //   - Kabaddi: Warrior Raiders (t3) -> Match m3
  //   - Football: United FC (t5) -> Match m2 (Upcoming)
  //   Let's define this involvement locally for calculation.
  
  const userTeamIds = ['t1', 't3', 't5']; // Mock assumption: Rahul plays for these teams
  const userMatches = matches.filter(m => 
    userTeamIds.includes(m.teamAId) || userTeamIds.includes(m.teamBId)
  );

  // 3. Derive Sports
  const userSportIds = Array.from(new Set(userMatches.map(m => m.sportId)));
  const userSports = sports.filter(s => userSportIds.includes(s.id));

  // 4. Stats
  const matchesPlayedCount = userMatches.filter(m => m.status === 'completed' || m.status === 'live').length;
  // "Matches Scored" - Assume he scored matches he created? 
  // We don't have `createdBy` in standard Match model yet (only in-memory extension in StartMatch).
  // Let's assume 0 for now or use a mock number for the MVP display.
  // Or, since he is a "Player", maybe 0 is accurate.
  const matchesScoredCount = 0; 
  
  const certificatesEarnedCount = certificates.filter(c => c.userId === currentUserId).length;

  return (
    <div style={styles.container}>
      {/* 1. Page Header */}
      <header style={styles.header}>
        <h1>My Profile</h1>
        <p>Your sports identity</p>
      </header>

      {/* 2. Basic Information Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Basic Information</span>
        <div style={styles.row}>
            <span style={styles.label}>User Name:</span>
            <span>{currentUser.name}</span>
        </div>
        <div style={styles.row}>
            <span style={styles.label}>Email / Phone:</span>
            <span>{currentUser.email}</span>
        </div>
        <div style={styles.row}>
            <span style={styles.label}>Institution:</span>
            <span>{currentUser.institution}</span>
        </div>
        <div style={styles.row}>
            <span style={styles.label}>Location:</span>
            <span>{currentUser.district}</span>
        </div>
        <div style={styles.row}>
            <span style={styles.label}>User Type:</span>
            <span>{currentUser.type.charAt(0).toUpperCase() + currentUser.type.slice(1)}</span>
        </div>
      </section>

      {/* 3. Sports Overview Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Sports</span>
        {userSports.length > 0 ? (
          userSports.map(sport => (
            <div key={sport.id} style={styles.row}>- {sport.name}</div>
          ))
        ) : (
          <div>No sports activity yet</div>
        )}
      </section>

      {/* 4. Activity Summary Section */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Activity Summary</span>
        <div style={styles.row}>
            <span style={styles.label}>Matches Played:</span>
            <span>{matchesPlayedCount}</span>
        </div>
        <div style={styles.row}>
            <span style={styles.label}>Matches Scored:</span>
            <span>{matchesScoredCount}</span>
        </div>
        <div style={styles.row}>
            <span style={styles.label}>Certificates Earned:</span>
            <span>{certificatesEarnedCount}</span>
        </div>
      </section>

      {/* 5. Navigation / Actions (read-only) */}
      <section style={styles.section}>
        <span style={styles.sectionTitle}>Actions</span>
        <div>
            <span style={styles.linkText} onClick={() => window.location.href = '/my-matches'}>View My Matches</span>
            <span style={styles.linkText} onClick={() => window.location.href = '/certificates'}>View Certificates</span>
        </div>
      </section>
    </div>
  );
};

export default Profile;
