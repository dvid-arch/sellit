
import React, { useState, useMemo } from 'react';
import { Logo } from '../constants';
import { User } from '../types';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, Send } from 'lucide-react';

interface AuthFormProps {
  type: 'signup' | 'login' | 'forgot_password';
  onSwitch: (newType: 'signup' | 'login' | 'forgot_password') => void;
  onSubmit: (user?: User) => void;
}

export const AuthForms: React.FC<AuthFormProps> = ({ type, onSwitch, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    website: '' 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recoverySent, setRecoverySent] = useState(false);

  const passwordStrength = useMemo(() => {
    if (type !== 'signup' || !formData.password) return 0;
    const p = formData.password;
    let strength = 0;
    if (p.length >= 8) strength += 25;
    if (/[A-Z]/.test(p)) strength += 25;
    if (/[0-9]/.test(p)) strength += 25;
    if (/[^A-Za-z0-9]/.test(p)) strength += 25;
    return strength;
  }, [formData.password, type]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.website) {
      newErrors.form = "Security check failed.";
      return false;
    }

    if (type === 'signup') {
      if (formData.name.trim().length < 3) newErrors.name = "Name too short";
      if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = "Invalid phone format";
      if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid university email";
    }

    if (type === 'login' && !formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (type === 'forgot_password') {
        setRecoverySent(true);
      } else {
        onSubmit(type === 'signup' ? formData : undefined);
      }
    }
  };

  if (type === 'forgot_password') {
    return (
      <div className="flex flex-col w-full">
        <div className="mb-10"><Logo /></div>
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Recover Password</h2>
          <p className="text-gray-500 mt-2 font-medium">Enter your email and we'll send recovery steps.</p>
        </div>

        {recoverySent ? (
          <div className="text-center p-8 bg-sellit/5 rounded-3xl border border-sellit/10 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-sellit"><Send size={32} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
            <p className="text-sm text-gray-500 font-medium mb-8">We sent a recovery link to {formData.email}</p>
            <button onClick={() => onSwitch('login')} className="w-full bg-sellit text-white py-4 rounded-2xl font-bold">Return to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
              <input required type="email" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-medium" placeholder="name@uni.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.email}</p>}
            </div>
            <button type="submit" className="w-full bg-sellit text-white py-4 rounded-2xl font-bold text-lg shadow-lg">Send Recovery Link</button>
            <button type="button" onClick={() => onSwitch('login')} className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-sellit transition-colors"><ArrowLeft size={18} /> Back to Login</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-10"><Logo /></div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{type === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="text-gray-500 mt-2 font-medium">{type === 'signup' ? 'Join the campus community today.' : 'Please enter your details to login.'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="sr-only opacity-0 h-0 overflow-hidden" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
        </div>

        {type === 'signup' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
            <input required maxLength={50} className={`w-full px-5 py-4 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium`} placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.name}</p>}
          </div>
        )}

        {type === 'signup' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Phone Number</label>
            <input required type="tel" maxLength={15} className={`w-full px-5 py-4 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium`} placeholder="+234..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.phone}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">University Email</label>
          <input required type="email" maxLength={100} className={`w-full px-5 py-4 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium`} placeholder="name@university.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1 flex justify-between">
            <span>Password</span>
            {type === 'login' && <button type="button" onClick={() => onSwitch('forgot_password')} className="text-sellit text-xs hover:underline">Forgot?</button>}
          </label>
          <div className="relative">
            <input required type={showPassword ? "text" : "password"} maxLength={32} className={`w-full px-5 py-4 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all text-gray-900 placeholder:text-gray-400 font-medium pr-14`} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sellit transition-colors p-2">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.password}</p>}
          
          {type === 'signup' && formData.password && (
            <div className="mt-3 px-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strength</span>
                <span className="text-[10px] font-black uppercase text-sellit">{passwordStrength === 100 ? 'Excellent' : passwordStrength >= 50 ? 'Medium' : 'Weak'}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${passwordStrength === 100 ? 'bg-green-500' : passwordStrength >= 50 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${passwordStrength}%` }} />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-sellit text-white py-[12px] px-[24px] rounded-2xl font-bold text-lg hover:bg-sellit-dark transition-all shadow-lg active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group">
          {type === 'signup' ? 'Get Started' : 'Log in'}
          <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-500 font-medium">
          {type === 'signup' ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => onSwitch(type === 'signup' ? 'login' : 'signup')} className="text-sellit font-bold ml-1.5 hover:underline">{type === 'signup' ? 'Log in' : 'Sign up'}</button>
        </p>
      </div>
    </div>
  );
};
