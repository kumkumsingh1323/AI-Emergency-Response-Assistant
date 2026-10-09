import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon, Bell, Shield, User, Globe, Moon,
  Database, Check, Zap, ChevronRight, X, SaveAll
} from 'lucide-react';

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',       icon: Shield },
  { id: 'ai',            label: 'AI Engine',      icon: Database },
  { id: 'integration',   label: 'Integration',    icon: Globe },
];

// ─── Toast Notification ─────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-[slideInRight_0.35s_ease] flex items-center gap-3 bg-white border border-brand-success/30 shadow-[0_8px_32px_rgba(16,185,129,0.2)] rounded-2xl px-5 py-4 min-w-[280px]">
      <style>{`@keyframes slideInRight { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }`}</style>
      <div className="w-9 h-9 rounded-xl bg-brand-success/10 flex items-center justify-center flex-shrink-0">
        <Check size={18} className="text-brand-success" />
      </div>
      <div className="flex-1">
        <p className="font-black text-brand-navy text-sm">Settings Saved!</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}

// ─── Reusable Toggle Row ───────────────────────────────────────────────────────
function ToggleRow({ label, description, value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer group ${
        value ? 'border-brand-primary/40 bg-brand-soft/60' : 'border-gray-100 hover:border-brand-primary/30'
      }`}
    >
      <div>
        <p className="font-bold text-brand-navy text-sm">{label}</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{description}</p>
      </div>
      <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${value ? 'bg-brand-accent' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${value ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  );
}

// ─── Reusable Field ────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-brand-navy mb-2 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-medium text-brand-navy focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm";

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ profile, setProfile }) {
  return (
    <div className="space-y-8">
      <SectionTitle>Responder Profile</SectionTitle>
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-pink-500/20 flex-shrink-0">
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <button
            onClick={() => alert('[DEMO] Avatar upload dialog would open here in a real system.')}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-navy shadow-sm hover:shadow-md transition-shadow mb-2 block"
          >
            Change Avatar
          </button>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">JPG, GIF or PNG. Max 2MB.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Full Name">
          <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Email Address">
          <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Role">
          <input type="text" value={profile.role} className={inputCls} disabled />
        </Field>
        <Field label="Assigned Region">
          <select value={profile.region} onChange={e => setProfile(p => ({ ...p, region: e.target.value }))} className={inputCls + ' appearance-none cursor-pointer'}>
            <option>Chennai Metro</option>
            <option>Coimbatore</option>
            <option>Madurai</option>
            <option>Hyderabad</option>
            <option>Mumbai North</option>
            <option>All</option>
          </select>
        </Field>
        <Field label="Phone / Dispatch Line">
          <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Badge / ID">
          <input type="text" value={profile.badge} onChange={e => setProfile(p => ({ ...p, badge: e.target.value }))} className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab({ prefs, setPrefs }) {
  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-8">
      <SectionTitle>Notification Preferences</SectionTitle>
      <div className="space-y-3">
        <ToggleRow label="Critical Incident Alerts" description="Instant push for CRITICAL & HIGH urgency events" value={prefs.criticalAlerts} onChange={() => toggle('criticalAlerts')} />
        <ToggleRow label="Email Digest" description="Daily summary of all incidents sent to your email" value={prefs.emailDigest} onChange={() => toggle('emailDigest')} />
        <ToggleRow label="SMS Alerts" description="Receive SMS for escalated incidents" value={prefs.smsAlerts} onChange={() => toggle('smsAlerts')} />
        <ToggleRow label="Assignment Alerts" description="Notify when an incident is assigned to you" value={prefs.assignmentAlerts} onChange={() => toggle('assignmentAlerts')} />
        <ToggleRow label="Weather Alerts" description="IMD severe weather warnings in your region" value={prefs.weatherAlerts} onChange={() => toggle('weatherAlerts')} />
        <ToggleRow label="System Updates" description="Platform maintenance and version release notices" value={prefs.systemUpdates} onChange={() => toggle('systemUpdates')} />
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab({ secPrefs, setSecPrefs }) {
  return (
    <div className="space-y-8">
      <SectionTitle>Security Settings</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Current Password"><input type="password" defaultValue="••••••••" className={inputCls} /></Field>
        <Field label="New Password"><input type="password" placeholder="Min 12 characters" className={inputCls} /></Field>
        <Field label="Confirm New Password"><input type="password" placeholder="Repeat new password" className={inputCls} /></Field>
      </div>
      <div className="space-y-3">
        <ToggleRow label="Two-Factor Authentication (2FA)" description="Require OTP on every login via authenticator app" value={secPrefs.twoFA} onChange={() => setSecPrefs(p => ({ ...p, twoFA: !p.twoFA }))} />
        <ToggleRow label="Session Activity Log" description="Record all login events and IP addresses" value={secPrefs.sessionLog} onChange={() => setSecPrefs(p => ({ ...p, sessionLog: !p.sessionLog }))} />
      </div>
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
        <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Danger Zone</p>
        <p className="text-sm font-medium text-gray-500 mb-4">These actions are irreversible. Proceed with caution.</p>
        <button
          onClick={() => alert('[DEMO] All active sessions would be revoked in a real system.')}
          className="px-5 py-2.5 bg-white border border-red-200 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors"
        >
          Revoke All Active Sessions
        </button>
      </div>
    </div>
  );
}

// ─── AI Engine Tab ────────────────────────────────────────────────────────────
function AIEngineTab({ aiPrefs, setAIPrefs }) {
  return (
    <div className="space-y-8">
      <SectionTitle>AI Engine Configuration</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="NLP Model">
          <select value={aiPrefs.nlpModel} onChange={e => setAIPrefs(p => ({ ...p, nlpModel: e.target.value }))} className={inputCls + ' appearance-none cursor-pointer'}>
            <option value="gemini-pro">Gemini Pro (Default)</option>
            <option value="gemini-flash">Gemini Flash (Faster)</option>
            <option value="gpt-4o">GPT-4o (Fallback)</option>
          </select>
        </Field>
        <Field label="Classification Language">
          <select value={aiPrefs.language} onChange={e => setAIPrefs(p => ({ ...p, language: e.target.value }))} className={inputCls + ' appearance-none cursor-pointer'}>
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
        </Field>
      </div>
      <div>
        <label className="block text-[10px] font-black text-brand-navy mb-3 uppercase tracking-widest">
          Minimum Confidence Threshold — <span className="text-brand-accent">{aiPrefs.confidence}%</span>
        </label>
        <input type="range" min={50} max={99} value={aiPrefs.confidence} onChange={e => setAIPrefs(p => ({ ...p, confidence: Number(e.target.value) }))} className="w-full accent-pink-500 cursor-pointer" />
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1">
          <span>50% (Permissive)</span><span>99% (Strict)</span>
        </div>
      </div>
      <div className="space-y-3">
        <ToggleRow label="Auto-Escalate Critical Incidents" description="Automatically escalate when AI detects CRITICAL urgency" value={aiPrefs.autoEscalate} onChange={() => setAIPrefs(p => ({ ...p, autoEscalate: !p.autoEscalate }))} />
        <ToggleRow label="Smart Incident Merging" description="Auto-merge duplicate reports from the same location" value={aiPrefs.mergeThreshold} onChange={() => setAIPrefs(p => ({ ...p, mergeThreshold: !p.mergeThreshold }))} />
      </div>
      <div className="bg-brand-soft/50 border border-brand-primary/20 rounded-2xl p-5 flex items-center gap-4">
        <Zap size={20} className="text-brand-accent flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-brand-navy">Engine Status: <span className="text-brand-success">Online (Demo)</span></p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Last processed: 3 reports · Avg latency: 1.2s</p>
        </div>
      </div>
    </div>
  );
}

// ─── Integration Tab ──────────────────────────────────────────────────────────
function IntegrationTab({ intPrefs, setIntPrefs }) {
  const integrations = [
    { key: 'ndma',      name: 'NDMA API',           desc: 'National Disaster Management Authority data feed',     icon: '🌐' },
    { key: 'imd',       name: 'IMD Weather',         desc: 'India Meteorological Department alerts & warnings',    icon: '⛈️' },
    { key: 'twilio',    name: 'Twilio SMS',          desc: 'SMS gateway for field responder notifications',        icon: '📱' },
    { key: 'gmaps',     name: 'Google Maps API',     desc: 'Geocoding and reverse geocoding for incidents',        icon: '🗺️' },
    { key: 'slack',     name: 'Slack Webhook',       desc: 'Push critical alerts to your Slack command channel',   icon: '💬' },
    { key: 'whatsapp',  name: 'WhatsApp Business',   desc: 'Receive reports directly from WhatsApp',              icon: '🟢' },
  ];

  const toggle = (key) => setIntPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-8">
      <SectionTitle>External Integrations</SectionTitle>
      <div className="space-y-3">
        {integrations.map(({ key, name, desc, icon }) => {
          const connected = intPrefs[key];
          return (
            <div key={key} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-brand-primary/30 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">{icon}</div>
                <div>
                  <p className="font-bold text-brand-navy text-sm">{name}</p>
                  <p className="text-xs text-gray-500 font-medium">{desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${connected ? 'text-brand-success bg-emerald-50 border-emerald-200' : 'text-gray-400 bg-gray-50 border-gray-200'}`}>
                  {connected ? '● Connected' : '○ Disconnected'}
                </span>
                <button
                  onClick={() => toggle(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${connected ? 'border border-red-200 text-red-500 hover:bg-red-50' : 'border border-brand-primary/30 text-brand-accent hover:bg-brand-soft'}`}
                >
                  {connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Field label="Webhook URL">
        <div className="flex gap-2">
          <input type="url" placeholder="https://your-server.com/webhook" className={inputCls} />
          <button
            onClick={() => alert('[DEMO] A test webhook payload would be sent in a real system.')}
            className="px-4 py-3 bg-brand-soft border border-brand-primary/30 text-brand-accent rounded-xl font-bold text-sm hover:bg-brand-primary/10 transition-colors flex-shrink-0"
          >
            Test
          </button>
        </div>
      </Field>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest border-b border-gray-100 pb-3">
      {children}
    </h3>
  );
}

// ─── Main Settings Page ────────────────────────────────────────────────────────
const STORAGE_KEY = 'demo_settings_prefs';

function loadPrefs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export default function Settings() {
  const { user } = useAuth() || {};

  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);

  // All settings lifted into one state so Save can capture everything
  const saved = loadPrefs();

  const [profile, setProfile] = useState(saved?.profile || {
    name: user?.name || 'Admin User',
    email: user?.email || 'responder@emergency.gov',
    role: user?.role || 'Command Center Lead',
    region: user?.region || 'Chennai Metro',
    phone: '+91 98400 00001',
    badge: 'CMD-2024-001',
  });

  const [notifPrefs, setNotifPrefs] = useState(saved?.notifPrefs || {
    criticalAlerts: true,
    emailDigest: false,
    smsAlerts: true,
    assignmentAlerts: true,
    weatherAlerts: true,
    systemUpdates: false,
  });

  const [secPrefs, setSecPrefs] = useState(saved?.secPrefs || {
    twoFA: true,
    sessionLog: false,
  });

  const [aiPrefs, setAIPrefs] = useState(saved?.aiPrefs || {
    nlpModel: 'gemini-pro',
    language: 'English',
    confidence: 75,
    autoEscalate: true,
    mergeThreshold: false,
  });

  const [intPrefs, setIntPrefs] = useState(saved?.intPrefs || {
    ndma: true,
    imd: true,
    twilio: false,
    gmaps: true,
    slack: false,
    whatsapp: false,
  });

  const toggleDarkMode = () => {
    setDarkMode(d => {
      document.documentElement.classList.toggle('dark-theme', !d);
      return !d;
    });
  };

  useEffect(() => {
    return () => document.documentElement.classList.remove('dark-theme');
  }, []);

  const handleSave = () => {
    const allPrefs = { profile, notifPrefs, secPrefs, aiPrefs, intPrefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPrefs));
    const tabLabels = { profile: 'Profile', notifications: 'Notifications', security: 'Security', ai: 'AI Engine', integration: 'Integrations' };
    setToast(`${tabLabels[activeTab] || 'Settings'} preferences saved successfully.`);
  };

  const handleCancel = () => {
    const prev = loadPrefs();
    if (prev) {
      if (prev.profile)    setProfile(prev.profile);
      if (prev.notifPrefs) setNotifPrefs(prev.notifPrefs);
      if (prev.secPrefs)   setSecPrefs(prev.secPrefs);
      if (prev.aiPrefs)    setAIPrefs(prev.aiPrefs);
      if (prev.intPrefs)   setIntPrefs(prev.intPrefs);
    }
    setToast('Changes cancelled and reverted to last saved state.');
  };

  const panels = {
    profile:       <ProfileTab profile={profile} setProfile={setProfile} />,
    notifications: <NotificationsTab prefs={notifPrefs} setPrefs={setNotifPrefs} />,
    security:      <SecurityTab secPrefs={secPrefs} setSecPrefs={setSecPrefs} />,
    ai:            <AIEngineTab aiPrefs={aiPrefs} setAIPrefs={setAIPrefs} />,
    integration:   <IntegrationTab intPrefs={intPrefs} setIntPrefs={setIntPrefs} />,
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="bg-gradient-to-br from-brand-primary to-brand-accent p-3 rounded-2xl text-white shadow-lg">
          <SettingsIcon size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">System Preferences</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Configure AI engine parameters and responder profile.</p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(249,168,212,0.1)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">

          {/* Sidebar tabs */}
          <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100 bg-white/40 space-y-1.5">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-left transition-all duration-200 ${
                    active ? 'bg-brand-soft text-brand-accent shadow-sm border border-brand-primary/20' : 'text-gray-500 hover:bg-white/70 hover:text-brand-navy'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-brand-accent' : 'text-gray-400'} />
                  {label}
                  {active && <ChevronRight size={14} className="ml-auto text-brand-accent" />}
                </button>
              );
            })}

            {/* Dark mode toggle */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={toggleDarkMode}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-left transition-all ${
                  darkMode ? 'bg-brand-navy text-white' : 'text-gray-500 hover:bg-white/70 hover:text-brand-navy'
                }`}
              >
                <Moon size={17} />
                Dark Mode
                <div className={`ml-auto w-9 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-brand-accent' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${darkMode ? 'left-4' : 'left-0.5'}`} />
                </div>
              </button>
            </div>

            {/* Logged in user info */}
            {user && (
              <div className="pt-4 border-t border-gray-100 mt-2">
                <div className="px-4 py-2 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
                  <p className="text-xs font-black text-brand-navy mt-0.5 truncate">{user.name}</p>
                  <p className="text-[10px] font-bold text-brand-accent truncate">{user.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content panel */}
          <div
            className="p-8 md:p-10 col-span-3 space-y-8"
            key={activeTab}
            style={{ animation: 'fadeSlideIn 0.25s ease' }}
          >
            <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {panels[activeTab]}

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:text-brand-navy hover:border-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 bg-gradient-to-r from-brand-accent to-pink-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                <SaveAll size={16} />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
