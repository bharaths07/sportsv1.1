import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithSupabase, currentUser } = useGlobalState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Redirect if already logged in
  if (currentUser) {
    navigate('/home');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || emailSent) return;
    
    try {
      await loginWithSupabase(email);
      setEmailSent(true);
      alert('We sent you a login link. You only need to click it once.');
    } catch (error: any) {
      alert(error.message || 'Failed to login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>
          Welcome Back
        </h2>
        <p style={{ marginBottom: '32px', color: '#64748b', textAlign: 'center' }}>
          This is a demo login. No password required.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name || !email || emailSent}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: (!name || !email || emailSent) ? '#94a3b8' : '#2563eb',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: (!name || !email || emailSent) ? 'not-allowed' : 'pointer'
            }}
          >
            {emailSent ? 'Email sent' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};
