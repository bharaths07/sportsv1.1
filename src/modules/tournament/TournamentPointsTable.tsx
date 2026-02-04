import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TeamStats {
  id: string;
  position: number;
  teamName: string;
  teamCode: string;
  matchesPlayed: number;
  won: number;
  lost: number;
  points: number;
  nrr: string;
  status: 'qualified' | 'contention' | 'eliminated';
  flagUrl?: string;
}

interface GroupTable {
  groupName: string;
  qualificationRule: string; // e.g., "Top 2 qualify for Semi-Finals"
  cutoffPosition: number; // e.g., 2
  teams: TeamStats[];
}

const MOCK_POINTS_DATA: GroupTable[] = [
  {
    groupName: "Group A",
    qualificationRule: "Top 2 qualify for Semi-Finals",
    cutoffPosition: 2,
    teams: [
      { id: 't1', position: 1, teamName: 'India', teamCode: 'IND', matchesPlayed: 4, won: 4, lost: 0, points: 8, nrr: '+2.104', status: 'qualified', flagUrl: 'https://placehold.co/40x40/ff9933/ffffff?text=IND' },
      { id: 't2', position: 2, teamName: 'Australia', teamCode: 'AUS', matchesPlayed: 4, won: 3, lost: 1, points: 6, nrr: '+1.450', status: 'qualified', flagUrl: 'https://placehold.co/40x40/ffcc00/000000?text=AUS' },
      { id: 't3', position: 3, teamName: 'Pakistan', teamCode: 'PAK', matchesPlayed: 4, won: 2, lost: 2, points: 4, nrr: '-0.200', status: 'eliminated', flagUrl: 'https://placehold.co/40x40/006600/ffffff?text=PAK' },
      { id: 't4', position: 4, teamName: 'Ireland', teamCode: 'IRE', matchesPlayed: 4, won: 1, lost: 3, points: 2, nrr: '-1.100', status: 'eliminated', flagUrl: 'https://placehold.co/40x40/009e49/ffffff?text=IRE' },
      { id: 't5', position: 5, teamName: 'USA', teamCode: 'USA', matchesPlayed: 4, won: 0, lost: 4, points: 0, nrr: '-2.500', status: 'eliminated', flagUrl: 'https://placehold.co/40x40/3c3b6e/ffffff?text=USA' },
    ]
  },
  {
    groupName: "Group B",
    qualificationRule: "Top 2 qualify for Semi-Finals",
    cutoffPosition: 2,
    teams: [
      { id: 't6', position: 1, teamName: 'South Africa', teamCode: 'SA', matchesPlayed: 3, won: 3, lost: 0, points: 6, nrr: '+1.800', status: 'qualified', flagUrl: 'https://placehold.co/40x40/007749/ffffff?text=SA' },
      { id: 't7', position: 2, teamName: 'England', teamCode: 'ENG', matchesPlayed: 3, won: 2, lost: 1, points: 4, nrr: '+0.900', status: 'contention', flagUrl: 'https://placehold.co/40x40/ce1124/ffffff?text=ENG' },
      { id: 't8', position: 3, teamName: 'West Indies', teamCode: 'WI', matchesPlayed: 3, won: 2, lost: 1, points: 4, nrr: '+0.850', status: 'contention', flagUrl: 'https://placehold.co/40x40/7b0028/ffffff?text=WI' },
      { id: 't9', position: 4, teamName: 'Bangladesh', teamCode: 'BAN', matchesPlayed: 3, won: 0, lost: 3, points: 0, nrr: '-1.500', status: 'eliminated', flagUrl: 'https://placehold.co/40x40/006a4e/ffffff?text=BAN' },
      { id: 't10', position: 5, teamName: 'Netherlands', teamCode: 'NED', matchesPlayed: 3, won: 0, lost: 3, points: 0, nrr: '-2.100', status: 'eliminated', flagUrl: 'https://placehold.co/40x40/ff8200/ffffff?text=NED' },
    ]
  }
];

const StatusLabel: React.FC<{ status: TeamStats['status'] }> = ({ status }) => {
  switch (status) {
    case 'qualified':
      return (
        <span style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 700, 
          color: '#15803d', backgroundColor: '#dcfce7',
          padding: '2px 8px', borderRadius: '12px'
        }}>
          ✅ Qualified
        </span>
      );
    case 'contention':
      return (
        <span style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 700, 
          color: '#b45309', backgroundColor: '#fef3c7',
          padding: '2px 8px', borderRadius: '12px'
        }}>
          ⚠️ In Contention
        </span>
      );
    case 'eliminated':
      return (
        <span style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 700, 
          color: '#991b1b', backgroundColor: '#fee2e2',
          padding: '2px 8px', borderRadius: '12px'
        }}>
          ❌ Eliminated
        </span>
      );
    default:
      return null;
  }
};

export const TournamentPointsTable: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '900px', margin: '0 auto' }}>
      {MOCK_POINTS_DATA.map((group) => (
        <div key={group.groupName} style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Group Header */}
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                {group.groupName}
              </h3>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                {group.qualificationRule}
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: 600, width: '60px' }}>Pos</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Team</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#64748b', fontWeight: 600, width: '60px' }}>P</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#64748b', fontWeight: 600, width: '60px' }}>W</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#64748b', fontWeight: 600, width: '60px' }}>L</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#64748b', fontWeight: 600, width: '80px' }}>NRR</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: '#0f172a', fontWeight: 700, width: '60px' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team, index) => {
                  const isLastQualified = team.position === group.cutoffPosition;
                  const borderStyle = isLastQualified ? '2px solid #cbd5e1' : '1px solid #f1f5f9';
                  
                  return (
                    <tr key={team.id} style={{ 
                      borderBottom: borderStyle,
                      backgroundColor: team.status === 'qualified' ? '#f0fdf4' : 'white'
                    }}>
                      <td style={{ padding: '16px', color: '#64748b', fontWeight: 500 }}>
                        {team.position}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                              src={team.flagUrl} 
                              alt={team.teamCode} 
                              style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }}
                            />
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{team.teamName}</span>
                          </div>
                          {/* Status Label (Mobile/Desktop friendly) */}
                          <div style={{ marginLeft: '36px' }}>
                            <StatusLabel status={team.status} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', color: '#0f172a' }}>{team.matchesPlayed}</td>
                      <td style={{ padding: '16px', textAlign: 'right', color: '#0f172a' }}>{team.won}</td>
                      <td style={{ padding: '16px', textAlign: 'right', color: '#0f172a' }}>{team.lost}</td>
                      <td style={{ padding: '16px', textAlign: 'right', color: '#64748b', fontFamily: 'monospace' }}>{team.nrr}</td>
                      <td style={{ padding: '16px', textAlign: 'right', color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>{team.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Footer / Tie-Breaker Info */}
          <div style={{ 
            padding: '12px 24px', 
            backgroundColor: '#f8fafc', 
            borderTop: '1px solid #e2e8f0',
            fontSize: '12px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '14px' }}>ℹ️</span>
            Teams ranked by Points, then Net Run Rate (NRR).
          </div>
        </div>
      ))}
    </div>
  );
};
