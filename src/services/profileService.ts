import { supabase } from '../lib/supabase';
import { User } from '../domain/user';

export const profileService = {
  async getProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return this.mapProfileData(data);
  },

  async getProfileByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      // console.error('Error fetching profile by username:', error); // Silent fail for 404
      return null;
    }

    return this.mapProfileData(data);
  },

  mapProfileData(data: any): User {
      return {
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          role: data.role as 'user' | 'admin',
          avatarUrl: data.avatar_url,
          username: data.username,
          favoriteGame: data.favorite_game,
          bio: data.bio,
          location: data.location,
          memberSince: data.created_at ? new Date(data.created_at).getFullYear().toString() : undefined,
          followersCount: data.followers_count,
          followingCount: data.following_count,
          profileViews: data.profile_views,
          gameRoles: data.game_roles,
          gender: data.gender,
          dateOfBirth: data.date_of_birth,
          displayEmail: data.display_email || data.email, // Fallback to auth email if display not set
          displayPhone: data.display_phone || data.phone,
      };
  },

  async createProfile(profile: User): Promise<User | null> {
    const dbProfile = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role || 'user',
      avatar_url: profile.avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(dbProfile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return this.mapProfileData(data);
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.username) dbUpdates.username = updates.username;
    if (updates.favoriteGame) dbUpdates.favorite_game = updates.favoriteGame;
    // Add new fields
    if (updates.bio) dbUpdates.bio = updates.bio;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.gender) dbUpdates.gender = updates.gender;
    if (updates.dateOfBirth) dbUpdates.date_of_birth = updates.dateOfBirth;
    if (updates.gameRoles) dbUpdates.game_roles = updates.gameRoles;
    if (updates.displayEmail) dbUpdates.display_email = updates.displayEmail;
    if (updates.displayPhone) dbUpdates.display_phone = updates.displayPhone;

    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return this.mapProfileData(data);
  },

  async checkUsernameAvailability(username: string): Promise<boolean> {
    if (!username || username.length < 3) return false;
    
    // Check if username is already taken by someone else
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle(); 

    if (error) {
       console.error('Error checking username:', error);
       // If error is specifically "column does not exist", it means migration hasn't run.
       // In that case, we should probably return TRUE (available) to unblock dev flow, 
       // but log a loud warning.
       if (error.message.includes('column') || error.code === '42703') {
           console.warn('⚠️ WARNING: Username column missing in database. Returning available.');
           return true;
       }
       return false; 
    }
    
    // If data is null, no row found -> Username IS available (return true)
    // If data exists, row found -> Username IS TAKEN (return false)
    return data === null; 
  },

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  },

  async getAllProfiles(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      avatarUrl: p.avatar_url,
    }));
  }
};
