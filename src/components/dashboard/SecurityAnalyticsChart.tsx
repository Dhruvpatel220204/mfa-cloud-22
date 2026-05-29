import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface SecurityAnalyticsProps {
  totalLogins: number;
  failedLogins: number;
  loginAttempts: Array<{
    success: boolean;
    created_at: string;
    risk_level: string;
  }>;
}

const TABS = [
  { id: 'activity', label: 'Activity', icon: TrendingUp },
  { id: 'threats', label: 'Threats', icon: AlertTriangle },
  { id: 'overview', label: 'Overview', icon: BarChart3 },
];

export default function SecurityAnalyticsChart({
  totalLogins,
  failedLogins,
  loginAttempts,
}: SecurityAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('activity');

  // Build hourly activity data from login attempts
  const hourlyData = buildHourlyData(loginAttempts);
  const weeklyData = buildWeeklyData(loginAttempts);

  const successRate = totalLogins > 0 ? Math.round(((totalLogins - failedLogins) / totalLogins) * 100) : 0;

  const pieData = [
    { name: 'Success', value: totalLogins - failedLogins, color: '#10b981' },
    { name: 'Failed', value: failedLogins, color: '#ef4444' },
  ];

  const riskDistribution = [
    { level: 'Low', count: loginAttempts.filter((a) => a.risk_level === 'low').length, color: '#10b981' },
    { level: 'Medium', count: loginAttempts.filter((a) => a.risk_level === 'medium').length, color: '#f59e0b' },
    { level: 'High', count: loginAttempts.filter((a) => a.risk_level === 'high').length, color: '#ef4444' },
    { level: 'Critical', count: loginAttempts.filter((a) => a.risk_level === 'critical').length, color: '#dc2626' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/30 to-cyan-500/20">
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 backdrop-blur-xl">
        {/* Header + Tabs */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Security Analytics
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200 dark:border-slate-700/50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-500 hover:text-slate-900 dark:text-white border border-transparent'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart area */}
        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="chartSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="chartFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                  }}
                  itemStyle={{ color: '#e2e8f0', fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                />
                <Area
                  type="monotone"
                  dataKey="success"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#chartSuccess)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#chartFailed)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {activeTab === 'threats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="level" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                  }}
                  itemStyle={{ color: '#e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-72 flex items-center justify-center gap-8"
          >
            {/* Pie chart */}
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-28">
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{successRate}%</div>
                <div className="text-[10px] text-slate-500 uppercase">Success Rate</div>
              </div>
            </div>

            {/* Mini Stats */}
            <div className="space-y-4">
              {[
                { label: 'Total Logins', value: totalLogins, color: 'text-cyan-400' },
                { label: 'Successful', value: totalLogins - failedLogins, color: 'text-emerald-400' },
                { label: 'Failed', value: failedLogins, color: 'text-red-400' },
                { label: 'Success Rate', value: `${successRate}%`, color: 'text-blue-400' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color.includes('cyan') ? '#06b6d4' : stat.color.includes('emerald') ? '#10b981' : stat.color.includes('red') ? '#ef4444' : '#3b82f6' }} />
                  <span className="text-xs text-slate-500 w-24">{stat.label}</span>
                  <span className={`text-sm font-mono font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom legend */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Successful</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full bg-red-500" />
            <span className="text-xs text-slate-500">Failed</span>
          </div>
          <div className="flex-1" />
          <span className="text-[10px] text-slate-600 font-mono">Updated in real-time</span>
        </div>
      </div>
    </div>
  );
}

// Helper: group login attempts into hourly buckets
function buildHourlyData(attempts: Array<{ success: boolean; created_at: string }>) {
  const hours: Record<string, { success: number; failed: number }> = {};
  for (let h = 0; h < 24; h += 4) {
    const label = `${String(h).padStart(2, '0')}:00`;
    hours[label] = { success: 0, failed: 0 };
  }
  attempts.forEach((a) => {
    const hour = new Date(a.created_at).getHours();
    const bucket = Math.floor(hour / 4) * 4;
    const label = `${String(bucket).padStart(2, '0')}:00`;
    if (hours[label]) {
      if (a.success) hours[label].success++;
      else hours[label].failed++;
    }
  });
  return Object.entries(hours).map(([time, data]) => ({ time, ...data }));
}

function buildWeeklyData(attempts: Array<{ success: boolean; created_at: string }>) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const buckets: Record<string, { success: number; failed: number }> = {};
  days.forEach((d) => (buckets[d] = { success: 0, failed: 0 }));
  attempts.forEach((a) => {
    const day = days[new Date(a.created_at).getDay()];
    if (a.success) buckets[day].success++;
    else buckets[day].failed++;
  });
  return days.map((d) => ({ day: d, ...buckets[d] }));
}
