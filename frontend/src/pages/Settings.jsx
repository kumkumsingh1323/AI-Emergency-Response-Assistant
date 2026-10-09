import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, Bell, Shield, User, Globe, Moon,
  Database, Check, Zap, Key, Wifi, ToggleLeft, ToggleRight, ChevronRight
} from 'lucide-react';

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',       icon: Shield },
  { id: 'ai',            label: 'AI Engine',      icon: Database },
  { id: 'integration',   label: 'Integration',    icon: Globe },
];

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

// ─── Tab Content Panels ────────────────────────────────────────────────────────

function ProfileTab() {
  return (
    <div className="space-y-8">
      <SectionTitle>Responder Profile</SectionTitle>
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-pink-500/20 flex-shrink-0">
          AU
        </div>
        <div>
          <button onClick={() => alert('Avatar upload dialog would open here.')} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-navy shadow-sm hover:shadow-md transition-shadow mb-2 block">Change Avatar</button>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">JPG, GIF or PNG. Max 2MB.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Full Name"><input type="text" defaultValue="Admin User" className={inputCls} /></Field>
        <Field label="Email Address"><input type="email" defaultValue="responder@emergency.gov" className={inputCls} /></Field>
        <Field label="Role"><input type="text" defaultValue="Command Center Lead" className={inputCls} disabled /></Field>
        <Field label="Assigned Region">
          <select className={inputCls + ' appearance-none cursor-pointer'}>
            <option>Chennai Metro</option>
            <option>Coimbatore</option>
            <option>Madurai</option>
            <option>Hyderabad</option>
            <option>Mumbai North</option>
          </select>
        </Field>
        <Field label="Phone / Dispatch Line"><input type="tel" defaultValue="+91 98400 00001" className={inputCls} /></Field>
        <Field label="Badge / ID"><input type="text" defaultValue="CMD-2024-001" className={inputCls} /></Field>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState({
    criticalAlerts: true,
    emailDigest: false,
    smsAlerts: true,
    systemUpdates: false,
    assignmentAlerts: true,
    weatherAlerts: true,
  });
  const toggle = (key) => setNotifs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-8">
      <SectionTitle>Notification Preferences</SectionTitle>
      <div className="space-y-3">
        <ToggleRow label="Critical Incident Alerts" description="Instant push for CRITICAL & HIGH urgency events" value={notifs.criticalAlerts} onChange={() => toggle('criticalAlerts')} />
        <ToggleRow label="Email Digest" description="Daily summary of all incidents sent to your email" value={notifs.emailDigest} onChange={() => toggle('emailDigest')} />
        <ToggleRow label="SMS Alerts" description="Receive SMS for escalated incidents" value={notifs.smsAlerts} onChange={() => toggle('smsAlerts')} />
        <ToggleRow label="Assignment Alerts" description="Notify when an incident is assigned to you" value={notifs.assignmentAlerts} onChange={() => toggle('assignmentAlerts')} />
        <ToggleRow label="Weather Alerts" description="IMD severe weather warnings in your region" value={notifs.weatherAlerts} onChange={() => toggle('weatherAlerts')} />
        <ToggleRow label="System Updates" description="Platform maintenance and version release notices" value={notifs.systemUpdates} onChange={() => toggle('systemUpdates')} />
      </div>
    </div>
  );
}

function SecurityTab() {
  const [twoFA, setTwoFA] = useState(true);
  const [sessionLog, setSessionLog] = useState(false);

  return (
    <div className="space-y-8">
      <SectionTitle>Security Settings</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Current Password"><input type="password" defaultValue="••••••••" className={inputCls} /></Field>
        <Field label="New Password"><input type="password" placeholder="Min 12 characters" className={inputCls} /></Field>
        <Field label="Confirm New Password"><input type="password" placeholder="Repeat new password" className={inputCls} /></Field>
      </div>
      <div className="space-y-3">
        <ToggleRow label="Two-Factor Authentication (2FA)" description="Require OTP on every login via authenticator app" value={twoFA} onChange={setTwoFA} />
        <ToggleRow label="Session Activity Log" description="Record all login events and IP addresses" value={sessionLog} onChange={setSessionLog} />
      </div>
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
        <p className="text-xs font-black text-brand-danger uppercase tracking-widest mb-1">Danger Zone</p>
        <p className="text-sm font-medium text-gray-500 mb-4">These actions are irreversible. Proceed with caution.</p>
        <button onClick={() => alert('All active sessions revoked successfully.')} className="px-5 py-2.5 bg-white border border-red-200 text-brand-danger text-sm font-bold rounded-xl hover:bg-red-50 transition-colors">
          Revoke All Active Sessions
        </button>
      </div>
    </div>
  );
}

