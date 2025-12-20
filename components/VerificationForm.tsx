
import React, { useState, useRef } from 'react';
import { Logo } from '../constants';

interface VerificationFormProps {
  email: string;
  onSuccess: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    if (otp.every(v => v)) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
      <div className="mb-12 self-start">
        <Logo />
      </div>
      
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Check your inbox</h2>
      <p className="text-gray-500 mb-10">
        Enter the 4-digit code sent to <br/><span className="font-bold text-gray-800">{email || 'your-email@edu.com'}</span>
      </p>

      <div className="flex gap-4 mb-10 w-full justify-center">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={el => inputs.current[idx] = el}
            type="text"
            className="w-16 h-20 bg-white border border-gray-300 rounded-2xl text-center text-3xl font-bold focus:ring-4 focus:ring-sellit/10 transition-all text-sellit"
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={loading || !otp.every(v => v)}
        className="w-full bg-sellit text-white py-[12px] px-[24px] rounded-2xl font-bold text-lg hover:bg-sellit-dark disabled:opacity-50 transition-all shadow-xl active:scale-[0.98]"
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </button>

      <p className="mt-8 text-center text-gray-500 font-medium">
        Didn't receive it? <button className="text-sellit font-bold hover:underline">Resend code</button>
      </p>
    </div>
  );
};
