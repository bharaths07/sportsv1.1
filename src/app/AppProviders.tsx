import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Match, ScoreEvent, PlayerStats } from '../domain/match';
import { Player } from '../domain/player';
import { GameProfile } from '../domain/gameProfile';
import { Team } from '../domain/team';
import { FeedItem } from '../domain/feed';
import { Achievement } from '../domain/achievement';
import { Certificate } from '../domain/certificate';
import { Tournament } from '../domain/tournament';
import { MatchScorer } from '../domain/scorer';
import { User } from '../domain/user';

interface GlobalState {
  matches: Match[];
  players: Player[];
  gameProfiles: GameProfile[];
  teams: Team[];
  tournaments: Tournament[];
  users: User[];
  matchScorers: MatchScorer[];
  feedItems: FeedItem[];
  achievements: Achievement[];
  certificates: Certificate[];
  followedTeams: string[];
  followedTournaments: string[];
  followedMatches: string[];
  notifications: {
    id: string;
    type: 'match_start' | 'match_result' | 'tournament_event';
    title: string;
    body: string;
    timestamp: string;
    relatedMatchId?: string;
    relatedTournamentId?: string;
  }[];
  notificationsEnabled: boolean;
  matchStartEnabled: boolean;
  matchResultEnabled: boolean;
  tournamentNotificationsEnabled: boolean;
  preferences: {
    sport: string;
    timezone: string;
    language: string;
  };
  currentUser: User | null;
  login: (name: string, email: string) => void;
  loginWithSupabase: (email: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  addPlayer: (player: Player) => void;
  addTeam: (team: Team) => void;
  addTeamMember: (teamId: string, member: { playerId: string; role: 'captain' | 'vice-captain' | 'member'; joinedAt: string }) => void;
  addMatch: (match: Match) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  scoreMatch: (matchId: string, runs: number, isWicket: boolean) => void;
  startMatch: (matchId: string) => void;
  endMatch: (matchId: string) => void;
  toggleFollowTeam: (teamId: string) => void;
  toggleFollowTournament: (tournamentId: string) => void;
  toggleFollowMatch: (matchId: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setMatchStartEnabled: (enabled: boolean) => void;
  setMatchResultEnabled: (enabled: boolean) => void;
  setTournamentNotificationsEnabled: (enabled: boolean) => void;
  updatePreferences: (prefs: Partial<GlobalState['preferences']>) => void;
  updateMatches: () => void;
  updatePlayers: () => void;
  updateTeams: () => void;
  addTournament: (tournament: Tournament) => void;
  updateTournament: (tournament: Tournament) => void;
  addTeamToTournament: (tournamentId: string, teamId: string) => void;
  removeTeamFromTournament: (tournamentId: string, teamId: string) => void;
  updateTournamentStructure: (tournamentId: string, structure: any) => void;
  updateTournamentScheduleMode: (tournamentId: string, scheduleMode: 'AUTO' | 'MANUAL' | 'LATER') => void;
  updateFeed: () => void;
  assignScorer: (matchId: string, userId: string) => void;
  removeScorer: (matchId: string, userId: string) => void;
  getMatchScorers: (matchId: string) => MatchScorer[];
  canScoreMatch: (matchId: string) => boolean;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem('scoreheroes_matches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('scoreheroes_players');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [gameProfiles] = useState<GameProfile[]>([]);
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem('scoreheroes_teams');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    try {
      const saved = localStorage.getItem('scoreheroes_tournaments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => {
    try {
      const saved = localStorage.getItem('feedItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('achievements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem('certificates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [followedTeams, setFollowedTeams] = useState<string[]>(() => {
    const saved = localStorage.getItem('scoreheroes_followed_teams');
    return saved ? JSON.parse(saved) : [];
  });
  const [followedTournaments, setFollowedTournaments] = useState<string[]>(() => {
    const saved = localStorage.getItem('scoreheroes_followed_tournaments');
    return saved ? JSON.parse(saved) : [];
  });
  const [followedMatches, setFollowedMatches] = useState<string[]>(() => {
    const saved = localStorage.getItem('scoreheroes_followed_matches');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('scoreheroes_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [notificationKeys, setNotificationKeys] = useState<string[]>(() => {
    const saved = localStorage.getItem('scoreheroes_notification_keys');
    return saved ? JSON.parse(saved) : [];
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('scoreheroes_notifications_enabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [matchStartEnabled, setMatchStartEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('scoreheroes_match_start_enabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [matchResultEnabled, setMatchResultEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('scoreheroes_match_result_enabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [tournamentNotificationsEnabled, setTournamentNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('scoreheroes_tournament_notifications_enabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [preferences, setPreferences] = useState<GlobalState['preferences']>(() => {
    const saved = localStorage.getItem('scoreheroes_preferences');
    return saved ? JSON.parse(saved) : {
      sport: 'Cricket',
      timezone: 'Asia/Kolkata', // Default to IST as per Indian context in mocks
      language: 'English'
    };
  });
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('users');
      const parsed = saved ? JSON.parse(saved) : [];
      // Migration: Ensure name exists for legacy data
      return parsed.map((u: any) => ({
        ...u,
        name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim()
      }));
    } catch {
      return [];
    }
  });
  const [matchScorers, setMatchScorers] = useState<MatchScorer[]>(() => {
    const saved = localStorage.getItem('scoreheroes_match_scorers');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Step 2.2 — Read Auth Session on App Boot
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;

      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name ?? 'User',
        });
      }
    });
  }, []);

  // Step 2.3 — Add Listener for Auth Changes (Passive)
  useEffect(() => {
    const { 
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name ?? 'User',
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // NOTE: MVP-only auth. Replace with real backend auth before production.
  const login = (name: string, email: string) => {
    let user = users.find(u => u.email === email);

    if (!user) {
      // Split name for legacy fields
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      user = {
        id: crypto.randomUUID(),
        name,
        email,
        role: 'user',
        // Default legacy fields
        firstName,
        lastName,
        memberSince: new Date().getFullYear().toString(),
        followersCount: 0,
        followingCount: 0,
        profileViews: 0,
        type: 'organizer' 
      };
      setUsers(prev => [...prev, user]);
    }

    setCurrentUser(user);
  };

  // Step 3.1 — Add Supabase Login Function (Parallel)
  const loginWithSupabase = async (email: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // ✅ Already logged in → do nothing
    if (session) {
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Supabase login error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
  };

  const assignScorer = (matchId: string, userId: string) => {
    // Only admin can assign
    if (currentUser?.role !== 'admin') return;

    // Check if already assigned
    if (matchScorers.some(ms => ms.matchId === matchId && ms.userId === userId)) return;

    const newAssignment: MatchScorer = {
      id: `ms_${Date.now()}`,
      matchId,
      userId,
      assignedBy: currentUser.id,
      assignedAt: new Date().toISOString()
    };

    const updatedScorers = [...matchScorers, newAssignment];
    setMatchScorers(updatedScorers);
    localStorage.setItem('scoreheroes_match_scorers', JSON.stringify(updatedScorers));
  };

  const removeScorer = (matchId: string, userId: string) => {
    if (currentUser?.role !== 'admin') return;
    const updatedScorers = matchScorers.filter(ms => !(ms.matchId === matchId && ms.userId === userId));
    setMatchScorers(updatedScorers);
    localStorage.setItem('scoreheroes_match_scorers', JSON.stringify(updatedScorers));
  };

  const getMatchScorers = (matchId: string) => {
    return matchScorers.filter(ms => ms.matchId === matchId);
  };

  const canScoreMatch = (matchId: string) => {
    if (!currentUser) return false;
    
    // 1. Match creator override
    const match = matches.find(m => m.id === matchId);
    if (match?.createdByUserId === currentUser.id) {
      return true;
    }

    // 2. Assigned scorers
    return matchScorers.some(ms => ms.matchId === matchId && ms.userId === currentUser.id);
  };

  // Validate session on mount/update
  useEffect(() => {
    if (currentUser) {
      // Session validation logic removed as we don't rely on mock players anymore
      // In a real app, this would be a server-side token check
    }
  }, [currentUser]);

  useEffect(() => {
    console.log('GlobalState Debug:', { 
      gameProfilesCount: gameProfiles.length, 
      currentUserId: currentUser?.id,
      gameProfiles: gameProfiles
    });
  }, [gameProfiles, currentUser]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('feedItems', JSON.stringify(feedItems));
  }, [feedItems]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_followed_teams', JSON.stringify(followedTeams));
  }, [followedTeams]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_followed_tournaments', JSON.stringify(followedTournaments));
  }, [followedTournaments]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_followed_matches', JSON.stringify(followedMatches));
  }, [followedMatches]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('scoreheroes_notification_keys', JSON.stringify(notificationKeys));
  }, [notificationKeys]);
  useEffect(() => {
    localStorage.setItem('scoreheroes_notifications_enabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);
  useEffect(() => {
    localStorage.setItem('scoreheroes_match_start_enabled', JSON.stringify(matchStartEnabled));
  }, [matchStartEnabled]);
  useEffect(() => {
    localStorage.setItem('scoreheroes_match_result_enabled', JSON.stringify(matchResultEnabled));
  }, [matchResultEnabled]);
  useEffect(() => {
    localStorage.setItem('scoreheroes_tournament_notifications_enabled', JSON.stringify(tournamentNotificationsEnabled));
  }, [tournamentNotificationsEnabled]);
  useEffect(() => {
    localStorage.setItem('scoreheroes_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('scoreheroes_match_scorers', JSON.stringify(matchScorers));
  }, [matchScorers]);

  const toggleFollowTeam = (teamId: string) => {
    setFollowedTeams(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  const toggleFollowTournament = (tournamentId: string) => {
    setFollowedTournaments(prev => 
      prev.includes(tournamentId) ? prev.filter(id => id !== tournamentId) : [...prev, tournamentId]
    );
  };

  const toggleFollowMatch = (matchId: string) => {
    setFollowedMatches(prev => 
      prev.includes(matchId) ? prev.filter(id => id !== matchId) : [...prev, matchId]
    );
  };

  const updatePreferences = (prefs: Partial<GlobalState['preferences']>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  };

  const updateMatches = () => { console.log('updateMatches called'); };

  const addMatch = (match: Match) => {
    setMatches(prev => [match, ...prev]);
  };

  const updateMatch = (matchId: string, updates: Partial<Match>) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, ...updates } : m));
  };

  const maybeNotify = (payload: {
    type: 'match_start' | 'match_result' | 'tournament_event';
    title: string;
    body: string;
    key: string;
    relatedMatchId?: string;
    relatedTournamentId?: string;
  }) => {
    if (!notificationsEnabled) return;
    if (payload.type === 'match_start' && !matchStartEnabled) return;
    if (payload.type === 'match_result' && !matchResultEnabled) return;
    if (payload.type === 'tournament_event' && !tournamentNotificationsEnabled) return;
    if (notificationKeys.includes(payload.key)) return;
    const n = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      timestamp: new Date().toISOString(),
      relatedMatchId: payload.relatedMatchId,
      relatedTournamentId: payload.relatedTournamentId
    };
    setNotifications(prev => [n, ...prev]);
    setNotificationKeys(prev => [...prev, payload.key]);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(payload.title, { body: payload.body, silent: true });
        } catch {}
      }
    }
  };

  const startMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => {
        if (m.id !== matchId) return m;
        // Only allow Draft -> Live transition
        if (m.status !== 'draft') return m;
        const isMatchFollowed = followedMatches.includes(m.id);
        const involvesFollowed = isMatchFollowed || followedTeams.includes(m.homeParticipant.id) || followedTeams.includes(m.awayParticipant.id);
        if (involvesFollowed) {
          const title = `${m.homeParticipant.name} vs ${m.awayParticipant.name} is about to start`;
          const body = `Starts at ${new Date(m.date).toLocaleString()} • ${m.location}`;
          maybeNotify({
            type: 'match_start',
            title,
            body,
            key: `match_start_${m.id}`,
            relatedMatchId: m.id
          });
        }
        
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

    // Resolve REAL Teams
    const teamA = teams.find(t => t.id === match.homeParticipant.id);
    const teamB = teams.find(t => t.id === match.awayParticipant.id);

    // Step 1.5: Use members from real teams
    const teamAPlayers = teamA?.members ?? [];
    const teamBPlayers = teamB?.members ?? [];

    // Step 1.6: Deterministic zero-state stats
    const homeStats: PlayerStats[] = teamAPlayers.map(m => ({
      playerId: m.playerId,
      runs: 0,
      balls: 0,
      wickets: 0,
      catches: 0
    }));

    const awayStats: PlayerStats[] = teamBPlayers.map(m => ({
      playerId: m.playerId,
      runs: 0,
      balls: 0,
      wickets: 0,
      catches: 0
    }));

    const allStats = [...homeStats, ...awayStats];

    // 2. Generate Achievements (Will be empty for zero stats, but logic preserved)
    const newAchievements: Achievement[] = [];
    
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
        const player = players.find(p => p.id === topScorer.playerId);
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
        // Use real players state
        const player = players.find(p => p.id === stat.playerId);
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
    const organizerName = currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "Organizer";

    // Participation Certificates
    allStats.forEach(stat => {
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

    // 4. Update Match Status
    updateMatch(match.id, { 
      status: 'completed',
      winnerId,
      homeParticipant: { ...match.homeParticipant, result: homeResult, players: homeStats },
      awayParticipant: { ...match.awayParticipant, result: awayResult, players: awayStats },
      actualEndTime: new Date().toISOString()
    });

    // 5. Update Feed
    const feedItem: FeedItem = {
      id: `${Date.now()}_end`,
      type: 'match_result',
      title: 'Match Completed',
      publishedAt: new Date().toISOString(),
      relatedEntityId: match.id,
      content: `${match.homeParticipant.name} ${homeScore}/${match.homeParticipant.wickets || 0} vs ${match.awayParticipant.name} ${awayScore}/${match.awayParticipant.wickets || 0}. Winner: ${winnerId === match.homeParticipant.id ? match.homeParticipant.name : (winnerId === match.awayParticipant.id ? match.awayParticipant.name : 'Draw')}`,
      visibility: 'public'
    };
    setFeedItems(prev => [feedItem, ...prev]);
    
    maybeNotify({
      type: 'match_result',
      title: 'Match Result',
      body: feedItem.content,
      key: `match_result_${match.id}`,
      relatedMatchId: match.id
    });
  };

  const updatePlayers = () => { console.log('updatePlayers called'); };
  const updateTeams = () => { console.log('updateTeams called'); };
  const updateFeed = () => { console.log('updateFeed called'); };

  useEffect(() => {
    followedTournaments.forEach(tid => {
      const t = tournaments.find(x => x.id === tid);
      if (!t) return;
      if (t.status === 'upcoming') {
        maybeNotify({
          type: 'tournament_event',
          title: `${t.name} schedule announced`,
          body: `${t.organizer} • ${t.location}`,
          key: `tournament_schedule_${t.id}`,
          relatedTournamentId: t.id
        });
      }
      if (t.status === 'ongoing') {
        maybeNotify({
          type: 'tournament_event',
          title: `${t.name} begins today`,
          body: `${t.organizer} • ${t.location}`,
          key: `tournament_start_${t.id}`,
          relatedTournamentId: t.id
        });
      }
      if (t.status === 'completed') {
        maybeNotify({
          type: 'tournament_event',
          title: `${t.name} final announced`,
          body: `${t.organizer} • ${t.location}`,
          key: `tournament_final_${t.id}`,
          relatedTournamentId: t.id
        });
      }
    });
  }, [followedTournaments, tournaments]);

  const addPlayer = (player: Player) => {
    setPlayers(prev => [player, ...prev]);
  };

  const addTournament = (tournament: Tournament) => {
    setTournaments(prev => [tournament, ...prev]);
  };

  const updateTournament = (tournament: Tournament) => {
    setTournaments(prev => prev.map(t => t.id === tournament.id ? tournament : t));
  };

  const addTeamToTournament = (tournamentId: string, teamId: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        const currentTeams = t.teams || [];
        if (currentTeams.includes(teamId)) return t;
        return { ...t, teams: [...currentTeams, teamId] };
      }
      return t;
    }));
  };

  const removeTeamFromTournament = (tournamentId: string, teamId: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { ...t, teams: (t.teams || []).filter(id => id !== teamId) };
      }
      return t;
    }));
  };

  const updateTournamentStructure = (tournamentId: string, structure: any) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { ...t, structure };
      }
      return t;
    }));
  };

  const updateTournamentScheduleMode = (tournamentId: string, scheduleMode: 'AUTO' | 'MANUAL' | 'LATER') => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { ...t, scheduleMode };
      }
      return t;
    }));
  };

  const addTeam = (team: Team) => {
    setTeams(prev => [team, ...prev]);
  };

  const addTeamMember = (teamId: string, member: { playerId: string; role: 'captain' | 'vice-captain' | 'member'; joinedAt: string }) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, members: [...t.members, member] } : t));
  };

  return (
    <GlobalContext.Provider value={{
      addPlayer,
      addTeam,
      addTeamMember,
      addTournament,
      updateTournament,
      addTeamToTournament,
      removeTeamFromTournament,
      updateTournamentStructure,
      updateTournamentScheduleMode,
      matches,
      players,
      gameProfiles,
      teams,
      tournaments,
      feedItems,
      achievements,
      certificates,
      currentUser,
      login,
      loginWithSupabase,
      logout,
      updateUserProfile,
      addMatch,
      updateMatch,
      startMatch,
      scoreMatch,
      endMatch,
      updateMatches,
      updatePlayers,
      updateTeams,
      updateFeed,
      users,
      matchScorers,
      assignScorer,
      removeScorer,
      getMatchScorers,
      canScoreMatch,
      followedTeams,
      followedTournaments,
      followedMatches,
      toggleFollowTeam,
      toggleFollowTournament,
      toggleFollowMatch,
      notifications,
      notificationsEnabled,
      matchStartEnabled,
      matchResultEnabled,
      setNotificationsEnabled,
      setMatchStartEnabled,
      setMatchResultEnabled,
      tournamentNotificationsEnabled,
      preferences,
      setTournamentNotificationsEnabled,
      updatePreferences
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
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
