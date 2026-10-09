import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Eye, Lock, Mail, ChevronRight, Activity } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  
  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
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

          <div className="flex justify-center mb-8 relative z-10">
            <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-4 rounded-2xl shadow-lg shadow-pink-500/30 transform hover:rotate-12 transition-transform duration-300">
              <ShieldAlert size={32} className="text-white" />
            </div>
          </div>
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-black text-brand-navy mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Sign in to Response Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-black text-brand-navy mb-2 uppercase tracking-widest">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-accent transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  defaultValue="responder@emergency.gov"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-brand-navy mb-2 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-accent transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  defaultValue="password123"
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-50/50 border-2 border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-accent transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-brand-accent focus:ring-brand-primary/50 border-gray-200 rounded" />
                <label htmlFor="remember-me" className="ml-2.5 block text-sm font-bold text-gray-500">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-bold text-brand-accent hover:text-pink-600 transition-colors">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-pink-500/30 text-base font-black text-white bg-gradient-to-r from-brand-accent to-pink-500 hover:from-pink-500 hover:to-pink-600 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(236,72,153,0.4)] focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 group mt-4"
            >
              Sign In to Dashboard
              <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 relative z-10">
            <Lock size={12} />
            Secure responder access only
          </div>
        </div>
      </div>
    </div>
  );
}
