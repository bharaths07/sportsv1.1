import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TournamentHeader } from './components/TournamentHeader';
import { TournamentTabs } from './components/TournamentTabs';
import { FeaturedMatches, FeaturedMatch } from './components/FeaturedMatches';
import { SquadList } from './components/SquadList';
import { TournamentLeaderboard } from './components/TournamentLeaderboard';
import { MOCK_TOURNAMENTS } from '../../data/tournaments';
import { MOCK_MATCHES } from '../../data/matches';
import { TournamentMatchesTab } from './TournamentMatchesTab';
import { TournamentStatus } from './components/TournamentStatus';

import { TournamentPointsTable } from './TournamentPointsTable';
import { TournamentSquadsTab } from './TournamentSquadsTab';

export const TournamentScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { activeTab?: string; initialSelectedTeamId?: string } | null;

  const [activeTab, setActiveTab] = useState(locationState?.activeTab || 'Overview');
  const [initialSelectedTeamId, setInitialSelectedTeamId] = useState<string | undefined>(locationState?.initialSelectedTeamId);

  // Find tournament data
  const tournament = MOCK_TOURNAMENTS.find(t => t.id === id) || MOCK_TOURNAMENTS[0];
  
  // Get tournament matches for the Matches tab
  const tournamentMatches = MOCK_MATCHES.filter(m => m.tournamentId === (id || tournament.id));

  // Mock Matches Data (matching reference image logic)
  const mockMatches: FeaturedMatch[] = [
    {
      id: 'm1',
      team1: { name: 'Namibia', code: 'NAM', flag: 'https://placehold.co/100x100/003580/ffffff?text=NAM' },
      team2: { name: 'Scotland', code: 'SCO', flag: 'https://placehold.co/100x100/004b87/ffffff?text=SCO' },
      status: 'Toss Delayed',
    },
    {
      id: 'm2',
      team1: { name: 'Afghanistan', code: 'AFG', flag: 'https://placehold.co/100x100/cf1124/ffffff?text=AFG' },
      team2: { name: 'West Indies', code: 'WI', flag: 'https://placehold.co/100x100/7b0028/ffffff?text=WI' },
      status: 'Feb 4, 3:00 PM',
      resultNote: '8th T20 on'
    },
    {
      id: 'm3',
      team1: { name: 'Nepal', code: 'NEP', flag: 'https://placehold.co/100x100/dc143c/ffffff?text=NEP', score: '148/3', overs: '17.0' },
      team2: { name: 'UAE', code: 'UAE', flag: 'https://placehold.co/100x100/00732f/ffffff?text=UAE', score: '145/6', overs: '20.0' },
      status: 'NEP Won',
      resultNote: '6th T20 WC Warm up 2026'
    }
  ];

  // Mock Squads Data
  const mockSquads = [
    { id: 'ind', name: 'India', code: 'IND', flag: 'https://placehold.co/100x100/ff9933/ffffff?text=IND' },
    { id: 'pak', name: 'Pakistan', code: 'PAK', flag: 'https://placehold.co/100x100/006600/ffffff?text=PAK' },
    { id: 'nz', name: 'New Zealand', code: 'NZ', flag: 'https://placehold.co/100x100/000000/ffffff?text=NZ' },
    { id: 'aus', name: 'Australia', code: 'AUS', flag: 'https://placehold.co/100x100/ffcc00/000000?text=AUS' },
    { id: 'rsa', name: 'South Africa', code: 'RSA', flag: 'https://placehold.co/100x100/007749/ffffff?text=RSA' },
    { id: 'wi', name: 'West Indies', code: 'WI', flag: 'https://placehold.co/100x100/7b0028/ffffff?text=WI' },
    { id: 'eng', name: 'England', code: 'ENG', flag: 'https://placehold.co/100x100/ce1124/ffffff?text=ENG' },
  ];

  const handleTeamClick = (teamId: string) => {
    setInitialSelectedTeamId(teamId);
    setActiveTab('Squads');
    window.scrollTo(0, 0);
  };

  const handleViewAllMatches = () => {
    setActiveTab('Matches');
    window.scrollTo(0, 0);
  };

  const handleMatchClick = (matchId: string) => {
    navigate(`/match/${matchId}`, {
      state: {
        tournamentId: id,
        stage: 'League Stage', // Hardcoded for now, can be dynamic later
        returnPath: `/tournament/${id}`
      }
    });
  };

  // Mock Stats Data Removed (KeyStats replacement)

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      <TournamentHeader tournament={tournament} />
      <TournamentTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '32px auto', 
        padding: '0 24px', 
        display: 'grid', 
        gridTemplateColumns: (activeTab === 'Matches' || activeTab === 'Points Table' || activeTab === 'Squads' || activeTab === 'Leaderboard') ? '1fr' : '1fr 340px', 
        gap: '32px' 
      }}>
        {/* Left Column: Primary Content */}
        <div>
          {activeTab === 'Overview' && (
            <>
              <TournamentStatus 
                stage="League Stage" 
                progress="12 of 30 matches completed" 
                nextMatch="AFG vs WI – Feb 4, 3:00 PM" 
              />
              <FeaturedMatches matches={mockMatches} onViewAllClick={handleViewAllMatches} onMatchClick={handleMatchClick} />
              <SquadList squads={mockSquads} onTeamClick={handleTeamClick} />
              
              {/* Series Info */}
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>Series Info</h2>
                <div style={{ 
                  backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0',
                  display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Organizer</span>
                    <span style={{ color: '#0f172a', fontWeight: 500, fontSize: '14px' }}>International Cricket Council</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Format</span>
                    <span style={{ color: '#0f172a', fontWeight: 500, fontSize: '14px' }}>T20 International</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Venues</span>
                    <span style={{ color: '#0f172a', fontWeight: 500, fontSize: '14px' }}>9 Stadiums across 2 Countries</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Qualification</span>
                    <span style={{ color: '#0f172a', fontWeight: 500, fontSize: '14px' }}>Top 2 from each group qualify for Super 8s</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Matches' && (
             <TournamentMatchesTab matches={tournamentMatches} />
          )}

          {activeTab === 'Points Table' && (
             <TournamentPointsTable />
          )}

          {activeTab === 'Squads' && (
             <TournamentSquadsTab initialSelectedTeamId={initialSelectedTeamId} />
          )}

          {activeTab === 'Leaderboard' && (
             <TournamentLeaderboard />
          )}
          
          {activeTab !== 'Overview' && activeTab !== 'Matches' && activeTab !== 'Points Table' && activeTab !== 'Squads' && activeTab !== 'Leaderboard' && (
             <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
               Content for {activeTab} tab
             </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        {activeTab !== 'Matches' && activeTab !== 'Points Table' && activeTab !== 'Squads' && activeTab !== 'Leaderboard' && (
          <div>
            {/* KeyStats removed from sidebar */}
            
            {/* Ad Placeholder */}
            <div style={{ 
              marginTop: '24px', height: '250px', backgroundColor: '#e2e8f0', borderRadius: '8px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' 
            }}>
              Ad Space
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
