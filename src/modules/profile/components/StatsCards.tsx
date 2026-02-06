import React from 'react';
import { BattingStats, BowlingStats, FieldingStats } from '../../../domain/player';

interface StatsCardProps {
  title: string;
  children: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, children }) => {
  return (
    <div className="mb-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:mb-5 sm:p-5">
      <div className="mb-4 text-base font-bold text-slate-900">
        {title}
      </div>
      {children}
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string | number | undefined;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="mb-1 font-mono text-xl font-bold tabular-nums text-slate-900">
      {value !== undefined && value !== null ? value : '—'}
    </span>
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </span>
  </div>
);

const GridContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 gap-x-2 gap-y-5 md:grid-cols-3">
    {children}
  </div>
);

// --- Specific Cards ---

export const BattingSummaryCard: React.FC<{ stats?: BattingStats }> = ({ stats }) => {
  if (!stats) return null;
  return (
    <StatsCard title="Batting">
      <GridContainer>
        <StatItem label="Matches" value={stats.matches} />
        <StatItem label="Runs" value={stats.runs} />
        <StatItem label="Average" value={stats.average} />
        <StatItem label="Strike Rate" value={stats.strikeRate} />
        <StatItem label="Highest" value={stats.highestScore} />
        <StatItem label="50s/100s" value={`${stats.fifties}/${stats.hundreds}`} />
      </GridContainer>
    </StatsCard>
  );
};

export const BowlingSummaryCard: React.FC<{ stats?: BowlingStats }> = ({ stats }) => {
  if (!stats) return null;
  return (
    <StatsCard title="Bowling">
      <GridContainer>
        <StatItem label="Matches" value={stats.matches} />
        <StatItem label="Wickets" value={stats.wickets} />
        <StatItem label="Economy" value={stats.economy} />
        <StatItem label="Average" value={stats.average} />
        <StatItem label="Best" value={stats.bestFigures} />
        <StatItem label="3w/5w" value={`${stats.threeWickets}/${stats.fiveWickets}`} />
      </GridContainer>
    </StatsCard>
  );
};

export const FieldingSummaryCard: React.FC<{ stats?: FieldingStats }> = ({ stats }) => {
  if (!stats) return null;
  return (
    <StatsCard title="Fielding">
      <GridContainer>
        <StatItem label="Catches" value={stats.catches} />
        <StatItem label="Run Outs" value={stats.runOuts} />
        <StatItem label="Stumpings" value={stats.stumpings} />
      </GridContainer>
    </StatsCard>
  );
};

export const FormatSelector: React.FC = () => {
  const formats = [
    { label: 'Overall', active: true },
    { label: 'T10', active: false },
    { label: 'T20', active: false },
    { label: 'ODI', active: false }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      marginBottom: '20px',
      overflowX: 'auto',
      paddingBottom: '4px'
    }}>
      {formats.map(fmt => (
        <button
          key={fmt.label}
          disabled={!fmt.active}
          style={{
            padding: '8px 16px',
            borderRadius: '99px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: fmt.active ? 'pointer' : 'default',
            backgroundColor: fmt.active ? '#0f172a' : '#f1f5f9',
            color: fmt.active ? 'white' : '#94a3b8',
            transition: 'all 0.2s'
          }}
        >
          {fmt.label}
        </button>
      ))}
    </div>
  );
};
