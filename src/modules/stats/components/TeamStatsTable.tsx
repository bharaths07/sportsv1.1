import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../app/AppProviders';
import { TeamStat } from '../hooks/useStats';

interface TeamStatsTableProps {
  stats: TeamStat[];
  minQualification: boolean;
}

type SortField = 'winPercentage' | 'wins' | 'matches' | 'avgRunsScored';
type SortOrder = 'asc' | 'desc';

export const TeamStatsTable: React.FC<TeamStatsTableProps> = ({ stats, minQualification }) => {
  const { teams } = useGlobalState();
  const [sortField, setSortField] = useState<SortField>('winPercentage');
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
    
    if (minQualification) {
      // Example: Min 1 match
      data = data.filter(s => s.matches > 0);
    }

    return data.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [stats, sortField, sortOrder, minQualification]);

  const getTeamName = (id: string) => {
    const team = teams.find(t => t.id === id);
    return team ? team.name : 'Unknown Team';
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
            <th style={thStyle}>Team</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('matches')}>Mat</th>
            <th style={{...thStyle, textAlign: 'center', color: '#166534'}} onClick={() => handleSort('wins')}>Won</th>
            <th style={{...thStyle, textAlign: 'center', color: '#991b1b'}}>Lost</th>
            <th style={{...thStyle, textAlign: 'center', color: sortField === 'winPercentage' ? '#0f172a' : '#64748b'}} onClick={() => handleSort('winPercentage')}>Win %</th>
            <th style={{...thStyle, textAlign: 'center'}} onClick={() => handleSort('avgRunsScored')}>Avg Score</th>
            <th style={{...thStyle, textAlign: 'center'}}>Avg Conceded</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                No team stats available.
              </td>
            </tr>
          ) : (
            sortedStats.map((stat, index) => (
              <tr key={stat.teamId} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#fcfcfc' }}>
                <td style={tdStyle}>
                  <Link to={`/team/${stat.teamId}`} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600 }}>
                    {getTeamName(stat.teamId)}
                  </Link>
                </td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.matches}</td>
                <td style={{...tdStyle, textAlign: 'center', color: '#166534', fontWeight: 600}}>{stat.wins}</td>
                <td style={{...tdStyle, textAlign: 'center', color: '#991b1b', fontWeight: 600}}>{stat.losses}</td>
                <td style={{...tdStyle, textAlign: 'center', fontWeight: 700}}>{stat.winPercentage}%</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.avgRunsScored}</td>
                <td style={{...tdStyle, textAlign: 'center'}}>{stat.avgRunsConceded}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
