import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_TEAMS } from '../../data/teams';
import { TeamType } from '../../domain/team';
import { useGlobalState } from '../../app/AppProviders';
import { FollowButton } from '../../components/FollowButton';

// Sport ID Mapping (aligning with mock data comments and user requirements)
const SPORT_MAP: Record<string, string> = {
  's1': 'Cricket',
  's2': 'Football',
  's3': 'Kabaddi',
  's4': 'Badminton'
};

const TEAM_TYPES: { label: string; value: TeamType }[] = [
  { label: 'Club', value: 'club' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Street', value: 'street' },
  { label: 'School', value: 'school' }
];

type SortOption = 'active' | 'members' | 'newest' | 'alpha';

export const TeamListScreen: React.FC = () => {
  const { followedTeams } = useGlobalState();
  
  // -- Filter States --
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<TeamType | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('active');

  // -- Debounce Search --
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // -- Persist Filters (Basic implementation) --
  useEffect(() => {
    const savedFilters = localStorage.getItem('scoreheroes_team_filters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        if (parsed.sport) setSelectedSport(parsed.sport);
        if (parsed.type) setSelectedType(parsed.type);
        if (parsed.sort) setSortBy(parsed.sort);
      } catch (e) {
        console.error("Failed to parse filters", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scoreheroes_team_filters', JSON.stringify({
      sport: selectedSport,
      type: selectedType,
      sort: sortBy
    }));
  }, [selectedSport, selectedType, sortBy]);

  // -- Filter & Sort Logic --
  const filteredAndSortedTeams = useMemo(() => {
    let result = [...MOCK_TEAMS];

    // 1. Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q));
    }

    // 2. Sport
    if (selectedSport !== 'All') {
      // Find sport ID by name or just use the mapping if we stored ID
      // For UI simplicity, let's map back or store ID. 
      // Let's store the ID in state if possible, but the chips might be text.
      // Let's iterate SPORT_MAP to find ID or match value.
      const sportId = Object.keys(SPORT_MAP).find(key => SPORT_MAP[key] === selectedSport);
      if (sportId) {
        result = result.filter(t => t.sportId === sportId);
      }
    }

    // 3. Type
    if (selectedType !== 'All') {
      result = result.filter(t => t.type === selectedType);
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'members':
          return b.members.length - a.members.length;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'alpha':
          return a.name.localeCompare(b.name);
        case 'active':
        default:
          const dateA = a.lastMatchAt ? new Date(a.lastMatchAt).getTime() : 0;
          const dateB = b.lastMatchAt ? new Date(b.lastMatchAt).getTime() : 0;
          return dateB - dateA;
      }
    });

    return result;
  }, [debouncedSearch, selectedSport, selectedType, sortBy]);

  // -- Helpers --
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSport('All');
    setSelectedType('All');
    setSortBy('active');
  };

  const isRecent = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Active in last 30 days
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* Sticky Filter Bar */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Row 1: Search & Sort */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search teams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 10px 10px 36px', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >✕</button>
            )}
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{ 
              padding: '0 12px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1',
              backgroundColor: 'white',
              fontSize: '14px',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            <option value="active">Recently Active</option>
            <option value="members">Most Members</option>
            <option value="newest">Newest</option>
            <option value="alpha">A-Z</option>
          </select>
        </div>

        {/* Row 2: Chips (Horizontal Scroll) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Sport Filter */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {['All', 'Cricket', 'Football', 'Kabaddi', 'Badminton'].map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: selectedSport === sport ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                  backgroundColor: selectedSport === sport ? '#eff6ff' : 'white',
                  color: selectedSport === sport ? '#1d4ed8' : '#64748b',
                  fontSize: '13px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {sport}
              </button>
            ))}
          </div>
          
          {/* Type Filter */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedType('All')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: selectedType === 'All' ? '1px solid #64748b' : '1px solid #e2e8f0',
                backgroundColor: selectedType === 'All' ? '#f1f5f9' : 'white',
                color: selectedType === 'All' ? '#0f172a' : '#64748b',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              All Types
            </button>
            {TEAM_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: selectedType === type.value ? '1px solid #64748b' : '1px solid #e2e8f0',
                  backgroundColor: selectedType === type.value ? '#f1f5f9' : 'white',
                  color: selectedType === type.value ? '#0f172a' : '#64748b',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results List */}
      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            {filteredAndSortedTeams.length} Teams found
          </div>
          {(selectedSport !== 'All' || selectedType !== 'All' || searchQuery) && (
            <button 
              onClick={clearFilters}
              style={{ fontSize: '13px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredAndSortedTeams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#475569' }}>No teams found</div>
            <p style={{ fontSize: '14px' }}>Try adjusting your filters or search query.</p>
            <button 
              onClick={clearFilters}
              style={{ 
                marginTop: '16px', 
                padding: '8px 16px', 
                backgroundColor: 'white', 
                border: '1px solid #cbd5e1', 
                borderRadius: '6px',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAndSortedTeams.map(team => {
              const isFollowed = followedTeams.includes(team.id);
              const recentlyActive = isRecent(team.lastMatchAt);
              const sportName = SPORT_MAP[team.sportId] || 'Sport';
              
              return (
                <div key={team.id} style={{ 
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  border: isFollowed ? '1px solid #ffcdd2' : '1px solid white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                    
                    {/* Left: Avatar */}
                    <Link to={`/team/${team.id}`} style={{ textDecoration: 'none', display: 'block', marginRight: '16px' }}>
                      <div style={{ 
                        width: '56px', height: '56px', 
                        borderRadius: '50%', 
                        backgroundColor: '#f1f5f9', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800',
                        color: '#475569',
                        fontSize: '20px',
                        border: recentlyActive ? '3px solid #dbeafe' : '3px solid transparent', // Subtle ring
                        position: 'relative'
                      }}>
                        {getInitials(team.name)}
                      </div>
                    </Link>

                    {/* Center: Info */}
                    <Link to={`/team/${team.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>{team.name}</span>
                        {isFollowed && (
                          <span style={{ fontSize: '10px', color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '1px 4px', fontWeight: 'bold' }}>
                            FOLLOWING
                          </span>
                        )}
                      </div>
                      
                      <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{sportName}</span>
                        <span>•</span>
                        <span style={{ textTransform: 'capitalize' }}>{team.type}</span>
                        <span>•</span>
                        <span>{team.members.length} Members</span>
                      </div>
                    </Link>

                    {/* Right: Actions */}
                    <div style={{ paddingLeft: '12px' }}>
                       <FollowButton id={team.id} type="team" />
                    </div>
                  </div>
                  
                  {/* Optional Bottom Badge Strip (Visual flair from request) */}
                  {/* <div style={{ height: '4px', width: '100%', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}></div> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
