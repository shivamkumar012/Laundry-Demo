import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  CloudRain,
  Sun,
  ShieldCheck,
  Info,
  Layers,
  Plus,
  Send,
  MessageSquare
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

export default function AlertsDelayPage() {
  const {
    batch,
    alerts,
    clearDelay,
    navigateTo,
    startNewDropOff
  } = useLaundry();

  const [filter, setFilter] = useState('all'); // 'all' | 'delays' | 'ready'

  // If no batch exists at all
  if (!batch) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigateTo('dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hosteller Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Alerts Yet</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no active laundry batches or delay broadcasts registered for this session.
            </p>
          </div>
          <div>
            <button
              onClick={startNewDropOff}
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Drop-Off</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'delays') return alert.type === 'amber';
    if (filter === 'ready') return alert.type === 'emerald';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header breadcrumb & info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigateTo('dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hosteller Dashboard</span>
        </button>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="bg-slate-200 text-slate-800 px-2.5 py-1 rounded font-bold">
            BATCH #{batch.id}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-600">COUNTER #2 DISPATCH</span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Automated Delay Reason &amp; Pickup Readiness Alerts
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live telemetry stream for drying delays, weather events, and collection readiness for Batch #{batch.id}.
            </p>
          </div>
        </div>
      </div>

      {/* 1. GREEN PICKUP READINESS CARD (When Batch is Ready) */}
      {batch.isReady && !batch.isDelivered && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-emerald-200 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                  COLLECTION DISPATCH ACTIVE
                </span>
                <h2 className="text-base sm:text-lg font-bold text-emerald-950 mt-1">
                  Ready for Pickup at Counter 2 — {batch.rack}
                </h2>
                <p className="text-xs text-emerald-800 font-mono mt-0.5">
                  Batch #{batch.id} • Assigned Slot: Shelf {batch.rack} • Operator: {batch.operatorCode}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('pickup')}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md transition-colors"
            >
              <span>Proceed to Counter Pickup Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-medium block">Intake Garments</span>
              <strong className="text-slate-900 text-sm font-mono">
                {Object.values(batch.garments).reduce((a, b) => a + Number(b || 0), 0)} Pieces Folded
              </strong>
            </div>
            <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-medium block">Counter Location</span>
              <strong className="text-slate-900 text-sm">{batch.hostel} • {batch.counter}</strong>
            </div>
            <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-medium block">Counter Desk Officer</span>
              <strong className="text-slate-900 text-sm font-mono">{batch.operatorCode}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 2. AMBER DELAY / NOTICE CARD (When Delay or Notice is Active) */}
      {batch.activeDelay && !batch.isDelivered && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-amber-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                {batch.activeDelay.type === 'custom' ? (
                  <MessageSquare className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                    {batch.activeDelay.type === 'custom' ? 'OPERATOR BROADCAST NOTICE' : 'ACTIVE DELAY ADVISORY'}
                  </span>
                  {batch.activeDelay.addedHours > 0 ? (
                    <span className="text-xs font-mono font-bold text-amber-900">
                      +{batch.activeDelay.addedHours} Hours
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-amber-900">
                      Status Update
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-amber-950 mt-1">
                  {batch.activeDelay.title}
                </h2>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-2xl">
                  {batch.activeDelay.reason}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-amber-100/70 p-3 rounded-lg border border-amber-300">
              <span className="text-[11px] text-amber-800 block font-medium">Target / Revised ETA:</span>
              <span className="text-base font-bold font-mono text-amber-950">{batch.activeDelay.revisedEta}</span>
            </div>
          </div>

          {/* Operational Context */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-900">
            <div className="p-3 bg-white/80 rounded-lg border border-amber-200 flex items-center space-x-2.5">
              {batch.activeDelay.type === 'custom' ? (
                <Send className="w-4 h-4 text-amber-700 shrink-0" />
              ) : (
                <CloudRain className="w-4 h-4 text-amber-700 shrink-0" />
              )}
              <div>
                <span className="font-bold block">Advisory Nature</span>
                <span className="text-[11px] text-amber-800 truncate block max-w-[170px]">{batch.activeDelay.title}</span>
              </div>
            </div>

            <div className="p-3 bg-white/80 rounded-lg border border-amber-200 flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold block">Desk Authority</span>
                <span className="text-[11px] text-amber-800">{batch.counter} ({batch.activeDelay.broadcastBy || batch.operatorCode})</span>
              </div>
            </div>

            <div className="p-3 bg-white/80 rounded-lg border border-amber-200 flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold block">Ready Window</span>
                <span className="text-[11px] text-amber-800">{batch.activeDelay.revisedEta}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={clearDelay}
              className="text-xs text-amber-800 hover:text-amber-950 underline font-medium"
            >
              Clear Notice / Advisory (Resume Target ETA: {batch.targetEta || batch.baseEta || 'Normal Schedule'})
            </button>
          </div>
        </div>
      )}

      {/* Notifications Log */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-700" />
              <span>Timestamped Alert Log</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditable notifications for Batch #{batch.id}.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('delays')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filter === 'delays'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Delays
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filter === 'ready'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Readiness
            </button>
          </div>
        </div>

        {/* Alerts list */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No alerts in this category yet.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              let alertBorder = 'border-slate-200 bg-slate-50/60';
              let icon = <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />;

              if (alert.type === 'amber') {
                alertBorder = 'border-amber-200 bg-amber-50/50';
                icon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
              } else if (alert.type === 'emerald') {
                alertBorder = 'border-emerald-200 bg-emerald-50/50';
                icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
              }

              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-lg border ${alertBorder} flex items-start space-x-3 transition-colors`}
                >
                  {icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
