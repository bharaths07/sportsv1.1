import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MoreVertical, Calendar, ChevronRight } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { Match } from '../../domain/match';
import { Team } from '../../domain/team';

export const CreateMatchScreen: React.FC = () => {
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');
  const context = searchParams.get('context');
  const { addMatch, currentUser, teams } = useGlobalState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Route Protection
  useEffect(() => {
    requireAuth(currentUser);
  }, [currentUser, requireAuth]);
  
  // Get pre-filled state or resolve from query params
  const state = location.state as { teamA?: Team, teamB?: Team, sportId?: string } | null;
  const initialSportId = state?.sportId || searchParams.get('sportId') || 's1';

  let teamA = state?.teamA;
  let teamB = state?.teamB;

  // Fallback to finding by ID if not in state
  if (!teamA) {
    const id = searchParams.get('teamA');
    if (id) teamA = teams.find(t => t.id === id);
  }

  if (!teamB) {
    const id = searchParams.get('teamB');
    if (id) teamB = teams.find(t => t.id === id);
  }

  const [matchType, setMatchType] = useState<'limited' | 'box' | 'pair' | 'test' | 'hundred'>('limited');
  const [overs, setOvers] = useState<string>('');
  const [oversPerBowler, setOversPerBowler] = useState<string>('');
  const [city, setCity] = useState('Bengaluru (Bangalore)');
  const [ground, setGround] = useState('');
  
  // Default date: Current time + 15 minutes
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    // Adjust to local ISO string for input[type="datetime-local"]
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  });

  const [ballType, setBallType] = useState<'TENNIS' | 'LEATHER' | 'OTHER'>('TENNIS');
  const [pitchType, setPitchType] = useState<'TURF' | 'MAT' | 'CEMENT' | 'OTHER'>('TURF');

  // Redirect if no teams selected (mock behavior, in real app might redirect to selection)
  useEffect(() => {
    // Optional: If teams are absolutely missing, we could redirect
    // if (!teamA || !teamB) navigate('/start-match/select-teams');
  }, [teamA, teamB, navigate]);

  const isValid = () => {
    if (!teamA || !teamB) return false;
    if (!city.trim() || !ground.trim()) return false;
    // Basic validation for overs if limited
    if (matchType === 'limited' && (!overs || !oversPerBowler)) return false;
    return true;
  };

  const handleMatchCreation = (action: 'schedule' | 'toss') => {
    if (!requireAuth(currentUser)) return;

    if (!isValid()) return;
    
    setIsSubmitting(true);

    // Create match synchronously
    const newMatchId = `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMatch: Match = {
      id: newMatchId,
      tournamentId: context === 'tournament' ? tournamentId ?? undefined : undefined,
      sportId: initialSportId || 's1',
      date: date,
      status: action === 'schedule' ? 'scheduled' : 'created',
      location: `${ground}, ${city}`,
      createdByUserId: currentUser.id,
      homeParticipant: {
        id: teamA!.id,
        name: teamA!.name,
        score: 0,
        wickets: 0,
        balls: 0
      },
      awayParticipant: {
        id: teamB!.id,
        name: teamB!.name,
        score: 0,
        wickets: 0,
        balls: 0
      },
      events: [],
      officials: [{ userId: currentUser.id, role: 'scorer' }]
    };

    addMatch(newMatch);
    
    if (context === 'tournament' && tournamentId) {
      navigate(`/tournament/${tournamentId}`);
    } else if (action === 'schedule') {
      navigate(`/matches/${newMatchId}`);
    } else {
      navigate(`/start-match/toss?matchId=${newMatchId}`);
    }
  };

  // Helper for colors
  const stringToColor = (str: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-indigo-500'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-red-600 px-4 py-4 text-white shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">Start a match</h1>
        <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 opacity-90">
                <HelpCircle className="h-6 w-6" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 opacity-90">
                <MoreVertical className="h-6 w-6" />
            </button>
        </div>
      </div>

      {/* Teams Header Section */}
      <div className="bg-white border-b border-slate-100 py-6 px-4">
        <div className="flex items-center justify-between">
            {/* Team A */}
            <div className="flex flex-col items-center flex-1">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2 shadow-sm ${teamA ? stringToColor(teamA.name) : 'bg-slate-300'}`}>
                    {teamA?.logoUrl ? (
                        <img src={teamA.logoUrl} alt={teamA.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        teamA?.name.substring(0, 2).toUpperCase() || '?'
                    )}
                </div>
                <h3 className="font-semibold text-sm text-center line-clamp-2 h-10">{teamA?.name || 'Team A'}</h3>
                <button className="mt-2 bg-teal-600 text-white text-xs font-bold py-1.5 px-4 rounded shadow-sm hover:bg-teal-700 active:bg-teal-800">
                    Squad (0)
                </button>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center px-4">
                <div className="w-8 h-8 bg-white border border-slate-200 rotate-45 flex items-center justify-center shadow-sm">
                    <span className="-rotate-45 text-xs font-bold text-slate-400">VS</span>
                </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center flex-1">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2 shadow-sm ${teamB ? stringToColor(teamB.name) : 'bg-slate-300'}`}>
                     {teamB?.logoUrl ? (
                        <img src={teamB.logoUrl} alt={teamB.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        teamB?.name.substring(0, 2).toUpperCase() || '?'
                    )}
                </div>
                <h3 className="font-semibold text-sm text-center line-clamp-2 h-10">{teamB?.name || 'Team B'}</h3>
                <button className="mt-2 bg-teal-600 text-white text-xs font-bold py-1.5 px-4 rounded shadow-sm hover:bg-teal-700 active:bg-teal-800">
                    Squad (0)
                </button>
            </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 space-y-6">
        
        {/* Match Type */}
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Match type<span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'limited', label: 'Limited Overs' },
                    { id: 'box', label: 'Box / Turf Cricket' },
                    { id: 'pair', label: 'Pair Cricket' },
                    { id: 'test', label: 'Test Match' },
                    { id: 'hundred', label: 'The Hundred' }
                ].map(type => (
                    <button
                        key={type.id}
                        onClick={() => setMatchType(type.id as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${matchType === type.id ? 'bg-teal-600 text-white shadow-md' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Overs Inputs - Only visible for Limited Overs */}
        {matchType === 'limited' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">No. of overs<span className="text-red-500">*</span></label>
                    <input 
                        type="number" 
                        value={overs}
                        onChange={(e) => setOvers(e.target.value)}
                        placeholder="e.g. 6, 10, 20"
                        min="1"
                        className="w-full border-b border-slate-300 py-2 outline-none focus:border-teal-500 transition-colors"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-slate-500">Overs per bowler<span className="text-red-500">*</span></label>
                        <button className="text-teal-600 text-xs font-medium flex items-center hover:text-teal-700">
                            Power play <ChevronRight className="h-3 w-3 ml-0.5" />
                        </button>
                    </div>
                    <input 
                        type="number" 
                        value={oversPerBowler}
                        onChange={(e) => setOversPerBowler(e.target.value)}
                        placeholder="e.g. 1, 2, 4"
                        className="w-full border-b border-slate-300 py-2 outline-none focus:border-teal-500 transition-colors"
                    />
                </div>
            </div>
        )}

        {/* Location & Ground */}
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
             <div>
                 <label className="block text-sm font-medium text-slate-500 mb-1">City / town<span className="text-red-500">*</span></label>
                 <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border-b border-slate-300 py-2 outline-none focus:border-teal-500 transition-colors bg-transparent"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-slate-500 mb-1">Ground<span className="text-red-500">*</span></label>
                 <input 
                    type="text" 
                    value={ground}
                    onChange={(e) => setGround(e.target.value)}
                    placeholder="Enter ground name"
                    className="w-full border-b border-slate-300 py-2 outline-none focus:border-teal-500 transition-colors bg-transparent"
                />
            </div>
        </div>

        {/* Date & Time */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-200">
             <label className="block text-sm font-medium text-slate-500 mb-1">Date & time</label>
             <div className="relative w-full">
                {/* Custom Display */}
                <div className="w-full border-b border-slate-300 py-2 text-slate-900 bg-transparent flex items-center justify-between pointer-events-none">
                    <span>
                        {date ? new Date(date).toLocaleString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: '2-digit', 
                            year: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true
                        }) : 'Select date & time'}
                    </span>
                    <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                
                {/* Hidden Input Trigger */}
                <input 
                    type="datetime-local" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
             </div>
        </div>

        {/* Ball & Pitch Type */}
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 delay-300">
            {/* Ball Type */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Ball type</label>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'TENNIS', label: 'Tennis' },
                        { id: 'LEATHER', label: 'Leather' },
                        { id: 'OTHER', label: 'Other' }
                    ].map(type => (
                        <button 
                            key={type.id}
                            onClick={() => setBallType(type.id as any)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${ballType === type.id ? 'bg-teal-600 text-white shadow-md' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pitch Type */}
            <div className="pb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Pitch type</label>
                <div className="flex flex-wrap gap-2">
                     {[
                        { id: 'TURF', label: 'Turf' },
                        { id: 'MAT', label: 'Mat' },
                        { id: 'CEMENT', label: 'Cement' },
                        { id: 'OTHER', label: 'Other' }
                     ].map(type => (
                         <button
                            key={type.id}
                            onClick={() => setPitchType(type.id as any)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${pitchType === type.id ? 'bg-teal-600 text-white shadow-md' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                         >
                             {type.label}
                         </button>
                     ))}
                </div>
            </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 flex border-t border-slate-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
         <button 
             onClick={() => handleMatchCreation('schedule')}
             disabled={isSubmitting || !isValid()}
             className={`flex-1 py-4 font-bold text-sm transition-colors ${!isSubmitting && isValid() ? 'bg-white text-teal-600 hover:bg-teal-50' : 'bg-slate-50 text-slate-400 cursor-not-allowed'}`}
         >
             Schedule match
         </button>
         <button 
            onClick={() => handleMatchCreation('toss')}
            disabled={isSubmitting || !isValid()}
            className={`flex-1 py-4 text-white font-bold text-sm flex items-center justify-center gap-1 transition-colors ${!isSubmitting && isValid() ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800' : 'bg-teal-300 cursor-not-allowed'}`}
         >
             {isSubmitting ? 'Processing...' : 'Next (toss)'}
         </button>
      </div>

    </div>
  );
};
