import { useData } from '../context/DataContext';
import { BarChart3, TrendingUp, Users, Activity, Clock, Target, AlertTriangle, CheckCircle, Database } from 'lucide-react';

// ─── Demo Data Badge ──────────────────────────────────────────────────────────
function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Sample Data
    </span>
  );
}

// ─── Simple CSS bar chart from real data ──────────────────────────────────────
function BarChart({ data, maxVal }) {
  return (
    <div className="h-40 flex items-end justify-between gap-2 border-b border-gray-100 pb-2 relative mt-2">
      <div className="absolute inset-x-0 bottom-1/4 border-b border-gray-50 border-dashed z-0" />
      <div className="absolute inset-x-0 bottom-2/4 border-b border-gray-50 border-dashed z-0" />
      <div className="absolute inset-x-0 bottom-3/4 border-b border-gray-50 border-dashed z-0" />
      {data.map(({ label, value, color }, i) => {
        const pct = maxVal === 0 ? 0 : Math.max(4, Math.round((value / maxVal) * 100));
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 relative z-10 group">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-navy text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {value} incident{value !== 1 ? 's' : ''}
            </div>
            <div
              className="w-full rounded-t-lg transition-all duration-700"
              style={{ height: `${pct}%`, background: color }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const { incidents } = useData() || {};

  if (!incidents || !Array.isArray(incidents)) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-brand-primary">
        <div className="animate-spin h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full mb-4" />
        <p className="font-bold text-lg animate-pulse">Compiling Analytics...</p>
      </div>
    );
  }

  // ─── Computed from real incident data ─────────────────────────────────────
  const total = incidents.length;
  const resolved = incidents.filter(i => i.status === 'Resolved').length;
  const active = incidents.filter(i => i.status !== 'Resolved').length;
  const resolutionRate = total === 0 ? 0 : Math.round((resolved / total) * 100);
  const totalAffected = incidents.reduce((acc, i) => acc + (i.peopleAffected || 0), 0);
  const highPriority = incidents.filter(i => i.urgency === 'HIGH' || i.urgency === 'CRITICAL').length;
  const verified = incidents.filter(i => i.verificationStatus === 'Verified').length;

  // Severity distribution
  const severityData = [
    { label: 'Critical', value: incidents.filter(i => i.urgency === 'CRITICAL').length, color: '#ef4444' },
    { label: 'High',     value: incidents.filter(i => i.urgency === 'HIGH').length,     color: '#f97316' },
    { label: 'Medium',   value: incidents.filter(i => i.urgency === 'MEDIUM').length,   color: '#f59e0b' },
    { label: 'Low',      value: incidents.filter(i => i.urgency === 'LOW').length,      color: '#10b981' },
  ];
  const maxSev = Math.max(...severityData.map(d => d.value), 1);

  // Type distribution — count by incidentType
  const typeCounts = incidents.reduce((acc, i) => {
    acc[i.incidentType] = (acc[i.incidentType] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxType = Math.max(...typeData.map(d => d[1]), 1);

  // Status distribution
  const statusMap = {
    Active: incidents.filter(i => i.status === 'Active').length,
    Escalated: incidents.filter(i => i.status === 'Escalated').length,
    'Rescue in Progress': incidents.filter(i => i.status === 'Rescue in Progress').length,
    Resolved: resolved,
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-3 rounded-2xl text-white shadow-lg">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">System Analytics</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Statistics computed from the <strong>{total}</strong> incidents currently loaded.
            </p>
          </div>
        </div>
        <DemoBadge />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Incidents', value: total, icon: <Database size={20} />, color: 'text-gray-500', bg: 'bg-gray-50' },
          { label: 'Active',          value: active, icon: <Activity size={20} />, color: 'text-brand-accent', bg: 'bg-pink-50' },
          { label: 'High / Critical', value: highPriority, icon: <AlertTriangle size={20} />, color: 'text-brand-danger', bg: 'bg-red-50' },
          { label: 'Resolved',        value: resolved, icon: <CheckCircle size={20} />, color: 'text-brand-success', bg: 'bg-emerald-50' },
          { label: 'People Affected', value: totalAffected.toLocaleString(), icon: <Users size={20} />, color: 'text-brand-warning', bg: 'bg-amber-50' },
          { label: 'Verified',        value: verified, icon: <Target size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`}>{icon}</div>
            <p className="text-2xl font-black text-brand-navy">{value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution — from real data */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-brand-navy uppercase tracking-widest text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-danger" /> Severity Distribution
            </h3>
            <DemoBadge />
          </div>
          <BarChart data={severityData} maxVal={maxSev} />
          <div className="flex justify-between mt-3">
            {severityData.map(({ label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="text-[10px] font-bold text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Type Distribution */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-brand-navy uppercase tracking-widest text-sm flex items-center gap-2">
              <Activity size={16} className="text-brand-accent" /> Incident Types
            </h3>
            <DemoBadge />
          </div>
          <div className="space-y-3">
            {typeData.map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-brand-navy truncate max-w-[60%]">{type}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-700"
                    style={{ width: `${Math.round((count / maxType) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {typeData.length === 0 && <p className="text-gray-400 text-sm font-medium text-center py-4">No incidents loaded.</p>}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-brand-navy uppercase tracking-widest text-sm flex items-center gap-2">
              <Clock size={16} className="text-brand-warning" /> Status Breakdown
            </h3>
            <DemoBadge />
          </div>
          <div className="space-y-4">
            {Object.entries(statusMap).map(([status, count]) => {
              const colors = {
                Active: 'bg-pink-500',
                Escalated: 'bg-purple-500',
                'Rescue in Progress': 'bg-blue-500',
                Resolved: 'bg-emerald-500',
              };
              const pct = total === 0 ? 0 : Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span className="text-brand-navy">{status}</span>
                    <span className="text-gray-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[status]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resolution rate circle */}
          <div className="mt-6 bg-gradient-to-br from-brand-soft/60 to-white rounded-2xl p-5 border border-brand-primary/20 flex items-center gap-5">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#fdf2f8" strokeWidth="6" />
                <circle cx="28" cy="28" r="24" fill="none" stroke="#ec4899" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - resolutionRate / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-brand-accent">{resolutionRate}%</span>
            </div>
            <div>
              <p className="font-black text-brand-navy">Resolution Rate</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{resolved} of {total} incidents resolved</p>
            </div>
          </div>
        </div>

        {/* AI Engine Info — honest about what is and isn't real */}
        <div className="bg-gradient-to-br from-brand-navy to-gray-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2 mb-2 relative z-10">
            <Clock size={16} className="text-brand-accent" /> AI Engine Status
          </h3>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-6 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Configuration Required
          </div>

          <div className="space-y-4 relative z-10">
            {[
              { label: 'Gemini API Key', value: 'Not configured (backend/.env)', pct: 0, color: '#ef4444' },
              { label: 'Backend Connection', value: 'Offline — demo mode active', pct: 0, color: '#f97316' },
              { label: 'Incident Deduplication', value: 'Available when backend runs', pct: 50, color: '#f9a8d4' },
              { label: 'Entity Extraction', value: 'Requires GEMINI_API_KEY', pct: 25, color: '#f9a8d4' },
            ].map(({ label, value, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-gray-300">{label}</span>
                  <span style={{ color }}>{value}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 p-4 rounded-2xl relative z-10">
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              To enable AI triage: set <code className="text-brand-primary font-black">GEMINI_API_KEY</code> in <code className="text-brand-primary font-black">backend/.env</code> and run the backend locally.
              The AI will then extract entities, classify severity, and deduplicate incoming reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
