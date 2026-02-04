export type AchievementType = 'player_of_the_match' | 'half_century' | 'century' | 'five_wickets';

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  playerId: string;
  matchId: string;
  date: string;
  description: string;
}
