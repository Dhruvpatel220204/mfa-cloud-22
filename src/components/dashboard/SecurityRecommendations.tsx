import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, Key, Smartphone, MonitorOff } from 'lucide-react';
import { useState } from 'react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'action' | 'info';
  icon: any;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  onAction?: () => void;
}

export default function SecurityRecommendations({ trustScore, mfaEnabled, onEnableMfa }: { trustScore: number; mfaEnabled: boolean; onEnableMfa?: () => void }) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Generate dynamic recommendations based on state
  const recommendations: Recommendation[] = [];

  if (!mfaEnabled) {
    recommendations.push({
      id: 'enable-mfa',
      title: 'Enable MFA',
      description: 'Your account is currently at high risk. Enable Multi-Factor Authentication immediately.',
      type: 'action',
      icon: Key,
      priority: 'high',
      actionLabel: 'Enable Now',
      onAction: onEnableMfa,
    });
  }

  if (trustScore < 60) {
    recommendations.push({
      id: 'low-trust',
      title: 'Review Recent Activity',
      description: 'Your trust score has dropped due to recent failed logins. Please review your activity log.',
      type: 'security',
      icon: ShieldAlert,
      priority: 'high',
      actionLabel: 'Review',
    });
  }

  recommendations.push({
    id: 'biometrics',
    title: 'Setup Biometric Login',
    description: 'Use your face or fingerprint for faster, more secure access across devices.',
    type: 'info',
    icon: Smartphone,
    priority: 'low',
    actionLabel: 'Configure',
  });

  const visibleRecommendations = recommendations.filter(r => !dismissed.includes(r.id)).slice(0, 3);

  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/30 to-purple-500/20 h-full">
      <div className="h-full rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 backdrop-blur-xl flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Recommendations
          </h3>
          <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {visibleRecommendations.length} Tasks
          </span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          <AnimatePresence>
            {visibleRecommendations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-8"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">All Clear</p>
                <p className="text-xs text-slate-500 mt-1">Your security posture is optimal.</p>
              </motion.div>
            ) : (
              visibleRecommendations.map((rec, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/30 hover:bg-slate-100 dark:bg-slate-800/60 hover:border-indigo-500/30 transition-all overflow-hidden"
                >
                  {/* Priority indicator line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />

                  <div className="flex items-start gap-3 ml-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      rec.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      <rec.icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{rec.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{rec.description}</p>
                      
                      {rec.actionLabel && (
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={rec.onAction}
                            className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                              rec.priority === 'high' ? 'text-red-400 hover:text-red-300' : 'text-indigo-400 hover:text-indigo-300'
                            }`}
                          >
                            {rec.actionLabel}
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button
                            onClick={() => setDismissed(prev => [...prev, rec.id])}
                            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
