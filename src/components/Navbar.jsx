import React from 'react';
import {
  WashingMachine,
  User,
  Shield,
  Bell,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  LogOut
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import SignInModal from './SignInModal';

export default function Navbar() {
  const {
    userRole,
    setUserRole,
    currentPage,
    navigateTo,
    batch,
    alerts,
    hostellerAuth,
    staffAuth,
    isSignInModalOpen,
    signInModalDefaultTab,
    openSignInModal,
    closeSignInModal,
    signOutHosteller,
    signOutStaff
  } = useLaundry();

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  // Status badge config
  const getStatusBadge = () => {
    if (!batch) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
          No Active Batch
        </span>
      );
    }
    if (batch.isDelivered) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          <CheckCircle2 className="w-3 h-3 mr-1 text-slate-500" />
          Delivered &amp; Closed
        </span>
      );
    }
    if (batch.isReady) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Ready at {batch.rack}
        </span>
      );
    }
    if (batch.activeDelay) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
          {batch.activeDelay.title}
        </span>
      );
    }
    if (batch.currentStep === 3) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" />
          {batch.videoPublished ? 'Video Live (#W-08)' : 'In Washer #W-08'}
        </span>
      );
    }
    if (batch.handshakeStatus === 'completed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
          Handshake Completed
        </span>
      );
    }
    if (batch.handshakeStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Pending Staff Handshake
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        Dropped Off
      </span>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Top Utility Bar */}
        <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 border-b border-slate-800">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-white">LPU Central Hostel Laundry Service</span>
              <span className="hidden sm:inline text-slate-400">• Real-Time Accountability</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              <span className="font-mono text-[10px] hidden sm:inline">Operating: 08:00 - 20:00 IST</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Row */}
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Brand Logo & Batch Info */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateTo('dashboard')}
                className="flex items-center space-x-2.5 text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-700 group-hover:bg-blue-800 text-white flex items-center justify-center shadow-sm transition-colors">
                  <WashingMachine className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                      LaundryTrack
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                      LPU
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Campus Laundry Portal
                  </p>
                </div>
              </button>

              {/* Active Batch Quick Pill */}
              <div className="hidden md:flex items-center pl-3 border-l border-slate-200 space-x-2">
                <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {batch ? `#${batch.id}` : 'Intake Desk'}
                </span>
                {getStatusBadge()}
              </div>
            </div>

            {/* Right: User Status & Dual Role Switcher */}
            <div className="flex items-center space-x-2.5">
              {/* Active Identity Pill or Sign In Button */}
              {userRole === 'hosteller' ? (
                hostellerAuth ? (
                  <div className="hidden sm:flex items-center space-x-1.5 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-mono text-blue-900">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    <span>Resident <strong>{hostellerAuth.residentId}</strong> ({hostellerAuth.hostelBlock})</span>
                    <button
                      onClick={signOutHosteller}
                      title="Sign Out"
                      className="ml-1 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openSignInModal('hosteller')}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center space-x-1 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )
              ) : (
                staffAuth ? (
                  <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-800">
                    <Shield className="w-3.5 h-3.5 text-blue-700" />
                    <span>Operator <strong>#{staffAuth.operatorId}</strong> ({staffAuth.counterNumber})</span>
                    <button
                      onClick={signOutStaff}
                      title="Sign Out"
                      className="ml-1 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openSignInModal('staff')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center space-x-1 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Staff Sign In</span>
                  </button>
                )
              )}

              {/* Alerts Bell */}
              <button
                onClick={() => navigateTo('alerts')}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                title="View Alerts & Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
                )}
              </button>

              {/* Dual Role Segmented Switcher */}
              <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUserRole('hosteller')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all ${
                    userRole === 'hosteller'
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hosteller</span>
                  {hostellerAuth ? (
                    <span className="font-mono text-[11px] text-slate-500">({hostellerAuth.residentId})</span>
                  ) : (
                    <span className="font-mono text-[10px] text-slate-400">(Guest)</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setUserRole('staff')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all ${
                    userRole === 'staff'
                      ? 'bg-blue-700 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Staff</span>
                  {staffAuth ? (
                    <span className="font-mono text-[11px] opacity-80">(#{staffAuth.operatorId})</span>
                  ) : (
                    <span className="font-mono text-[10px] opacity-60">(Desk)</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Identity & Status bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex md:hidden items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 font-mono text-slate-600">
              {userRole === 'hosteller' ? (
                hostellerAuth ? (
                  <span>Resident: <strong>{hostellerAuth.residentId}</strong> ({hostellerAuth.hostelBlock})</span>
                ) : (
                  <button onClick={() => openSignInModal('hosteller')} className="text-blue-700 font-bold underline">
                    Sign In as Resident
                  </button>
                )
              ) : (
                staffAuth ? (
                  <span>Operator: <strong>#{staffAuth.operatorId}</strong></span>
                ) : (
                  <button onClick={() => openSignInModal('staff')} className="text-blue-700 font-bold underline">
                    Sign In as Staff
                  </button>
                )
              )}
            </div>
            <div>{getStatusBadge()}</div>
          </div>
        </div>

        {/* Hosteller Navigation Bar Links */}
        {userRole === 'hosteller' && (
          <div className="border-t border-slate-200/80 bg-slate-50/70">
            <div className="max-w-4xl mx-auto px-4 flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none text-xs font-semibold">
              <button
                onClick={() => navigateTo('dashboard')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  currentPage === 'dashboard'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('dropoff')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  currentPage === 'dropoff'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Intake Proof
              </button>
              <button
                onClick={() => navigateTo('video')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  currentPage === 'video'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Wash Video
                {batch?.studentVerifiedVideo && (
                  <span className="ml-1 text-[10px] text-emerald-600">✓</span>
                )}
              </button>
              <button
                onClick={() => navigateTo('alerts')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                  currentPage === 'alerts'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Alerts</span>
                {batch?.activeDelay && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                )}
              </button>
              <button
                onClick={() => navigateTo('pickup')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  currentPage === 'pickup'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : batch?.isReady
                    ? 'text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Pickup &amp; Audit
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        defaultTab={signInModalDefaultTab}
      />
    </>
  );
}
