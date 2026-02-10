import React from 'react';
import { useGlobalState } from '../../app/AppProviders';
import { PageContainer } from '../../components/layout/PageContainer';
import { FeaturedMatches } from './components/FeaturedMatches';
import { ActivityFeed } from '../../components/ActivityFeed';

export const HomeScreen: React.FC = () => {
  const { feedItems, currentUser } = useGlobalState();

  return (
    <PageContainer>
      {/* Greeting Section (Hero Lite) */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {currentUser?.name || 'Guest'} 👋
        </h1>
        <p className="text-slate-500 mt-1 text-lg">Here’s what’s happening in sports today</p>
      </div>

      {/* Upcoming Matches Section (Primary Focus) */}
      <section className="mb-12">
        <FeaturedMatches />
      </section>

      {/* Recent Activity Section (Secondary) */}
      <section className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
        </div>
        <ActivityFeed items={feedItems} />
      </section>

    </PageContainer>
  );
};
