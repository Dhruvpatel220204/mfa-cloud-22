import { motion } from 'framer-motion';
import { FileText, Download, AlertTriangle, ShieldAlert, Calendar, MapPin, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThreatReportProps {
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

export default function ReportsPanel({ failedAttempts }: ThreatReportProps) {
  const downloadCSV = () => {
    // Basic CSV generation
    const headers = ['Date', 'Risk Level', 'Reason', 'IP Address', 'Browser', 'OS'];
    const rows = failedAttempts.map(attempt => [
      new Date(attempt.created_at).toISOString(),
      attempt.risk_level.toUpperCase(),
      attempt.failure_reason || 'Unknown',
      attempt.ip_address || 'Unknown',
      attempt.browser || 'Unknown',
      attempt.os || 'Unknown'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(String).map(s => `"${s.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `threat_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-red-500/30 to-orange-500/20">
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/60 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-[1px]">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-red-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Threats & Failed Attempts</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  Security Incident Report
                </p>
              </div>
            </div>

            <Button
              onClick={downloadCSV}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Incidents</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{failedAttempts.length}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">High Risk</p>
              <p className="text-2xl font-bold text-red-400 font-mono">
                {failedAttempts.filter(a => a.risk_level === 'high' || a.risk_level === 'critical').length}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Last 24 Hours</p>
              <p className="text-2xl font-bold text-orange-400 font-mono">
                {failedAttempts.filter(a => (Date.now() - new Date(a.created_at).getTime()) < 86400000).length}
              </p>
            </div>
          </div>

          {/* List of threats */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">Detailed Incident Log</h3>
            
            {failedAttempts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-white dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800/60">
                No threats or failed attempts recorded.
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {failedAttempts.map((attempt, index) => (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.02] flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className={`w-4 h-4 ${attempt.risk_level === 'critical' ? 'text-red-500' : 'text-orange-400'}`} />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {attempt.failure_reason || 'Suspicious Login Attempt'}
                        </span>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                          attempt.risk_level === 'critical' 
                            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        }`}>
                          {attempt.risk_level}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(attempt.created_at).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {attempt.ip_address || 'Unknown IP'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5" />
                          {attempt.browser || 'Unknown'} / {attempt.os || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
