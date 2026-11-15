import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

export default function Toast() {
  const { toasts, removeToast } = useLaundry();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-blue-300 bg-white text-slate-900';
        let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-300 bg-white text-slate-900';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-300 bg-white text-slate-900';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-red-300 bg-white text-slate-900';
          icon = <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start space-x-3 transition-all animate-in slide-in-from-bottom-5 duration-200 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
