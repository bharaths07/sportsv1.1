import { supabase } from '../lib/supabase';
import { Tournament } from '../domain/tournament';

interface DbTournament {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  status?: Tournament['status'];
  location?: string;
  description?: string;
  banner_url?: string;
  organizer_id?: string;
  organizer?: { name?: string } | null;
  structure?: unknown;
  teams?: string[];
  schedule_mode?: 'AUTO' | 'MANUAL' | 'LATER';
}

type DbTournamentInsert = {
  name?: string;
  start_date?: string;
  end_date?: string;
  status?: Tournament['status'];
  location?: string;
  description?: string;
  banner_url?: string;
  organizer_id?: string;
  structure?: unknown;
  teams?: string[];
};

type DbTournamentUpdate = Partial<{
  name: string;
  status: Tournament['status'];
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  banner_url: string;
  structure: unknown;
  teams: string[];
  schedule_mode: 'AUTO' | 'MANUAL' | 'LATER';
}>;

export const tournamentService = {
  async getAllTournaments(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        organizer:organizer_id (name)
      `);

    if (error) {
      console.error('Error fetching tournaments:', error);
      return [];
    }

    return (data || []).map((t) => mapToDomain(t as DbTournament));
  },

  async createTournament(tournament: Partial<Tournament>): Promise<Tournament> {
    const dbTournament: DbTournamentInsert = {
      name: tournament.name,
      start_date: tournament.startDate,
      end_date: tournament.endDate,
      status: tournament.status || 'upcoming',
      location: tournament.location,
      description: tournament.description,
      banner_url: tournament.bannerUrl,
      organizer_id: tournament.organizerId,
      structure: tournament.structure,
      teams: tournament.teams || []
    };

    const { data, error } = await supabase
      .from('tournaments')
      .insert(dbTournament)
      .select()
      .single();

    if (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }

    return mapToDomain(data as DbTournament);
  },

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
    const dbUpdates: DbTournamentUpdate = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.startDate) dbUpdates.start_date = updates.startDate;
    if (updates.endDate) dbUpdates.end_date = updates.endDate;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.bannerUrl) dbUpdates.banner_url = updates.bannerUrl;
    if (updates.structure) dbUpdates.structure = updates.structure;
    if (updates.teams) dbUpdates.teams = updates.teams; 
    if (updates.scheduleMode) dbUpdates.schedule_mode = updates.scheduleMode;

    const { data, error } = await supabase
      .from('tournaments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        console.error('Error updating tournament:', error);
        throw error;
    }
    
    return mapToDomain(data as DbTournament);
  },

  async addTeam(tournamentId: string, teamId: string): Promise<void> {
    // 1. Fetch current teams
    const { data: tournament, error: fetchError } = await supabase
      .from('tournaments')
      .select('teams')
      .eq('id', tournamentId)
      .single();

    if (fetchError) throw fetchError;

    const currentTeams = tournament.teams || [];
    if (currentTeams.includes(teamId)) return;

    const newTeams = [...currentTeams, teamId];

    // 2. Update teams array
    const { error: updateError } = await supabase
      .from('tournaments')
      .update({ teams: newTeams })
      .eq('id', tournamentId);

    if (updateError) throw updateError;
  },

  async removeTeam(tournamentId: string, teamId: string): Promise<void> {
    const { data: tournament, error: fetchError } = await supabase
      .from('tournaments')
      .select('teams')
      .eq('id', tournamentId)
      .single();

    if (fetchError) throw fetchError;

    const currentTeams = tournament.teams || [];
    const newTeams = currentTeams.filter((id: string) => id !== teamId);

    const { error: updateError } = await supabase
      .from('tournaments')
      .update({ teams: newTeams })
      .eq('id', tournamentId);

    if (updateError) throw updateError;
  }
};

function mapToDomain(dbT: DbTournament): Tournament {
  const start = dbT.start_date || '';
  const end = dbT.end_date || '';
  const dateString = end ? `${start} - ${end}` : start;

  return {
    id: dbT.id,
    name: dbT.name,
    organizer: dbT.organizer?.name || 'Organizer',
    organizerId: dbT.organizer_id,
    dates: dateString,
    location: dbT.location || '',
    description: dbT.description || '',
    bannerUrl: dbT.banner_url || '',
    status: dbT.status,
    structure: dbT.structure,
    startDate: dbT.start_date,
    endDate: dbT.end_date,
    teams: dbT.teams || [],
    scheduleMode: dbT.schedule_mode
  };
}
