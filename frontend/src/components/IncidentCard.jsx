import { Link } from 'react-router-dom';
import { MapPin, Users, AlertCircle, Clock, ArrowRight } from 'lucide-react';

export default function IncidentCard({ incident }) {
  const urgencyColors = {
    LOW: 'bg-gray-100 text-gray-500 border-gray-200',
    MEDIUM: 'bg-brand-warning/10 text-brand-warning border-brand-warning/30',
    HIGH: 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 border-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.1)]',
    CRITICAL: 'bg-gradient-to-r from-brand-danger/10 to-brand-danger/5 text-brand-danger border-brand-danger/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
  };

  const statusColors = {
    Active: 'bg-brand-primary/10 text-brand-accent border-brand-primary/30',
    Escalated: 'bg-purple-100 text-purple-600 border-purple-200',
    'Rescue in Progress': 'bg-blue-100 text-blue-600 border-blue-200',
    Resolved: 'bg-brand-success/10 text-brand-success border-brand-success/30'
  };

  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 hover:border-brand-primary/50 transition-all duration-300 p-6 flex flex-col h-full shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(249,168,212,0.15)] relative overflow-hidden transform hover:-translate-y-1">
      {/* Decorative gradient blur in background of card */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl group-hover:bg-brand-primary/20 transition-all z-0"></div>

      <div className="flex justify-between items-start mb-5 relative z-10">
        <div>
          <h3 className="text-xl font-extrabold text-brand-navy flex items-center gap-2 tracking-tight group-hover:text-brand-accent transition-colors">
            {incident.incidentType}
            {incident.verificationStatus === 'Verified' && (
              <span className="text-[9px] bg-gradient-to-r from-brand-success/20 to-brand-success/5 text-brand-success px-2 py-0.5 rounded-full border border-brand-success/30 uppercase font-black tracking-widest shadow-sm">Verified</span>
            )}
          </h3>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1.5">
            <MapPin size={14} className="text-brand-primary" /> {incident.location}
          </p>
        </div>
        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-widest ${urgencyColors[incident.urgency] || urgencyColors.MEDIUM}`}>
          {incident.urgency}
        </span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 mb-5 relative z-10">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3.5 border border-gray-100 shadow-sm group-hover:border-brand-primary/20 transition-colors">
          <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1"><Users size={12} className="text-gray-400"/> Affected</p>
          <p className="text-2xl font-black text-brand-navy">{incident.peopleAffected || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3.5 border border-gray-100 shadow-sm group-hover:border-brand-primary/20 transition-colors">
          <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1"><AlertCircle size={12} className="text-gray-400"/> Status</p>
          <p className={`text-sm font-bold truncate mt-2`}>
            <span className={`px-2.5 py-1 rounded-lg border text-xs shadow-sm ${statusColors[incident.status] || statusColors.Active}`}>
              {incident.status}
            </span>
          </p>
        </div>
      </div>

      {incident.resourcesNeeded?.length > 0 && (
        <div className="mb-5 relative z-10">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Resources Needed</p>
          <div className="flex flex-wrap gap-2">
            {incident.resourcesNeeded.slice(0, 3).map((r, i) => (
              <span key={i} className="text-[11px] bg-brand-soft/80 text-brand-accent border border-brand-primary/30 px-2.5 py-1 rounded-lg font-bold shadow-sm backdrop-blur-sm">{r}</span>
            ))}
            {incident.resourcesNeeded.length > 3 && (
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-bold shadow-sm">+{incident.resourcesNeeded.length - 3}</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center relative z-10">
        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Clock size={12} className="text-brand-primary" /> {new Date(incident.updatedAt).toLocaleTimeString()}
        </p>
        <Link 
          to={`/incident/${incident._id}`}
          className="text-sm font-extrabold text-brand-accent hover:text-pink-600 transition-colors flex items-center gap-1 group/link"
        >
          Details <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
