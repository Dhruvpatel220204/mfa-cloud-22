import { useEffect, useState, useCallback, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceInfo, calculateTrustScore } from '@/lib/device-fingerprint';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, LogOut, ShieldCheck, Cpu } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import TrustScoreCard from '@/components/dashboard/TrustScoreCard';
import LoginHistoryCard from '@/components/dashboard/LoginHistoryCard';
import DevicesCard from '@/components/dashboard/DevicesCard';
import ActiveSessionsCard from '@/components/dashboard/ActiveSessionsCard';
import SecurityOverview from '@/components/dashboard/SecurityOverview';
import MFAToggleCard from '@/components/dashboard/MFAToggleCard';
import ThreatDetectionPanel from '@/components/dashboard/ThreatDetectionPanel';
import SecurityAnalyticsChart from '@/components/dashboard/SecurityAnalyticsChart';
import SecurityRecommendations from '@/components/dashboard/SecurityRecommendations';
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import ReportsPanel from '@/components/dashboard/ReportsPanel';
import NotificationBell from '@/components/dashboard/NotificationBell';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [trustScore, setTrustScore] = useState<{ score: number; level: 'low' | 'medium' | 'high' | 'critical' }>({ score: 85, level: 'low' });
  const [activeTab, setActiveTab] = useState('overview');
  const [renderedTab, setRenderedTab] = useState('overview');

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      setRenderedTab(tab);
    }, 0);
  }, []);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingCredentials, setSavingCredentials] = useState(false);

  useEffect(() => {
    if (user?.email) setNewEmail(user.email);
  }, [user?.email]);

  const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() ?? '';

  const loadData = useCallback(async () => {
    if (!user) return;

    const [profileRes, devicesRes, loginsRes, sessionsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('devices').select('*').eq('user_id', user.id).order('last_seen', { ascending: false }),
      supabase.from('login_attempts').select('*').or(`user_id.eq.${user.id},email.eq.${normalizeEmail(user.email)}`).order('created_at', { ascending: false }).limit(50),
      supabase.from('user_sessions').select('*').eq('user_id', user.id).order('last_active', { ascending: false }),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (devicesRes.data) setDevices(devicesRes.data);
    if (loginsRes.data) setLoginAttempts(loginsRes.data);
    if (sessionsRes.data) setSessions(sessionsRes.data);

    // Calculate trust score
    const deviceInfo = getDeviceInfo();
    const knownDevice = devicesRes.data?.some(d => d.device_fingerprint === deviceInfo.fingerprint);
    const failedAttemptsCount = loginsRes.data?.filter(a => !a.success).length || 0;
    const accountAge = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

    const score = calculateTrustScore({
      isKnownDevice: !!knownDevice,
      loginSuccess: true,
      failedAttemptsRecent: failedAttemptsCount,
      accountAge,
    });
    setTrustScore(score);
  }, [user]);

  // Register current device on login
  useEffect(() => {
    if (!user) return;

    const registerDevice = async () => {
      const deviceInfo = getDeviceInfo();
      const { data: existing } = await supabase
        .from('devices')
        .select('id')
        .eq('user_id', user.id)
        .eq('device_fingerprint', deviceInfo.fingerprint)
        .maybeSingle();

      if (existing) {
        await supabase.from('devices').update({ last_seen: new Date().toISOString() }).eq('id', existing.id);
      } else {
        await supabase.from('devices').insert({
          user_id: user.id,
          device_fingerprint: deviceInfo.fingerprint,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          trust_score: 50,
        });
        toast.info('New device detected and registered');
      }

      // Create session
      await supabase.from('user_sessions').insert({
        user_id: user.id,
        session_token: crypto.randomUUID(),
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      });
    };

    registerDevice();
    loadData();
  }, [user, loadData]);

  // Realtime: listen for failed login attempts
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('failed-login-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'login_attempts',
          filter: `email=eq.${normalizeEmail(user.email)}`,
        },
        (payload) => {
          const attempt = payload.new as any;
          if (!attempt.success) {
            toast.error('⚠️ Threat Detected!', {
              description: `Suspicious login from ${attempt.browser} / ${attempt.os}`,
              style: { background: 'rgba(220, 38, 38, 0.9)', color: 'white', border: '1px solid rgba(239, 68, 68, 0.5)' },
            });
            setLoginAttempts(prev => [attempt, ...prev]);
          } else {
            setLoginAttempts(prev => [attempt, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleToggleMFA = async (enabled: boolean) => {
    if (!user) return;
    await supabase.from('profiles').update({ mfa_enabled: enabled }).eq('user_id', user.id);
    setProfile((prev: any) => ({ ...prev, mfa_enabled: enabled }));
    toast.success(enabled ? 'MFA Security Enabled' : 'MFA Security Disabled');
  };

  const handleGenerateBackupCodes = async () => {
    if (!user) return;
    const codes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    );
    await supabase.from('profiles').update({ backup_codes: codes }).eq('user_id', user.id);
    setProfile((prev: any) => ({ ...prev, backup_codes: codes }));
    toast.success('Backup codes generated successfully');
  };

  const handleSaveCredentials = async () => {
    const sanitizedEmail = newEmail.trim();
    const hasEmailChange = !!sanitizedEmail && sanitizedEmail !== (user?.email || '');
    const hasPasswordChange = newPassword.length > 0;

    if (!hasEmailChange && !hasPasswordChange) {
      toast.info('No account changes to save');
      return;
    }

    if (hasPasswordChange && newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (hasPasswordChange && newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSavingCredentials(true);
    try {
      const payload: { email?: string; password?: string } = {};
      if (hasEmailChange) payload.email = sanitizedEmail;
      if (hasPasswordChange) payload.password = newPassword;

      const { error } = await supabase.auth.updateUser(payload);
      if (error) {
        toast.error(error.message);
        return;
      }

      if (hasEmailChange) {
        toast.success('Email update requested. Check your inbox to confirm new email.');
      }
      if (hasPasswordChange) {
        toast.success('Password updated. You can now sign in with email and password.');
      }

      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setSavingCredentials(false);
    }
  };

  const normalizedUserEmail = normalizeEmail(user?.email);
  const visibleAttempts = loginAttempts.filter((attempt) => {
    const attemptEmail = normalizeEmail(attempt.email);
    return attempt.user_id === user?.id || (!!normalizedUserEmail && attemptEmail === normalizedUserEmail);
  });
  const failedAttempts = visibleAttempts.filter(a => !a.success);
  const failedLogins = failedAttempts.length;

  useEffect(() => {
    const updatedScore = calculateTrustScore({
      isKnownDevice: true,
      loginSuccess: true,
      failedAttemptsRecent: failedLogins,
      accountAge: 0,
    });
    setTrustScore(updatedScore);
  }, [failedLogins]);

  const renderContent = () => {
    switch (renderedTab) {
      case 'threats':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6">
            <ThreatDetectionPanel failedAttempts={failedAttempts} />
            <LoginHistoryCard attempts={visibleAttempts} />
          </motion.div>
        );
      case 'mfa':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <MFAToggleCard
              enabled={profile?.mfa_enabled || false}
              backupCodes={profile?.backup_codes || []}
              onToggle={handleToggleMFA}
              onGenerateBackupCodes={handleGenerateBackupCodes}
            />
          </motion.div>
        );
      case 'analytics':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SecurityAnalyticsChart
              totalLogins={visibleAttempts.length}
              failedLogins={failedLogins}
              loginAttempts={visibleAttempts}
            />
          </motion.div>
        );
      case 'devices':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <DevicesCard
              devices={devices}
              onRemoveDevice={async (id) => {
                await supabase.from('devices').delete().eq('id', id);
                setDevices(d => d.filter(x => x.id !== id));
                toast.success('Device removed');
              }}
              onToggleTrust={async (id, trusted) => {
                await supabase.from('devices').update({ is_trusted: trusted }).eq('id', id);
                setDevices(d => d.map(x => x.id === id ? { ...x, is_trusted: trusted } : x));
                toast.success('Device trust updated');
              }}
            />
          </motion.div>
        );
      case 'sessions':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <ActiveSessionsCard
              sessions={sessions}
              onEndSession={async (id) => {
                await supabase.from('user_sessions').update({ is_active: false }).eq('id', id);
                setSessions(s => s.map(x => x.id === id ? { ...x, is_active: false } : x));
                toast.success('Session terminated');
              }}
            />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SettingsPanel
              userEmail={user?.email || ''}
              displayName={profile?.display_name || ''}
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleSaveCredentials={handleSaveCredentials}
              savingCredentials={savingCredentials}
              onSignOut={handleSignOut}
            />
          </motion.div>
        );
      case 'reports':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ReportsPanel failedAttempts={failedAttempts} />
          </motion.div>
        );
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SecurityOverview
                mfaEnabled={profile?.mfa_enabled || false}
                totalDevices={devices.length}
                totalLogins={visibleAttempts.length}
                failedLogins={failedLogins}
                trustScore={trustScore.score}
                activeSessions={sessions.filter(s => s.is_active).length}
                threatsBlocked={failedLogins} // Using failed logins as a proxy for blocked threats
              />
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-8 space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <TrustScoreCard score={trustScore.score} level={trustScore.level} />
                  <SecurityRecommendations
                    trustScore={trustScore.score}
                    mfaEnabled={profile?.mfa_enabled || false}
                    onEnableMfa={() => handleTabChange('mfa')}
                  />
                </div>
                <ThreatDetectionPanel failedAttempts={failedAttempts} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-4 space-y-6"
              >
                <LoginHistoryCard attempts={visibleAttempts.slice(0, 10)} />
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} 
        />
        {/* Ambient Glows */}
        <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* Sidebar */}
      <DashboardSidebar activeItem={activeTab} onItemClick={handleTabChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
          {/* Animated border bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Search */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search security events, devices, or settings..."
              className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* AI Engine Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">AI Active</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            </div>

            <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800" />

            <NotificationBell
              failedAttempts={failedAttempts}
              devices={devices}
              loginAttempts={visibleAttempts}
            />

            <ThemeToggle />

            <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800" />

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none mb-1">
                  {profile?.display_name || user?.email?.split('@')[0]}
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono uppercase">Enterprise Admin</p>
              </div>
              <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px] hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
              </button>
              <button 
                onClick={handleSignOut}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
