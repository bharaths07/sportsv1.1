import React, { useMemo } from 'react';
import { useGlobalState } from '../../app/AppProviders';
import { Match } from '../../domain/match';
import { Link } from 'react-router-dom';

interface Props {
  match: Match;
}

const formatCountdown = (dateISO: string) => {
  const now = new Date();
  const start = new Date(dateISO);
  const diffMs = start.getTime() - now.getTime();
  if (diffMs <= 0) return 'Toss delayed';
  const h = Math.floor(diffMs / (1000 * 60 * 60));
  const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `Match starts in ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
};

const computeStatusLine = (match: Match) => {
  if (match.status === 'cancelled') return 'Match abandoned';
  if (match.status === 'live') {
    const hasXI =
      (match.homeParticipant.players && match.homeParticipant.players.length > 0) ||
      (match.awayParticipant.players && match.awayParticipant.players.length > 0);
    return hasXI ? 'Playing XI announced' : 'Match is live';
  }
  if (match.status === 'completed' || match.status === 'locked') {
    return 'Match completed';
  }
  return formatCountdown(match.date);
};

const resultChar = (m: Match, teamId: string) => {
  if (m.status !== 'completed' && m.status !== 'locked') return '•';
  if (!m.winnerId) return 'D';
  return m.winnerId === teamId ? 'W' : 'L';
};

export const MatchInfoTab: React.FC<Props> = ({ match }) => {
  const { matches, preferences, teams } = useGlobalState();

  const statusLine = computeStatusLine(match);

  const homeForm = useMemo(() => {
    const list = matches
      .filter(x => x.homeParticipant.id === match.homeParticipant.id || x.awayParticipant.id === match.homeParticipant.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(m => resultChar(m, match.homeParticipant.id));
    return list;
  }, [matches, match.homeParticipant.id]);

  const awayForm = useMemo(() => {
    const list = matches
      .filter(x => x.homeParticipant.id === match.awayParticipant.id || x.awayParticipant.id === match.awayParticipant.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(m => resultChar(m, match.awayParticipant.id));
    return list;
  }, [matches, match.awayParticipant.id]);

  const homeTeam = teams.find(t => t.id === match.homeParticipant.id);
  const awayTeam = teams.find(t => t.id === match.awayParticipant.id);

  const formatDateTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric', timeZone: preferences.timezone });
    } catch {
      return new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' });
    }
  };

  const matchType = match.status === 'draft' ? 'Warm-up' : 'League';
  const pointsAtStake = match.status === 'draft' ? 'No' : 'Yes';
  const matchStage = 'Match • Group Stage';
  const tournamentName = 'T20 League 2026';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 600 }}>
        {statusLine}
      </div>

      <section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Match Overview</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: '#475569' }}>Match Type</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{matchType}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#475569' }}>Points at Stake</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{pointsAtStake}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#475569' }}>Tournament</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              <Link to="/tournaments" style={{ color: '#2563eb', textDecoration: 'none' }}>{tournamentName}</Link>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#475569' }}>Stage</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{matchStage}</div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Date, Venue & Broadcast</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: '#475569' }}>Start Time</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{formatDateTime(match.date)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#475569' }}>Venue</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              <Link to="/venues" style={{ color: '#2563eb', textDecoration: 'none' }}>{match.location}</Link>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#475569' }}>City & Country</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{match.location}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#475569' }}>Broadcaster</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>TBD</div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Team Form</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {match.homeParticipant.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{match.homeParticipant.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Last 5 matches</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {homeForm.map((r, i) => (
                <div key={i} style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: r === 'W' ? '#dcfce7' : r === 'L' ? '#fee2e2' : '#f1f5f9', color: r === 'W' ? '#166534' : r === 'L' ? '#991b1b' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                  {r}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {match.awayParticipant.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{match.awayParticipant.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Last 5 matches</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {awayForm.map((r, i) => (
                <div key={i} style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: r === 'W' ? '#dcfce7' : r === 'L' ? '#fee2e2' : '#f1f5f9', color: r === 'W' ? '#166534' : r === 'L' ? '#991b1b' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 14, color: '#64748b' }}>Squads</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: 6 }}>Full Squad</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{match.homeParticipant.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(homeTeam?.members || []).map((m, idx) => {
                const playerName = m.playerId;
                const roleLabel = idx % 3 === 0 ? 'Batter' : idx % 3 === 1 ? 'Bowler' : 'All-rounder';
                const isCaptain = m.role === 'captain';
                const isWK = false;
                return (
                  <div key={m.playerId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#e2e8f0' }} />
                      <div style={{ fontSize: 13 }}>{playerName}</div>
                      {isCaptain && <span style={{ fontSize: 11, fontWeight: 800, color: '#d97706' }}>C</span>}
                      {isWK && <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb' }}>WK</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{roleLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{match.awayParticipant.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(awayTeam?.members || []).map((m, idx) => {
                const playerName = m.playerId;
                const roleLabel = idx % 3 === 0 ? 'Batter' : idx % 3 === 1 ? 'Bowler' : 'All-rounder';
                const isCaptain = m.role === 'captain';
                const isWK = false;
                return (
                  <div key={m.playerId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#e2e8f0' }} />
                      <div style={{ fontSize: 13 }}>{playerName}</div>
                      {isCaptain && <span style={{ fontSize: 11, fontWeight: 800, color: '#d97706' }}>C</span>}
                      {isWK && <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb' }}>WK</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{roleLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Conditions / Notes</div>
        <div style={{ fontSize: 13, color: '#334155' }}>Pitch: Balanced surface expected. Weather: Clear skies.</div>
      </section>
    </div>
  );
}

