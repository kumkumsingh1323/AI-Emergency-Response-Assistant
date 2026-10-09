import { useEffect, useState } from 'react';
import { getIncidents } from '../services/api';
import MapView from '../components/MapView';
import { Map, RefreshCw } from 'lucide-react';

export default function FullMapView() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error("Failed to fetch incidents", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchIncidents();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-brand-primary">
        <div className="animate-spin h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full mb-4"></div>
        <p className="font-bold text-lg animate-pulse">Initializing Geospatial Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col pb-6">
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-2.5 rounded-xl text-white shadow-md">
            <Map size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">Geospatial Overview</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Map Tracking</p>
          </div>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-brand-soft hover:bg-brand-primary/20 text-brand-accent rounded-xl font-bold transition-all"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh Map</span>
        </button>
      </div>

      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] overflow-hidden relative">
        <MapView incidents={incidents} />
        
        {/* Overlay Stats */}
        <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex flex-col gap-2">
          <p className="text-xs font-black text-brand-navy uppercase tracking-widest border-b border-gray-100 pb-2 mb-1">Map Legend</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-danger animate-pulse"></span>
            <span className="text-xs font-bold text-gray-600">Critical / High Urgency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-warning"></span>
            <span className="text-xs font-bold text-gray-600">Medium Urgency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-success"></span>
            <span className="text-xs font-bold text-gray-600">Low Urgency / Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
