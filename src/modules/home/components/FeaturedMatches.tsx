import React, { useMemo, useState } from 'react';
import { useGlobalState } from '../../../app/AppProviders';
import { MatchCard } from '../../match/components/MatchCard';
import { Tabs } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Radio, PlusCircle } from 'lucide-react';
import { EmptyState } from '../../../components/EmptyState';

export const FeaturedMatches: React.FC = () => {
  const { matches, followedTeams, followedMatches } = useGlobalState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('top');

  const tabs = [
    { id: 'top', label: 'Top Matches' },
    { id: 'live', label: 'Live Now' },
  ];

  const getMatchScore = (match: any) => {
    let score = 0;
    if (followedTeams.includes(match.homeParticipant.id) || followedTeams.includes(match.awayParticipant.id)) {
      score += 2;
    }
    return score;
  };

  const sortMatches = (matchList: any[]) => {
    return [...matchList].sort((a, b) => {
      const scoreA = getMatchScore(a);
      const scoreB = getMatchScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  const liveMatches = useMemo(() => sortMatches(matches.filter(m => m.status === 'live')), [matches, followedTeams]);
  const topMatches = useMemo(() => sortMatches(matches.filter(m => m.status === 'draft' || m.status === 'live')), [matches, followedTeams]);

  const displayedMatches = activeTab === 'top' ? topMatches.slice(0, 4) : liveMatches;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-lg font-bold text-slate-900 mb-1">Upcoming Matches</h2>
           <p className="text-sm text-slate-500">Don't miss the action</p>
        </div>
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          variant="pill"
        />
      </div>

      <div className="p-6">
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
      </div>
      
      {displayedMatches.length > 0 && (
         <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/matches')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
            >
              View Full Schedule <ArrowRight size={16} className="ml-2" />
            </Button>
         </div>
      )}
    </div>
  );
};
