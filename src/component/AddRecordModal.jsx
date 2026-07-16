import { useState, useEffect } from "react";
import { X, ClipboardCopy, Server, User, Calendar, PlusCircle } from "lucide-react";

function AddRecordModal({ isOpen, onClose, onSubmit }) {
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const initialFormState = {
    plantName: "",
    operatorName: "",
    shiftDate: getTodayDateString(),
    shiftType: "Morning",
    productionVolume: "",
    efficiencyRate: "",
    downtimeHours: "",
    safetyIncidents: "0",
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...initialFormState, shiftDate: getTodayDateString() });
      setErrors([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Client-side validations
    const validationErrors = [];
    if (!form.plantName.trim()) validationErrors.push("Plant Name is required.");
    if (!form.operatorName.trim()) validationErrors.push("Operator Name is required.");
    if (!form.shiftDate) validationErrors.push("Shift Date is required.");
    
    const prod = Number(form.productionVolume);
    if (form.productionVolume === "" || isNaN(prod) || prod < 0) {
      validationErrors.push("Production Volume must be a positive number.");
    }
    
    const eff = Number(form.efficiencyRate);
    if (form.efficiencyRate === "" || isNaN(eff) || eff < 0 || eff > 100) {
      validationErrors.push("Efficiency Rate must be a percentage between 0 and 100.");
    }
    
    const down = Number(form.downtimeHours);
    if (form.downtimeHours === "" || isNaN(down) || down < 0) {
      validationErrors.push("Downtime Hours must be a non-negative number.");
    }
    
    const safety = Number(form.safetyIncidents);
    if (form.safetyIncidents === "" || isNaN(safety) || safety < 0 || !Number.isInteger(safety)) {
      validationErrors.push("Safety Incidents must be a non-negative integer.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        plantName: form.plantName,
        operatorName: form.operatorName,
        shiftDate: form.shiftDate,
        shiftType: form.shiftType,
        productionVolume: prod,
        efficiencyRate: eff,
        downtimeHours: down,
        safetyIncidents: safety,
      });
      onClose();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors([err.message || "Something went wrong on the server."]);
      }
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

      {/* Modal Box */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-2">
            <PlusCircle size={20} className="text-violet-400" />
            <h3 className="text-lg font-semibold tracking-wide text-white">Log New Shift Record</h3>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Plant Name */}
            <div className="space-y-1">
              <label htmlFor="plantName" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Plant Location / Unit
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  id="plantName"
                  name="plantName"
                  value={form.plantName}
                  onChange={handleChange}
                  placeholder="e.g. Springfield Sector 7G"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                />
              </div>
            </div>

            {/* Operator Name */}
            <div className="space-y-1">
              <label htmlFor="operatorName" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Operator Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  id="operatorName"
                  name="operatorName"
                  value={form.operatorName}
                  onChange={handleChange}
                  placeholder="e.g. Homer Simpson"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                />
              </div>
            </div>

            {/* Date & Shift Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="shiftDate" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Shift Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="date"
                    id="shiftDate"
                    name="shiftDate"
                    value={form.shiftDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="shiftType" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Shift Type
                </label>
                <select
                  id="shiftType"
                  name="shiftType"
                  value={form.shiftType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-4 text-sm text-slate-100 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                >
                  <option value="Morning">Morning</option>
                  <option value="Day">Day</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div>

            {/* Metrics Section Header */}
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Operation Metrics</span>
            </div>

            {/* Production & Efficiency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="productionVolume" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Production Vol (units)
                </label>
                <input
                  type="number"
                  id="productionVolume"
                  name="productionVolume"
                  value={form.productionVolume}
                  onChange={handleChange}
                  placeholder="e.g. 450"
                  min="0"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="efficiencyRate" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Efficiency Rate (%)
                </label>
                <input
                  type="number"
                  id="efficiencyRate"
                  name="efficiencyRate"
                  value={form.efficiencyRate}
                  onChange={handleChange}
                  placeholder="e.g. 88.5"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                />
              </div>
            </div>

            {/* Downtime & Safety */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="downtimeHours" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Downtime (hours)
                </label>
                <input
                  type="number"
                  id="downtimeHours"
                  name="downtimeHours"
                  value={form.downtimeHours}
                  onChange={handleChange}
                  placeholder="e.g. 1.5"
                  min="0"
                  step="0.1"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="safetyIncidents" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Safety Incidents
                </label>
                <input
                  type="number"
                  id="safetyIncidents"
                  name="safetyIncidents"
                  value={form.safetyIncidents}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                  min="0"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                />
              </div>
            </div>

            {errors.length > 0 && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-400 space-y-1">
                <span className="font-semibold block">Please correct the following errors:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
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
              className="rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] px-5 py-2 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? "Validating..." : "Log & Validate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecordModal;
