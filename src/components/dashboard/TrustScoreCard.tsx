import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Fingerprint, MapPin, Lock, Brain, Cpu } from 'lucide-react';

interface TrustScoreCardProps {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
}

export default function TrustScoreCard({ score, level }: TrustScoreCardProps) {
  const config = {
    low: {
      label: 'Low Risk',
      color: 'text-emerald-400',
      ring: '#10b981',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-cyan-500',
    },
    medium: {
      label: 'Medium Risk',
      color: 'text-amber-400',
      ring: '#f59e0b',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: Shield,
      gradient: 'from-amber-500 to-yellow-500',
    },
    high: {
      label: 'High Risk',
      color: 'text-red-400',
      ring: '#ef4444',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: ShieldAlert,
      gradient: 'from-red-500 to-rose-500',
    },
    critical: {
      label: 'Critical',
      color: 'text-red-500',
      ring: '#dc2626',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: ShieldX,
      gradient: 'from-red-600 to-rose-500',
    },
  };

  const c = config[level];
  const Icon = c.icon;
  const circumference = 2 * Math.PI * 52;
  const progress = ((100 - score) / 100) * circumference;

  const subScores = [
    { label: 'Device Trust', value: score > 70 ? 92 : score > 40 ? 65 : 28, icon: Fingerprint },
    { label: 'Login Behavior', value: score > 60 ? 88 : score > 30 ? 52 : 18, icon: Brain },
    { label: 'Geo-location Match', value: score > 50 ? 95 : 40, icon: MapPin },
    { label: 'Password Strength', value: score > 65 ? 80 : 55, icon: Lock },
    { label: 'AI Confidence', value: score > 70 ? 96 : score > 40 ? 72 : 35, icon: Cpu },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/40 via-emerald-500/20 to-purple-500/40 h-full">
      <div className="h-full rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Trust Score
          </h3>
          <span
            className={`text-xs font-mono px-3 py-1 rounded-full ${c.bg} ${c.color} border ${c.border}`}
          >
            {c.label}
          </span>
        </div>

        <div className="flex items-center gap-8">
          {/* Circular progress */}
          <div className="relative w-36 h-36 flex-shrink-0">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-30"
              style={{ background: c.ring }}
            />

            <svg className="w-36 h-36 transform -rotate-90 relative z-10" viewBox="0 0 120 120">
              {/* Track */}
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-800"
              />
              {/* Progress */}
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                stroke={c.ring}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: progress }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                style={{
                  filter: `drop-shadow(0 0 8px ${c.ring})`,
                }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <motion.span
                className="text-4xl font-bold text-slate-900 dark:text-white font-mono"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {score}
              </motion.span>
              <span className="text-xs text-slate-500 font-mono">/100</span>
            </div>
          </div>

          {/* Sub-scores */}
          <div className="flex-1 space-y-3">
            {subScores.map((sub, i) => (
              <div key={sub.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <sub.icon className="w-3 h-3" />
                    {sub.label}
                  </span>
                  <span className="text-slate-900 dark:text-white font-mono">{sub.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      sub.value > 70
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        : sub.value > 40
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.value}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    style={{
                      boxShadow:
                        sub.value > 70
                          ? '0 0 8px rgba(16,185,129,0.5)'
                          : sub.value > 40
                          ? '0 0 8px rgba(245,158,11,0.5)'
                          : '0 0 8px rgba(239,68,68,0.5)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
