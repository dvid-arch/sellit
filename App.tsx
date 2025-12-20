
import React, { useState, useEffect } from 'react';
import { AuthStep, User } from './types.ts';
import { Carousel } from './components/Carousel.tsx';
import { AuthForms } from './components/AuthForms.tsx';
import { VerificationForm } from './components/VerificationForm.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { ConnectivityBanner } from './components/ConnectivityBanner.tsx';

const App: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('signup');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sellit_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setStep('authenticated');
    }
  }, []);

  const handleSignup = (userData?: User) => {
    if (userData) setUser(userData);
    setStep('verify');
  };

  const handleLogin = () => {
    const mockUser: User = { name: 'Obokobong', email: 'ubokobong@gmail.com', phone: '555-0123' };
    setUser(mockUser);
    setStep('authenticated');
    localStorage.setItem('sellit_user', JSON.stringify(mockUser));
  };

  const handleVerificationSuccess = () => {
    setStep('authenticated');
    if (user) {
      localStorage.setItem('sellit_user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStep('login');
    localStorage.removeItem('sellit_user');
  };

  const content = () => {
    if (step === 'authenticated') {
      return <Dashboard user={user} onLogout={handleLogout} />;
    }

    return (
      <div className="flex flex-col md:flex-row h-screen w-full bg-white overflow-hidden">
        <div className="hidden md:block md:w-1/2 lg:w-[45%] h-full overflow-hidden shrink-0">
          <Carousel />
        </div>

        <div className="flex-1 h-full overflow-y-auto bg-[#F9FAFB] scrollbar-hide">
          <div className="min-h-full w-full flex flex-col items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md bg-white md:bg-transparent p-8 md:p-0 rounded-[2.5rem] shadow-xl md:shadow-none my-auto">
              {(step === 'signup' || step === 'login' || step === 'forgot_password') && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <AuthForms 
                    type={step === 'forgot_password' ? 'forgot_password' : step as 'signup' | 'login'} 
                    onSwitch={(newType) => setStep(newType as AuthStep)} 
                    onSubmit={step === 'signup' ? handleSignup : handleLogin} 
                  />
                </div>
              )}
              {step === 'verify' && (
                <div className="animate-in slide-in-from-right duration-500">
                  <VerificationForm 
                    email={user?.email || ''} 
                    onSuccess={handleVerificationSuccess} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToastProvider>
      <ConnectivityBanner />
      {content()}
    </ToastProvider>
  );
};

export default App;
