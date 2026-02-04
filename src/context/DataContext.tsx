import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  matches as initialMatches, 
  teams as initialTeams, 
  sports as initialSports,
  users as initialUsers,
  feedItems as initialFeedItems,
  certificates as initialCertificates
} from '../data/mockData';
import { Match, Team, Sport, Tournament, Certificate, User, FeedItem } from '../types/models';

interface DataContextType {
  matches: Match[];
  teams: Team[];
  sports: Sport[];
  users: User[];
  feedItems: FeedItem[];
  tournaments: Tournament[];
  certificates: Certificate[];
  addMatch: (match: Match) => void;
  addTeam: (team: Team) => void;
  addTournament: (tournament: Tournament) => void;
  getSportById: (id: string) => Sport | undefined;
  getTeamById: (id: string) => Team | undefined;
  updateMatchScore: (matchId: string, score: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [sports] = useState<Sport[]>(initialSports);
  const [users] = useState<User[]>(initialUsers);
  const [feedItems] = useState<FeedItem[]>(initialFeedItems);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [certificates] = useState<Certificate[]>(initialCertificates);


  const addMatch = (match: Match) => {
    setMatches(prev => [...prev, match]);
  };

  const addTeam = (team: Team) => {
    setTeams(prev => [...prev, team]);
  };

  const addTournament = (tournament: Tournament) => {
    setTournaments(prev => [...prev, tournament]);
  };

  const updateMatchScore = (matchId: string, score: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, score } : m));
  };

  const getSportById = (id: string) => sports.find(s => s.id === id);
  const getTeamById = (id: string) => teams.find(t => t.id === id);

  return (
    <DataContext.Provider value={{
      matches,
      teams,
      sports,
      tournaments,
      certificates,
      users,
      feedItems,
      addMatch,
      addTeam,
      addTournament,
      getSportById,
      getTeamById,
      updateMatchScore
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
