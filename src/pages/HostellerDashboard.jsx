import React from 'react';
import {
  WashingMachine,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Video,
  FileCheck,
  Package,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Plus,
  Info,
  Eye,
  LogIn
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

export default function HostellerDashboard() {
  const {
    batch,
    navigateTo,
    startNewDropOff,
    hostellerAuth,
    openSignInModal
  } = useLaundry();

  // If NO active batch exists yet, render clean empty state card
  if (!batch) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto shadow-xs">
            <WashingMachine className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 font-mono">
              {hostellerAuth ? `${hostellerAuth.hostelBlock} • CENTRAL LAUNDRY` : 'CAMPUS HOSTEL LAUNDRY PORTAL'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              No Active Laundry Batches Yet
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {hostellerAuth ? (
                <>
                  Logged in as <strong className="font-mono text-slate-800">Resident {hostellerAuth.residentId} ({hostellerAuth.hostelBlock})</strong>. Drop off your garments at Counter #2 to initialize an authenticated intake tally.
                </>
              ) : (
                'You have no active laundry batches registered. Sign in with your Resident ID and drop off your clothes bundle at Counter #2.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={startNewDropOff}
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold inline-flex items-center space-x-2 transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Laundry Drop-Off</span>
            </button>

            {!hostellerAuth && (
              <button
                onClick={() => openSignInModal('hosteller')}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold inline-flex items-center space-x-1.5 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In First</span>
              </button>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <strong className="block text-slate-900 font-semibold mb-0.5">1. Student Drop-Off</strong>
              <span className="text-[11px] text-slate-500">Itemize garments and attach photo proof.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <strong className="block text-slate-900 font-semibold mb-0.5">2. Staff Handshake</strong>
              <span className="text-[11px] text-slate-500">Counter staff physically verifies bundle on desk.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <strong className="block text-slate-900 font-semibold mb-0.5">3. Live Audit &amp; Pickup</strong>
              <span className="text-[11px] text-slate-500">Inspect wash video and reconcile items at pickup.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalGarments = Object.values(batch.garments).reduce((a, b) => a + Number(b || 0), 0);

  // 5 Step tracker items
  const steps = [
    {
      step: 1,
      name: 'Dropped Off',
      subtext: batch.dropOffTime,
      completed: true,
      current: batch.currentStep === 1 && batch.handshakeStatus === 'pending'
    },
    {
      step: 2,
      name: batch.handshakeStatus === 'completed' ? 'Handshake Signed' : 'Staff Handshake',
      subtext: batch.handshakeStatus === 'completed'
        ? `Signed by ${batch.operatorCode}`
        : 'Waiting for Staff Match',
      completed: batch.handshakeStatus === 'completed',
      current: batch.handshakeStatus === 'pending',
      isPendingHandshake: batch.handshakeStatus === 'pending'
    },
    {
      step: 3,
      name: 'Washing & Video',
      subtext: batch.studentVerifiedVideo ? 'Verified by Resident' : (batch.videoPublished ? 'CCTV Clip Live' : 'Awaiting Wash'),
      completed: batch.currentStep >= 3,
      current: batch.currentStep === 3 && batch.handshakeStatus === 'completed'
    },
    {
      step: 4,
      name: 'Drying / Delay',
      subtext: batch.activeDelay ? batch.activeDelay.title : (batch.currentStep >= 4 ? 'Industrial Tumbler' : 'Awaiting Stage'),
      completed: batch.currentStep >= 4,
      current: batch.currentStep === 4,
      isDelayed: !!batch.activeDelay
    },
    {
      step: 5,
      name: 'Ready for Pickup',
      subtext: batch.isReady
        ? `${batch.counter} • ${batch.rack}`
        : batch.activeDelay
        ? 'Target ETA: ' + batch.activeDelay.revisedEta
        : batch.targetEta
        ? 'Target ETA: ' + batch.targetEta
        : 'Pending Staff Schedule',
      completed: batch.isReady || batch.isDelivered,
      current: batch.currentStep === 5 && !batch.isDelivered,
      isReady: batch.isReady
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Active Batch Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200">
                {batch.hostel}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Desk: {batch.counter}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Active Laundry Batch #{batch.id}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Accountability record for Resident <strong className="text-slate-800 font-mono">{batch.studentCode}</strong> under <strong className="text-slate-800 font-mono">{batch.operatorCode}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:items-end justify-center">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Collection ETA:</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
              {batch.isDelivered ? (
                <span className="text-slate-500">Delivered</span>
              ) : batch.isReady ? (
                <span className="text-emerald-600">READY NOW</span>
              ) : batch.activeDelay ? (
                <span className="text-amber-600">{batch.activeDelay.revisedEta}</span>
              ) : batch.targetEta ? (
                <span className="text-blue-700">{batch.targetEta}</span>
              ) : (
                <span className="text-amber-600 text-xs sm:text-sm font-sans font-semibold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  Pending Staff Schedule
                </span>
              )}
            </div>
            {batch.activeDelay && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-0.5">
                +{batch.activeDelay.addedHours}h Delay Adjusted
              </span>
            )}
          </div>
        </div>

        {/* 5-Step Visual Progress Tracker */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Audit Pipeline Stages (5-Step Accountability Flow)
            </h2>
            <span className="text-xs font-semibold text-blue-700">
              {batch.isDelivered ? 'Stage: 5 of 5 (Delivered)' : `Stage: ${Math.min(batch.currentStep, 5)} of 5`}
            </span>
          </div>

          {/* Desktop/Tablet Horizontal Stepper */}
          <div className="hidden sm:grid grid-cols-5 gap-2 relative">
            {steps.map((st) => {
              const isPast = st.completed;
              const isCurr = st.current;

              let iconBg = 'bg-slate-100 text-slate-400 border-slate-200';
              if (isPast) iconBg = 'bg-emerald-600 text-white border-emerald-600';
              if (isCurr && st.isPendingHandshake) iconBg = 'bg-amber-600 text-white border-amber-600 ring-4 ring-amber-100 animate-pulse';
              else if (isCurr) iconBg = 'bg-blue-700 text-white border-blue-700 ring-4 ring-blue-100';

              return (
                <div key={st.step} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all shadow-xs ${iconBg}`}
                  >
                    {isPast && !isCurr ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span>{st.step}</span>
                    )}
                  </div>
                  <span className={`text-xs font-bold mt-2 leading-tight ${isCurr ? 'text-blue-700' : isPast ? 'text-slate-900' : 'text-slate-500'}`}>
                    {st.name}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 leading-tight font-mono">
                    {st.subtext}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Stepper */}
          <div className="sm:hidden space-y-3 pt-1">
            {steps.map((st) => {
              const isPast = st.completed;
              const isCurr = st.current;

              let dotClass = 'bg-slate-200 text-slate-500';
              if (isPast) dotClass = 'bg-emerald-600 text-white';
              if (isCurr && st.isPendingHandshake) dotClass = 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse';
              else if (isCurr) dotClass = 'bg-blue-700 text-white ring-4 ring-blue-100';

              return (
                <div key={st.step} className="flex items-start space-x-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${dotClass}`}>
                    {isPast && !isCurr ? <CheckCircle2 className="w-4 h-4" /> : st.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isCurr ? 'text-blue-700' : isPast ? 'text-slate-900' : 'text-slate-500'}`}>
                        {st.name}
                      </span>
                      {isCurr && (
                        <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{st.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PENDING COUNTER HANDSHAKE BANNER */}
      {batch.handshakeStatus === 'pending' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                  STAGE 2: AWAITING OPERATOR HANDSHAKE
                </span>
              </div>
              <h3 className="text-sm font-bold text-amber-950 mt-1">
                Waiting for Counter Staff to Match Bundle &amp; Complete Handshake
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Your bundle of {totalGarments} items has been submitted to {batch.counter}. The desk operator will physically verify the clothes against your photo on screen before locking the handshake.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('dropoff')}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold whitespace-nowrap shadow-xs"
          >
            <span>View Intake Proof</span>
          </button>
        </div>
      )}

      {/* ACTIVE DELAY / OPERATOR BROADCAST BANNER */}
      {batch.activeDelay && !batch.isDelivered && (
        <div className="bg-amber-50 border-l-4 border-amber-600 rounded-r-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                  {batch.activeDelay.type === 'custom' ? 'Operator Broadcast Notice' : 'Active Delay Advisory'}
                </span>
                {batch.activeDelay.addedHours > 0 ? (
                  <span className="text-xs font-mono font-semibold text-amber-800">
                    +{batch.activeDelay.addedHours} Hours
                  </span>
                ) : (
                  <span className="text-xs font-mono font-semibold text-amber-800">
                    Status Update
                  </span>
                )}
                {batch.activeDelay.broadcastBy && (
                  <span className="text-[11px] font-mono text-amber-800">
                    • {batch.activeDelay.broadcastBy}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-amber-900 mt-1">
                {batch.activeDelay.title}
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {batch.activeDelay.reason}
                {batch.activeDelay.revisedEta && (
                  <> Revised Collection ETA: <strong className="font-mono">{batch.activeDelay.revisedEta}</strong>.</>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('alerts')}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold whitespace-nowrap shadow-xs flex items-center gap-1.5"
          >
            <span>View in Alerts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* READY FOR PICKUP BANNER (If Marked Ready) */}
      {batch.isReady && !batch.isDelivered && (
        <div className="bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                  Ready For Collection
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  {batch.rack}
                </span>
              </div>
              <h3 className="text-sm font-bold text-emerald-950 mt-1">
                Batch #{batch.id} Shelved at {batch.counter} ({batch.rack})
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                All {totalGarments} items have passed steam press &amp; folding audit. Bring your digital token to {batch.counter}.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('pickup')}
            className="self-start sm:self-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shadow-sm flex items-center gap-1.5"
          >
            <span>Proceed to Counter Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DELIVERED & CLOSED BANNER (If Marked Delivered) */}
      {batch.isDelivered && (
        <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-slate-200 text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Batch #{batch.id} Successfully Delivered &amp; Closed
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 font-mono">
                Closed at {batch.deliveredAt || 'Today'} • Signed off by {batch.studentCode} &amp; {batch.operatorCode}
              </p>
            </div>
          </div>
          <button
            onClick={startNewDropOff}
            className="px-3.5 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800"
          >
            Start Fresh Drop-Off
          </button>
        </div>
      )}

      {/* Garment Summary & Quick Previews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Exact Garment Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Garment Breakdown</h3>
            </div>
            <span className="text-xs font-bold font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              {totalGarments} Items Total
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Shirts (Casual / Collared)</span>
              <span className="font-mono font-bold text-slate-900">{batch.garments.shirts || 0} pcs</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Trousers (Jeans / Track)</span>
              <span className="font-mono font-bold text-slate-900">{batch.garments.trousers || 0} pcs</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600">Hoodies / Jackets</span>
              <span className="font-mono font-bold text-slate-900">{batch.garments.hoodies || 0} pcs</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-600">Bedsheets / Linen</span>
              <span className="font-mono font-bold text-slate-900">{batch.garments.bedsheets || 0} pcs</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigateTo('dropoff')}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Inspect Intake Proof</span>
            </button>
          </div>
        </div>

        {/* Card 2: Wash-Batch Video Spot-Check Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Wash-Batch CCTV</h3>
            </div>
            {batch.studentVerifiedVideo ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Verified
              </span>
            ) : batch.videoPublished ? (
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                0:06s Clip
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Pending Wash
              </span>
            )}
          </div>

          <div
            onClick={() => navigateTo('video')}
            className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative cursor-pointer group border border-slate-200 flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-blue-700/80 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Eye className="w-5 h-5 ml-0.5" />
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-1 rounded">
              <span>{batch.washerUnit}</span>
              <span>BATCH #{batch.id}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            {batch.videoPublished
              ? 'Watch tumbling drum clip to inspect your clothing tags and verify washer hygiene.'
              : 'Awaiting operator to load washer and publish optical verification clip.'}
          </p>

          <button
            onClick={() => navigateTo('video')}
            className="w-full py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Watch Wash-Batch Video</span>
          </button>
        </div>

        {/* Card 3: Counter Verification & Collection Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Counter Desk</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">{batch.hostel}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Counter:</span>
              <span className="font-bold text-slate-900">{batch.counter}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Assigned Rack:</span>
              <span className="font-bold text-slate-900 font-mono">{batch.isReady ? batch.rack : 'Pending Folding'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Handshake Status:</span>
              <span className={`font-mono font-bold ${batch.handshakeStatus === 'completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {batch.handshakeStatus === 'completed' ? 'COMPLETED & LOCKED' : 'PENDING OPERATOR'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            When marked ready, cross-examine each garment with your locked intake proof before signing off.
          </p>

          <button
            onClick={() => navigateTo('pickup')}
            disabled={!batch.isReady && !batch.isDelivered}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
              batch.isReady
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : batch.isDelivered
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {batch.isDelivered ? 'View Delivery Receipt' : batch.isReady ? 'Verify & Collect at Counter' : 'Verify & Collect (Pending Ready)'}
            </span>
          </button>
        </div>
      </div>

      {/* Real Connected 4 Navigation Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Connected Portal Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => navigateTo('dropoff')}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <FileCheck className="w-5 h-5 text-blue-700" />
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-2">
              Start New Drop-Off
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tally garments &amp; attach photo proof.
            </p>
          </button>

          <button
            onClick={() => navigateTo('video')}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <Video className="w-5 h-5 text-blue-700" />
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-2">
              Watch Wash-Batch Video
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Verify your distinct clothes in Washer #W-08.
            </p>
          </button>

          <button
            onClick={() => navigateTo('alerts')}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-2">
              View Alerts &amp; Delays
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Check weather notices &amp; revised ETA.
            </p>
          </button>

          <button
            onClick={() => navigateTo('pickup')}
            className={`p-3.5 rounded-lg border text-left transition-all group ${
              batch.isReady
                ? 'border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70'
                : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <CheckCircle2 className={`w-5 h-5 ${batch.isReady ? 'text-emerald-600' : 'text-slate-500'}`} />
              <ChevronRight className={`w-4 h-4 ${batch.isReady ? 'text-emerald-700' : 'text-slate-400'} group-hover:translate-x-0.5 transition-transform`} />
            </div>
            <h4 className={`text-xs font-bold mt-2 ${batch.isReady ? 'text-emerald-950' : 'text-slate-900'}`}>
              Verify &amp; Collect at Counter
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Itemized checklist &amp; dispute report.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
