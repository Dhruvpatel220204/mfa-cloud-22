import { motion } from 'framer-motion';
import { Smartphone, Monitor, Tablet, Shield, ShieldOff, Trash2, Ban, MapPin, Clock, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Device {
  id: string;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  trust_score: number;
  is_trusted: boolean;
  last_seen: string;
  location?: string | null;
}

interface DevicesCardProps {
  devices: Device[];
  onRemoveDevice: (id: string) => void;
  onToggleTrust: (id: string, trusted: boolean) => void;
}

function getDeviceIcon(os: string | null) {
  if (!os) return Monitor;
  const lower = os.toLowerCase();
  if (lower.includes('android') || lower.includes('ios')) return Smartphone;
  if (lower.includes('ipad')) return Tablet;
  return Monitor;
}

export default function DevicesCard({ devices, onRemoveDevice, onToggleTrust }: DevicesCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-violet-500/30 to-cyan-500/20">
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Device Management
          </h3>
          <span className="text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {devices.length} devices
          </span>
        </div>

        <div className="space-y-3">
          {devices.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-12">
              No devices registered yet
            </p>
          ) : (
            devices.map((device, index) => {
              const Icon = getDeviceIcon(device.os);
              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    device.is_trusted
                      ? 'bg-emerald-500/[0.03] border-emerald-500/15 hover:border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {/* Device icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      device.is_trusted
                        ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        device.is_trusted ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {device.browser || 'Unknown Browser'}
                      </span>
                      <span className="text-xs text-slate-600">on</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                        {device.os || 'Unknown OS'}
                      </span>
                      {device.is_trusted && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                          Trusted
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3" />
                        {device.ip_address || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Shield className="w-3 h-3" />
                        Score: {device.trust_score}/100
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(device.last_seen).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-lg ${
                        device.is_trusted
                          ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                          : 'text-slate-500 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'
                      }`}
                      onClick={() => onToggleTrust(device.id, !device.is_trusted)}
                      title={device.is_trusted ? 'Revoke trust' : 'Mark as trusted'}
                    >
                      {device.is_trusted ? (
                        <Shield className="w-4 h-4" />
                      ) : (
                        <ShieldOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => onRemoveDevice(device.id)}
                      title="Remove device"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
