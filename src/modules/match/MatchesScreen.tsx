import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { MatchCard } from '../../newui/MatchCard';
import { Match } from '../../domain/match';

// --- Components ---

const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        fontSize: '14px',
        color: '#111',
        backgroundColor: '#fff',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '8px auto',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const ActiveFilters: React.FC<{
  filters: { label: string; value: string; onRemove: () => void }[];
}> = ({ filters }) => {
  if (filters.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
      {filters.map((f, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '100px',
          backgroundColor: '#eff6ff', color: '#1d4ed8',
          fontSize: '13px', fontWeight: 600
        }}>
          {f.label}: {f.value}
          <button onClick={f.onRemove} style={{
            background: 'none', border: 'none', color: '#1d4ed8',
            cursor: 'pointer', fontSize: '14px', padding: 0, marginLeft: '4px', display: 'flex', alignItems: 'center'
          }}>×</button>
        </div>
      ))}
    </div>
  );
};

// 1. Main Tabs (Level 1: Match State)
const MainTabs: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = ['Top Matches', 'Live', 'Upcoming', 'Finished'];
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '12px', 
      marginBottom: '32px',
      flexWrap: 'wrap' 
    }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: '10px 24px',
              borderRadius: '100px',
              border: 'none',
              background: isActive ? '#111' : '#f5f5f5',
              color: isActive ? 'white' : '#666',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

