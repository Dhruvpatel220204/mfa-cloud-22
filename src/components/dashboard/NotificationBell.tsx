import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, ShieldCheck, Smartphone, LogIn, X, CheckCheck } from 'lucide-react';

interface Notification {
  id: string;
  type: 'threat' | 'device' | 'login' | 'security';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationBellProps {
  failedAttempts: any[];
  devices: any[];
  loginAttempts: any[];
}

export default function NotificationBell({ failedAttempts, devices, loginAttempts }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  // Build notifications from real data
  useEffect(() => {
    const notifs: Notification[] = [];

    // Failed login attempts = threat notifications
    failedAttempts.slice(0, 5).forEach((attempt, i) => {
      notifs.push({
        id: `threat-${attempt.id || i}`,
        type: 'threat',
        title: '⚠️ Failed Login Attempt',
        message: `Suspicious login from ${attempt.browser || 'Unknown'} / ${attempt.os || 'Unknown'}`,
        time: attempt.created_at ? new Date(attempt.created_at).toLocaleString() : 'Just now',
        read: false,
      });
    });

    // New devices
    devices.slice(0, 3).forEach((device, i) => {
      notifs.push({
        id: `device-${device.id || i}`,
        type: 'device',
        title: '📱 Device Registered',
        message: `${device.browser || 'Unknown'} on ${device.os || 'Unknown'}`,
        time: device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Recently',
        read: false,
      });
    });

    // Recent successful logins
    loginAttempts.filter(a => a.success).slice(0, 3).forEach((login, i) => {
      notifs.push({
        id: `login-${login.id || i}`,
        type: 'login',
        title: '✅ Successful Login',
        message: `Logged in via ${login.browser || 'Unknown'}`,
        time: login.created_at ? new Date(login.created_at).toLocaleString() : 'Just now',
        read: false,
      });
    });

    // Sort by time (newest first)
    notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setNotifications(notifs);
  }, [failedAttempts, devices, loginAttempts]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)));
  };

  const markRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'threat': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'device': return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'login': return <LogIn className="w-4 h-4 text-emerald-400" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'threat': return 'border-red-500/20';
      case 'device': return 'border-purple-500/20';
      case 'login': return 'border-emerald-500/20';
      default: return 'border-cyan-500/20';
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-[360px] max-h-[480px] rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[380px] custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif, index) => {
                  const isRead = readIds.has(notif.id);
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => markRead(notif.id)}
                      className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800/40 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        !isRead ? 'bg-cyan-50/50 dark:bg-cyan-500/[0.03]' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg border ${getBorderColor(notif.type)} bg-slate-50 dark:bg-slate-800/50`}>
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                              {notif.title}
                            </p>
                            {!isRead && (
                              <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 truncate">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1 font-mono">{notif.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
