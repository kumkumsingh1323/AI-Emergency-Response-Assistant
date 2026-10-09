import { useEffect, useState } from 'react';
import { getIncidents } from '../services/api';
import { BarChart3, TrendingUp, Users, Activity, Clock, Target } from 'lucide-react';

export default function Analytics() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-brand-primary">
        <div className="animate-spin h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full mb-4"></div>
        <p className="font-bold text-lg animate-pulse">Compiling Analytics...</p>
      </div>
    );
  }

  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter(i => i.status === 'Resolved').length;
  const resolutionRate = totalIncidents === 0 ? 0 : Math.round((resolvedIncidents / totalIncidents) * 100);
  const totalPeopleAffected = incidents.reduce((acc, curr) => acc + (curr.peopleAffected || 0), 0);
  const highPriority = incidents.filter(i => i.urgency === 'HIGH' || i.urgency === 'CRITICAL').length;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-3 rounded-2xl text-white shadow-lg">
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">System Analytics</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Real-time AI processing metrics and response statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-success/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Resolution Rate</h3>
            <Target size={20} className="text-brand-success" />
          </div>
          <div className="relative z-10">
            <p className="text-5xl font-black text-brand-navy">{resolutionRate}%</p>
            <div className="w-full bg-gray-100 h-2 mt-4 rounded-full overflow-hidden">
              <div className="bg-brand-success h-full rounded-full transition-all duration-1000" style={{ width: `${resolutionRate}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-danger/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Critical / High</h3>
            <TrendingUp size={20} className="text-brand-danger" />
          </div>
          <div className="relative z-10">
            <p className="text-5xl font-black text-brand-navy">{highPriority}</p>
            <p className="text-sm font-bold text-gray-500 mt-2">Requires immediate attention</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Affected</h3>
            <Users size={20} className="text-brand-primary" />
          </div>
          <div className="relative z-10">
            <p className="text-5xl font-black text-brand-navy">{totalPeopleAffected}</p>
            <p className="text-sm font-bold text-gray-500 mt-2">Across all logged incidents</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Chart Area */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-sm relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-brand-navy uppercase tracking-widest text-sm flex items-center gap-2">
              <Activity size={16} className="text-brand-accent"/> Incident Frequency
            </h3>
            <span className="text-xs font-bold bg-brand-soft text-brand-accent px-3 py-1 rounded-full">Last 24 Hours</span>
          </div>
          
          {/* Pure CSS Bar Chart Mock */}
          <div className="h-48 flex items-end justify-between gap-2 border-b border-gray-100 pb-2 relative">
            {/* Y-axis lines */}
            <div className="absolute inset-x-0 bottom-1/4 border-b border-gray-50 border-dashed z-0"></div>
            <div className="absolute inset-x-0 bottom-2/4 border-b border-gray-50 border-dashed z-0"></div>
            <div className="absolute inset-x-0 bottom-3/4 border-b border-gray-50 border-dashed z-0"></div>
            
            {/* Bars */}
            {[40, 25, 60, 30, 80, 45, 90, 35, 50, 70].map((h, i) => (
              <div key={i} className="w-full bg-brand-primary/20 hover:bg-brand-primary rounded-t-md transition-colors relative z-10 group cursor-pointer" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-navy text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h} reports
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* AI Performance Mock */}
        <div className="bg-gradient-to-br from-brand-navy to-gray-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl"></div>
          <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2 mb-8 relative z-10">
            <Clock size={16} className="text-brand-accent"/> AI Engine Performance
          </h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-300">Entity Extraction Accuracy</span>
                <span className="text-brand-accent">94.2%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-brand-primary to-brand-accent h-full rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-300">Avg. Processing Time</span>
                <span className="text-brand-primary">1.2s</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-300">Auto-merging Confidence</span>
                <span className="text-brand-success">88.5%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-success h-full rounded-full" style={{ width: '88.5%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-sm relative z-10">
            <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse mt-1.5 shrink-0"></div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              AI engine is running optimally. The clustering algorithm successfully merged <strong className="text-white">12 duplicate reports</strong> in the last hour, saving responders approx. 45 minutes of manual triaging.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
