import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Plus, QrCode, Users, MapPin, Shield, Trophy, Activity, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Team } from '../../domain/team';

type Tab = 'your-teams' | 'opponents' | 'add';

export const TeamSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const game = searchParams.get('game') || 'cricket';
  const { slot } = useParams<{ slot: string }>(); // 'A' or 'B'
  
  const { teams: globalTeams, addTeam, currentUser } = useGlobalState();
  
  const [activeTab, setActiveTab] = useState<Tab>('your-teams');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter teams based on tab and search
  const filteredTeams = globalTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if currentUser is a member
    const isMyTeam = team.members?.some(m => m.playerId === currentUser?.id); 
    
    if (activeTab === 'your-teams') return isMyTeam && matchesSearch;
    if (activeTab === 'opponents') return !isMyTeam && matchesSearch;
    return false;
  });

  const handleTeamSelect = (team: Team) => {
    setLoading(true);
    // Simulate slight delay for interaction feedback
    setTimeout(() => {
        const currentParams = new URLSearchParams(searchParams);
        if (slot === 'A') {
          currentParams.set('teamA', team.id);
        } else {
          currentParams.set('teamB', team.id);
        }
        navigate(`/start-match/select-teams?${currentParams.toString()}`);
    }, 300);
  };

  const handleAddTeam = (newTeam: Partial<Team>) => {
    const team: Team = {
      id: `t${Date.now()}`,
      name: newTeam.name || 'New Team',
      type: 'club',
      active: true,
      createdAt: new Date().toISOString(),
      members: currentUser ? [{ playerId: currentUser.id, role: 'captain', joinedAt: new Date().toISOString() }] : [],
      sportId: 's1', // Default
      ...newTeam
    } as Team;
    
    addTeam(team);
    setActiveTab('your-teams'); 
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      {/* Cricket Themed Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0" 
           style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #10b981 0%, transparent 20%), radial-gradient(circle at 80% 80%, #059669 0%, transparent 20%)' }} 
      />

      {/* Modern Cricket Header */}
      <header className="relative z-10 bg-gradient-to-r from-emerald-800 to-teal-700 px-4 py-4 text-white shadow-md">
        <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold tracking-tight">Select Team {slot}</h1>
            <div className="flex gap-2">
               <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
                <QrCode className="h-5 w-5" />
              </button>
            </div>
        </div>
        
        {/* Context Sub-header */}
        <div className="mt-4 flex items-center justify-between text-emerald-100 text-xs font-medium px-1">
            <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {game.charAt(0).toUpperCase() + game.slice(1)} Match
            </span>
            <span>Step 2 of 4</span>
        </div>
      </header>

      {/* Styled Tabs */}
      <div className="relative z-10 flex bg-white shadow-sm sticky top-0">
        {(['your-teams', 'opponents', 'add'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-all relative overflow-hidden
                ${activeTab === tab ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
              `}
            >
              {tab.replace('-', ' ')}
              {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full animate-in fade-in zoom-in duration-300" />
              )}
            </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        )}

        {activeTab === 'add' ? (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
             <AddTeamForm onCancel={() => setActiveTab('your-teams')} onSubmit={handleAddTeam} />
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
             {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search teams..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>

            {/* Quick Add Action (Mobile Prominent) */}
            <button 
              onClick={() => setActiveTab('add')}
              className="w-full md:hidden flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create New Team
            </button>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map((team, index) => (
                <div 
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  className="group relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 group-hover:from-emerald-50/50 group-hover:to-teal-50/50 transition-all duration-500" />
                  
                  <div className="relative flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-inner ${stringToColor(team.name)} transform group-hover:scale-105 transition-transform duration-300`}>
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="h-full w-full rounded-2xl object-cover" />
                      ) : (
                        team.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-emerald-800 transition-colors">
                        {team.name}
                      </h3>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                            <MapPin className="mr-1 h-3 w-3" />
                            Bangalore
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                            <Users className="mr-1 h-3 w-3" />
                            {team.members.length} Players
                          </span>
                      </div>

                      {/* Stats / Info */}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Type</span>
                            <span className="text-xs font-semibold text-slate-700 capitalize">{team.type}</span>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Captain</span>
                            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                {team.captainId ? 'Assigned' : 'None'}
                                {team.captainId && <Shield className="w-3 h-3 text-amber-500" />}
                            </span>
                         </div>
                      </div>

                      {/* Achievements & Meta */}
                      {(team.achievements?.length || team.foundedYear || team.lastMatchAt) && (
                        <div className="mt-2 pt-2 border-t border-slate-50 flex items-center gap-3 text-xs text-slate-500">
                            {team.achievements && team.achievements.length > 0 && (
                                <div className="flex items-center gap-1 text-amber-600 font-medium" title={team.achievements[0].title}>
                                    <Trophy className="w-3 h-3" />
                                    <span className="truncate max-w-[80px]">{team.achievements[0].title}</span>
                                </div>
                            )}
                            {team.foundedYear && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{team.foundedYear}</span>
                                </div>
                            )}
                            {team.lastMatchAt && (
                                <div className="flex items-center gap-1 ml-auto">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(team.lastMatchAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className="absolute right-4 top-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ChevronRight className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
              ))}

               {/* Add New Team Card (Desktop) */}
               <div 
                  onClick={() => setActiveTab('add')}
                  className="hidden md:flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
                >
                  <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all mb-3">
                      <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-700">Create New Team</span>
               </div>
            </div>
              
              {filteredTeams.length === 0 && (
                <div className="mt-16 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                  <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                     <Shield className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No teams found</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-2">
                    Try adjusting your search or create a new team to get started.
                  </p>
                  <button 
                    onClick={() => setActiveTab('add')}
                    className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-full font-bold shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all active:scale-95"
                  >
                    Create New Team
                  </button>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
};

// Consistent Colors Helper
const stringToColor = (str: string) => {
  const colors = [
    'bg-gradient-to-br from-red-500 to-rose-600', 
    'bg-gradient-to-br from-blue-500 to-indigo-600', 
    'bg-gradient-to-br from-emerald-500 to-teal-600', 
    'bg-gradient-to-br from-violet-500 to-purple-600', 
    'bg-gradient-to-br from-amber-500 to-orange-600', 
    'bg-gradient-to-br from-cyan-500 to-sky-600'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

interface AddTeamFormProps {
  onCancel: () => void;
  onSubmit: (team: Partial<Team>) => void;
}

const AddTeamForm: React.FC<AddTeamFormProps> = ({ onCancel, onSubmit }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, about: city });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden max-w-lg mx-auto">
       <div className="bg-emerald-50 p-6 flex flex-col items-center justify-center border-b border-emerald-100">
         <div className="relative group cursor-pointer">
             <div className="h-24 w-24 rounded-full bg-white shadow-md flex items-center justify-center text-emerald-200 border-4 border-white group-hover:border-emerald-200 transition-all">
                <Trophy className="w-10 h-10" />
             </div>
             <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full shadow-lg transform translate-x-1 translate-y-1 group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
             </div>
         </div>
         <h3 className="mt-4 text-lg font-bold text-emerald-900">Create New Team</h3>
         <p className="text-xs text-emerald-600/80">Upload logo optional</p>
       </div>

       <form onSubmit={handleSubmit} className="p-6 space-y-5">
         <div className={`transition-all duration-300 ${focusedField === 'name' ? 'transform scale-[1.01]' : ''}`}>
           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Team Name <span className="text-red-500">*</span></label>
           <input 
             type="text" 
             required
             value={name}
             onFocus={() => setFocusedField('name')}
             onBlur={() => setFocusedField(null)}
             onChange={(e) => setName(e.target.value)}
             className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
             placeholder="e.g. Royal Challengers"
           />
         </div>

         <div className={`transition-all duration-300 ${focusedField === 'city' ? 'transform scale-[1.01]' : ''}`}>
           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Home Ground / City <span className="text-red-500">*</span></label>
           <input 
             type="text" 
             required
             value={city}
             onFocus={() => setFocusedField('city')}
             onBlur={() => setFocusedField(null)}
             onChange={(e) => setCity(e.target.value)}
             className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
             placeholder="e.g. Chinnaswamy Stadium, Bangalore"
           />
         </div>

         <div>
           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Number (Optional)</label>
           <div className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
             <span className="flex items-center justify-center bg-slate-100 px-3 text-sm font-bold text-slate-500 border-r border-slate-200">+91</span>
             <input 
               type="tel" 
               className="flex-1 bg-transparent p-3 text-sm font-semibold text-slate-800 outline-none"
               placeholder="98765 43210"
             />
           </div>
         </div>

         <div className="pt-4 flex gap-3">
           <button 
             type="button"
             onClick={onCancel}
             className="flex-1 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all"
           >
             Cancel
           </button>
           <button 
             type="submit"
             disabled={!name.trim() || !city.trim()}
             className={`flex-1 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all
                ${name.trim() && city.trim() 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transform active:scale-[0.98]' 
                    : 'bg-slate-300 cursor-not-allowed shadow-none'}
             `}
           >
             Create Team
           </button>
         </div>
       </form>
    </div>
  );
};
