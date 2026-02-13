import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useGlobalState } from '../app/AppProviders';
import { MainLayout } from '../components/MainLayout';
import { HomeScreen } from '../modules/home/HomeScreen';
import { LiveScreen } from '../modules/live/LiveScreen';
import { MatchSummaryScreen } from '../modules/match/MatchSummaryScreen';
import { MatchesScreen } from '../modules/match/MatchesScreen';
import { LiveScoringScreen } from '../modules/match/LiveScoringScreen';
import { PlayerProfileScreen } from '../modules/player/PlayerProfileScreen';
import { TeamScreen } from '../modules/team/TeamScreen';
import { CreateMatchScreen } from '../modules/createMatch/CreateMatchScreen';
import { SelectTeamsScreen } from '../modules/createMatch/SelectTeamsScreen';
import { SelectGameScreen } from '../modules/createMatch/SelectGameScreen';
import { TeamSelectionScreen } from '../modules/createMatch/TeamSelectionScreen';
import { TossScreen } from '../modules/createMatch/TossScreen';
import { SquadSelectionScreen } from '../modules/createMatch/SquadSelectionScreen';
import { SelectOpenersScreen } from '../modules/createMatch/SelectOpenersScreen';
import { AddPlayerOptionsScreen } from '../modules/createMatch/AddPlayerOptionsScreen';
import { MyCertificatesScreen } from '../modules/certificates/MyCertificatesScreen';
import { TournamentScreen } from '../modules/tournament/TournamentScreen';
import { TeamListScreen } from '../modules/team/TeamListScreen';
import { CreateTeamScreen } from '../modules/team/CreateTeamScreen';
import { SelectTeamGameScreen } from '../modules/team/SelectTeamGameScreen';
import { StatsScreen } from '../modules/stats/StatsScreen';
import { TournamentListScreen } from '../modules/tournament/TournamentListScreen';
import { CreateTournamentScreen } from '../modules/tournament/CreateTournamentScreen';
import { SelectTournamentGameScreen } from '../modules/tournament/SelectTournamentGameScreen';
import { TournamentTeamsScreen } from '../modules/tournament/TournamentTeamsScreen';
import { TournamentStructureScreen } from '../modules/tournament/TournamentStructureScreen';
import { TournamentScheduleScreen } from '../modules/tournament/TournamentScheduleScreen';
import { TournamentAutoScheduleScreen } from '../modules/tournament/TournamentAutoScheduleScreen';
import { NotificationsScreen } from '../modules/system/NotificationsScreen';
import { SettingsScreen } from '../modules/system/SettingsScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { GameProfileScreen } from '../modules/profile/GameProfileScreen';
import { MyProfileDetailsScreen } from '../modules/profile/MyProfileDetailsScreen';
import { EditProfileScreen } from '../modules/profile/EditProfileScreen';
import { PublicProfileScreen } from '../modules/profile/PublicProfileScreen';
import { MyQRCodeScreen } from '../modules/profile/MyQRCodeScreen';
import { SocialFeedScreen } from '../modules/social/SocialFeedScreen';
import { CertificateGeneratorScreen } from '../modules/certificates/CertificateGeneratorScreen';
import { PosterGeneratorScreen } from '../modules/posters/PosterGeneratorScreen';

import { ComingSoonScreen } from '../components/ComingSoonScreen';
import { PlaceholderScreen } from '../components/PlaceholderScreen';
import { SearchResultsScreen } from '../modules/search/SearchResultsScreen';

import { LoginPage } from '../modules/auth/LoginPage';
import { DualPanelLoginScreen } from '../modules/auth/DualPanelLoginScreen';
import { OtpVerificationScreen } from '../modules/auth/OtpVerificationScreen';
import { AuthSuccessScreen } from '../modules/auth/AuthSuccessScreen';
import { AuthCallbackScreen } from '../modules/auth/AuthCallbackScreen';

import { VenuesScreen } from '../modules/system/VenuesScreen';
import { OfficialsScreen } from '../modules/system/OfficialsScreen';
import { MyTeamsScreen } from '../modules/team/MyTeamsScreen';
import { MyMatchesScreen } from '../modules/match/MyMatchesScreen';
import { SavedMatchesScreen } from '../modules/match/SavedMatchesScreen';
import { SavedTournamentsScreen } from '../modules/tournament/SavedTournamentsScreen';

// 🔐 Auth Guard Component
const ProtectedRoute = () => {
  const { currentUser } = useGlobalState();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout><Outlet /></MainLayout>;
};

