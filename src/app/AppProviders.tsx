import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Match, ScoreEvent, PlayerStats } from '../domain/match';
import { Player } from '../domain/player';
import { Team } from '../domain/team';
import { FeedItem } from '../domain/feed';
import { Achievement } from '../domain/achievement';
import { Certificate } from '../domain/certificate';
import { MOCK_MATCHES } from '../data/matches';
import { MOCK_PLAYERS } from '../data/players';
import { MOCK_TEAMS } from '../data/teams';
import { MOCK_FEED } from '../data/feed';

interface GlobalState {
  matches: Match[];
  players: Player[];
  teams: Team[];
  feedItems: FeedItem[];
  achievements: Achievement[];
  certificates: Certificate[];
  currentUser: any | null; // Placeholder for now
  login: (method: string) => void;
  logout: () => void;
  addMatch: (match: Match) => void;
  scoreMatch: (matchId: string, runs: number, isWicket: boolean) => void;
  startMatch: (matchId: string) => void;
  endMatch: (matchId: string) => void;
  updateMatches: () => void;
  updatePlayers: () => void;
  updateTeams: () => void;
  updateFeed: () => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('scoreheroes_matches');
    return saved ? JSON.parse(saved) : MOCK_MATCHES;
  });
  const [players] = useState<Player[]>(MOCK_PLAYERS);
  const [teams] = useState<Team[]>(MOCK_TEAMS);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => {
    const saved = localStorage.getItem('scoreheroes_feed');
    const items = saved ? JSON.parse(saved) : MOCK_FEED;
    // Deduplicate IDs to prevent React keys warning
    const seenIds = new Set();
    return items.map((item: FeedItem) => {
      if (seenIds.has(item.id)) {
        // Regenerate ID for duplicates
        const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return { ...item, id: newId };
      }
      seenIds.add(item.id);
      return item;
    });
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('scoreheroes_achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('scoreheroes_certificates');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('scoreheroes_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (method: string) => {
    // Simulate login
    const user = {
      id: MOCK_PLAYERS[0].id,
      name: `${MOCK_PLAYERS[0].firstName} ${MOCK_PLAYERS[0].lastName}`,
      email: 'rahul.k@example.com',
      method
    };
    setCurrentUser(user);
    localStorage.setItem('scoreheroes_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('scoreheroes_user');
  };

  useEffect(() => {
    localStorage.setItem('scoreheroes_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_feed', JSON.stringify(feedItems));
  }, [feedItems]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_certificates', JSON.stringify(certificates));
  }, [certificates]);

  const updateMatches = () => { console.log('updateMatches called'); };

  const addMatch = (match: Match) => {
    setMatches(prev => [match, ...prev]);
  };

  const startMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => {
        if (m.id !== matchId) return m;
        // Only allow Draft -> Live transition
        if (m.status !== 'draft') return m;
        
        return { 
            ...m, 
            status: 'live' as const,
            // Initialize actualStartTime if needed
            actualStartTime: new Date().toISOString()
        };
    }));
  };

  const scoreMatch = (matchId: string, runs: number, isWicket: boolean) => {
    setMatches(prevMatches => {
      return prevMatches.map(m => {
        if (m.id !== matchId) return m;

        const updatedMatch = { ...m };
        // Default to home team if not set
        if (!updatedMatch.currentBattingTeamId) {
          updatedMatch.currentBattingTeamId = updatedMatch.homeParticipant.id;
        }

        const isHome = updatedMatch.currentBattingTeamId === updatedMatch.homeParticipant.id;
        const participant = isHome ? { ...updatedMatch.homeParticipant } : { ...updatedMatch.awayParticipant };

        // Update stats
        participant.score = (participant.score || 0) + runs;
        participant.balls = (participant.balls || 0) + 1;
        if (isWicket) {
          participant.wickets = (participant.wickets || 0) + 1;
        }

        // Save back to match
        if (isHome) {
          updatedMatch.homeParticipant = participant;
        } else {
          updatedMatch.awayParticipant = participant;
        }

        // Add event
        const over = Math.floor((participant.balls - 1) / 6);
        const ballInOver = (participant.balls - 1) % 6 + 1;
        
        let desc = `Over ${over}.${ballInOver} - ${runs} runs`;
        if (isWicket) desc = `Over ${over}.${ballInOver} - WICKET!`;
        if (runs === 4) desc = `Over ${over}.${ballInOver} - FOUR!`;
        if (runs === 6) desc = `Over ${over}.${ballInOver} - SIX!`;

        const newEvent: ScoreEvent = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          points: runs,
          description: desc,
          type: isWicket ? 'wicket' : 'run',
          teamId: participant.id
        };

        updatedMatch.events = [newEvent, ...(updatedMatch.events || [])];
        
        // Also update global feed
        const newFeedItem: FeedItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'match_update',
          title: `${participant.name}: ${desc}`,
          publishedAt: new Date().toISOString(),
          relatedEntityId: matchId,
          content: `${updatedMatch.homeParticipant.name} vs ${updatedMatch.awayParticipant.name}`,
          visibility: 'public'
        };
        setFeedItems(prev => [newFeedItem, ...prev]);

        return updatedMatch;
      });
    });
  };

  const endMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || match.status === 'completed') return;

    // Check if achievements already exist for this match to prevent duplicates
    if (achievements.some(a => a.matchId === matchId)) return;

    const homeScore = match.homeParticipant.score || 0;
    const awayScore = match.awayParticipant.score || 0;
    let winnerId: string | undefined;
    let homeResult: 'win' | 'loss' | 'draw' | undefined;
    let awayResult: 'win' | 'loss' | 'draw' | undefined;

    if (homeScore > awayScore) {
      winnerId = match.homeParticipant.id;
      homeResult = 'win';
      awayResult = 'loss';
    } else if (awayScore > homeScore) {
      winnerId = match.awayParticipant.id;
      homeResult = 'loss';
      awayResult = 'win';
    } else {
      homeResult = 'draw';
      awayResult = 'draw';
    }

    // 1. Simulate Player Stats
    const simulatePlayerStats = (totalRuns: number, totalWicketsTaken: number, playersPool: Player[]): PlayerStats[] => {
       let remainingRuns = totalRuns;
       let remainingWickets = totalWicketsTaken;
       const stats: PlayerStats[] = [];
       
       const shuffledPool = [...playersPool].sort(() => 0.5 - Math.random());
       const contributorsCount = Math.min(shuffledPool.length, 3 + Math.floor(Math.random() * 2));
       const contributors = shuffledPool.slice(0, contributorsCount); 
       
       contributors.forEach((player, index) => {
          let runs = 0;
          let wickets = 0;
          
          if (index === contributors.length - 1) {
              runs = remainingRuns;
          } else {
              runs = Math.floor(Math.random() * (remainingRuns / 2));
              remainingRuns -= runs;
          }

          if (remainingWickets > 0) {
              const maxWicketsForPlayer = Math.min(remainingWickets, 6);
              const w = Math.floor(Math.random() * (maxWicketsForPlayer + 1));
              if (index === contributors.length - 1) {
                   wickets = remainingWickets;
              } else {
                   wickets = w;
                   remainingWickets -= w;
              }
          }

          stats.push({
              playerId: player.id,
              runs: runs,
              balls: Math.floor(runs * 1.5) || 1,
              wickets: wickets
          });
       });
       
       return stats;
    };
    
    // Split MOCK_PLAYERS to ensure distinct players for home and away teams
    const shuffledGlobal = [...MOCK_PLAYERS].sort(() => 0.5 - Math.random());
    const midPoint = Math.floor(shuffledGlobal.length / 2);
    const homePool = shuffledGlobal.slice(0, midPoint);
    const awayPool = shuffledGlobal.slice(midPoint);

    const homeStats = simulatePlayerStats(homeScore, match.awayParticipant.wickets || 0, homePool);
    const awayStats = simulatePlayerStats(awayScore, match.homeParticipant.wickets || 0, awayPool);

    // 2. Generate Achievements
    const newAchievements: Achievement[] = [];
    const allStats = [...homeStats, ...awayStats];
    
    // Player of the Match (Highest Impact: Runs + Wickets*20)
    if (allStats.length > 0) {
      const topScorer = allStats.reduce((prev, current) => {
          const prevImpact = prev.runs + (prev.wickets * 20);
          const currentImpact = current.runs + (current.wickets * 20);
          return (prevImpact > currentImpact) ? prev : current;
      });

      const impact = topScorer.runs + (topScorer.wickets * 20);

      // Only award POTM if impact is significant (>= 20 points, e.g. 20 runs or 1 wicket)
      if (impact >= 20) {
        const player = MOCK_PLAYERS.find(p => p.id === topScorer.playerId);
        if (player) {
          const desc = [];
          if (topScorer.runs > 0) desc.push(`${topScorer.runs} runs`);
          if (topScorer.wickets > 0) desc.push(`${topScorer.wickets} wickets`);
          
          newAchievements.push({
                id: Date.now().toString() + '_potm',
                type: 'player_of_the_match',
                title: 'Player of the Match',
                playerId: player.id,
                matchId: match.id,
                date: new Date().toISOString(),
                description: desc.join(' & ') || 'All-round performance'
            });
        }
      }
    }

    // Centuries, Half Centuries & Five Wickets
    allStats.forEach(stat => {
        const player = MOCK_PLAYERS.find(p => p.id === stat.playerId);
        if (!player) return;

        // Prevent duplicate awards for same performance (e.g. 100 includes 50)
        // Rule: If Century, don't award Half Century.
        if (stat.runs >= 100) {
            newAchievements.push({
                id: Date.now().toString() + '_' + stat.playerId + '_100',
                type: 'century',
                title: 'Century',
                playerId: stat.playerId,
                matchId: match.id,
                date: new Date().toISOString(),
                description: `Scored ${stat.runs} runs`
            });
        } else if (stat.runs >= 50) {
            newAchievements.push({
                id: Date.now().toString() + '_' + stat.playerId + '_50',
                type: 'half_century',
                title: 'Half Century',
                playerId: stat.playerId,
                matchId: match.id,
                date: new Date().toISOString(),
                description: `Scored ${stat.runs} runs`
            });
        }

        if (stat.wickets >= 5) {
          newAchievements.push({
              id: Date.now().toString() + '_' + stat.playerId + '_5w',
              type: 'five_wickets',
              title: 'Five Wickets',
              playerId: stat.playerId,
              matchId: match.id,
              date: new Date().toISOString(),
              description: `Taken ${stat.wickets} wickets`
          });
        }
    });
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...newAchievements, ...prev]);
    }

    // 3. Generate Certificates
    const newCertificates: Certificate[] = [];
    const sportName = match.sportId === 's1' ? 'Cricket' : 'Football';
    const organizerName = "Rahul Kumar"; // Mock

    // Participation Certificates
    allStats.forEach(stat => {
        const player = MOCK_PLAYERS.find(p => p.id === stat.playerId);
        if (!player) return;

        // Determine team name
        const isHome = homeStats.some(s => s.playerId === stat.playerId);
        const teamName = isHome ? match.homeParticipant.name : match.awayParticipant.name;

        newCertificates.push({
            id: Date.now().toString() + '_cert_part_' + stat.playerId,
            type: 'participation',
            title: 'Certificate of Participation',
            playerId: stat.playerId,
            matchId: match.id,
            date: new Date().toISOString(),
            description: `For participating in the match between ${match.homeParticipant.name} and ${match.awayParticipant.name}`,
            metadata: {
                matchName: `${match.homeParticipant.name} vs ${match.awayParticipant.name}`,
                sportName,
                location: match.location,
                organizerName,
                teamName
            }
        });
    });

    // Achievement Certificates
    newAchievements.forEach(ach => {
        const player = MOCK_PLAYERS.find(p => p.id === ach.playerId);
        if (!player) return;

        // Determine team name
        const isHome = homeStats.some(s => s.playerId === ach.playerId);
        const teamName = isHome ? match.homeParticipant.name : match.awayParticipant.name;

        newCertificates.push({
            id: Date.now().toString() + '_cert_ach_' + ach.id,
            type: 'achievement',
            title: `Certificate of Achievement: ${ach.title}`,
            playerId: ach.playerId,
            matchId: match.id,
            achievementId: ach.id,
            date: new Date().toISOString(),
            description: ach.description, 
            metadata: {
                matchName: `${match.homeParticipant.name} vs ${match.awayParticipant.name}`,
                sportName,
                location: match.location,
                organizerName,
                teamName
            }
        });
    });

    if (newCertificates.length > 0) {
        setCertificates(prev => [...newCertificates, ...prev]);
    }

    // Add "Match Ended" event
    const endEvent: ScoreEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      points: 0,
      description: 'Match Ended',
      type: 'status_change',
    };

    const updatedMatch = {
      ...match,
      status: 'locked' as const, // Auto-lock immediately as per Day 14 requirements (skip 'completed' manual step)
      winnerId,
      homeParticipant: { ...match.homeParticipant, result: homeResult, players: homeStats },
      awayParticipant: { ...match.awayParticipant, result: awayResult, players: awayStats },
      events: [endEvent, ...(match.events || [])]
    };

    setMatches(prev => prev.map(m => m.id === matchId ? updatedMatch : m));

    // Add Feed Item
    const resultText = winnerId 
      ? `${winnerId === match.homeParticipant.id ? match.homeParticipant.name : match.awayParticipant.name} won by ${Math.abs(homeScore - awayScore)} runs`
      : 'Match Drawn';

    const newFeedItem: FeedItem = {
      id: Date.now().toString(),
      type: 'match_update',
      title: `Match Ended: ${resultText}`,
      publishedAt: new Date().toISOString(),
      relatedEntityId: matchId,
      content: `${match.homeParticipant.name} ${homeScore} - ${awayScore} ${match.awayParticipant.name}`,
      visibility: 'public'
    };
    setFeedItems(prev => [newFeedItem, ...prev]);
  };

  const updatePlayers = () => { console.log('updatePlayers called'); };
  const updateTeams = () => { console.log('updateTeams called'); };
  const updateFeed = () => { console.log('updateFeed called'); };

  return (
    <GlobalContext.Provider value={{
      matches,
      players,
      teams,
      feedItems,
      achievements,
      certificates,
      currentUser,
      login,
      logout,
      addMatch,
      startMatch,
      scoreMatch,
      endMatch,
      updateMatches,
      updatePlayers,
      updateTeams,
      updateFeed
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
};

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <GlobalProvider>
      {children}
    </GlobalProvider>
  );
};
