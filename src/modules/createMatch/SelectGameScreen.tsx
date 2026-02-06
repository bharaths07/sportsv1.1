import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export const SelectGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleGameSelect = (game: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('game', game);
    navigate(`/start-match/select-teams?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between bg-red-600 px-4 py-4 text-white shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">Select Game</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 opacity-80">
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div 
          onClick={() => handleGameSelect('cricket')}
          className="mb-4 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.99] active:bg-slate-100"
        >
          <div className="text-lg font-semibold text-slate-800">Cricket</div>
        </div>
      </div>
    </div>
  );
};
