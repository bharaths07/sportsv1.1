import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, HelpCircle, X, ArrowRight } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { TeamConfirmAnimation } from '../../components/TeamConfirmAnimation/TeamConfirmAnimation';

export const SelectTeamsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teams } = useGlobalState();
  const [searchParams] = useSearchParams();
  const game = searchParams.get('game') || 'cricket';
  const teamAId = searchParams.get('teamA');
  const teamBId = searchParams.get('teamB');

  const [showAnimation, setShowAnimation] = useState(false);

  const teamA = teamAId ? teams.find(t => t.id === teamAId) : undefined;
  const teamB = teamBId ? teams.find(t => t.id === teamBId) : undefined;

  const handleSelectTeam = (slot: 'A' | 'B') => {
    if (showAnimation) return;
    // Preserve existing params
    const currentParams = new URLSearchParams(searchParams);
    navigate(`/start-match/select-team/${slot}?${currentParams.toString()}`);
  };

  const handleClearTeam = (e: React.MouseEvent, slot: 'A' | 'B') => {
    e.stopPropagation();
    if (showAnimation) return;
    const newParams = new URLSearchParams(searchParams);
    if (slot === 'A') newParams.delete('teamA');
    else newParams.delete('teamB');
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const handleNext = () => {
    if (teamA && teamB) {
      setShowAnimation(true);
    }
  };

  const handleAnimationComplete = () => {
    // Navigate to CreateMatchScreen with pre-filled data and query params as backup
    // Initialize with existing params to preserve tournamentId/context
    const params = new URLSearchParams(searchParams);
    if (teamA) params.set('teamA', teamA.id);
    if (teamB) params.set('teamB', teamB.id);
    if (!params.has('sportId')) params.set('sportId', 's1');

    navigate(`/create-match?${params.toString()}`, { 
      state: { 
        teamA, 
        teamB,
        sportId: 's1' // Defaulting to cricket for now
      } 
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 relative">
      {/* Animation Overlay */}
      {showAnimation && teamA && teamB && (
        <TeamConfirmAnimation 
          teamA={teamA} 
          teamB={teamB} 
          matchId={`temp-${Date.now()}`} 
          onComplete={handleAnimationComplete} 
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-red-600 px-4 py-4 text-white shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">Select playing teams</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 opacity-80">
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Helper Text */}
      <div className="bg-slate-50 px-4 py-2 text-center">
        <p className="text-xs italic text-slate-500">*Scoring a match is free.</p>
      </div>

      {/* Main Content - Centered */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        
        {/* Team A Selector */}
        <div className="flex flex-col items-center">
          <div 
            onClick={() => handleSelectTeam('A')}
            className={`mb-3 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${teamA ? 'bg-white border-2 border-slate-200' : 'bg-slate-800 text-white'}`}
          >
            {teamA ? (
              <div className="relative h-full w-full">
                {teamA.logoUrl ? (
                    <img src={teamA.logoUrl} alt={teamA.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                    <div className={`flex h-full w-full items-center justify-center rounded-full text-2xl font-bold text-white ${stringToColor(teamA.name)}`}>
                        {teamA.name.substring(0, 2).toUpperCase()}
                    </div>
                )}
                <button 
                    onClick={(e) => handleClearTeam(e, 'A')}
                    className="absolute -right-1 -top-1 rounded-full bg-slate-200 p-1 text-slate-600 hover:bg-red-100 hover:text-red-600"
                >
                    <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Plus className="h-10 w-10" />
            )}
          </div>
          <button 
            onClick={() => handleSelectTeam('A')}
            className={`rounded px-6 py-2 text-sm font-medium shadow-md transition-colors ${teamA ? 'bg-white text-slate-900 border border-slate-200' : 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800'}`}
          >
            {teamA ? teamA.name : 'Select team A'}
          </button>
        </div>

        {/* VS Indicator */}
        <div className="my-10 flex h-10 w-10 rotate-45 transform items-center justify-center border border-slate-300 bg-white shadow-sm">
            <span className="-rotate-45 text-xs font-bold uppercase text-slate-500">VS</span>
        </div>

        {/* Team B Selector */}
        <div className="flex flex-col items-center">
          <div 
            onClick={() => handleSelectTeam('B')}
            className={`mb-3 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${teamB ? 'bg-white border-2 border-slate-200' : 'bg-slate-800 text-white'}`}
          >
             {teamB ? (
              <div className="relative h-full w-full">
                {teamB.logoUrl ? (
                    <img src={teamB.logoUrl} alt={teamB.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                    <div className={`flex h-full w-full items-center justify-center rounded-full text-2xl font-bold text-white ${stringToColor(teamB.name)}`}>
                        {teamB.name.substring(0, 2).toUpperCase()}
                    </div>
                )}
                <button 
                    onClick={(e) => handleClearTeam(e, 'B')}
                    className="absolute -right-1 -top-1 rounded-full bg-slate-200 p-1 text-slate-600 hover:bg-red-100 hover:text-red-600"
                >
                    <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Plus className="h-10 w-10" />
            )}
          </div>
          <button 
            onClick={() => handleSelectTeam('B')}
            className={`rounded px-6 py-2 text-sm font-medium shadow-md transition-colors ${teamB ? 'bg-white text-slate-900 border border-slate-200' : 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800'}`}
          >
            {teamB ? teamB.name : 'Select team B'}
          </button>
        </div>

      </div>

      {/* Footer - Schedule Match Button */}
      {teamA && teamB && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleNext}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-teal-700 active:scale-[0.99]"
          >
            <span>Schedule match</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

// Simple helper to generate consistent colors (duplicated from TeamSelectionScreen, could be util)
const stringToColor = (str: string) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-indigo-500'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
