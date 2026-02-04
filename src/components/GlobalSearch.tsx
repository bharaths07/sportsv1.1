import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../app/AppProviders';
import { useSearchLogic } from '../hooks/useSearchLogic';
import './GlobalSearch.css';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RecentSearchItem {
  id: string;
  name: string;
  type: 'match' | 'team' | 'tournament';
  label: string; // Display label e.g., "Match", "Team"
  subtitle: string;
  path: string;
  timestamp: number;
}

const RECENT_SEARCHES_KEY = 'scoreheroes_recent_searches';

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  }, []);

  // Clear history on logout
  useEffect(() => {
    if (!currentUser) {
      setRecentSearches([]);
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, [currentUser]);

  // Focus input when opened and handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
      setActiveIndex(-1);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setSearchTerm('');
    setActiveIndex(-1);
    onClose();
  };

  // Search Logic
  const results = useSearchLogic(searchTerm, { limit: 5 });

  const flatResults = useMemo(() => {
    return [...results.matches, ...results.teams, ...results.tournaments];
  }, [results]);

  const addToHistory = (item: Omit<RecentSearchItem, 'timestamp'>) => {
    const newItem = { ...item, timestamp: Date.now() };
    setRecentSearches(prev => {
      // Remove duplicates by ID
      const filtered = prev.filter(i => i.id !== item.id);
      // Add new item to top
      const updated = [newItem, ...filtered].slice(0, 5);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleNavigate = (path: string, item?: Omit<RecentSearchItem, 'timestamp'>) => {
    if (item) {
      addToHistory(item);
    }
    navigate(path);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowDown') {
      setActiveIndex(prev => (prev < flatResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && flatResults[activeIndex]) {
        const item = flatResults[activeIndex];
        // Map domain object to RecentSearchItem format for history
        if ('homeParticipant' in item) {
           handleNavigate(`/match/${item.id}`, {
             id: item.id,
             name: `${item.homeParticipant.name} vs ${item.awayParticipant.name}`,
             type: 'match',
             label: 'Match',
             subtitle: item.status,
             path: `/match/${item.id}`
           });
        } else if ('organizer' in item) {
           handleNavigate(`/tournament/${item.id}`, {
             id: item.id,
             name: item.name,
             type: 'tournament',
             label: 'Tournament',
             subtitle: item.organizer,
             path: `/tournament/${item.id}`
           });
        } else {
           handleNavigate(`/team/${item.id}`, {
             id: item.id,
             name: item.name,
             type: 'team',
             label: 'Team',
             subtitle: 'Team',
             path: `/team/${item.id}`
           });
        }
      } else {
        // Search term enter - go to results page
        if (searchTerm.trim().length > 0) {
            handleNavigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay" onClick={handleClose}>
      <div className="global-search-container" onClick={e => e.stopPropagation()}>
        <div className="global-search-header">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search teams, matches, or tournaments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {searchTerm && (
              <button className="clear-button" onClick={() => { setSearchTerm(''); inputRef.current?.focus(); }}>
                ✕
              </button>
            )}
          </div>
          <button className="close-button-text" onClick={handleClose}>Cancel</button>
        </div>

        <div className="global-search-results">
          {searchTerm.length < 2 ? (
            // EMPTY STATE / RECENT SEARCHES
            <div className="search-empty-state">
              {recentSearches.length > 0 ? (
                <div className="recent-searches-section">
                   <div className="section-header">
                     <span>Recent Searches</span>
                     <button onClick={clearHistory} className="clear-history-btn">Clear</button>
                   </div>
                   <div className="recent-list">
                     {recentSearches.map(item => (
                       <div key={item.id} className="recent-item" onClick={() => handleNavigate(item.path, item)}>
                         <span className="recent-icon">🕒</span>
                         <div className="recent-info">
                           <span className="recent-name">{item.name}</span>
                           <span className="recent-meta">{item.label} • {item.subtitle}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              ) : (
                <div className="placeholder-message">
                  Start typing to find matches, teams, and tournaments.
                </div>
              )}
            </div>
          ) : (
            // RESULTS LIST
            <div className="results-list">
              {flatResults.length === 0 ? (
                <div className="no-results">
                  No results found for "{searchTerm}"
                </div>
              ) : (
                <>
                  {results.matches.length > 0 && (
                    <div className="result-group">
                      <div className="group-label">Matches</div>
                      {results.matches.map((m, idx) => {
                         const globalIdx = idx; // matches are first
                         return (
                            <div 
                              key={m.id} 
                              className={`result-item ${activeIndex === globalIdx ? 'active' : ''}`}
                              onClick={() => handleNavigate(`/match/${m.id}`, {
                                id: m.id,
                                name: `${m.homeParticipant.name} vs ${m.awayParticipant.name}`,
                                type: 'match',
                                label: 'Match',
                                subtitle: m.status,
                                path: `/match/${m.id}`
                              })}
                              onMouseEnter={() => setActiveIndex(globalIdx)}
                            >
                              <div className="item-main">
                                <span className="item-name">{m.homeParticipant.name} vs {m.awayParticipant.name}</span>
                                <span className="item-status status-badge">{m.status}</span>
                              </div>
                              <div className="item-sub">
                                {m.tournamentId} • {new Date(m.date).toLocaleDateString()}
                              </div>
                            </div>
                         );
                      })}
                    </div>
                  )}

                  {results.teams.length > 0 && (
                    <div className="result-group">
                      <div className="group-label">Teams</div>
                      {results.teams.map((t, idx) => {
                        const globalIdx = results.matches.length + idx;
                        return (
                          <div 
                            key={t.id} 
                            className={`result-item ${activeIndex === globalIdx ? 'active' : ''}`}
                            onClick={() => handleNavigate(`/team/${t.id}`, {
                                id: t.id,
                                name: t.name,
                                type: 'team',
                                label: 'Team',
                                subtitle: 'Team',
                                path: `/team/${t.id}`
                              })}
                            onMouseEnter={() => setActiveIndex(globalIdx)}
                          >
                            <div className="item-main">
                              <span className="item-name">{t.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {results.tournaments.length > 0 && (
                    <div className="result-group">
                      <div className="group-label">Tournaments</div>
                      {results.tournaments.map((t, idx) => {
                        const globalIdx = results.matches.length + results.teams.length + idx;
                        return (
                          <div 
                            key={t.id} 
                            className={`result-item ${activeIndex === globalIdx ? 'active' : ''}`}
                            onClick={() => handleNavigate(`/tournament/${t.id}`, {
                                id: t.id,
                                name: t.name,
                                type: 'tournament',
                                label: 'Tournament',
                                subtitle: t.organizer,
                                path: `/tournament/${t.id}`
                              })}
                            onMouseEnter={() => setActiveIndex(globalIdx)}
                          >
                            <div className="item-main">
                              <span className="item-name">{t.name}</span>
                              <span className="item-status">{t.status}</span>
                            </div>
                            <div className="item-sub">
                              {t.organizer}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
