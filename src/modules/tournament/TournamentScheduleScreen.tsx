import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Plus, Clock } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';

type ScheduleMode = 'AUTO' | 'MANUAL' | 'LATER';

export const TournamentScheduleScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments, updateTournamentScheduleMode } = useGlobalState();
  
  const tournament = tournaments.find(t => t.id === id);

  const [scheduleMode, setScheduleMode] = useState<ScheduleMode | null>(null);

  const handleSave = () => {
    if (!id || !scheduleMode) return;
    
    updateTournamentScheduleMode(id, scheduleMode);
    
    if (scheduleMode === 'AUTO') {
      navigate(`/tournament/${id}/schedule/auto`);
    } else if (scheduleMode === 'MANUAL') {
      // Navigate to start match flow with tournament context
      navigate(`/start-match?context=tournament&tournamentId=${id}`);
    } else {
      // LATER -> Dashboard
      navigate(`/tournament/${id}`);
    }
  };

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-20">
        <button 
          onClick={() => navigate(`/tournament/${id}/structure`)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Schedule</h1>
          <p className="text-xs text-slate-500">Create fixtures for this tournament</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-24 max-w-lg mx-auto w-full space-y-6">
        
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 uppercase">How do you want to add matches?</label>
          
          <div className="grid grid-cols-1 gap-3">
            {/* 1. Auto-Generate */}
            <button
              onClick={() => setScheduleMode('AUTO')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4
                ${scheduleMode === 'AUTO' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${scheduleMode === 'AUTO' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}
              `}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold ${scheduleMode === 'AUTO' ? 'text-teal-900' : 'text-slate-800'}`}>Auto-generate fixtures</h3>
                <p className="text-xs text-slate-500">Create matches automatically based on teams and format</p>
              </div>
            </button>

            {/* 2. Manual */}
            <button
              onClick={() => setScheduleMode('MANUAL')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4
                ${scheduleMode === 'MANUAL' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${scheduleMode === 'MANUAL' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}
              `}>
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold ${scheduleMode === 'MANUAL' ? 'text-teal-900' : 'text-slate-800'}`}>Add matches manually</h3>
                <p className="text-xs text-slate-500">Create matches one by one</p>
              </div>
            </button>

            {/* 3. Later */}
            <button
              onClick={() => setScheduleMode('LATER')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4
                ${scheduleMode === 'LATER' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${scheduleMode === 'LATER' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}
              `}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold ${scheduleMode === 'LATER' ? 'text-teal-900' : 'text-slate-800'}`}>Do this later</h3>
                <p className="text-xs text-slate-500">You can add matches anytime</p>
              </div>
            </button>
          </div>
        </div>

      </main>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-lg mx-auto">
          <button
            disabled={!scheduleMode}
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-bold text-center transition-all
              ${scheduleMode 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 active:scale-95' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
          >
            Continue
          </button>
        </div>
      </div>

    </div>
  );
};
