import { motion } from 'framer-motion';
import { Radar, AlertTriangle, Wifi, Globe, Cpu, Shield, ExternalLink, Server } from 'lucide-react';

interface ThreatPanelProps {
  failedAttempts: Array<{
    id: string;
    browser: string | null;
    os: string | null;
    ip_address: string | null;
    risk_level: string;
    failure_reason?: string | null;
    created_at: string;
  }>;
}

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', glow: '' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15', glow: '' },
  high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15', glow: 'shadow-red-500/10 shadow-sm' },
  critical: { color: 'text-red-500', bg: 'bg-red-500/15', border: 'border-red-500/25', glow: 'shadow-red-500/20 shadow-md' },
};

export default function ThreatDetectionPanel({ failedAttempts }: ThreatPanelProps) {
  const threats = failedAttempts.slice(0, 8).map((attempt) => ({
    id: attempt.id,
    type: attempt.failure_reason || 'Suspicious Login',
    device: `${attempt.browser || 'Unknown'} / ${attempt.os || 'Unknown'}`,
    ip: attempt.ip_address || 'Unknown',
    severity: attempt.risk_level || 'medium',
    time: new Date(attempt.created_at).toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    }),
  }));

  // Simulated threat enrichment if no real data
  const enrichedThreats = threats.length > 0 ? threats : [
    { id: '1', type: 'No threats detected', device: 'All clear', ip: '-', severity: 'low', time: 'Now' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-red-500/30 via-rose-500/20 to-purple-500/30">
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 backdrop-blur-xl">
        {/* Danger gradient top line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-purple-500" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Radar className="w-4 h-4 text-red-400 animate-pulse" />
            Real-Time Threat Detection
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-xs text-red-400 font-mono">LIVE</span>
          </div>
        </div>

        {/* Threat List */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {enrichedThreats.map((threat, i) => {
            const sev = SEVERITY_CONFIG[threat.severity] || SEVERITY_CONFIG.medium;
            return (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`p-3 rounded-xl border ${sev.border} ${sev.bg} ${sev.glow} flex items-center gap-3 transition-all hover:scale-[1.01]`}
              >
                <div className={`w-8 h-8 rounded-lg ${sev.bg} flex items-center justify-center flex-shrink-0`}>
                  <AlertTriangle className={`w-4 h-4 ${sev.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${sev.color}`}>{threat.type}</span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md ${sev.bg} ${sev.color} border ${sev.border}`}>
                      {threat.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {threat.device} · {threat.ip}
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono flex-shrink-0">
                  {threat.time}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* AI Status */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-500">AI Engine analyzing patterns</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-mono border border-red-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            MONITORING
          </span>
        </div>
      </div>
    </div>
  );
}