function AIEngineTab() {
  const [confidence, setConfidence] = useState(75);
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [mergeThreshold, setMergeThreshold] = useState(false);
  const [nlpModel, setNlpModel] = useState('gemini-pro');

  return (
    <div className="space-y-8">
      <SectionTitle>AI Engine Configuration</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="NLP Model">
          <select value={nlpModel} onChange={e => setNlpModel(e.target.value)} className={inputCls + ' appearance-none cursor-pointer'}>
            <option value="gemini-pro">Gemini Pro (Default)</option>
            <option value="gemini-flash">Gemini Flash (Faster)</option>
            <option value="gpt-4o">GPT-4o (Fallback)</option>
          </select>
        </Field>
        <Field label="Classification Language">
          <select className={inputCls + ' appearance-none cursor-pointer'}>
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
        </Field>
      </div>

      <div>
        <label className="block text-[10px] font-black text-brand-navy mb-3 uppercase tracking-widest">
          Minimum Confidence Threshold — <span className="text-brand-accent">{confidence}%</span>
        </label>
        <input
          type="range" min={50} max={99} value={confidence}
          onChange={e => setConfidence(Number(e.target.value))}
          className="w-full accent-pink-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1">
          <span>50% (Permissive)</span><span>99% (Strict)</span>
        </div>
      </div>

      <div className="space-y-3">
        <ToggleRow label="Auto-Escalate Critical Incidents" description="Automatically escalate when AI detects CRITICAL urgency" value={autoEscalate} onChange={setAutoEscalate} />
        <ToggleRow label="Smart Incident Merging" description="Auto-merge duplicate reports from the same location" value={mergeThreshold} onChange={setMergeThreshold} />
      </div>

      <div className="bg-brand-soft/50 border border-brand-primary/20 rounded-2xl p-5 flex items-center gap-4">
        <Zap size={20} className="text-brand-accent flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-brand-navy">Engine Status: <span className="text-brand-success">Online</span></p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Last processed: 3 reports · Avg latency: 1.2s</p>
        </div>
      </div>
    </div>
  );
}

function IntegrationTab() {
  const integrations = [
    { name: 'NDMA API', desc: 'National Disaster Management Authority data feed', connected: true, icon: '🌐' },
    { name: 'IMD Weather', desc: 'India Meteorological Department alerts & warnings', connected: true, icon: '⛈️' },
    { name: 'Twilio SMS', desc: 'SMS gateway for field responder notifications', connected: false, icon: '📱' },
    { name: 'Google Maps API', desc: 'Geocoding and reverse geocoding for incidents', connected: true, icon: '🗺️' },
    { name: 'Slack Webhook', desc: 'Push critical alerts to your Slack command channel', connected: false, icon: '💬' },
    { name: 'WhatsApp Business', desc: 'Receive reports directly from WhatsApp', connected: false, icon: '🟢' },
  ];

  return (
    <div className="space-y-8">
      <SectionTitle>External Integrations</SectionTitle>
      <div className="space-y-3">
        {integrations.map(({ name, desc, connected, icon }) => (
          <div key={name} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-brand-primary/30 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">{icon}</div>
              <div>
                <p className="font-bold text-brand-navy text-sm">{name}</p>
                <p className="text-xs text-gray-500 font-medium">{desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                connected ? 'text-brand-success bg-emerald-50 border-emerald-200' : 'text-gray-400 bg-gray-50 border-gray-200'
              }`}>
                {connected ? '● Connected' : '○ Disconnected'}
              </span>
              <button className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                connected
                  ? 'border border-red-200 text-brand-danger hover:bg-red-50'
                  : 'border border-brand-primary/30 text-brand-accent hover:bg-brand-soft'
              }`}>
                {connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Field label="Webhook URL">
          <div className="flex gap-2">
            <input type="url" placeholder="https://your-server.com/webhook" className={inputCls} />
            <button onClick={() => alert('Webhook test payload sent successfully!')} className="px-4 py-3 bg-brand-soft border border-brand-primary/30 text-brand-accent rounded-xl font-bold text-sm hover:bg-brand-primary/10 transition-colors flex-shrink-0">
              Test
            </button>
          </div>
        </Field>
      </div>
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
export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-theme', !darkMode);
  };

  useEffect(() => {
    return () => document.documentElement.classList.remove('dark-theme');
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const panels = { profile: <ProfileTab />, notifications: <NotificationsTab />, security: <SecurityTab />, ai: <AIEngineTab />, integration: <IntegrationTab /> };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
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

          {/* Sidebar */}
          <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100 bg-white/40 space-y-1.5">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-left transition-all duration-200 ${
                    active
                      ? 'bg-brand-soft text-brand-accent shadow-sm border border-brand-primary/20'
                      : 'text-gray-500 hover:bg-white/70 hover:text-brand-navy'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-brand-accent' : 'text-gray-400'} />
                  {label}
                  {active && <ChevronRight size={14} className="ml-auto text-brand-accent" />}
                </button>
              );
            })}

            {/* Dark mode toggle inline in sidebar */}
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
          </div>

          {/* Content */}
          <div className="p-8 md:p-10 col-span-3 space-y-8" key={activeTab}
            style={{ animation: 'fadeSlideIn 0.25s ease' }}>
            <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {panels[activeTab]}

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={() => setActiveTab('profile')}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:text-brand-navy hover:border-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all duration-300 ${
                  saved
                    ? 'bg-brand-success shadow-lg shadow-emerald-200'
                    : 'bg-gradient-to-r from-brand-accent to-pink-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5'
                }`}
              >
                {saved ? <><Check size={16} /> Saved!</> : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
