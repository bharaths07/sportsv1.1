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
  members: TeamMember[];
  logoUrl?: string;
  createdAt: string;
  active: boolean;
}
