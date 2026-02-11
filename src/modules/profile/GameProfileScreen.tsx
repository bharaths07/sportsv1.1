import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Share2, QrCode, SlidersHorizontal, Trophy, Award, ChevronLeft } from 'lucide-react';
import { MatchCard } from '../match/components/MatchCard';
import { BattingSummaryCard, BowlingSummaryCard, FieldingSummaryCard, FootballSummaryCard } from './components/StatsCards';
import { TrophiesTab, BadgesTab } from './components/AchievementCards';
import { TeamsTab } from './components/TeamCards';
import { MediaTabs } from './components/MediaTabs';
import { useGlobalState } from '../../app/AppProviders';
import { Avatar } from '../../components/ui/Avatar';

type Tab = 'matches' | 'stats' | 'trophies' | 'teams' | 'highlights' | 'photos' | 'badges';

export const GameProfileScreen = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, players, matches } = useGlobalState();
  
  // Logic to determine if we are viewing "my" profile or someone else's
  // If route is /profile/cricket/me, userId is undefined, but we treat it as current user
  // If route is /profile/cricket/:userId, we check if userId matches currentUser.id
  const isMeRoute = !userId; 
  // In a real app, we would fetch player data based on userId or currentUser.id
  const player = isMeRoute 
    ? players.find(p => p.userId === currentUser?.id)
    : players.find(p => p.id === userId);
  
  // If isMeRoute is true, we are the owner. 
  // If userId is present, we check if it matches current user's ID
  const isOwner = isMeRoute || (currentUser && player && player.userId === currentUser.id);

  const playerMatches = player ? matches.filter(m => 
    m.homeParticipant.players?.some(p => p.playerId === player.id) ||
    m.awayParticipant.players?.some(p => p.playerId === player.id)
  ) : [];

  const activeTab = (searchParams.get('tab') as Tab) || 'matches';

  const handleTabChange = (tab: Tab) => {
    setSearchParams({ tab });
  };

  if (!player) {
    return <div className="p-4 text-center">Player not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Header Section */}
      <div className="relative bg-gradient-to-br from-red-600 to-red-800 pb-0 pt-safe-top text-white">
        {/* Top Actions Container */}
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20">
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <button className="rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20">
                <QrCode className="h-5 w-5 text-white" />
              </button>
              <button className="rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20">
                <Share2 className="h-5 w-5 text-white" />
              </button>
              <button className="cursor-not-allowed rounded-full bg-white/5 p-2 backdrop-blur-sm opacity-50">
                <SlidersHorizontal className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content Container (Step A & B) */}
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 sm:px-5 lg:px-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Identity (60% approx) */}
            <div className="col-span-12 flex flex-col items-start md:col-span-7 lg:col-span-8">
              <div className="flex w-full flex-col items-start sm:flex-row sm:items-center sm:space-x-6">
                {/* Avatar */}
                <div className="relative mb-4 sm:mb-0">
                  <Avatar 
                    src={player.cricketAvatarUrl || player.avatarUrl} 
                    fallback={`${player.firstName[0]}${player.lastName[0]}`}
                    className="h-24 w-24 border-4 border-white/20 shadow-xl sm:h-28 sm:w-28 lg:h-32 lg:w-32 text-3xl font-bold bg-white/10 text-white"
                  />
                  {isOwner && (
                    <button className="absolute bottom-0 right-0 rounded-full bg-gray-900/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm z-10">
                      EDIT
                    </button>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h1 className="text-[22px] font-bold text-white sm:text-3xl lg:text-4xl">{`${player.firstName} ${player.lastName}`}</h1>
                  
                  {/* Meta Line 1: Location & Views */}
                  <div className="mt-2 flex items-center space-x-3 text-sm font-medium text-red-100/90">
                    {player.location && (
                      <span className="flex items-center">
                        {player.location}
                      </span>
                    )}
                    {player.profileViews && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-red-200/50" />
                        <span>{player.profileViews} views</span>
                      </>
                    )}
                  </div>

                  {/* Meta Line 2: Roles */}
                  <div className="mt-1 flex items-center space-x-1 text-xs text-red-100/80 sm:text-sm">
                    <span>{player.role}</span>
                    {player.battingStyle && (
                      <>
                        <span>,</span>
                        <span>{player.battingStyle}</span>
                      </>
                    )}
                    {player.bowlingStyle && (
                      <>
                        <span>,</span>
                        <span>{player.bowlingStyle}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Row - Vertical on Mobile, Horizontal on Tablet/Desktop */}
              <div className="mt-6 flex w-full flex-col space-y-3 sm:ml-[136px] sm:w-auto sm:flex-row sm:space-x-3 sm:space-y-0 lg:ml-[152px]">
                <button className="flex w-full items-center justify-center space-x-2 rounded-lg border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:w-auto">
                  <Trophy className="h-4 w-4" />
                  <span>Top Players</span>
                </button>
                <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-red-700 shadow-lg transition-transform active:scale-95 sm:w-auto">
                  <Award className="h-4 w-4" />
                  <span>Insights</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Space (40% approx) - Hidden on mobile, visible on md+ */}
            <div className="hidden md:col-span-5 md:block lg:col-span-4">
              <div className="h-full w-full rounded-xl bg-white/5 backdrop-blur-sm">
                {/* Placeholder for future stadium image or pattern */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation (Step C) */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-5 lg:px-6">
          <div className="flex overflow-x-auto scrollbar-hide sm:justify-center lg:justify-start">
            {[
              { id: 'matches', label: 'Matches', count: 12 },
              { id: 'stats', label: 'Stats' },
              { id: 'trophies', label: 'Trophies', count: player.trophies?.length || 0, countColor: 'bg-yellow-100 text-yellow-700' },
              { id: 'badges', label: 'Badges', count: player.badges?.length || 0, countColor: 'bg-purple-100 text-purple-700' },
              { id: 'teams', label: 'Teams' },
              { id: 'highlights', label: 'Highlights' },
              { id: 'photos', label: 'Photos', count: player.photos?.length || 0, countColor: 'bg-green-100 text-green-700' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => handleTabChange(tab.id as Tab)}
                className={`flex min-w-fit items-center space-x-2 border-b-2 px-4 py-4 text-[13px] font-medium transition-colors sm:text-sm lg:text-[15px] ${
                  activeTab === tab.id 
                    ? 'border-red-600 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className={activeTab === tab.id ? 'font-bold' : ''}>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`rounded-full px-2 py-0.5 text-xs ${tab.countColor || 'bg-gray-100 text-gray-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Tab Content Container (Step D) */}
      <div className="mx-auto min-h-[400px] max-w-[1200px] px-4 py-6 sm:px-5 lg:px-6">
        {activeTab === 'matches' && (
          <div className="space-y-4">
            {playerMatches.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No matches played yet.</p>
              </div>
            ) : (
              playerMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Career Stats</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BattingSummaryCard stats={player.stats.batting} />
              <BowlingSummaryCard stats={player.stats.bowling} />
              <FieldingSummaryCard stats={player.stats.fielding} />
              <FootballSummaryCard stats={player.stats.football} />
            </div>
          </div>
        )}

        {activeTab === 'trophies' && (
          <div>
            <TrophiesTab trophies={player.trophies} />
          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            <BadgesTab badges={player.badges} />
          </div>
        )}

        {activeTab === 'teams' && (
          <TeamsTab currentTeam={player.currentTeam} pastTeams={player.pastTeams} />
        )}

        {activeTab === 'highlights' && (
          <MediaTabs 
            highlights={player.highlights || []} 
            photos={[]} 
            activeTab="highlights" 
          />
        )}

        {activeTab === 'photos' && (
          <MediaTabs 
            highlights={[]} 
            photos={player.photos || []} 
            activeTab="photos" 
          />
        )}
      </div>
    </div>
  );
};