// 🔓 Public Route Component (redirects to home if already logged in)
const PublicRoute = () => {
  const { currentUser } = useGlobalState();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-email" element={<DualPanelLoginScreen />} />
        <Route path="/auth/verify" element={<OtpVerificationScreen />} />
        <Route path="/auth/callback" element={<AuthCallbackScreen />} />
      </Route>

      {/* 🔐 Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/auth/success" element={<AuthSuccessScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/live" element={<LiveScreen />} />
        
        {/* Top Nav Destinations */}
        <Route path="/matches" element={<MatchesScreen />} />
        <Route path="/tournaments" element={<TournamentListScreen />} />
        <Route path="/teams" element={<TeamListScreen />} />
        <Route path="/stats" element={<StatsScreen />} />
        <Route path="/leaderboards" element={<StatsScreen />} />
        
        {/* Search Results */}
        <Route path="/search" element={<SearchResultsScreen />} />

        <Route path="/my-teams" element={<MyTeamsScreen />} />
        <Route path="/my-matches" element={<MyMatchesScreen />} />
        <Route path="/saved-matches" element={<SavedMatchesScreen />} />
        <Route path="/saved-tournaments" element={<SavedTournamentsScreen />} />
        
        {/* Management */}
        <Route path="/start-match" element={<SelectGameScreen />} />
        <Route path="/start-match/select-teams" element={<SelectTeamsScreen />} />
        <Route path="/start-match/select-team/:slot" element={<TeamSelectionScreen />} />
        <Route path="/start-match/setup" element={<CreateMatchScreen />} />
        <Route path="/start-match/toss" element={<TossScreen />} />
        <Route path="/start-match/squads" element={<SquadSelectionScreen />} />
        <Route path="/start-match/openers" element={<SelectOpenersScreen />} />
        <Route path="/start-match/add-player" element={<AddPlayerOptionsScreen />} />
        <Route path="/create-match" element={<CreateMatchScreen />} />
        <Route path="/teams/create" element={<SelectTeamGameScreen />} />
        <Route path="/teams/setup" element={<CreateTeamScreen />} />
        <Route path="/tournament/create" element={<SelectTournamentGameScreen />} />
        <Route path="/tournament/setup" element={<CreateTournamentScreen />} />
        <Route path="/manage-matches" element={<MyMatchesScreen />} />
        <Route path="/venues" element={<VenuesScreen />} />
        <Route path="/officials" element={<OfficialsScreen />} />
        
        {/* System */}
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/social" element={<SocialFeedScreen />} />
        
        {/* Profile Routes */}
        <Route path="/u/:username" element={<PublicProfileScreen />} />
        <Route path="/profile/me" element={<MyProfileDetailsScreen />} />
        <Route path="/profile/game" element={<GameProfileScreen />} />
        <Route path="/profile/qr" element={<MyQRCodeScreen />} />
        <Route path="/profile/edit" element={<EditProfileScreen />} />
        <Route path="/profile/:userId" element={<ProfileScreen />} />
        
        {/* Certificates & Posters */}
        <Route path="/certificates" element={<MyCertificatesScreen />} />
        <Route path="/certificates/generate" element={<CertificateGeneratorScreen />} />
        <Route path="/posters/generate" element={<PosterGeneratorScreen />} />

        {/* Dynamic Routes */}
        <Route path="/matches/:matchId" element={<MatchSummaryScreen />} />
        <Route path="/matches/:matchId/score" element={<LiveScoringScreen />} />
        <Route path="/players/:playerId" element={<PlayerProfileScreen />} />
        <Route path="/team/:teamId" element={<TeamScreen />} />
        <Route path="/tournaments/:tournamentId" element={<TournamentScreen />} />
        <Route path="/tournaments/:tournamentId/teams" element={<TournamentTeamsScreen />} />
        <Route path="/tournaments/:tournamentId/structure" element={<TournamentStructureScreen />} />
        <Route path="/tournaments/:tournamentId/schedule" element={<TournamentScheduleScreen />} />
        <Route path="/tournaments/:tournamentId/auto-schedule" element={<TournamentAutoScheduleScreen />} />
        
        {/* Placeholders for New Features */}
        <Route path="/top-players" element={<ComingSoonScreen title="Top Players" />} />
        <Route path="/insights" element={<ComingSoonScreen title="Insights" />} />
        <Route path="/coming-soon" element={<ComingSoonScreen title="Coming Soon" />} />
        <Route path="/messages/:id" element={<ComingSoonScreen title="Messages" />} />
        <Route path="/media/:id" element={<ComingSoonScreen title="Media Viewer" />} />
        <Route path="/matches/:matchId/insights" element={<ComingSoonScreen title="Match Insights" />} />
        <Route path="/matches/:matchId/table" element={<ComingSoonScreen title="Points Table" />} />
        <Route path="/matches/:matchId/leaderboard" element={<ComingSoonScreen title="Leaderboard" />} />

        {/* Fallback */}
        <Route path="*" element={<PlaceholderScreen title="Page Not Found" />} />
      </Route>
    </Routes>
  );
};
