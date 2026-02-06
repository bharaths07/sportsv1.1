import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Shield } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';

type Format = 'LEAGUE' | 'KNOCKOUT' | 'GROUP_KNOCKOUT';

export const TournamentStructureScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments, updateTournamentStructure } = useGlobalState();
  
  const tournament = tournaments.find(t => t.id === id);

  const [format, setFormat] = useState<Format | null>(null);
  const [rounds, setRounds] = useState<number>(1);
  const [groups, setGroups] = useState<number>(2);
  const [qualifiedPerGroup, setQualifiedPerGroup] = useState<number>(2);

  const handleSave = () => {
    if (!id || !format) return;
    
    const structure = {
      format,
      rounds: format === 'LEAGUE' ? rounds : undefined,
      groups: format === 'GROUP_KNOCKOUT' ? groups : undefined,
      qualifiedPerGroup: format === 'GROUP_KNOCKOUT' ? qualifiedPerGroup : undefined,
    };
    
    updateTournamentStructure(id, structure);
    navigate(`/tournament/${id}/schedule`);
  };

  const isFormValid = () => {
    if (!format) return false;
    if (format === 'LEAGUE' && rounds < 1) return false;
    if (format === 'GROUP_KNOCKOUT' && (groups < 1 || qualifiedPerGroup < 1)) return false;
    return true;
  };

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-20">
        <button 
          onClick={() => navigate(`/tournament/${id}/teams`)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Groups / Rounds</h1>
          <p className="text-xs text-slate-500">Set up how teams will compete</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-24 max-w-lg mx-auto w-full space-y-8">
        
        {/* Section 1: Select Format */}
        <section className="space-y-4">
          <label className="text-sm font-bold text-slate-700 uppercase">Select format *</label>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => setFormat('LEAGUE')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4
                ${format === 'LEAGUE' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${format === 'LEAGUE' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}
              `}>
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold ${format === 'LEAGUE' ? 'text-teal-900' : 'text-slate-800'}`}>League (Points Table)</h3>
                <p className="text-xs text-slate-500">All teams play each other. Top teams win.</p>
              </div>
            </button>

            <button
              onClick={() => setFormat('KNOCKOUT')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4
                ${format === 'KNOCKOUT' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${format === 'KNOCKOUT' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}
              `}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold ${format === 'KNOCKOUT' ? 'text-teal-900' : 'text-slate-800'}`}>Knockout</h3>
                <p className="text-xs text-slate-500">Lose and you're out. Last team standing wins.</p>
              </div>
            </button>

            <button
              onClick={() => setFormat('GROUP_KNOCKOUT')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4
                ${format === 'GROUP_KNOCKOUT' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${format === 'GROUP_KNOCKOUT' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}
              `}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold ${format === 'GROUP_KNOCKOUT' ? 'text-teal-900' : 'text-slate-800'}`}>Group + Knockout</h3>
                <p className="text-xs text-slate-500">Groups first, then top teams qualify for knockouts.</p>
              </div>
            </button>
          </div>
        </section>

        {/* Section 2: Structure Configuration */}
        {format && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              {format === 'LEAGUE' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Rounds *</label>
                  <input 
                    type="number" 
                    min="1"
                    value={rounds}
                    onChange={(e) => setRounds(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-lg"
                  />
                  <p className="text-xs text-slate-500">Each team plays others {rounds} time(s).</p>
                </div>
              )}

              {format === 'KNOCKOUT' && (
                <div className="text-center py-4">
                  <p className="text-slate-600 font-medium">Teams will be eliminated after each match.</p>
                  <p className="text-xs text-slate-400 mt-1">No additional configuration required.</p>
                </div>
              )}

              {format === 'GROUP_KNOCKOUT' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Number of groups *</label>
                    <input 
                      type="number" 
                      min="1"
                      value={groups}
                      onChange={(e) => setGroups(parseInt(e.target.value) || 0)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Teams qualified per group *</label>
                    <input 
                      type="number" 
                      min="1"
                      value={qualifiedPerGroup}
                      onChange={(e) => setQualifiedPerGroup(parseInt(e.target.value) || 0)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-lg"
                    />
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

      </main>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-lg mx-auto">
          <button
            disabled={!isFormValid()}
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-bold text-center transition-all
              ${isFormValid() 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 active:scale-95' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
          >
            Save & Continue
          </button>
        </div>
      </div>

    </div>
  );
};
