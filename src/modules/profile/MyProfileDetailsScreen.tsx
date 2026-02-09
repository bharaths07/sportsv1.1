import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Avatar } from '../../components/ui/Avatar';

export const MyProfileDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();
  const isGuest = !currentUser;

  // Resolve user display data
  const userData = isGuest ? {
    name: 'Guest User',
    location: 'Location not set',
    memberSince: '-',
    avatarUrl: null,
    initial: 'G',
    followers: 0,
    views: 0,
    bio: ''
  } : {
    name: currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'User',
    location: currentUser.location || 'Location not set',
    memberSince: currentUser.memberSince || new Date().getFullYear().toString(),
    avatarUrl: currentUser.avatarUrl,
    initial: (currentUser.name || currentUser.firstName || 'U').charAt(0),
    followers: currentUser.followersCount || 0,
    views: currentUser.profileViews || 0,
    bio: currentUser.bio || ''
  };

  const handleCtaClick = () => {
    if (isGuest) {
      navigate('/login');
    } else {
      navigate('/profile/edit');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Red Top App Bar & Header Background */}
      <div style={{ backgroundColor: '#dc2626', paddingBottom: '60px' }}>
        {/* App Bar */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', color: 'white'
        }}>
          <div onClick={() => navigate('/profile')} style={{ fontSize: '24px', cursor: 'pointer' }}>
            ←
          </div>
          <div onClick={() => navigate('/profile/cricket/me')} style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            Cricket profile 
            <span style={{ fontSize: '12px' }}>›</span>
          </div>
        </div>
      </div>

      {/* 2. Profile Content (Overlapping) */}
      <div style={{ 
        backgroundColor: 'white', 
        borderTopLeftRadius: '0px', borderTopRightRadius: '0px', 
        flex: 1,
        position: 'relative',
        padding: '0 20px'
      }}>
        
        {/* Avatar & Basic Info Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
          
          {/* Avatar (Overlapping) */}
          <div style={{ 
            marginTop: '-40px', // Pull up into red area
            marginRight: '16px',
            position: 'relative'
          }}>
            <Avatar 
              src={userData.avatarUrl}
              fallback={userData.initial}
              className="w-[100px] h-[100px] border-4 border-white shadow-md text-3xl bg-slate-100 text-slate-500 font-bold"
            />
            
            {/* Edit Overlay on Avatar */}
            {!isGuest && (
              <div 
                onClick={() => navigate('/profile/edit')}
                style={{
                  position: 'absolute', bottom: '0', left: '0', right: '0',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white', fontSize: '10px', textAlign: 'center',
                  padding: '2px 0', cursor: 'pointer',
                  borderBottomLeftRadius: '9999px', borderBottomRightRadius: '9999px',
                  overflow: 'hidden' // Ensure it respects the border radius if Avatar didn't have it (Avatar is rounded-full)
                }}
                className="rounded-b-full" // Tailwind utility for cleaner rounding
              >
                Edit
              </div>
            )}
          </div>

          {/* Name & Identity Details (Right of Avatar) */}
          <div style={{ paddingTop: '12px', flex: 1 }}>
            <h1 style={{ 
              fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0',
              lineHeight: '1.2'
            }}>
              {userData.name}
            </h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                <span>📍</span>
                <span>{userData.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '12px' }}>
                <span>📅</span>
                <span>Since {userData.memberSince}</span>
              </div>
            </div>
          </div>

          {/* "Go PRO" button replacement (optional, per user request for no monetization, we omit or use Edit) 
              The user asked for "Full-width primary CTA", so we keep this area clean 
              or maybe put a small "Edit" button here if needed. 
              For now, clean.
          */}
        </div>

        {/* 3. Stats Strip */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {/* QR Code */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '20px', color: '#059669' }}>⚃</div> {/* Greenish QR icon look */}
            <span style={{ fontSize: '12px', color: '#64748b' }}>QR code</span>
          </div>

          <div style={{ width: '1px', height: '30px', backgroundColor: '#e2e8f0' }} />

          {/* Followers */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#059669' }}>{userData.followers}</div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Followers</span>
          </div>

          <div style={{ width: '1px', height: '30px', backgroundColor: '#e2e8f0' }} />

          {/* Profile Views */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#059669' }}>{userData.views}</div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Profile views</span>
          </div>
        </div>

        {/* 4. Full Width CTA (Bottom) */}
        <div style={{ marginTop: '40px' }}>
          <button
            onClick={handleCtaClick}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#059669', // Green CTA like "Go PRO" or "Buy now" in image
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            {isGuest ? 'Login to Complete Profile' : 'Edit Profile'}
          </button>
        </div>

      </div>
    </div>
  );
};
