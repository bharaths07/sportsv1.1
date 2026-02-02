import React from 'react';

const StartTournament: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      {/* 1. Page Header */}
      <header style={{ marginBottom: '20px' }}>
        <h1>Start Tournament / Series</h1>
        <p>Create a tournament to organize multiple matches</p>
      </header>

      {/* 2. Tournament Details Section */}
      <section style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tournament / Series Name</label>
          <input type="text" placeholder="Enter tournament name" style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Sport</label>
          <select style={{ width: '100%', padding: '8px' }}>
            <option value="">Select Sport</option>
            <option value="cricket">Cricket</option>
            <option value="kabaddi">Kabaddi</option>
            <option value="football">Football</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Location</label>
          <input type="text" placeholder="City / District" style={{ width: '100%', padding: '8px' }} />
        </div>
      </section>

      {/* 3. Organizer Section */}
      <section style={{ marginBottom: '20px' }}>
        <p>You will be the organizer of this tournament</p>
      </section>

      {/* 4. Action */}
      <section>
        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Create Tournament
        </button>
      </section>
    </div>
  );
};

export default StartTournament;
