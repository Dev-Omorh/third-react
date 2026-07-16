import { CheckCircle2, AlertTriangle, ShieldCheck, XCircle } from "lucide-react";

function StatusBadge({ status }) {
  switch (status) {
    case "PASSED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
          <CheckCircle2 size={12} className="text-emerald-400" />
          PASSED
        </span>
      );
    case "FLAGGED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/40 text-amber-400 border border-amber-800/30 animate-pulse">
          <AlertTriangle size={12} className="text-amber-400" />
          FLAGGED
        </span>
      );
    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-950/40 text-sky-400 border border-sky-800/30">
          <ShieldCheck size={12} className="text-sky-400" />
          APPROVED
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/40 text-rose-400 border border-rose-800/30">
          <XCircle size={12} className="text-rose-400" />
          REJECTED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-700">
          {status}
        </span>
      );
  }
}

export default StatusBadge;
