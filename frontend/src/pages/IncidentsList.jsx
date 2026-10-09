import { useEffect, useState } from 'react';
import { getIncidents } from '../services/api';
import IncidentCard from '../components/IncidentCard';
import { Search, Filter, AlertCircle } from 'lucide-react';

export default function IncidentsList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await getIncidents();
        setIncidents(data);
      } catch (error) {
        console.error("Failed to fetch incidents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const filteredIncidents = incidents.filter(incident => {
    const matchesFilter = filter === 'All' || incident.status === filter;
    const matchesSearch = incident.location.toLowerCase().includes(search.toLowerCase()) || 
                          incident.incidentType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-brand-primary">
        <div className="animate-spin h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full mb-4"></div>
        <p className="font-bold text-lg animate-pulse">Loading Incidents Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">Incident Database</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage and review all historical and active incidents.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search by location or type..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-brand-navy shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
            />
          </div>
          <div className="relative group">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-accent transition-colors pointer-events-none" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-40 pl-11 pr-8 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-brand-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none cursor-pointer transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {filteredIncidents.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60">
          <div className="bg-brand-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-brand-accent" />
          </div>
          <p className="text-xl font-bold text-brand-navy">No incidents found</p>
          <p className="text-gray-500 font-medium">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredIncidents.map(incident => (
            <IncidentCard key={incident._id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
