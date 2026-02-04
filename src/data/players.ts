import { Player } from '../domain/player';

export const MOCK_PLAYERS: Player[] = [
  {
    id: 'p1',
    firstName: 'Rahul',
    lastName: 'Kumar',
    active: true,
    stats: { matchesPlayed: 15, wins: 10, losses: 5, draws: 0, scoreAccumulated: 450 },
    history: [],
    primarySportId: 's1' // Cricket
  },
  {
    id: 'p2',
    firstName: 'Priya',
    lastName: 'Sharma',
    active: true,
    stats: { matchesPlayed: 12, wins: 8, losses: 4, draws: 0, scoreAccumulated: 320 },
    history: [],
    primarySportId: 's1'
  },
  {
    id: 'p3',
    firstName: 'Amit',
    lastName: 'Patel',
    active: true,
    stats: { matchesPlayed: 20, wins: 15, losses: 5, draws: 0, scoreAccumulated: 800 },
    history: [],
    primarySportId: 's2' // Football
  },
  {
    id: 'p4',
    firstName: 'Sneha',
    lastName: 'Gupta',
    active: true,
    stats: { matchesPlayed: 5, wins: 2, losses: 3, draws: 0, scoreAccumulated: 150 },
    history: [],
    primarySportId: 's2'
  },
  {
    id: 'p5',
    firstName: 'Vikram',
    lastName: 'Singh',
    active: true,
    stats: { matchesPlayed: 30, wins: 20, losses: 10, draws: 0, scoreAccumulated: 1200 },
    history: [],
    primarySportId: 's1'
  }
];
