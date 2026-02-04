import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper';
  isCaptain?: boolean;
  isViceCaptain?: boolean;
}

interface TeamSquad {
  id: string;
  name: string;
  code: string;
  logo: string;
  squadSize: number;
  coach?: string;
  captainName?: string;
  note?: string; // e.g. "Defending Champions"
  players: Player[];
}

const MOCK_SQUADS: TeamSquad[] = [
  {
    id: 'ind',
    name: 'India',
    code: 'IND',
    logo: 'https://placehold.co/100x100/ff9933/ffffff?text=IND',
    squadSize: 15,
    coach: 'Gautam Gambhir',
    captainName: 'Rohit Sharma',
    note: 'Defending Champions',
    players: [
      { id: 'p1', name: 'Rohit Sharma', role: 'Batter', isCaptain: true },
      { id: 'p2', name: 'Yashasvi Jaiswal', role: 'Batter' },
      { id: 'p3', name: 'Virat Kohli', role: 'Batter' },
      { id: 'p4', name: 'Suryakumar Yadav', role: 'Batter' },
      { id: 'p5', name: 'Rishabh Pant', role: 'Wicket Keeper' },
      { id: 'p6', name: 'Hardik Pandya', role: 'All-Rounder', isViceCaptain: true },
      { id: 'p7', name: 'Ravindra Jadeja', role: 'All-Rounder' },
      { id: 'p8', name: 'Axar Patel', role: 'All-Rounder' },
      { id: 'p9', name: 'Kuldeep Yadav', role: 'Bowler' },
      { id: 'p10', name: 'Jasprit Bumrah', role: 'Bowler' },
      { id: 'p11', name: 'Arshdeep Singh', role: 'Bowler' },
      { id: 'p12', name: 'Mohammed Siraj', role: 'Bowler' },
      { id: 'p13', name: 'Sanju Samson', role: 'Wicket Keeper' },
      { id: 'p14', name: 'Shivam Dube', role: 'All-Rounder' },
      { id: 'p15', name: 'Yuzvendra Chahal', role: 'Bowler' },
    ]
  },
  {
    id: 'aus',
    name: 'Australia',
    code: 'AUS',
    logo: 'https://placehold.co/100x100/ffcc00/000000?text=AUS',
    squadSize: 15,
    coach: 'Andrew McDonald',
    captainName: 'Mitchell Marsh',
    note: '2021 Champions',
    players: [
      { id: 'a1', name: 'Mitchell Marsh', role: 'All-Rounder', isCaptain: true },
      { id: 'a2', name: 'Travis Head', role: 'Batter' },
      { id: 'a3', name: 'David Warner', role: 'Batter' },
      { id: 'a4', name: 'Glenn Maxwell', role: 'All-Rounder' },
      { id: 'a5', name: 'Marcus Stoinis', role: 'All-Rounder' },
      { id: 'a6', name: 'Tim David', role: 'Batter' },
      { id: 'a7', name: 'Matthew Wade', role: 'Wicket Keeper' },
      { id: 'a8', name: 'Pat Cummins', role: 'Bowler' },
      { id: 'a9', name: 'Mitchell Starc', role: 'Bowler' },
      { id: 'a10', name: 'Adam Zampa', role: 'Bowler' },
      { id: 'a11', name: 'Josh Hazlewood', role: 'Bowler' },
      { id: 'a12', name: 'Josh Inglis', role: 'Wicket Keeper' },
      { id: 'a13', name: 'Cameron Green', role: 'All-Rounder' },
      { id: 'a14', name: 'Ashton Agar', role: 'Bowler' },
      { id: 'a15', name: 'Nathan Ellis', role: 'Bowler' },
    ]
  },
  {
    id: 'eng',
    name: 'England',
    code: 'ENG',
    logo: 'https://placehold.co/100x100/ce1124/ffffff?text=ENG',
    squadSize: 15,
    coach: 'Matthew Mott',
    captainName: 'Jos Buttler',
    note: '2022 Champions',
    players: [
      { id: 'e1', name: 'Jos Buttler', role: 'Wicket Keeper', isCaptain: true },
      { id: 'e2', name: 'Phil Salt', role: 'Wicket Keeper' },
      { id: 'e3', name: 'Will Jacks', role: 'Batter' },
      { id: 'e4', name: 'Jonny Bairstow', role: 'Batter' },
      { id: 'e5', name: 'Harry Brook', role: 'Batter' },
      { id: 'e6', name: 'Moeen Ali', role: 'All-Rounder' },
      { id: 'e7', name: 'Liam Livingstone', role: 'All-Rounder' },
      { id: 'e8', name: 'Sam Curran', role: 'All-Rounder' },
      { id: 'e9', name: 'Chris Jordan', role: 'Bowler' },
      { id: 'e10', name: 'Jofra Archer', role: 'Bowler' },
      { id: 'e11', name: 'Adil Rashid', role: 'Bowler' },
      { id: 'e12', name: 'Mark Wood', role: 'Bowler' },
      { id: 'e13', name: 'Reece Topley', role: 'Bowler' },
      { id: 'e14', name: 'Ben Duckett', role: 'Batter' },
      { id: 'e15', name: 'Tom Hartley', role: 'Bowler' },
    ]
  },
  {
    id: 'rsa',
    name: 'South Africa',
    code: 'RSA',
    logo: 'https://placehold.co/100x100/007749/ffffff?text=RSA',
    squadSize: 15,
    coach: 'Rob Walter',
    captainName: 'Aiden Markram',
    players: [
      { id: 's1', name: 'Aiden Markram', role: 'Batter', isCaptain: true },
      { id: 's2', name: 'Quinton de Kock', role: 'Wicket Keeper' },
      { id: 's3', name: 'Reeza Hendricks', role: 'Batter' },
      { id: 's4', name: 'Heinrich Klaasen', role: 'Wicket Keeper' },
      { id: 's5', name: 'David Miller', role: 'Batter' },
      { id: 's6', name: 'Tristan Stubbs', role: 'Batter' },
      { id: 's7', name: 'Marco Jansen', role: 'All-Rounder' },
      { id: 's8', name: 'Keshav Maharaj', role: 'Bowler' },
      { id: 's9', name: 'Kagiso Rabada', role: 'Bowler' },
      { id: 's10', name: 'Anrich Nortje', role: 'Bowler' },
      { id: 's11', name: 'Tabraiz Shamsi', role: 'Bowler' },
      { id: 's12', name: 'Ottneil Baartman', role: 'Bowler' },
      { id: 's13', name: 'Gerald Coetzee', role: 'Bowler' },
      { id: 's14', name: 'Bjorn Fortuin', role: 'Bowler' },
      { id: 's15', name: 'Ryan Rickelton', role: 'Wicket Keeper' },
    ]
  }
];

