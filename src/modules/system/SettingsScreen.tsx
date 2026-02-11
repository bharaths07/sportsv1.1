import React from 'react';
import { useGlobalState } from '../../app/AppProviders';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { stringToColor } from '../../utils/colors';
import { Bell, Shield, User } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    currentUser,
    logout,
    followedTeams,
    followedTournaments,
    teams,
    tournaments,
    toggleFollowTeam,
    toggleFollowTournament,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useGlobalState();

  const getTeam = (id: string) => teams.find(t => t.id === id);
  const getTournament = (id: string) => tournaments.find(t => t.id === id);

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="space-y-6 max-w-3xl mx-auto">
        
        {/* 1. ACCOUNT */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Account</h3>
          </div>
          <div className="p-6">
            {currentUser ? (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <Avatar 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    fallback={currentUser.name}
                    className={`w-20 h-20 text-2xl ${stringToColor(currentUser.name || '')}`}
                  />
                </div>
                <div className="flex-1 space-y-6 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-500 mb-1 block">Name</label>
                      <div className="text-base font-medium text-slate-900">{currentUser.firstName} {currentUser.lastName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500 mb-1 block">Email</label>
                      <div className="text-base font-medium text-slate-900">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => alert('Change password functionality would go here')}
                    >
                      Change password
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">Sign in to manage your account and sync settings.</p>
                <Button onClick={() => window.location.href = '/login'}>
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* 2. FOLLOWING */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Following</h3>
          </div>
          
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center gap-2 text-sm text-blue-700">
            <span>ℹ</span> Match follows are temporary and end automatically after completion.
          </div>

          {followedTeams.length === 0 && followedTournaments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="font-medium text-slate-900 mb-2">
                You’re not following any teams or tournaments yet.
              </div>
              <div className="text-sm text-slate-500">
                Follow teams or tournaments to personalize your experience.
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Teams */}
              {followedTeams.length > 0 && (
                <>
                  <div className="px-6 py-3 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Teams You Follow
                  </div>
                  {[...followedTeams]
                    .map(id => getTeam(id))
                    .filter((t): t is NonNullable<typeof t> => !!t)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(team => (
                    <div key={team.id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={team.logoUrl}
                          alt={team.name}
                          fallback={team.name}
                          className={`w-10 h-10 ${stringToColor(team.name)}`}
                        />
                        <div>
                          <span className="font-medium text-slate-900 block">{team.name}</span>
                          <span className="text-xs text-slate-500 uppercase tracking-wide">Following</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-slate-200"
                        onClick={() => toggleFollowTeam(team.id)}
                      >
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </>
              )}

              {/* Tournaments */}
              {followedTournaments.length > 0 && (
                <>
                  <div className="px-6 py-3 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tournaments You Follow
                  </div>
                  {[...followedTournaments]
                    .map(id => getTournament(id))
                    .filter((t): t is NonNullable<typeof t> => !!t)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(tournament => (
                    <div key={tournament.id} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-3">
                        <Avatar
                          src={tournament.logoUrl}
                          alt={tournament.name}
                          fallback={tournament.name}
                          className={`w-10 h-10 ${stringToColor(tournament.name)}`}
                        />
                        <div>
                          <span className="font-medium text-slate-900 block">{tournament.name}</span>
                          <span className="text-xs text-slate-500 uppercase tracking-wide">Following</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-slate-200"
                        onClick={() => toggleFollowTournament(tournament.id)}
                      >
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </Card>

        {/* 3. NOTIFICATIONS */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Notifications</h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-slate-900 mb-1">Allow Notifications</div>
                <div className="text-sm text-slate-500">Enable or disable all app notifications</div>
              </div>
              
              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled} 
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
