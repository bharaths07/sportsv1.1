import { supabase } from '../lib/supabase';
import { Team, TeamMember } from '../domain/team';

interface DbTeamMember {
  player_id?: string;
  user_id?: string;
  role: TeamMember['role'];
  joined_at: string;
}

interface DbTeam {
  id: string;
  name: string;
  sport_id?: string;
  type?: Team['type'];
  captain_id?: string;
  logo_url?: string;
  created_at?: string;
  active: boolean;
  team_members?: DbTeamMember[];
}

type DbTeamInsert = {
  name?: string;
  type?: Team['type'];
  captain_id?: string;
  logo_url?: string;
  active?: boolean;
  created_by?: string;
  sport_id?: string;
};

export const teamService = {
  async getAllTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members (*)
      `);

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    return (data || []).map((t) => mapToDomain(t as DbTeam));
  },

  async createTeam(team: Partial<Team>): Promise<Team | null> {
    const { data: { user } } = await supabase.auth.getUser();

    const dbTeam: DbTeamInsert = {
      name: team.name,
      type: team.type,
      captain_id: team.captainId,
      logo_url: team.logoUrl,
      // Defaulting others or mapping if they existed in DB
      active: true,
      created_by: user?.id,
      sport_id: team.sportId
    };

    const { data, error } = await supabase
      .from('teams')
      .insert(dbTeam)
      .select()
      .single();

    if (error) {
      console.error('Error creating team:', error);
      throw error;
    }

    // If there are members, insert them
    if (team.members && team.members.length > 0) {
      const membersToInsert = team.members.map(m => ({
        team_id: data.id,
        player_id: m.playerId, // Links to players table
        role: m.role,
        joined_at: new Date().toISOString()
      }));

      const { error: membersError } = await supabase
        .from('team_members')
        .insert(membersToInsert);
        
      if (membersError) {
        console.error('Error adding team members:', membersError);
      }
    }

    return mapToDomain({ ...(data as DbTeam), team_members: [] }); // Return basic team for now, or fetch fresh
  },
  
  async addMember(teamId: string, member: TeamMember): Promise<void> {
     const { error } = await supabase
        .from('team_members')
        .insert({
            team_id: teamId,
            player_id: member.playerId,
            role: member.role,
            joined_at: member.joinedAt || new Date().toISOString()
        });
        
     if (error) throw error;
  }
};

function mapToDomain(dbTeam: DbTeam): Team {
  return {
    id: dbTeam.id,
    name: dbTeam.name,
    sportId: dbTeam.sport_id || 'Cricket', // Default for now
    type: dbTeam.type,
    members: (dbTeam.team_members || []).map((m: DbTeamMember) => ({
      playerId: m.player_id || m.user_id || 'unknown',
      role: m.role,
      joinedAt: m.joined_at
    })),
    captainId: dbTeam.captain_id,
    logoUrl: dbTeam.logo_url,
    createdAt: dbTeam.created_at,
    active: dbTeam.active,
    // Defaults for missing schema fields
    about: '', 
    coach: '',
    achievements: []
  };
}
