import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { HomeScreen } from '../modules/home/HomeScreen';
import { MatchSummaryScreen } from '../modules/match/MatchSummaryScreen';
import { LiveScoringScreen } from '../modules/match/LiveScoringScreen';
import { PlayerProfileScreen } from '../modules/player/PlayerProfileScreen';
import { TeamScreen } from '../modules/team/TeamScreen';
import { CreateMatchScreen } from '../modules/createMatch/CreateMatchScreen';
import { MyCertificatesScreen } from '../modules/certificates/MyCertificatesScreen';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/create-match" element={<CreateMatchScreen />} />
        <Route path="/match/:id" element={<MatchSummaryScreen />} />
        <Route path="/match/:id/live" element={<LiveScoringScreen />} />
        <Route path="/player/:id" element={<PlayerProfileScreen />} />
        <Route path="/team/:id" element={<TeamScreen />} />
        <Route path="/my-certificates" element={<MyCertificatesScreen />} />
      </Route>
    </Routes>
  );
};
