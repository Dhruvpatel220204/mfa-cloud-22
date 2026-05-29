import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Shield, Lock, Fingerprint, Smartphone, Eye, Globe, Server, Zap,
  ChevronRight, ShieldCheck, KeyRound, ScanFace, Activity, AlertTriangle,
  BarChart, Map as MapIcon, Database, CheckCircle2, Github, Twitter, Linkedin,
  Terminal, Cpu, Network, Radar, Crosshair, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

// Data for Analytics Chart
const chartData = [
  { time: '00:00', success: 4000, blocked: 240 },
  { time: '04:00', success: 3000, blocked: 139 },
  { time: '08:00', success: 2000, blocked: 980 },
  { time: '12:00', success: 2780, blocked: 390 },
  { time: '16:00', success: 1890, blocked: 480 },
  { time: '20:00', success: 2390, blocked: 380 },
  { time: '24:00', success: 3490, blocked: 430 },
];

const FEATURES = [
  { icon: Smartphone, title: 'OTP Verification', desc: 'Secure one-time passwords via SMS or Email.' },
  { icon: Fingerprint, title: 'Device Fingerprinting', desc: 'Identify devices with 99% accuracy.' },
  { icon: ScanFace, title: 'Face Recognition', desc: 'Biometric web-authn support.' },
  { icon: Cpu, title: 'AI Risk Detection', desc: 'Machine learning based anomaly detection.' },
  { icon: MapIcon, title: 'Geo-location Tracking', desc: 'Track and verify login locations.' },
  { icon: Activity, title: 'Session Monitoring', desc: 'Real-time active session controls.' },
  { icon: Lock, title: 'AES-256 Encryption', desc: 'Military grade data encryption.' },
  { icon: Radar, title: 'Threat Detection', desc: 'Instant alerts on suspicious activity.' },
  { icon: Network, title: 'Adaptive Auth', desc: 'Dynamic security based on risk score.' },
  { icon: Eye, title: 'Biometric Security', desc: 'Native OS biometric integrations.' },
];

const STATS = [
  { label: 'Threat Detection', value: '99.9%' },
  { label: 'Encryption', value: '256-bit' },
  { label: 'Secure Logins', value: '10K+' },
  { label: 'Authentication', value: '<1 sec' },
  { label: 'Monitoring', value: '24/7' },
];

const TIMELINE = [
  { title: 'User Login', desc: 'Initial credentials provided' },
  { title: 'Device Verification', desc: 'Checking known devices' },
  { title: 'Risk Analysis', desc: 'AI evaluates context' },
  { title: 'MFA Verification', desc: 'Prompt for second factor' },
  { title: 'Access Granted', desc: 'Secure session established' },
];

const COMPANIES = ['STRIPE', 'VERCEL', 'AUTH0', 'AWS', 'GOOGLE CLOUD', 'MICROSOFT', 'CLOUDFLARE', 'DATADOG'];
const TECH_STACK = ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS', 'JWT', 'TensorFlow', 'AWS'];

