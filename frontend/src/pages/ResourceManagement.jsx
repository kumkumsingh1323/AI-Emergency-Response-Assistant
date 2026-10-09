import { useState } from 'react';
import { Truck, Flame, Anchor, HeartPulse, Package, Bus, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// ─── Sample resource data — clearly labelled as DEMO ─────────────────────────
const INITIAL_RESOURCES = [
  { id: 'r001', type: 'Ambulance',           unit: 'AMB-12', status: 'Available',  location: 'Chennai HQ',      icon: HeartPulse, color: '#10b981' },
  { id: 'r002', type: 'Ambulance',           unit: 'AMB-07', status: 'Deployed',   location: 'Velachery MRTS',  icon: HeartPulse, color: '#ef4444' },
  { id: 'r003', type: 'Fire Brigade',        unit: 'FB-03',  status: 'Available',  location: 'T Nagar Station', icon: Flame,      color: '#10b981' },
  { id: 'r004', type: 'Fire Brigade',        unit: 'FB-09',  status: 'Deployed',   location: 'HPCL Refinery',   icon: Flame,      color: '#ef4444' },
  { id: 'r005', type: 'Search & Rescue',     unit: 'SAR-02', status: 'Deployed',   location: 'Dharavi Mumbai',  icon: Users,      color: '#ef4444' },
  { id: 'r006', type: 'Search & Rescue',     unit: 'SAR-05', status: 'Available',  location: 'Guindy Base',     icon: Users,      color: '#10b981' },
  { id: 'r007', type: 'Rescue Boat',         unit: 'RB-01',  status: 'Deployed',   location: 'Assam Flood Zone',icon: Anchor,     color: '#ef4444' },
  { id: 'r008', type: 'Rescue Boat',         unit: 'RB-04',  status: 'Standby',    location: 'Chennai Coast',   icon: Anchor,     color: '#f59e0b' },
  { id: 'r009', type: 'Medical Supplies',    unit: 'MED-A',  status: 'Available',  location: 'Central Warehouse',icon: Package,   color: '#10b981' },
  { id: 'r010', type: 'Medical Supplies',    unit: 'MED-C',  status: 'Deployed',   location: 'Manipur Relief',  icon: Package,    color: '#ef4444' },
  { id: 'r011', type: 'Evacuation Bus',      unit: 'BUS-11', status: 'Available',  location: 'Hyderabad Depot', icon: Bus,        color: '#10b981' },
  { id: 'r012', type: 'Evacuation Bus',      unit: 'BUS-06', status: 'Deployed',   location: 'Odisha Cyclone',  icon: Bus,        color: '#ef4444' },
  { id: 'r013', type: 'NDRF Team',           unit: 'NDRF-3', status: 'Deployed',   location: 'Manipur EQ Zone', icon: Users,      color: '#ef4444' },
  { id: 'r014', type: 'NDRF Team',           unit: 'NDRF-7', status: 'Available',  location: 'Delhi Standby',   icon: Users,      color: '#10b981' },
  { id: 'r015', type: 'Hazmat Team',         unit: 'HZM-01', status: 'Deployed',   location: 'Surat GIDC',      icon: AlertCircle,color: '#ef4444' },
];

const STATUS_STYLES = {
  Available: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Deployed:  'bg-red-50 text-red-600 border-red-200',
  Standby:   'bg-amber-50 text-amber-600 border-amber-200',
  Returning: 'bg-blue-50 text-blue-600 border-blue-200',
};

const STATUS_ICONS = {
  Available: CheckCircle,
  Deployed:  AlertCircle,
  Standby:   Clock,
};

const ALL_TYPES = ['All', ...new Set(INITIAL_RESOURCES.map(r => r.type))];
const ALL_STATUSES = ['All', 'Available', 'Deployed', 'Standby'];

export default function ResourceManagement() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = resources.filter(r => {
    const tMatch = typeFilter === 'All' || r.type === typeFilter;
    const sMatch = statusFilter === 'All' || r.status === statusFilter;
    return tMatch && sMatch;
  });

  const counts = {
    total: resources.length,
    available: resources.filter(r => r.status === 'Available').length,
    deployed: resources.filter(r => r.status === 'Deployed').length,
    standby: resources.filter(r => r.status === 'Standby').length,
  };

  const cycleStatus = (id) => {
    const cycle = ['Available', 'Standby', 'Deployed'];
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      const next = cycle[(cycle.indexOf(r.status) + 1) % cycle.length];
      return { ...r, status: next, color: next === 'Available' ? '#10b981' : next === 'Standby' ? '#f59e0b' : '#ef4444' };
    }));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-3 rounded-2xl text-white shadow-lg">
            <Truck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">Resource Management</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Track and manage emergency response assets.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Demo Data — No real dispatch integration
        </span>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Units',  value: counts.total,     bg: 'bg-gray-50',      color: 'text-gray-600' },
          { label: 'Available',    value: counts.available,  bg: 'bg-emerald-50',   color: 'text-emerald-600' },
          { label: 'Deployed',     value: counts.deployed,   bg: 'bg-red-50',       color: 'text-red-600' },
          { label: 'Standby',      value: counts.standby,    bg: 'bg-amber-50',     color: 'text-amber-600' },
        ].map(({ label, value, bg, color }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 border border-white/60`}>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Resource Type</label>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none cursor-pointer"
          >
            {ALL_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none cursor-pointer"
          >
            {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <p className="text-sm font-bold text-gray-400">Showing <span className="text-brand-navy">{filtered.length}</span> of {resources.length}</p>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => {
          const Icon = r.icon;
          const StatusIcon = STATUS_ICONS[r.status] || Clock;
          return (
            <div key={r.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 group relative overflow-hidden"
            >
              {/* Accent blob */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-20"
                style={{ background: r.color }} />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: r.color + '15' }}>
                    <Icon size={20} style={{ color: r.color }} />
                  </div>
                  <div>
                    <p className="font-black text-brand-navy text-sm">{r.unit}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{r.type}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${STATUS_STYLES[r.status] || ''}`}>
                  <StatusIcon size={11} />
                  {r.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-4 relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Current Location</p>
                <p className="text-sm font-bold text-brand-navy">📍 {r.location}</p>
              </div>

              <button
                onClick={() => cycleStatus(r.id)}
                className="w-full text-center text-[11px] font-black text-brand-accent hover:text-pink-600 bg-brand-soft/60 hover:bg-brand-soft border border-brand-primary/20 py-2 rounded-xl transition-all relative z-10"
              >
                ⚡ Change Status (Demo)
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-white/60">
          <Truck size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-bold text-brand-navy">No resources match filters</p>
          <p className="text-gray-400 text-sm mt-1">Try changing the type or status filter.</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-amber-700 leading-relaxed">
          <strong>Demo Data Only.</strong> This resource management panel uses sample data for demonstration purposes.
          No actual ambulances, fire brigades, or rescue teams are being tracked or dispatched.
          A real integration would require a backend resource model, real-time GPS tracking, and dispatch API.
        </p>
      </div>
    </div>
  );
}
