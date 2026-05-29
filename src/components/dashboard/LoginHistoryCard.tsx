import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Globe, Monitor, Key, Smartphone, AlertTriangle } from 'lucide-react';

interface LoginAttempt {
  id: string;
  success: boolean;
  ip_address: string | null;
  browser: string | null;
  os: string | null;
  location: string | null;
  risk_level: string;
  failure_reason?: string | null;
  created_at: string;
}

interface LoginHistoryCardProps {
  attempts: LoginAttempt[];
}

export default function LoginHistoryCard({ attempts }: LoginHistoryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 to-purple-500/20">
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Live Login Activity
          </h3>
          <span className="text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {attempts.length} events
          </span>
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {attempts.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-12">
              No login attempts recorded
            </p>
          ) : (
            attempts.map((attempt, index) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.5) }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-200 ${
                  attempt.success
                    ? 'bg-emerald-500/[0.03] border-emerald-500/10 hover:border-emerald-500/30'
                    : 'bg-red-500/[0.03] border-red-500/10 hover:border-red-500/30'
                }`}
              >
                {/* Status icon */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    attempt.success ? 'bg-emerald-500/10' : 'bg-red-500/10'
                  }`}
                >
                  {attempt.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-900 dark:text-white font-medium">
                      {attempt.success ? 'Successful Login' : 'Failed Attempt'}
                    </span>
                    <RiskBadge level={attempt.risk_level} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Monitor className="w-3 h-3" />
                      {attempt.browser || 'Unknown'} / {attempt.os || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {attempt.ip_address || 'N/A'}
                    </span>
                    {!attempt.success && attempt.failure_reason ? (
                      <span className="flex items-center gap-1 text-red-400/80">
                        <AlertTriangle className="w-3 h-3" />
                        {attempt.failure_reason}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0 font-mono">
                  <Clock className="w-3 h-3" />
                  {new Date(attempt.created_at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const config: Record<string, { bg: string; text: string; glow: string }> = {
    low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: '' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', glow: '' },
    high: { bg: 'bg-red-500/10', text: 'text-red-400', glow: 'shadow-red-500/20 shadow-sm' },
    critical: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'shadow-red-500/30 shadow-md animate-pulse' },
  };

  const c = config[level] || config.low;

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border border-transparent ${c.bg} ${c.text} ${c.glow}`}
    >
      {level}
    </span>
  );
}
