import { useState } from "react";
import { X, ShieldCheck, XCircle, AlertTriangle, Cpu, User, Calendar, Clock } from "lucide-react";

function ActionModal({ record, isOpen, onClose, onSubmit }) {
  const [action, setAction] = useState("APPROVED"); // APPROVED or REJECTED
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !record) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for this decision.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(record.id, { action, reason: reason.trim() });
      setReason("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div>
            <h3 className="text-lg font-semibold tracking-wide text-white">Review Shift Exception</h3>
            <p className="text-xs text-slate-400 mt-0.5">Record ID: #{record.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Record Summary Card */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-950/50 p-4 border border-slate-800/60">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Plant</span>
                  <span className="text-sm font-medium text-slate-300">{record.plantName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Operator</span>
                  <span className="text-sm font-medium text-slate-300">{record.operatorName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Date</span>
                  <span className="text-sm font-medium text-slate-300">{record.shiftDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Shift</span>
                  <span className="text-sm font-medium text-slate-300">{record.shiftType}</span>
                </div>
              </div>
            </div>

            {/* Violation Details */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Flagged Violations
              </h4>
              <ul className="space-y-1.5">
                {record.flagReasons.map((reason, i) => (
                  <li 
                    key={i} 
                    className="text-sm rounded-lg bg-amber-500/5 border border-amber-500/10 p-2.5 text-amber-300 flex items-start gap-2"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Action Resolution</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAction("APPROVED")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium text-sm transition-all duration-200 ${
                    action === "APPROVED"
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <ShieldCheck size={18} />
                  Approve Exception
                </button>
                <button
                  type="button"
                  onClick={() => setAction("REJECTED")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium text-sm transition-all duration-200 ${
                    action === "REJECTED"
                      ? "bg-rose-950/40 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                      : "bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <XCircle size={18} />
                  Reject Record
                </button>
              </div>
            </div>

            {/* Reason Textarea */}
            <div className="space-y-2">
              <label htmlFor="reason" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Justification Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="reason"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  action === "APPROVED" 
                    ? "e.g., Exception approved because machine was undergoing scheduled calibration, target production was adjusted." 
                    : "e.g., Record rejected due to unauthorized downtime and operator negligence."
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                {error}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/40 p-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`rounded-xl px-5 py-2 text-sm font-medium text-white transition-all duration-200 ${
                action === "APPROVED"
                  ? "bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98]"
                  : "bg-rose-600 hover:bg-rose-500 active:scale-[0.98]"
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              {submitting ? "Saving..." : "Submit Decision"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActionModal;
