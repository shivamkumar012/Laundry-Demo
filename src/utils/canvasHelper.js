// Utility to generate a realistic counter bundle snapshot on HTML5 canvas (for the quick demo snapshot option)
export function generateBundleCanvasImage(garments = {}, batchId = 'BH11-001', studentCode = 'Student H-01', operatorCode = 'Operator #OP-409') {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  const totalItems = Object.values(garments).reduce((a, b) => a + Number(b || 0), 0);

  // Background: Brushed stainless steel laundry intake counter
  const grad = ctx.createLinearGradient(0, 0, 640, 480);
  grad.addColorStop(0, '#E2E8F0');
  grad.addColorStop(0.5, '#CBD5E1');
  grad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 480);

  // Counter grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  for (let y = 40; y < 480; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(640, y);
    ctx.stroke();
  }

  // Draw laundry intake tray / blue utility basket
  ctx.fillStyle = '#1E3A8A';
  ctx.beginPath();
  ctx.roundRect(60, 70, 520, 310, 16);
  ctx.fill();
  ctx.strokeStyle = '#1D4ED8';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Basket interior floor
  ctx.fillStyle = '#1E40AF';
  ctx.beginPath();
  ctx.roundRect(75, 85, 490, 280, 12);
  ctx.fill();

  // Basket ventilation holes
  ctx.fillStyle = '#172554';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 12; c++) {
      ctx.beginPath();
      ctx.roundRect(95 + c * 40, 100 + r * 20, 24, 8, 4);
      ctx.fill();
    }
  }

  // Draw clothes depending on what is counted
  if (totalItems > 0) {
    // 1. Linen / Bedsheet if > 0
    if ((garments.bedsheets || 0) > 0) {
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(110, 200, 420, 65, 8);
      ctx.fill();
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`LPU LINEN / BEDSHEET x${garments.bedsheets}`, 125, 235);
    }

    // 2. Trousers if > 0
    if ((garments.trousers || 0) > 0) {
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.roundRect(120, 175, 210, 45, 6);
      ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px monospace';
      ctx.fillText(`DENIM TROUSER x${garments.trousers}`, 135, 202);
    }

    // 3. Hoodie if > 0
    if ((garments.hoodies || 0) > 0) {
      ctx.fillStyle = '#3F4F38';
      ctx.beginPath();
      ctx.roundRect(310, 165, 200, 50, 6);
      ctx.fill();
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '10px monospace';
      ctx.fillText(`CAMPUS HOODIE x${garments.hoodies}`, 325, 195);
    }

    // 4. Shirts if > 0
    if ((garments.shirts || 0) > 0) {
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.roundRect(160, 140, 240, 45, 6);
      ctx.fill();
      ctx.fillStyle = '#F0F9FF';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`SHIRTS BUNDLE (${garments.shirts} PCS)`, 175, 168);
    }
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('INTAKE BASKET EMPTY - AWAITING STUDENT ITEMS', 160, 220);
  }

  // Official LPU Barcode tag attached to bundle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(360, 130, 140, 55, 4);
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Barcode lines
  ctx.fillStyle = '#000000';
  const barPositions = [4, 7, 9, 13, 16, 20, 22, 26, 30, 33, 38, 42, 45, 50, 54, 58, 62, 67, 72, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
  barPositions.forEach(x => {
    ctx.fillRect(370 + x, 138, (x % 3 === 0 ? 3 : 1.5), 24);
  });
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#0F172A';
  ctx.fillText(batchId, 400, 175);

  return canvas.toDataURL('image/jpeg', 0.9);
}

// Function to read an uploaded user image file directly as a raw, unmodified Data URL (ZERO overlays/watermarks)
export function readRawImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Backwards-compatible alias for any existing imports
export const stampUploadedImage = (file) => readRawImageFile(file);

// Function to capture a live webcam frame directly at its native resolution with ZERO overlays/watermarks
export function captureRawCameraFrame(videoElement) {
  const width = videoElement.videoWidth || 640;
  const height = videoElement.videoHeight || 480;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Draw pure raw camera frame at native resolution without any overlays
  ctx.drawImage(videoElement, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.95);
}

// Backwards-compatible alias
export const stampCameraFrame = (videoElement) => captureRawCameraFrame(videoElement);
