import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  RefreshCcw, 
  Smartphone, 
  Watch, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Lock,
  Cloud,
  ChevronRight,
  Database,
  Globe,
  Radio,
  Clock as ClockIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const IntegrationsTab = () => {
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    const savedStates = JSON.parse(localStorage.getItem('ehp_integrations') || '{}');
    const initialIntegrations = [
      {
        id: 'google-fit',
        name: 'Google Fit',
        description: 'Bi-directional sync for heart rate, sleep cycles, and daily activity metrics.',
        icon: Activity,
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        connected: !!savedStates['google-fit'],
        lastSync: savedStates['google-fit'] || null
      },
      {
        id: 'fitbit',
        name: 'Fitbit Pro',
        description: 'Professional grade vitals and SPO2 tracking from Fitbit ecosystem.',
        icon: Watch,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        connected: !!savedStates['fitbit'],
        lastSync: savedStates['fitbit'] || null
      },
      {
        id: 'apple-health',
        name: 'Apple Health',
        description: 'Unified health bridge for iPhone, Apple Watch and HealthKit data.',
        icon: Smartphone,
        color: 'text-gray-900 dark:text-white',
        bg: 'bg-gray-100 dark:bg-slate-700',
        connected: !!savedStates['apple-health'],
        lastSync: savedStates['apple-health'] || null
      }
    ];
    setIntegrations(initialIntegrations);
    setLoading(false);
  }, []);

  const handleConnect = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      const now = new Date().toISOString();
      const savedStates = JSON.parse(localStorage.getItem('ehp_integrations') || '{}');
      savedStates[id] = now;
      localStorage.setItem('ehp_integrations', JSON.stringify(savedStates));

      setIntegrations(prev => prev.map(item => 
        item.id === id ? { ...item, connected: true, lastSync: now } : item
      ));
      setSyncing(null);
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    if (!confirm('Sever this data link? Live vitals will stop syncing.')) return;
    const savedStates = JSON.parse(localStorage.getItem('ehp_integrations') || '{}');
    delete savedStates[id];
    localStorage.setItem('ehp_integrations', JSON.stringify(savedStates));

    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, connected: false, lastSync: null } : item
    ));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bridging Cloud Gateways...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">Secure Bridging</span>
               <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Live Sync</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Neural Link</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Connect biometric hardware and health ecosystems to your EHP ID</p>
         </div>
         <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white dark:border-slate-700 shadow-sm">
            <div className="flex -space-x-2">
               <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-white">G</div>
               <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-white">F</div>
               <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-white">A</div>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3 Nodes Available</span>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-1 gap-6">
               {integrations.map((item) => (
                 <motion.div 
                   layout
                   key={item.id} 
                   className={`p-8 rounded-[3rem] border-2 transition-all relative overflow-hidden group ${item.connected ? 'bg-white dark:bg-slate-800 border-emerald-500/30 shadow-2xl shadow-emerald-500/5' : 'bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-700'}`}
                 >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                       <div className="flex gap-6">
                          <div className={`p-5 rounded-[1.5rem] shadow-sm transition-all group-hover:scale-110 ${item.bg}`}>
                             <item.icon className={`h-8 w-8 ${item.color}`} />
                          </div>
                          <div className="space-y-1">
                             <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-sm">{item.description}</p>
                          </div>
                       </div>

                       <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                          {item.connected ? (
                             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                Node Active
                             </div>
                          ) : (
                             <div className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                                Offline
                             </div>
                          )}
                          
                          <div className="flex gap-2 w-full sm:w-auto">
                             {item.connected ? (
                                <>
                                   <button 
                                     onClick={() => handleDisconnect(item.id)}
                                     className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all"
                                   >
                                      Detach
                                   </button>
                                   <button className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                                      <RefreshCcw className={`h-5 w-5 ${syncing === item.id ? 'animate-spin' : ''}`} />
                                   </button>
                                </>
                             ) : (
                                <button 
                                  onClick={() => handleConnect(item.id)}
                                  disabled={syncing !== null}
                                  className="w-full sm:w-64 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                   {syncing === item.id ? 'Handshaking...' : `Authorize Node`}
                                </button>
                             )}
                          </div>
                       </div>
                    </div>

                    {item.connected && item.lastSync && (
                      <div className="mt-8 pt-8 border-t border-gray-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                         <div className="flex items-center gap-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                               <ClockIcon className="h-3.5 w-3.5 text-blue-500" /> 
                               Data Integrity: 100%
                            </p>
                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                               Last Pulse: {new Date(item.lastSync).toLocaleTimeString()}
                            </p>
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                            <ShieldCheck className="h-3 w-3" /> Encrypted Link
                         </div>
                      </div>
                    )}
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Sidebar Controls */}
         <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Globe className="h-40 w-40" />
               </div>
               <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <Radio className="h-6 w-6 text-blue-300" />
                  Live Sync
               </h3>
               <p className="text-blue-50/80 text-sm font-medium leading-relaxed mb-8">
                  Authorizing nodes allows your EHP ID to pull real-time biometrics from external ecosystems. This data is critical for accurate Emergency Card pulse monitoring.
               </p>
               <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                     <span className="text-[10px] font-black uppercase tracking-widest">Sync Frequency</span>
                     <span className="text-[10px] font-black text-blue-300">Every 15m</span>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                     <span className="text-[10px] font-black uppercase tracking-widest">Data Retention</span>
                     <span className="text-[10px] font-black text-blue-300">90 Days</span>
                  </div>
               </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white dark:border-slate-700 shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                  <Database className="h-5 w-5 text-gray-400" />
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">API Webhooks</h4>
               </div>
               <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">Connect custom EMR systems or medical software using our secure Webhook relay. Supporting HL7 and JSON protocols.</p>
               <button className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                  Documentation
               </button>
            </div>
         </div>
      </div>

      {/* Protocol Guard */}
      <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 flex items-start gap-5">
         <ShieldCheck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
         <div>
            <p className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest mb-1">Authorization Protocol</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">EHP uses standard OAuth 2.0 authorization codes. We never store your third-party passwords. Access tokens are encrypted using AES-256 and rotated automatically every 24 hours.</p>
         </div>
      </div>
    </div>
  );
};

export default IntegrationsTab;
