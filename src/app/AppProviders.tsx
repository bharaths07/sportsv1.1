import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { matchService } from '../services/matchService';
import { teamService } from '../services/teamService';
import { tournamentService } from '../services/tournamentService';
import { profileService } from '../services/profileService';
import { achievementService } from '../services/achievementService';
import { certificateService } from '../services/certificateService';
import { feedService } from '../services/feedService';
import { scorerService } from '../services/scorerService';
import { playerService } from '../services/playerService';
import { scoreEngine } from '../services/scoreEngine';
import { cricheroesIntegrationService } from '../services/cricheroesIntegrationService';
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
import { shouldBypassAuth } from './authBypass';

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
    theme: 'light' | 'dark';
    accent: 'amber' | 'green' | 'pink' | 'violet' | 'red' | 'blue';
    denseMode: boolean;
    showAnimations: boolean;
    publicProfile: boolean;
    showOnlineStatus: boolean;
  };
  devAuthBypassActive?: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authLoading: boolean;
  login: (email: string, password: string, name?: string) => Promise<void>;
  loginWithSupabase: (email: string, name?: string) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  addPlayer: (player: Player) => void;
  updatePlayerState: (player: Player) => void;
  addTeam: (team: Team) => void;
  addTeamMember: (teamId: string, member: { playerId: string; role: 'captain' | 'vice-captain' | 'member'; joinedAt: string }) => void;
  addMatch: (match: Match) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  scoreMatch: (matchId: string, eventOrRuns: number | Partial<ScoreEvent>, isWicketLegacy?: boolean) => void;
  startMatch: (matchId: string, initialData?: { strikerId: string; nonStrikerId: string; bowlerId: string }) => void;
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
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addTournament: (tournament: Tournament) => void;
  updateTournament: (tournament: Tournament) => void;
  addTeamToTournament: (tournamentId: string, teamId: string) => void;
  removeTeamFromTournament: (tournamentId: string, teamId: string) => void;
  updateTournamentStructure: (tournamentId: string, structure: any) => void;
  updateTournamentScheduleMode: (tournamentId: string, scheduleMode: 'AUTO' | 'MANUAL' | 'LATER') => void;
  startTournament: (tournamentId: string) => void;
  updateFeed: () => void;
  assignScorer: (matchId: string, userId: string) => void;
  removeScorer: (matchId: string, userId: string) => void;
  getMatchScorers: (matchId: string) => MatchScorer[];
  canScoreMatch: (matchId: string) => boolean;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('scoreheroes_players');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [gameProfiles] = useState<GameProfile[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
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
      timezone: 'Asia/Kolkata',
      language: 'English',
      theme: 'light',
      accent: 'amber',
      // Display
      denseMode: false,
      showAnimations: true,
      // Privacy
      publicProfile: true,
      showOnlineStatus: true
    };
  });
  const [users, setUsers] = useState<User[]>([]);
  const [matchScorers, setMatchScorers] = useState<MatchScorer[]>(() => {
    const saved = localStorage.getItem('scoreheroes_match_scorers');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [devAuthBypassActive, setDevAuthBypassActive] = useState<boolean>(false);

  const refreshData = async () => {
    try {
      const [
        fetchedMatches,
        fetchedTeams,
        fetchedTournaments,
        fetchedUsers,
        fetchedAchievements,
        fetchedCertificates,
        fetchedFeedItems,
        fetchedScorers,
        fetchedPlayers
      ] = await Promise.all([
        matchService.getAllMatches(),
        teamService.getAllTeams(),
        tournamentService.getAllTournaments(),
        profileService.getAllProfiles(),
        achievementService.getAllAchievements(),
        certificateService.getAllCertificates(),
        feedService.getAllFeedItems(),
        scorerService.getAllScorers(),
        playerService.getAllPlayers()
      ]);
      setMatches(fetchedMatches);
      setTeams(fetchedTeams);
      setTournaments(fetchedTournaments);
      setUsers(fetchedUsers);
      setAchievements(fetchedAchievements);
      setCertificates(fetchedCertificates);
      setFeedItems(fetchedFeedItems);
      setMatchScorers(fetchedScorers);
      
      if (fetchedPlayers.length > 0) {
        setPlayers(fetchedPlayers);
      } else {
        // Fallback: Map users to players for legacy compatibility if players table is empty
        const mappedPlayers: Player[] = fetchedUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: undefined,
          firstName: u.name?.split(' ')[0] || '',
          lastName: u.name?.split(' ').slice(1).join(' ') || '',
          active: true,
          status: 'active' as const,
          stats: { matchesPlayed: 0, wins: 0, losses: 0, draws: 0, scoreAccumulated: 0 },
          history: []
        }));
        setPlayers(mappedPlayers);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  // Step 3 — Centralized Auth State Manager
  useEffect(() => {
    let mounted = true;

    const handleUserSession = async (authUser: any) => {
      console.log('[AuthGate] Handling user session for:', authUser.id);
      
      try {
        // Direct profile fetch without artificial timeout
        const profile = await profileService.getProfile(authUser.id) as User | null;

        console.log('[AuthGate] Profile fetch result:', profile ? 'Found' : 'Missing');
        
        if (mounted) {
          if (profile) {
            console.log('[AuthGate] Profile found. Setting current user.');
            setCurrentUser(profile);
          } else {
            console.log('[AuthGate] Profile missing, creating default user structure. Profile:', profile);
            
            // Just set the user with what we have from Auth
            setCurrentUser({
              id: authUser.id,
              email: authUser.email || '',
              phone: authUser.phone,
              name: authUser.user_metadata?.name ?? '', 
              role: 'user'
            });
          }
        }
      } catch (err) {
        console.error("[AuthGate] Error fetching profile:", err);
        // On error, still set current user so they can enter the app
        if (mounted) {
             setCurrentUser({
              id: authUser.id,
              email: authUser.email || '',
              phone: authUser.phone,
              name: '',
              role: 'user'
            });
        }
      }
    };

    const initAuth = async () => {
      console.log('[AuthGate] Initializing auth...');
      
      // Safety timeout to ensure we never get stuck on loading screen
      const safetyTimeout = setTimeout(() => {
          console.warn('[AuthGate] Safety timeout triggered. Forcing load completion.');
          if (mounted) setAuthLoading(false);
      }, 2500);

      try {
        // Fire and forget refreshData, but catch errors to be safe
        refreshData().catch(e => console.error('[AuthGate] Data refresh failed:', e));

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!data.session) {
          console.log('[AuthGate] No session found');
          // Check localStorage for legacy session (fallback)
          const legacyUser = localStorage.getItem('scoreheroes_user');
          if (legacyUser) {
             try {
                const parsed = JSON.parse(legacyUser);
                console.log('[AuthGate] Recovered legacy session');
                if (mounted) setCurrentUser(parsed);
             } catch (e) {
                console.warn('[AuthGate] Failed to parse legacy session', e);
                if (mounted) setCurrentUser(null);
             }
          } else {
             if (mounted) setCurrentUser(null);
          }
          return;
        }
        
        console.log('[AuthGate] Session found, checking profile...');
        if (data.session.user) {
          await handleUserSession(data.session.user);
        }
      } catch (error) {
        console.error('[AuthGate] Initialization error:', error);
        // Fallback to null on error
        if (mounted) setCurrentUser(null);
      } finally {
        clearTimeout(safetyTimeout);
        console.log('[AuthGate] Loading finished (finally block)');
        if (mounted) setAuthLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log(`[AuthGate] Auth state change: ${event}`);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) setCurrentUser(null);
      } else if (session?.user) {
        await handleUserSession(session.user);
      }
      
      // Ensure loading is false after any auth change event
      if (mounted) setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Development/Test auth bypass (non-production only)
  useEffect(() => {
    const env = import.meta.env as { PROD: boolean; VITE_AUTH_BYPASS?: string };
    if (shouldBypassAuth(env) && !currentUser) {
      const devUser: User = {
        id: 'dev-bypass-user',
        name: 'Developer Mode',
        email: 'dev@local',
        role: 'admin',
        firstName: 'Dev',
        lastName: 'Bypass',
        memberSince: new Date().getFullYear().toString(),
        followersCount: 0,
        followingCount: 0,
        profileViews: 0,
        type: 'user'
      };
      setCurrentUser(devUser);
      setDevAuthBypassActive(true);
      console.warn('[Auth] Authentication BYPASS active (non-production mode)');
    } else {
      setDevAuthBypassActive(false);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // NOTE: MVP-only auth. Replace with real backend auth before production.
  const login = async (email: string, password: string, name?: string) => {
    // Simple hashing
    const hashPassword = async (pwd: string) => {
      const msgBuffer = new TextEncoder().encode(pwd);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const hashedPassword = await hashPassword(password);
    let user = users.find(u => u.email === email);

    if (user) {
      // Check password if it exists
      if (user.passwordHash && user.passwordHash !== hashedPassword) {
        // Simple error handling for now - ideally throw error or return status
        throw new Error('Invalid password');
      }
      // If no password hash (legacy user), update it to claim account
      if (!user.passwordHash) {
        const updatedUser = { ...user, passwordHash: hashedPassword };
        const userId = user.id;
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        user = updatedUser;
      }
    } else {
      // Create new user
      const displayName = name || email.split('@')[0];
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const newUser: User = {
        id: crypto.randomUUID(),
        name: displayName,
        email,
        passwordHash: hashedPassword,
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
      user = newUser;
      setUsers(prev => [...prev, newUser]);
    }

    setCurrentUser(user);
  };

  // Step 3.1 — Add Supabase Login Function (Parallel)
  const loginWithSupabase = async (email: string, name?: string) => {
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
        data: name ? { name } : undefined,
      },
    });

    if (error) {
      console.error('Supabase login error:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@playlegends.app',
      role: 'user',
      firstName: 'Guest',
      lastName: 'User',
      memberSince: new Date().getFullYear().toString(),
      followersCount: 0,
      followingCount: 0,
      profileViews: 0,
      type: 'user'
    };
    setCurrentUser(guestUser);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;

    const updates: Partial<User> = { ...data };

    // Legacy mapping: if firstName/lastName provided, update name
    if (data.firstName || data.lastName) {
      const currentFirst = currentUser.name ? currentUser.name.split(' ')[0] : '';
      const currentLast = currentUser.name ? currentUser.name.split(' ').slice(1).join(' ') : '';
      
      const first = data.firstName !== undefined ? data.firstName : currentFirst;
      const last = data.lastName !== undefined ? data.lastName : currentLast;
      updates.name = `${first} ${last}`.trim();
    }

    try {
      const updatedProfile = await profileService.updateProfile(currentUser.id, updates);
      if (updatedProfile) {
        setCurrentUser({ 
          ...currentUser, 
          ...data, 
          ...updatedProfile 
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const assignScorer = async (matchId: string, userId: string) => {
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

    try {
      const createdScorer = await scorerService.assignScorer(newAssignment);
      setMatchScorers(prev => [...prev, createdScorer]);
    } catch (error) {
      console.error('Failed to assign scorer:', error);
    }
  };

  const removeScorer = async (matchId: string, userId: string) => {
    if (currentUser?.role !== 'admin') return;
    
    try {
      await scorerService.removeScorer(matchId, userId);
      setMatchScorers(prev => prev.filter(ms => !(ms.matchId === matchId && ms.userId === userId)));
    } catch (error) {
      console.error('Failed to remove scorer:', error);
    }
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
      localStorage.setItem('scoreheroes_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('scoreheroes_user');
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
    localStorage.setItem('feedItems', JSON.stringify(feedItems));
  }, [feedItems]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }, [certificates]);

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
    const root = document.documentElement;
    if (preferences.theme === 'dark') root.classList.add('dark-theme');
    else root.classList.remove('dark-theme');
    const accentMap: Record<GlobalState['preferences']['accent'], string> = {
      amber: '#f59e0b',
      green: '#22c55e',
      pink: '#ec4899',
      violet: '#7c3aed',
      red: '#ef4444',
      blue: '#2563eb'
    };
    root.style.setProperty('--accent', accentMap[preferences.accent]);
  }, [preferences.theme, preferences.accent]);

  // (Removed duplicate persistence effects)

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

  const updatePreferences = useCallback((prefs: Partial<GlobalState['preferences']>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateMatches = () => { refreshData(); };

  const addMatch = async (match: Match) => {
    try {
      const newMatch = await matchService.createMatch(match);
      setMatches(prev => [newMatch, ...prev]);
    } catch (error) {
      console.error('Failed to create match:', error);
      // Fallback: Add to local state anyway for offline/demo feel if DB fails? 
      // No, let's enforce DB success.
      alert('Failed to create match. Please try again.');
    }
  };

  const updateMatch = async (matchId: string, updates: Partial<Match>) => {
    try {
      await matchService.updateMatch(matchId, updates);
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, ...updates } : m));
    } catch (error) {
      console.error('Failed to update match:', error);
    }
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

  const startMatch = async (matchId: string, initialData?: { strikerId: string; nonStrikerId: string; bowlerId: string }) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    // Only allow Draft -> Live transition
    if (match.status !== 'draft') return;

    const isMatchFollowed = followedMatches.includes(match.id);
    const involvesFollowed = isMatchFollowed || followedTeams.includes(match.homeParticipant.id) || followedTeams.includes(match.awayParticipant.id);
    
    if (involvesFollowed) {
      const title = `${match.homeParticipant.name} vs ${match.awayParticipant.name} is about to start`;
      const body = `Starts at ${new Date(match.date).toLocaleString()} • ${match.location}`;
      maybeNotify({
        type: 'match_start',
        title,
        body,
        key: `match_start_${match.id}`,
        relatedMatchId: match.id
      });
    }
    
    const updates: Partial<Match> = { 
        status: 'live' as const,
        actualStartTime: new Date().toISOString()
    };

    if (initialData) {
        updates.liveState = {
            strikerId: initialData.strikerId,
            nonStrikerId: initialData.nonStrikerId,
            bowlerId: initialData.bowlerId,
            currentOver: 0,
            ballsInCurrentOver: 0
        };
        // Also ensure currentBattingTeamId is set based on Toss if not already
        if (!match.currentBattingTeamId && match.toss) {
            updates.currentBattingTeamId = match.toss.decision === 'BAT' 
                ? match.toss.winnerTeamId 
                : (match.toss.winnerTeamId === match.homeParticipant.id ? match.awayParticipant.id : match.homeParticipant.id);
        }
    }

    try {
      await matchService.updateMatch(matchId, updates);
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, ...updates } : m));
    } catch (error) {
      console.error('Failed to start match:', error);
    }
  };

  const scoreMatch = async (matchId: string, eventOrRuns: number | Partial<ScoreEvent>, isWicketLegacy?: boolean) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    let newEvent: ScoreEvent;

    // Handle Legacy vs New Signature
    if (typeof eventOrRuns === 'number') {
      const runs = eventOrRuns;
      const isWicket = isWicketLegacy || false;
      
      // Determine context (simplified for legacy calls)
      const battingTeamId = match.currentBattingTeamId || match.homeParticipant.id;
      
      const over = Math.floor((match.homeParticipant.id === battingTeamId ? match.homeParticipant.balls || 0 : match.awayParticipant.balls || 0) / 6);
      const ballInOver = ((match.homeParticipant.id === battingTeamId ? match.homeParticipant.balls || 0 : match.awayParticipant.balls || 0) % 6) + 1;
      
      let desc = `Over ${over}.${ballInOver} - ${runs} runs`;
      if (isWicket) desc = `Over ${over}.${ballInOver} - WICKET!`;
      if (runs === 4) desc = `Over ${over}.${ballInOver} - FOUR!`;
      if (runs === 6) desc = `Over ${over}.${ballInOver} - SIX!`;

      newEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        points: runs,
        description: desc,
        type: isWicket ? 'wicket' : 'delivery',
        teamId: battingTeamId,
        runsScored: runs, // Assume all runs are off bat for legacy
        isWicket: isWicket
      };
    } else {
      // Detailed Event
      newEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        description: 'Ball bowled', // Default
        points: 0, // Default
        type: 'delivery', // Default
        ...eventOrRuns
      } as ScoreEvent;
      
      // Calculate points if not provided but runs/extras are
      if (newEvent.points === 0) {
          newEvent.points = (newEvent.runsScored || 0) + (newEvent.extras?.runs || 0);
      }
      if (!newEvent.description) {
         if (newEvent.isWicket) newEvent.description = "Wicket";
         else newEvent.description = `${newEvent.points} runs`;
      }
    }

    // Apply Logic via Engine
    const updatedMatch = scoreEngine.applyEvent(match, newEvent);

    // Also update global feed
    let subjectTeamName = '';
    if (newEvent.teamId) {
        subjectTeamName = newEvent.teamId === updatedMatch.homeParticipant.id ? updatedMatch.homeParticipant.name : updatedMatch.awayParticipant.name;
    } else {
        subjectTeamName = updatedMatch.currentBattingTeamId === updatedMatch.homeParticipant.id ? updatedMatch.homeParticipant.name : updatedMatch.awayParticipant.name;
    }

    const feedItem: FeedItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'match_update',
      title: `${subjectTeamName}: ${newEvent.description}`,
      publishedAt: new Date().toISOString(),
      relatedEntityId: matchId,
      content: newEvent.description,
      visibility: 'public',
      authorId: 'system',
      authorName: 'System',
      authorType: 'system',
      media: [],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      hashtags: [],
      isLikedByCurrentUser: false
    };

    try {
      await matchService.updateMatch(matchId, {
        homeParticipant: updatedMatch.homeParticipant,
        awayParticipant: updatedMatch.awayParticipant,
        events: updatedMatch.events,
        currentBattingTeamId: updatedMatch.currentBattingTeamId,
        liveState: updatedMatch.liveState
      });

      // Persist feed item
      const createdFeedItem = await feedService.createFeedItem(feedItem);

      setMatches(prevMatches => prevMatches.map(m => m.id === matchId ? updatedMatch : m));
      setFeedItems(prev => [createdFeedItem, ...prev]);
    } catch (error) {
      console.error('Failed to score match:', error);
    }
  };

  const endMatch = async (matchId: string) => {
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

    // Step 1.6: Use actual stats from the match
    const homeMatchStats = match.homeParticipant.players || [];
    const awayMatchStats = match.awayParticipant.players || [];

    // Helper to map stats
    const mapStats = (teamPlayers: any[], matchStats: PlayerStats[]) => {
        return teamPlayers.map(m => {
            const stat = matchStats.find(s => s.playerId === m.playerId);
            return {
                playerId: m.playerId,
                runs: stat?.runs || 0,
                balls: stat?.balls || 0,
                wickets: stat?.wickets || 0,
                catches: stat?.catches || 0,
                ballsBowled: stat?.ballsBowled || 0,
                runsConceded: stat?.runsConceded || 0,
                runouts: stat?.runouts || 0,
                // Football
                goals: stat?.goals || 0,
                assists: stat?.assists || 0,
                yellowCards: stat?.yellowCards || 0,
                redCards: stat?.redCards || 0
            };
        });
    };

    const homeStats = mapStats(teamAPlayers, homeMatchStats);
    const awayStats = mapStats(teamBPlayers, awayMatchStats);
    const allStats = [...homeStats, ...awayStats];

    // 2. Generate Achievements (Will be empty for zero stats, but logic preserved)
    const newAchievements: Achievement[] = [];
    
    // Player of the Match (Highest Impact)
    if (allStats.length > 0) {
      const topScorer = allStats.reduce((prev, current) => {
          let prevImpact = 0;
          let currentImpact = 0;

          if (match.sportId === 's3') {
             // Football: Goal=20, Assist=10
             prevImpact = (prev.goals || 0) * 20 + (prev.assists || 0) * 10;
             currentImpact = (current.goals || 0) * 20 + (current.assists || 0) * 10;
          } else {
             // Cricket: Runs + Wickets*20
             prevImpact = (prev.runs || 0) + ((prev.wickets || 0) * 20);
             currentImpact = (current.runs || 0) + ((current.wickets || 0) * 20);
          }
          return (prevImpact > currentImpact) ? prev : current;
      });

      let impact = 0;
      if (match.sportId === 's3') {
         impact = (topScorer.goals || 0) * 20 + (topScorer.assists || 0) * 10;
      } else {
         impact = (topScorer.runs || 0) + ((topScorer.wickets || 0) * 20);
      }

      // Only award POTM if impact is significant (>= 20 points)
      if (impact >= 20) {
        const player = players.find(p => p.id === topScorer.playerId);
        if (player) {
          const desc = [];
          if (match.sportId === 's3') {
              if ((topScorer.goals || 0) > 0) desc.push(`${topScorer.goals} goals`);
              if ((topScorer.assists || 0) > 0) desc.push(`${topScorer.assists} assists`);
          } else {
              if ((topScorer.runs || 0) > 0) desc.push(`${topScorer.runs} runs`);
              if ((topScorer.wickets || 0) > 0) desc.push(`${topScorer.wickets} wickets`);
          }
          
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

    // Sport-Specific Achievements
    allStats.forEach(stat => {
        // Use real players state
        const player = players.find(p => p.id === stat.playerId);
        if (!player) return;

        if (match.sportId === 's3') {
            // Football: Hat-Trick
            if ((stat.goals || 0) >= 3) {
                 newAchievements.push({
                    id: Date.now().toString() + '_' + stat.playerId + '_hattrick',
                    type: 'hat_trick',
                    title: 'Hat-Trick',
                    playerId: stat.playerId,
                    matchId: match.id,
                    date: new Date().toISOString(),
                    description: `Scored ${stat.goals} goals`
                });
            }
        } else {
            // Cricket: Centuries, 50s, 5W
            // Prevent duplicate awards for same performance (e.g. 100 includes 50)
            // Rule: If Century, don't award Half Century.
            if ((stat.runs || 0) >= 100) {
                newAchievements.push({
                    id: Date.now().toString() + '_' + stat.playerId + '_100',
                    type: 'century',
                    title: 'Century',
                    playerId: stat.playerId,
                    matchId: match.id,
                    date: new Date().toISOString(),
                    description: `Scored ${stat.runs} runs`
                });
            } else if ((stat.runs || 0) >= 50) {
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

            if ((stat.wickets || 0) >= 5) {
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
        }
    });
    
    // Persist Achievements
    const savedAchievements: Achievement[] = [];
    if (newAchievements.length > 0) {
      try {
        const results = await Promise.all(newAchievements.map(a => achievementService.createAchievement(a)));
        savedAchievements.push(...results);
        setAchievements(prev => [...results, ...prev]);
      } catch (error) {
        console.error('Failed to save achievements:', error);
        // Fallback for UI continuity
        savedAchievements.push(...newAchievements);
        setAchievements(prev => [...newAchievements, ...prev]);
      }
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
            templateId: 'default',
            recipientId: stat.playerId,
            recipientName: 'Player',
            issueDate: new Date().toISOString(),
            issuerId: 'system',
            verificationHash: 'pending',
            status: 'issued',
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
    savedAchievements.forEach(ach => {
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
            templateId: 'default',
            recipientId: ach.playerId,
            recipientName: 'Player',
            issueDate: new Date().toISOString(),
            issuerId: 'system',
            verificationHash: 'pending',
            status: 'issued', 
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
      try {
        const results = await Promise.all(newCertificates.map(c => certificateService.createCertificate(c)));
        setCertificates(prev => [...results, ...prev]);
      } catch (error) {
        console.error('Failed to save certificates:', error);
        setCertificates(prev => [...newCertificates, ...prev]);
      }
    }

    // 4. Update Match Status
    await updateMatch(match.id, { 
      status: 'completed',
      winnerId,
      homeParticipant: { ...match.homeParticipant, result: homeResult, players: homeStats },
      awayParticipant: { ...match.awayParticipant, result: awayResult, players: awayStats },
      actualEndTime: new Date().toISOString()
    });

    // 5. Update Feed
    const feedItem: FeedItem = {
      id: `${Date.now()}_end`,
      type: 'match_update',
      title: 'Match Completed',
      publishedAt: new Date().toISOString(),
      relatedEntityId: match.id,
      content: `${match.homeParticipant.name} ${homeScore}/${match.homeParticipant.wickets || 0} vs ${match.awayParticipant.name} ${awayScore}/${match.awayParticipant.wickets || 0}. Winner: ${winnerId === match.homeParticipant.id ? match.homeParticipant.name : (winnerId === match.awayParticipant.id ? match.awayParticipant.name : 'Draw')}`,
      visibility: 'public',
      authorId: 'system',
      authorName: 'System',
      authorType: 'system',
      media: [],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      hashtags: [],
      isLikedByCurrentUser: false
    };
    
    try {
      const createdFeedItem = await feedService.createFeedItem(feedItem);
      setFeedItems(prev => [createdFeedItem, ...prev]);
    } catch (error) {
      console.error('Failed to create feed item:', error);
      setFeedItems(prev => [feedItem, ...prev]);
    }
    
    maybeNotify({
      type: 'match_result',
      title: 'Match Result',
      body: feedItem.content,
      key: `match_result_${match.id}`,
      relatedMatchId: match.id
    });
  };

  const updatePlayers = () => { refreshData(); };
  const updateTeams = () => { refreshData(); };
  const updateFeed = () => { refreshData(); };

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

  const addPlayer = async (player: Player) => {
    try {
      const newPlayer = await playerService.createPlayer(player);
      setPlayers(prev => [newPlayer, ...prev]);
    } catch (error) {
      console.error('Failed to create player:', error);
      alert('Failed to create player.');
    }
  };

  const updatePlayerState = (player: Player) => {
    setPlayers(prev => prev.map(p => p.id === player.id ? player : p));
  };

  const addTournament = async (tournament: Tournament) => {
    try {
      await tournamentService.createTournament(tournament);
      refreshData();
    } catch (error) {
      console.error('Failed to create tournament:', error);
      alert('Failed to create tournament.');
    }
  };

  const updateTournament = async (tournament: Tournament) => {
    try {
      await tournamentService.updateTournament(tournament.id, tournament);
      refreshData();
    } catch (error) {
      console.error('Failed to update tournament:', error);
    }
  };

  const startTournament = async (id: string) => {
    try {
      // Use the Cricheroes Integration Service
      const tournamentTeams = teams.filter(t => 
        tournaments.find(tour => tour.id === id)?.teams?.includes(t.id)
      );
      
      const result = await cricheroesIntegrationService.startTournament(id, tournamentTeams, { scheduleMode: 'AUTO' });
      
      if (result.success) {
        // Refresh local state
        const updatedList = await tournamentService.getAllTournaments();
        setTournaments(updatedList);
        
        // Refresh matches if generated
        if (result.matchesGenerated && result.matchesGenerated > 0) {
            const allMatches = await matchService.getAllMatches();
            setMatches(allMatches);
        }
        
        maybeNotify({
            type: 'tournament_event',
            title: 'Tournament Started',
            body: result.message,
            key: `tour_start_${id}`,
            relatedTournamentId: id
        });
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to start tournament:', error);
    }
  };

  const addTeamToTournament = async (tournamentId: string, teamId: string) => {
    try {
      await tournamentService.addTeam(tournamentId, teamId);
      refreshData();
    } catch (error) {
      console.error('Failed to add team to tournament:', error);
    }
  };

  const removeTeamFromTournament = async (tournamentId: string, teamId: string) => {
    try {
      await tournamentService.removeTeam(tournamentId, teamId);
      refreshData();
    } catch (error) {
      console.error('Failed to remove team from tournament:', error);
    }
  };

  const updateTournamentStructure = async (tournamentId: string, structure: any) => {
    try {
      await tournamentService.updateTournament(tournamentId, { structure });
      refreshData();
    } catch (error) {
      console.error('Failed to update tournament structure:', error);
    }
  };

  const updateTournamentScheduleMode = async (tournamentId: string, scheduleMode: 'AUTO' | 'MANUAL' | 'LATER') => {
    try {
      // @ts-ignore - scheduleMode might be missing in strict types but supported in DB/runtime
      await tournamentService.updateTournament(tournamentId, { scheduleMode });
      refreshData();
    } catch (error) {
      console.error('Failed to update tournament schedule mode:', error);
    }
  };

  const addTeam = async (team: Team) => {
    try {
      const newTeam = await teamService.createTeam(team);
      if (newTeam) {
        setTeams(prev => [newTeam, ...prev]);
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team.');
    }
  };

  const addTeamMember = async (teamId: string, member: { playerId: string; role: 'captain' | 'vice-captain' | 'member'; joinedAt: string }) => {
    try {
      await teamService.addMember(teamId, member);
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, members: [...t.members, member] } : t));
    } catch (error) {
      console.error('Failed to add team member:', error);
    }
  };

  const loginWithPhone = async (phone: string) => {
    try {
      console.log('[Auth] Sending OTP to:', phone);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      if (error) throw error;
      localStorage.setItem('otp_requested_at', Date.now().toString());
      return { success: true };
    } catch (error: any) {
      console.error('Phone login error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      // Supabase verification
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Fetch or create user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profile) {
            const user: User = {
                id: profile.id,
                name: profile.name || 'User',
                email: '', 
                phone: phone,
                role: 'user',
                avatarUrl: profile.avatar_url
            };
            setCurrentUser(user);
        } else {
            // New user or profile fetch failed - Create minimal user
            const newUser: User = {
                id: data.user.id,
                name: 'New User',
                email: '',
                phone: phone,
                role: 'user'
            };
            setCurrentUser(newUser);
        }
        return { success: true };
      }
      return { success: false, error: 'Invalid OTP' };
    } catch (error: any) {
      console.error('[AppProviders] OTP verification error:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <GlobalContext.Provider value={{
      addPlayer,
      updatePlayerState,
      addTeam,
      addTeamMember,
      addTournament,
      updateTournament,
      addTeamToTournament,
      removeTeamFromTournament,
      updateTournamentStructure,
      updateTournamentScheduleMode,
      startTournament,
      matches,
      players,
      gameProfiles,
      teams,
      tournaments,
      feedItems,
      achievements,
      certificates,
      currentUser,
      setCurrentUser,
      authLoading,
      login,
      loginWithSupabase,
      loginWithPhone,
      verifyOtp,
      loginAsGuest,
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
      devAuthBypassActive,
      setTournamentNotificationsEnabled,
      updatePreferences,
      dismissNotification,
      clearAllNotifications
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