// 2. Advanced Filter Panel (Level 2)
const AdvancedFilterPanel: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  format: string;
  level: string;
  location: string;
  tournamentId: string;
  tournaments: any[];
  onFormatChange: (val: string) => void;
  onLevelChange: (val: string) => void;
  onLocationChange: (val: string) => void;
  onTournamentChange: (val: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}> = ({ 
  isOpen, onToggle,
  format, level, location, tournamentId, tournaments,
  onFormatChange, onLevelChange, onLocationChange, onTournamentChange, 
  onReset, hasActiveFilters 
}) => {
  return (
    <div style={{
      position: 'sticky',
      top: '24px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      minWidth: '280px',
      height: 'fit-content',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      <div 
        onClick={onToggle}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '24px',
          cursor: 'pointer',
          backgroundColor: isOpen ? '#fff' : '#fafafa'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Filters</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             {hasActiveFilters && (
              <button 
                onClick={(e) => { e.stopPropagation(); onReset(); }}
                style={{ 
                  fontSize: '12px', 
                  color: '#2563eb', 
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Reset
              </button>
            )}
            <span style={{ fontSize: '12px', color: '#666' }}>{isOpen ? '▼' : '▶'}</span>
        </div>
      </div>
      
      {isOpen && (
        <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FilterDropdown 
            label="Tournament" 
            value={tournamentId} 
            options={['All', ...tournaments.map(t => t.name)]} 
            onChange={(val) => {
               const t = tournaments.find(tour => tour.name === val);
               onTournamentChange(t ? t.id : 'All');
            }}
          />
          <FilterDropdown 
            label="Match Format" 
            value={format} 
            options={['All Formats', 'T20', 'ODI', 'Test']} 
            onChange={onFormatChange}
          />
          <FilterDropdown 
            label="Match Level" 
            value={level} 
            options={['All', 'Local', 'Domestic', 'International']} 
            onChange={onLevelChange}
          />
          <FilterDropdown 
            label="Location" 
            value={location} 
            options={['All', 'Bangalore', 'Mumbai', 'Delhi']} // Mock locations
            onChange={onLocationChange}
          />
        </div>
      )}
    </div>
  );
};

// 3. Grouped Matches List (Level 2: Time Context)
interface GroupedMatchesListProps {
  matches: Match[];
  followedMatches: string[];
  activeTab: string;
  groupByTournament: boolean;
  tournaments: any[];
  followedTournaments: string[];
  onReset: () => void;
  hasFilters: boolean;
}

const GroupedMatchesList: React.FC<GroupedMatchesListProps> = ({ 
  matches, 
  followedMatches, 
  activeTab, 
  groupByTournament, 
  tournaments, 
  followedTournaments,
  onReset,
  hasFilters
}) => {
  const navigate = useNavigate();

  if (matches.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px', 
        color: '#666',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>No matches found</div>
        {hasFilters && (
          <button 
            onClick={onReset}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#2563eb',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  // Tournament Grouping Logic
  const tournamentGroups = useMemo(() => {
    if (!groupByTournament) return null;

    const groups: Record<string, Match[]> = {};
    matches.forEach(match => {
      const tId = match.tournamentId || 'other';
      if (!groups[tId]) groups[tId] = [];
      groups[tId].push(match);
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'other') return 1;
      if (b === 'other') return -1;

      const tA = tournaments.find(t => t.id === a);
      const tB = tournaments.find(t => t.id === b);
      
      // Followed Priority
      const isFollowedA = followedTournaments.includes(a);
      const isFollowedB = followedTournaments.includes(b);
      if (isFollowedA && !isFollowedB) return -1;
      if (!isFollowedA && isFollowedB) return 1;

      // Status Priority: Ongoing > Upcoming > Completed
      const statusScore = (s?: string) => {
         if (s === 'ongoing') return 0;
         if (s === 'upcoming') return 1;
         if (s === 'completed') return 2;
         return 3;
      };

      const scoreA = statusScore(tA?.status);
      const scoreB = statusScore(tB?.status);
      
      return scoreA - scoreB;
    });

    return sortedKeys.map(key => {
       const t = tournaments.find(tour => tour.id === key);
       return {
         id: key,
         name: t?.name || 'Friendly Matches',
         status: t?.status,
         matches: groups[key]
       };
    });
  }, [matches, groupByTournament, tournaments, followedTournaments]);

  // Date Grouping Logic
  const dateGroups = useMemo(() => {
    if (groupByTournament) return null;

    // Define group keys based on tab requirements
    const groups: Record<string, Match[]> = {
      'LIVE NOW': [],
      'TODAY': [],
      'TOMORROW': [],
      'YESTERDAY': [],
      'THIS WEEK': [],
      'LATER': [],
      'EARLIER': []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    matches.forEach(match => {
      // Special Case: LIVE NOW
      if (match.status === 'live') {
        groups['LIVE NOW'].push(match);
        return;
      }

      // For non-live matches, group by date
      const matchDate = new Date(match.date);
      const matchDateOnly = new Date(matchDate);
      matchDateOnly.setHours(0, 0, 0, 0);

      if (matchDateOnly.getTime() === today.getTime()) {
        groups['TODAY'].push(match);
      } else if (matchDateOnly.getTime() === tomorrow.getTime()) {
        groups['TOMORROW'].push(match);
      } else if (matchDateOnly.getTime() === yesterday.getTime()) {
        groups['YESTERDAY'].push(match);
      } else if (matchDateOnly > tomorrow && matchDateOnly <= nextWeek) {
        groups['THIS WEEK'].push(match);
      } else if (matchDateOnly > nextWeek) {
        groups['LATER'].push(match);
      } else {
        groups['EARLIER'].push(match);
      }
    });

    // Apply sorting within groups
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => {
            // Live matches always stay at top
            if (a.status === 'live' && b.status !== 'live') return -1;
            if (b.status === 'live' && a.status !== 'live') return 1;

            const timeA = new Date(a.date).getTime();
            const timeB = new Date(b.date).getTime();

            // Finished matches sort by most recent first
            if (activeTab === 'Finished' || key === 'YESTERDAY' || key === 'EARLIER') {
                return timeB - timeA;
            }
            
            // Upcoming/Live/Today/Tomorrow sort by start time
            return timeA - timeB;
        });
    });

    return groups;
  }, [matches, activeTab, groupByTournament]);

  // Render Tournament Groups
  if (groupByTournament && tournamentGroups) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {tournamentGroups.map(group => (
          <div key={group.id} className="match-group-section">
             {/* Tournament Header */}
             <div style={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               marginBottom: '16px',
               marginLeft: '4px',
               position: 'sticky',
               top: '0',
               zIndex: 10,
               backgroundColor: '#fafafa',
               padding: '12px 0',
               borderBottom: '1px solid #eee'
             }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 800, 
                    color: '#111', 
                    margin: 0,
                    cursor: 'pointer'
                 }} onClick={() => group.id !== 'other' && navigate(`/tournament/${group.id}`)}>
                    {group.name} <span style={{ fontWeight: 400, color: '#666', fontSize: '14px', marginLeft: '4px' }}>({group.matches.length})</span>
                 </h3>
                 {group.status && (
                   <span style={{
                     fontSize: '11px',
                     fontWeight: 700,
                     textTransform: 'uppercase',
                     padding: '3px 8px',
                     borderRadius: '4px',
                     backgroundColor: group.status === 'ongoing' ? '#fee2e2' : group.status === 'upcoming' ? '#eff6ff' : '#f3f4f6',
                     color: group.status === 'ongoing' ? '#b91c1c' : group.status === 'upcoming' ? '#2563eb' : '#4b5563'
                   }}>
                     {group.status === 'ongoing' ? 'Active' : group.status}
                   </span>
                 )}
               </div>
               
               {group.id !== 'other' && (
                 <button 
                   onClick={() => navigate(`/tournament/${group.id}`)}
                   style={{
                     background: 'none',
                     border: 'none',
                     color: '#2563eb',
                     fontSize: '13px',
                     fontWeight: 600,
                     cursor: 'pointer'
                   }}
                 >
                   View Tournament →
                 </button>
               )}
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {group.matches.map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    isFollowed={followedMatches.includes(match.id)} 
                    className="full-width"
                  />
                ))}
             </div>
          </div>
        ))}
      </div>
    );
  }

  // Render Date Groups (Default)
  let sections: string[] = [];
  
  if (activeTab === 'Live') {
    sections = ['LIVE NOW'];
  } else if (activeTab === 'Upcoming') {
    sections = ['TODAY', 'TOMORROW', 'THIS WEEK', 'LATER'];
  } else if (activeTab === 'Finished') {
    sections = ['TODAY', 'YESTERDAY', 'EARLIER'];
  } else {
    sections = ['LIVE NOW', 'TODAY', 'TOMORROW', 'THIS WEEK', 'LATER', 'EARLIER'];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {sections.map(section => {
        const sectionMatches = dateGroups?.[section];
        if (!sectionMatches || sectionMatches.length === 0) return null;

        return (
          <div key={section} className="match-group-section">
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 800, 
              color: section === 'LIVE NOW' ? '#dc2626' : '#888', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              marginBottom: '16px',
              marginLeft: '4px',
              position: 'sticky',
              top: '0',
              zIndex: 10,
              backgroundColor: '#fafafa',
              padding: '8px 0'
            }}>
              {section}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sectionMatches.map((match) => {
                const isFollowed = followedMatches.includes(match.id);
                return (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    isFollowed={isFollowed} 
                    className="full-width"
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Screen ---

export const MatchesScreen: React.FC = () => {
  const { matches, followedMatches, tournaments, followedTournaments } = useGlobalState();
  const [activeTab, setActiveTab] = useState('Top Matches');
  
  // Filters
  const [showFollowedOnly, setShowFollowedOnly] = useState(false);
  const [activeFormat, setActiveFormat] = useState('All Formats');
  const [activeLevel, setActiveLevel] = useState('All');
  const [activeLocation, setActiveLocation] = useState('All');
  const [activeTournamentId, setActiveTournamentId] = useState('All');
  
  const [groupByTournament, setGroupByTournament] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); // Default collapsed

  // Reset filters when tab changes
  useEffect(() => {
    setActiveFormat('All Formats');
    setActiveLevel('All');
    setActiveLocation('All');
    setActiveTournamentId('All');
    setShowFollowedOnly(false);
  }, [activeTab]);

  const hasActiveFilters = activeFormat !== 'All Formats' || activeLevel !== 'All' || activeLocation !== 'All' || activeTournamentId !== 'All' || showFollowedOnly;

  const resetFilters = () => {
    setActiveFormat('All Formats');
    setActiveLevel('All');
    setActiveLocation('All');
    setActiveTournamentId('All');
    setShowFollowedOnly(false);
  };

  const filteredMatches = useMemo(() => {
    let result = [...matches];

    // 1. Tab Context
    if (activeTab === 'Live') {
      result = result.filter(m => m.status === 'live');
    } else if (activeTab === 'Upcoming') {
      result = result.filter(m => m.status === 'draft');
    } else if (activeTab === 'Finished') {
      result = result.filter(m => m.status === 'completed' || m.status === 'locked' || m.status === 'cancelled');
    }

    // 2. Filters
    if (showFollowedOnly) {
        result = result.filter(m => followedMatches.includes(m.id));
    }
    if (activeTournamentId !== 'All') {
        result = result.filter(m => m.tournamentId === activeTournamentId);
    }
    if (activeFormat !== 'All Formats') {
      const sportId = activeFormat === 'Cricket' ? 's1' : 
                      activeFormat === 'Football' ? 's2' : 
                      activeFormat === 'Kabaddi' ? 's3' : 
                      activeFormat === 'T20' ? 's1' : ''; 
      if (sportId) result = result.filter(m => m.sportId === sportId);
    }
    if (activeLocation !== 'All') {
        result = result.filter(m => m.location.includes(activeLocation));
    }

    // Sorting (Top Matches)
    if (activeTab === 'Top Matches') {
      result = result.sort((a, b) => {
        const getScore = (m: Match) => {
            if (m.status === 'live') return 3;
            if (followedMatches.includes(m.id)) return 2.5;
            if (m.status === 'draft') return 2;
            return 1;
        };
        return getScore(b) - getScore(a);
      });
    }

    return result;
  }, [matches, activeTab, activeFormat, activeLevel, activeLocation, activeTournamentId, showFollowedOnly, followedMatches]);

  // Active Chips Logic
  const activeChips = [];
  if (activeTournamentId !== 'All') {
      const t = tournaments.find(x => x.id === activeTournamentId);
      activeChips.push({ label: 'Tournament', value: t?.name || activeTournamentId, onRemove: () => setActiveTournamentId('All') });
  }
  if (activeFormat !== 'All Formats') activeChips.push({ label: 'Format', value: activeFormat, onRemove: () => setActiveFormat('All Formats') });
  if (activeLevel !== 'All') activeChips.push({ label: 'Level', value: activeLevel, onRemove: () => setActiveLevel('All') });
  if (activeLocation !== 'All') activeChips.push({ label: 'Location', value: activeLocation, onRemove: () => setActiveLocation('All') });

  return (
    <div style={{ 
      padding: '32px 24px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      
      {/* 1. Header & Primary Filters */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px', color: '#111' }}>Matches</h1>
        
        {/* View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ 
                fontSize: '14px', 
                color: !groupByTournament ? '#111' : '#888', 
                fontWeight: !groupByTournament ? 700 : 500,
                cursor: 'pointer'
            }} onClick={() => setGroupByTournament(false)}>By Date</span>
            
            <div 
            onClick={() => setGroupByTournament(!groupByTournament)}
            style={{
                width: '48px',
                height: '26px',
                backgroundColor: groupByTournament ? '#2563eb' : '#e5e7eb',
                borderRadius: '99px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}
            >
            <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: groupByTournament ? '25px' : '3px',
                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
            </div>
            
            <span style={{ 
                fontSize: '14px', 
                color: groupByTournament ? '#111' : '#888', 
                fontWeight: groupByTournament ? 700 : 500,
                cursor: 'pointer'
            }} onClick={() => setGroupByTournament(true)}>By Tournament</span>
        </div>

        <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 2. Main Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 280px', 
        gap: '40px',
        alignItems: 'start'
      }} className="matches-layout">
        
        {/* Left: Content */}
        <div>
            {/* Level 1 Quick Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={showFollowedOnly}
                        onChange={(e) => setShowFollowedOnly(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Show only followed</span>
                </label>

                {hasActiveFilters && (
                    <button 
                        onClick={resetFilters}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#666',
                            fontSize: '13px',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Clear all filters
                    </button>
                )}
            </div>

            {/* Active Filter Chips */}
            <ActiveFilters filters={activeChips} />

            {/* Grouped Match List */}
            <GroupedMatchesList 
              matches={filteredMatches} 
              followedMatches={followedMatches} 
              activeTab={activeTab}
              groupByTournament={groupByTournament}
              tournaments={tournaments}
              followedTournaments={followedTournaments}
              onReset={resetFilters}
              hasFilters={hasActiveFilters}
            />
        </div>

        {/* Right: Advanced Filter Panel (Level 2) */}
        <AdvancedFilterPanel 
          isOpen={isFilterPanelOpen}
          onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          format={activeFormat} 
          level={activeLevel} 
          location={activeLocation}
          tournamentId={activeTournamentId}
          tournaments={tournaments}
          onFormatChange={setActiveFormat} 
          onLevelChange={setActiveLevel}
          onLocationChange={setActiveLocation}
          onTournamentChange={setActiveTournamentId}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
        
      </div>

      {/* Responsive Style Injection */}
      <style>{`
        @media (max-width: 900px) {
          .matches-layout {
            grid-template-columns: 1fr !important;
          }
          .matches-layout > div:last-child {
            order: -1; /* Filters on top for mobile? Or maybe below? 
                         "Filters are secondary... collapsed by default".
                         If collapsed, it's fine to be on top.
                      */
            position: static !important;
            width: 100%;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
};
