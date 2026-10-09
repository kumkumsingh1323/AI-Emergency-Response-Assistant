import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import { Link } from 'react-router-dom';

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapView({ incidents }) {
  // Default center (Chennai)
  const defaultCenter = [13.0827, 80.2707];
  
  // Find a valid center from active incidents if available
  const activeIncidentWithCoords = incidents?.find(i => i.coordinates?.lat && i.coordinates?.lng && i.status !== 'Resolved');
  const center = activeIncidentWithCoords 
    ? [activeIncidentWithCoords.coordinates.lat, activeIncidentWithCoords.coordinates.lng] 
    : defaultCenter;

  const getColor = (urgency) => {
    if (urgency === 'CRITICAL') return '#ef4444';
    if (urgency === 'HIGH') return '#f97316';
    if (urgency === 'MEDIUM') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg relative z-0">
      <MapContainer center={center} zoom={11} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        
        {incidents?.filter(i => i.status !== 'Resolved').map(incident => {
          // Mock coordinates slightly if none provided for demo visualization
          const lat = incident.coordinates?.lat || defaultCenter[0] + (Math.random() - 0.5) * 0.1;
          const lng = incident.coordinates?.lng || defaultCenter[1] + (Math.random() - 0.5) * 0.1;
          const color = getColor(incident.urgency);

          return (
            <CircleMarker 
              key={incident._id} 
              center={[lat, lng]}
              radius={14}
              pathOptions={{ 
                color: color, 
                fillColor: color, 
                fillOpacity: 0.7,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-gray-900">{incident.incidentType}</h3>
                  <p className="text-sm text-gray-600 mb-1">{incident.location}</p>
                  <p className="text-xs font-bold mb-2" style={{ color }}>⚡ {incident.urgency} PRIORITY</p>
                  <Link 
                    to={`/incident/${incident._id}`}
                    className="text-xs bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600 inline-block"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
