import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, FileText, CheckCircle2, Paperclip, Send } from 'lucide-react';

export default function DisputeModal({
  isOpen,
  onClose,
  batchId = 'BH11-001',
  studentCode = 'Student',
  operatorCode = 'Operator',
  intakePhoto,
  garments,
  onSubmitTicket
}) {
  const [category, setCategory] = useState('shirts');
  const [issueType, setIssueType] = useState('missing');
  const [affectedCount, setAffectedCount] = useState(1);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: ticketId,
      batchId,
      studentCode,
      operatorCode,
      category,
      issueType,
      affectedCount,
      description: description || `Discrepancy reported during pickup audit for ${category}.`,
      intakePhoto,
      status: 'UNDER INVESTIGATION',
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST, ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      slaDeadline: 'Within 48 Hours (Campus Laundry Policy §14.2)',
      resolutionAction: 'Counter CCTV review & physical rack scan initiated.'
    };

    setTimeout(() => {
      onSubmitTicket(newTicket);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-800/80">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Dispute & Missing Item Report</h2>
              <p className="text-xs text-red-100 font-mono">
                Batch #{batchId} • Counter #2 Intake Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-red-200 hover:text-white hover:bg-red-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p>
              Your dispute will automatically bind the cryptographically locked Intake Photo proof recorded at drop-off. Central Hostel Laundry is mandated to audit counter CCTV within 48 hours.
            </p>
          </div>

          {/* Attached Locked Intake Proof Thumbnail */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-10 rounded border border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                {intakePhoto ? (
                  <img src={intakePhoto} alt="Locked proof" className="max-h-full max-w-full w-auto h-auto object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">NO PROOF</div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Paperclip className="w-3 h-3 text-slate-500" />
                  Locked Intake Bundle Proof Attached
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Signed by {operatorCode} & {studentCode}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Verified Evidence
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Affected Garment Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="shirts">Shirts ({garments?.shirts || 0} registered)</option>
                <option value="trousers">Trousers / Jeans ({garments?.trousers || 0} registered)</option>
                <option value="hoodies">Hoodies / Jackets ({garments?.hoodies || 0} registered)</option>
                <option value="bedsheets">Bedsheets / Linen ({garments?.bedsheets || 0} registered)</option>
                <option value="other">Other / Mixed Item</option>
              </select>
            </div>

            {/* Issue type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nature of Discrepancy
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="missing">Completely Missing from Bundle</option>
                <option value="torn">Fabric Torn / Seam Ripped</option>
                <option value="stain">Color Bleed / Chemical Stain</option>
                <option value="wrong_item">Belongs to Another Student (Wrong Item)</option>
                <option value="shrinkage">Severe Heat Shrinkage</option>
              </select>
            </div>
          </div>

          {/* Affected count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Number of Garments Affected
            </label>
            <div className="flex items-center space-x-3">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setAffectedCount(num)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    affectedCount === num
                      ? 'bg-red-600 border-red-700 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {num} item{num > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Garment Description / Identifying Marks
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 1 Black oversized hoodie missing; or 1 navy polo has bleach discoloration on left collar."
              className="w-full text-xs rounded-lg border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Registering Ticket...' : 'Generate Verifiable Ticket (#TCK-9921)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
