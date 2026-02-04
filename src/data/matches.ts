import { Match } from '../domain/match';

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    sportId: 's1', // Cricket
    tournamentId: 'gully-cricket-championship',
    stage: 'Group A',
    date: '2026-02-04T10:00:00Z', // Today
    status: 'live',
    location: 'Central Ground, Bangalore',
    createdByUserId: 'u1',
    homeParticipant: {
      id: 't1',
      name: 'Royal Strikers',
      score: 145,
      wickets: 3,
      players: [
        { 
            playerId: 'p1', 
            runs: 75, balls: 45, wickets: 0, 
            catches: 1, runouts: 0 
        },
        { 
            playerId: 'p2', 
            runs: 32, balls: 20, wickets: 2, 
            ballsBowled: 24, runsConceded: 28, catches: 0 
        }
      ]
    },
    awayParticipant: {
      id: 't2',
      name: 'Thunder 11',
      score: 120,
      wickets: 4,
      players: [
        { 
            playerId: 'p5', 
            runs: 12, balls: 10, wickets: 3, 
            ballsBowled: 24, runsConceded: 35, catches: 1 
        }
      ]
    },
    events: [],
    officials: []
  },
  {
    id: 'm5',
    sportId: 's1', // Cricket
    tournamentId: 'gully-cricket-championship',
    stage: 'Group B',
    date: '2026-02-04T11:30:00Z', // Today
    status: 'live',
    location: 'East Ground, Bangalore',
    createdByUserId: 'u1',
    homeParticipant: {
      id: 't3',
      name: 'Rising Stars',
      score: 88,
      wickets: 1
    },
    awayParticipant: {
      id: 't4',
      name: 'Blue Whales',
      score: 92,
      wickets: 0
    },
    events: [],
    officials: []
  },
  {
    id: 'm3',
    sportId: 's1', // Cricket
    tournamentId: 't20-wc-2026',
    stage: 'Semi-Final 1',
    date: '2026-10-15T14:00:00Z', // Future
    status: 'draft',
    location: 'Wankhede Stadium, Mumbai',
    createdByUserId: 'u1',
    homeParticipant: {
      id: 'ind',
      name: 'India',
      score: 0
    },
    awayParticipant: {
      id: 'aus',
      name: 'Australia',
      score: 0
    },
    events: [],
    officials: []
  },
  {
    id: 'm4',
    sportId: 's1', // Cricket
    tournamentId: 'ipl-2026',
    stage: 'Qualifier 1',
    date: '2026-03-25T19:30:00Z', // Future
    status: 'draft',
    location: 'Chinnaswamy Stadium, Bangalore',
    createdByUserId: 'u1',
    homeParticipant: {
      id: 'rcb',
      name: 'RCB',
      score: 0
    },
    awayParticipant: {
      id: 'csk',
      name: 'CSK',
      score: 0
    },
    events: [],
    officials: []
  },
  {
    id: 'm2',
    sportId: 's1', // Cricket
    tournamentId: 'corp-cup-2025',
    stage: 'Final',
    date: '2025-11-10T14:00:00Z', // Past
    status: 'completed',
    location: 'City Arena',
    createdByUserId: 'u1',
    homeParticipant: {
      id: 't1',
      name: 'Royal Strikers',
      score: 180,
      result: 'win',
      wickets: 5
    },
    awayParticipant: {
      id: 't2',
      name: 'Thunder 11',
      score: 175,
      result: 'loss',
      wickets: 9
    },
    winnerId: 't1',
    events: [],
    officials: []
  }
];
