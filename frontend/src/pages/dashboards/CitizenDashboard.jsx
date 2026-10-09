import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import IncidentCard from '../../components/IncidentCard';
import { ShieldAlert, FileText, PhoneCall, AlertTriangle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CitizenDashboard() {
  const { incidents } = useData() || {};
  const { user } = useAuth();

  const myReports = incidents ? incidents.filter(i => i.reportedBy === user.email) : [];
  
  return (
    <div className="space-y-8 pb-10">
      
      {/* Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-brand-primary/10 to-pink-50 rounded-3xl p-8 border border-brand-primary/20">
          <h2 className="text-2xl font-black text-brand-navy mb-3">Stay Safe, {user.name.split(' ')[0]}</h2>
          <p className="text-gray-600 mb-6 font-medium">Your reports help emergency responders act faster. Always ensure your own safety before reporting.</p>
          
          <Link to="/reports" className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-danger text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:-translate-y-0.5 hover:shadow-red-500/50 transition-all">
            <AlertTriangle size={18} />
            Report New Emergency
          </Link>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm">
          <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
            <PhoneCall size={18} className="text-brand-primary"/> 
            Emergency Contacts
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="font-bold text-sm">Police</span>
              <span className="font-black text-brand-danger">112</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="font-bold text-sm">Ambulance</span>
              <span className="font-black text-brand-danger">108</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="font-bold text-sm">Fire</span>
              <span className="font-black text-brand-danger">101</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Safety Instructions */}
      <div className="bg-brand-soft/50 border border-brand-primary/20 rounded-3xl p-6">
        <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
          <ShieldAlert size={20} className="text-brand-accent"/> 
          Quick Safety Guidelines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <p className="font-bold text-sm text-brand-navy mb-1">Fire</p>
            <p className="text-xs text-gray-500">Evacuate immediately. Use stairs, never elevators. Stay low if there is smoke.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <p className="font-bold text-sm text-brand-navy mb-1">Earthquake</p>
            <p className="text-xs text-gray-500">Drop, Cover, and Hold On. Stay away from glass and heavy furniture.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <p className="font-bold text-sm text-brand-navy mb-1">Flood</p>
            <p className="text-xs text-gray-500">Move to higher ground. Do not walk or drive through flood waters.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100">
            <p className="font-bold text-sm text-brand-navy mb-1">Medical</p>
            <p className="text-xs text-gray-500">Call 108 immediately. Do not move the injured person unless in danger.</p>
          </div>
        </div>
      </div>

      {/* My Reports */}
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy mb-5 flex items-center gap-2">
          <FileText size={22} className="text-brand-accent" />
          My Reports
        </h2>
        {myReports.length === 0 ? (
          <div className="bg-white/60 border border-dashed border-gray-300 rounded-3xl p-10 text-center">
            <p className="text-gray-500 font-medium">You haven't submitted any reports yet.</p>
            <Link to="/reports" className="inline-block mt-4 text-brand-accent font-bold hover:underline">
              Submit your first report
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myReports.map(incident => (
              <IncidentCard key={incident._id} incident={incident} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
