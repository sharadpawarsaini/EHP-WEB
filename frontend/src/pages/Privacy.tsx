import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft, Activity, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
               <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
               <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Privacy Policy</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Your Privacy Comes First</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
              We believe your medical privacy is a fundamental human right. Your records belong strictly to you.
            </p>
          </motion.div>

          <div className="space-y-8">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Data Encryption
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm">
                All health records uploaded to EHP are protected using strong AES-256 encryption. We never sell your personal information or medical data to third parties.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" /> What First Responders See
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm">
                When a paramedic or doctor scans your Emergency QR code, they only see vital emergency data: your blood group, allergies, chronic conditions, and emergency contacts.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Your Data Rights
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm">
                You maintain complete control over your account. You can view, edit, download, or delete your health profile at any time in your dashboard settings.
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

export default Privacy;
