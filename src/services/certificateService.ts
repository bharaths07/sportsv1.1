import { supabase } from '../lib/supabase';
import { Certificate } from '../domain/certificate';

export const certificateService = {
  async createCertificate(certificate: Certificate): Promise<Certificate> {
    const dbCertificate = {
      type: certificate.type,
      title: certificate.title,
      player_id: certificate.playerId,
      match_id: certificate.matchId,
      achievement_id: certificate.achievementId,
      date: certificate.date,
      description: certificate.description,
      metadata: certificate.metadata
    };

    const { data, error } = await supabase
      .from('certificates')
      .insert(dbCertificate)
      .select()
      .single();

    if (error) {
      console.error('Error creating certificate:', error);
      throw error;
    }

    return mapToDomain(data);
  },

  async getCertificatesByPlayer(playerId: string): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('player_id', playerId);

    if (error) {
      console.error('Error fetching player certificates:', error);
      return [];
    }

    return data.map(mapToDomain);
  },
  
  async getAllCertificates(): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*');

    if (error) {
      console.error('Error fetching all certificates:', error);
      return [];
    }

    return data.map(mapToDomain);
  }
};

function mapToDomain(db: any): Certificate {
  return {
    id: db.id,
    type: db.type,
    title: db.title,
    playerId: db.player_id,
    matchId: db.match_id,
    achievementId: db.achievement_id,
    date: db.date,
    description: db.description,
    metadata: db.metadata
  };
}