interface TournamentSquadsTabProps {
  initialSelectedTeamId?: string;
}

export const TournamentSquadsTab: React.FC<TournamentSquadsTabProps> = ({ initialSelectedTeamId }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(initialSelectedTeamId || MOCK_SQUADS[0].id);
  const navigate = useNavigate();

  const selectedTeam = MOCK_SQUADS.find(t => t.id === selectedTeamId) || MOCK_SQUADS[0];

  // Group players by role for better readability
  const groupedPlayers = {
    'Batters': selectedTeam.players.filter(p => p.role === 'Batter'),
    'Wicket Keepers': selectedTeam.players.filter(p => p.role === 'Wicket Keeper'),
    'All-Rounders': selectedTeam.players.filter(p => p.role === 'All-Rounder'),
    'Bowlers': selectedTeam.players.filter(p => p.role === 'Bowler'),
  };

  const roleOrder = ['Batters', 'Wicket Keepers', 'All-Rounders', 'Bowlers'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Team List (Entry Level) */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Participating Teams</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '16px' 
        }}>
          {MOCK_SQUADS.map((team) => {
            const isSelected = team.id === selectedTeamId;
            return (
              <div 
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                style={{
                  backgroundColor: isSelected ? '#eff6ff' : 'white',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: isSelected ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 'none'
                }}
              >
                <img 
                  src={team.logo} 
                  alt={team.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>{team.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{team.squadSize} Players</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Selected Team Details (Master-Detail View) */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden' 
      }}>
        {/* Team Context Header */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img 
              src={selectedTeam.logo} 
              alt={selectedTeam.name} 
              style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
            />
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{selectedTeam.name}</h2>
              {selectedTeam.note && (
                <div style={{ 
                  marginTop: '4px', 
                  display: 'inline-block', 
                  backgroundColor: '#e0f2fe', 
                  color: '#0369a1', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  padding: '2px 8px', 
                  borderRadius: '12px' 
                }}>
                  {selectedTeam.note}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
             {selectedTeam.captainName && (
               <div style={{ fontSize: '14px', color: '#475569' }}>
                 Captain: <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTeam.captainName}</span>
               </div>
             )}
             {selectedTeam.coach && (
               <div style={{ fontSize: '14px', color: '#475569' }}>
                 Coach: <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTeam.coach}</span>
               </div>
             )}
             
             {/* 5. Team Page Link */}
             <button 
                onClick={() => navigate(`/team/${selectedTeam.id}`)}
                style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  textAlign: 'right'
                }}
             >
               View Team Profile →
             </button>
          </div>
        </div>

        {/* 3. Squad List */}
        <div style={{ padding: '24px' }}>
          {roleOrder.map((role) => {
            const players = groupedPlayers[role as keyof typeof groupedPlayers];
            if (!players || players.length === 0) return null;

            return (
              <div key={role} style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  color: '#64748b', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px',
                  marginBottom: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '8px'
                }}>
                  {role}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                  {players.map(player => (
                    <div key={player.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9'
                    }}>
                      <div style={{ 
                        width: '32px', height: '32px', 
                        backgroundColor: '#e2e8f0', 
                        borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 600, color: '#64748b'
                      }}>
                        {player.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {player.name}
                          {player.isCaptain && (
                            <span style={{ 
                              backgroundColor: '#0f172a', color: 'white', 
                              fontSize: '10px', padding: '1px 5px', borderRadius: '4px' 
                            }}>C</span>
                          )}
                          {player.role === 'Wicket Keeper' && (
                            <span style={{ 
                              backgroundColor: '#475569', color: 'white', 
                              fontSize: '10px', padding: '1px 5px', borderRadius: '4px' 
                            }}>WK</span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{player.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
