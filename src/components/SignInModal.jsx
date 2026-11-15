import React, { useState } from 'react';
import { X, User, Shield, CheckCircle2, ArrowRight, Building, KeyRound, Sparkles } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

export default function SignInModal({ isOpen, onClose, defaultTab = 'hosteller' }) {
  const { hostellerAuth, staffAuth, signInHosteller, signInStaff, setUserRole } = useLaundry();

  const [activeTab, setActiveTab] = useState(defaultTab); // 'hosteller' | 'staff'

  // Hosteller form
  const [residentId, setResidentId] = useState(hostellerAuth?.residentId || '');
  const [hostelBlock, setHostelBlock] = useState(hostellerAuth?.hostelBlock || 'BH-11');

  // Staff form
  const [operatorId, setOperatorId] = useState(staffAuth?.operatorId || '');
  const [counterNumber, setCounterNumber] = useState(staffAuth?.counterNumber || 'Counter 2');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleHostellerSubmit = (e) => {
    e.preventDefault();
    if (!residentId.trim()) {
      setError('Please enter a valid Resident ID / Code (e.g., H-01).');
      return;
    }
    signInHosteller(residentId.trim().toUpperCase(), hostelBlock.trim().toUpperCase());
    setUserRole('hosteller');
    onClose();
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (!operatorId.trim()) {
      setError('Please enter a valid Operator ID (e.g., OP-409).');
      return;
    }
    signInStaff(operatorId.trim().toUpperCase(), counterNumber.trim());
    setUserRole('staff');
    onClose();
  };

  const quickFillHosteller = () => {
    setResidentId('H-01');
    setHostelBlock('BH-11');
    setError('');
  };

  const quickFillStaff = () => {
    setOperatorId('OP-409');
    setCounterNumber('Counter 2');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Campus Laundry Portal Sign In</h2>
            <p className="text-xs text-slate-300 font-mono">
              Lovely Professional University • Central Operations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('hosteller');
              setError('');
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'hosteller'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Hosteller Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              setError('');
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'staff'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Staff Sign In</span>
          </button>
        </div>

        {error && (
          <div className="m-4 mb-0 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Tab 1: Hosteller Form */}
        {activeTab === 'hosteller' && (
          <form onSubmit={handleHostellerSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Resident ID / Anonymized Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., H-01"
                  value={residentId}
                  onChange={(e) => setResidentId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Zero-PII campus standard. Use your hostel resident token or code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hostel Residence Block
              </label>
              <select
                value={hostelBlock}
                onChange={(e) => setHostelBlock(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="BH-11">Hostel BH-11 (Boys Hostel 11)</option>
                <option value="BH-12">Hostel BH-12 (Boys Hostel 12)</option>
                <option value="BH-08">Hostel BH-08 (Boys Hostel 08)</option>
                <option value="GH-05">Hostel GH-05 (Girls Hostel 05)</option>
                <option value="GH-06">Hostel GH-06 (Girls Hostel 06)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={quickFillHosteller}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill Demo (H-01 / BH-11)</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <span>Sign In as Hosteller</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Staff Form */}
        {activeTab === 'staff' && (
          <form onSubmit={handleStaffSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Counter Operator ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., OP-409"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter your staff desk operator code for audit signing.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Laundry Counter
              </label>
              <select
                value={counterNumber}
                onChange={(e) => setCounterNumber(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Counter 2">Central Counter 2 (BH-11 Basement)</option>
                <option value="Counter 1">Central Counter 1 (BH-11 Ground)</option>
                <option value="Counter 3">Express Intake Counter 3</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={quickFillStaff}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill Demo (OP-409 / Counter 2)</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <span>Sign In as Staff</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
