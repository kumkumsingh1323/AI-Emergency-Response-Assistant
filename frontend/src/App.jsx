import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import IncidentDetails from './pages/IncidentDetails';
import Reports from './pages/Reports';
import Login from './pages/Login';
import IncidentsList from './pages/IncidentsList';
import FullMapView from './pages/FullMapView';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { LayoutDashboard, AlertTriangle, Radio, Map, BarChart3, Settings as SettingsIcon, Search, Bell, User } from 'lucide-react';

function AppLayout({ children }) {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Submit Report', path: '/reports', icon: Radio },
    { name: 'Map View', path: '/map', icon: Map },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-brand-bg via-white to-pink-50 overflow-hidden font-sans">
      {/* SIDEBAR - Glassmorphism */}
      <aside className="w-[280px] bg-white/60 backdrop-blur-xl border-r border-white/50 flex flex-col hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="h-24 flex items-center px-8 border-b border-white/40">
          <div className="flex items-center gap-4 text-brand-navy group cursor-pointer">
            <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-2.5 rounded-xl text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform duration-300">
              <AlertTriangle size={24} />
            </div>
            <span className="font-extrabold text-xl leading-tight tracking-tight">Response<br/><span className="text-brand-accent">Center</span></span>
          </div>
        </div>
        <nav className="flex-1 px-5 py-8 space-y-2.5 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Main Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm relative overflow-hidden group ${
                  isActive 
                    ? 'text-brand-accent bg-white shadow-sm shadow-brand-primary/10 border border-brand-primary/20' 
                    : 'text-gray-500 hover:text-brand-navy hover:bg-white/60'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent rounded-r-full"></div>}
                <item.icon size={20} className={`${isActive ? 'text-brand-accent' : 'text-gray-400 group-hover:text-brand-primary'} transition-colors`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER - Glassmorphism */}
        <header className="h-24 bg-white/60 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-10 z-10 sticky top-0 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">Good evening, Responder 👋</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Here's the latest emergency situation.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search incidents, locations..." 
                className="w-72 pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-brand-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent transition-all"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-accent hover:shadow-md transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-danger border-2 border-white rounded-full animate-pulse"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-brand-navy group-hover:text-brand-accent transition-colors">Admin User</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Command Center</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform duration-300">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative z-0">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/incident/:id" element={<AppLayout><IncidentDetails /></AppLayout>} />
        <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
        <Route path="/incidents" element={<AppLayout><IncidentsList /></AppLayout>} />
        <Route path="/map" element={<AppLayout><FullMapView /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
