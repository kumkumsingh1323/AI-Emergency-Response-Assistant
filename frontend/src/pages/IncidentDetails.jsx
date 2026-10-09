import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Users, ShieldAlert, CheckCircle, Clock, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { incidents, updateIncidentStatus, addReportToIncident } = useData() || {};
  const [updateMsg, setUpdateMsg] = useState('');

  if (!incidents || !Array.isArray(incidents)) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-brand-primary">
        <div className="animate-spin h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full mb-4"></div>
        <p className="font-bold text-lg animate-pulse">Loading Details...</p>
      </div>
    );
  }

  const incident = incidents.find(i => i._id === id);

  const handleStatusUpdate = (newStatus, verifyStatus = null) => {
    const payload = {};
    if (newStatus) payload.status = newStatus;
    if (verifyStatus) payload.verificationStatus = verifyStatus;
    updateIncidentStatus(id, payload);
  };

  const handleAddUpdate = (e) => {
    e.preventDefault();
    if (!updateMsg.trim()) return;
    addReportToIncident(id, updateMsg, user ? user.name : 'Unknown User');
    setUpdateMsg('');
  };

  if (!incident) return <div className="text-center py-20 text-brand-danger font-bold text-2xl">Incident not found</div>;

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-10">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-accent transition-colors font-bold text-sm bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm hover:shadow-md">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-white/90 to-white/40 p-10 border-b border-white/60 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-3 rounded-2xl text-white shadow-lg shadow-pink-500/20">
                  <AlertCircle size={32} />
                </div>
                <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">{incident.incidentType} Emergency</h1>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest shadow-sm ${
                  incident.urgency === 'CRITICAL' ? 'bg-gradient-to-r from-brand-danger/20 to-brand-danger/5 text-brand-danger border-brand-danger/30' : 
                  incident.urgency === 'HIGH' ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 border-orange-200' : 
                  'bg-gradient-to-r from-brand-warning/20 to-brand-warning/5 text-brand-warning border-brand-warning/30'
                }`}>
                  {incident.urgency} PRIORITY
                </span>
              </div>
              <p className="text-gray-500 flex items-center gap-2 text-xl font-bold ml-16">
                <MapPin size={22} className="text-brand-accent" /> {incident.location} {incident.landmark ? `— ${incident.landmark}` : ''}
              </p>
            </div>
            
            <div className="flex gap-4">
              {incident.verificationStatus !== 'Verified' && (
                <button 
                  onClick={() => handleStatusUpdate(null, 'Verified')}
                  className="bg-brand-success/10 hover:bg-brand-success/20 text-brand-success border border-brand-success/30 px-6 py-3 rounded-xl text-sm font-black transition-all hover:shadow-lg hover:shadow-brand-success/20 hover:-translate-y-0.5 flex items-center gap-2 group"
                >
                  <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" /> Verify
                </button>
              )}
              {incident.status !== 'Resolved' && (
                <button 
                  onClick={() => handleStatusUpdate('Resolved')}
                  className="bg-white hover:bg-gray-50 text-brand-navy border border-gray-200 px-6 py-3 rounded-xl text-sm font-black transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 group"
                >
                  <CheckCircle size={18} className="text-gray-400 group-hover:text-brand-success transition-colors group-hover:scale-110" /> Mark Resolved
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/60 relative z-10">
          
          {/* Left Col - Details */}
          <div className="p-10 col-span-2 space-y-10 bg-white/30 backdrop-blur-sm">
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/80 p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Users size={16} className="text-brand-primary" /> People Affected</h3>
                <p className="text-5xl font-black text-brand-navy">{incident.peopleAffected || 'Unknown'}</p>
              </div>
              <div className="bg-white/80 p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldAlert size={16} className="text-brand-primary" /> Current Status</h3>
                <p className="text-3xl font-black text-brand-accent mt-2">{incident.status}</p>
              </div>
            </div>

            {incident.vulnerablePeople?.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-danger"></span> Vulnerable People
                </h3>
                <div className="flex flex-wrap gap-3">
                  {incident.vulnerablePeople.map((v, i) => (
                    <span key={i} className="bg-brand-danger/10 text-brand-danger border border-brand-danger/20 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {incident.resourcesNeeded?.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-primary"></span> Resources Needed
                </h3>
                <div className="flex flex-wrap gap-3">
                  {incident.resourcesNeeded.map((r, i) => (
                    <span key={i} className="bg-white text-brand-accent border border-brand-primary/20 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="pt-6 border-t border-white/60">
              <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-8">Incident Timeline</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-brand-primary/40 before:to-transparent before:rounded-full">
                {incident.updates?.slice().reverse().map((update, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-gradient-to-br from-brand-primary to-brand-accent shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] bg-white/90 p-5 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-brand-navy text-sm bg-brand-bg px-3 py-1 rounded-lg">{update.source}</span>
                        <time className="text-[10px] font-black text-gray-400 flex items-center gap-1.5 uppercase tracking-widest"><Clock size={12} className="text-brand-primary"/> {new Date(update.timestamp).toLocaleTimeString()}</time>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed font-medium">{update.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Right Col - Actions & Raw Reports */}
          <div className="p-10 bg-white/50 backdrop-blur-md">
            <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-6">Responder Actions</h3>
            
            <form onSubmit={handleAddUpdate} className="mb-10 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Add Update Note</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-brand-navy focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 mb-4 font-medium transition-all"
                rows="4"
                placeholder="E.g. Rescue team dispatched..."
                value={updateMsg}
                onChange={e => setUpdateMsg(e.target.value)}
              ></textarea>
              <button 
                type="submit"
                disabled={!updateMsg.trim()}
                className="w-full bg-gradient-to-r from-brand-accent to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-black py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5"
              >
                <MessageSquare size={18} /> Post Update
              </button>
            </form>

            <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-6">Activity Log</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-3">
              {/* Additional Reports from DataContext */}
              {incident.additionalReports?.map((report, idx) => (
                <div key={`add-${idx}`} className="flex gap-4 p-5 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="mt-1">
                    <MessageSquare size={18} className="text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-brand-navy font-medium text-sm">{report.text}</p>
                    <p className="text-[10px] font-black text-gray-400 mt-2 flex items-center gap-2 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> {report.reportedBy} · {new Date(report.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Source Reports */}
              {incident.sourceReports?.map((report, idx) => (
                <div key={idx} className="bg-white/80 p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-brand-primary/30 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] bg-brand-soft text-brand-accent px-2.5 py-1 rounded-md font-black uppercase tracking-wider">{report.source}</span>
                    <span className="text-[10px] font-black text-gray-400">{new Date(report.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-brand-navy font-medium italic leading-relaxed">"{report.originalMessage}"</p>
                </div>
              ))}

              <div className="flex gap-4 p-5 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                <div className="mt-1">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Incident reported by <span className="font-bold text-brand-navy">{incident.reportedBy || 'Unknown'}</span>.</p>
                  <p className="text-[10px] font-black text-gray-400 mt-2 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> System · {new Date(incident.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
