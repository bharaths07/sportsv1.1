import { useMemo } from 'react';
import { useGlobalState } from '../app/AppProviders';

interface SearchOptions {
  limit?: number;
}

export const useSearchLogic = (searchTerm: string, options: SearchOptions = {}) => {
  const { matches, teams, tournaments } = useGlobalState();
  // Default limit to 5 if not provided. Use Infinity for no limit.
  const limit = options.limit ?? 5;

  return useMemo(() => {
    const rawTerm = searchTerm.trim();
    if (rawTerm.length < 1) return { matches: [], teams: [], tournaments: [] };

    // 1. Preprocessing & Abbreviations
    const ABBREVIATIONS: Record<string, string> = {
      'wi': 'west indies',
      'csk': 'chennai super kings',
      't20 wc': 't20 world cup',
      'rcb': 'royal challengers bangalore',
      'mi': 'mumbai indians',
      'ind': 'india',
      'aus': 'australia',
      'eng': 'england'
    };
    
    const lowerTerm = rawTerm.toLowerCase();
    const term = ABBREVIATIONS[lowerTerm] || lowerTerm;

    // 2. Popularity Definitions (Static List)
    const POPULAR_TEAMS = ['india', 'australia', 'royal strikers', 'chennai super kings'];
    
    // --- MATCHES (Priority 1) ---
    // Rules: Live > Upcoming > Completed (recent first)
    const matchedMatches = matches.filter(m => {
      const home = m.homeParticipant.name.toLowerCase();
      const away = m.awayParticipant.name.toLowerCase();
      const vs = `${home} vs ${away}`;
      return vs.includes(term) || home.includes(term) || away.includes(term);
    }).sort((a, b) => {
      // 1. Status Priority
      const statusScore = (s: string) => {
        if (s === 'live') return 3;
        if (s === 'draft') return 2; // Upcoming
        return 1; // Completed/Locked
      };
      const scoreA = statusScore(a.status);
      const scoreB = statusScore(b.status);
      
      if (scoreA !== scoreB) return scoreB - scoreA;
      
      // 2. Tie-breaker: Exact vs Partial (Simulated by checking index)
      // (Optional refinement: could check if term matches start of string vs middle)

      // 3. For Completed: Date Descending
      if (a.status === 'completed' || a.status === 'locked') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      // For Live/Upcoming: Date Ascending (soonest first)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).slice(0, limit);

    // --- TEAMS (Priority 2) ---
    // Rules: Exact > Popularity > Alphabetical
    const matchedTeams = teams.filter(t => 
      t.name.toLowerCase().includes(term)
    ).sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      // 1. Exact Match
      if (nameA === term && nameB !== term) return -1;
      if (nameB === term && nameA !== term) return 1;

      // 2. Popularity
      const isPopA = POPULAR_TEAMS.some(p => nameA.includes(p));
      const isPopB = POPULAR_TEAMS.some(p => nameB.includes(p));
      if (isPopA && !isPopB) return -1;
      if (!isPopA && isPopB) return 1;

      // 3. Alphabetical
      return nameA.localeCompare(nameB);
    }).slice(0, limit);

    // --- TOURNAMENTS (Priority 3) ---
    // Rules: Ongoing/Upcoming > Completed > Older
    const matchedTournaments = tournaments.filter(t => 
      t.name.toLowerCase().includes(term)
    ).sort((a, b) => {
      const statusScore = (s: string) => {
        if (s === 'ongoing' || s === 'upcoming') return 2;
        return 1; // completed
      };
      const scoreA = statusScore(a.status);
      const scoreB = statusScore(b.status);
      
      if (scoreA !== scoreB) return scoreB - scoreA;
      
      return 0; // Keep mock order or sort by date if available
    }).slice(0, limit);

    return {
      matches: matchedMatches,
      teams: matchedTeams,
      tournaments: matchedTournaments
    };
  }, [searchTerm, matches, teams, tournaments, limit]);
};
