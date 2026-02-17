import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Trophy, Calendar, History } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { EmptyState } from '../../components/EmptyState';
import { FollowButton } from '../../components/FollowButton';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Avatar } from '../../components/ui/Avatar';

const SPORTS_MAP: Record<string, string> = {
  's1': 'Cricket',
  's2': 'Football',
  's3': 'Football', // Mapping s3 to Football as per usage
  's4': 'Badminton'
};

type TabType = 'overview' | 'squad' | 'matches' | 'stats' | 'achievements';

const StatCard: React.FC<{ label: string; value: string; color?: string; bgColor?: string }> = ({ label, value, color }) => (
  <Card className="flex flex-col items-center justify-center p-4">
    <div className={`text-2xl font-bold leading-none mb-1 ${color || 'text-slate-900'}`}>{value}</div>
    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</div>
  </Card>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-bold text-slate-900 mb-4 pl-3 border-l-4 border-blue-600">
    {children}
  </h3>
);

const Badge: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${className}`}>
    {text}
  </span>
);

export const TeamScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { teams, matches, players } = useGlobalState();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const team = teams.find(t => t.id === id);

  // -- Data Derivation --

  // Matches Logic
  const teamMatches = useMemo(() => {
    if (!team) return [];
    return matches.filter(m => 
      m.homeParticipant.id === team.id || m.awayParticipant.id === team.id
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [matches, team]);

  const completedMatches = teamMatches.filter(m => m.status === 'completed');
  const upcomingMatches = teamMatches.filter(m => m.status === 'draft' || m.status === 'locked');

  const matchesPlayed = completedMatches.length;
  const wins = team ? completedMatches.filter(m => m.winnerId === team.id).length : 0;
  const losses = team ? completedMatches.filter(m => m.winnerId && m.winnerId !== team.id).length : 0;
  const draws = team ? completedMatches.filter(m => m.status === 'completed' && !m.winnerId).length : 0;
  
  // Win Rate (Draws count as 0.5 win? Or just Wins / Played? Usually Wins / Played)
  const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;

  // Players Logic
  const squad = useMemo(() => {
    if (!team) return [];
    return team.members.map(member => {
      const playerProfile = players.find(p => p.id === member.playerId);
      return {
        ...member,
        name: playerProfile ? `${playerProfile.firstName} ${playerProfile.lastName}` : 'Unknown Player',
        active: playerProfile?.active
      };
    }).sort((a, b) => {
      const rank = (role: string) => {
        if (role === 'captain') return 0;
        if (role === 'vice-captain') return 1;
        return 2; 
      };
      return rank(a.role) - rank(b.role);
    });
  }, [team, players]);

  if (!team) {
    return (
      <PageContainer>
        <EmptyState message="Team not found" />
      </PageContainer>
    );
  }

  const captain = squad.find(m => m.role === 'captain');
  const isFootball = team.sportId === 's3';

  // Stats Logic
  type FootballStats = {
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    cleanSheets: number;
    avgGoals: string;
  };
  type CricketStats = {
    runs: number;
    wickets: number;
    avgRuns: number;
    avgWickets: number;
  };
  const stats: FootballStats | CricketStats = (() => {
    if (isFootball) {
      let goalsFor = 0;
      let goalsAgainst = 0;
      let cleanSheets = 0;

      completedMatches.forEach(m => {
          const isHome = m.homeParticipant.id === team.id;
          const myScore = isHome ? (m.homeParticipant.score || 0) : (m.awayParticipant.score || 0);
          const oppScore = isHome ? (m.awayParticipant.score || 0) : (m.homeParticipant.score || 0);
          
          goalsFor += isNaN(myScore) ? 0 : myScore;
          goalsAgainst += isNaN(oppScore) ? 0 : oppScore;
          if (oppScore === 0) cleanSheets++;
      });

      return {
          goalsFor,
          goalsAgainst,
          goalDifference: goalsFor - goalsAgainst,
          cleanSheets,
          avgGoals: matchesPlayed > 0 ? (goalsFor / matchesPlayed).toFixed(1) : '0.0'
      };
    } else {
      return {
        runs: 2450,
        wickets: 128,
        avgRuns: 165,
        avgWickets: 6.5
      };
    }
  })();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'squad', label: 'Squad' },
    { id: 'matches', label: 'Matches' },
    { id: 'stats', label: 'Stats' },
    { id: 'achievements', label: 'Achievements' },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title={team.name}
        description={`${SPORTS_MAP[team.sportId] || 'Sports'} Team • ${team.type} • Est. ${team.foundedYear || '2024'}`}
        backUrl="/teams"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <FollowButton id={team.id} type="team" label={true} />
          </div>
        }
      />
      
      {/* 1. HEADER SECTION (Identity) */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Avatar */}
          <Avatar
            src={team.logoUrl}
            fallback={team.name.substring(0, 2).toUpperCase()}
            className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg text-3xl font-bold text-slate-400"
          />

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-2">
               <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  {team.achievements && team.achievements.length > 0 && (
                    <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-full text-xs font-bold">
                      <Trophy className="w-3 h-3" />
                      {team.achievements[0].title}
                    </span>
                  )}
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm">
              {captain && (
                <div>
                  <span className="text-slate-500">Captain: </span>
                  <Link to={`/players/${captain.playerId}`} className="font-semibold text-slate-900 hover:text-blue-600">
                    {captain.name}
                  </Link>
                </div>
              )}
              {team.coach && (
                <div>
                  <span className="text-slate-500">Coach: </span>
                  <span className="font-semibold text-slate-900">{team.coach}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 2. STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Matches" value={matchesPlayed.toString()} />
        <StatCard label="Wins" value={wins.toString()} color="text-green-600" />
        <StatCard label={isFootball ? "Draws" : "Losses"} value={isFootball ? draws.toString() : losses.toString()} color={isFootball ? "text-slate-600" : "text-red-600"} />
        <StatCard label="Win %" value={`${winRate}%`} color="text-violet-600" />
      </div>

      {/* 3. TABS */}
      <div className="mb-6">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(id) => setActiveTab(id as TabType)} 
        />
      </div>

      {/* 4. TAB CONTENT */}
      <div className="space-y-6">
        
        {/* -- OVERVIEW TAB -- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Recent Form */}
            <div>
              <SectionTitle>Recent Form</SectionTitle>
              {completedMatches.length === 0 ? (
                <div className="text-slate-400 italic">No matches played yet.</div>
              ) : (
                <div className="flex gap-3 items-center">
                  {completedMatches.slice(0, 5).map(m => {
                    let result = 'D';
                    let bgClass = 'bg-slate-100 text-slate-500';
                    
                    if (m.winnerId === team.id) { 
                        result = 'W'; 
                        bgClass = 'bg-green-100 text-green-700 border-green-200'; 
                    } else if (m.winnerId) { 
                        result = 'L'; 
                        bgClass = 'bg-red-100 text-red-700 border-red-200'; 
                    } else if (!m.winnerId && m.status === 'completed') {
                        result = 'D';
                        bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
                    }
                    
                    return (
                      <Link to={`/matches/${m.id}`} key={m.id}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border ${bgClass}`}>
                          {result}
                        </div>
                      </Link>
                    );
                  })}
                  <span className="text-xs text-slate-400 ml-2">Last 5 matches</span>
                </div>
              )}
            </div>

            {/* About Team */}
            <div>
              <SectionTitle>About Team</SectionTitle>
              <p className="text-slate-600 leading-relaxed max-w-3xl">
                {team.about || "No description available for this team."}
              </p>
            </div>

            {/* Active Tournaments (Mock) */}
            <div>
              <SectionTitle>Active Tournaments</SectionTitle>
              <Card className="p-4 flex justify-between items-center max-w-2xl">
                <div>
                  <div className="font-bold text-slate-900">City Championship 2024</div>
                  <div className="text-xs text-slate-500">League Stage</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">#2</div>
                  <div className="text-xs text-slate-400">Current Rank</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* -- SQUAD TAB -- */}
        {activeTab === 'squad' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {squad.map(member => (
              <Link to={`/players/${member.playerId}`} key={member.playerId}>
                <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 mb-1">
                      {member.name} {member.role === 'captain' && '©'} {member.role === 'vice-captain' && '(vc)'}
                    </div>
                    <div className="flex gap-2">
                      {member.role === 'captain' && <Badge text="Captain" className="bg-blue-100 text-blue-700" />}
                      {member.role === 'vice-captain' && <Badge text="Vice Captain" className="bg-blue-50 text-blue-600" />}
                      {member.role === 'member' && <Badge text="Player" className="bg-slate-100 text-slate-600" />}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* -- MATCHES TAB -- */}
        {activeTab === 'matches' && (
          <div className="space-y-8">
            
            {/* Upcoming */}
            <div>
              <SectionTitle>Upcoming Matches</SectionTitle>
              {upcomingMatches.length === 0 ? (
                <EmptyState 
                  icon={<Calendar size={48} />}
                  message="No upcoming matches scheduled." 
                />
              ) : (
                <div className="space-y-3">
                  {upcomingMatches.map(m => (
                    <Card key={m.id} className="p-4 flex justify-between items-center">
                       <div>
                         <div className="font-bold text-slate-900">vs {m.homeParticipant.id === team.id ? m.awayParticipant.name : m.homeParticipant.name}</div>
                         <div className="text-xs text-slate-500">{new Date(m.date).toLocaleDateString()}</div>
                       </div>
                       <div className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                         Upcoming
                       </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Recent */}
            <div>
              <SectionTitle>Recent Results</SectionTitle>
              {completedMatches.length === 0 ? (
                <EmptyState 
                  icon={<History size={48} />}
                  message="No completed matches." 
                />
              ) : (
                <div className="space-y-3">
                  {completedMatches.map(m => {
                     const isWin = m.winnerId === team.id;
                     const isDraw = !m.winnerId;
                     let badgeText = isWin ? 'WON' : 'LOST';
                     let badgeClass = isWin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
                     if (isDraw) {
                         badgeText = 'DRAW';
                         badgeClass = 'bg-slate-100 text-slate-600';
                     }

                     return (
                      <Link to={`/matches/${m.id}`} key={m.id}>
                        <Card className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div>
                            <div className="font-bold text-slate-900">
                              vs {m.homeParticipant.id === team.id ? m.awayParticipant.name : m.homeParticipant.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(m.date).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge 
                            text={badgeText} 
                            className={badgeClass} 
                          />
                        </Card>
                      </Link>
                     );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -- STATS TAB -- */}
        {activeTab === 'stats' && (
          isFootball ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-slate-50 border-slate-200">
                  <div className="text-sm font-bold text-slate-500 uppercase mb-4">Attack</div>
                  <div className="space-y-3">
                     <div className="flex justify-between">
                       <span className="text-slate-600">Goals Scored</span>
                       <span className="font-bold text-slate-900">{stats.goalsFor}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-600">Avg Goals / Match</span>
                       <span className="font-bold text-slate-900">{stats.avgGoals}</span>
                     </div>
                  </div>
                </Card>
                <Card className="p-6 bg-slate-50 border-slate-200">
                  <div className="text-sm font-bold text-slate-500 uppercase mb-4">Defense</div>
                  <div className="space-y-3">
                     <div className="flex justify-between">
                       <span className="text-slate-600">Goals Conceded</span>
                       <span className="font-bold text-slate-900">{stats.goalsAgainst}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-600">Clean Sheets</span>
                       <span className="font-bold text-slate-900">{stats.cleanSheets}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-600">Goal Difference</span>
                       <span className="font-bold text-slate-900">{stats.goalDifference > 0 ? `+${stats.goalDifference}` : stats.goalDifference}</span>
                     </div>
                  </div>
                </Card>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-slate-50 border-slate-200">
                  <div className="text-sm font-bold text-slate-500 uppercase mb-4">Team Batting</div>
                  <div className="space-y-3">
                     <div className="flex justify-between">
                       <span className="text-slate-600">Total Runs</span>
                       <span className="font-bold text-slate-900">{stats.runs}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-600">Avg / Match</span>
                       <span className="font-bold text-slate-900">{stats.avgRuns}</span>
                     </div>
                  </div>
                </Card>
                <Card className="p-6 bg-slate-50 border-slate-200">
                  <div className="text-sm font-bold text-slate-500 uppercase mb-4">Team Bowling</div>
                  <div className="space-y-3">
                     <div className="flex justify-between">
                       <span className="text-slate-600">Total Wickets</span>
                       <span className="font-bold text-slate-900">{stats.wickets}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-slate-600">Avg Wickets / Match</span>
                       <span className="font-bold text-slate-900">{stats.avgWickets}</span>
                     </div>
                  </div>
                </Card>
              </div>
          )
        )}

        {activeTab === 'achievements' && (
            <EmptyState message="No achievements yet." />
        )}

      </div>
    </PageContainer>
  );
};
