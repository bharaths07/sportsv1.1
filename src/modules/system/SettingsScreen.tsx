import React from 'react';
import { useGlobalState } from '../../app/AppProviders';

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
    matchStartEnabled,
    matchResultEnabled,
    tournamentNotificationsEnabled,
    setNotificationsEnabled,
    setMatchStartEnabled,
    setMatchResultEnabled,
    setTournamentNotificationsEnabled,
    preferences,
    updatePreferences
  } = useGlobalState();

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch {}
    }
  };

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown Team';
  const getTournamentName = (id: string) => tournaments.find(t => t.id === id)?.name || 'Unknown Tournament';

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111' }}>Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* 1. ACCOUNT */}
        <section style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: '600', fontSize: '16px', color: '#333' }}>
            Account
          </div>
          <div style={{ padding: '20px' }}>
            {currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Name</div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{currentUser.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{currentUser.email}</div>
                </div>
                <div style={{ paddingTop: '16px', borderTop: '1px solid #eee', display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => alert('Change password functionality would go here')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Change password
                  </button>
                  <button 
                    onClick={logout}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ffcccc', backgroundColor: '#fff5f5', color: '#cc0000', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>
                <p style={{ marginBottom: '16px' }}>Sign in to manage your account and sync settings.</p>
                <button 
                   onClick={() => window.location.href = '/login'} // Assuming a login route exists or will exist
                   style={{ padding: '10px 20px', borderRadius: '6px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 2. FOLLOWING (Most Important) */}
        <section style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: '600', fontSize: '16px', color: '#333' }}>
            Following
          </div>
          <div style={{ padding: '0' }}>
            <div style={{ padding: '12px 20px', backgroundColor: '#f0f9ff', borderBottom: '1px solid #e0f2fe', color: '#0369a1', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>ℹ</span> Match follows are temporary and end automatically after completion.
            </div>
            {followedTeams.length === 0 && followedTournaments.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <div style={{ color: '#333', fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>
                  You’re not following any teams or tournaments yet.
                </div>
                <div style={{ color: '#666', fontSize: '13px' }}>
                  Follow teams or tournaments to personalize your experience.
                </div>
              </div>
            ) : (
              <>
                <div style={{ padding: '16px 20px', backgroundColor: '#f9f9f9', fontSize: '13px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Teams You Follow
                </div>
                {followedTeams.length > 0 ? (
                  <div>
                    {[...followedTeams]
                      .sort((a, b) => getTeamName(a).localeCompare(getTeamName(b)))
                      .map(teamId => (
                      <div key={teamId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                        <div>
                          <span style={{ fontWeight: '500', display: 'block', marginBottom: '2px' }}>{getTeamName(teamId)}</span>
                          <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Following</span>
                        </div>
                        <button 
                          onClick={() => toggleFollowTeam(teamId)}
                          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: 'white', fontSize: '13px', cursor: 'pointer', color: '#d32f2f' }}
                        >
                          Unfollow
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div style={{ padding: '12px 20px', color: '#999', fontSize: '13px', fontStyle: 'italic' }}>
                    No teams followed.
                   </div>
                )}

                <div style={{ padding: '16px 20px', backgroundColor: '#f9f9f9', fontSize: '13px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', borderTop: '1px solid #eee' }}>
                  Tournaments You Follow
                </div>
                {followedTournaments.length > 0 ? (
                  <div>
                    {[...followedTournaments]
                      .sort((a, b) => getTournamentName(a).localeCompare(getTournamentName(b)))
                      .map(tId => (
                      <div key={tId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                         <div>
                          <span style={{ fontWeight: '500', display: 'block', marginBottom: '2px' }}>{getTournamentName(tId)}</span>
                          <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Following</span>
                        </div>
                        <button 
                          onClick={() => toggleFollowTournament(tId)}
                          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: 'white', fontSize: '13px', cursor: 'pointer', color: '#d32f2f' }}
                        >
                          Unfollow
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '12px 20px', color: '#999', fontSize: '13px', fontStyle: 'italic' }}>
                    No tournaments followed.
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* 3. NOTIFICATIONS */}
        <section style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: '600', fontSize: '16px', color: '#333' }}>
            Notifications
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>Allow Notifications</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Enable or disable all app notifications</div>
              </div>
              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled} 
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{ 
                  position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: notificationsEnabled ? '#2196F3' : '#ccc', 
                  borderRadius: '24px', transition: '.4s' 
                }}>
                  <span style={{ 
                    position: 'absolute', content: '""', height: '16px', width: '16px', left: '4px', bottom: '4px', 
                    backgroundColor: 'white', borderRadius: '50%', transition: '.4s',
                    transform: notificationsEnabled ? 'translateX(16px)' : 'translateX(0)' 
                  }} />
                </span>
              </label>
            </div>

            <div style={{ opacity: notificationsEnabled ? 1 : 0.5, pointerEvents: notificationsEnabled ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingLeft: '12px', borderLeft: '3px solid #eee' }}>
                <span>Match start alerts</span>
                <input type="checkbox" checked={matchStartEnabled} onChange={(e) => setMatchStartEnabled(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingLeft: '12px', borderLeft: '3px solid #eee' }}>
                <span>Match result alerts</span>
                <input type="checkbox" checked={matchResultEnabled} onChange={(e) => setMatchResultEnabled(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingLeft: '12px', borderLeft: '3px solid #eee' }}>
                <span>Tournament updates</span>
                <input type="checkbox" checked={tournamentNotificationsEnabled} onChange={(e) => setTournamentNotificationsEnabled(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>
              
              <button 
                onClick={requestPermission} 
                style={{ fontSize: '13px', color: '#2196F3', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Ensure browser permission is granted
              </button>
            </div>
          </div>
        </section>

        {/* 4. PREFERENCES */}
        <section style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: '600', fontSize: '16px', color: '#333' }}>
            Preferences
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Preferred Sport</div>
              <select 
                value={preferences.sport} 
                onChange={(e) => updatePreferences({ sport: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' }}
              >
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Timezone</div>
              <select 
                value={preferences.timezone} 
                onChange={(e) => updatePreferences({ timezone: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' }}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Language</div>
              <select 
                value={preferences.language} 
                onChange={(e) => updatePreferences({ language: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' }}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
