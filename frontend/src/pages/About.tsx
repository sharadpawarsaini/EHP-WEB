import { motion } from 'framer-motion';
import { Shield, Users, Heart, CheckCircle, ArrowLeft, Activity, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-500 overflow-x-hidden text-slate-900 dark:text-white">
      
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-sky-400/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl border-b border-blue-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-sky-400 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">EHP</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
            <ArrowLeft className="h-4 w-4" /> Go to Home
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-3 bg-blue-500/10 px-6 py-2.5 rounded-full border border-blue-500/20 mb-8">
               <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
               <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">About Electronic Health Passport</span>
            </div>
            <h1 className="text-4xl sm:text-7xl font-black tracking-tight mb-8 text-slate-900 dark:text-white">
              Saving Lives With Instant Medical Access
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto font-medium">
              EHP bridges the gap between emergency responders and your critical health records. When seconds count, EHP ensures paramedics, doctors, and loved ones have instant access to life-saving medical data.
            </p>
          </motion.div>

          {/* Mission Card */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-blue-100 dark:border-slate-800 rounded-[3rem] p-8 sm:p-16 relative overflow-hidden shadow-sm mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-blue-100 dark:border-slate-700 space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Patient First</h3>
                <p className="text-xs text-slate-500 font-medium">Designed for simple, effortless emergency access for individuals and families worldwide.</p>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-blue-100 dark:border-slate-700 space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bank-Grade Encryption</h3>
                <p className="text-xs text-slate-500 font-medium">Protected with strict AES-256 encryption standards. You own and control your data.</p>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-blue-100 dark:border-slate-700 space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Universal Accessibility</h3>
                <p className="text-xs text-slate-500 font-medium">Scan QR codes or tap NFC tags from any smartphone camera instantly without apps.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-blue-100 dark:border-slate-800 py-12 text-center">
         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">&copy; {new Date().getFullYear()} EHP ELECTRONIC HEALTH PASSPORT</p>
      </footer>
    </div>
  );
};

export default About;
