import { ShieldAlert, UserCheck, Factory } from "lucide-react";

function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="bg-violet-600/10 border border-violet-500/20 p-2 rounded-xl text-violet-400">
          <Factory size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            Plant Operations Exception Hub
          </h1>
          <p className="text-xs text-slate-400">Real-time Shift Validation & Quality Control</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Manager Role Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <UserCheck size={14} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-300">
            Manager Session: <span className="text-slate-100 font-semibold">Chief Wiggum</span>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
