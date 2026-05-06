import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  FileText, 
  Activity, 
  MessageSquare, 
  ShieldAlert, 
  TrendingUp, 
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Globe,
  Bell,
  Settings,
  AlertTriangle,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const statsPromise = api.get('/admin/stats');
        const settingsPromise = api.get('/admin/system-settings');
        
        const [statsRes, settingsRes] = await Promise.allSettled([statsPromise, settingsPromise]);
        
        if (isMounted) {
          if (statsRes.status === 'fulfilled') {
            setStats(statsRes.value.data);
          }
          if (settingsRes.status === 'fulfilled') {
            setMaintenanceMode(settingsRes.value.data.maintenanceMode);
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleMaintenanceToggle = async () => {
    try {
      const newMode = !maintenanceMode;
      await api.put('/admin/system-settings', { maintenanceMode: newMode });
      setMaintenanceMode(newMode);
      alert(newMode ? 'CRITICAL: System Lockdown Initiated. All non-admin traffic is blocked.' : 'System Lockdown Lifted. Traffic restored.');
    } catch (error) {
      alert('Failed to toggle system status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-b-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Medical Reports', value: stats?.totalReports || 0, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'SOS Alerts', value: stats?.activeEmergencyLinks || 0, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { label: 'User Feedback', value: stats?.totalFeedback || 0, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' }
  ];

  const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899']; // primary is violet

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/broadcast', broadcastForm);
      setShowBroadcastModal(false);
      setBroadcastForm({ title: '', message: '', type: 'info' });
      alert('Broadcast transmission successful.');
    } catch (error) {
      alert('Broadcast transmission failed.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative min-h-screen p-4">
      {/* Cyberpunk Effects Background */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40"></div>
      <div className="absolute inset-0 scanline pointer-events-none z-0"></div>
      
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl inline-block">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 glow-border">
               <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            NEXUS COMMAND
          </h1>
          <p className="text-zinc-400 font-medium text-sm tracking-widest uppercase">System Oversight & Telemetry Matrix</p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
            <button className="px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                Live SOS
            </button>
            <div className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-3 shadow-2xl border backdrop-blur-md uppercase tracking-wider ${maintenanceMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${maintenanceMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}></div>
                {maintenanceMode ? 'Lockdown Active' : 'System Online'}
            </div>
        </div>
      </header>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight relative z-10">Send Global Alert</h2>
              <form onSubmit={handleSendBroadcast} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Title</label>
                  <input 
                    required
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({...broadcastForm, title: e.target.value})}
                    placeholder="e.g. System Maintenance"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({...broadcastForm, message: e.target.value})}
                    placeholder="Enter the message details..."
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Alert Level</label>
                    <select 
                      value={broadcastForm.type}
                      onChange={(e) => setBroadcastForm({...broadcastForm, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all font-bold text-xs uppercase tracking-widest shadow-inner"
                    >
                      <option value="info" className="bg-zinc-900 text-white">Information</option>
                      <option value="warning" className="bg-zinc-900 text-white">Warning</option>
                      <option value="emergency" className="bg-zinc-900 text-white">Emergency</option>
                      <option value="update" className="bg-zinc-900 text-white">Update</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-4 relative z-10">
                  <button 
                    type="button" 
                    onClick={() => setShowBroadcastModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 transition-all"
                  >
                    Send Alert
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ... Stats Grid ... */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all duration-500 shadow-2xl group relative overflow-hidden hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`${stat.bg} ${stat.color} p-3.5 rounded-xl border border-white/5 shadow-inner`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight font-mono">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-1 uppercase tracking-wide">Adoption Matrix</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Platform growth telemetry</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                +12% Spike
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.growthData || []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#a78bfa', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Database Health Matrix */}
        <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-wide flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" /> Core Nodes
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-6">Cluster Health Status</p>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
                {stats?.systemHealth?.nodes?.map((node: any) => (
                    <div key={node.id} className="bg-white/5 dark:bg-zinc-900/40 border border-white/5 p-3 rounded-2xl flex flex-col items-center gap-2 hover:border-cyan-500/30 transition-all shadow-inner group/node">
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_currentColor] transition-all group-hover/node:scale-125 ${
                            node.status === 'online' ? 'bg-emerald-400 text-emerald-400' : 
                            node.status === 'warning' ? 'bg-amber-400 text-amber-400' : 
                            'bg-rose-500 text-rose-500'
                        } ${node.status !== 'offline' ? 'animate-pulse' : ''}`}></div>
                        <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">N-{node.id}</span>
                        <span className="text-sm font-black text-zinc-900 dark:text-white font-mono">{node.load}%</span>
                    </div>
                ))}
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-200 dark:border-white/10">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
                        <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Cpu className="w-4 h-4 text-emerald-400" /> CPU Allocation</span>
                        <span className="text-emerald-500 font-mono glow-text-emerald">{stats?.systemHealth?.cpu || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-300 dark:border-white/5 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${stats?.systemHealth?.cpu || 0}%` }}></div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
                        <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Database className="w-4 h-4 text-cyan-400" /> RAM Usage</span>
                        <span className="text-cyan-500 font-mono" style={{ textShadow: '0 0 10px rgba(34,211,238,0.5)' }}>{stats?.systemHealth?.memory || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-300 dark:border-white/5 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-1000 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${stats?.systemHealth?.memory || 0}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* API Latency Monitor */}
        <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-1 uppercase tracking-wide">Ping Matrix</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Network response latency</p>
                </div>
                <div className="text-xs font-black text-amber-400 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)] uppercase tracking-wider font-mono">
                    ~ 41.2ms
                </div>
            </div>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.systemHealth?.latency?.map((v: number, i: number) => ({ time: i, ms: v })) || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} strokeOpacity={0.5} />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Line type="monotone" dataKey="ms" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} activeDot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Global Controls */}
        <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative z-10 overflow-hidden group">
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="mb-8 relative z-10">
                <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-1 uppercase tracking-wide">Command Utilities</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Execute global platform directives</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <button 
                    onClick={handleMaintenanceToggle}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${maintenanceMode ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'}`}
                >
                    <div className={`p-3 rounded-xl border ${maintenanceMode ? 'bg-amber-500/20 border-amber-500/30 glow-border text-amber-400' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400'}`}>
                        <Settings className={`w-6 h-6 ${maintenanceMode ? 'animate-spin-slow' : ''}`} />
                    </div>
                    <div>
                        <span className={`block font-black text-sm uppercase tracking-wide ${maintenanceMode ? 'text-amber-400' : 'text-zinc-900 dark:text-white'}`}>Lockdown</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">{maintenanceMode ? 'Deactivate' : 'Initialize'}</span>
                    </div>
                </button>
                <button 
                    onClick={() => setShowBroadcastModal(true)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 shadow-sm hover:shadow-[0_0_15px_rgba(124,58,237,0.1)] rounded-xl transition-all duration-300 text-left group"
                >
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/5 group-hover:border-primary-500/30 group-hover:bg-primary-500/20 transition-all">
                        <Bell className="w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-primary-400" />
                    </div>
                    <div>
                        <span className="block font-black text-sm uppercase tracking-wide text-zinc-900 dark:text-white group-hover:text-primary-400 transition-colors">Broadcast</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">Global Alert</span>
                    </div>
                </button>
                <button 
                    onClick={() => navigate('/admin/communication')}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] rounded-xl transition-all duration-300 text-left group"
                >
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/5 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                        <Send className="w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-cyan-400" />
                    </div>
                    <div>
                        <span className="block font-black text-sm uppercase tracking-wide text-zinc-900 dark:text-white group-hover:text-cyan-400 transition-colors">Comms Hub</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">Messages</span>
                    </div>
                </button>
                <button className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 hover:border-rose-500/50 hover:bg-rose-500/5 shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.1)] rounded-xl transition-all duration-300 text-left group">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/5 group-hover:border-rose-500/30 group-hover:bg-rose-500/20 transition-all">
                        <ShieldAlert className="w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-rose-400" />
                    </div>
                    <div>
                        <span className="block font-black text-sm uppercase tracking-wide text-zinc-900 dark:text-white group-hover:text-rose-400 transition-colors">Active SOS</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">Live Map</span>
                    </div>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

