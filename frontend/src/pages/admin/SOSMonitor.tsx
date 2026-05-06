import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  User, 
  Activity, 
  AlertTriangle,
  ChevronRight,
  Hospital,
  Zap,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOSMonitor = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    const fetchSOS = async () => {
      try {
        // Simulating live alerts for demonstration
        const mockAlerts = [
          {
            _id: '1',
            userName: 'John Doe',
            bloodGroup: 'O+',
            location: 'Near Central Park, NY',
            timestamp: new Date().toISOString(),
            status: 'critical',
            type: 'Heart Attack Suspected'
          },
          {
            _id: '2',
            userName: 'Jane Smith',
            bloodGroup: 'B-',
            location: 'Downtown Station, Sector 4',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            status: 'dispatched',
            type: 'Accident'
          }
        ];
        setAlerts(mockAlerts);
      } catch (error) {
        console.error('Error fetching SOS:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSOS();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-20">
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30"></div>
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl inline-block">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 mb-2 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 glow-border">
               <ShieldAlert className="w-7 h-7 text-rose-400 animate-pulse" />
            </div>
            SOS WAR ROOM
          </h1>
          <p className="text-rose-500/60 font-medium text-sm tracking-widest uppercase animate-pulse">Critical Priority Dispatch Matrix</p>
        </div>
        <div className="flex bg-zinc-950/60 backdrop-blur-xl p-1.5 rounded-2xl border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
            <button 
                onClick={() => setActiveTab('live')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'live' ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'text-slate-500 hover:text-white'}`}
            >
                Live Feed
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'history' ? 'bg-white/10 text-white border border-white/10' : 'text-slate-500 hover:text-white'}`}
            >
                Archive
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode='popLayout'>
                {alerts.map((alert) => (
                    <motion.div 
                        key={alert._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border p-8 rounded-[3rem] transition-all relative overflow-hidden group shadow-2xl ${alert.status === 'critical' ? 'border-rose-500/40' : 'border-white/10'}`}
                    >
                        {alert.status === 'critical' && (
                            <>
                                <div className="absolute top-0 right-0 px-8 py-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-bl-[2rem] shadow-2xl z-20">
                                    IMMEDIATE INTERVENTION
                                </div>
                                <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none"></div>
                            </>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border-2 ${alert.status === 'critical' ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                                    <Activity className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">{alert.userName}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">{alert.bloodGroup}</span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                                            <Zap className="w-3 h-3" /> {alert.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all">
                                    <Phone className="w-5 h-5 text-white" />
                                </button>
                                <button className="p-4 bg-emerald-500 hover:bg-emerald-400 rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all">
                                    <ChevronRight className="w-5 h-5 text-black" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 shadow-inner">
                                <MapPin className="w-5 h-5 text-rose-500" />
                                <div>
                                    <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Location Matrix</p>
                                    <p className="text-white text-xs font-bold">{alert.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 shadow-inner">
                                <Clock className="w-5 h-5 text-rose-500" />
                                <div>
                                    <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Incident Age</p>
                                    <p className="text-white text-xs font-bold">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-4">
                            <button className="px-6 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Hospital className="w-4 h-4" />
                                Dispatch Ambulance
                            </button>
                            <button className="px-6 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md">
                                <User className="w-4 h-4" />
                                Contact Kin
                            </button>
                            <button className="px-6 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md ml-auto">
                                <ExternalLink className="w-4 h-4" />
                                Open Medical History
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {alerts.length === 0 && (
                <div className="bg-[#0A0A0A] border border-white/5 p-20 rounded-[3rem] text-center">
                    <ShieldAlert className="w-20 h-20 text-emerald-500/20 mx-auto mb-6" />
                    <h3 className="text-white font-bold text-2xl">No Active Emergencies</h3>
                    <p className="text-slate-500 text-sm mt-2">All nodes are reporting operational status.</p>
                </div>
            )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
            <section className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6 relative z-10">Dispatch Status</h2>
                <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Ambulances</span>
                        <span className="text-emerald-500 font-bold">14/20</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '70%' }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Response Time Avg.</span>
                        <span className="text-blue-500 font-bold">4.2m</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '40%' }}></div>
                    </div>
                </div>
            </section>

            <section className="bg-rose-500/10 backdrop-blur-xl border border-rose-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h2 className="text-xl font-black text-rose-500 uppercase tracking-tight mb-4 flex items-center gap-2 relative z-10">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                    High Alert Zone
                </h2>
                <p className="text-rose-400/60 text-xs leading-relaxed mb-6 relative z-10">
                    Increased emergency activity detected in <span className="text-rose-400 font-bold">Downtown Sector 4</span>. Recommend pre-positioning additional medical units.
                </p>
                <button className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-rose-500/20 relative z-10">
                    Deploy Mobile Unit
                </button>
            </section>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 relative z-10">Live Satellite Link</p>
                <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center relative z-10 overflow-hidden shadow-inner">
                    <div className="absolute inset-0 cyber-grid opacity-10"></div>
                    <Zap className="w-12 h-12 text-rose-500 animate-pulse relative z-10" />
                </div>
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mt-4 italic relative z-10">Signal Encrypted</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SOSMonitor;
