import { Match } from '../domain/match';

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    sportId: 's1', // Cricket
    date: '2023-11-20T10:00:00Z', // Today/Live
    status: 'live',
    location: 'Central Ground, Bangalore',
    createdByUserId: 'u1',
    homeParticipant: {
      id: 't1',
      name: 'Royal Strikers',
      score: 145
    },
    awayParticipant: {
      id: 't2',
      name: 'Thunder 11',
      score: 120
    },
    events: [],
    officials: []
  },
  {
    id: 'm2',
    sportId: 's1', // Cricket
    date: '2023-11-10T14:00:00Z', // Past
    status: 'completed',
    location: 'City Arena',
    createdByUserId: 'u1',
    homeParticipant: {
      id: 't1',
      name: 'Royal Strikers',
      score: 180,
      result: 'win'
    },
    awayParticipant: {
      id: 't2',
      name: 'Thunder 11',
      score: 175,
      result: 'loss'
    },
    winnerId: 't1',
    events: [],
    officials: []
  }
];
