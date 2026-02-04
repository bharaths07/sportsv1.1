export interface Tournament {
  id: string;
  name: string;
  organizer: string;
  dates: string;
  location: string;
  description: string;
  bannerUrl: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't20-wc-2026',
    name: 'T20 World Cup 2026',
    organizer: 'ICC',
    dates: 'Oct 15 - Nov 14, 2026',
    location: 'India & Sri Lanka',
    description: 'The pinnacle of T20 cricket returns with 20 teams battling for the ultimate glory.',
    bannerUrl: 'https://placehold.co/1200x300/1a237e/ffffff?text=T20+World+Cup+2026',
    status: 'upcoming'
  },
  {
    id: 'ipl-2026',
    name: 'Indian Premier League 2026',
    organizer: 'BCCI',
    dates: 'Mar 25 - May 28, 2026',
    location: 'India',
    description: 'The biggest domestic T20 league in the world.',
    bannerUrl: 'https://placehold.co/1200x300/e65100/ffffff?text=IPL+2026',
    status: 'upcoming'
  },
  {
    id: 'gully-cricket-championship',
    name: 'Gully Cricket Championship',
    organizer: 'Local Sports Club',
    dates: 'Dec 10 - Dec 20, 2025',
    location: 'Bangalore',
    description: 'Local neighborhood cricket tournament for under-19 players.',
    bannerUrl: 'https://placehold.co/1200x300/2e7d32/ffffff?text=Gully+Cricket',
    status: 'ongoing'
  },
  {
    id: 'corp-cup-2025',
    name: 'Corporate Cup 2025',
    organizer: 'Tech Park Association',
    dates: 'Nov 01 - Nov 30, 2025',
    location: 'Bangalore Tech Park',
    description: 'Inter-corporate cricket tournament.',
    bannerUrl: 'https://placehold.co/1200x300/455a64/ffffff?text=Corporate+Cup',
    status: 'completed'
  }
];
