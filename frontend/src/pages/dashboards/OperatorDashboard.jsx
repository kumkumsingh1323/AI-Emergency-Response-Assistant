import { useData } from '../../context/DataContext';
import IncidentCard from '../../components/IncidentCard';
import MapView from '../../components/MapView';
import { AlertCircle, CheckCircle, Flame, Users, Activity } from 'lucide-react';

export default function Dashboard() {
  const { incidents } = useData() || {};

  if (!incidents || !Array.isArray(incidents)) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-brand-primary">
        <div className="animate-spin h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full mb-4"></div>
        <p className="font-bold text-lg animate-pulse">Syncing Control Center...</p>
      </div>
    );
  }

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const highUrgency = activeIncidents.filter(i => i.urgency === 'HIGH' || i.urgency === 'CRITICAL');
  const totalAffected = activeIncidents.reduce((acc, curr) => acc + (curr.peopleAffected || 0), 0);
  const resolved = incidents.filter(i => i.status === 'Resolved');

  return (
    <div className="space-y-8 pb-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={<AlertCircle size={28} className="text-brand-accent" />}
          title="Active Incidents"
          value={activeIncidents.length}
          trend="+2 since last hour"
        />
        <MetricCard 
          icon={<Flame size={28} className="text-brand-danger" />}
          title="High Urgency"
          value={highUrgency.length}
          trend="Requires immediate attention"
        />
        <MetricCard 
          icon={<Users size={28} className="text-brand-warning" />}
          title="People Affected"
          value={totalAffected}
          trend="Estimated across zones"
        />
        <MetricCard 
          icon={<CheckCircle size={28} className="text-brand-success" />}
          title="Resolved"
          value={resolved.length}
          trend="Successfully handled"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(249,168,212,0.1)] transition-shadow">
            <h2 className="text-xl font-extrabold mb-5 text-brand-navy flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-danger"></span>
              </span>
              Live Emergency Map
            </h2>
            <div className="rounded-2xl overflow-hidden border-4 border-white shadow-inner">
              <MapView incidents={incidents} />
            </div>
          </div>
        </div>

        <div className="space-y-5 bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm">
          <h2 className="text-xl font-extrabold text-brand-navy flex items-center justify-between tracking-tight">
            <span className="flex items-center gap-2"><Activity className="text-brand-accent" size={20}/> Feed</span>
            <span className="text-xs font-black text-brand-accent bg-brand-soft/80 backdrop-blur-sm px-3 py-1 rounded-full border border-brand-primary/30 shadow-sm">
              {activeIncidents.length} ACTIVE
            </span>
          </h2>
          
          <div className="space-y-5 h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {activeIncidents.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full scale-150"></div>
                  <img 
                    src="/empty_state.jpg" 
                    alt="No active incidents" 
                    className="w-48 h-48 object-cover rounded-full mb-6 shadow-xl border-4 border-white relative z-10 hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <p className="text-brand-navy font-bold text-lg mb-1">Area Secure</p>
                <p className="text-gray-500 font-medium text-sm">All clear. No active emergencies reported.</p>
              </div>
            ) : (
              activeIncidents.map(incident => (
                <IncidentCard key={incident._id} incident={incident} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, trend }) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(249,168,212,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/20 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-soft to-white border border-brand-primary/10 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-4xl font-black text-brand-navy tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-wider">{title}</p>
        {trend && <p className="text-[10px] text-brand-primary font-bold mt-2">{trend}</p>}
      </div>
    </div>
  );
}
