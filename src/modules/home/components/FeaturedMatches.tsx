import React, { useCallback, useMemo, useState } from 'react';
import { useGlobalState } from '../../../app/AppProviders';
import { MatchCard } from '../../match/components/MatchCard';
import { Tabs } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Radio } from 'lucide-react';
import { EmptyState } from '../../../components/EmptyState';

export const FeaturedMatches: React.FC = () => {
  const { matches, followedTeams, followedMatches } = useGlobalState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('top');

  const tabs = [
    { id: 'top', label: 'Top Matches' },
    { id: 'live', label: 'Live Now' },
  ];

  const getMatchScore = useCallback((match: {
    homeParticipant: { id: string };
    awayParticipant: { id: string };
  }) => {
    let score = 0;
    if (followedTeams.includes(match.homeParticipant.id) || followedTeams.includes(match.awayParticipant.id)) {
      score += 2;
    }
    return score;
  }, [followedTeams]);

  const sortMatches = useCallback((matchList: Array<{ id: string; date: string; homeParticipant: { id: string }; awayParticipant: { id: string } }>) => {
    return [...matchList].sort((a, b) => {
      const scoreA = getMatchScore(a);
      const scoreB = getMatchScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [getMatchScore]);

  const liveMatches = useMemo(() => sortMatches(matches.filter(m => m.status === 'live')), [matches, sortMatches]);
  const topMatches = useMemo(() => sortMatches(matches.filter(m => m.status === 'draft' || m.status === 'live')), [matches, sortMatches]);

  const displayedMatches = activeTab === 'top' ? topMatches.slice(0, 4) : liveMatches;

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Upcoming Matches</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Don't miss the action</p>
        </div>
        <div>
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            variant="pill"
          />
        </div>
      </div>
      <div className="p-8">
        {displayedMatches.length === 0 ? (
          <div className="py-8">
            <EmptyState 
              icon={
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2">
                  {activeTab === 'live' ? <Radio size={32} /> : <Calendar size={32} />}
                </div>
              }
              message={activeTab === 'live' ? 'No live matches right now' : 'No matches scheduled'}
              description={activeTab === 'live' ? 'Matches will appear here once they start.' : 'There are no upcoming matches right now. Create a match to get started.'}
              actionLabel="Create Match"
              onAction={() => navigate('/match/create')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayedMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                isFollowed={followedMatches.includes(match.id)}
                variant="horizontal"
              />
            ))}
          </div>
        )}

        {displayedMatches.length > 0 && (
           <div className="mt-8 text-center border-t border-slate-50 pt-4 -mx-8 -mb-8 bg-slate-50/50">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/matches')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full sm:w-auto h-12"
              >
                View Full Schedule <ArrowRight size={16} className="ml-2" />
              </Button>
           </div>
        )}
      </div>
    </div>
  );
};