const NumberCounter = ({ value, suffix = '' }: { value: string, suffix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold cyber-gradient font-mono tracking-tight"
    >
      {value}{suffix}
    </motion.span>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    document.documentElement.classList.add('landing-route');
    return () => {
      document.documentElement.classList.remove('landing-route');
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02040a] text-slate-900 dark:text-slate-200 overflow-x-hidden font-sans selection:bg-cyan-500/30 transition-colors duration-300">
      <style>{`
        .cyber-gradient {
          background: linear-gradient(to right, #06b6d4, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .neon-glow { box-shadow: 0 0 20px rgba(6, 182, 212, 0.4); }
        .neon-glow-emerald { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
        .neon-glow-purple { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.5);
        }
        .dark .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-panel:hover {
          border-color: rgba(6, 182, 212, 0.3);
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.15);
        }
        
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 40s linear infinite; }
        
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
        .animate-pulse-ring { animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        .cyber-grid {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        /* Custom scrollbar for this page */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        .dark ::-webkit-scrollbar-track { background: #02040a; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
        .dark ::-webkit-scrollbar-thumb { background: #1e293b; }
      `}</style>

      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/10 dark:bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 dark:bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-[1px]">
              <div className="w-full h-full bg-white dark:bg-[#02040a] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-white">MFCA</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            {['Features', 'Security', 'Dashboard', 'Analytics'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 hidden sm:inline-flex" onClick={() => navigate('/auth')}>
              Login
            </Button>
            {/* The global ThemeToggle is on the page, so we don't need a custom mode switch button here. */}
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-semibold border-none neon-glow transition-all"
            >
              Get Started <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="flex-1 text-center lg:text-left"
              style={{ y: yHero }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-cyan-600 dark:text-cyan-400 text-xs font-mono mb-8 border-cyan-500/30"
              >
                <Lock className="w-3 h-3" /> ENTERPRISE GRADE SECURITY
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 text-slate-900 dark:text-white tracking-tight"
              >
                Multi Factor <br />
                <span className="cyber-gradient">Cloud Authentication</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                Secure your infrastructure with AI-driven adaptive authentication, 
                real-time threat detection, and seamless biometric verification. 
                Built for the modern enterprise.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Button size="lg" onClick={() => navigate('/auth')} className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-bold px-8 h-14 rounded-xl neon-glow transition-all">
                  Launch Dashboard <Zap className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto h-14 px-8 rounded-xl border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white text-slate-700 dark:text-slate-300">
                  Explore Features <Eye className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex-1 relative animate-float w-full max-w-lg mx-auto"
            >
              <div className="relative w-full aspect-square">
                {/* Glowing Background Rings */}
                <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-pulse-ring" />
                <div className="absolute inset-8 border border-emerald-500/20 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-16 border border-purple-500/20 rounded-full animate-pulse-ring" style={{ animationDelay: '2s' }} />
                
                {/* Core Shield */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-3xl backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center neon-glow rotate-45">
                    <Shield className="w-24 h-24 text-cyan-500 dark:text-cyan-400 -rotate-45 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-10 left-10 glass-panel p-3 rounded-2xl">
                  <Fingerprint className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                </motion.div>
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-20 right-10 glass-panel p-3 rounded-2xl">
                  <ScanFace className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </motion.div>
                <motion.div animate={{ x: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 4.5 }} className="absolute top-1/2 -left-4 glass-panel p-3 rounded-2xl">
                  <Lock className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-10 border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/20 overflow-hidden">
          <div className="container mx-auto px-6 text-center mb-8">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Trusted by innovative teams worldwide</p>
          </div>
          <div className="relative w-full overflow-hidden flex whitespace-nowrap">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-slate-50 dark:from-[#02040a] to-transparent z-10" />
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-slate-50 dark:from-[#02040a] to-transparent z-10" />
            
            <div className="animate-marquee flex gap-16 items-center px-8">
              {[...COMPANIES, ...COMPANIES].map((company, i) => (
                <div key={i} className="text-xl md:text-2xl font-bold text-slate-400 dark:text-slate-600 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Security Stats */}
        <section className="py-24 container mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-panel p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="mb-2">
                  <NumberCounter value={stat.value} />
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
                Next-Gen <span className="cyber-gradient">Security Features</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Comprehensive identity protection combining cryptographic security with AI-powered contextual analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="glass-panel p-6 rounded-2xl group cursor-default"
                  >
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 group-hover:neon-glow transition-all duration-300 border border-cyan-500/20">
                      <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
              Seamless <span className="cyber-gradient">Authentication Flow</span>
            </h2>
          </div>
          
          <div className="relative max-w-5xl mx-auto hidden md:block">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                whileInView={{ x: '100%' }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-4 relative z-10">
              {TIMELINE.map((step, i) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-[#02040a] border-2 border-cyan-500/30 flex items-center justify-center mb-4 neon-glow z-10 text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                    0{i + 1}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
            {TIMELINE.map((step, i) => (
              <div key={step.title} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-cyan-500 bg-white dark:bg-[#02040a] text-cyan-600 dark:text-cyan-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10 font-mono text-sm">
                  {i+1}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Preview & AI Threat Detection */}
        <section id="dashboard" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
                Enterprise <span className="cyber-gradient">Command Center</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Dashboard Mockup */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 flex flex-col"
              >
                {/* Mockup Header */}
                <div className="h-12 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="ml-4 text-xs font-mono text-slate-500">dashboard.mfca.app</div>
                </div>
                <div className="p-6 flex-1 bg-white dark:bg-[#050B14] relative">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Security Overview</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Real-time authentication metrics</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">98/100</div>
                      <div className="text-xs text-slate-500 uppercase">Trust Score</div>
                    </div>
                  </div>
                  
                  {/* Recharts Chart */}
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: 'var(--tw-colors-slate-900, #0f172a)', border: '1px solid var(--tw-colors-slate-700, #334155)', borderRadius: '8px' }}
                          itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Area type="monotone" dataKey="success" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" />
                        <Area type="monotone" dataKey="blocked" stroke="#ef4444" fillOpacity={1} fill="url(#colorBlocked)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* AI Threat Panel */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-panel rounded-2xl p-6 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-purple-500" />
                <div className="flex items-center gap-3 mb-6">
                  <Radar className="w-6 h-6 text-red-500 dark:text-red-400" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Threat Feed</h3>
                </div>

                <div className="space-y-4 flex-1">
                  {[
                    { type: 'Brute Force Attempt', loc: 'Moscow, RU', time: 'Just now', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                    { type: 'Suspicious VPN', loc: 'Frankfurt, DE', time: '2m ago', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
                    { type: 'Device Anomaly', loc: 'Tokyo, JP', time: '15m ago', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                    { type: 'Login Success', loc: 'New York, US', time: '22m ago', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                  ].map((alert, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${alert.border} ${alert.bg} flex items-center justify-between`}>
                      <div>
                        <div className={`text-sm font-semibold ${alert.color}`}>{alert.type}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{alert.loc}</div>
                      </div>
                      <div className="text-xs text-slate-500">{alert.time}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> AI Monitoring Active
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive World Map (Simulated) */}
        <section className="py-24 relative hidden md:block">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-slate-900 dark:text-white tracking-tight">
              Global <span className="cyber-gradient">Identity Intelligence</span>
            </h2>
            <div className="relative max-w-4xl mx-auto h-[400px] glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-[#030712]">
              {/* CSS Map Simulation using dots */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #06b6d4 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              <Globe className="w-full h-full text-slate-300 dark:text-slate-800/50 p-10 opacity-50 dark:opacity-30" strokeWidth={0.5} />
              
              {/* Pulse Points */}
              {[
                { top: '30%', left: '20%' }, // US
                { top: '40%', left: '25%' }, // US
                { top: '25%', left: '50%' }, // EU
                { top: '35%', left: '75%' }, // Asia
                { top: '60%', left: '80%' }, // AU
              ].map((pos, i) => (
                <div key={i} className="absolute" style={pos}>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 z-10 relative" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-cyan-500/50 dark:border-cyan-400/50 animate-pulse-ring" />
                  </div>
                </div>
              ))}
              {/* Attack Line Simulation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path d="M 200 120 Q 300 50 450 100" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                <path d="M 450 100 Q 600 150 700 140" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
              Enterprise <span className="cyber-gradient">Trust</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Jenkins', role: 'CISO, FinTech Global', quote: 'MFCA completely eliminated our account takeover attempts within the first month. The AI detection is phenomenally accurate.' },
              { name: 'David Chen', role: 'VP Engineering, CloudScale', quote: 'Integration took less than a day. The dynamic risk scoring allowed us to remove friction for trusted users while maintaining high security.' },
              { name: 'Elena Rodriguez', role: 'Security Architect, HealthPlus', quote: 'The biometric integrations and compliance out-of-the-box saved our team months of development time. Exceptional product.' }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-2xl relative"
              >
                <div className="flex text-emerald-500 dark:text-emerald-400 mb-6 gap-1">
                  {[...Array(5)].map((_, j) => <CheckCircle2 key={j} className="w-4 h-4 fill-emerald-500/20 dark:fill-emerald-400/20" />)}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-8 italic">"{review.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-cyan-600 dark:text-cyan-400">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{review.name}</div>
                    <div className="text-xs text-slate-500">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Marquee */}
        <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#010206]">
          <div className="container mx-auto px-6 text-center flex items-center justify-center gap-4 mb-8">
            <Terminal className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">Powered by modern tech</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-marquee flex gap-20 px-10">
              {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                <div key={i} className="text-lg font-mono font-semibold text-slate-400 dark:text-slate-600">
                  &lt;{tech} /&gt;
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 container mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl" />
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white relative z-10">
              Secure Your <span className="cyber-gradient">Cloud Identity</span> Today
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of enterprises that trust MFCA for their authentication and identity management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button size="lg" onClick={() => navigate('/auth')} className="bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-bold px-10 h-14 rounded-xl neon-glow">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="h-14 px-10 rounded-xl border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Premium Footer */}
        <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#02040a] pt-16 pb-8 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xl font-bold text-slate-900 dark:text-white tracking-wider">MFCA</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                  Enterprise-grade multi-factor authentication platform designed for modern cloud infrastructure and applications.
                </p>
                <div className="flex gap-4">
                  <Github className="w-5 h-5 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors" />
                  <Twitter className="w-5 h-5 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors" />
                  <Linkedin className="w-5 h-5 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors" />
                </div>
              </div>
              
              <div>
                <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Features</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Security</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Pricing</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Changelog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Developers</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Documentation</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">API Reference</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">SDKs</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Status</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">About</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Blog</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Careers</a></li>
                  <li><a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} MFCA Security. All rights reserved.
              </p>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Lock className="w-3 h-3" /> SOC2 Type II
                </span>
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <ShieldCheck className="w-3 h-3" /> GDPR Compliant
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
