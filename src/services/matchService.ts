import { supabase } from '../lib/supabase';
import { Match, MatchParticipant } from '../domain/match';

export const matchService = {
  async getAllMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:home_team_id (name),
        away_team:away_team_id (name)
      `);

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return data.map((m: any) => mapToDomain(m));
  },

  async createMatch(match: Match): Promise<Match> {
    const { 
      id, homeParticipant, awayParticipant, 
      tournamentId, date, location, status, 
      createdByUserId, winnerId,
      ...restData 
    } = match;

    const dbMatch = {
      // id: id, // Let DB generate ID? Or use provided? Domain usually provides one if optimistic. 
      // If ID is provided and valid UUID, we can use it.
      tournament_id: tournamentId,
      home_team_id: homeParticipant.id,
      away_team_id: awayParticipant.id,
      start_time: date,
      location: location,
      status: status,
      created_by: createdByUserId,
      winner_id: winnerId,
      data: {
        homeParticipant,
        awayParticipant,
        ...restData // events, officials, etc.
      }
    };

    const { data, error } = await supabase
      .from('matches')
      .insert(dbMatch)
      .select()
      .single();

    if (error) {
      console.error('Error creating match:', error);
      throw error;
    }

    return mapToDomain(data);
  },

  async updateMatch(matchId: string, updates: Partial<Match>): Promise<void> {
    // We need to fetch current data to merge JSON properly if we are updating nested fields
    // But for MVP, let's assume 'updates' contains what we need or we overwrite specific fields.
    
    // Split updates into columns and JSON data
    const dbUpdates: any = {};
    const jsonUpdates: any = {};

    if (updates.status) dbUpdates.status = updates.status;
    if (updates.winnerId) dbUpdates.winner_id = updates.winnerId;
    if (updates.date) dbUpdates.start_time = updates.date;
    
    // For participants/events, we update the JSON 'data' column.
    // Ideally we should do a deep merge or fetch-modify-save.
    // For now, if events are updated, we push them to data.
    if (updates.events) jsonUpdates.events = updates.events;
    if (updates.homeParticipant) jsonUpdates.homeParticipant = updates.homeParticipant;
    if (updates.awayParticipant) jsonUpdates.awayParticipant = updates.awayParticipant;
    if (updates.currentBattingTeamId) jsonUpdates.currentBattingTeamId = updates.currentBattingTeamId;
    if (updates.liveState) jsonUpdates.liveState = updates.liveState;

    // We can use Supabase's jsonb_set or just merge in JS if we fetch first.
    // Fetch first is safer for JSON merging.
    const { data: current, error: fetchError } = await supabase
      .from('matches')
      .select('data')
      .eq('id', matchId)
      .single();
      
    if (fetchError) throw fetchError;

    const newData = { ...current.data, ...jsonUpdates };
    
    const { error: updateError } = await supabase
      .from('matches')
      .update({ ...dbUpdates, data: newData })
      .eq('id', matchId);

    if (updateError) throw updateError;
  }
};

function mapToDomain(dbMatch: any): Match {
  const jsonData = dbMatch.data || {};
  
  // Merge column data with JSON data
  // Columns take precedence for source of truth (status, ids)
  
  return {
    ...jsonData,
    id: dbMatch.id,
    tournamentId: dbMatch.tournament_id,
    // Ensure participants have names if they were missing in JSON but available via join
    homeParticipant: {
      ...jsonData.homeParticipant,
      id: dbMatch.home_team_id,
      name: dbMatch.home_team?.name || jsonData.homeParticipant?.name || 'Home Team'
    },
    awayParticipant: {
      ...jsonData.awayParticipant,
      id: dbMatch.away_team_id,
      name: dbMatch.away_team?.name || jsonData.awayParticipant?.name || 'Away Team'
    },
    date: dbMatch.start_time,
    location: dbMatch.location,
    status: dbMatch.status,
    winnerId: dbMatch.winner_id,
    createdByUserId: dbMatch.created_by
  };
}
