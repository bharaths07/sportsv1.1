import { Team } from '../domain/team';

export const MOCK_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Royal Strikers',
    sportId: 's1', // Cricket
    type: 'club',
    captainId: 'p1',
    coach: 'Ravi Shastri',
    foundedYear: 2015,
    about: 'The premier cricket club of the region, known for aggressive batting and disciplined bowling. 3-time regional champions.',
    achievements: [
      { title: 'Champions', season: '2023', tournamentName: 'City League' },
      { title: 'Runner Up', season: '2022', tournamentName: 'Winter Cup' }
    ],
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
    lastMatchAt: '2024-02-01T10:00:00Z',
    members: [
      { playerId: 'p1', role: 'captain', joinedAt: '2023-01-01T00:00:00Z' },
      { playerId: 'p2', role: 'member', joinedAt: '2023-01-02T00:00:00Z' }
    ]
  },
  {
    id: 't2',
    name: 'Thunder 11',
    sportId: 's1', // Cricket
    type: 'street',
    captainId: 'p5',
    foundedYear: 2020,
    about: 'A group of passionate street cricketers playing every weekend.',
    active: true,
    createdAt: '2023-02-01T00:00:00Z',
    lastMatchAt: '2024-01-28T14:30:00Z',
    members: [
      { playerId: 'p5', role: 'captain', joinedAt: '2023-02-01T00:00:00Z' }
    ]
  },
  {
    id: 't3',
    name: 'United FC',
    sportId: 's2', // Football
    type: 'club',
    captainId: 'p3',
    coach: 'Alex Ferguson',
    foundedYear: 2018,
    about: 'United we stand, united we score. Focus on youth development.',
    active: true,
    createdAt: '2023-03-01T00:00:00Z',
    lastMatchAt: '2023-12-15T09:00:00Z',
    members: [
      { playerId: 'p3', role: 'captain', joinedAt: '2023-03-01T00:00:00Z' },
      { playerId: 'p4', role: 'member', joinedAt: '2023-03-02T00:00:00Z' }
    ]
  },
  {
    id: 't4',
    name: 'Corporate Kings',
    sportId: 's1', // Cricket
    type: 'corporate',
    captainId: 'p6',
    foundedYear: 2021,
    active: true,
    createdAt: '2023-06-01T00:00:00Z',
    lastMatchAt: '2024-02-03T16:00:00Z',
    members: [
      { playerId: 'p6', role: 'captain', joinedAt: '2023-06-01T00:00:00Z' },
      { playerId: 'p7', role: 'member', joinedAt: '2023-06-02T00:00:00Z' },
      { playerId: 'p8', role: 'member', joinedAt: '2023-06-03T00:00:00Z' }
    ]
  },
  {
    id: 't5',
    name: 'City College XI',
    sportId: 's1', // Cricket
    type: 'school',
    captainId: 'p9',
    coach: 'Mr. Sharma',
    foundedYear: 1995,
    about: 'Representing City College in inter-collegiate tournaments.',
    active: true,
    createdAt: '2023-09-01T00:00:00Z',
    lastMatchAt: '2023-11-20T10:00:00Z',
    members: [
      { playerId: 'p9', role: 'captain', joinedAt: '2023-09-01T00:00:00Z' },
      { playerId: 'p10', role: 'member', joinedAt: '2023-09-02T00:00:00Z' }
    ]
  }
];
