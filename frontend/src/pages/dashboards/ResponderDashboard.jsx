import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import IncidentCard from '../../components/IncidentCard';
import MapView from '../../components/MapView';
import { AlertCircle, Activity, Truck, MapPin } from 'lucide-react';

export default function ResponderDashboard() {
  const { incidents, updateIncidentStatus } = useData() || {};
  const { user } = useAuth();

  if (!incidents) return null;

  // Show active incidents assigned to this responder
  const assignedIncidents = incidents.filter(i => i.status !== 'Resolved' && i.assignedTo === user.name);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4 bg-brand-soft/50 p-6 rounded-3xl border border-brand-primary/20">
        <div className="bg-white p-4 rounded-full shadow-sm text-brand-accent">
          <Truck size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Field Responder Unit: {user.name}</h1>
          <p className="text-gray-600 font-medium text-sm">Region: {user.region} • Status: Deployed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
            <AlertCircle className="text-brand-accent" size={24}/> 
            My Assigned Incidents
          </h2>
          {assignedIncidents.length === 0 ? (
            <div className="bg-white/60 border border-dashed border-gray-300 rounded-3xl p-10 text-center">
              <p className="text-gray-500 font-medium">No incidents currently assigned.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedIncidents.map(incident => (
                <div key={incident._id} className="relative">
                  <IncidentCard incident={incident} />
                  {/* Action buttons overlay for responders */}
                  <div className="mt-2 flex gap-2">
                    <button 
                      onClick={() => updateIncidentStatus(incident._id, { status: 'En Route' })} 
                      className="flex-1 py-2 bg-blue-50 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Mark En Route
                    </button>
                    <button 
                      onClick={() => updateIncidentStatus(incident._id, { status: 'Rescue in Progress' })} 
                      className="flex-1 py-2 bg-brand-soft text-brand-accent font-bold text-sm rounded-lg hover:bg-pink-100 transition-colors"
                    >
                      Mark On Scene
                    </button>
                    <button 
                      onClick={() => updateIncidentStatus(incident._id, { status: 'Resolved' })} 
                      className="flex-1 py-2 bg-emerald-50 text-emerald-600 font-bold text-sm rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
            <MapPin className="text-brand-accent" size={24}/> 
            Assignment Map
          </h2>
          <div className="bg-white/80 p-3 rounded-3xl border border-white/60 shadow-sm h-[400px]">
            <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white shadow-inner">
              <MapView incidents={assignedIncidents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
