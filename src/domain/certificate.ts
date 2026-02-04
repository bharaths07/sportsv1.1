export type CertificateType = 'participation' | 'achievement';

export interface Certificate {
  id: string;
  type: CertificateType;
  title: string;
  playerId: string;
  matchId: string;
  achievementId?: string; // Linked achievement if type is 'achievement'
  date: string; // ISO Date string
  description: string;
  metadata: {
    matchName: string;
    sportName: string;
    location: string;
    organizerName: string;
    teamName?: string; // The team the player played for in this match
  };
}
