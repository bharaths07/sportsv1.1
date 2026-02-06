import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { AddPlayerOptionsScreen } from '../modules/createMatch/AddPlayerOptionsScreen';
import { MyCertificatesScreen } from '../modules/certificates/MyCertificatesScreen';
import { TournamentScreen } from '../modules/tournament/TournamentScreen';
import { TeamListScreen } from '../modules/team/TeamListScreen';
import { CreateTeamScreen } from '../modules/team/CreateTeamScreen';
import { StatsScreen } from '../modules/stats/StatsScreen';
import { TournamentListScreen } from '../modules/tournament/TournamentListScreen';
import { CreateTournamentScreen } from '../modules/tournament/CreateTournamentScreen';
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
import { SocialFeedScreen } from '../modules/social/SocialFeedScreen';
import { CertificateGeneratorScreen } from '../modules/certificates/CertificateGeneratorScreen';
import { PosterGeneratorScreen } from '../modules/posters/PosterGeneratorScreen';

import { PlaceholderScreen } from '../components/PlaceholderScreen';
import { SearchResultsScreen } from '../modules/search/SearchResultsScreen';

import { LoginScreen } from '../modules/auth/LoginScreen';
import { AuthCallbackScreen } from '../modules/auth/AuthCallbackScreen';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/auth/callback" element={<AuthCallbackScreen />} />
      <Route path="/" element={<MainLayout />}>
        {/* Rule 2: App opens on Live (HomeScreen) */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/live" element={<LiveScreen />} />
        
        {/* Top Nav Destinations (Rule 3) */}
        <Route path="/matches" element={<MatchesScreen />} />
        <Route path="/tournaments" element={<TournamentListScreen />} />
        <Route path="/teams" element={<TeamListScreen />} />
        <Route path="/stats" element={<StatsScreen />} />
        
        {/* Search Results */}
        <Route path="/search" element={<SearchResultsScreen />} />

        {/* Side Menu Actions & Personal Areas (Rule 4) */}
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/me" element={<MyProfileDetailsScreen />} />
        <Route path="/profile/edit" element={<EditProfileScreen />} />
        
        {/* Game Profiles (Cricket) */}
        <Route path="/profile/cricket/me" element={<GameProfileScreen />} />
        <Route path="/profile/cricket/:userId" element={<GameProfileScreen />} />
        
        {/* Fallback for legacy or other sports */}
        <Route path="/profile/game/:sport" element={<GameProfileScreen />} />

        <Route path="/my-teams" element={<PlaceholderScreen />} />
        <Route path="/my-matches" element={<PlaceholderScreen />} />
        <Route path="/saved-matches" element={<PlaceholderScreen />} />
        <Route path="/saved-tournaments" element={<PlaceholderScreen />} />
        
        {/* Management (Rule 4) */}
        <Route path="/start-match" element={<SelectGameScreen />} />
        <Route path="/start-match/select-teams" element={<SelectTeamsScreen />} />
        <Route path="/start-match/select-team/:slot" element={<TeamSelectionScreen />} />
        <Route path="/start-match/setup" element={<CreateMatchScreen />} />
        <Route path="/start-match/toss" element={<TossScreen />} />
        <Route path="/start-match/squads" element={<SquadSelectionScreen />} />
        <Route path="/start-match/add-player" element={<AddPlayerOptionsScreen />} />
        <Route path="/create-match" element={<CreateMatchScreen />} />
        <Route path="/tournament/create" element={<CreateTournamentScreen />} />
        <Route path="/manage-matches" element={<PlaceholderScreen />} />
        <Route path="/venues" element={<PlaceholderScreen />} />
        <Route path="/officials" element={<PlaceholderScreen />} />
        
        {/* System (Rule 4) */}
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/help" element={<PlaceholderScreen />} />
        
        {/* Existing Routes */}
        <Route path="/match/:id" element={<MatchSummaryScreen />} />
        <Route path="/match/:id/live" element={<LiveScoringScreen />} />
        <Route path="/player/:id" element={<PlayerProfileScreen />} />
        <Route path="/team/:id" element={<TeamScreen />} />
        <Route path="/team/create" element={<CreateTeamScreen />} />
        <Route path="/tournament/:id" element={<TournamentScreen />} />
        <Route path="/tournament/:id/schedule/auto" element={<TournamentAutoScheduleScreen />} />
        <Route path="/tournament/:tournamentId/teams" element={<TournamentTeamsScreen />} />
        <Route path="/tournament/:id/structure" element={<TournamentStructureScreen />} />
        <Route path="/tournament/:id/schedule" element={<TournamentScheduleScreen />} />
        <Route path="/tournament/:id/schedule/auto" element={<TournamentAutoScheduleScreen />} />
        <Route path="/certificates" element={<MyCertificatesScreen />} />
        
        {/* Social & Creative Tools */}
        <Route path="/feed" element={<SocialFeedScreen />} />
        <Route path="/certificates/create" element={<CertificateGeneratorScreen />} />
        <Route path="/posters/create" element={<PosterGeneratorScreen />} />
      </Route>
    </Routes>
  );
};
