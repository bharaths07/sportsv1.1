import React, { useMemo, useEffect, useRef } from 'react';
import { Match } from '../../domain/match';
import { MatchCard } from '../../newui/MatchCard';

interface TournamentMatchesTabProps {
  matches: Match[];
}

interface StageGroup {
  name: string;
  startDate: number; // For sorting stages
  matches: Match[];
}

interface DateGroup {
  label: string;
  dateValue: number; // For sorting dates within stage
  matches: Match[];
}

export const TournamentMatchesTab: React.FC<TournamentMatchesTabProps> = ({ matches }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 1. Group by Stage and Sort Stages
  const stageGroups = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    
    matches.forEach(match => {
      const stage = match.stage || 'General'; // Default if no stage
      if (!groups[stage]) groups[stage] = [];
      groups[stage].push(match);
    });

    // Convert to array and calculate start date for each stage
    const stageArray: StageGroup[] = Object.keys(groups).map(stage => {
      const stageMatches = groups[stage];
      // Find earliest date in this stage to sort stages chronologically
      const startDate = Math.min(...stageMatches.map(m => new Date(m.date).getTime()));
      return {
        name: stage,
        startDate,
        matches: stageMatches
      };
    });

    // Sort stages: Earliest start date first
    // Secondary sort: "Final" usually last if dates are close? 
    // For now, strict chronological start is best for "Journey".
    return stageArray.sort((a, b) => a.startDate - b.startDate);
  }, [matches]);

  // 2. Process Matches inside each Stage (Date Grouping + Sort)
  const processedStages = useMemo(() => {
    return stageGroups.map(stage => {
      // Group by Date within Stage
      const dateGroups: Record<string, Match[]> = {
        'Today': [],
        'Tomorrow': [],
        'Other': [] // Temporary bucket, will expand to specific dates
      };
      
      const specificDateGroups: Record<string, Match[]> = {};

      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      stage.matches.forEach(match => {
        const matchDate = new Date(match.date);
        const matchDateOnly = new Date(matchDate);
        matchDateOnly.setHours(0, 0, 0, 0);

        if (matchDateOnly.getTime() === today.getTime()) {
          dateGroups['Today'].push(match);
        } else if (matchDateOnly.getTime() === tomorrow.getTime()) {
          dateGroups['Tomorrow'].push(match);
        } else {
          // Use full date string as key
          const dateStr = matchDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
          if (!specificDateGroups[dateStr]) specificDateGroups[dateStr] = [];
          specificDateGroups[dateStr].push(match);
        }
      });

      // Sort matches within groups: Live > Upcoming > Finished
      const sortMatches = (ms: Match[]) => {
        return ms.sort((a, b) => {
          // Live always first
          if (a.status === 'live' && b.status !== 'live') return -1;
          if (b.status === 'live' && a.status !== 'live') return 1;

          const timeA = new Date(a.date).getTime();
          const timeB = new Date(b.date).getTime();

          // Upcoming matches: Chronological (soonest first)
          if (a.status === 'draft' && b.status === 'draft') return timeA - timeB;

          // Finished matches: Reverse Chronological (most recent first)??
          // User says: "Live matches first, Upcoming matches next, Finished matches last"
          // Usually finished matches are better reverse chrono.
          if ((a.status === 'completed' || a.status === 'cancelled') && (b.status === 'completed' || b.status === 'cancelled')) {
             return timeB - timeA;
          }

          // Status priority: Live > Draft > Completed
          const getStatusScore = (s: string) => {
             if (s === 'live') return 0;
             if (s === 'draft') return 1;
             return 2;
          };
          return getStatusScore(a.status) - getStatusScore(b.status);
        });
      };

      // Construct final date groups array
      const finalDateGroups: DateGroup[] = [];

      // Add Today
      if (dateGroups['Today'].length > 0) {
        finalDateGroups.push({ label: 'Today', dateValue: today.getTime(), matches: sortMatches(dateGroups['Today']) });
      }
      // Add Tomorrow
      if (dateGroups['Tomorrow'].length > 0) {
        finalDateGroups.push({ label: 'Tomorrow', dateValue: tomorrow.getTime(), matches: sortMatches(dateGroups['Tomorrow']) });
      }
      // Add Specific Dates (sorted)
      Object.keys(specificDateGroups).forEach(dateStr => {
         const ms = specificDateGroups[dateStr];
         // Use first match date for sorting the group itself
         const groupDate = new Date(ms[0].date).getTime();
         finalDateGroups.push({ label: dateStr, dateValue: groupDate, matches: sortMatches(ms) });
      });

      // Sort date groups chronologically
      finalDateGroups.sort((a, b) => a.dateValue - b.dateValue);

      return {
        ...stage,
        dateGroups: finalDateGroups
      };
    });
  }, [stageGroups]);

  // 3. Auto-scroll to first relevant match
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []); // Run once on mount

  let foundScrollTarget = false;

  if (matches.length === 0) {
      return (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No matches scheduled for this tournament yet.
          </div>
      );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {processedStages.map((stage) => (
        <div key={stage.name} className="tournament-stage-section">
          {/* Stage Header */}
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 800, 
            color: '#0f172a', 
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e2e8f0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {stage.name}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {stage.dateGroups.map((group) => (
              <div key={group.label}>
                {/* Date Header */}
                <div style={{ 
                   fontSize: '13px', 
                   fontWeight: 700, 
                   color: '#64748b', 
                   marginBottom: '12px',
                   textTransform: 'uppercase',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#cbd5e1' }}></span>
                  {group.label}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {group.matches.map((match) => {
                    // Determine if this is the scroll target
                    let isTarget = false;
                    if (!foundScrollTarget && (match.status === 'live' || match.status === 'draft')) {
                        isTarget = true;
                        foundScrollTarget = true;
                    }

                    return (
                      <div key={match.id} ref={isTarget ? scrollRef : null}>
        <MatchCard match={match} showTournamentContext={false} />
      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
