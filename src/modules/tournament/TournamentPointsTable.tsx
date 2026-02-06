import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { calculateStandings } from '../../utils/tournament/calculateStandings';

const StatusLabel: React.FC<{ status: string }> = ({ status }) => {
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
      return null; 
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
  const { id } = useParams<{ id: string }>();
  const { tournaments, teams: allTeams, matches: allMatches } = useGlobalState();

  const tournament = tournaments.find(t => t.id === id);
  
  const tableData = useMemo(() => {
    if (!tournament) return [];

    // 1. Get Tournament Teams
    const teamIds = tournament.teams || [];
    const tournamentTeams = allTeams.filter(t => teamIds.includes(t.id));

    // 2. Get Tournament Matches (Completed only)
    const tournamentMatches = allMatches.filter(m => 
      m.tournamentId === id
    );

    // 3. Calculate Standings
    const standings = calculateStandings(tournamentTeams, tournamentMatches);

    // 4. Enhance with UI fields
    const enhancedStandings = standings.map(s => {
        const team = tournamentTeams.find(t => t.id === s.teamId);
        return {
            ...s,
            teamCode: team?.name.substring(0, 3).toUpperCase() || s.teamName.substring(0, 3).toUpperCase(),
            nrr: '0.000',
            status: 'contention',
            flagUrl: team?.logoUrl
        };
    });

    return [{
      groupName: "Standings",
      qualificationRule: "League Table",
      cutoffPosition: 0,
      teams: enhancedStandings
    }];
  }, [tournament, allTeams, allMatches, id]);

  const hasCompletedMatches = useMemo(() => {
     return allMatches.some(m => m.tournamentId === id && (m.status === 'completed' || m.status === 'locked'));
  }, [allMatches, id]);

  if (!tournament) return <div>Tournament not found</div>;

  if (!tournament.teams || tournament.teams.length === 0) {
     return (
       <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
         <div className="text-4xl">📊</div>
         <h3 className="text-slate-900 font-medium">No standings available</h3>
         <p className="text-slate-500 text-sm">Add teams to see the table.</p>
       </div>
     );
  }

  if (!hasCompletedMatches) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 bg-white rounded-xl border border-slate-200 shadow-sm mx-auto max-w-[900px]">
        <div className="text-4xl mb-2">⏳</div>
        <h3 className="text-slate-900 font-medium">No results yet</h3>
        <p className="text-slate-500 text-sm">Standings will update after the first match completes.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '900px', margin: '0 auto' }}>
      {tableData.map((group) => (
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
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>P</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>W</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>L</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>T</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>Pts</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>NRR</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>Form</th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team, index) => (
                  <tr key={team.teamId} style={{ 
                    borderBottom: index !== group.teams.length - 1 ? '1px solid #f1f5f9' : 'none',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc'
                  }}>
                      <td style={{ padding: '16px', color: '#64748b', fontWeight: 500 }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {team.flagUrl ? (
                            <img src={team.flagUrl} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{team.teamName}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{team.teamCode}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>{team.played}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#15803d', fontWeight: 600 }}>{team.won}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#b91c1c', fontWeight: 600 }}>{team.lost}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{team.tied || 0}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>{team.points}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'monospace', color: '#64748b' }}>{team.nrr}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <StatusLabel status={team.status} />
                      </td>
                    </tr>
                  )
                )}
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
            Teams ranked by Points, then Wins, then Name.
          </div>
        </div>
      ))}
    </div>
  );
};
