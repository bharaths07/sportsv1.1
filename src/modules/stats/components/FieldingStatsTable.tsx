import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../app/AppProviders';
import { FieldingStat } from '../hooks/useStats';

interface FieldingStatsTableProps {
  stats: FieldingStat[];
  minQualification: boolean;
}

type SortField = 'totalDismissals' | 'catches' | 'runouts' | 'stumpings' | 'matches';
type SortOrder = 'asc' | 'desc';

export const FieldingStatsTable: React.FC<FieldingStatsTableProps> = ({ stats, minQualification }) => {
  const { players } = useGlobalState();
  const [sortField, setSortField] = useState<SortField>('totalDismissals');
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
    
    // Default: Hide if no data exists (Total dismissals = 0)
    data = data.filter(s => s.totalDismissals > 0);

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
            <th style={{...thStyle, textAlign: 'center', color: sortField === 'totalDismissals' ? '#0f172a' : '#64748b'}} onClick={() => handleSort('totalDismissals')}>Dismissals</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('catches')}>Catches</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('runouts')}>Run Outs</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('stumpings')}>Stumpings</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                No fielding stats available.
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
                <td style={{...tdStyle, textAlign: 'center', fontWeight: 700}}>{stat.totalDismissals}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.catches}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.runouts}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.stumpings}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
