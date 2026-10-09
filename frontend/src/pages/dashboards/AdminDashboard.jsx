import { useData } from '../../context/DataContext';
import { Database, Users, Shield, Server, Activity, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { incidents } = useData() || {};
  const totalIncidents = incidents ? incidents.length : 0;
  
  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4 bg-brand-navy p-6 rounded-3xl shadow-lg">
        <div className="bg-white/10 p-4 rounded-full text-white">
          <Shield size={32} />
        </div>
        <div className="text-white">
          <h1 className="text-2xl font-black">System Administration</h1>
          <p className="text-gray-400 font-medium text-sm">Platform Health & Global Oversight</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={<Database />} title="Total Reports" value={totalIncidents} color="blue" />
        <MetricCard icon={<Users />} title="Active Responders" value="142" color="green" />
        <MetricCard icon={<Server />} title="System Uptime" value="99.9%" color="purple" />
        <MetricCard icon={<Activity />} title="AI Confidence" value="94%" color="pink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 p-8 rounded-3xl border border-white/60 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
            <Users className="text-brand-accent" /> Role Management (Demo)
          </h2>
          <div className="space-y-3">
            {['Citizen', 'Control Room Operator', 'Responder', 'Team Leader', 'Admin'].map(role => (
              <div key={role} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-sm text-brand-navy">{role}</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-bold">Permissions Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Link to="/analytics" className="block group bg-gradient-to-br from-brand-primary to-brand-accent p-8 rounded-3xl shadow-lg hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start text-white">
              <div>
                <h2 className="text-2xl font-black mb-2">View Full Analytics</h2>
                <p className="font-medium text-white/80">Deep dive into incident response times, AI accuracy, and regional heatmaps.</p>
              </div>
              <BarChart2 size={40} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          
          <Link to="/settings" className="block group bg-white/80 p-8 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-extrabold text-brand-navy mb-2">Platform Settings</h2>
            <p className="text-gray-500 font-medium text-sm">Configure AI models, external integrations (WhatsApp, SMS), and safety thresholds.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, color }) {
  const colorMap = {
    blue: 'text-blue-500 bg-blue-50 border-blue-100',
    green: 'text-green-500 bg-green-50 border-green-100',
    purple: 'text-purple-500 bg-purple-50 border-purple-100',
    pink: 'text-brand-accent bg-brand-soft border-brand-primary/20',
  };
  return (
    <div className={`p-6 rounded-3xl border ${colorMap[color]} shadow-sm`}>
      <div className="mb-4">{icon}</div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider opacity-70">{title}</p>
    </div>
  );
}
