import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';

const LaundryContext = createContext();

// Clean in-memory session initial state (No hardcoded dummy IDs, No localStorage)
const getInitialEmptyState = () => ({
  userRole: 'hosteller', // 'hosteller' | 'staff'
  currentPage: 'dashboard', // 'dashboard' | 'dropoff' | 'video' | 'alerts' | 'pickup' | 'staff'

  // Dynamic Auth states (Starts null - user can sign in or use demo fill)
  hostellerAuth: null, // { residentId: 'H-01', hostelBlock: 'BH-11' }
  staffAuth: null,     // { operatorId: 'OP-409', counterNumber: 'Counter 2' }

  // Active Batch: starts as null until a drop-off is submitted
  batch: null,

  // Audit timeline
  timeline: [],

  // Alerts stream
  alerts: [],

  // Dispute tickets
  tickets: [],
});

export const LaundryProvider = ({ children }) => {
  const [state, setState] = useState(getInitialEmptyState);
  const [toasts, setToasts] = useState([]);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInModalDefaultTab, setSignInModalDefaultTab] = useState('hosteller');

  // Toast notification helper
  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sign In Modal Controls
  const openSignInModal = (defaultTab = 'hosteller') => {
    setSignInModalDefaultTab(defaultTab);
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  // Auth Functions
  const signInHosteller = (residentId, hostelBlock) => {
    setState((prev) => ({
      ...prev,
      hostellerAuth: { residentId, hostelBlock }
    }));
    showToast('Signed In as Hosteller', `Resident ID: ${residentId} (${hostelBlock})`, 'success');
  };

  const signInStaff = (operatorId, counterNumber) => {
    setState((prev) => ({
      ...prev,
      staffAuth: { operatorId, counterNumber }
    }));
    showToast('Signed In as Staff', `Operator ID: #${operatorId} (${counterNumber})`, 'success');
  };

  const signOutHosteller = () => {
    setState((prev) => ({ ...prev, hostellerAuth: null }));
    showToast('Signed Out', 'Signed out from Hosteller account.', 'info');
  };

  const signOutStaff = () => {
    setState((prev) => ({ ...prev, staffAuth: null }));
    showToast('Signed Out', 'Signed out from Staff console.', 'info');
  };

  // Navigation & Role switcher
  const navigateTo = (page) => {
    setState((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setUserRole = (role) => {
    setState((prev) => ({
      ...prev,
      userRole: role,
      currentPage: role === 'staff' ? 'staff' : (prev.currentPage === 'staff' ? 'dashboard' : prev.currentPage)
    }));
  };

  // 1. Hosteller Action: Submit Drop-Off & Photo Proof to Counter
  const submitDropOff = (garments, photoUrl) => {
    // If not signed in as hosteller, prompt sign in
    let currentHosteller = state.hostellerAuth;
    if (!currentHosteller) {
      openSignInModal('hosteller');
      showToast('Please Sign In', 'Enter your Resident ID to submit your laundry drop-off.', 'warning');
      return false;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = `${dateStr}, ${timeStr}`;

    const totalCount = Object.values(garments).reduce((a, b) => a + Number(b || 0), 0);
    const cleanBlock = currentHosteller.hostelBlock.replace('-', '');
    const batchId = `${cleanBlock}-001`;

    const newBatch = {
      id: batchId,
      hostel: currentHosteller.hostelBlock,
      counter: 'Counter 2',
      rack: 'Pending Allocation',
      studentCode: `Student ${currentHosteller.residentId}`,
      operatorCode: 'Pending Staff Match',
      washerUnit: 'Commercial Washer #W-08',
      dropOffTime: `Today, ${timeStr}`,
      targetEta: null, // Staff assigns realistic ETA at Two-Way Handshake
      baseEta: null,
      currentStep: 1, // Step 1: Dropped Off (Awaiting Staff Two-Way Handshake)
      handshakeStatus: 'pending', // 'pending' | 'completed'
      handshakeConfirmed: true,
      handshakeApprovedByStaff: false,
      intakePhoto: photoUrl,
      intakePhotoLocked: false,
      intakeLockedAt: null,
      garments: { ...garments },

      videoPublished: false,
      videoPublishedAt: null,
      videoUrl: null,
      videoFileName: null,
      videoUploadedBy: null,
      isVideoLocked: false,
      studentVerifiedVideo: false,
      studentVerifiedTimestamp: null,

      activeDelay: null,
      isReady: false,
      isDelivered: false,
      deliveredAt: null,
    };

    const newTimeline = [
      {
        id: 'evt-1',
        title: 'Bundle Submitted to Counter',
        description: `Student ${currentHosteller.residentId} submitted ${totalCount} garments with intake photo proof. Physical bundle queued for operator inspection.`,
        timestamp: timeStr,
        actor: `Student ${currentHosteller.residentId}`,
        step: 1,
        status: 'completed',
      },
      {
        id: 'evt-2',
        title: 'Two-Way Handshake & Photo Match',
        description: 'Counter operator physical bundle count & photo verification.',
        timestamp: 'Waiting for Staff Verification',
        actor: 'Counter Staff',
        step: 2,
        status: 'active',
      },
      {
        id: 'evt-3',
        title: 'Commercial Washer Cycle',
        description: 'Scheduled for Commercial Washer #W-08.',
        timestamp: 'Awaiting Wash',
        actor: 'Counter Staff',
        step: 3,
        status: 'pending',
      },
      {
        id: 'evt-4',
        title: 'Industrial Tumbler Hot Drying',
        description: 'Moisture extraction in industrial tumbler.',
        timestamp: 'Estimated Stage 4',
        actor: 'System Automation',
        step: 4,
        status: 'pending',
      },
      {
        id: 'evt-5',
        title: 'Steam Press, Folding & Shelf Allocation',
        description: 'Quality inspected, barcoded and placed on designated hostel pickup shelf.',
        timestamp: 'Pending Staff Schedule',
        actor: 'Counter Staff',
        step: 5,
        status: 'pending',
      },
    ];

    const newAlert = {
      id: `alt-${Date.now()}`,
      title: 'Drop-Off Submitted to Counter Desk',
      description: `Intake bundle with ${totalCount} items submitted by Student ${currentHosteller.residentId}. Waiting for counter operator to match bundle, assign collection ETA, and complete handshake.`,
      timestamp: timeStr,
      type: 'blue',
      read: false,
    };

    setState((prev) => ({
      ...prev,
      currentPage: 'dashboard',
      batch: newBatch,
      timeline: newTimeline,
      alerts: [newAlert],
    }));

    showToast(
      'Drop-Off Submitted!',
      `Batch #${batchId} sent to Counter Staff Queue. Awaiting operator handshake & schedule.`,
      'success'
    );
    return true;
  };

  // 2. Staff Action: Complete Two-Way Handshake & Accept Batch (with staff-assigned collection ETA)
  const staffCompleteHandshake = (assignedEta = 'Today, 5:30 PM') => {
    if (!state.batch) return;
    let currentStaff = state.staffAuth;
    if (!currentStaff) {
      openSignInModal('staff');
      showToast('Staff Sign In Required', 'Please sign in with your Operator ID to complete the handshake.', 'warning');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = `${dateStr}, ${timeStr}`;

    setState((prev) => {
      if (!prev.batch) return prev;
      const totalCount = Object.values(prev.batch.garments).reduce((a, b) => a + Number(b || 0), 0);
      const operatorTag = `Operator #${currentStaff.operatorId}`;

      const updatedTimeline = prev.timeline.map((item) => {
        if (item.step === 2) {
          return {
            ...item,
            title: 'Two-Way Handshake Completed',
            status: 'completed',
            timestamp: timeStr,
            description: `Physical bundle matched with photo proof (${totalCount} pieces). Target collection scheduled for ${assignedEta}. Signed and locked by ${prev.batch.studentCode} and ${operatorTag} at ${currentStaff.counterNumber}.`,
            actor: `${prev.batch.studentCode} + ${operatorTag}`
          };
        }
        if (item.step === 3) {
          return {
            ...item,
            status: 'active',
            timestamp: timeStr,
            description: `Queued for Commercial Washer #W-08.`
          };
        }
        if (item.step === 5) {
          return {
            ...item,
            timestamp: `Estimated ${assignedEta}`,
          };
        }
        return item;
      });

      const newAlert = {
        id: `alt-${Date.now()}`,
        title: 'Two-Way Handshake Completed & Locked',
        description: `${operatorTag} at ${currentStaff.counterNumber} physically verified your ${totalCount} garments against the photo proof. Target collection scheduled for ${assignedEta}. Batch #${prev.batch.id} is officially locked.`,
        timestamp: timeStr,
        type: 'emerald',
        read: false
      };

      return {
        ...prev,
        batch: {
          ...prev.batch,
          targetEta: assignedEta,
          baseEta: assignedEta,
          handshakeStatus: 'completed',
          handshakeApprovedByStaff: true,
          intakePhotoLocked: true,
          intakeLockedAt: timeFormatted,
          operatorCode: operatorTag,
          counter: currentStaff.counterNumber,
          currentStep: 2, // Step 2: Intake Photo Locked & Handshake Completed
        },
        timeline: updatedTimeline,
        alerts: [newAlert, ...prev.alerts]
      };
    });

    showToast('Handshake Completed!', `Batch #${state.batch.id} locked and verified. Target Collection: ${assignedEta}`, 'success');
  };

  // 3. Staff action: Publish real wash video file (Permanently locks video evidence)
  const staffPublishWashVideo = (videoUrl, videoFileName = 'wash_batch_optical_clip.mp4') => {
    if (!state.batch) return;
    if (state.batch.isVideoLocked || state.batch.isReady || state.batch.isDelivered) {
      showToast('Video Locked', 'Wash-batch video evidence is permanently locked and cannot be replaced.', 'warning');
      return;
    }
    let currentStaff = state.staffAuth;
    if (!currentStaff) {
      openSignInModal('staff');
      showToast('Staff Sign In Required', 'Please sign in to publish wash video.', 'warning');
      return;
    }

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
    const operatorTag = `Operator #${currentStaff.operatorId}`;

    setState((prev) => {
      if (!prev.batch) return prev;
      const updatedTimeline = prev.timeline.map((item) => {
        if (item.step === 3) {
          return {
            ...item,
            status: 'active',
            timestamp: now,
            description: `Physical wash video (${videoFileName}) confirmed and locked by ${operatorTag} for ${prev.batch.washerUnit}. Available on resident portal.`
          };
        }
        return item;
      });

      const newAlert = {
        id: `alt-${Date.now()}`,
        title: 'New Wash-Batch Video Confirmed & Locked',
        description: `${operatorTag} confirmed and published optical wash cycle video (${videoFileName}) for ${prev.batch.washerUnit}. Evidence is permanently locked.`,
        timestamp: now,
        type: 'blue',
        read: false
      };

      return {
        ...prev,
        batch: {
          ...prev.batch,
          videoPublished: true,
          videoPublishedAt: now,
          videoUrl: videoUrl,
          videoFileName: videoFileName,
          videoUploadedBy: operatorTag,
          isVideoLocked: true, // Permanent lock once confirmed
          currentStep: Math.max(prev.batch.currentStep, 3)
        },
        timeline: updatedTimeline,
        alerts: [newAlert, ...prev.alerts]
      };
    });

    showToast('Wash Video Confirmed & Locked!', `Video "${videoFileName}" published and permanently locked by ${operatorTag}.`, 'success');
  };

  // 4. Student action: Confirm garments visible in video
  const confirmGarmentsVisible = () => {
    if (!state.batch) return;
    const residentTag = state.hostellerAuth ? `Student ${state.hostellerAuth.residentId}` : state.batch.studentCode;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';

    setState((prev) => {
      if (!prev.batch) return prev;
      const updatedTimeline = prev.timeline.map((item) => {
        if (item.step === 3) {
          return {
            ...item,
            status: 'completed',
            description: `Washing cycle in Commercial Washer #W-08 verified by ${residentTag} via CCTV at ${now}.`
          };
        }
        if (item.step === 4 && item.status === 'pending') {
          return { ...item, status: 'active' };
        }
        return item;
      });

      const newAlert = {
        id: `alt-${Date.now()}`,
        title: `Garments Confirmed by ${residentTag}`,
        description: `You acknowledged your garments in Commercial Washer #W-08 CCTV feed at ${now}.`,
        timestamp: now,
        type: 'blue',
        read: false
      };

      return {
        ...prev,
        batch: {
          ...prev.batch,
          studentVerifiedVideo: true,
          studentVerifiedTimestamp: now,
          currentStep: Math.max(prev.batch.currentStep, 3),
        },
        timeline: updatedTimeline,
        alerts: [newAlert, ...prev.alerts]
      };
    });

    showToast('Garments Verified!', `Verified by ${residentTag} badge added across app.`, 'success');
  };

  // 5. Staff action: Broadcast delay
  const broadcastDelay = (delayType) => {
    if (!state.batch) return;
    let currentStaff = state.staffAuth;
    if (!currentStaff) {
      openSignInModal('staff');
      showToast('Staff Sign In Required', 'Please sign in to broadcast delays.', 'warning');
      return;
    }

    let delayObj = null;
    let alertTitle = '';
    let alertDesc = '';

    if (delayType === 'rain') {
      delayObj = {
        type: 'rain',
        title: 'Drying Delayed by 4 Hours',
        reason: 'Heavy rain & high humidity over campus; industrial solar air dryers operating at reduced capacity.',
        revisedEta: 'Today, 08:30 PM',
        addedHours: 4
      };
      alertTitle = 'Weather Alert: Drying Delayed (+4 Hours)';
      alertDesc = `Heavy rainfall over campus. Revised pickup target: Today, 8:30 PM (Broadcast by Operator #${currentStaff.operatorId}).`;
    } else if (delayType === 'maintenance') {
      delayObj = {
        type: 'maintenance',
        title: 'Washer Maintenance Delay (+2 Hours)',
        reason: 'Filter descaling & preventative hygiene flush on Commercial Washer Bank.',
        revisedEta: 'Today, 06:30 PM',
        addedHours: 2
      };
      alertTitle = 'Equipment Alert: Machine Maintenance (+2 Hours)';
      alertDesc = `Routine filter flush in progress. Revised pickup: Today, 6:30 PM (Broadcast by Operator #${currentStaff.operatorId}).`;
    } else if (delayType === 'rush') {
      delayObj = {
        type: 'rush',
        title: 'Weekend Influx Delay (+3 Hours)',
        reason: 'High volume of hostel linen intake at counter desk. Staff operating secondary pressers.',
        revisedEta: 'Today, 07:30 PM',
        addedHours: 3
      };
      alertTitle = 'Rush Hour Alert: Weekend Influx (+3 Hours)';
      alertDesc = `Peak hostel drop-offs being processed. Revised pickup: Today, 7:30 PM (Broadcast by Operator #${currentStaff.operatorId}).`;
    }

    if (!delayObj) return;

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';

    setState((prev) => {
      if (!prev.batch) return prev;
      const newAlert = {
        id: `alt-${Date.now()}`,
        title: alertTitle,
        description: alertDesc,
        timestamp: now,
        type: 'amber',
        read: false
      };

      const updatedTimeline = prev.timeline.map((item) => {
        if (item.step === 4) {
          return {
            ...item,
            status: 'active',
            title: `Industrial Tumbler Drying (${delayObj.title})`,
            description: delayObj.reason
          };
        }
        return item;
      });

      return {
        ...prev,
        batch: {
          ...prev.batch,
          activeDelay: delayObj,
          currentStep: Math.max(prev.batch.currentStep, 4),
          isReady: false
        },
        timeline: updatedTimeline,
        alerts: [newAlert, ...prev.alerts]
      };
    });

    showToast('Delay Broadcasted', alertTitle, 'warning');
  };

  // 6. Staff action: Broadcast custom message / delay update to residents
  const broadcastCustomMessage = (messageText, addedHours = 0, customEta = null) => {
    if (!state.batch) return;
    let currentStaff = state.staffAuth;
    if (!currentStaff) {
      openSignInModal('staff');
      showToast('Staff Sign In Required', 'Please sign in to broadcast custom messages.', 'warning');
      return;
    }

    if (!messageText || !messageText.trim()) {
      showToast('Empty Message', 'Please enter a message or reason to broadcast.', 'warning');
      return;
    }

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
    const operatorTag = `Operator #${currentStaff.operatorId}`;
    const hoursNum = Number(addedHours) || 0;

    let revisedEtaStr = customEta;
    if (!revisedEtaStr) {
      if (hoursNum > 0) {
        revisedEtaStr = `Extended (+${hoursNum}h)`;
      } else {
        revisedEtaStr = state.batch.targetEta || state.batch.baseEta || 'On Schedule';
      }
    }

    const delayObj = {
      type: 'custom',
      title: `Operator Notice (${operatorTag})`,
      reason: messageText.trim(),
      revisedEta: revisedEtaStr,
      addedHours: hoursNum,
      broadcastBy: operatorTag,
      timestamp: now,
    };

    const alertTitle = hoursNum > 0
      ? `Delay Notice: ${operatorTag} (+${hoursNum}h)`
      : `Operator Notice from ${operatorTag}`;

    const alertDesc = `${messageText.trim()} (Broadcast by ${operatorTag} at ${now}).`;

    setState((prev) => {
      if (!prev.batch) return prev;
      const newAlert = {
        id: `alt-${Date.now()}`,
        title: alertTitle,
        description: alertDesc,
        timestamp: now,
        type: hoursNum > 0 ? 'amber' : 'blue',
        read: false,
        operator: operatorTag
      };

      const updatedTimeline = prev.timeline.map((item) => {
        if (item.step === 4) {
          return {
            ...item,
            status: 'active',
            title: `Operator Notice (${operatorTag})`,
            description: messageText.trim()
          };
        }
        return item;
      });

      return {
        ...prev,
        batch: {
          ...prev.batch,
          activeDelay: delayObj,
          currentStep: Math.max(prev.batch.currentStep, 4),
          isReady: false
        },
        timeline: updatedTimeline,
        alerts: [newAlert, ...prev.alerts]
      };
    });

    showToast('Custom Notice Broadcast!', `Message transmitted to Hosteller Portal under ${operatorTag}.`, 'success');
  };

  // 7. Clear delay
  const clearDelay = () => {
    setState((prev) => {
      if (!prev.batch) return prev;
      return {
        ...prev,
        batch: {
          ...prev.batch,
          activeDelay: null
        }
      };
    });
    showToast('Delay Cleared', 'Normal ETA resumed.', 'info');
  };

  // 7. Staff action: Mark batch ready for pickup (Rack #24)
  const markBatchReady = () => {
    if (!state.batch) return;
    let currentStaff = state.staffAuth;
    if (!currentStaff) {
      openSignInModal('staff');
      showToast('Staff Sign In Required', 'Please sign in to mark batches ready.', 'warning');
      return;
    }

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
    const operatorTag = `Operator #${currentStaff.operatorId}`;

    setState((prev) => {
      if (!prev.batch) return prev;
      const updatedTimeline = prev.timeline.map((item) => {
        if (item.step <= 4) return { ...item, status: 'completed' };
        if (item.step === 5) {
          return {
            ...item,
            status: 'completed',
            timestamp: now,
            description: `Quality check passed. Garments folded, barcoded, and placed on Rack #24 at ${currentStaff.counterNumber} by ${operatorTag}.`
          };
        }
        return item;
      });

      const newAlert = {
        id: `alt-${Date.now()}`,
        title: `Ready for Pickup at ${currentStaff.counterNumber} — Rack #24`,
        description: `Your laundry batch is clean, pressed, and shelved. Bring your digital token to ${currentStaff.counterNumber}.`,
        timestamp: now,
        type: 'emerald',
        read: false
      };

      return {
        ...prev,
        batch: {
          ...prev.batch,
          isReady: true,
          isVideoLocked: true, // Hard lock once batch is marked ready for pickup
          currentStep: 5,
          activeDelay: null,
          rack: 'Rack #24',
          counter: currentStaff.counterNumber,
          operatorCode: operatorTag
        },
        timeline: updatedTimeline,
        alerts: [newAlert, ...prev.alerts]
      };
    });

    showToast('Batch Ready!', `Batch #${state.batch.id} placed on Rack #24.`, 'success');
  };

  // 8. Pickup: Confirm all items received & close batch
  const confirmAllReceived = () => {
    if (!state.batch) return;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
    const residentTag = state.hostellerAuth ? `Student ${state.hostellerAuth.residentId}` : state.batch.studentCode;

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setState((prev) => {
      if (!prev.batch) return prev;
      const totalCount = Object.values(prev.batch.garments).reduce((a, b) => a + Number(b || 0), 0);

      const updatedTimeline = [
        ...prev.timeline,
        {
          id: `evt-${Date.now()}`,
          title: 'Batch Collected & Audit Closed',
          description: `Resident ${residentTag} verified and received all ${totalCount} items at ${prev.batch.counter}. Signed off by ${prev.batch.operatorCode}.`,
          timestamp: timeFormatted,
          actor: `${residentTag} + ${prev.batch.operatorCode}`,
          step: 6,
          status: 'completed'
        }
      ];

      return {
        ...prev,
        batch: {
          ...prev.batch,
          isDelivered: true,
          deliveredAt: timeFormatted,
          currentStep: 6
        },
        timeline: updatedTimeline
      };
    });

    showToast('Batch Successfully Delivered!', 'All garments accounted for. Core pickup loop complete.', 'success');
  };

  // 9. Submit dispute ticket
  const submitDisputeTicket = (ticket) => {
    setState((prev) => {
      const newAlert = {
        id: `alt-${Date.now()}`,
        title: `Dispute Ticket Generated (${ticket.id})`,
        description: `Discrepancy registered for ${ticket.category}. Counter supervisor review initiated under 48h SLA.`,
        timestamp: ticket.createdAt,
        type: 'amber',
        read: false
      };

      return {
        ...prev,
        tickets: [ticket, ...prev.tickets],
        alerts: [newAlert, ...prev.alerts]
      };
    });

    showToast('Ticket Generated!', `Ticket #${ticket.id} filed with attached intake proof.`, 'error');
  };

  // 10. Start fresh drop-off
  const startNewDropOff = () => {
    setState((prev) => ({
      ...prev,
      currentPage: 'dropoff'
    }));
  };

  // 11. Clear session & start fresh (pure in-memory reset)
  const clearSession = () => {
    setState(getInitialEmptyState());
    showToast('Session Cleared', 'In-memory state reset back to completely empty.', 'info');
  };

  return (
    <LaundryContext.Provider
      value={{
        ...state,
        toasts,
        showToast,
        removeToast,
        navigateTo,
        setUserRole,
        isSignInModalOpen,
        signInModalDefaultTab,
        openSignInModal,
        closeSignInModal,
        signInHosteller,
        signInStaff,
        signOutHosteller,
        signOutStaff,
        submitDropOff,
        staffCompleteHandshake,
        confirmGarmentsVisible,
        staffPublishWashVideo,
        broadcastDelay,
        broadcastCustomMessage,
        clearDelay,
        markBatchReady,
        confirmAllReceived,
        submitDisputeTicket,
        startNewDropOff,
        clearSession,
      }}
    >
      {children}
    </LaundryContext.Provider>
  );
};

export const useLaundry = () => {
  const context = useContext(LaundryContext);
  if (!context) {
    throw new Error('useLaundry must be used within a LaundryProvider');
  }
  return context;
};
