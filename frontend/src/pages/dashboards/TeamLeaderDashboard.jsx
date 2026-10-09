import { useState } from 'react';
import { useData } from '../../context/DataContext';
import IncidentCard from '../../components/IncidentCard';
import { Users, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TeamLeaderDashboard() {
  const { incidents, updateIncidentStatus } = useData() || {};
  const [assignments, setAssignments] = useState({});

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
                {incident.assignedTo && <p className="text-xs font-bold text-brand-accent mt-1">Currently Assigned: {incident.assignedTo}</p>}
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <select 
                  value={assignments[incident._id] || incident.assignedTo || ''} 
                  onChange={(e) => setAssignments(prev => ({...prev, [incident._id]: e.target.value}))}
                  className="w-full md:w-48 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-brand-primary"
                >
                  <option value="">Assign Responder...</option>
                  <option value="Demo Responder">Demo Responder (Available)</option>
                  <option value="John Doe">John Doe (Available)</option>
                  <option value="Sarah Smith">Sarah Smith (Available)</option>
                  <option value="Mike Johnson">Mike Johnson (Deployed)</option>
                  <option value="Rescue Unit 4">Rescue Unit 4 (Available)</option>
                </select>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <button 
                  onClick={() => {
                    const responder = assignments[incident._id];
                    if (responder) {
                      updateIncidentStatus(incident._id, { assignedTo: responder });
                      alert(`Responder ${responder} assigned successfully!`);
                    } else {
                      alert('Please select a responder first.');
                    }
                  }} 
                  className="w-full md:w-auto px-4 py-2 bg-brand-soft text-brand-accent font-bold text-sm rounded-lg hover:bg-pink-100 transition-colors"
                >
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
