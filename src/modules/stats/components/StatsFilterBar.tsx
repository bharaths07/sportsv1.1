import React from 'react';
import { StatsFilters, StatFormat, TimeRange } from '../hooks/useStats';

interface StatsFilterBarProps {
  filters: StatsFilters;
  onFilterChange: (filters: StatsFilters) => void;
}

export const StatsFilterBar: React.FC<StatsFilterBarProps> = ({ filters, onFilterChange }) => {
  const updateFilter = (key: keyof StatsFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      {/* Sport Filter */}
      <select 
        value={filters.sportId}
        onChange={(e) => updateFilter('sportId', e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          backgroundColor: '#f8fafc',
          fontSize: '14px',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer'
        }}
      >
        <option value="s1">Cricket</option>
        <option value="s2">Football (Coming Soon)</option>
      </select>

      {/* Format Filter */}
      <select 
        value={filters.format}
        onChange={(e) => updateFilter('format', e.target.value as StatFormat)}
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          backgroundColor: '#f8fafc',
          fontSize: '14px',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer'
        }}
      >
        <option value="all">All Formats</option>
        <option value="t20">T20</option>
        <option value="odi">ODI</option>
        <option value="test">Test</option>
      </select>

      {/* Time Range Filter */}
      <select 
        value={filters.timeRange}
        onChange={(e) => updateFilter('timeRange', e.target.value as TimeRange)}
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          backgroundColor: '#f8fafc',
          fontSize: '14px',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer'
        }}
      >
        <option value="all_time">All Time</option>
        <option value="last_12_months">Last 12 Months</option>
      </select>

      {/* Qualification Toggle */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#475569',
        cursor: 'pointer',
        marginLeft: 'auto'
      }}>
        <input 
          type="checkbox" 
          checked={filters.minQualification}
          onChange={(e) => updateFilter('minQualification', e.target.checked)}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
        Min. Qualification
      </label>
    </div>
  );
};
