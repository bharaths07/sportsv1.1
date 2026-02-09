import React from 'react';
import { useGlobalState } from '../../app/AppProviders';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { FeaturedMatches } from './components/FeaturedMatches';
import { NewsSection } from './components/NewsSection';
import { ActivityFeed } from '../../components/ActivityFeed';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

export const HomeScreen: React.FC = () => {
  const { feedItems, currentUser } = useGlobalState();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader 
        title={`Welcome back, ${currentUser?.name || 'Guest'}`} 
        description="Your sports feed and upcoming matches"
      />

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <Card>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/create-match')}
            >
              Quick Match
            </Button>
            <Button 
              variant="secondary" 
              icon={<Plus size={18} />}
              onClick={() => navigate('/tournament/create')}
            >
              Create Tournament
            </Button>
          </div>
        </Card>
      </section>

      {/* Featured Matches Section */}
      <section className="mb-8">
        <div className="section-header">
          <h2 className="section-title">Upcoming Matches</h2>
        </div>
        <Card>
          <FeaturedMatches />
        </Card>
      </section>

      {/* News & Headlines */}
      <NewsSection />

      {/* Activity Feed */}
      <section className="mb-8">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
        </div>
        <Card>
          <ActivityFeed items={feedItems} />
        </Card>
      </section>

    </PageContainer>
  );
};
