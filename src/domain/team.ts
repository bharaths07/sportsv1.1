export type TeamType = 'club' | 'corporate' | 'street' | 'school' | 'other';

export interface TeamMember {
  playerId: string;
  role: 'captain' | 'vice-captain' | 'member';
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  sportId: string;
  institutionId?: string;
  type: TeamType;
  members: TeamMember[];
  captainId?: string;
  coach?: string;
  about?: string;
  achievements?: {
    title: string;
    season: string;
    tournamentName: string;
  }[];
  logoUrl?: string;
  createdAt: string;
  foundedYear?: number;
  lastMatchAt?: string;
  active: boolean;
}
