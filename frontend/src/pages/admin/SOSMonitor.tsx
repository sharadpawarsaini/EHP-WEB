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
        <div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight flex items-center gap-4 glow-text-rose">
            <div className="w-5 h-5 rounded-full bg-rose-500 animate-ping shadow-[0_0_20px_rgba(244,63,94,0.6)]"></div>
            SOS War Room
          </h1>
          <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Critical Priority Dispatch Matrix</p>
        </div>
        <div className="flex bg-[#0A0A0A] p-1.5 rounded-2xl border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <button 
                onClick={() => setActiveTab('live')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'live' ? 'bg-rose-500 text-white shadow-2xl shadow-rose-500/40' : 'text-slate-500 hover:text-white'}`}
            >
                Live Feed
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-black shadow-2xl shadow-white/5' : 'text-slate-500 hover:text-white'}`}
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
                        className={`bg-[#0A0A0A] border p-8 rounded-[3rem] transition-all relative overflow-hidden group ${alert.status === 'critical' ? 'border-rose-500/40 bg-rose-500/[0.03] glow-border' : 'border-white/5'}`}
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
                            <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                <MapPin className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Location Matrix</p>
                                    <p className="text-white text-xs font-bold">{alert.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                <Clock className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Incident Age</p>
                                    <p className="text-white text-xs font-bold">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-3">
                            <button className="px-5 py-3 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all">
                                <Hospital className="w-4 h-4" />
                                Dispatch Ambulance
                            </button>
                            <button className="px-5 py-3 bg-white/[0.05] text-white border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
                                <User className="w-4 h-4" />
                                Contact Kin
                            </button>
                            <button className="px-5 py-3 bg-white/[0.05] text-white border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all ml-auto">
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
            <section className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem]">
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6">Dispatch Status</h2>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Ambulances</span>
                        <span className="text-emerald-500 font-bold">14/20</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '70%' }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Response Time Avg.</span>
                        <span className="text-blue-500 font-bold">4.2m</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '40%' }}></div>
                    </div>
                </div>
            </section>

            <section className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[2.5rem]">
                <h2 className="text-xl font-black text-rose-500 uppercase tracking-tight mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    High Alert Zone
                </h2>
                <p className="text-rose-400/60 text-xs leading-relaxed mb-6">
                    Increased emergency activity detected in **Downtown Sector 4**. Recommend pre-positioning additional medical units.
                </p>
                <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-2xl shadow-rose-500/20">
                    Deploy Mobile Unit
                </button>
            </section>

            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Live Satellite Link</p>
                <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center">
                    <Zap className="w-12 h-12 text-slate-700 animate-pulse" />
                </div>
                <p className="text-slate-700 text-[9px] font-bold uppercase tracking-widest mt-4 italic">Signal Encrypted</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SOSMonitor;
