import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNitorStore } from '../../store/useNitorStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNitorStore();

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto w-80 p-4 rounded-xl shadow-lg border flex items-start gap-3 transform transition-all animate-in slide-in-from-bottom-5 fade-in
            ${toast.type === 'success' 
              ? 'bg-white border-indigo-100 shadow-indigo-500/10' 
              : 'bg-white border-red-100 shadow-red-500/10'}
          `}
        >
          <div className={`mt-0.5 ${toast.type === 'success' ? 'text-indigo-600' : 'text-red-500'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          
          <div className="flex-1">
            <h4 className={`text-sm font-bold ${toast.type === 'success' ? 'text-slate-900' : 'text-red-900'}`}>
              {toast.type === 'success' ? 'Success' : 'Error'}
            </h4>
            <p className="text-sm text-slate-600 mt-0.5">{toast.message}</p>
          </div>

          <button 
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};