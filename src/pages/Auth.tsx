import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, Mail, User, KeyRound, RefreshCw, ShieldAlert, ChevronLeft } from 'lucide-react';
import { useTenantTheme } from '@/hooks/useTenantTheme';

const GRID_BG = {
  backgroundImage:
    'linear-gradient(hsl(160 84% 39% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.3) 1px, transparent 1px)',
  backgroundSize: '60px 60px',
};

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTenantTheme();

  // OTP state
  const [showOTP, setShowOTP] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(60);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [fallbackOTP, setFallbackOTP] = useState<string | null>(null);

  // Recovery code state
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryVerifying, setRecoveryVerifying] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('auth-route');
    return () => document.documentElement.classList.remove('auth-route');
  }, []);

  useEffect(() => {
    if (!showOTP || otpExpiry <= 0) return;
    const timer = setInterval(() => setOtpExpiry(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [showOTP, otpExpiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          // Check if user has MFA enabled
          const { data: session } = await supabase.auth.getSession();
          const userId = session?.session?.user?.id;
          let mfaEnabled = false;
          if (userId) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('mfa_enabled')
              .eq('user_id', userId)
              .single();
            mfaEnabled = profile?.mfa_enabled || false;
          }

          if (mfaEnabled) {
            // MFA enabled → show OTP step
            setFallbackOTP(null);
            const { error: otpError } = await supabase.auth.signInWithOtp({ email });
            
            if (otpError) {
              if (otpError.message.toLowerCase().includes('rate limit')) {
                // Fallback for development/testing
                const otp = generateOTP();
                setFallbackOTP(otp);
                console.log('⚠️ Supabase Rate Limit Exceeded!');
                console.log('====================================');
                console.log(`🔑 FALLBACK OTP CODE: ${otp}`);
                console.log('====================================');
                toast.warning('Rate limit exceeded! Check browser console for your fallback code.');
              } else {
                toast.error(otpError.message);
                return;
              }
            } else {
              toast.success('Credentials verified. OTP sent to your email.');
            }
            
            setEnteredOTP('');
            setOtpExpiry(60);
            setShowOTP(true);
          } else {
            // MFA disabled → direct login
            toast.success('Login successful!');
            navigate('/');
          }
        }
      } else {
        const { error, session } = await signUp(email, password, displayName);
        if (error) {
          toast.error(error.message);
        } else {
          // If email confirmations are disabled in Supabase, session exists immediately.
          if (session) {
            toast.success('Account created! You are now signed in.');
            navigate('/');
          } else {
            toast.success('Account created! Please sign in.');
            setIsLogin(true);
            setPassword('');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    setOtpVerifying(true);
    
    // Check fallback first
    if (fallbackOTP) {
      if (enteredOTP === fallbackOTP) {
        toast.success('Fallback OTP verified! Logging in…');
        setTimeout(() => navigate('/'), 800);
      } else {
        toast.error('Invalid fallback OTP. Please try again.');
        setEnteredOTP('');
        setOtpVerifying(false);
      }
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: enteredOTP,
      type: 'email'
    });
    
    if (error) {
      toast.error('Invalid OTP. Please try again.');
      setEnteredOTP('');
      setOtpVerifying(false);
    } else {
      toast.success('OTP verified! Logging in…');
      setTimeout(() => navigate('/'), 800);
    }
  };

  const handleResendOTP = async () => {
    setFallbackOTP(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        const otp = generateOTP();
        setFallbackOTP(otp);
        console.log('⚠️ Supabase Rate Limit Exceeded!');
        console.log('====================================');
        console.log(`🔑 NEW FALLBACK OTP CODE: ${otp}`);
        console.log('====================================');
        toast.warning('Rate limit exceeded! Check browser console for your new fallback code.');
      } else {
        toast.error(error.message);
        return;
      }
    } else {
      toast.info('New OTP sent to your email.');
    }
    setEnteredOTP('');
    setOtpExpiry(60);
  };

  const handleRecoveryCodeVerify = async () => {
    setRecoveryVerifying(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (!userId) {
        toast.error('Session expired. Please log in again.');
        setShowOTP(false);
        setUseRecoveryCode(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('backup_codes')
        .eq('user_id', userId)
        .single();

      const codes: string[] = profile?.backup_codes || [];
      const normalizedInput = recoveryCode.trim().toUpperCase();
      const matchIndex = codes.findIndex(c => c === normalizedInput);

      if (matchIndex === -1) {
        toast.error('Invalid recovery code. Please try again.');
        setRecoveryCode('');
        return;
      }

      // Remove used code
      const updatedCodes = codes.filter((_, i) => i !== matchIndex);
      await supabase
        .from('profiles')
        .update({ backup_codes: updatedCodes })
        .eq('user_id', userId);

      toast.success(`Recovery code accepted! ${updatedCodes.length} codes remaining.`);
      setTimeout(() => navigate('/'), 800);
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setRecoveryVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground scan-line flex flex-col">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={GRID_BG} aria-hidden />

      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/landing')}
            className="flex items-center gap-3 min-w-0 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-lg font-bold text-foreground truncate">{theme.brandName}</h1>
              <p className="text-xs text-muted-foreground truncate">{theme.tagline}</p>
            </div>
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/landing')} className="gap-1 text-muted-foreground shrink-0">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-6"
              animate={{
                boxShadow: [
                  '0 0 15px hsl(160 84% 39% / 0.08)',
                  '0 0 28px hsl(160 84% 39% / 0.15)',
                  '0 0 15px hsl(160 84% 39% / 0.08)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Lock className="w-3 h-3" /> Secure Access
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              {isLogin && !showOTP ? (
                <>
                  Sign In to
                  <br />
                  <span className="gradient-text">Your Account</span>
                </>
              ) : !showOTP ? (
                <>
                  Create
                  <br />
                  <span className="gradient-text">Your Account</span>
                </>
              ) : (
                <span className="gradient-text">Verification</span>
              )}
            </h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-sm mx-auto">{theme.content.authTagline}</p>
          </div>

          <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            {!showOTP ? (
              <motion.div key="login-form" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
                {/* Tab toggle */}
                <div className="flex mb-6 rounded-lg bg-muted/50 p-1 border border-border">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      isLogin ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      !isLogin ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <Label htmlFor="name" className="text-foreground">Display Name</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="pl-10 bg-background/50 border-border"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background/50 border-border"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-background/50 border-border"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>{isLogin ? 'Sign In' : 'Create Account'}</>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 flex items-center gap-2 border-border bg-background/50"
                  onClick={async () => {
                    try {
                      const redirectTo = `${window.location.origin}/auth/callback`;
                      const { data, error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: { redirectTo },
                      });

                      if (error) {
                        toast.error(error.message || 'Google sign-in failed');
                        return;
                      }

                      // In most browsers Supabase redirects automatically.
                      // Keep this fallback for environments where auto-redirect is blocked.
                      if (data?.url) {
                        window.location.assign(data.url);
                        return;
                      }

                      toast.error('Google sign-in did not start. Check Supabase Google provider settings.');
                    } catch (err) {
                      const message = err instanceof Error ? err.message : 'Google sign-in failed';
                      toast.error(message);
                    }
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">Protected by multi-factor authentication</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  {!useRecoveryCode ? (
                    <motion.div key="otp-input" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      {/* OTP Header */}
                      <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                          <KeyRound className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">OTP Verification</h2>
                        <p className="text-xs text-muted-foreground">
                          Enter the 6-digit code displayed below to verify your identity
                        </p>
                      </div>

                      {/* OTP Status Display */}
                      <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center"
                      >
                        <p className="text-sm font-medium text-foreground mb-2">Check your email</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          We've sent a 6-digit verification code to {email}
                        </p>
                        <div className="flex items-center justify-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${otpExpiry > 0 ? 'bg-primary' : 'bg-destructive'}`} />
                          <span className={`text-xs font-mono ${otpExpiry <= 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {otpExpiry > 0 ? `Code expires in ${otpExpiry}s` : 'Code expired'}
                          </span>
                        </div>
                      </motion.div>

                      {/* OTP Input */}
                      <div className="flex flex-col items-center gap-4">
                        <InputOTP maxLength={6} value={enteredOTP} onChange={setEnteredOTP}>
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="w-11 h-12 border-border bg-background/50 text-lg font-mono" />
                            <InputOTPSlot index={1} className="w-11 h-12 border-border bg-background/50 text-lg font-mono" />
                            <InputOTPSlot index={2} className="w-11 h-12 border-border bg-background/50 text-lg font-mono" />
                            <InputOTPSlot index={3} className="w-11 h-12 border-border bg-background/50 text-lg font-mono" />
                            <InputOTPSlot index={4} className="w-11 h-12 border-border bg-background/50 text-lg font-mono" />
                            <InputOTPSlot index={5} className="w-11 h-12 border-border bg-background/50 text-lg font-mono" />
                          </InputOTPGroup>
                        </InputOTP>

                        <Button variant="hero" className="w-full h-11" onClick={handleOTPVerify} disabled={enteredOTP.length !== 6 || otpExpiry <= 0 || otpVerifying}>
                          {otpVerifying ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : 'Verify OTP'}
                        </Button>

                        <div className="flex flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => { setUseRecoveryCode(true); setRecoveryCode(''); }}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ShieldAlert className="w-3 h-3" /> Use recovery code instead
                          </button>
                          <div className="flex items-center gap-4">
                            <button type="button" onClick={handleResendOTP} className="text-xs text-primary hover:underline flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" /> Regenerate Code
                            </button>
                            <button type="button" onClick={() => { setShowOTP(false); setEnteredOTP(''); }} className="text-xs text-muted-foreground hover:text-foreground">
                              ← Back to login
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">OTP is sent to your registered email address</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="recovery-input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                      {/* Recovery Header */}
                      <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-amber-500/25 bg-amber-500/10">
                          <ShieldAlert className="w-6 h-6 text-amber-500" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">Recovery Code</h2>
                        <p className="text-xs text-muted-foreground">
                          Enter one of your backup recovery codes (e.g. ABCD-EF12)
                        </p>
                      </div>

                      {/* Recovery Code Input */}
                      <div className="flex flex-col items-center gap-4">
                        <Input
                          type="text"
                          placeholder="XXXX-XXXX"
                          value={recoveryCode}
                          onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                          className="text-center text-lg font-mono tracking-widest bg-background/50 border-border"
                          maxLength={9}
                        />

                        <Button variant="hero" className="w-full h-11" onClick={handleRecoveryCodeVerify} disabled={recoveryCode.length < 9 || recoveryVerifying}>
                          {recoveryVerifying ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : 'Verify Recovery Code'}
                        </Button>

                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => { setUseRecoveryCode(false); setRecoveryCode(''); }}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <KeyRound className="w-3 h-3" /> Back to OTP
                          </button>
                          <button type="button" onClick={() => { setShowOTP(false); setUseRecoveryCode(false); setEnteredOTP(''); }} className="text-xs text-muted-foreground hover:text-foreground">
                            ← Back to login
                          </button>
                        </div>
                      </div>

                      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
                        <p className="text-[10px] text-amber-500">
                          ⚠ Each recovery code can only be used once. Generate new codes from the dashboard after use.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-muted border border-border text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-primary" /> 256-bit SSL
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-muted border border-border text-muted-foreground flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-primary" /> MFA Protected
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
