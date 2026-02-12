import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const PhoneLoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithPhone } = useGlobalState();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!phone || phone.length < 10) {
        setError('Please enter a valid phone number.');
        return;
    }

    setLoading(true);
    
    // In a real app, we might save the name to local storage or pass it to the next screen
    // to update the profile after verification.
    localStorage.setItem('temp_user_name', name);
    
    const result = await loginWithPhone(phone);
    
    if (result.success) {
        navigate(`/auth/verify?phone=${encodeURIComponent(phone)}`);
    } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <PageContainer className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img 
            src="/logo1.png" 
            alt="Play Legends" 
            className="mx-auto mb-6 object-contain h-24 w-auto max-w-[280px]"
          />
          <p className="text-slate-500 mt-2">Enter your details to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            startIcon={<User size={18} />}
            required
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            type="tel"
            startIcon={<Phone size={18} />}
            required
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full justify-center py-3 text-lg"
            isLoading={loading}
          >
            Get OTP <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>
        
        <div className="mt-6 text-center">
            <button 
                type="button"
                onClick={() => navigate('/login-email')} 
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
                Continue with Email instead
            </button>
        </div>
      </Card>
    </PageContainer>
  );
};
