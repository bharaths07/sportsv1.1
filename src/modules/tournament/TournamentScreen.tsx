import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Edit3, 
  Plus, 
  CalendarDays, 
  Users, 
  PlayCircle,
  ArrowLeft
} from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Tournament } from '../../domain/tournament';

// Tab Components (Placeholders/Imports)
import { TournamentMatchesTab } from './TournamentMatchesTab';
import { TournamentPointsTable } from './TournamentPointsTable';
import { TournamentSquadsTab } from './TournamentSquadsTab';
import { TournamentLeaderboard } from './components/TournamentLeaderboard';

export const TournamentScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments, currentUser, matches } = useGlobalState();
  
  const tournament = tournaments.find(t => t.id === id);
  const tournamentMatches = matches.filter(m => m.tournamentId === id);

  const [activeTab, setActiveTab] = useState('Overview');
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

  if (!tournament) return <div>Tournament not found</div>;

  const renderStatusBadge = (status: Tournament['status']) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-slate-100 text-slate-700',
    };
    
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. TOURNAMENT HEADER */}
      <div className="bg-white border-b border-slate-200">
        {/* Banner */}
        {tournament.bannerUrl && (
          <div className="h-32 md:h-48 w-full overflow-hidden relative">
            <img 
              src={tournament.bannerUrl} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => navigate('/tournaments')}
              className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <div className="px-4 py-4 max-w-4xl mx-auto">
          <div className="flex gap-4">
            {/* Logo */}
            <div className={`w-20 h-20 rounded-xl bg-slate-100 border-2 border-white shadow-md flex-shrink-0 -mt-10 overflow-hidden relative z-10`}>
               {/* Placeholder logic for logo if not separate field, using banner or name initial */}
               <div className="w-full h-full flex items-center justify-center bg-teal-600 text-white font-bold text-2xl">
                 {tournament.name.charAt(0)}
               </div>
            </div>
            
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">{tournament.name}</h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>{tournament.location}</span>
                    <span>•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{tournament.dates}</span>
                  </div>
                </div>
                {renderStatusBadge(tournament.status)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ROLE-BASED QUICK ACTIONS */}
      <div className="px-4 py-4 max-w-4xl mx-auto">
        {role === 'ORGANIZER' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-2">
            <button 
              disabled={tournament.status === 'completed'}
              onClick={() => navigate(`/tournament/create?edit=${tournament.id}`)} // Assuming edit route
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Edit Info</span>
            </button>

            <button 
              disabled={tournament.status === 'completed'}
              onClick={() => navigate(`/tournament/${tournament.id}/teams`)}
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Add Teams</span>
            </button>

            <button 
              disabled={tournament.status === 'completed'}
              onClick={() => navigate(`/tournament/${tournament.id}/schedule`)}
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Schedule</span>
            </button>

            <button 
              disabled={tournament.status === 'completed'}
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Officials</span>
            </button>
          </div>
        )}

        {role === 'SCORER' && (
           <div className="animate-in fade-in slide-in-from-top-2">
             <button 
                onClick={() => setActiveTab('Matches')}
                className="w-full p-4 bg-teal-600 text-white rounded-xl shadow-sm flex items-center justify-center gap-3 hover:bg-teal-700"
             >
               <PlayCircle className="w-5 h-5" />
               <span className="font-bold">Matches Assigned to Me</span>
             </button>
           </div>
        )}
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex overflow-x-auto max-w-4xl mx-auto px-4 hide-scrollbar">
          {['Overview', 'Teams', 'Matches', 'Points Table', 'Stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors
                ${activeTab === tab 
                  ? 'border-teal-600 text-teal-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. TAB CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
             <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Trophy className="w-4 h-4 text-teal-600" />
                 About Tournament
               </h3>
               <p className="text-sm text-slate-600 leading-relaxed">
                 {tournament.description}
               </p>
               
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                 <div>
                   <label className="text-xs text-slate-400 font-bold uppercase">Format</label>
                   <p className="text-sm font-medium text-slate-800">{tournament.structure?.format || 'Standard'}</p>
                 </div>
                 <div>
                   <label className="text-xs text-slate-400 font-bold uppercase">Organizer</label>
                   <p className="text-sm font-medium text-slate-800">{tournament.organizer}</p>
                 </div>
               </div>
             </div>

             {/* Placeholder for more overview stats/widgets */}
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-200">Tournament Status</h3>
                  {renderStatusBadge(tournament.status)}
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                   <div>
                     <div className="text-2xl font-bold">{tournament.teams?.length || 0}</div>
                     <div className="text-xs text-slate-400 uppercase font-bold mt-1">Teams</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold">0</div>
                     <div className="text-xs text-slate-400 uppercase font-bold mt-1">Matches</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold">0</div>
                     <div className="text-xs text-slate-400 uppercase font-bold mt-1">Days Left</div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Teams' && (
          <TournamentSquadsTab initialSelectedTeamId={undefined} />
        )}

        {activeTab === 'Matches' && (
          <TournamentMatchesTab matches={tournamentMatches} /> 
        )}

        {activeTab === 'Points Table' && (
          <TournamentPointsTable />
        )}

        {activeTab === 'Stats' && (
          <TournamentLeaderboard tournamentId={tournament.id} />
        )}

      </div>
    </div>
  );
};
