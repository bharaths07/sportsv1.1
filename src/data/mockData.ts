import { User, Sport, Team, Match, Certificate, FeedItem } from '../types/models';

// 1. Users
export const users: User[] = [
  {
    id: 'u1',
    name: 'Rahul Kumar',
    email: 'rahul.k@sportsync.com',
    type: 'player',
    district: 'Bangalore Urban',
    institution: 'National College',
    profilePhoto: null
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'priya.s@sportsync.com',
    type: 'organizer',
    district: 'Bangalore Urban',
    institution: 'National College',
    profilePhoto: null
  }
];

// 2. Sports
export const sports: Sport[] = [
  { id: 's1', name: 'Cricket' },
  { id: 's2', name: 'Kabaddi' },
  { id: 's3', name: 'Football' }
];

// 3. Teams
export const teams: Team[] = [
  // Cricket Teams
  { id: 't1', name: 'Royal Strikers', sportId: 's1' },
  { id: 't2', name: 'Thunder 11', sportId: 's1' },
  // Kabaddi Teams
  { id: 't3', name: 'Warrior Raiders', sportId: 's2' },
  { id: 't4', name: 'Seven Stars', sportId: 's2' },
  // Football Teams
  { id: 't5', name: 'United FC', sportId: 's3' },
  { id: 't6', name: 'City Breakers', sportId: 's3' }
];

// 4. Matches
export const matches: Match[] = [
  {
    id: 'm1',
    sportId: 's1',
    teamAId: 't1',
    teamBId: 't2',
    date: '2023-11-15T10:00:00',
    location: 'Central Ground, Bangalore',
    status: 'live',
    score: '85/2 (10 ov) vs 0/0',
    createdByUserId: 'u1',
    scorerIds: ['u1']
  },
  {
    id: 'm2',
    sportId: 's3',
    teamAId: 't5',
    teamBId: 't6',
    date: '2023-11-20T16:00:00',
    location: 'City Arena',
    status: 'draft',
    createdByUserId: 'u2',
    scorerIds: ['u2']
  },
  {
    id: 'm3',
    sportId: 's2',
    teamAId: 't3',
    teamBId: 't4',
    date: '2023-11-10T09:00:00',
    location: 'Indoor Stadium',
    status: 'completed',
    score: '35 - 28',
    createdByUserId: 'u1',
    scorerIds: ['u2']
  }
];

// 5. Certificates
const staticCertificates: Certificate[] = [
  {
    id: 'c1',
    userId: 'u1',
    matchId: 'm3',
    title: 'Man of the Match',
    achievement: 'Best Raider',
    date: '2023-11-10'
  }
];

// Helper to generate certificates for completed matches
const derivedCertificates: Certificate[] = matches
  .filter(m => m.status === 'completed')
  .map((m) => ({

    id: `cert-auto-${m.id}`,
    userId: 'p1', // Assign to Rahul Kumar (p1) for all completed matches
    matchId: m.id,
    title: 'Match Participation Certificate',
    achievement: 'Participation',
    date: m.date.split('T')[0]
  }));

export const certificates: Certificate[] = [
  ...staticCertificates,
  // Avoid duplicates if static certificate already covers the match/user/type
  ...derivedCertificates.filter(dc => 
    !staticCertificates.some(sc => sc.matchId === dc.matchId && sc.title === dc.title)
  )
];

// 6. Feed Items
export const feedItems: FeedItem[] = [
  {
    id: 'f1',
    type: 'match',
    source: 'Match Update',
    title: 'Warrior Raiders won!',
    description: 'Warrior Raiders defeated Seven Stars 35-28 in the Kabaddi finals.',
    time: '2 hours ago'
  },
  {
    id: 'f2',
    type: 'certificate',
    source: 'Achievement',
    title: 'New Certificate Earned',
    description: 'Rahul Kumar earned "Best Raider" in the Inter-College Kabaddi Match.',
    time: '5 hours ago'
  },
  {
    id: 'f3',
    type: 'news',
    source: 'Sports News',
    title: 'District Tournament Registration',
    description: 'Registration for the annual District Cricket Tournament is now open.',
    time: '1 day ago'
  }
];
