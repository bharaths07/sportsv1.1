import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';

export const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useGlobalState();

  // Guard: If no user, redirect to login or profile
  if (!currentUser) {
    // In a real app, might show a loading spinner or redirect
    return <div style={{ padding: '20px' }}>Please log in to edit your profile.</div>;
  }

  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [location, setLocation] = useState(currentUser.location || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Name is required');
      return;
    }

    updateUserProfile({
      firstName,
      lastName,
      location,
      bio,
      avatarUrl: avatarUrl || undefined // Don't save empty string
    });

    navigate(-1); // Go back
  };

  // Mock Avatar Change
  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    const mockAvatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    ];
    const random = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setAvatarUrl(random);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px 20px', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            border: 'none', background: 'none', 
            fontSize: '16px', color: '#64748b', cursor: 'pointer',
            padding: '0'
          }}
        >
          Cancel
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Edit Profile
        </h1>
        <button 
          onClick={handleSave}
          style={{ 
            border: 'none', background: 'none', 
            fontSize: '16px', fontWeight: 600, color: '#2563eb', cursor: 'pointer',
            padding: '0'
          }}
        >
          Save
        </button>
      </div>

      <div style={{ padding: '24px 20px', flex: 1, overflowY: 'auto' }}>
        
        {/* Avatar Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div 
            onClick={handleAvatarChange}
            style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              backgroundColor: '#e2e8f0', overflow: 'hidden',
              marginBottom: '12px', cursor: 'pointer',
              border: '4px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#94a3b8' }}>
                {firstName[0]}{lastName[0]}
              </span>
            )}
          </div>
          <button 
            onClick={handleAvatarChange}
            style={{ 
              border: 'none', background: 'none', 
              color: '#2563eb', fontWeight: 600, fontSize: '14px', cursor: 'pointer' 
            }}
          >
            Change Photo
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                First Name
              </label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px', borderRadius: '8px', 
                  border: '1px solid #cbd5e1', fontSize: '16px', color: '#0f172a',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                Last Name
              </label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px', borderRadius: '8px', 
                  border: '1px solid #cbd5e1', fontSize: '16px', color: '#0f172a',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
              Location
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              style={{ 
                width: '100%', padding: '12px', borderRadius: '8px', 
                border: '1px solid #cbd5e1', fontSize: '16px', color: '#0f172a',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
              Bio
            </label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '8px', 
                border: '1px solid #cbd5e1', fontSize: '16px', color: '#0f172a',
                outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit'
              }}
            />
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              {bio.length} characters
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
