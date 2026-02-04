import React, { useState } from 'react';
import { useGlobalState } from '../app/AppProviders';
import { LoadingButton } from './LoadingButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, message }) => {
  const { login } = useGlobalState();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
        login('google');
        setIsLoggingIn(false);
        onClose();
    }, 1000);
  };

  return (
    <div style={{
       position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
       backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
    }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '300px', textAlign: 'center' }}>
         <h2 style={{ marginTop: 0, color: '#333' }}>Login Required</h2>
         <p style={{ color: '#666', marginBottom: '20px' }}>{message || "Please login to continue."}</p>
         
         <LoadingButton 
            onClick={handleGoogleLogin}
            isLoading={isLoggingIn}
            loadingText="Signing in..."
            style={{
                width: '100%', 
                padding: '12px', 
                margin: '10px 0',
                backgroundColor: '#db4437', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '16px', 
                fontWeight: 'bold'
            }}
         >
           Sign in with Google
         </LoadingButton>
         
         <button onClick={onClose} style={{
             width: '100%', padding: '12px',
             backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer',
             marginTop: '10px'
         }}>
           Cancel
         </button>
      </div>
    </div>
  );
};
