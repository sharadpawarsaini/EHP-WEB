import { motion } from 'framer-motion';
import { Shield, FileText, ArrowLeft, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
        <div className="max-w-4xl mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-blue-500/10 px-6 py-2.5 rounded-full border border-blue-500/20 mb-8">
               <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
               <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Terms of Service</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Terms of Service</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
              Please read these simple terms before using the Electronic Health Passport platform.
            </p>
          </motion.div>

          <div className="space-y-8">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm">
                By creating an account or using EHP, you agree to these terms. If you do not agree, you may delete your account at any time.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Medical Disclaimer</h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm">
                EHP is an emergency health record manager and informational platform. EHP does not provide direct medical treatment or replace professional medical advice. Always call emergency services (like 911/112) in life-threatening situations.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. User Responsibility</h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm">
                You are responsible for keeping your emergency profile details (blood group, allergies, emergency contacts) accurate and up-to-date.
              </p>
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

export default Terms;
