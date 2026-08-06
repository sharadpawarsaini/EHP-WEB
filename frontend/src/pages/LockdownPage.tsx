import React from 'react';
import { ShieldAlert, Activity, Lock, Globe, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const LockdownPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-slate-900 dark:text-white">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      
      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-rose-600 to-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-rose-500/30 border-4 border-white dark:border-slate-900">
            <Lock className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-full flex items-center justify-center animate-ping">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase"
          >
            System <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500">Lockdown Active</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto"
          >
            The EHP platform is currently undergoing scheduled maintenance. <br/>
            <span className="text-rose-600 font-bold">Standard services are temporarily paused for system safety.</span>
          </motion.p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Patient Portal', status: 'Offline', color: 'text-rose-600' },
            { label: 'API Services', status: 'Paused', color: 'text-rose-600' },
            { label: 'Admin Security', status: 'Active', color: 'text-emerald-600' },
            { label: 'Emergency Bypass', status: 'Ready', color: 'text-blue-600' },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white/90 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-800 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
              <p className={`text-xs font-black uppercase tracking-wider ${item.color}`}>{item.status}</p>
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-12 border-t border-blue-100 dark:border-slate-800 flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3 text-slate-500">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest">EHP Maintenance Mode</span>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="btn-primary text-xs py-3.5 px-8"
          >
            Administrator Log In
          </button>
        </motion.div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-20 opacity-10">
        <Globe className="w-32 h-32 text-blue-600" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10">
        <Database className="w-32 h-32 text-blue-600" />
      </div>
    </div>
  );
};

export default LockdownPage;
