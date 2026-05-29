import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Smartphone,
  KeyRound,
  Mail,
  Copy,
  CheckCircle2,
  ScanFace,
  Fingerprint,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface MFAToggleCardProps {
  enabled: boolean;
  backupCodes: string[];
  onToggle: (enabled: boolean) => void;
  onGenerateBackupCodes: () => void;
}

const MFA_METHODS = [
  {
    icon: Mail,
    label: 'Email OTP',
    description: 'One-time code via email',
    key: 'email',
  },
  {
    icon: Smartphone,
    label: 'Authenticator App',
    description: 'TOTP (Google Authenticator)',
    key: 'totp',
  },
  {
    icon: Fingerprint,
    label: 'SMS Verification',
    description: 'Code via text message',
    key: 'sms',
  },
  {
    icon: ScanFace,
    label: 'Biometric Login',
    description: 'Face or fingerprint',
    key: 'biometric',
  },
  {
    icon: KeyRound,
    label: 'Backup Codes',
    description: 'Emergency access codes',
    key: 'backup',
  },
  {
    icon: QrCode,
    label: 'Face Recognition',
    description: 'Advanced facial AI',
    key: 'face',
  },
];

export default function MFAToggleCard({
  enabled,
  backupCodes,
  onToggle,
  onGenerateBackupCodes,
}: MFAToggleCardProps) {
  const [showCodes, setShowCodes] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success('Code copied');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 h-full">
      <div className="h-full rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            MFA Security
          </h3>
        </div>

        {/* Master Toggle */}
        <div
          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 mb-5 ${
            enabled
              ? 'bg-emerald-500/[0.05] border-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                enabled
                  ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Shield
                className={`w-5 h-5 transition-colors ${
                  enabled ? 'text-emerald-400' : 'text-slate-500'
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">MFA Protection</p>
              <p className="text-xs text-slate-500">
                {enabled
                  ? 'Your account is protected'
                  : 'Enable for enhanced security'}
              </p>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>

        {/* MFA Methods */}
        <AnimatePresence>
          {enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Authentication Methods
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MFA_METHODS.map((method) => {
                  const isActive =
                    method.key === 'email' ||
                    (method.key === 'backup' && backupCodes.length > 0);

                  return (
                    <div
                      key={method.key}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-500/[0.04] border-emerald-500/15 hover:border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700/30 hover:border-slate-600'
                      }`}
                    >
                      <method.icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-white truncate">{method.label}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {method.description}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md flex-shrink-0 ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isActive ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Backup Codes */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Recovery Codes</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onGenerateBackupCodes}
                    className="text-xs border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
                  >
                    Generate
                  </Button>
                </div>

                {backupCodes.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCodes(!showCodes)}
                      className="mb-3 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      {showCodes ? 'Hide codes' : 'Show codes'}
                    </Button>
                    <AnimatePresence>
                      {showCodes && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-2 gap-2 overflow-hidden"
                        >
                          {backupCodes.map((code, i) => (
                            <button
                              key={i}
                              onClick={() => copyCode(code, i)}
                              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 hover:border-cyan-500/30 hover:text-slate-900 dark:text-white transition-colors"
                            >
                              <span>{code}</span>
                              {copiedIndex === i ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
