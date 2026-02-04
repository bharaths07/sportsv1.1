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
import { MyCertificatesScreen } from '../modules/certificates/MyCertificatesScreen';
import { TournamentScreen } from '../modules/tournament/TournamentScreen';
import { TeamListScreen } from '../modules/team/TeamListScreen';
import { StatsScreen } from '../modules/stats/StatsScreen';
import { TournamentListScreen } from '../modules/tournament/TournamentListScreen';
import { NotificationsScreen } from '../modules/system/NotificationsScreen';
import { SettingsScreen } from '../modules/system/SettingsScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { GameProfileScreen } from '../modules/profile/GameProfileScreen';
import { MyProfileDetailsScreen } from '../modules/profile/MyProfileDetailsScreen';

import { PlaceholderScreen } from '../components/PlaceholderScreen';
import { SearchResultsScreen } from '../modules/search/SearchResultsScreen';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
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
        <Route path="/profile/game/:sport" element={<GameProfileScreen />} />
        <Route path="/my-teams" element={<PlaceholderScreen />} />
        <Route path="/my-matches" element={<PlaceholderScreen />} />
        <Route path="/saved-matches" element={<PlaceholderScreen />} />
        
        {/* Management (Rule 4) */}
        <Route path="/create-match" element={<CreateMatchScreen />} />
        <Route path="/manage-matches" element={<PlaceholderScreen />} />
        <Route path="/venues" element={<PlaceholderScreen />} />
        <Route path="/officials" element={<PlaceholderScreen />} />
        
        {/* System (Rule 4) */}
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/help" element={<PlaceholderScreen />} />
        <Route path="/login" element={<PlaceholderScreen />} />

        {/* Existing Routes */}
        <Route path="/match/:id" element={<MatchSummaryScreen />} />
        <Route path="/match/:id/live" element={<LiveScoringScreen />} />
        <Route path="/player/:id" element={<PlayerProfileScreen />} />
        <Route path="/team/:id" element={<TeamScreen />} />
        <Route path="/tournament/:id" element={<TournamentScreen />} />
        <Route path="/my-certificates" element={<MyCertificatesScreen />} />
      </Route>
    </Routes>
  );
};
