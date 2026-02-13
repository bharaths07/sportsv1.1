import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';

type AuthStep = 'phone' | 'otp';

export const LoginPage: React.FC = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Protection States
  const [resendCooldown, setResendCooldown] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const mapAuthError = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('invalid token') || lower.includes('invalid otp')) return 'Incorrect OTP. Please check the code.';
    if (lower.includes('token has expired') || lower.includes('expired')) return 'OTP has expired. Please request a new one.';
    if (lower.includes('too many requests')) return 'Too many requests. Please wait before retrying.';
    return message; // Fallback
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!phone) {
      setError('Phone number is required');
      return;
    }

    // Auto-format phone to E.164 (Assuming India +91 if missing)
    let formattedPhone = phone.trim();
    
    // Remove all non-digit characters except +
    formattedPhone = formattedPhone.replace(/[^\d+]/g, '');

    // If no country code (length 10), prepend +91
    if (!formattedPhone.startsWith('+')) {
       if (formattedPhone.length === 10) {
           formattedPhone = `+91${formattedPhone}`;
       } else if (formattedPhone.length > 10 && formattedPhone.startsWith('91')) {
           // Handle case where user typed 9199... but forgot +
           formattedPhone = `+${formattedPhone}`;
       }
    }

    // Update state to use the formatted phone for subsequent calls (OTP verify)
    setPhone(formattedPhone);

    setIsLoading(true);

    try {
      const result = await authService.requestOtp(formattedPhone);

      if (result.success) {
        setAuthStep('otp');
        setSuccessMessage(`OTP sent to ${formattedPhone}`);
        setResendCooldown(30); // Start cooldown
        setFailedAttempts(0); // Reset attempts on new OTP
        setIsLocked(false);
      } else {
        setError(mapAuthError(result.error || 'Failed to send OTP'));
      }
    } catch (err: any) {
      setError(mapAuthError(err.message || 'An unexpected error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (isLocked) return;

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.verifyOtp(phone, otp);

      if (result.success) {
        setSuccessMessage('Login successful! Checking profile...');
        
        // Optimistic redirect trigger
        // We know auth state change is async, so we can manually trigger a small wait
        // But more importantly, we should ensure the loader doesn't turn off immediately
        // if we are expecting a redirect.
        
        // Keep loading state true while waiting for AppProviders to react
        // The App component will unmount this LoginPage once currentUser is set
        return; 
      } else {
        const mappedError = mapAuthError(result.error || 'Invalid OTP');
        setError(mappedError);
        
        // Handle failed attempts
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setError('Too many failed attempts. Please request a new OTP.');
        } else if (mappedError.includes('expired')) {
             // If expired, suggest resend immediately
             setError('OTP expired. Please request a new one.');
        }
      }
    } catch (err: any) {
      setError(mapAuthError(err.message || 'An unexpected error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = await authService.requestOtp(phone);
      if (result.success) {
        setSuccessMessage('OTP resent successfully!');
        setResendCooldown(30);
        setFailedAttempts(0); // Reset attempts
        setIsLocked(false);
        setOtp(''); // Clear previous input
      } else {
        setError(mapAuthError(result.error || 'Failed to resend OTP'));
      }
    } catch (err: any) {
      setError(mapAuthError(err.message || 'An unexpected error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="flex items-center justify-center min-h-[80vh] bg-slate-50">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">
            {authStep === 'phone' 
              ? 'Enter your phone number to sign in' 
              : 'Enter the verification code sent to your phone'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
             <ShieldCheck size={18} />
             <span>{successMessage}</span>
          </div>
        )}

        {authStep === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              startIcon={Phone}
              disabled={isLoading}
              helperText="Please include country code (e.g., +91)"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || !phone}
              icon={<ArrowRight size={18} />}
            >
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <Input
              label="Verification Code"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(val);
              }}
              startIcon={ShieldCheck}
              disabled={isLoading || isLocked}
              className="text-center tracking-widest text-lg"
              autoFocus
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || otp.length !== 6 || isLocked}
            >
              Verify
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading || resendCooldown > 0}
                className={`text-sm flex items-center justify-center mx-auto gap-2 transition-colors
                  ${(isLoading || resendCooldown > 0) ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}
                `}
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setAuthStep('phone');
                  setError(null);
                  setSuccessMessage(null);
                  setOtp('');
                  setIsLocked(false);
                }}
                className="text-sm text-slate-500 hover:text-slate-900 hover:underline"
                disabled={isLoading}
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </Card>
    </PageContainer>
  );
};
