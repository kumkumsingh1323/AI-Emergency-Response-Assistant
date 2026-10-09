import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Send, UploadCloud, MapPin, AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';

const CATEGORIES = ['Flood', 'Heavy Rain', 'Road Accident', 'Fire', 'Building Collapse', 'Medical Emergency', 'Landslide', 'Other'];
const SOURCES = ['Text / Website', 'WhatsApp', 'SMS', 'Social Media'];

export default function Reports() {
  const { user } = useAuth();
  const { addIncident } = useData();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    incidentType: 'Other',
    description: '',
    location: '',
    lat: '',
    lng: '',
    peopleAffected: '',
    contact: user ? user.email : '',
    source: 'Text / Website',
  });

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // MOCK AI ENGINE: Deterministic rules based on keywords
    const lowerDesc = formData.description.toLowerCase();
    let priority = 'Low';
    if (lowerDesc.includes('trapped') || lowerDesc.includes('unconscious') || lowerDesc.includes('collapse') || lowerDesc.includes('danger')) {
      priority = 'Critical';
    } else if (lowerDesc.includes('fire') || lowerDesc.includes('flood') || lowerDesc.includes('accident')) {
      priority = 'High';
    } else if (lowerDesc.includes('waterlogging') || lowerDesc.includes('smoke')) {
      priority = 'Medium';
    }

    // Save to Local Data Store
    setTimeout(() => {
      const newId = addIncident({
        incidentType: formData.incidentType,
        title: formData.title,
        location: formData.location,
        description: formData.description,
        peopleAffected: parseInt(formData.peopleAffected) || 0,
        urgency: priority.toUpperCase(),
        reportedBy: formData.contact,
        source: formData.source,
        coordinates: (formData.lat && formData.lng) ? { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) } : null
      });

      setSuccessId(newId);
      setLoading(false);
    }, 1200); // Fake network delay
  };

  if (successId) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-xl">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-brand-navy">Report Submitted Successfully</h1>
        <p className="text-gray-500 font-medium">Your report has been saved to the demo database. ID: <span className="font-mono text-brand-accent bg-brand-soft px-2 py-1 rounded">{successId}</span></p>
        <div className="pt-6 flex justify-center gap-4">
          <button onClick={() => setSuccessId(null)} className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:text-brand-navy transition-colors">Submit Another</button>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-brand-navy text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 border-l-4 border-amber-400 bg-amber-50 p-4 rounded-r-xl flex items-start gap-3">
        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
        <p className="text-sm font-medium text-amber-700 leading-relaxed">
          <strong>DEMO REPORTING SYSTEM.</strong> Do not enter real emergencies here. No external authorities will be contacted. Submissions are stored in your local browser only.
        </p>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-brand-navy tracking-tight">Submit Emergency Report</h1>
        <p className="text-gray-500 font-medium mt-2">Fill in the details below to log a new incident into the command center.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/60 shadow-xl space-y-8">
        
        {/* Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Incident Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="E.g. Building collapse at MG Road" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
          </div>

          <div>
            <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Category *</label>
            <select name="incidentType" value={formData.incidentType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all appearance-none">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Estimated People Affected</label>
            <input type="number" name="peopleAffected" value={formData.peopleAffected} onChange={handleChange} placeholder="E.g. 10" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Full Description *</label>
            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the situation clearly..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-y" />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Location Info */}
        <div>
          <h3 className="font-black text-brand-navy text-lg mb-4 flex items-center gap-2"><MapPin size={18} className="text-brand-accent"/> Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Full Address / Landmark *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="E.g. Next to Apollo Hospital, Greams Road, Chennai" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Latitude (Optional Demo Data)</label>
              <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} placeholder="13.0827" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Longitude (Optional Demo Data)</label>
              <input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} placeholder="80.2707" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Reporter Info & Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Reporter Contact (Demo)</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone or Email" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Report Source</label>
            <select name="source" value={formData.source} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all appearance-none">
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Attach Evidence (Mock)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary/50 hover:bg-brand-soft/20 transition-all">
              <UploadCloud size={32} className="text-gray-400 mb-3" />
              <p className="text-sm font-bold text-brand-navy mb-1">Click to simulate file upload</p>
              <p className="text-xs text-gray-500 font-medium">Images will not be saved in this demo.</p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-brand-accent to-pink-500 text-white font-black text-lg rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-[0_8px_30px_rgba(236,72,153,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" /> Processing AI Triage...</>
          ) : (
            <><Send size={20} /> Submit Report</>
          )}
        </button>

      </form>
    </div>
  );
}
