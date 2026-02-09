import React, { useMemo, useState } from 'react';
import { useGlobalState } from '../../../app/AppProviders';
import { MatchCard } from '../../match/components/MatchCard';
import { Tabs } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarX, Radio } from 'lucide-react';
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
    <>
      <div className="flex items-center justify-between mb-6">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          variant="pill"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/matches')}
          className="text-primary hover:text-primary-dark hover:bg-primary-light"
        >
          View Schedule <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>

      {displayedMatches.length === 0 ? (
        <EmptyState 
          icon={activeTab === 'live' ? <Radio size={48} /> : <CalendarX size={48} />}
          message={activeTab === 'live' ? 'No live matches right now' : 'No matches available'}
          description={activeTab === 'live' ? 'Check back later for live action.' : 'Create a tournament or match to get started.'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedMatches.map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              isFollowed={followedMatches.includes(match.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};
