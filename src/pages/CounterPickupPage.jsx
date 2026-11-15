import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Package,
  Layers,
  Lock,
  XCircle,
  FileText,
  Printer,
  Sparkles,
  QrCode,
  Clock,
  Plus
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import DisputeModal from '../components/DisputeModal';

export default function CounterPickupPage() {
  const {
    batch,
    confirmAllReceived,
    submitDisputeTicket,
    tickets,
    navigateTo,
    startNewDropOff
  } = useLaundry();

  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  // Verification state for each garment category
  const [checkedItems, setCheckedItems] = useState({
    shirts: batch?.isDelivered ?? false,
    trousers: batch?.isDelivered ?? false,
    hoodies: batch?.isDelivered ?? false,
    bedsheets: batch?.isDelivered ?? false,
  });

  // Keep in sync if batch marked delivered
  useEffect(() => {
    if (batch?.isDelivered) {
      setCheckedItems({
        shirts: true,
        trousers: true,
        hoodies: true,
        bedsheets: true,
      });
    }
  }, [batch?.isDelivered]);

  // If NO batch exists at all
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
            <CheckSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Active Batch for Counter Pickup</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You must drop off a clothes bundle first to access the counter pickup audit and reconciliation.
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

  // If batch exists but is NOT ready for pickup yet
  if (!batch.isReady && !batch.isDelivered) {
    return (
      <div className="space-y-6">
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
            <span className="text-slate-600">COUNTER #2 DESK</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
              PROCESSING IN PROGRESS
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              No Batch Ready for Pickup Yet
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Batch #{batch.id} ({Object.values(batch.garments).reduce((a, b) => a + Number(b || 0), 0)} items) is currently in processing. Target ETA: <strong className="font-mono text-slate-800">{batch.activeDelay ? batch.activeDelay.revisedEta : (batch.targetEta || batch.baseEta || 'Pending Staff Schedule')}</strong>.
            </p>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 max-w-md mx-auto">
            Once staff complete steam press &amp; folding and click <strong>"Mark Batch Ready for Pickup (Rack #24)"</strong> on the Counter Staff Console, this verification checklist will unlock immediately.
          </p>
        </div>
      </div>
    );
  }

  const toggleCheck = (category) => {
    if (batch.isDelivered) return;
    setCheckedItems((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const totalGarments = Object.values(batch.garments).reduce((a, b) => a + Number(b || 0), 0);
  const allVerified = Object.keys(batch.garments).every((k) => checkedItems[k]);

  const handleCompletePickup = () => {
    if (!allVerified) {
      alert("Please verify and check off all returned garment categories before closing the batch.");
      return;
    }
    confirmAllReceived();
  };

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
          <span className="text-slate-600">RACK {batch.rack} • COUNTER 2</span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Counter Pickup &amp; Garment Checklist Verification
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side reconciliation between locked intake proof and returned garments at Counter #2.
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2.5 mt-3">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p>
            Before accepting your laundry bundle from Operator #OP-409, inspect each piece against the locked intake photo taken during drop-off. If any item is missing or damaged, report a dispute immediately before leaving the counter.
          </p>
        </div>
      </div>

      {/* DELIVERED DIGITAL RECEIPT (If Batch Delivered) */}
      {batch.isDelivered && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-emerald-200 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                  TRANSACTION COMPLETE &amp; ARCHIVED
                </span>
                <h2 className="text-base sm:text-lg font-bold text-emerald-950 mt-1">
                  Digital Collection Receipt — Batch #{batch.id}
                </h2>
                <p className="text-xs text-emerald-800 font-mono mt-0.5">
                  Delivered at Counter #2 on {batch.deliveredAt || 'Today'} • Signed off by {batch.studentCode} &amp; {batch.operatorCode}
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 block text-[11px]">Total Items Returned</span>
              <strong className="text-slate-900 font-mono text-sm">{totalGarments} of {totalGarments} (100%)</strong>
            </div>
            <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 block text-[11px]">Intake Audit Hash</span>
              <strong className="text-slate-900 font-mono text-xs">SHA-256: 7f8c9b2</strong>
            </div>
            <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 block text-[11px]">Dispute Status</span>
              <strong className="text-emerald-700 font-mono text-xs">ZERO DISCREPANCIES</strong>
            </div>
            <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 block text-[11px]">Desk Clearance</span>
              <strong className="text-slate-900 font-mono text-xs">Rack {batch.rack} Cleared</strong>
            </div>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE VERIFICATION WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Locked Intake Photo Proof (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-700" />
                  <span>Locked Drop-Off Photo Proof</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Locked on: {batch.intakeLockedAt}
                </p>
              </div>

              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                IMMUTABLE EVIDENCE
              </span>
            </div>

            {/* Exact fixed-size container preserving natural aspect ratio without stretching */}
            <div className="w-full h-64 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
              {batch.intakePhoto ? (
                <img
                  src={batch.intakePhoto}
                  alt="Locked Intake Proof"
                  className="max-h-full max-w-full w-auto h-auto object-contain"
                />
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  Intake photo not loaded
                </div>
              )}
            </div>

            {/* Clean HTML Text Metadata below container */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>Batch #{batch.id} • {batch.studentCode}</span>
              <span className="text-emerald-700 font-semibold">✓ Exact Raw Proof</span>
            </div>

            {/* Breakdown summary */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">
                Registered Garments ({totalGarments} Pieces Total):
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-800 font-mono">
                <div>• Shirts: <strong>{batch.garments.shirts || 0} pcs</strong></div>
                <div>• Trousers: <strong>{batch.garments.trousers || 0} pcs</strong></div>
                <div>• Hoodies: <strong>{batch.garments.hoodies || 0} pcs</strong></div>
                <div>• Bedsheet: <strong>{batch.garments.bedsheets || 0} pcs</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Return Checklist (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-700" />
                  <span>Physical Garment Reconciliation Checklist</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tick each returned garment category as you inspect it at Counter 2.
                </p>
              </div>

              <div className="text-right">
                <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded ${
                  allVerified
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {Object.values(checkedItems).filter(Boolean).length} / 4 Categories
                </span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5">
              {/* Shirts */}
              <div
                onClick={() => toggleCheck('shirts')}
                className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  checkedItems.shirts
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    checkedItems.shirts ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                  }`}>
                    {checkedItems.shirts && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">
                      Shirts / T-Shirts ({batch.garments.shirts || 0} / {batch.garments.shirts || 0} Returned)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Collars inspected, buttons intact, no color bleeding.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold">{batch.garments.shirts || 0} pcs</span>
              </div>

              {/* Trousers */}
              <div
                onClick={() => toggleCheck('trousers')}
                className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  checkedItems.trousers
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    checkedItems.trousers ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                  }`}>
                    {checkedItems.trousers && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">
                      Trousers / Jeans ({batch.garments.trousers || 0} / {batch.garments.trousers || 0} Returned)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Zippers functional, steam creases aligned.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold">{batch.garments.trousers || 0} pcs</span>
              </div>

              {/* Hoodies */}
              <div
                onClick={() => toggleCheck('hoodies')}
                className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  checkedItems.hoodies
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    checkedItems.hoodies ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                  }`}>
                    {checkedItems.hoodies && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">
                      Hoodies / Jackets ({batch.garments.hoodies || 0} / {batch.garments.hoodies || 0} Returned)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Drawstrings present, fleece texture preserved.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold">{batch.garments.hoodies || 0} pcs</span>
              </div>

              {/* Bedsheets */}
              <div
                onClick={() => toggleCheck('bedsheets')}
                className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  checkedItems.bedsheets
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    checkedItems.bedsheets ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                  }`}>
                    {checkedItems.bedsheets && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">
                      Bedsheets / Linen ({batch.garments.bedsheets || 0} / {batch.garments.bedsheets || 0} Returned)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Standard university linen neatly folded and pressed.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold">{batch.garments.bedsheets || 0} pcs</span>
              </div>
            </div>

            {/* TWO WORKING OUTCOMES: Confirm All vs Report Missing */}
            {!batch.isDelivered ? (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <button
                  type="button"
                  onClick={handleCompletePickup}
                  disabled={!allVerified}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
                    allVerified
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {allVerified
                      ? `Confirm All ${totalGarments} Items Received & Close Batch`
                      : `Tick all 4 categories to enable pickup (${Object.values(checkedItems).filter(Boolean).length}/4 checked)`}
                  </span>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setDisputeModalOpen(true)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center justify-center space-x-1.5 mx-auto py-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report Missing / Damaged Item (Generate Ticket #TCK-9921)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Core loop completed. Batch is archived.</span>
                <span className="text-emerald-700 font-bold">✓ VERIFIED BY {batch.studentCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DISPUTE TICKETS LIST (If Any Ticket Filed) */}
      {tickets.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-red-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-sm font-bold text-red-950">Active Counter Dispute Tickets</h3>
                <p className="text-xs text-red-700">Formal discrepancies registered with attached intake photo proof.</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded">
              {tickets.length} ACTIVE TICKET{tickets.length > 1 ? 'S' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                      #{t.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 capitalize">
                      Issue: {t.issueType.replace('_', ' ')} ({t.affectedCount} {t.category})
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                    Filed: {t.createdAt}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                  "{t.description}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600 font-mono">
                  <span>SLA Guarantee: <strong className="text-red-700">{t.slaDeadline}</strong></span>
                  <span>Investigation: <strong className="text-slate-800">{t.resolutionAction}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        batchId={batch.id}
        studentCode={batch.studentCode}
        operatorCode={batch.operatorCode}
        intakePhoto={batch.intakePhoto}
        garments={batch.garments}
        onSubmitTicket={submitDisputeTicket}
      />
    </div>
  );
}
