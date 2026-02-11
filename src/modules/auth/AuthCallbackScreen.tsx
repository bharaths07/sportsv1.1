import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallbackScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: any }) => {
      if (data.session) {
        navigate('/home', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, []);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      color: '#64748b',
      fontSize: '1.125rem'
    }}>
      Signing you in...
    </div>
  );
};
