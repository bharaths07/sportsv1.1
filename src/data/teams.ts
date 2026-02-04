import { Team } from '../domain/team';

export const MOCK_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Royal Strikers',
    sportId: 's1', // Cricket
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
    members: [
      { playerId: 'p1', role: 'captain', joinedAt: '2023-01-01T00:00:00Z' },
      { playerId: 'p2', role: 'member', joinedAt: '2023-01-02T00:00:00Z' }
    ]
  },
  {
    id: 't2',
    name: 'Thunder 11',
    sportId: 's1', // Cricket
    active: true,
    createdAt: '2023-02-01T00:00:00Z',
    members: [
      { playerId: 'p5', role: 'captain', joinedAt: '2023-02-01T00:00:00Z' }
    ]
  },
  {
    id: 't3',
    name: 'United FC',
    sportId: 's2', // Football
    active: true,
    createdAt: '2023-03-01T00:00:00Z',
    members: [
      { playerId: 'p3', role: 'captain', joinedAt: '2023-03-01T00:00:00Z' },
      { playerId: 'p4', role: 'member', joinedAt: '2023-03-02T00:00:00Z' }
    ]
  }
];
