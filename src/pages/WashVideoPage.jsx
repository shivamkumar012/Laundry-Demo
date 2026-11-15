import React from 'react';
import {
  Video,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  AlertCircle,
  WashingMachine,
  Sparkles,
  Info,
  Lock,
  Plus
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import WashVideoPlayer from '../components/WashVideoPlayer';

export default function WashVideoPage() {
  const {
    batch,
    timeline,
    confirmGarmentsVisible,
    navigateTo,
    startNewDropOff
  } = useLaundry();

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
            <Video className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Active Batch for Video Inspection</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You must drop off a clothes bundle first to access the wash-batch CCTV feed and audit timeline.
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
          <span className="text-slate-600">{batch.washerUnit}</span>
        </div>
      </div>

      {/* Title banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Live Batch Timeline &amp; Wash Video Verification
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Optical verification clip for Batch #{batch.id} in {batch.washerUnit}.
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2.5 mt-3">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p>
            Campus Accountability Protocol §8: Counter operators are required to upload an optical video clip when your garments are loaded into the drum. You can slow down playback to 0.5x to spot your tags.
          </p>
        </div>
      </div>

      {/* Main Video Section: Either Live Player or Clean Empty State */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Optical Verification Feed (Batch #{batch.id})
          </h2>
          <span className="text-xs font-mono font-bold text-slate-500">
            {batch.videoPublished ? `Uploaded: ${batch.videoPublishedAt}` : 'Status: Unpublished'}
          </span>
        </div>

        {batch.videoPublished ? (
          <WashVideoPlayer
            batchId={batch.id}
            washerUnit={batch.washerUnit}
            studentCode={batch.studentCode}
            garments={batch.garments}
            videoUrl={batch.videoUrl}
            videoFileName={batch.videoFileName}
            videoUploadedBy={batch.videoUploadedBy}
            videoPublishedAt={batch.videoPublishedAt}
            studentVerified={batch.studentVerifiedVideo}
            verifiedTimestamp={batch.studentVerifiedTimestamp}
            onConfirmVerification={confirmGarmentsVisible}
          />
        ) : (
          /* Clean Empty State before Operator Publishes */
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                AWAITING OPERATOR VIDEO UPLOAD
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                No Wash Video Uploaded Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {batch.operatorCode} has not yet uploaded the optical verification video for {batch.washerUnit}. As soon as staff selects and uploads a real video file from the Counter Staff Console, the video player will unlock here automatically.
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-500 font-mono">
              Intake Handshake: <strong className="text-emerald-700">✓ LOCKED</strong> • Washer Queue: <strong className="text-blue-700">PENDING CYCLE</strong>
            </div>
          </div>
        )}
      </div>

      {/* Chronological Audit Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>Chronological Batch Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable ledger of stage completions, actor timestamps, and machine telemetry.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
            LEDGER ACTIVE
          </span>
        </div>

        {/* Timeline list */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {timeline.map((item) => {
            const isCompleted = item.status === 'completed';
            const isActive = item.status === 'active';

            let dotColor = 'bg-slate-300 border-white ring-2 ring-slate-200';
            if (isCompleted) dotColor = 'bg-emerald-600 border-white ring-2 ring-emerald-200';
            if (isActive) dotColor = 'bg-blue-600 border-white ring-4 ring-blue-100 animate-pulse';

            return (
              <div key={item.id} className="relative group">
                <div className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${dotColor}`} />

                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 hover:border-slate-300 transition-colors space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{item.title}</span>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </h4>
                    <span className="text-[11px] font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] font-mono text-slate-500">
                    <span>Actor: <strong className="text-slate-700">{item.actor}</strong></span>
                    <span className="capitalize">{item.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
