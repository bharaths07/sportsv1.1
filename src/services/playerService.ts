import { supabase } from '../lib/supabase';
import { Player } from '../domain/player';

export const playerService = {
  async getAllPlayers(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*');

    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }

    return data.map((p: any) => mapToDomain(p));
  },

  async getPlayer(id: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching player:', error);
      return null;
    }

    return mapToDomain(data);
  },

  async createPlayer(player: Partial<Player>): Promise<Player> {
    const dbPlayer = {
      // If ID is provided and looks like a UUID, use it, otherwise let DB generate or generate one
      // If it's a temporary ID (starts with 'new-'), let DB generate
      // id: player.id?.startsWith('new-') ? undefined : player.id, 
      user_id: player.userId,
      first_name: player.firstName,
      last_name: player.lastName,
      phone: (player as any).phone, // Assuming phone might be added to domain or passed in
      stats: player.stats,
      history: player.history,
      active: player.active ?? true,
      status: player.status ?? 'active',
      avatar_url: player.avatarUrl
    };

    const { data, error } = await supabase
      .from('players')
      .insert(dbPlayer)
      .select()
      .single();

    if (error) {
      console.error('Error creating player:', error);
      throw error;
    }

    return mapToDomain(data);
  },

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const dbUpdates: any = {};
    if (updates.firstName) dbUpdates.first_name = updates.firstName;
    if (updates.lastName) dbUpdates.last_name = updates.lastName;
    if (updates.stats) dbUpdates.stats = updates.stats;
    if (updates.history) dbUpdates.history = updates.history;
    if (updates.active !== undefined) dbUpdates.active = updates.active;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;

    const { data, error } = await supabase
      .from('players')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating player:', error);
      throw error;
    }

    return mapToDomain(data);
  }
};

function mapToDomain(dbPlayer: any): Player {
  return {
    id: dbPlayer.id,
    userId: dbPlayer.user_id,
    firstName: dbPlayer.first_name,
    lastName: dbPlayer.last_name || '',
    active: dbPlayer.active,
    status: dbPlayer.status,
    stats: dbPlayer.stats || {
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      scoreAccumulated: 0
    },
    history: dbPlayer.history || [],
    avatarUrl: dbPlayer.avatar_url,
    // Map other fields as necessary
  };
}
