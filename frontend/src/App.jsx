import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import IncidentDetails from './pages/IncidentDetails';
import Reports from './pages/Reports';
import Login from './pages/Login';
import IncidentsList from './pages/IncidentsList';
import FullMapView from './pages/FullMapView';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ResourceManagement from './pages/ResourceManagement';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  LayoutDashboard, AlertTriangle, Radio, Map, BarChart3,
  Settings as SettingsIcon, LogOut, Bell, User, Truck, Search
} from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard',     path: '/dashboard',  icon: LayoutDashboard, roles: ['Admin', 'Control Room Operator', 'Team Leader', 'Responder', 'Citizen'] },
    { name: 'Incidents',     path: '/incidents',  icon: AlertTriangle,   roles: ['Admin', 'Control Room Operator', 'Team Leader', 'Responder', 'Citizen'] },
    { name: 'Submit Report', path: '/reports',    icon: Radio,           roles: ['Admin', 'Control Room Operator', 'Citizen'] },
    { name: 'Map View',      path: '/map',        icon: Map,             roles: ['Admin', 'Control Room Operator', 'Team Leader', 'Responder'] },
    { name: 'Resources',     path: '/resources',  icon: Truck,           roles: ['Admin', 'Control Room Operator', 'Team Leader'] },
    { name: 'Analytics',     path: '/analytics',  icon: BarChart3,       roles: ['Admin', 'Control Room Operator'] },
    { name: 'Settings',      path: '/settings',   icon: SettingsIcon,    roles: ['Admin', 'Control Room Operator', 'Team Leader', 'Responder', 'Citizen'] },
  ];

  const visibleNavItems = user
    ? navItems.filter(item => item.roles.includes(user.role))
    : navItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen font-sans overflow-hidden">
      {/* DEMO MODE Banner */}
      <div className="bg-gradient-to-r from-amber-400/90 to-orange-400/90 text-white text-[11px] font-black uppercase tracking-widest text-center py-1.5 px-4 flex items-center justify-center gap-2 z-50 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Demo Mode — Sample Data · No real backend · AI features simulated
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      </div>

      <div className="flex flex-1 bg-gradient-to-br from-brand-bg via-white to-pink-50 overflow-hidden min-h-0">
        {/* SIDEBAR */}
        <aside className="w-[280px] bg-white/60 backdrop-blur-xl border-r border-white/50 flex-col hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 shrink-0">
          <div className="h-24 flex items-center px-8 border-b border-white/40 shrink-0">
            <div className="flex items-center gap-4 text-brand-navy group cursor-pointer">
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-2.5 rounded-xl text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform duration-300">
                <AlertTriangle size={24} />
              </div>
              <span className="font-extrabold text-xl leading-tight tracking-tight">
                Response<br /><span className="text-brand-accent">Center</span>
              </span>
            </div>
          </div>

          <nav className="flex-1 px-5 py-8 space-y-2.5 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Main Menu</div>
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
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
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent rounded-r-full" />}
                  <item.icon
                    size={20}
                    className={`${isActive ? 'text-brand-accent' : 'text-gray-400 group-hover:text-brand-primary'} transition-colors`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Role badge at bottom of sidebar */}
          {user && (
            <div className="p-5 border-t border-white/40 shrink-0">
              <div className="bg-brand-soft/60 rounded-xl p-3 text-center">
                <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Logged in as</p>
                <p className="text-sm font-black text-brand-navy mt-1">{user.role}</p>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          {/* HEADER */}
          <header className="h-20 bg-white/60 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-6 lg:px-10 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-extrabold text-brand-navy tracking-tight">
                {getGreeting()}, {user ? user.name.split(' ')[0] : 'Responder'} 👋
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-0.5">Here's the latest emergency situation.</p>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
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
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-danger border-2 border-white rounded-full animate-pulse" />
              </button>

              <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-brand-navy">{user ? user.name : 'Admin User'}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{user ? user.role : 'Command Center'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white shadow-lg shadow-pink-500/20 font-black text-lg">
                  {user ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative z-0">
            <ErrorBoundary>
              <div className="max-w-[1400px] mx-auto">
                {children}
              </div>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}

// Protected Route — redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <AppLayout>{children}</AppLayout>;
}

// 404 page
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="text-center p-10">
        <p className="text-8xl font-black text-brand-accent mb-4">404</p>
        <h1 className="text-2xl font-black text-brand-navy mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <a href="#/" className="px-6 py-3 bg-gradient-to-r from-brand-accent to-pink-500 text-white font-black rounded-xl shadow-lg">
          Go to Login
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/"            element={<Login />} />
            <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/incident/:id" element={<ProtectedRoute><IncidentDetails /></ProtectedRoute>} />
            <Route path="/reports"     element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/incidents"   element={<ProtectedRoute><IncidentsList /></ProtectedRoute>} />
            <Route path="/map"         element={<ProtectedRoute><FullMapView /></ProtectedRoute>} />
            <Route path="/resources"   element={<ProtectedRoute><ResourceManagement /></ProtectedRoute>} />
            <Route path="/analytics"   element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*"            element={<NotFound />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
