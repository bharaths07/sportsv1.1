import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Trophy, ChevronRight } from 'lucide-react';

export const LeaderboardsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { players } = useGlobalState();

  const leaderboard = useMemo(() => {
    const statsMap = new Map<string, { name: string; wins: number; losses: number; draws: number; matchesPlayed: number; winRate: number }>();
    players.forEach(p => {
      const wins = p.stats?.wins || 0;
      const losses = p.stats?.losses || 0;
      const draws = p.stats?.draws || 0;
      const played = p.stats?.matchesPlayed || wins + losses + draws;
      const winRate = played > 0 ? Math.round((wins / played) * 100) : 0;
      statsMap.set(p.id, { name: `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || 'Player', wins, losses, draws, matchesPlayed: played, winRate });
    });
    const list = Array.from(statsMap.entries()).map(([id, s]) => ({ id, ...s }));
    list.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winRate - a.winRate;
    });
    return list.slice(0, 50);
  }, [players]);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Leaderboards
        </h1>
        <button
          type="button"
          onClick={() => navigate('/stats')}
          className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full"
        >
          View Stats
        </button>
      </div>
      <div className="max-w-3xl mx-auto p-6">
        <div className="grid grid-cols-1 gap-3">
          {leaderboard.map((row, idx) => (
            <div
              key={row.id}
              className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              style={{ ['--progress']: `${row.winRate}%` } as React.CSSProperties & Record<string, string>}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-slate-500' : idx === 2 ? 'bg-amber-700' : 'bg-blue-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{row.name}</p>
                    <p className="text-xs text-slate-500">
                      {row.wins}W • {row.losses}L • {row.draws}D • {row.matchesPlayed} Played
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{row.winRate}% Win Rate</p>
                  <div className="w-32 bg-slate-100 h-2 rounded overflow-hidden">
                      <div
                        className="h-2 bg-green-500 transition-[width] duration-700 w-[var(--progress)]"
                      />
                  </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/players/${row.id}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                    aria-label="View profile"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="text-center text-slate-500 p-10 border border-slate-200 rounded-xl">
              No ranking data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
