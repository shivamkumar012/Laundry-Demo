import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, RefreshCw, AlertCircle, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { generateBundleCanvasImage, readRawImageFile, captureRawCameraFrame } from '../utils/canvasHelper';

export default function IntakeCanvasCapture({
  garments = {},
  batchId = 'BH11-001',
  studentCode = 'Student H-01',
  operatorCode = 'Operator #OP-409',
  currentPhoto = null,
  onPhotoCaptured
}) {
  const [photoPreview, setPhotoPreview] = useState(currentPhoto);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraFallbackInputRef = useRef(null);
  const streamRef = useRef(null);

  // Sync internal preview with external prop
  useEffect(() => {
    setPhotoPreview(currentPhoto);
  }, [currentPhoto]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // 1. Live Device Camera Handler
  const startCamera = async () => {
    setCameraError(null);
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Direct webcam streaming not supported by browser. Opening device camera upload instead.');
      cameraFallbackInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }
        },
        audio: false
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => {
            console.warn("Video play error:", e);
          });
        }
      }, 50);
    } catch (err) {
      console.warn("Camera access failed or blocked:", err);
      setCameraError('Camera access declined or unavailable. Use "Upload Image" or device capture.');
      setIsCameraActive(false);
      cameraFallbackInputRef.current?.click();
    }
  };

  const cancelCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
  };

  // Capture RAW frame with zero watermark/overlays
  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    try {
      const rawDataUrl = captureRawCameraFrame(videoRef.current);
      setPhotoPreview(rawDataUrl);
      onPhotoCaptured(rawDataUrl);
    } catch (err) {
      console.error("Frame capture error:", err);
    } finally {
      stopCameraStream();
      setIsCameraActive(false);
    }
  };

  // 2. Dynamic Bundle Snapshot Generator (for quick demo option)
  const handleGenerateCanvasSnapshot = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const dataUrl = generateBundleCanvasImage(garments, batchId, studentCode, operatorCode);
      setPhotoPreview(dataUrl);
      onPhotoCaptured(dataUrl);
      setIsGenerating(false);
    }, 150);
  };

  // 3. Handle File Upload (Stores raw, unmodified photo with zero overlays)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    try {
      const rawDataUrl = await readRawImageFile(file);
      setPhotoPreview(rawDataUrl);
      onPhotoCaptured(rawDataUrl);
    } catch (err) {
      console.error("Error reading image:", err);
    } finally {
      setIsGenerating(false);
      e.target.value = '';
    }
  };

  const handleClearPhoto = () => {
    setPhotoPreview(null);
    onPhotoCaptured(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={cameraFallbackInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-700" />
            <span>Counter Intake Bundle Photo Proof</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Photographic accountability record of the clothes bundle presented at Counter #2.
          </p>
        </div>

        {photoPreview ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Photo Attached
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
            No Photo Attached
          </span>
        )}
      </div>

      {cameraError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{cameraError}</span>
          </div>
          <button
            type="button"
            onClick={() => setCameraError(null)}
            className="text-amber-600 hover:text-amber-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Fixed-size preview container box: w-full h-64 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden */}
      <div className="w-full h-64 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
        {isCameraActive ? (
          /* Live Camera Stream Mode */
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-h-full max-w-full w-auto h-auto object-contain"
            />
            {/* Live Camera Active Indicator */}
            <div className="absolute top-2 left-2 bg-slate-900/80 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1.5 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE DEVICE CAM</span>
            </div>

            {/* In-viewport Capture Controls */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 px-4">
              <button
                type="button"
                onClick={captureCameraFrame}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo</span>
              </button>
              <button
                type="button"
                onClick={cancelCamera}
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : photoPreview ? (
          /* Attached Raw Photo Preview Mode (Exact original aspect ratio, zero stretching) */
          <img
            src={photoPreview}
            alt="Intake Bundle Proof"
            className="max-h-full max-w-full w-auto h-auto object-contain"
          />
        ) : (
          /* Empty State Dropzone */
          <div className="text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 mx-auto flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">No Photo Captured Yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5 leading-relaxed">
                Take a photo with <strong>Device Cam</strong>, <strong>Upload Image</strong>, or click <strong>Generate Bundle Snapshot</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Clean HTML Metadata Text below container (No dark canvas overlays on image) */}
      {photoPreview && !isCameraActive && (
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span>Batch #{batchId} • {studentCode} • {operatorCode}</span>
          <span className="text-emerald-700 font-semibold">✓ Raw Photo Stored</span>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        {/* 1. Dynamic Bundle Snapshot Generator */}
        <button
          type="button"
          onClick={handleGenerateCanvasSnapshot}
          disabled={isGenerating || isCameraActive}
          className="w-full sm:flex-1 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-xs disabled:opacity-60"
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{photoPreview ? 'Re-Generate Bundle Snapshot' : 'Generate Bundle Snapshot'}</span>
        </button>

        {/* 2. Device Camera */}
        <button
          type="button"
          onClick={startCamera}
          disabled={isCameraActive}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          title="Use live device camera"
        >
          <Camera className="w-4 h-4 text-blue-700" />
          <span>{photoPreview ? 'Retake via Cam' : 'Device Cam'}</span>
        </button>

        {/* 3. Upload File */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isCameraActive}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Upload className="w-4 h-4 text-slate-600" />
          <span>{photoPreview ? 'Replace Image' : 'Upload Image'}</span>
        </button>

        {/* 4. Remove Photo if present */}
        {photoPreview && !isCameraActive && (
          <button
            type="button"
            onClick={handleClearPhoto}
            className="w-full sm:w-auto px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium flex items-center justify-center transition-colors"
            title="Remove attached photo"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
