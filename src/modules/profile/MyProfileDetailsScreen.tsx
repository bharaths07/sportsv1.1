import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';

export const MyProfileDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useGlobalState();
  const isGuest = !currentUser;

  // Resolve user display data
  const userData = isGuest ? {
    name: 'Guest User',
    email: 'Not logged in',
    initial: 'G',
    memberSince: '-',
    location: '-',
    type: 'Guest',
    followers: 0,
    views: 0,
    avatarUrl: null
  } : {
    name: currentUser.name,
    email: currentUser.email,
    initial: currentUser.name.charAt(0),
    memberSince: `Since ${new Date().getFullYear()}`, // Mock
    location: 'Bengaluru (Bangalore)', // Mock
    type: 'Registered',
    followers: 3, // Mock
    views: 40, // Mock
    avatarUrl: null // Mock for now, support adding it later
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* A. Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px 20px', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', gap: '16px'
      }}>
        <div 
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', fontSize: '20px', color: '#64748b' }}
        >
          ←
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          My Profile
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* B. Profile Card (Personal Header) */}
        <div style={{ 
          backgroundColor: 'white', borderRadius: '12px', padding: '24px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          marginBottom: '20px'
        }}>
          {/* Avatar with Edit Overlay */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ 
              width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', fontWeight: 700, color: '#64748b',
              border: '4px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {userData.initial}
            </div>
            {!isGuest && (
              <div style={{ 
                position: 'absolute', bottom: '0', right: '0',
                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f172a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '14px', border: '2px solid white', cursor: 'pointer'
              }}>
                ✎
              </div>
            )}
          </div>

          {/* Identity */}
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
            {userData.name}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#64748b', fontSize: '14px' }}>
            <span>📍</span>
            <span>{userData.location}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
            <span>📅</span>
            <span>{userData.memberSince}</span>
          </div>

          {/* Quick Stats Strip */}
          <div style={{ 
            display: 'flex', width: '100%', marginTop: '24px', paddingTop: '24px',
            borderTop: '1px solid #f1f5f9'
          }}>
            {/* 1. QR Code */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: isGuest ? 0.5 : 1 }}>
              <div style={{ fontSize: '24px', color: '#0f172a' }}>🏁</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>QR code</span>
            </div>
            
            {/* Divider */}
            <div style={{ width: '1px', backgroundColor: '#e2e8f0', height: '40px' }} />

            {/* 2. Followers */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{userData.followers}</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Followers</span>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', backgroundColor: '#e2e8f0', height: '40px' }} />

            {/* 3. Views */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{userData.views}</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Profile views</span>
            </div>
          </div>
          
          {/* Primary CTA */}
          <div style={{ marginTop: '24px', width: '100%' }}>
             {isGuest ? (
               <button 
                onClick={() => navigate('/login')}
                style={{ 
                  width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', 
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                }}
               >
                 Login to Complete Profile
               </button>
             ) : (
               <button 
                onClick={() => console.log('Edit Profile')}
                style={{ 
                  width: '100%', padding: '12px', backgroundColor: '#f1f5f9', color: '#334155', 
                  border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                }}
               >
                 Edit Profile
               </button>
             )}
          </div>
        </div>

        {/* C. Account Info Section */}
        <div style={{ 
          backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
        }}>
          <h3 style={{ 
            fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', 
            padding: '16px 20px', borderBottom: '1px solid #f1f5f9', margin: 0 
          }}>
            Account Details
          </h3>
          
          {[
            { label: 'Display Name', value: userData.name },
            { label: 'Email Address', value: userData.email },
            { label: 'Location', value: userData.location },
            { label: 'Account Type', value: userData.type },
            { label: 'Member Since', value: userData.memberSince },
          ].map((item) => (
            <div key={item.label} style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>{item.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* D. Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {!isGuest && (
            <button 
              onClick={() => console.log('Change Password')}
              style={{ 
                width: '100%', padding: '14px', backgroundColor: 'white', color: '#334155',
                border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Change Password
            </button>
          )}
          
          <button 
            onClick={() => { logout(); navigate('/'); }}
            style={{ 
              width: '100%', padding: '14px', backgroundColor: '#fee2e2', color: '#dc2626',
              border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isGuest ? 'Clear Guest Session' : 'Logout'}
          </button>
          
          {!isGuest && (
             <div style={{ textAlign: 'center', marginTop: '8px' }}>
               <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer' }}>
                 Delete Account
               </span>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};
