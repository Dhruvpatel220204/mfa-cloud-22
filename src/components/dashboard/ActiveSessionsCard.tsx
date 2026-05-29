import { motion } from 'framer-motion';
import { Globe, LogOut, Clock, Activity, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionData {
  id: string;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  location: string | null;
  is_active: boolean;
  last_active: string;
  created_at: string;
}

interface ActiveSessionsCardProps {
  sessions: SessionData[];
  currentSessionId?: string;
  onEndSession: (id: string) => void;
}

export default function ActiveSessionsCard({ sessions, onEndSession }: ActiveSessionsCardProps) {
  const activeSessions = sessions.filter((s) => s.is_active);

  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 to-blue-500/20">
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Active Sessions
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 font-mono">{activeSessions.length} active</span>
          </div>
        </div>

        <div className="space-y-3">
          {activeSessions.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-12">No active sessions</p>
          ) : (
            activeSessions.map((session, index) => {
              const duration = Math.round(
                (Date.now() - new Date(session.created_at).getTime()) / (1000 * 60)
              );
              const durationLabel =
                duration < 60
                  ? `${duration}m`
                  : duration < 1440
                  ? `${Math.round(duration / 60)}h`
                  : `${Math.round(duration / 1440)}d`;

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.02] hover:border-cyan-500/25 transition-colors"
                >
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/15 flex items-center justify-center flex-shrink-0 relative">
                    <Monitor className="w-5 h-5 text-cyan-400" />
                    {/* Activity pulse */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {session.browser || 'Unknown'} · {session.os || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {session.ip_address || 'N/A'}
                      </span>
                      {session.location && (
                        <span>{session.location}</span>
                      )}
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {durationLabel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {new Date(session.last_active).toLocaleString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Kill session */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all"
                    onClick={() => onEndSession(session.id)}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Kill
                  </Button>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
