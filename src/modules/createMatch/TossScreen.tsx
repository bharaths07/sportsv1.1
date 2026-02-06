import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Match, Toss } from '../../domain/match';
import { ChevronLeft } from 'lucide-react';

export const TossScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId');
  const navigate = useNavigate();
  const { matches, updateMatch } = useGlobalState();
  const [match, setMatch] = useState<Match | null>(null);

  const [tossWinnerTeamId, setTossWinnerTeamId] = useState<string>('');
  const [tossDecision, setTossDecision] = useState<'BAT' | 'BOWL' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (matchId && matches.length > 0) {
      const foundMatch = matches.find(m => m.id === matchId);
      if (foundMatch) {
        setMatch(foundMatch);
        if (foundMatch.toss) {
            setTossWinnerTeamId(foundMatch.toss.winnerTeamId);
            setTossDecision(foundMatch.toss.decision);
        }
      } else {
        // Handle invalid match ID
        console.error('Match not found');
        // navigate('/create-match'); // Optional: redirect if not found
      }
    }
  }, [matchId, matches]);

  const handleConfirmToss = () => {
    if (!match || !tossWinnerTeamId || !tossDecision) return;

    setIsSubmitting(true);

    const tossDetails: Toss = {
      winnerTeamId: tossWinnerTeamId,
      decision: tossDecision
    };

    // Simulate network delay
    setTimeout(() => {
        updateMatch(match.id, { 
            toss: tossDetails,
            // Status remains 'created' until squads are confirmed or match starts? 
            // The prompt says "No live scoring yet", so status update isn't explicitly requested here, 
            // but Step 8 set it to 'created'.
        });
        setIsSubmitting(false);
        navigate(`/start-match/squads?matchId=${match.id}`);
    }, 500);
  };

  if (!match) {
    return <div className="p-4">Loading match details...</div>;
  }

  const isComplete = tossWinnerTeamId && tossDecision;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-slate-100">
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Toss</h1>
      </div>

      <div className="flex-1 p-4 space-y-8 max-w-lg mx-auto w-full">
        
        {/* Section 1: Who won the toss? */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Who won the toss?</h2>
          <div className="grid grid-cols-2 gap-4">
            {[match.homeParticipant, match.awayParticipant].map((team) => (
              <button
                key={team.id}
                onClick={() => setTossWinnerTeamId(team.id)}
                className={`
                  relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all
                  ${tossWinnerTeamId === team.id 
                    ? 'border-teal-500 bg-teal-50 shadow-md' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}
                `}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3 ${tossWinnerTeamId === team.id ? 'bg-teal-200 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
                <span className={`font-semibold text-center ${tossWinnerTeamId === team.id ? 'text-teal-900' : 'text-slate-700'}`}>
                  {team.name}
                </span>
                {tossWinnerTeamId === team.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Toss Decision */}
        <section className={`animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 ${!tossWinnerTeamId ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-sm font-bold text-slate-900 mb-3">Elected to</h2>
          <div className="flex gap-3">
            {(['BAT', 'BOWL'] as const).map((decision) => (
              <button
                key={decision}
                onClick={() => setTossDecision(decision)}
                disabled={!tossWinnerTeamId}
                className={`
                  flex-1 py-3 px-6 rounded-lg font-bold text-sm transition-all
                  ${tossDecision === decision 
                    ? 'bg-slate-800 text-white shadow-lg transform scale-105' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}
                `}
              >
                {decision === 'BAT' ? 'Bat 🏏' : 'Bowl 🥎'}
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* Primary CTA */}
      <div className="p-4 bg-white border-t border-slate-200">
        <button
          onClick={handleConfirmToss}
          disabled={!isComplete || isSubmitting}
          className={`
            w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2
            ${isComplete && !isSubmitting
              ? 'bg-teal-600 text-white shadow-lg hover:bg-teal-700 active:scale-[0.98]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          {isSubmitting ? 'Saving...' : 'Confirm toss'}
        </button>
      </div>
    </div>
  );
};
