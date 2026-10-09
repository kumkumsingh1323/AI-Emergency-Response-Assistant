import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, Moon, Database } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Note: For a full hackathon demo, real dark mode requires Tailwind dark: class implementations.
    // Here we just toggle a basic global class.
    if (!darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  };

  // Cleanup in case they leave page (optional, but keeps demo clean)
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('dark-theme');
    };
  }, []);

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-3 rounded-2xl text-white shadow-lg">
          <SettingsIcon size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">System Preferences</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Configure AI engine parameters and responder profile.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">
          
          {/* Settings Sidebar */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 bg-white/40 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-soft text-brand-accent font-bold text-sm text-left transition-colors">
              <User size={18} /> Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 text-gray-500 hover:text-brand-navy font-bold text-sm text-left transition-colors">
              <Bell size={18} /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 text-gray-500 hover:text-brand-navy font-bold text-sm text-left transition-colors">
              <Shield size={18} /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 text-gray-500 hover:text-brand-navy font-bold text-sm text-left transition-colors">
              <Database size={18} /> AI Engine
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 text-gray-500 hover:text-brand-navy font-bold text-sm text-left transition-colors">
              <Globe size={18} /> Integration
            </button>
          </div>

          {/* Settings Content */}
          <div className="p-8 md:p-10 col-span-3 space-y-10">
            
            <section>
              <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Responder Profile</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-pink-500/20">
                  AU
                </div>
                <div>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-navy shadow-sm hover:shadow-md transition-shadow mb-2">Change Avatar</button>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">JPG, GIF or PNG. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-brand-navy mb-2 uppercase tracking-widest">Full Name</label>
                  <input type="text" defaultValue="Admin User" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-brand-navy mb-2 uppercase tracking-widest">Email Address</label>
                  <input type="email" defaultValue="responder@emergency.gov" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-brand-navy mb-2 uppercase tracking-widest">Role</label>
                  <input type="text" defaultValue="Command Center Lead" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" disabled />
                </div>
                <div>
                  <label className="block text-xs font-black text-brand-navy mb-2 uppercase tracking-widest">Assigned Region</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none">
                    <option>Chennai Metro</option>
                    <option>Coimbatore</option>
                    <option>Madurai</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Appearance</h3>
              
              <div 
                onClick={toggleDarkMode}
                className={`flex items-center justify-between p-4 border rounded-xl transition-colors cursor-pointer group ${darkMode ? 'border-brand-accent bg-brand-soft' : 'border-gray-100 hover:border-brand-primary/30'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'bg-brand-accent text-white shadow-md' : 'bg-gray-50 text-gray-500 group-hover:text-brand-accent'}`}>
                    <Moon size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy">Dark Mode</h4>
                    <p className="text-xs font-medium text-gray-500">Enable dark theme for night operations</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${darkMode ? 'bg-brand-accent' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${darkMode ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:text-brand-navy transition-colors">Cancel</button>
              <button className="px-6 py-3 bg-gradient-to-r from-brand-accent to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5 transition-all">Save Preferences</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
