import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { ShieldAlert, Eye, EyeOff, Lock, Mail, ChevronRight, Activity, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('operator.demo@example.test');
  const [password, setPassword] = useState('demo123'); // Demo password
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [newRole, setNewRole] = useState('Citizen');
  const [newName, setNewName] = useState('');
  const { login } = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin) {
      // Mock registration
      DEMO_ACCOUNTS[email] = { role: newRole, name: newName || 'New Demo User', region: 'All' };
      alert('Mock user created! Logging in...');
    } else if (password !== 'demo123') {
      setError('Invalid password. Please use "demo123" for this mock system.');
      return;
    }
    const result = login(email);
    if (result.success) {
      redirectUser(result.role);
    } else {
      setError('User not found. Please use one of the demo emails.');
    }
  };

  const redirectUser = (role) => {
    switch (role) {
      case 'Citizen':
        navigate('/reports');
        break;
      case 'Emergency Responder':
      case 'Team Leader':
        navigate('/incidents');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const quickLogin = (demoEmail) => {
    const result = login(demoEmail);
    if (result.success) {
      redirectUser(result.role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-pink-50 flex font-sans overflow-hidden">
      {/* LEFT SIDE - VISUAL */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center p-12">
        {/* Abstract shapes */}
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 flex flex-col items-center max-w-xl text-center">
          <div className="w-full aspect-[4/3] mb-10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(249,168,212,0.3)] border-[8px] border-white/80 relative bg-white/40 backdrop-blur-md transform hover:scale-[1.02] transition-transform duration-500">
            <img 
              src="/login_illustration.jpg" 
              alt="Emergency Response AI Control Room" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"; 
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-lg">
              <div className="bg-brand-primary/20 p-2.5 rounded-xl text-brand-accent">
                <Activity size={24} className="animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-brand-navy">AI Systems Online</p>
                <p className="text-xs font-bold text-gray-500">Monitoring incoming distress signals...</p>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-black text-brand-navy mb-4 tracking-tight leading-tight">Response <span className="text-brand-accent">Center</span> AI</h1>
          <p className="text-xl text-gray-600 font-medium max-w-lg">
            Turning chaotic emergency reports into <span className="font-bold text-brand-navy">actionable intelligence</span> in real-time.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 relative z-10 bg-white/60 backdrop-blur-2xl border-l border-white/50 shadow-[-20px_0_50px_rgba(0,0,0,0.02)]">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(249,168,212,0.15)] transition-shadow duration-500 border border-white/60 p-10 sm:p-12 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex justify-center mb-6 relative z-10">
            <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-4 rounded-2xl shadow-lg shadow-pink-500/30 transform hover:rotate-12 transition-transform duration-300">
              <ShieldAlert size={32} className="text-white" />
            </div>
          </div>
          
          <div className="text-center mb-6 relative z-10">
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button 
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-brand-navy shadow-sm' : 'text-gray-500 hover:text-brand-navy'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-brand-navy shadow-sm' : 'text-gray-500 hover:text-brand-navy'}`}
              >
                Sign Up
              </button>
            </div>
            <h2 className="text-3xl font-black text-brand-navy mb-2 tracking-tight">{isLogin ? 'Welcome back' : 'Create Demo Account'}</h2>
            <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">Demo Access Portal</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 flex items-start gap-2 relative z-10">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Select Demo Role</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option>Citizen</option>
                    <option>Control-Room Operator</option>
                    <option>Emergency Responder</option>
                    <option>Team Leader</option>
                    <option>Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Demo Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-accent transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border-2 border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">Demo Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-accent transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50/50 border-2 border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-accent transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-pink-500/30 text-sm font-black text-white bg-gradient-to-r from-brand-accent to-pink-500 hover:from-pink-500 hover:to-pink-600 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(236,72,153,0.4)] focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 group"
            >
              {isLogin ? 'Simulate Login' : 'Create Mock Account'}
              <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Login Panels */}
          <div className="mt-8 pt-6 border-t border-gray-100 relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4">Quick Role Switching</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(DEMO_ACCOUNTS).map(([demoEmail, details]) => (
                <button
                  key={demoEmail}
                  onClick={() => quickLogin(demoEmail)}
                  className="p-2 border border-brand-primary/20 bg-brand-soft hover:bg-brand-primary/10 rounded-lg text-left transition-colors group"
                >
                  <p className="text-[10px] font-black text-brand-accent group-hover:text-pink-600 truncate">{details.role}</p>
                  <p className="text-[9px] font-bold text-gray-500 truncate">{demoEmail}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
