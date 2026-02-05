import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();
  const isGuest = !currentUser;

  // Resolve user display data
  const userData = isGuest ? {
    name: 'Guest',
    initial: 'G',
    subtitle: 'Sign in to sync your data'
  } : {
    name: currentUser.name,
    initial: currentUser.name.charAt(0),
    subtitle: `Member since ${new Date().getFullYear()}` // Mock date for now
  };

  // Quick Actions Config
  const quickActions = [
    { 
      icon: '👤', 
      label: 'My Profile', 
      active: false, // Changed from true to false
      onClick: () => navigate('/profile/me') // Navigate to new details page
    },
    { 
      icon: '🔖', 
      label: 'Saved Matches', 
      onClick: () => isGuest ? navigate('/login') : console.log('Saved Matches') 
    },
    { 
      icon: '🔔', 
      label: 'Notifications', 
      onClick: () => isGuest ? navigate('/login') : console.log('Notifications') 
    },
    { icon: '⚙️', label: 'Settings', onClick: () => console.log('Settings') },
    { icon: '❓', label: 'Help & Support', onClick: () => console.log('Help') },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* A. PROFILE HEADER (ACCOUNT LEVEL) */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px 20px', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Avatar */}
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: 700, color: '#64748b',
          border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {userData.initial}
        </div>

        {/* Center Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
            {userData.name}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {userData.subtitle}
          </div>
        </div>

        {/* Right CTA */}
        <div>
          {isGuest ? (
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', 
                border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          ) : (
            <button 
              onClick={() => console.log('Edit Profile')}
              style={{ 
                padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#334155', 
                border: '1px solid #cbd5e1', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* B. QUICK ACTIONS (CARD LIST) */}
      <div style={{ padding: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {quickActions.map((action, index) => (
            <div 
              key={action.label}
              onClick={action.onClick}
              style={{ 
                padding: '16px', 
                display: 'flex', alignItems: 'center', gap: '16px',
                borderBottom: index !== quickActions.length - 1 ? '1px solid #f1f5f9' : 'none',
                cursor: 'pointer',
                backgroundColor: action.active ? '#eff6ff' : 'white'
              }}
            >
              <span style={{ fontSize: '18px' }}>{action.icon}</span>
              <span style={{ flex: 1, fontSize: '15px', color: action.active ? '#2563eb' : '#334155', fontWeight: action.active ? 600 : 400 }}>
                {action.label}
              </span>
              <span style={{ color: '#cbd5e1' }}>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* C. GAME PROFILES ENTRY */}
      <div style={{ padding: '0 20px 20px 20px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>
          Game Profiles
        </h3>
        
        {/* Cricket Card */}
        <div 
          onClick={() => {
            if (isGuest) {
              navigate('/login');
            } else {
              navigate('/profile/game/cricket');
            }
          }}
          style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', gap: '16px',
            cursor: 'pointer',
            opacity: isGuest ? 0.7 : 1,
            borderLeft: '4px solid #ef4444' // Cricket Red branding hint
          }}
        >
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#fef2f2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
          }}>
            🏏
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Cricket</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              {isGuest ? 'Login to set up profile' : 'View your game stats'}
            </div>
          </div>
          <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>
            {isGuest ? 'Locked' : 'Open'}
          </div>
        </div>
      </div>

    </div>
  );
};
