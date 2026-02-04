import React, { useState } from 'react';
import { StatsFilterBar } from './components/StatsFilterBar';
import { BattingStatsTable } from './components/BattingStatsTable';
import { BowlingStatsTable } from './components/BowlingStatsTable';
import { FieldingStatsTable } from './components/FieldingStatsTable';
import { TeamStatsTable } from './components/TeamStatsTable';
import { useStats, StatsFilters } from './hooks/useStats';

type TabType = 'batting' | 'bowling' | 'fielding' | 'teams';

export const StatsScreen: React.FC = () => {
  const [filters, setFilters] = useState<StatsFilters>({
    sportId: 's1', // Default Cricket
    format: 'all',
    timeRange: 'all_time',
    minQualification: false
  });

  const [activeTab, setActiveTab] = useState<TabType>('batting');

  const { battingStats, bowlingStats, fieldingStats, teamStats } = useStats(filters);

  const renderTabButton = (tab: TabType, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: '16px 24px',
        background: 'none',
        border: 'none',
        borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent',
        color: activeTab === tab ? '#0f172a' : '#64748b',
        fontWeight: activeTab === tab ? '700' : '600',
        cursor: 'pointer',
        fontSize: '15px',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* 1. Global Filter Bar (Sticky Top) */}
      <StatsFilterBar filters={filters} onFilterChange={setFilters} />

      {/* 2. Stats Category Tabs (Sticky Below Filter Bar) */}
      <div style={{
        position: 'sticky',
        top: '65px', // Approx height of filter bar
        zIndex: 10,
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        display: 'flex',
        gap: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        {renderTabButton('batting', 'Batting')}
        {renderTabButton('bowling', 'Bowling')}
        {renderTabButton('fielding', 'Fielding')}
        {renderTabButton('teams', 'Teams')}
      </div>

      {/* 3. Content Area */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {activeTab === 'batting' && 'Batting Statistics'}
            {activeTab === 'bowling' && 'Bowling Statistics'}
            {activeTab === 'fielding' && 'Fielding Statistics'}
            {activeTab === 'teams' && 'Team Standings'}
          </h2>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing {
              activeTab === 'batting' ? battingStats.length :
              activeTab === 'bowling' ? bowlingStats.length :
              activeTab === 'fielding' ? fieldingStats.length :
              teamStats.length
            } records
          </span>
        </div>

        {activeTab === 'batting' && (
          <BattingStatsTable stats={battingStats} minQualification={filters.minQualification} />
        )}
        {activeTab === 'bowling' && (
          <BowlingStatsTable stats={bowlingStats} minQualification={filters.minQualification} />
        )}
        {activeTab === 'fielding' && (
          <FieldingStatsTable stats={fieldingStats} minQualification={filters.minQualification} />
        )}
        {activeTab === 'teams' && (
          <TeamStatsTable stats={teamStats} minQualification={filters.minQualification} />
        )}
      </div>
    </div>
  );
};
