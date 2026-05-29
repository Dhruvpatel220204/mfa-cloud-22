import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Radar,
  Shield,
  BarChart3,
  Smartphone,
  Users,
  Brain,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const MENU_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'threats', label: 'Threat Monitor', icon: Radar },
  { id: 'mfa', label: 'MFA Security', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'devices', label: 'Devices', icon: Smartphone },
  { id: 'sessions', label: 'Sessions', icon: Activity },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar({ activeItem, onItemClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="hidden lg:flex flex-col h-full bg-slate-50 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/60 relative"
    >
      {/* Logo area */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-[1px] flex-shrink-0">
          <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white tracking-wider whitespace-nowrap">MFCA</div>
              <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">Security Panel</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 relative group
                ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/60 border border-transparent'
                }
              `}
            >
              {/* Active glow indicator */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-cyan-400"
                  style={{ boxShadow: '0 0 12px rgba(6,182,212,0.6)' }}
                />
              )}

              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]' : ''}`} />

              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/60">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800/60 text-xs transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
