import React from 'react';
import { RotateCcw, ShieldCheck, HelpCircle, Phone, MapPin } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

export default function Footer() {
  const { clearSession } = useLaundry();

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white text-slate-600 text-xs py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900">LaundryTrack</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-700">LPU Central Laundry Division</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-lg">
              Official campus accountability framework for student hostel laundry intake, machine verification, weather-adjusted drying schedules, and counter handshakes.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={clearSession}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
              title="Reset in-memory session back to completely empty"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear Session &amp; Start Fresh</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero-PII Privacy:</strong> Identifiers masked as <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">Resident Code</code> &amp; <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">Operator ID</code>.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Intake Point:</strong> BH-11 Basement Wing B, Counter #2, Main Campus, Phagwara.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              <strong>Counter Operator Desk:</strong> Intercom Ext 4092 (08:00 AM – 08:00 PM IST)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
