import { useData } from '../../context/DataContext';
import IncidentCard from '../../components/IncidentCard';
import { Users, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TeamLeaderDashboard() {
  const { incidents } = useData() || {};

  if (!incidents) return null;

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const highPriority = activeIncidents.filter(i => i.urgency === 'HIGH' || i.urgency === 'CRITICAL');

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 p-6 rounded-3xl border border-white/60 shadow-sm col-span-1 md:col-span-2">
          <h2 className="text-xl font-extrabold text-brand-navy mb-2 flex items-center gap-2">
            <Users className="text-brand-accent" /> Team Alpha Status
          </h2>
          <p className="text-sm text-gray-500 mb-4">Current shift operational capacity</p>
          <div className="flex gap-4">
            <div className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-green-600">8</p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1">Available</p>
            </div>
            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-blue-600">14</p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1">Deployed</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 p-6 rounded-3xl border border-white/60 shadow-sm">
          <p className="text-sm text-gray-500 font-bold uppercase mb-1">Active Tasks</p>
          <p className="text-4xl font-black text-brand-navy mb-2">{activeIncidents.length}</p>
          <Activity size={24} className="text-brand-primary" />
        </div>

        <div className="bg-white/80 p-6 rounded-3xl border border-white/60 shadow-sm">
          <p className="text-sm text-gray-500 font-bold uppercase mb-1">High Priority</p>
          <p className="text-4xl font-black text-brand-danger mb-2">{highPriority.length}</p>
          <AlertTriangle size={24} className="text-brand-danger" />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm">
        <h2 className="text-xl font-extrabold text-brand-navy mb-6">Team Workload & Assignments</h2>
        
        <div className="space-y-4">
          {activeIncidents.map(incident => (
            <div key={incident._id} className="flex flex-col md:flex-row gap-4 items-center p-4 bg-gray-50 border border-gray-100 rounded-2xl">
              <div className="flex-1 w-full">
                <p className="font-bold text-brand-navy">{incident.title || incident.incidentType}</p>
                <p className="text-xs text-gray-500">{incident.location} • {incident.urgency}</p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <select className="w-full md:w-48 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-brand-primary">
                  <option>Assign Responder...</option>
                  <option value="john">John Doe (Available)</option>
                  <option value="sarah">Sarah Smith (Available)</option>
                  <option value="mike">Mike Johnson (Deployed)</option>
                  <option value="unit4">Rescue Unit 4 (Available)</option>
                </select>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <button onClick={() => alert('[DEMO] Responder assigned.')} className="w-full md:w-auto px-4 py-2 bg-brand-soft text-brand-accent font-bold text-sm rounded-lg hover:bg-pink-100 transition-colors">
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
