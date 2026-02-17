 import React, { useState } from 'react';
 import { Phone, ArrowRight, AlertCircle } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 import { useGlobalState } from '../../app/AppProviders';
 import { Button } from '../../components/ui/Button';
 import { Input } from '../../components/ui/Input';
 import { PageContainer } from '../../components/layout/PageContainer';
 import { Card } from '../../components/ui/Card';
 import { PhoneCountrySelect, PhoneCountryValue } from '../../components/auth/PhoneCountrySelect';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithPhone } = useGlobalState();
  const [phoneDigits, setPhoneDigits] = useState('');
  const [country, setCountry] = useState<PhoneCountryValue>({ code: 'IN', dialCode: '+91' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    if (!phoneDigits) {
      setError('Phone number is required');
      return;
    }

    const digitsOnly = phoneDigits.replace(/\D/g, '');
    const formattedPhone = `${country.dialCode}${digitsOnly}`;

    setIsLoading(true);

    try {
      const result = await loginWithPhone(formattedPhone);

      if (result.success) {
        navigate(`/auth/verify?phone=${encodeURIComponent(formattedPhone)}`);
      } else {
        setError(mapAuthError(result.error || 'Failed to send OTP'));
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
            Enter your phone number to sign in
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

        {
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <PhoneCountrySelect value={country} onChange={setCountry} />
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="98765 43210"
              value={phoneDigits}
              onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
              startIcon={Phone}
              disabled={isLoading}
              helperText="Country code auto-applied"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || !phoneDigits}
              icon={<ArrowRight size={18} />}
            >
              Send OTP
            </Button>
          </form>
        }
      </Card>
    </PageContainer>
  );
};
