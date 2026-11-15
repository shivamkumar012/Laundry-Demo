import React, { useState, useRef } from 'react';
import {
  Shield,
  CheckCircle2,
  Video,
  AlertTriangle,
  Clock,
  Sparkles,
  CloudRain,
  Wrench,
  Users,
  Layers,
  ArrowRight,
  User,
  Package,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  CheckSquare,
  Image as ImageIcon,
  LogIn,
  Lock,
  UploadCloud,
  FileVideo,
  Send
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

export default function StaffConsolePage() {
  const {
    batch,
    staffCompleteHandshake,
    staffPublishWashVideo,
    broadcastDelay,
    broadcastCustomMessage,
    clearDelay,
    markBatchReady,
    tickets,
    setUserRole,
    navigateTo,
    staffAuth,
    openSignInModal
  } = useLaundry();

  const [bundleMatchesChecked, setBundleMatchesChecked] = useState(false);
  const [assignedEta, setAssignedEta] = useState('Today, 5:30 PM');

  // Real Video file upload ref
  const videoFileInputRef = useRef(null);

  // Unconfirmed draft video file state
  const [pendingVideo, setPendingVideo] = useState(null); // { url, fileName }

  // Hard lock check: either confirmed video or batch is marked ready/delivered
  const isVideoEvidenceLocked = batch?.isVideoLocked || batch?.isReady || batch?.isDelivered;

  // Custom broadcast message states
  const [customMsgText, setCustomMsgText] = useState('');
  const [customDelayHours, setCustomDelayHours] = useState('');
  const [customEtaInput, setCustomEtaInput] = useState('');

  const totalGarments = batch ? Object.values(batch.garments).reduce((a, b) => a + Number(b || 0), 0) : 0;
  const operatorTag = staffAuth ? `Operator #${staffAuth.operatorId}` : 'Staff (Unsigned)';
  const counterTag = staffAuth ? staffAuth.counterNumber : 'Counter 2';

  const handleVideoFileChange = (e) => {
    if (isVideoEvidenceLocked) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!staffAuth) {
      openSignInModal('staff');
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    // Keep in local unconfirmed draft preview first
    setPendingVideo({ url: videoUrl, fileName: file.name });
    e.target.value = '';
  };

  const handleConfirmAndPublishVideo = () => {
    if (!pendingVideo || isVideoEvidenceLocked) return;
    if (!staffAuth) {
      openSignInModal('staff');
      return;
    }

    staffPublishWashVideo(pendingVideo.url, pendingVideo.fileName);
    setPendingVideo(null);
  };

  const handleChooseDifferentVideo = () => {
    if (isVideoEvidenceLocked) return;
    videoFileInputRef.current?.click();
  };

  const handleSendCustomMessage = () => {
    if (!customMsgText.trim()) return;
    if (!staffAuth) {
      openSignInModal('staff');
      return;
    }

    broadcastCustomMessage(customMsgText, customDelayHours, customEtaInput);
    setCustomMsgText('');
    setCustomDelayHours('');
    setCustomEtaInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-mono">
                  STAFF DISPATCH CONSOLE
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {staffAuth ? `${operatorTag} (${counterTag})` : 'Unauthenticated Desk'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight mt-1">
                LPU Central Laundry — {counterTag} Desk
              </h1>
              <p className="text-xs text-slate-300">
                Physical garment audit, two-way handshake signing, machine telemetry &amp; resident dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {!staffAuth ? (
              <button
                onClick={() => openSignInModal('staff')}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In as Staff</span>
              </button>
            ) : null}

            <button
              onClick={() => setUserRole('hosteller')}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-2 transition-colors border border-white/20"
            >
              <User className="w-3.5 h-3.5 text-blue-300" />
              <span>Switch to Hosteller View</span>
            </button>
          </div>
        </div>
      </div>

      {/* If staff is NOT signed in, prompt banner */}
      {!staffAuth && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Staff Sign-In Required:</strong> Please sign in with your Operator ID to physically verify drop-offs, sign handshakes, and broadcast machine telemetry.
            </span>
          </div>
          <button
            onClick={() => openSignInModal('staff')}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shrink-0 self-start sm:self-auto"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* If NO batch in queue yet, show clean empty queue state */}
      {!batch ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">
              {counterTag} Intake Queue
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              No Pending Batches in Queue — Waiting for Student Drop-Off
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The counter queue is currently idle. When a resident initiates a drop-off from the Hosteller Portal, the batch, garment breakdown, and intake photo will appear here immediately for operator verification.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setUserRole('hosteller');
                navigateTo('dropoff');
              }}
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <span>Go to Hosteller Portal to Drop Off a Batch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* LIVE BATCH CONTROLS (Rendered when batch exists) */
        <>
          {/* STEP 1: TWO-WAY HANDSHAKE VERIFICATION CARD (If pending handshake) */}
          {batch.handshakeStatus === 'pending' ? (
            <div className="bg-white rounded-xl border-2 border-amber-400 p-5 shadow-sm space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono">
                    #1
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      ACTION REQUIRED: TWO-WAY HANDSHAKE VERIFICATION
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      Incoming Drop-Off from {batch.studentCode} ({batch.hostel})
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    Received: {batch.dropOffTime}
                  </span>
                </div>
              </div>

              {/* Side-by-side inspection: Raw Photo on Left, Garment count and match checklist on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Raw Photo Preview */}
                <div className="md:col-span-5 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Resident's Submitted Photo Proof:
                  </span>
                  <div className="w-full h-64 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
                    {batch.intakePhoto ? (
                      <img
                        src={batch.intakePhoto}
                        alt="Submitted Bundle Proof"
                        className="max-h-full max-w-full w-auto h-auto object-contain"
                      />
                    ) : (
                      <div className="text-xs text-slate-400">No Photo Submitted</div>
                    )}
                  </div>
                </div>

                {/* Garment Tally & Physical Match Checklist */}
                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold border-b border-slate-200 pb-2">
                      <span className="text-slate-800">Submitted Garment Breakdown:</span>
                      <span className="text-blue-700 font-mono text-sm">{totalGarments} Total Pieces</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono text-slate-700 pt-1">
                      <div>• Shirts: <strong>{batch.garments.shirts || 0} pcs</strong></div>
                      <div>• Trousers: <strong>{batch.garments.trousers || 0} pcs</strong></div>
                      <div>• Hoodies: <strong>{batch.garments.hoodies || 0} pcs</strong></div>
                      <div>• Bedsheet: <strong>{batch.garments.bedsheets || 0} pcs</strong></div>
                    </div>
                  </div>

                  {/* Estimated Collection Window (Staff Controlled ETA) */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-700" />
                        <span>Assign Target Collection Window (ETA):</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {assignedEta || 'Pending'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Set the collection schedule for the student before completing handshake.
                    </p>

                    {/* Quick-select presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Today, 5:30 PM', 'Today, 7:00 PM', 'Tomorrow, 11:00 AM', 'Tomorrow, 5:00 PM'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAssignedEta(preset)}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                            assignedEta === preset
                              ? 'bg-blue-700 text-white border border-blue-700 font-bold shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {/* Custom input */}
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 shrink-0 font-medium">Custom Window:</span>
                      <input
                        type="text"
                        value={assignedEta}
                        onChange={(e) => setAssignedEta(e.target.value)}
                        placeholder="e.g. Today, 6:00 PM"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Physical matching confirmation checkbox */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bundleMatchesChecked}
                        onChange={(e) => setBundleMatchesChecked(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4"
                      />
                      <span className="text-xs text-slate-800 font-semibold leading-relaxed">
                        Physical clothes bundle on counter matches the photo &amp; item count ({totalGarments} pieces total).
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => staffCompleteHandshake(assignedEta || 'Today, 5:30 PM')}
                      disabled={!bundleMatchesChecked}
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
                        bundleMatchesChecked
                          ? 'bg-blue-700 hover:bg-blue-800 text-white hover:shadow-lg'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {bundleMatchesChecked
                          ? `Complete Two-Way Handshake & Accept Batch (${operatorTag})`
                          : 'Tick Checkbox Above to Complete Handshake'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* HANDSHAKE COMPLETED SUMMARY CARD */
            <div className="bg-white rounded-xl border border-emerald-300 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      TWO-WAY HANDSHAKE COMPLETED &amp; LOCKED
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      Batch #{batch.id} • Signed by {batch.studentCode} &amp; {batch.operatorCode}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Locked: {batch.intakeLockedAt}
                </span>
              </div>

              {/* Photo & Garments Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-5 w-full h-64 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
                  {batch.intakePhoto ? (
                    <img
                      src={batch.intakePhoto}
                      alt="Locked Intake Proof"
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                    />
                  ) : (
                    <div className="text-xs text-slate-400">No Photo Attached</div>
                  )}
                </div>

                <div className="sm:col-span-7 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 gap-2">
                    <span>Batch #{batch.id} • {batch.studentCode} • {batch.operatorCode}</span>
                    <span className="text-blue-700 font-bold">Target ETA: {batch.targetEta || batch.baseEta}</span>
                    <span className="text-emerald-700 font-semibold">✓ Locked Raw Proof</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 font-bold">
                    <span className="text-slate-700">Verified Garments:</span>
                    <span className="text-blue-700 font-mono text-sm">
                      {totalGarments} Total Pieces
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 font-mono">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      Shirts: <strong>{batch.garments.shirts || 0} pcs</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      Trousers: <strong>{batch.garments.trousers || 0} pcs</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      Hoodies: <strong>{batch.garments.hoodies || 0} pcs</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      Linen: <strong>{batch.garments.bedsheets || 0} pcs</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OPERATOR ACTIONS 2 & 3 (Enabled once handshake is completed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ACTION 2: Real Video File Upload & Confirmation Gate */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    OPERATOR ACTION 2
                  </span>
                  {isVideoEvidenceLocked ? (
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Evidence Locked</span>
                    </span>
                  ) : pendingVideo ? (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                      Draft Preview (Unpublished)
                    </span>
                  ) : batch.videoPublished ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse inline-block" />
                      <span>Video Live</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Unpublished
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-blue-700" />
                  <span>Upload Wash-Batch Video File</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Attach real physical video file (.mp4, .webm, .mov) recorded of {batch.washerUnit} drum for resident spot-audit.
                </p>
              </div>

              {/* STATE 1: HARD LOCKED (After confirmation OR batch is marked ready/delivered) */}
              {isVideoEvidenceLocked ? (
                batch.videoPublished && batch.videoUrl ? (
                  <div className="space-y-2 pt-1">
                    <div className="w-full h-36 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
                      <video
                        src={batch.videoUrl}
                        controls
                        playsInline
                        className="max-h-full max-w-full w-auto h-auto object-contain"
                      />
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 space-y-0.5">
                      <div className="font-bold flex items-center gap-1 truncate text-slate-900">
                        <FileVideo className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="truncate">{batch.videoFileName || 'wash_video.mp4'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Recorded &amp; published at {batch.videoPublishedAt} by {batch.videoUploadedBy || operatorTag}
                      </div>
                    </div>

                    {/* Prominent Read-Only Status Badge (Zero interactive file inputs or replace buttons) */}
                    <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center justify-center space-x-2">
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Video Evidence Locked (Immutable Audit Record)</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 space-y-2">
                    <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 text-xs font-mono flex items-center justify-center space-x-2 text-center">
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Video Evidence Locked (Batch Shelved &amp; Audit Closed)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 text-center">
                      Batch #{batch.id} was marked ready at {batch.rack}. Video upload is permanently closed.
                    </p>
                  </div>
                )
              ) : pendingVideo ? (
                /* STATE 2: TWO-STEP CONFIRMATION GATE (Draft Preview -> Permanent Lock) */
                <div className="space-y-3 pt-1">
                  <div className="w-full h-36 bg-black rounded-lg overflow-hidden flex items-center justify-center border-2 border-amber-400 relative shadow-2xs">
                    <video
                      src={pendingVideo.url}
                      controls
                      playsInline
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                      UNCONFIRMED DRAFT
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 bg-amber-50/60 p-2.5 rounded-md border border-amber-200 truncate">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileVideo className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <strong className="truncate text-slate-900">{pendingVideo.fileName}</strong>
                    </span>
                    <span className="text-amber-800 font-semibold shrink-0 text-[10px]">Unconfirmed</span>
                  </div>

                  {/* Confirmation Prompt Card */}
                  <div className="p-3 bg-amber-50/95 border border-amber-300 rounded-lg space-y-2.5">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-950 font-medium leading-relaxed">
                        Is this the final wash-batch video to publish for this batch? <strong>Once confirmed, it cannot be replaced.</strong>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={handleConfirmAndPublishVideo}
                        className="w-full sm:w-auto flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Yes, Confirm &amp; Publish Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleChooseDifferentVideo}
                        className="w-full sm:w-auto py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Choose Different Video</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden file input for Choose Different Video */}
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                /* STATE 3: INITIAL UPLOAD BUTTON */
                <div className="pt-2">
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!staffAuth) {
                        openSignInModal('staff');
                        return;
                      }
                      videoFileInputRef.current?.click();
                    }}
                    disabled={batch.handshakeStatus !== 'completed'}
                    className="w-full py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Wash-Batch Video File</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-1.5 font-mono">
                    Supports MP4, WebM, MOV video files
                  </p>
                </div>
              )}
            </div>

            {/* ACTION 3: Mark Ready for Pickup */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    OPERATOR ACTION 3
                  </span>
                  {batch.isReady ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Ready at {batch.rack}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      In Processing
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>Mark Ready for Pickup</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete folding and allocate bundle to <strong className="font-mono text-slate-900">Rack #24</strong> at {counterTag}. Unlocks pickup checklist for student.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={markBatchReady}
                  disabled={batch.handshakeStatus !== 'completed' || batch.isReady}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm ${
                    batch.isReady
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{batch.isReady ? 'Batch Shelved (Rack #24)' : 'Mark Batch Ready for Pickup (Rack #24)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* DELAY BROADCAST CONTROLS BAR */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Broadcast Delay Reason to Residents</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clicking any button instantly updates the Hosteller Dashboard, ETA timestamp, and Alerts page in real time.
                </p>
              </div>

              {batch.activeDelay && (
                <button
                  type="button"
                  onClick={clearDelay}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  <span>Clear Active Delay ({batch.activeDelay.addedHours}h)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => broadcastDelay('rain')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  batch.activeDelay?.type === 'rain'
                    ? 'bg-amber-100/80 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-amber-50/50 border-amber-200 hover:bg-amber-100/60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CloudRain className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-xs font-bold text-amber-950">Heavy Rain / Drying Delay (+4h)</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1 leading-snug">
                  Rain over campus; industrial solar air drying reduced.
                </p>
              </button>

              <button
                type="button"
                onClick={() => broadcastDelay('maintenance')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  batch.activeDelay?.type === 'maintenance'
                    ? 'bg-amber-100/80 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">Machine Maintenance (+2h)</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Preventative descaling on Commercial Washer Bank.
                </p>
              </button>

              <button
                type="button"
                onClick={() => broadcastDelay('rush')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  batch.activeDelay?.type === 'rush'
                    ? 'bg-amber-100/80 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">Weekend Rush (+3h)</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Peak hostel intake volume at counter desk.
                </p>
              </button>
            </div>

            {/* SEND CUSTOM MESSAGE / UPDATE BOX */}
            <div className="pt-4 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-700" />
                  <span>Send Custom Message / Notice to Resident</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Transmits live to Alerts &amp; Dashboard
                </span>
              </div>

              <textarea
                rows={2}
                value={customMsgText}
                onChange={(e) => setCustomMsgText(e.target.value)}
                placeholder="Write a custom delay reason, instruction, or status update for the resident (e.g. Extra rinse cycle added for heavy soil, delicate handling in progress, or specific counter advice)..."
                className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 resize-none"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] text-slate-600 font-medium shrink-0">Schedule Impact:</span>
                  <select
                    value={customDelayHours}
                    onChange={(e) => setCustomDelayHours(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  >
                    <option value="">No Delay (Notice Only)</option>
                    <option value="1">+1 Hour Delay</option>
                    <option value="2">+2 Hours Delay</option>
                    <option value="3">+3 Hours Delay</option>
                    <option value="4">+4 Hours Delay</option>
                  </select>

                  <input
                    type="text"
                    value={customEtaInput}
                    onChange={(e) => setCustomEtaInput(e.target.value)}
                    placeholder="Or custom ETA (e.g. 7:45 PM)"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendCustomMessage}
                  disabled={!customMsgText.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-2xs self-end sm:self-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Custom Message</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
