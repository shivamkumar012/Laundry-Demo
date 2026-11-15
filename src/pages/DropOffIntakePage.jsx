import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Minus,
  Camera,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Send,
  LogIn,
  Info,
  Lock,
  Clock
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import IntakeCanvasCapture from '../components/IntakeCanvasCapture';
import { generateBundleCanvasImage } from '../utils/canvasHelper';

export default function DropOffIntakePage() {
  const {
    batch,
    submitDropOff,
    navigateTo,
    hostellerAuth,
    openSignInModal
  } = useLaundry();

  // All counters start at 0
  const [garments, setGarments] = useState({
    shirts: 0,
    trousers: 0,
    hoodies: 0,
    bedsheets: 0,
  });

  const [photoData, setPhotoData] = useState(null);
  const [pocketsChecked, setPocketsChecked] = useState(false);
  const [tagsAttached, setTagsAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // IF BATCH IS ALREADY SUBMITTED: RENDER IMMUTABLE READ-ONLY INTAKE RECORD
  if (batch) {
    const totalGarments = Object.values(batch.garments || {}).reduce((a, b) => a + Number(b || 0), 0);
    const isHandshakeLocked = batch.handshakeStatus === 'completed';

    return (
      <div className="space-y-6">
        {/* Header navigation & batch badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => navigateTo('dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Hosteller Dashboard</span>
          </button>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="bg-slate-200 text-slate-800 px-2.5 py-1 rounded font-bold">
              BATCH #{batch.id}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-600">{batch.hostel} • {batch.counter}</span>
          </div>
        </div>

        {/* 1. PROMINENT LOCKED BANNER */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isHandshakeLocked ? 'bg-emerald-600 text-white' : 'bg-blue-700 text-white'
                }`}
              >
                {isHandshakeLocked ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                    Intake Proof Submitted &amp; Locked (Batch #{batch.id})
                  </h1>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isHandshakeLocked
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isHandshakeLocked ? 'IMMUTABLE AUDIT RECORD' : 'SUBMITTED TO COUNTER'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Submitted at <strong className="font-mono text-slate-800">{batch.dropOffTime}</strong> by <strong className="font-mono text-slate-800">{batch.studentCode}</strong> ({batch.hostel}).
                </p>
              </div>
            </div>

            {/* Current Verification Status Badge */}
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Verification Status
              </span>
              {isHandshakeLocked ? (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified &amp; Locked by {batch.operatorCode}</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Waiting for Counter Staff Handshake</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Intake itemization and proof image cannot be edited after counter submission.</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Target ETA: <strong className="text-slate-800">{batch.targetEta || 'Pending Staff Schedule'}</strong>
            </div>
          </div>
        </div>

        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Read-Only Garment Breakdown Table/List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-blue-700" />
                    <span>Submitted Garment Breakdown</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">Immutable physical counts verified at intake.</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-blue-700">{totalGarments}</span>
                  <span className="text-xs text-slate-500 block leading-none font-medium">Total Items</span>
                </div>
              </div>

              {/* Static uneditable counts - Zero +/- buttons */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Shirts / T-Shirts</h3>
                    <p className="text-[11px] text-slate-500">Casual polos, formals, round neck</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
                      {batch.garments?.shirts || 0} pcs
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Trousers / Jeans</h3>
                    <p className="text-[11px] text-slate-500">Denim, chinos, track pants</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
                      {batch.garments?.trousers || 0} pcs
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Hoodies / Jackets</h3>
                    <p className="text-[11px] text-slate-500">Winterwear, sweatshirts, fleece</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
                      {batch.garments?.hoodies || 0} pcs
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Bedsheets / Linen</h3>
                    <p className="text-[11px] text-slate-500">Single bedsheet, pillow cover, towel</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
                      {batch.garments?.bedsheets || 0} pcs
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Summary Row */}
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 flex items-center justify-between text-xs font-medium">
                <span className="text-blue-900">Total Count Registered:</span>
                <span className="font-mono font-bold text-sm text-blue-900">{totalGarments} Items Total</span>
              </div>

              {/* Pre-check confirmations (locked/checked) */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">All pockets emptied (IDs, keys, currency removed)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Permanent barcode tag checked on garments</span>
                </div>
              </div>
            </div>

            {/* Handshake Sign-Off Summary Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Two-Way Accountability
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Resident Sign-Off:</span>
                  <strong className="font-mono text-slate-900">{batch.studentCode}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Staff Verification:</span>
                  <strong className="font-mono text-slate-900">{batch.operatorCode}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Read-Only Attached Intake Photo (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-blue-700" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Locked Counter Intake Photo Proof
                  </h2>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isHandshakeLocked
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {isHandshakeLocked ? 'Physical Bundle Verified' : 'Locked Raw Evidence'}
                </span>
              </div>

              {/* Exact raw untouched photo in fixed container - ZERO retake/replace/clear buttons */}
              <div className="w-full h-72 sm:h-80 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
                {batch.intakePhoto ? (
                  <img
                    src={batch.intakePhoto}
                    alt="Submitted Intake Bundle Photo Proof"
                    className="max-h-full max-w-full w-auto h-auto object-contain"
                  />
                ) : (
                  <div className="text-xs text-slate-400">No Photo Registered</div>
                )}
              </div>

              {/* Clean HTML Text Metadata below container */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <strong>BATCH #{batch.id}</strong> • {batch.studentCode}
                </div>
                <div className="text-slate-500">
                  Registered: {batch.dropOffTime}
                </div>
                <div className="text-slate-500">
                  {batch.counter} • {batch.hostel}
                </div>
              </div>

              {/* Navigation Actions below photo */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Hosteller Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('alerts')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border border-slate-200"
                >
                  <span>View Alerts &amp; Delay Updates</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = Object.values(garments).reduce((a, b) => a + Number(b || 0), 0);
  const studentTag = hostellerAuth ? `Student ${hostellerAuth.residentId}` : 'Student (Unsigned)';
  const hostelTag = hostellerAuth ? hostellerAuth.hostelBlock : 'Hostel BH-11';
  const cleanBlock = hostelTag.replace('-', '');
  const activeBatchId = `${cleanBlock}-001`;

  const updateGarment = (category, delta) => {
    setErrorMessage(null);
    setGarments((prev) => {
      const nextVal = Math.max(0, (prev[category] || 0) + delta);
      return { ...prev, [category]: nextVal };
    });
  };

  const handleSubmitToCounter = () => {
    setErrorMessage(null);

    if (!hostellerAuth) {
      openSignInModal('hosteller');
      setErrorMessage("Please sign in with your Resident ID before submitting your drop-off.");
      return;
    }

    if (totalItems === 0) {
      setErrorMessage("Please count at least 1 garment before submitting to counter.");
      return;
    }

    let finalPhoto = photoData;
    if (!finalPhoto) {
      // Auto-generate bundle graphic if student hasn't taken a custom photo
      finalPhoto = generateBundleCanvasImage(garments, activeBatchId, studentTag, 'Counter Desk');
      setPhotoData(finalPhoto);
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = submitDropOff(garments, finalPhoto);
      setIsSubmitting(false);
      if (success) {
        navigateTo('dashboard');
      }
    }, 250);
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
            BATCH #{activeBatchId}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-600">{hostelTag} • COUNTER 2</span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                Laundry Drop-Off &amp; Intake Proof Submission
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical bundle itemization and photo evidence registration for <strong className="font-mono text-slate-800">{studentTag}</strong> ({hostelTag}).
              </p>
            </div>
          </div>

          {!hostellerAuth && (
            <button
              onClick={() => openSignInModal('hosteller')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In as Resident</span>
            </button>
          )}
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2.5 mt-3">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p>
            Two-Way Handshake Rule: You itemize garments and submit your photo proof. Counter staff will physically verify the clothes against your photo on the desk before officially completing the handshake and loading the washer.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Garment Steppers (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-blue-700" />
                  <span>Garment Itemization</span>
                </h2>
                <p className="text-[11px] text-slate-500">Count physical pieces handed to counter.</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-blue-700">{totalItems}</span>
                <span className="text-xs text-slate-500 block leading-none font-medium">Pieces</span>
              </div>
            </div>

            {/* Steppers */}
            <div className="space-y-3">
              {/* Shirts */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Shirts / T-Shirts</h3>
                  <p className="text-[11px] text-slate-500">Casual polos, formals, round neck</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => updateGarment('shirts', -1)}
                    disabled={garments.shirts === 0}
                    className="w-7 h-7 rounded-md bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-slate-700 font-bold transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-slate-900">
                    {garments.shirts}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateGarment('shirts', 1)}
                    className="w-7 h-7 rounded-md bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Trousers */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Trousers / Jeans</h3>
                  <p className="text-[11px] text-slate-500">Denim, chinos, track pants</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => updateGarment('trousers', -1)}
                    disabled={garments.trousers === 0}
                    className="w-7 h-7 rounded-md bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-slate-700 font-bold transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-slate-900">
                    {garments.trousers}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateGarment('trousers', 1)}
                    className="w-7 h-7 rounded-md bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Hoodies */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Hoodies / Jackets</h3>
                  <p className="text-[11px] text-slate-500">Winterwear, sweatshirts, fleece</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => updateGarment('hoodies', -1)}
                    disabled={garments.hoodies === 0}
                    className="w-7 h-7 rounded-md bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-slate-700 font-bold transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-slate-900">
                    {garments.hoodies}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateGarment('hoodies', 1)}
                    className="w-7 h-7 rounded-md bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bedsheets */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Bedsheets / Linen</h3>
                  <p className="text-[11px] text-slate-500">Single bedsheet, pillow cover, towel</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => updateGarment('bedsheets', -1)}
                    disabled={garments.bedsheets === 0}
                    className="w-7 h-7 rounded-md bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-slate-700 font-bold transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-slate-900">
                    {garments.bedsheets}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateGarment('bedsheets', 1)}
                    className="w-7 h-7 rounded-md bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pocketsChecked}
                  onChange={(e) => setPocketsChecked(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4"
                />
                <span className="font-medium">All pockets emptied (keys, coins, IDs removed)</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tagsAttached}
                  onChange={(e) => setTagsAttached(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4"
                />
                <span className="font-medium">Permanent hostel barcode tag checked on garments</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Photo Proof & Submission (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <IntakeCanvasCapture
            garments={garments}
            batchId={activeBatchId}
            studentCode={studentTag}
            operatorCode="Counter 2"
            currentPhoto={photoData}
            onPhotoCaptured={(dataUrl) => {
              setPhotoData(dataUrl);
              setErrorMessage(null);
            }}
          />

          {/* Clean Student Submission Card (Replacing premature fake handshake) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-700" />
                  <span>Submit Drop-Off to Counter Desk</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your bundle and photo will be transmitted to the Counter Operator's console for physical matching.
                </p>
              </div>

              <div className="text-right font-mono text-[11px] text-slate-500">
                <span>{hostelTag} • Desk #2</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Resident Submission</span>
                <span className="font-mono font-bold text-slate-900">{studentTag}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Initial Status</span>
                <span className="text-amber-700 font-semibold font-mono">Pending Operator Match</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitToCounter}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                totalItems > 0
                  ? 'bg-blue-700 hover:bg-blue-800 hover:shadow-lg active:scale-98'
                  : 'bg-slate-400 hover:bg-slate-500'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Transmitting Drop-Off to Desk...'
                  : totalItems > 0
                  ? `Submit Drop-Off & Photo Proof to Counter (${totalItems} Items)`
                  : 'Add Garments Above to Submit Drop-Off'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
