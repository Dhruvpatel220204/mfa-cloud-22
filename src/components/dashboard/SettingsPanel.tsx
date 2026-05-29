import { motion } from 'framer-motion';
import { User, Mail, Lock, LogOut, Save, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingsPanelProps {
  userEmail: string;
  displayName: string;
  newEmail: string;
  setNewEmail: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  handleSaveCredentials: () => void;
  savingCredentials: boolean;
  onSignOut: () => void;
}

export default function SettingsPanel({
  userEmail,
  displayName,
  newEmail,
  setNewEmail,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleSaveCredentials,
  savingCredentials,
  onSignOut,
}: SettingsPanelProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 to-purple-500/20">
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800/60 pb-6 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-[1px]">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{displayName || userEmail.split('@')[0]}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Enterprise Admin
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                Account Email
              </h3>
              <div className="space-y-1.5">
                <Label htmlFor="settings-email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50 focus:border-cyan-500/50 focus:ring-cyan-500/50 text-slate-200"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 space-y-4">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Security & Password
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="settings-password" className="text-slate-700 dark:text-slate-300">New Password</Label>
                  <Input
                    id="settings-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50 focus:border-purple-500/50 focus:ring-purple-500/50 text-slate-200"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="settings-password-confirm" className="text-slate-700 dark:text-slate-300">Confirm Password</Label>
                  <Input
                    id="settings-password-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50 focus:border-purple-500/50 focus:ring-purple-500/50 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={onSignOut}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-500/30 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              
              <Button 
                onClick={handleSaveCredentials} 
                disabled={savingCredentials}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 dark:text-white border-0 shadow-lg shadow-cyan-500/20"
              >
                <Save className="w-4 h-4 mr-2" />
                {savingCredentials ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
