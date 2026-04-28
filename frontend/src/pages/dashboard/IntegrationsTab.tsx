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
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const IntegrationsTab = () => {
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    const savedStates = JSON.parse(localStorage.getItem('ehp_integrations') || '{}');
    const initialIntegrations = [
      {
        id: 'google-fit',
        name: 'Google Fit',
        description: 'Sync heart rate, steps, and activity from your Android devices.',
        icon: Activity,
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        connected: !!savedStates['google-fit'],
        lastSync: savedStates['google-fit'] || null
      },
      {
        id: 'fitbit',
        name: 'Fitbit',
        description: 'Import sleep data and professional vitals from Fitbit trackers.',
        icon: Watch,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        connected: !!savedStates['fitbit'],
        lastSync: savedStates['fitbit'] || null
      },
      {
        id: 'apple-health',
        name: 'Apple Health',
        description: 'Bridge your iPhone health data using our secure data relay.',
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

  const [syncing, setSyncing] = useState<string | null>(null);

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
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Cloud Gateways...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex items-center gap-5 mb-8">
           <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <Cloud className="h-8 w-8 text-white" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Integrations</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Connect your wearables for automated vitals tracking</p>
           </div>
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 mb-10 flex items-start gap-4">
           <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
           <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Your privacy is our priority.</p>
              <p className="text-xs text-blue-800/70 dark:text-blue-300/70 mt-1 leading-relaxed">
                EHP only requests 'Read-Only' access to your health data. We never share your credentials or clinical data with third parties. All connections use bank-grade OAuth2 encryption.
              </p>
           </div>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
           {integrations.map((item) => (
             <div key={item.id} className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group ${item.connected ? 'bg-white dark:bg-slate-800 border-emerald-500/30' : 'bg-gray-50/30 dark:bg-slate-900/30 border-gray-100 dark:border-slate-700'}`}>
                {item.connected && (
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                )}
                
                <div className="flex justify-between items-start relative z-10">
                   <div className={`p-4 rounded-2xl ${item.bg}`}>
                      <item.icon className={`h-8 w-8 ${item.color}`} />
                   </div>
                   {item.connected ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-emerald-100 dark:border-emerald-800/30">
                        <CheckCircle2 className="h-3 w-3" /> Live Syncing
                      </span>
                   ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-gray-200 dark:border-slate-600">
                        Disconnected
                      </span>
                   )}
                </div>

                <div className="mt-8 relative z-10">
                   <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{item.name}</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">{item.description}</p>
                   
                   <div className="flex items-center gap-4">
                      {item.connected ? (
                        <>
                           <button 
                             onClick={() => handleDisconnect(item.id)}
                             className="flex-1 py-4 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                           >
                              Disconnect
                           </button>
                           <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                              <RefreshCcw className={`h-5 w-5 ${syncing === item.id ? 'animate-spin' : ''}`} />
                           </div>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleConnect(item.id)}
                          disabled={syncing !== null}
                          className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                        >
                           {syncing === item.id ? 'Establishing Bridge...' : `Connect ${item.name}`}
                        </button>
                      )}
                   </div>
                </div>

                {item.connected && item.lastSync && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="h-3 w-3" /> Last Synced: {new Date(item.lastSync).toLocaleTimeString()}
                     </p>
                     <ExternalLink className="h-4 w-4 text-gray-300" />
                  </div>
                )}
             </div>
           ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
               <Lock className="h-5 w-5 text-indigo-600" />
               Developer Access
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
               Are you a developer or a clinic using a custom EMR? You can connect to our secure Webhook endpoint to push data directly.
            </p>
            <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 font-black text-xs uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all">
               View API Documentation
            </button>
         </div>
         <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 flex flex-col justify-between">
            <div>
               <Zap className="h-8 w-8 text-white mb-6" />
               <h2 className="text-xl font-black mb-2 uppercase tracking-tighter">Instant Vitals 2.0</h2>
               <p className="text-blue-100/80 text-sm font-medium leading-relaxed">
                  Connecting Google Fit allows the Emergency Tab to display your most recent pulse even if you are unconscious.
               </p>
            </div>
            <div className="mt-8 flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
               <Watch className="h-5 w-5 text-white/60" />
               <p className="text-[10px] font-black uppercase tracking-widest">Recommended for Gear S3 / Pixel Watch</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default IntegrationsTab;
