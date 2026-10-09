import { useState } from 'react';
import { useData } from '../context/DataContext';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Map, RefreshCw, Filter } from 'lucide-react';

const URGENCY_COLOR = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MEDIUM:   '#f59e0b',
  LOW:      '#10b981',
};

// India center — covers all mock incidents nationally
const INDIA_CENTER = [22.5, 82.0];

export default function FullMapView() {
  const { incidents } = useData() || {};
  const [refreshing, setRefreshing] = useState(false);
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const handleRefresh = () => { 
    setRefreshing(true); 
    setTimeout(() => setRefreshing(false), 500);
  };

  if (!incidents || !Array.isArray(incidents)) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-brand-primary">
        <div className="animate-spin h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full mb-4" />
        <p className="font-bold text-lg animate-pulse">Loading Geospatial Data...</p>
      </div>
    );
  }

  // Unique incident types for filter
  const allTypes = ['All', ...new Set(incidents.map(i => i.incidentType))];
  const allUrgencies = ['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  // Only show incidents with valid coordinates, apply filters
  const filtered = incidents.filter(i => {
    const hasCoords = i.coordinates?.lat && i.coordinates?.lng;
    const urgMatch = urgencyFilter === 'All' || i.urgency === urgencyFilter;
    const typeMatch = typeFilter === 'All' || i.incidentType === typeFilter;
    return hasCoords && urgMatch && typeMatch;
  });

  const missingCoords = incidents.filter(i => !i.coordinates?.lat || !i.coordinates?.lng).length;

  return (
    <div className="space-y-4 pb-6" style={{ height: 'calc(100vh - 10rem)' }}>
      {/* Header */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-2.5 rounded-xl text-white shadow-md">
            <Map size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-brand-navy tracking-tight">Geospatial Incident Map</h1>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Sample Data — coordinates from mock incidents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Urgency Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={urgencyFilter}
              onChange={e => setUrgencyFilter(e.target.value)}
              className="pl-8 pr-6 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none cursor-pointer shadow-sm"
            >
              {allUrgencies.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none cursor-pointer shadow-sm"
            >
              {allTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-brand-soft hover:bg-brand-primary/20 text-brand-accent rounded-xl font-bold text-xs transition-all"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex gap-4 flex-1 min-h-0" style={{ height: 'calc(100% - 100px)' }}>
        {/* Map */}
        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] overflow-hidden relative">
          <MapContainer
            center={INDIA_CENTER}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filtered.map(incident => {
              const { lat, lng } = incident.coordinates;
              const color = URGENCY_COLOR[incident.urgency] || '#6b7280';
              const isResolved = incident.status === 'Resolved';

              return (
                <CircleMarker
                  key={incident._id}
                  center={[lat, lng]}
                  radius={isResolved ? 8 : 14}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: isResolved ? 0.3 : 0.75,
                    weight: isResolved ? 1 : 2.5,
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[180px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <h3 className="font-bold text-gray-900 text-sm">{incident.incidentType}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">📍 {incident.location}</p>
                      <p className="text-xs font-bold mb-1" style={{ color }}>⚡ {incident.urgency} PRIORITY</p>
                      <p className="text-xs text-gray-500 mb-2">
                        Status: <strong>{incident.status}</strong>
                        {incident.verificationStatus === 'Verified' && ' ✓ Verified'}
                      </p>
                      {incident.peopleAffected > 0 && (
                        <p className="text-xs text-gray-500 mb-2">👥 {incident.peopleAffected} affected</p>
                      )}
                      <Link
                        to={`/incident/${incident._id}`}
                        className="text-xs bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 inline-block font-bold"
                      >
                        View Details →
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Legend overlay */}
          <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50">
            <p className="text-[10px] font-black text-brand-navy uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">Legend</p>
            {Object.entries(URGENCY_COLOR).map(([level, color]) => (
              <div key={level} className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="text-[10px] font-bold text-gray-600">{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar — filtered incident list */}
        <div className="w-72 shrink-0 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-sm overflow-y-auto p-4 space-y-3 hidden lg:block">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black text-brand-navy uppercase tracking-widest">
              {filtered.length} Visible
            </p>
            {missingCoords > 0 && (
              <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                {missingCoords} no coords
              </span>
            )}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Map size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs font-bold">No incidents match filters</p>
            </div>
          )}

          {filtered.map(incident => {
            const color = URGENCY_COLOR[incident.urgency] || '#6b7280';
            return (
              <Link
                key={incident._id}
                to={`/incident/${incident._id}`}
                className="block p-3 bg-white rounded-xl border border-gray-100 hover:border-brand-primary/40 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ background: color }} />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-brand-navy truncate group-hover:text-brand-accent transition-colors">{incident.incidentType}</p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">{incident.location}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded" style={{ background: color + '20', color }}>
                        {incident.urgency}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400">{incident.status}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
