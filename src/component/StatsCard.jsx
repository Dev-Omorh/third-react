function StatsCard({ title, value, icon: Icon, accentClass = "from-violet-500/10 to-transparent border-violet-500/20 text-violet-400" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-slate-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-between border-slate-800 ${accentClass}`}>
      <div className="space-y-1.5 z-10">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{title}</span>
        <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
      </div>
      
      {Icon && (
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/40 z-10">
          <Icon size={20} className="stroke-[1.8]" />
        </div>
      )}
      
      {/* Background radial accent glow */}
      <div className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-current opacity-[0.02] filter blur-xl pointer-events-none" />
    </div>
  );
}

export default StatsCard;
