import { motion } from 'framer-motion';
import {
  Shield, Fingerprint, Activity, AlertTriangle, Lock, Smartphone,
  CheckCircle2, Brain, HeartPulse,
} from 'lucide-react';

interface SecurityOverviewProps {
  mfaEnabled: boolean;
  totalDevices: number;
  totalLogins: number;
  failedLogins: number;
  trustScore?: number;
  activeSessions?: number;
  threatsBlocked?: number;
}

export default function SecurityOverview({
  mfaEnabled,
  totalDevices,
  totalLogins,
  failedLogins,
  trustScore = 0,
  activeSessions = 0,
  threatsBlocked = 0,
}: SecurityOverviewProps) {
  const successRate =
    totalLogins > 0
      ? Math.round(((totalLogins - failedLogins) / totalLogins) * 100)
      : 0;

  const stats = [
    {
      label: 'MFA Status',
      value: mfaEnabled ? 'Active' : 'Off',
      icon: Lock,
      gradient: mfaEnabled
        ? 'from-emerald-500 to-cyan-500'
        : 'from-amber-500 to-orange-500',
      glow: mfaEnabled ? 'shadow-emerald-500/20' : 'shadow-amber-500/20',
      pulse: mfaEnabled,
    },
    {
      label: 'Active Sessions',
      value: activeSessions.toString(),
      icon: Activity,
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/20',
      pulse: activeSessions > 0,
    },
    {
      label: 'Trusted Devices',
      value: totalDevices.toString(),
      icon: Smartphone,
      gradient: 'from-violet-500 to-purple-500',
      glow: 'shadow-violet-500/20',
    },
    {
      label: 'Failed Attempts',
      value: failedLogins.toString(),
      icon: AlertTriangle,
      gradient:
        failedLogins > 3
          ? 'from-red-500 to-rose-500'
          : 'from-emerald-500 to-teal-500',
      glow:
        failedLogins > 3
          ? 'shadow-red-500/20'
          : 'shadow-emerald-500/20',
    },
    {
      label: 'Threats Blocked',
      value: threatsBlocked.toString(),
      icon: Shield,
      gradient: 'from-rose-500 to-pink-500',
      glow: 'shadow-rose-500/20',
    },
    {
      label: 'Login Success',
      value: `${successRate}%`,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-green-500',
      glow: 'shadow-emerald-500/20',
    },
    {
      label: 'AI Risk Score',
      value: trustScore.toString(),
      icon: Brain,
      gradient: 'from-cyan-500 to-emerald-500',
      glow: 'shadow-cyan-500/20',
    },
    {
      label: 'Security Health',
      value:
        trustScore >= 80
          ? 'Excellent'
          : trustScore >= 60
          ? 'Good'
          : trustScore >= 40
          ? 'Fair'
          : 'Critical',
      icon: HeartPulse,
      gradient:
        trustScore >= 80
          ? 'from-emerald-500 to-cyan-500'
          : trustScore >= 60
          ? 'from-amber-500 to-yellow-500'
          : 'from-red-500 to-rose-500',
      glow:
        trustScore >= 80
          ? 'shadow-emerald-500/20'
          : trustScore >= 60
          ? 'shadow-amber-500/20'
          : 'shadow-red-500/20',
      pulse: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`
            relative overflow-hidden rounded-2xl p-[1px]
            bg-gradient-to-br ${stat.gradient}
            shadow-lg ${stat.glow}
            transition-shadow duration-300
            hover:shadow-xl
          `}
        >
          {/* Inner card */}
          <div className="h-full rounded-2xl bg-slate-50 dark:bg-slate-950/90 dark:bg-slate-950/90 p-5 backdrop-blur-xl relative overflow-hidden">
            {/* Gradient shimmer */}
            <div
              className={`absolute inset-0 opacity-[0.06] bg-gradient-to-br ${stat.gradient}`}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                  {stat.value}
                </p>
              </div>

              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
              >
                <stat.icon className="w-5 h-5 text-slate-900 dark:text-white" />
              </div>
            </div>

            {/* Pulse indicator */}
            {stat.pulse && (
              <div className="absolute bottom-3 right-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-gradient-to-r ${stat.gradient}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r ${stat.gradient}`}
                  />
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
