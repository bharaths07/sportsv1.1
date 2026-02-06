import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Share2, Search, Users, Shield } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Team } from '../../domain/team';

export const TournamentTeamsScreen: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { tournaments, teams, addTeamToTournament, removeTeamFromTournament, currentUser } = useGlobalState();
  
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showExistingTeamSearch, setShowExistingTeamSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  // Derived state: Get full team objects for added teams
  const addedTeams = (tournament?.teams || []).map(teamId => 
    teams.find(t => t.id === teamId)
  ).filter(Boolean) as Team[];

  const isNextEnabled = addedTeams.length >= 2;

  // Teams available to add (user's teams or all public teams for demo)
  // Filtering out already added teams
  const availableTeams = teams.filter(t => 
    !addedTeams.some(at => at.id === t.id) && 
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.institutionId?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddExistingTeam = (team: Team) => {
    if (tournamentId) {
      addTeamToTournament(tournamentId, team.id);
      setShowExistingTeamSearch(false);
      setShowAddOptions(false);
    }
  };

  const handleRemoveTeam = (teamId: string) => {
    if (window.confirm('Are you sure you want to remove this team?')) {
      if (tournamentId) {
        removeTeamFromTournament(tournamentId, teamId);
      }
    }
  };

  const handleCreateNewTeam = () => {
    navigate(`/team/create?context=tournament&tournamentId=${tournamentId}`);
  };

  const handleInviteTeam = () => {
    const link = `${window.location.origin}/tournament/${tournamentId}/join-team`;
    if (navigator.share) {
      navigator.share({
        title: `Join ${tournament?.name}`,
        text: 'Register your team for this tournament!',
        url: link,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(link);
      alert('Invite link copied to clipboard!');
    }
  };

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/tournament/${tournamentId}`)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Add Teams</h1>
            <p className="text-xs text-slate-500">Add teams that will participate</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-24 max-w-lg mx-auto w-full space-y-6">
        
        {/* Added Teams List */}
        {addedTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-slate-900 font-medium">No teams added yet</h3>
              <p className="text-slate-500 text-sm mt-1">Add at least 2 teams to proceed</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-500 px-1">
              <span>{addedTeams.length} Teams Added</span>
            </div>
            {addedTeams.map(team => (
              <div key={team.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {team.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800">{team.name}</h3>
                    <p className="text-xs text-slate-500">{team.institutionId || 'City'}</p> 
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveTeam(team.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Team Button */}
        <button
          onClick={() => setShowAddOptions(true)}
          className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-600 font-bold hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Team</span>
        </button>

      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-lg mx-auto">
          <button
            disabled={!isNextEnabled}
            onClick={() => navigate(`/tournament/${tournamentId}/structure`)}
            className={`w-full py-3 rounded-xl font-bold text-center transition-all
              ${isNextEnabled 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 active:scale-95' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Team Options Bottom Sheet / Modal */}
      {showAddOptions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Add Team</h3>
              <button onClick={() => setShowAddOptions(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-2">
              <button 
                onClick={() => setShowExistingTeamSearch(true)}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Add existing team</div>
                  <div className="text-xs text-slate-500">Search from your teams or public teams</div>
                </div>
              </button>

              <button 
                onClick={handleCreateNewTeam}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Create new team</div>
                  <div className="text-xs text-slate-500">Register a new team for this tournament</div>
                </div>
              </button>

              <button 
                onClick={handleInviteTeam}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Invite team via link</div>
                  <div className="text-xs text-slate-500">Share a link to join this tournament</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Existing Team Search Overlay */}
      {showExistingTeamSearch && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center gap-3">
            <button onClick={() => setShowExistingTeamSearch(false)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search teams..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {availableTeams.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No teams found</div>
            ) : (
              <div className="space-y-2">
                {availableTeams.map(team => (
                  <button 
                    key={team.id}
                    onClick={() => handleAddExistingTeam(team)}
                    className="w-full p-3 flex items-center gap-3 bg-white border border-slate-100 rounded-xl hover:border-teal-500 hover:shadow-sm transition-all text-left group"
                  >
                     {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-teal-50 group-hover:text-teal-600">
                          {team.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-800">{team.name}</h4>
                        <p className="text-xs text-slate-500">{team.institutionId || 'City'}</p>
                      </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
