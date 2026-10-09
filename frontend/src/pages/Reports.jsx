import { useState } from 'react';
import { submitReport } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, AlertTriangle, MessageSquare, Radio, Share2, Smartphone } from 'lucide-react';

export default function Reports() {
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('Text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sourceIcons = {
    'Text': <MessageSquare size={16} />,
    'WhatsApp': <Smartphone size={16} />,
    'SMS': <Radio size={16} />,
    'Social Media': <Share2 size={16} />
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await submitReport({ message, source });
      // Redirect to the incident details
      if (res.incident) {
        navigate(`/incident/${res.incident._id}`);
      } else {
        // Non emergency
        setMessage('');
        alert('Report processed. It was classified as a non-emergency.');
      }
    } catch (err) {
      setError('Failed to submit report. Ensure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-10 relative">
      {/* Background decorations */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Simulate Incoming Report</h1>
        <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
          Test the AI engine by entering raw text from various sources. The system will automatically parse, classify, and extract entities.
        </p>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-brand-danger/10 to-brand-danger/5 border border-brand-danger/30 text-brand-danger p-5 rounded-2xl flex items-start gap-3 shadow-sm animate-pulse">
          <AlertTriangle className="shrink-0 mt-0.5" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] space-y-8 relative overflow-hidden">
        
        <div>
          <label className="block text-xs font-black text-brand-navy mb-4 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> Report Source
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(sourceIcons).map(src => (
              <label key={src} className={`cursor-pointer px-4 py-3 rounded-xl border-2 font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                source === src 
                  ? 'bg-gradient-to-br from-brand-primary/10 to-brand-soft border-brand-primary text-brand-accent shadow-sm scale-[1.02]' 
                  : 'bg-white border-gray-100 text-gray-400 hover:border-brand-primary/30 hover:text-brand-navy'
              }`}>
                <input 
                  type="radio" 
                  name="source" 
                  value={src} 
                  checked={source === src}
                  onChange={(e) => setSource(e.target.value)}
                  className="hidden" 
                />
                {sourceIcons[src]} {src}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-brand-navy mb-4 flex items-center justify-between uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span> Raw Content</span>
            <button type="button" className="text-brand-accent flex items-center gap-1.5 hover:text-pink-600 transition-colors bg-brand-soft px-3 py-1 rounded-full border border-brand-primary/20 hover:scale-105 transform duration-300">
              <Mic size={14} /> <span className="hidden sm:inline">Simulate Audio</span>
            </button>
          </label>
          <textarea
            className="w-full bg-gray-50/50 backdrop-blur-sm border-2 border-gray-100 rounded-2xl p-5 text-brand-navy font-medium focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 min-h-[160px] resize-y transition-all text-lg shadow-inner"
            placeholder="E.g. '6 people are trapped near the Velachery station. An elderly diabetic person needs insulin.'"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading || !message.trim()}
          className={`w-full py-4 rounded-2xl font-black text-lg flex justify-center items-center gap-3 transition-all duration-300 ${
            loading || !message.trim() 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-brand-accent to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:-translate-y-1'
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin h-6 w-6 border-4 border-white/30 border-t-white rounded-full"></div>
              Processing via AI...
            </div>
          ) : (
            <>
              <Send size={20} className="animate-bounce" style={{ animationDuration: '2s' }} /> Submit to AI Engine
            </>
          )}
        </button>
      </form>

      <div className="bg-white/60 backdrop-blur-md border border-white/50 p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h3 className="font-black text-brand-navy mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-warning"></span> Hackathon Quick Prompts
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div 
            className="cursor-pointer bg-white p-4 rounded-xl border border-gray-100 hover:border-brand-primary/40 hover:shadow-md transition-all group flex gap-4 items-center" 
            onClick={() => setMessage("6 people trapped near Velachery MRTS.")}
          >
            <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand-accent flex items-center justify-center font-black group-hover:scale-110 transition-transform">1</div>
            <p className="text-gray-600 font-medium group-hover:text-brand-navy transition-colors">"6 people trapped near Velachery MRTS."</p>
          </div>
          <div 
            className="cursor-pointer bg-white p-4 rounded-xl border border-gray-100 hover:border-brand-primary/40 hover:shadow-md transition-all group flex gap-4 items-center" 
            onClick={() => setMessage("Same place, water has increased. 10 people now.")}
          >
            <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand-accent flex items-center justify-center font-black group-hover:scale-110 transition-transform">2</div>
            <p className="text-gray-600 font-medium group-hover:text-brand-navy transition-colors">"Same place, water has increased. 10 people now."</p>
          </div>
          <div 
            className="cursor-pointer bg-white p-4 rounded-xl border border-gray-100 hover:border-brand-primary/40 hover:shadow-md transition-all group flex gap-4 items-center" 
            onClick={() => setMessage("Elderly diabetic person is still inside and needs insulin.")}
          >
            <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand-accent flex items-center justify-center font-black group-hover:scale-110 transition-transform">3</div>
            <p className="text-gray-600 font-medium group-hover:text-brand-navy transition-colors">"Elderly diabetic person is still inside and needs insulin."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
