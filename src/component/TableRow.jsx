import StatusBadge from "./StatusBadge";
import { Eye, ShieldAlert, CheckCircle2, User, Clock, AlertCircle } from "lucide-react";

function TableRow({ record, onReview }) {
  // Check if there are violations
  const hasViolations = record.flagReasons && record.flagReasons.length > 0;

  return (
    <tr className="border-b border-slate-800/60 bg-slate-900/10 hover:bg-slate-800/40 transition-colors group">
      {/* ID */}
      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
        #{record.id}
      </td>

      {/* Plant & Operator */}
      <td className="px-6 py-4">
        <div className="space-y-0.5">
          <div className="font-semibold text-white group-hover:text-violet-400 transition-colors text-sm">
            {record.plantName}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <User size={10} className="text-slate-500" />
            {record.operatorName}
          </div>
        </div>
      </td>

      {/* Shift Date & Type */}
      <td className="px-6 py-4">
        <div className="space-y-0.5">
          <div className="text-sm text-slate-300 font-medium">{record.shiftDate}</div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={10} className="text-slate-500" />
            {record.shiftType} Shift
          </div>
        </div>
      </td>

      {/* Production Volume */}
      <td className={`px-6 py-4 text-sm font-medium ${record.productionVolume < 100 ? "text-amber-400" : "text-slate-300"}`}>
        {record.productionVolume.toLocaleString()}
      </td>

      {/* Efficiency Rate */}
      <td className={`px-6 py-4 text-sm font-medium ${record.efficiencyRate < 70 ? "text-amber-400" : "text-slate-300"}`}>
        {record.efficiencyRate}%
      </td>

      {/* Downtime Hours */}
      <td className={`px-6 py-4 text-sm font-medium ${record.downtimeHours > 4 ? "text-amber-400" : "text-slate-300"}`}>
        {record.downtimeHours} hr{record.downtimeHours !== 1 && "s"}
      </td>

      {/* Safety Incidents */}
      <td className="px-6 py-4">
        {record.safetyIncidents > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
            <AlertCircle size={12} />
            {record.safetyIncidents} incident{record.safetyIncidents !== 1 && "s"}
          </span>
        ) : (
          <span className="text-slate-500 text-sm">0</span>
        )}
      </td>

      {/* Status Badge & Resolution Reason */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div>
            <StatusBadge status={record.status} />
          </div>
          {record.managerReason && (
            <div className="max-w-[200px] text-[10px] text-slate-400 leading-normal border-l border-slate-700 pl-1.5 italic">
              <span className="font-semibold text-slate-300 not-italic">Reason:</span> {record.managerReason}
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        {record.status === "FLAGGED" ? (
          <button
            onClick={() => onReview(record)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.97] text-slate-950 text-xs font-bold transition-all shadow-[0_0_10px_rgba(245,158,11,0.15)]"
          >
            <ShieldAlert size={13} />
            Review
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium select-none pr-3">
            <CheckCircle2 size={13} className="text-slate-600" />
            Verified
          </div>
        )}
      </td>
    </tr>
  );
}

export default TableRow;
