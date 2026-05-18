'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  User, Bell, Shield, Palette, CreditCard,
  Moon, Sun, Globe, Lock, Trash2, CheckCircle2,
  ChevronRight, Eye, EyeOff, Save, Loader2
} from "lucide-react";

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/10'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
  </button>
);

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Profile
  const [displayName, setDisplayName]   = useState('');
  const [bio, setBio]                   = useState('CS student passionate about building cool things.');
  const [university, setUniversity]     = useState('');
  const [skills, setSkills]             = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved]   = useState(false);
  const [profileError, setProfileError]   = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Password
  const [currentPass, setCurrentPass]   = useState('');
  const [newPass, setNewPass]           = useState('');
  const [confirmPass, setConfirmPass]   = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [passError, setPassError]       = useState('');

  // Notifications
  const [notifs, setNotifs] = useState({
    newBooking: true,
    messages: true,
    promotions: false,
    weeklyDigest: true,
    bookingReminders: true,
  });

  // Appearance
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');
  const [accentTheme, setAccentTheme] = useState('purple');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persistedAccent = localStorage.getItem('skillbridge_accent') || 'purple';
      setAccentTheme(persistedAccent);
      const isLight = localStorage.getItem('skillbridge_theme') === 'light';
      setDarkMode(!isLight);
    }
  }, []);

  const themes = [
    { id: 'purple', label: 'Amethyst', primary: '#7c3aed', secondary: '#3b82f6', colorClass: 'bg-[#7c3aed]' },
    { id: 'emerald', label: 'Emerald', primary: '#10b981', secondary: '#14b8a6', colorClass: 'bg-[#10b981]' },
    { id: 'rose', label: 'Rose', primary: '#ec4899', secondary: '#f43f5e', colorClass: 'bg-[#ec4899]' },
    { id: 'amber', label: 'Amber', primary: '#f59e0b', secondary: '#ef4444', colorClass: 'bg-[#f59e0b]' },
    { id: 'cyan', label: 'Cyan', primary: '#06b6d4', secondary: '#3b82f6', colorClass: 'bg-[#06b6d4]' },
  ];

  const applyAccentTheme = (themeId) => {
    const selected = themes.find(t => t.id === themeId);
    if (!selected) return;
    setAccentTheme(themeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillbridge_accent', themeId);
      document.documentElement.style.setProperty('--primary', selected.primary);
      document.documentElement.style.setProperty('--secondary', selected.secondary);
      document.documentElement.style.setProperty('--ring', selected.primary);
    }
  };

  const applyThemeMode = (val) => {
    setDarkMode(val);
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (val) {
      // Dark Mode
      root.style.setProperty('--background', '#050507');
      root.style.setProperty('--foreground', '#f8f9ff');
      root.style.setProperty('--card', '#0f0f13');
      root.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--input-background', 'rgba(255, 255, 255, 0.03)');
      root.style.setProperty('--muted-foreground', '#94a3b8');
      localStorage.setItem('skillbridge_theme', 'dark');
    } else {
      // Light Mode
      root.style.setProperty('--background', '#f8fafc');
      root.style.setProperty('--foreground', '#0f172a');
      root.style.setProperty('--card', '#ffffff');
      root.style.setProperty('--border', 'rgba(15, 23, 42, 0.08)');
      root.style.setProperty('--input-background', 'rgba(15, 23, 42, 0.03)');
      root.style.setProperty('--muted-foreground', '#64748b');
      localStorage.setItem('skillbridge_theme', 'light');
    }
  };

  // Privacy
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showEmail: false,
    showActivity: true,
  });

  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile',       label: 'Profile',       icon: User },
    { id: 'security',      label: 'Security',       icon: Lock },
    { id: 'notifications', label: 'Notifications',  icon: Bell },
    { id: 'appearance',    label: 'Appearance',     icon: Palette },
    { id: 'privacy',       label: 'Privacy',        icon: Shield },
  ];

  // Fetch real profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res  = await fetch('/api/user/profile');
        if (!res.ok) return;
        const data = await res.json();
        setDisplayName(data.name || '');
        setSkills(data.skills || '');
        setUniversity(data.university || '');
      } catch (e) {
        // silent — session values are fallback
      } finally {
        setLoadingProfile(false);
      }
    }
    if (session) loadProfile();
    else setLoadingProfile(false);
  }, [session]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileError('');
    setProfileSaved(false);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: displayName, skills, university }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = () => {
    setPassError('');
    if (!currentPass || !newPass || !confirmPass) { setPassError('All fields are required.'); return; }
    if (newPass !== confirmPass) { setPassError('New passwords do not match.'); return; }
    if (newPass.length < 8) { setPassError('Password must be at least 8 characters.'); return; }
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    setPassError('✅ Password changed successfully!');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg">Manage your account preferences and configuration</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar nav */}
            <div className="w-full lg:w-56 flex-shrink-0">
              <div className="bg-card/30 rounded-[2rem] p-2 border border-white/5 shadow-xl sticky top-20 lg:top-8 flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 lg:gap-1 no-scrollbar">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                      } w-auto lg:w-full`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6 min-w-0">

              {/* Profile */}
              {activeTab === 'profile' && (
                <>
                  <div className="bg-card/30 rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-xl">
                    <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" /> Profile Information
                    </h2>

                    {/* Avatar */}
                    <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/5">
                      <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-black shadow-2xl ring-4 ring-primary/20">
                        {(session?.user?.name || displayName || 'U').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-lg mb-1">{session?.user?.name || displayName || 'Your Name'}</div>
                        <div className="text-muted-foreground text-sm mb-4">{session?.user?.email || 'your@email.com'}</div>
                        <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                          Change Avatar
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Display Name</label>
                        <input
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground font-bold transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">University</label>
                        <input
                          value={university}
                          onChange={e => setUniversity(e.target.value)}
                          placeholder="Your university"
                          className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground font-bold transition-all"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Skills <span className="text-muted-foreground/50 normal-case font-medium">(comma separated)</span></label>
                      <input
                        value={skills}
                        onChange={e => setSkills(e.target.value)}
                        placeholder="e.g. Python, React, UI Design"
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground font-bold transition-all"
                      />
                    </div>

                    <div className="mb-8">
                      <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Bio</label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Tell others about yourself..."
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground font-medium resize-none transition-all"
                      />
                    </div>

                    {profileError && (
                      <div className="mb-4 px-5 py-3 rounded-2xl text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                        {profileError}
                      </div>
                    )}

                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-70 disabled:scale-100 shadow-xl"
                    >
                      {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : profileSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {savingProfile ? 'Saving...' : profileSaved ? 'Saved!' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="bg-card/30 rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-xl">
                  <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" /> Change Password
                  </h2>

                  <div className="space-y-5 mb-8">
                    {[
                      { label: 'Current Password', val: currentPass, set: setCurrentPass },
                      { label: 'New Password',     val: newPass,     set: setNewPass },
                      { label: 'Confirm Password', val: confirmPass, set: setConfirmPass },
                    ].map(({ label, val, set }) => (
                      <div key={label}>
                        <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
                        <div className="relative">
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={val}
                            onChange={e => set(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-3.5 pr-12 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground font-bold transition-all"
                          />
                          <button
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                          >
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {passError && (
                    <div className={`mb-6 px-5 py-3 rounded-2xl text-sm font-bold ${passError.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {passError}
                    </div>
                  )}

                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                  >
                    <Lock className="w-4 h-4" /> Update Password
                  </button>

                  {/* Danger zone */}
                  <div className="mt-10 pt-8 border-t border-white/5">
                    <h3 className="text-lg font-black text-red-400 mb-4 flex items-center gap-2">
                      <Trash2 className="w-5 h-5" /> Danger Zone
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium mb-5">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <button className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-black text-sm hover:bg-red-500/20 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="bg-card/30 rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-xl">
                  <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" /> Notification Preferences
                  </h2>
                  <div className="space-y-3">
                    {[
                      { key: 'newBooking',        label: 'New Booking Requests',   desc: 'When someone books one of your services' },
                      { key: 'messages',          label: 'Direct Messages',         desc: 'When you receive a new message' },
                      { key: 'bookingReminders',  label: 'Booking Reminders',       desc: '1 hour before your upcoming sessions' },
                      { key: 'weeklyDigest',      label: 'Weekly Digest',           desc: 'Summary of your earnings and activity' },
                      { key: 'promotions',        label: 'Promotions & Updates',    desc: 'News, tips and special offers' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                        <div>
                          <div className="font-bold text-foreground">{label}</div>
                          <div className="text-sm text-muted-foreground font-medium">{desc}</div>
                        </div>
                        <Toggle enabled={notifs[key]} onChange={val => setNotifs(prev => ({ ...prev, [key]: val }))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeTab === 'appearance' && (
                <div className="bg-card/30 rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-xl">
                  <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                    <Palette className="w-5 h-5 text-primary" /> Appearance
                  </h2>

                  <div className="mb-10">
                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Theme Mode</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Dark Mode', icon: Moon, val: true },
                        { label: 'Light Mode', icon: Sun, val: false },
                      ].map(({ label, icon: Icon, val }) => (
                        <button
                          key={label}
                          onClick={() => applyThemeMode(val)}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all font-bold ${
                            darkMode === val
                              ? 'border-primary bg-primary/5 text-primary shadow-lg'
                              : 'border-white/5 bg-white/5 text-muted-foreground hover:border-white/20'
                          }`}
                        >
                          <Icon className="w-5 h-5" /> {label}
                          {darkMode === val && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Palette Selector */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Theme Accent Color</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {themes.map(t => (
                        <button
                          key={t.id}
                          onClick={() => applyAccentTheme(t.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3 ${
                            accentTheme === t.id
                              ? 'border-primary bg-primary/5 text-primary shadow-lg scale-105'
                              : 'border-white/5 bg-white/5 text-muted-foreground hover:border-white/20'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${t.colorClass} shadow-md border border-white/10`} />
                          <span className="text-xs font-black tracking-wide">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy */}
              {activeTab === 'privacy' && (
                <div className="bg-card/30 rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-xl">
                  <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" /> Privacy Settings
                  </h2>
                  <div className="space-y-3">
                    {[
                      { key: 'publicProfile', label: 'Public Profile',    desc: 'Anyone can view your profile and services' },
                      { key: 'showEmail',     label: 'Show Email',         desc: 'Display your email on your public profile' },
                      { key: 'showActivity',  label: 'Show Activity',      desc: 'Show your recent activity to other users' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                        <div>
                          <div className="font-bold text-foreground">{label}</div>
                          <div className="text-sm text-muted-foreground font-medium">{desc}</div>
                        </div>
                        <Toggle enabled={privacy[key]} onChange={val => setPrivacy(prev => ({ ...prev, [key]: val }))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
