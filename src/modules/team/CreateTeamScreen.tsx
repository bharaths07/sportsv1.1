import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, Shield } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Team } from '../../domain/team';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

export const CreateTeamScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTeam, addTeamToTournament } = useGlobalState();
  
  const context = searchParams.get('context');
  const tournamentId = searchParams.get('tournamentId');
  const gameId = searchParams.get('game');

  // Redirect to game selection if no game specified
  React.useEffect(() => {
    if (!gameId && !context) { // Allow context (like from tournament) to bypass or handle differently? 
       // actually, for now, let's enforce game selection for standard flow
       navigate('/teams/create');
    }
  }, [gameId, context, navigate]);

  const getSportName = (id: string | null) => {
    if (!id) return 'Team';
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setLogoUrl(fakeUrl);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !city.trim()) return;
    setIsSubmitting(true);

    // Create new team object
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: name.trim(),
      type: 'club', // Default
      sportId: gameId || 'cricket',
      active: true,
      members: [],
      createdAt: new Date().toISOString(),
      location: city.trim(),
      about: about.trim(),
      logoUrl: logoUrl || undefined,
    };

    try {
        // Add to global state
        await addTeam(newTeam);
        
        // Logic for context
        if (context === 'tournament' && tournamentId) {
            addTeamToTournament(tournamentId, newTeam.id);
            navigate(`/tournament/${tournamentId}/teams`);
        } else {
            navigate('/teams'); // Default back to list
        }
    } catch (error) {
        console.error("Team creation failed", error);
        // Alert handled by provider, but we stop loading state
    } finally {
        setIsSubmitting(false);
    }
  };

  const isValid = name.trim().length > 0 && city.trim().length > 0;

  return (
    <PageContainer>
      <PageHeader 
        title={`Create ${getSportName(gameId)} Team`} 
        description={`Add a new ${getSportName(gameId).toLowerCase()} team to your collection`}
        backUrl="/teams/create"
      />

      <div className="max-w-xl mx-auto space-y-6">
        <Card className="p-8">
            <div className="space-y-8">
                {/* Logo Upload */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative group cursor-pointer">
                        <div className="relative">
                            <Avatar 
                                src={logoUrl} 
                                fallback={<Shield className="w-10 h-10 text-slate-300" />}
                                className={`w-32 h-32 border-4 ${logoUrl ? 'border-blue-100' : 'border-dashed border-slate-200 bg-slate-50'}`}
                            />
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                            />
                             {/* Overlay for hover */}
                            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-blue-600 rounded-full p-2 shadow-lg border-2 border-white z-30 pointer-events-none">
                            <Upload className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <span className="text-xs font-medium text-slate-500 mt-3">Upload Team Logo</span>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    <Input 
                        label="Team Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Royal Challengers"
                        required
                    />

                    <Input 
                        label="City / Location"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        required
                    />

                    <Textarea 
                        label="About Team"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Tell us about your team..."
                        rows={4}
                    />

                    {/* Game Specific Fields */}
                    {gameId === 'cricket' && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-900 mb-2">Cricket Details</h4>
                            <p className="text-xs text-blue-700">Standard squad size: 11-15 players</p>
                        </div>
                    )}
                    {gameId === 'football' && (
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                            <h4 className="text-sm font-bold text-emerald-900 mb-2">Football Details</h4>
                            <p className="text-xs text-emerald-700">Standard squad size: 11-18 players</p>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!isValid || isSubmitting}
                        isLoading={isSubmitting}
                        className="w-full"
                        size="lg"
                    >
                        Create Team
                    </Button>
                </div>
            </div>
        </Card>
      </div>
    </PageContainer>
  );
};
