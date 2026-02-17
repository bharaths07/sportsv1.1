import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  PlayCircle,
  Share2,
  Settings
} from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Tournament } from '../../domain/tournament';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Card } from '../../components/ui/Card';

// Tab Components
import { Avatar } from '../../components/ui/Avatar';
import { TournamentMatchesTab } from './TournamentMatchesTab';
import { TournamentPointsTable } from './TournamentPointsTable';
import { TournamentSquadsTab } from './TournamentSquadsTab';
import { TournamentLeaderboard } from './components/TournamentLeaderboard';

export const TournamentScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments, currentUser, matches, startTournament } = useGlobalState();
  
  const tournament = tournaments.find(t => t.id === id);
  const tournamentMatches = matches.filter(m => m.tournamentId === id);

  const [activeTab, setActiveTab] = useState('overview');
  const [role, setRole] = useState<'ORGANIZER' | 'SCORER' | 'PUBLIC'>('PUBLIC');

  useEffect(() => {
    if (tournament && currentUser) {
      if (tournament.organizerId === currentUser.id) {
        setRole('ORGANIZER');
      } else if (tournament.scorers?.includes(currentUser.id)) {
        setRole('SCORER');
      } else {
        setRole('PUBLIC');
      }
    } else {
      setRole('PUBLIC');
    }
  }, [tournament, currentUser]);

  const handleStartTournament = async () => {
    if (!tournament) return;
    if (confirm('Are you sure you want to start this tournament? This will generate the schedule.')) {
        await startTournament(tournament.id);
    }
  };

  if (!tournament) return (
      <PageContainer>
          <div className="text-center py-20">
              <h2 className="text-xl font-bold text-slate-900">Tournament not found</h2>
              <Button variant="primary" className="mt-4" onClick={() => navigate('/tournaments')}>
                  Back to Tournaments
              </Button>
          </div>
      </PageContainer>
  );

  const tabs = [
      { id: 'overview', label: 'Matches' },
      { id: 'table', label: 'Points Table' },
      { id: 'squads', label: 'Squads' },
      { id: 'stats', label: 'Stats' },
  ];

  if (role === 'ORGANIZER') {
      tabs.push({ id: 'admin', label: 'Admin' });
  }

  const renderStatusBadge = (status: Tournament['status']) => {
    const styles: Record<string, string> = {
      draft: 'bg-amber-100 text-amber-700',
      upcoming: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-slate-100 text-slate-700',
    };
    
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${styles[status] || 'bg-slate-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
        {/* Hero Header (Custom, not standard PageHeader due to banner) */}
        <div className="relative bg-white border-b border-slate-200 mb-6">
            {/* Banner */}
            <div className="h-48 md:h-64 w-full bg-slate-900 relative overflow-hidden">
                {tournament.bannerUrl ? (
                    <img 
                        src={tournament.bannerUrl} 
                        alt="Banner" 
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-center">
                        <Trophy className="text-white/10 w-32 h-32" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Back Button Overlay */}
                <button 
                    onClick={() => navigate('/tournaments')}
                    className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors z-10"
                >
                    <Share2 className="w-5 h-5" /> {/* Using Share as placeholder for Back/Share actions */}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 mb-6 gap-6">
                    {/* Logo */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
                        <Avatar
                            src={tournament.logoUrl}
                            alt={tournament.name}
                            fallback={tournament.name.charAt(0)}
                            className="w-full h-full rounded-xl text-3xl md:text-4xl font-bold"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-white md:text-slate-900 pb-2">
                         <div className="flex items-center gap-2 mb-2">
                             {renderStatusBadge(tournament.status)}
                             <span className="text-xs font-bold uppercase tracking-wide opacity-90 md:text-slate-500">
                                 {tournament.sportId || 'Cricket'}
                             </span>
                         </div>
                         <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white md:text-slate-900 drop-shadow-md md:drop-shadow-none">
                             {tournament.name}
                         </h1>
                         <div className="flex flex-wrap gap-4 text-sm font-medium opacity-90 md:text-slate-600">
                             <div className="flex items-center gap-1.5">
                                 <Calendar size={16} />
                                 {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : 'TBD'} - {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : 'TBD'}
                             </div>
                             <div className="flex items-center gap-1.5">
                                 <MapPin size={16} />
                                 {tournament.location || 'Multiple Venues'}
                             </div>
                         </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4 md:mt-0 pb-2">
                        {role === 'ORGANIZER' && (
                            <Button variant="outline" onClick={() => navigate(`/tournament/${id}/edit`)}>
                                <Settings size={18} className="mr-2" /> Settings
                            </Button>
                        )}
                         {role === 'ORGANIZER' && tournament.status === 'draft' && (
                            <Button variant="primary" onClick={handleStartTournament}>
                                <PlayCircle size={18} className="mr-2" /> Start Tournament
                            </Button>
                        )}
                    </div>
                </div>
                
                {/* Tabs */}
                <Tabs 
                    tabs={tabs} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab}
                    variant="underline"
                />
            </div>
        </div>

        <PageContainer>
            {activeTab === 'overview' && <TournamentMatchesTab matches={tournamentMatches} />}
            {activeTab === 'table' && <TournamentPointsTable />}
            {activeTab === 'squads' && <TournamentSquadsTab />}
            {activeTab === 'stats' && <TournamentLeaderboard />}
            {activeTab === 'admin' && (
                <Card className="p-8 text-center text-slate-500">
                    Admin dashboard coming soon.
                </Card>
            )}
        </PageContainer>
    </div>
  );
};
