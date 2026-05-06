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
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Medical Reports', value: stats?.totalReports || 0, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'SOS Alerts', value: stats?.activeEmergencyLinks || 0, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'User Feedback', value: stats?.totalFeedback || 0, icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ... existing header ... */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-3 uppercase tracking-tighter">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            Command Center
          </h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Operational Readiness Level: Alpha</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500/20 transition-all">
                <AlertTriangle className="w-4 h-4" />
                Live SOS Monitor
            </button>
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${maintenanceMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                <div className={`w-2 h-2 rounded-full ${maintenanceMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></div>
                {maintenanceMode ? 'Maintenance Active' : 'System Online'}
            </div>
        </div>
      </header>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[3rem] w-full max-w-lg shadow-3xl"
            >
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Initialize Global Broadcast</h2>
              <form onSubmit={handleSendBroadcast} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Transmission Title</label>
                  <input 
                    required
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({...broadcastForm, title: e.target.value})}
                    placeholder="e.g. System Maintenance"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Broadcast Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({...broadcastForm, message: e.target.value})}
                    placeholder="Enter the transmission details..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Alert Level</label>
                    <select 
                      value={broadcastForm.type}
                      onChange={(e) => setBroadcastForm({...broadcastForm, type: e.target.value})}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all text-xs"
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="emergency">Emergency</option>
                      <option value="update">System Update</option>
                    </select>
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowBroadcastModal(false)}
                    className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-emerald-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
                  >
                    Execute Transmission
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ... Stats Grid ... */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] -mr-16 -mt-16 rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500 opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-black text-white mt-1 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
          <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">EHP User Acquisition</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Growth metrics over last 6 months</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                <TrendingUp className="w-3 h-3" />
                +12% Increase
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.growthData || []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ color: '#10b981', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="scanline"></div>
        </div>

        {/* Database Health Matrix */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">DB Health Matrix</h2>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-8">Node Distribution Status</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
                {stats?.systemHealth?.nodes?.map((node: any) => (
                    <div key={node.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-3 group/node transition-all hover:border-emerald-500/30">
                        <div className={`w-3 h-3 rounded-full ${
                            node.status === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                            node.status === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                            'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                        } ${node.status !== 'offline' ? 'animate-pulse' : ''}`}></div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Node {node.id}</span>
                        <span className="text-[10px] font-bold text-white">{node.load}%</span>
                    </div>
                ))}
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400 flex items-center gap-2"><Cpu className="w-3 h-3" /> Aggregated CPU</span>
                        <span className="text-emerald-400 glow-text-emerald">{stats?.systemHealth?.cpu}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats?.systemHealth?.cpu}%` }}></div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400 flex items-center gap-2"><Database className="w-3 h-3" /> Heap Usage</span>
                        <span className="text-blue-400">{stats?.systemHealth?.memory}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${stats?.systemHealth?.memory}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="scanline"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* API Latency Monitor */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">API Latency Matrix</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Real-time Node response time (ms)</p>
                </div>
                <div className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/10">
                    AVG: 41.2ms
                </div>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.systemHealth?.latency?.map((v: number, i: number) => ({ time: i, ms: v })) || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                        <Line type="monotone" dataKey="ms" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Global Controls */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Global System Controls</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">Emergency and Infrastructure Management</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`flex flex-col items-start gap-4 p-6 rounded-[2rem] border transition-all text-left ${maintenanceMode ? 'bg-amber-500/20 border-amber-500/50' : 'bg-white/[0.02] border-white/10 hover:border-amber-500/50'}`}
                >
                    <Settings className={`w-8 h-8 ${maintenanceMode ? 'text-amber-500 animate-spin-slow' : 'text-slate-500'}`} />
                    <div>
                        <span className="block font-black text-[10px] uppercase tracking-widest text-white mb-1">Maintenance Mode</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{maintenanceMode ? 'Deactivate Protocol' : 'Initialize Protocol'}</span>
                    </div>
                </button>
                <button 
                    onClick={() => setShowBroadcastModal(true)}
                    className="flex flex-col items-start gap-4 p-6 bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 rounded-[2rem] transition-all text-left group"
                >
                    <Bell className="w-8 h-8 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                    <div>
                        <span className="block font-black text-[10px] uppercase tracking-widest text-white mb-1">Broadcast Alert</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Global Notification</span>
                    </div>
                </button>
                <button 
                    onClick={() => navigate('/admin/communication')}
                    className="flex flex-col items-start gap-4 p-6 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 rounded-[2rem] transition-all text-left group"
                >
                    <Send className="w-8 h-8 text-slate-500 group-hover:text-blue-500 transition-colors" />
                    <div>
                        <span className="block font-black text-[10px] uppercase tracking-widest text-white mb-1">Communication Hub</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Global & Direct</span>
                    </div>
                </button>
                <button className="flex flex-col items-start gap-4 p-6 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 rounded-[2rem] transition-all text-left group">
                    <Database className="w-8 h-8 text-slate-500 group-hover:text-blue-500 transition-colors" />
                    <div>
                        <span className="block font-black text-[10px] uppercase tracking-widest text-white mb-1">DB Integrity Check</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Validate All Records</span>
                    </div>
                </button>
                <button className="flex flex-col items-start gap-4 p-6 bg-white/[0.02] border border-white/10 hover:border-rose-500/50 rounded-[2rem] transition-all text-left group">
                    <ShieldAlert className="w-8 h-8 text-slate-500 group-hover:text-rose-500 transition-colors" />
                    <div>
                        <span className="block font-black text-[10px] uppercase tracking-widest text-white mb-1">Active SOS Map</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Live Alert Tracking</span>
                    </div>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

