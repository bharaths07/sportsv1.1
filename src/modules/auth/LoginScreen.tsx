import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, currentUser, users } = useGlobalState();
  
  // State
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (currentUser) {
    navigate('/home');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isRegistering && !name) {
      setError('Please enter your name');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Validate based on mode
      if (users) {
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!isRegistering && !existingUser) {
          throw new Error('Account not found. Please create an account.');
        }
        
        if (isRegistering && existingUser) {
          throw new Error('Account already exists. Please sign in.');
        }
      }

      await login(email, password, isRegistering ? name : undefined);
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    // Optional: clear form or keep it
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[440px] space-y-8">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {/* Logo placeholder or icon */}
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <path d="M12 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isRegistering ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isRegistering 
              ? 'Join the community of legends today.' 
              : 'Enter your credentials to access your dashboard.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-8 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Name Field - Only for Register */}
              {isRegistering && (
                <Input
                  label="Full Name"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  startIcon={User}
                  required={isRegistering}
                  className="bg-white focus:bg-white"
                />
              )}

              {/* Email Field */}
              <Input
                label="Email address"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                startIcon={Mail}
                required
                className="bg-white focus:bg-white"
              />

              {/* Password Field */}
              <div className="space-y-2">
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  startIcon={Lock}
                  required
                  className="bg-white focus:bg-white"
                />
                {!isRegistering && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Remember Me */}
            {!isRegistering && (
              <div className="flex items-center">
                <Checkbox
                  label="Remember me for 30 days"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-base shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all duration-200"
              disabled={loading}
              isLoading={loading}
              icon={!loading && <ArrowRight size={18} />}
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Divider / Toggle */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={toggleMode}
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors ml-1"
              >
                {isRegistering ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Play Legends. All rights reserved.
        </p>
      </div>
    </div>
  );
};
