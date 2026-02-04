import { Player } from '../domain/player';

export const MOCK_PLAYERS: Player[] = [
  {
    id: 'p1',
    firstName: 'Rahul',
    lastName: 'Kumar',
    active: true,
    role: 'Batsman',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm offbreak',
    jerseyNumber: 18,
    stats: { matchesPlayed: 15, wins: 10, losses: 5, draws: 0, scoreAccumulated: 450 },
    history: [],
    primarySportId: 's1' // Cricket
  },
  {
    id: 'p2',
    firstName: 'Priya',
    lastName: 'Sharma',
    active: true,
    role: 'All-Rounder',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Left-arm orthodox',
    jerseyNumber: 7,
    stats: { matchesPlayed: 12, wins: 8, losses: 4, draws: 0, scoreAccumulated: 320 },
    history: [],
    primarySportId: 's1'
  },
  {
    id: 'p3',
    firstName: 'Amit',
    lastName: 'Patel',
    active: true,
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    jerseyNumber: 93,
    stats: { matchesPlayed: 20, wins: 15, losses: 5, draws: 0, scoreAccumulated: 800 },
    history: [],
    primarySportId: 's2' // Football (Role mismatch intentional for demo variety, or fix data)
  },
  {
    id: 'p4',
    firstName: 'Sneha',
    lastName: 'Gupta',
    active: true,
    role: 'Wicket Keeper',
    battingStyle: 'Right-hand bat',
    jerseyNumber: 1,
    stats: { matchesPlayed: 5, wins: 2, losses: 3, draws: 0, scoreAccumulated: 150 },
    history: [],
    primarySportId: 's2'
  },
  {
    id: 'p5',
    firstName: 'Vikram',
    lastName: 'Singh',
    active: true,
    role: 'Batsman',
    battingStyle: 'Left-hand bat',
    jerseyNumber: 45,
    stats: { matchesPlayed: 30, wins: 20, losses: 10, draws: 0, scoreAccumulated: 1200 },
    history: [],
    primarySportId: 's1'
  }
];
