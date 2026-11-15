import React, { useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Video,
  FileVideo,
  Clock,
  Sparkles
} from 'lucide-react';

export default function WashVideoPlayer({
  batchId = 'BH11-001',
  washerUnit = 'Commercial Washer #W-08',
  studentCode = 'Student',
  garments = {},
  videoUrl = null,
  videoFileName = 'wash_batch_optical_clip.mp4',
  videoUploadedBy = 'Counter Staff',
  videoPublishedAt = 'Today',
  studentVerified = false,
  verifiedTimestamp = null,
  onConfirmVerification
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
      {/* Top CCTV & File Metadata Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold tracking-wider">CCTV REPLAY: {washerUnit}</span>
          <span className="text-slate-400">|</span>
          <span className="text-blue-400">BATCH #{batchId}</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-300 text-[11px]">
          <span className="flex items-center gap-1">
            <FileVideo className="w-3.5 h-3.5 text-blue-400" />
            <strong className="text-white">{videoFileName}</strong>
          </span>
          <span className="text-slate-500">•</span>
          <span>Uploaded by <strong className="text-white">{videoUploadedBy}</strong> ({videoPublishedAt})</span>
        </div>
      </div>

      {/* Main Real HTML5 Video Player */}
      <div className="relative bg-black flex items-center justify-center min-h-[260px] sm:min-h-[340px] max-h-96 overflow-hidden">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full max-h-96 object-contain bg-black rounded-b-none"
          />
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Video className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-xs">No video source attached.</p>
          </div>
        )}
      </div>

      {/* Playback Controls & Speed Toggle */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={togglePlay}
            className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={restartVideo}
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Restart Video from 0:00"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggles */}
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-300">
            <span className="text-[11px] text-slate-500 font-medium">Speed:</span>
            {[
              { label: '0.5x Slow-Mo', val: 0.5 },
              { label: '1x Normal', val: 1 },
              { label: '1.5x Fast', val: 1.5 }
            ].map(({ label, val }) => (
              <button
                key={val}
                type="button"
                onClick={() => setSpeed(val)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-colors ${
                  playbackSpeed === val
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
            ✓ Genuine CCTV Evidence
          </span>
          <span>{washerUnit}</span>
        </div>
      </div>

      {/* Student Garment Verification Card */}
      <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div
            className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
              studentVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {studentVerified ? <ShieldCheck className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Resident Garment Spot-Audit</span>
              {studentVerified && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  VERIFIED BY RESIDENT
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {studentVerified
                ? `Verified by ${studentCode} ${verifiedTimestamp ? `at ${verifiedTimestamp}` : ''}. Recorded into batch audit ledger.`
                : 'Inspect the video clip above to verify your items inside the commercial washer drum.'}
            </p>
          </div>
        </div>

        <div>
          {studentVerified ? (
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Garments Confirmed Visible</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onConfirmVerification}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm My Garments Visible</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
