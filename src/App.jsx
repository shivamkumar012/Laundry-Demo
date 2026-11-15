import React from 'react';
import { LaundryProvider, useLaundry } from './context/LaundryContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import HostellerDashboard from './pages/HostellerDashboard';
import DropOffIntakePage from './pages/DropOffIntakePage';
import WashVideoPage from './pages/WashVideoPage';
import AlertsDelayPage from './pages/AlertsDelayPage';
import CounterPickupPage from './pages/CounterPickupPage';
import StaffConsolePage from './pages/StaffConsolePage';

function AppContent() {
  const { currentPage, userRole } = useLaundry();

  const renderCurrentPage = () => {
    // If user is currently in Staff mode or navigating to staff console
    if (userRole === 'staff' || currentPage === 'staff') {
      return <StaffConsolePage />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <HostellerDashboard />;
      case 'dropoff':
        return <DropOffIntakePage />;
      case 'video':
        return <WashVideoPage />;
      case 'alerts':
        return <AlertsDelayPage />;
      case 'pickup':
        return <CounterPickupPage />;
      default:
        return <HostellerDashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Centered responsive content container conforming to strict visual & layout rules */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        {renderCurrentPage()}
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <LaundryProvider>
      <AppContent />
    </LaundryProvider>
  );
}
