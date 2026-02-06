import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';

const monthMap: Record<string, string> = {
  Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
  Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December'
};

const extractMonthYear = (dates: string) => {
  const m = dates.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}.*?(\d{4})/);
  if (!m) return 'Unknown';
  const monthFull = monthMap[m[1]] || m[1];
  return `${monthFull} ${m[2]}`;
};

const deriveFormat = (name: string) => {
  if (/T20/i.test(name)) return 'T20';
  if (/U19/i.test(name)) return 'Youth';
  return 'All Formats';
};

const deriveSeriesType = (name: string) => {
  if (/\bvs\b/i.test(name)) return 'Bilateral';
  return 'Tournament';
};

export const TournamentListScreen: React.FC = () => {
  const { tournaments } = useGlobalState();
  const [format, setFormat] = useState('All Formats');
  const [seriesType, setSeriesType] = useState('All Series');

  const filtered = useMemo(() => {
    return tournaments.filter(t => {
      const f = deriveFormat(t.name);
      const s = deriveSeriesType(t.name);
      const passF = format === 'All Formats' || f === format;
      const passS = seriesType === 'All Series' || s === seriesType;
      return passF && passS;
    });
  }, [tournaments, format, seriesType]);

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach(t => {
      const key = extractMonthYear(t.dates);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    const entries = Object.entries(groups).sort((a, b) => {
      const ay = parseInt(a[0].split(' ')[1]) || 0;
      const by = parseInt(b[0].split(' ')[1]) || 0;
      if (ay !== by) return ay - by;
      const order = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      return order.indexOf(a[0].split(' ')[0]) - order.indexOf(b[0].split(' ')[0]);
    });
    return entries;
  }, [filtered]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollByCards = (dir: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = dir === 'left' ? -320 : 320;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const topCarouselItems = useMemo(() => {
    // Show real tournaments in carousel (Ongoing/Upcoming prioritized)
    const featured = tournaments
      .filter(t => t.status !== 'completed')
      .slice(0, 10);
      
    return featured.map(t => ({
      id: t.id,
      name: t.name,
      poster: t.bannerUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`
    }));
  }, [tournaments]);

  // ... (keep existing code)

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
        <div>
          {topCarouselItems.length > 0 && (
            <div style={{ backgroundColor: '#1f2b3a', borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
              <button onClick={() => scrollByCards('left')} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: '32px', height: '32px', borderRadius: '16px', border: 'none', background: '#0d1522', color: '#fff', cursor: 'pointer' }}>{'<'}</button>
              <div ref={carouselRef} style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '8px 48px', scrollBehavior: 'smooth' }}>
                {topCarouselItems.map(item => (
                  <Link key={item.id} to={`/tournament/${item.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ width: '120px', minWidth: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '120px', height: '160px', borderRadius: '8px', backgroundImage: `url(${item.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div style={{ color: '#e8eef7', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>{item.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <button onClick={() => scrollByCards('right')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: '32px', height: '32px', borderRadius: '16px', border: 'none', background: '#0d1522', color: '#fff', cursor: 'pointer' }}>{'>'}</button>
            </div>
          )}

          {groupedByMonth.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>No tournaments found</div>
              <p style={{ marginTop: '8px' }}>There are no tournaments matching your filters.</p>
            </div>
          ) : (
            groupedByMonth.map(([month, items]) => (
            <div key={month} style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>{month}</div>
              <div style={{ height: '1px', backgroundColor: '#eee', marginBottom: '8px' }} />
              <div>
                {items.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 8px', borderBottom: '1px solid #f1f1f1', transition: 'background-color 120ms ease-in' }}
                       onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                       onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundImage: `url(${t.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', marginRight: '12px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Link to={`/tournament/${t.id}`} style={{ color: '#1a73e8', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>{t.name}</Link>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.dates}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )))}
        </div>

        <aside style={{ width: '100%' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #eee', position: 'sticky', top: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>Filter Fixtures</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#555', marginBottom: '6px' }}>Format</div>
                <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', backgroundColor: '#fff' }}>
                  <option>All Formats</option>
                  <option>T20</option>
                  <option>Youth</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#555', marginBottom: '6px' }}>Series Type</div>
                <select value={seriesType} onChange={(e) => setSeriesType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', backgroundColor: '#fff' }}>
                  <option>All Series</option>
                  <option>Tournament</option>
                  <option>Bilateral</option>
                </select>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
