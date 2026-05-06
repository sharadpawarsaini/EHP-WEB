import React from 'react';
import { ShieldAlert, Activity, Lock, Globe, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const LockdownPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      
      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 bg-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(244,63,94,0.4)] border-4 border-zinc-950">
            <Lock className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-zinc-950 border-2 border-rose-500 rounded-full flex items-center justify-center animate-ping">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
        </motion.div>

        <div className="space-y-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl sm:text-9xl font-black text-white tracking-tighter uppercase leading-none"
          >
            System <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">Lockdown</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-[36pt] text-zinc-400 font-black uppercase tracking-tight max-w-3xl mx-auto leading-tight"
          >
            The EHP Neural Grid is currently under administrative maintenance. <br/>
            <span className="text-rose-500">All clinical nodes are offline.</span>
          </motion.p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {[
            { label: 'Neural Sync', status: 'Offline', color: 'text-rose-500' },
            { label: 'Uplink', status: 'Blocked', color: 'text-rose-500' },
            { label: 'Admin Port', status: 'Active', color: 'text-emerald-500' },
            { label: 'Emergency', status: 'Bypass', color: 'text-cyan-500' },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2rem] backdrop-blur-xl shadow-2xl">
              <p className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-3">{item.label}</p>
              <p className={`text-2xl font-black uppercase tracking-tighter ${item.color}`}>{item.status}</p>
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-16 border-t border-white/5 flex flex-col items-center gap-10"
        >
          <div className="flex items-center gap-5 text-zinc-500">
            <Activity className="w-8 h-8 text-rose-500" />
            <span className="text-xl font-black uppercase tracking-[0.5em]">Protocol: NEXUS_MAINTENANCE_v2</span>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="px-16 py-8 bg-white/5 hover:bg-white text-white hover:text-zinc-950 border border-white/10 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.4em] transition-all shadow-2xl hover:scale-105"
          >
            Administrator Entry
          </button>
        </motion.div>
      </div>

      {/* Floating Artifacts */}
      <div className="absolute top-20 left-20 opacity-10 animate-bounce-slow">
        <Globe className="w-32 h-32 text-rose-500" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10 animate-bounce-slow delay-700">
        <Database className="w-32 h-32 text-rose-500" />
      </div>
    </div>
  );
};

export default LockdownPage;
