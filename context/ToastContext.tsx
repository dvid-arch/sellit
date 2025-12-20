
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '../types';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message: string, type: ToastType = 'success', duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, title, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-4 pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastCard: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <div className="p-1.5 bg-[#E6F7F0] text-[#00A36C] rounded-lg"><CheckCircle2 size={24} /></div>;
      case 'error': return <div className="p-1.5 bg-red-50 text-red-500 rounded-lg"><AlertCircle size={24} /></div>;
      case 'warning': return <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><AlertTriangle size={24} /></div>;
      default: return <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Info size={24} /></div>;
    }
  };

  return (
    <div className="pointer-events-auto min-w-[340px] max-w-md bg-white rounded-[1.5rem] border border-gray-100 shadow-2xl p-5 flex items-start gap-4 animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 pt-0.5">
        <h4 className="font-bold text-gray-900 leading-tight">{toast.title}</h4>
        <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button 
        onClick={onRemove}
        className="shrink-0 p-1 text-gray-300 hover:text-gray-900 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};
