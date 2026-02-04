import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../app/AppProviders';
import { BattingStat } from '../hooks/useStats';

interface BattingStatsTableProps {
  stats: BattingStat[];
  minQualification: boolean;
}

type SortField = 'runs' | 'average' | 'strikeRate' | 'highestScore' | 'innings' | 'matches';
type SortOrder = 'asc' | 'desc';

export const BattingStatsTable: React.FC<BattingStatsTableProps> = ({ stats, minQualification }) => {
  const { players } = useGlobalState();
  const [sortField, setSortField] = useState<SortField>('runs');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedStats = useMemo(() => {
    let data = [...stats];
    
    // Filter based on qualification (Example: > 0 runs or > 0 innings)
    if (minQualification) {
      // Basic rule: Must have played at least 2 innings or scored > 50 runs? 
      // User said "min innings / overs". Let's say min 1 inning for now if qualification is on.
      // Or maybe average calculation requires some minimums.
      // For V1, let's just hide those with 0 runs if qualification is on.
      data = data.filter(s => s.runs > 0);
    }

    return data.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [stats, sortField, sortOrder, minQualification]);

  const getPlayerName = (id: string) => {
    const player = players.find(p => p.id === id);
    return player ? player.name : 'Unknown Player';
  };

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #e2e8f0',
    fontSize: '13px',
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
    userSelect: 'none' as const
  };

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    color: '#334155'
  };

  return (
    <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <th style={thStyle}>Player</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('matches')}>Mat</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('innings')}>Inns</th>
            <th style={{...thStyle, textAlign: 'center', color: sortField === 'runs' ? '#0f172a' : '#64748b'}} onClick={() => handleSort('runs')}>Runs</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('highestScore')}>HS</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('average')}>Avg</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('strikeRate')}>SR</th>
            <th style={{...thStyle, textAlign: 'center'}}>100s</th>
            <th style={{...thStyle, textAlign: 'center'}}>50s</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                No batting stats available for current filters.
              </td>
            </tr>
          ) : (
            sortedStats.map((stat, index) => (
              <tr key={stat.playerId} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fcfcfc' }}>
                <td style={tdStyle}>
                  <Link to={`/player/${stat.playerId}`} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600 }}>
                    {getPlayerName(stat.playerId)}
                  </Link>
                </td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.matches}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.innings}</td>
                <td style={{...tdStyle, textAlign: 'center', fontWeight: 700}}>{stat.runs}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.highestScore}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.average}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.strikeRate}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.hundreds}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.fifties}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
