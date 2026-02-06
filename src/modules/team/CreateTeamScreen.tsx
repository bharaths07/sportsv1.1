import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, MapPin, Shield } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Team } from '../../domain/team';

export const CreateTeamScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTeam, addTeamToTournament } = useGlobalState();
  
  const context = searchParams.get('context');
  const tournamentId = searchParams.get('tournamentId');

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setLogoUrl(fakeUrl);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !city.trim()) return;

    // Create new team object
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: name.trim(),
      type: 'club', // Default
      sportId: 'cricket',
      active: true,
      members: [],
      createdAt: new Date().toISOString(),
      institutionId: city.trim(), // Using institutionId for City based on user request "City *"
      logoUrl: logoUrl || undefined,
    };

    // Add to global state
    addTeam(newTeam);
    
    // Logic for context
    if (context === 'tournament' && tournamentId) {
        addTeamToTournament(tournamentId, newTeam.id);
        navigate(`/tournament/${tournamentId}/teams`);
    } else {
        navigate('/teams'); // Default back to list
    }
  };

  const isValid = name.trim().length > 0 && city.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Create New Team</h1>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
        
        {/* Logo Upload */}
        <div className="flex justify-center">
            <div className="relative group">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden border-2 
                    ${logoUrl ? 'border-transparent' : 'border-dashed border-slate-300 bg-slate-100'}`}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <Shield className="w-8 h-8 text-slate-400" />
                    )}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-slate-100">
                    <Upload className="w-4 h-4 text-teal-600" />
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Team Name *</label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex. Royal Challengers"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors font-semibold"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">City *</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex. Bangalore"
                        className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors font-medium"
                    />
                </div>
            </div>
        </div>

      </main>

      <div className="p-4 bg-white border-t border-slate-200">
         <button
            disabled={!isValid}
            onClick={handleSubmit}
            className={`w-full py-3 rounded-xl font-bold transition-all
                ${isValid 
                    ? 'bg-teal-600 text-white shadow-lg active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
         >
            Create Team
         </button>
      </div>
    </div>
  );
};
