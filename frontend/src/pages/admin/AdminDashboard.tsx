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
    const fetchData = async () => {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/system-settings')
        ]);
        setStats(statsRes.data);
        setMaintenanceMode(settingsRes.data.maintenanceMode);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
               <ShieldCheck className="w-6 h-6 text-primary-600" />
            </div>
            Admin Control Panel
          </h1>
          <p className="text-zinc-500 font-medium">Platform oversight and system management</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm">
                <AlertTriangle className="w-4 h-4" />
                Live SOS
            </button>
            <div className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm border ${maintenanceMode ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800/30' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800/30'}`}>
                <div className={`w-2 h-2 rounded-full ${maintenanceMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                {maintenanceMode ? 'Maintenance' : 'System Online'}
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
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl w-full max-w-lg shadow-xl relative"
            >
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Send Global Alert</h2>
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
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="emergency">Emergency</option>
                      <option value="update">Update</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowBroadcastModal(false)}
                    className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:border-primary-200 dark:hover:border-primary-800 transition-all shadow-sm group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl border border-transparent`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative z-10">
              <p className="text-zinc-500 text-sm font-semibold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">User Growth</h2>
                <p className="text-zinc-500 text-sm font-medium">Platform adoption metrics over 6 months</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                <TrendingUp className="w-3.5 h-3.5" />
                +12% Increase
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
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden group">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">System Health</h2>
            <p className="text-zinc-500 text-sm font-medium mb-6">Service node status</p>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
                {stats?.systemHealth?.nodes?.map((node: any) => (
                    <div key={node.id} className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl flex flex-col items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                            node.status === 'online' ? 'bg-emerald-500' : 
                            node.status === 'warning' ? 'bg-amber-500' : 
                            'bg-rose-500'
                        } ${node.status !== 'offline' ? 'animate-pulse' : ''}`}></div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Node {node.id}</span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">{node.load}%</span>
                    </div>
                ))}
            </div>

            <div className="space-y-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-zinc-500 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> CPU Load</span>
                        <span className="text-zinc-900 dark:text-white">{stats?.systemHealth?.cpu}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${stats?.systemHealth?.cpu}%` }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-zinc-500 flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Memory</span>
                        <span className="text-zinc-900 dark:text-white">{stats?.systemHealth?.memory}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${stats?.systemHealth?.memory}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* API Latency Monitor */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Latency</h2>
                    <p className="text-zinc-500 text-sm font-medium">Real-time response time (ms)</p>
                </div>
                <div className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    AVG: 41.2ms
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
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">System Controls</h2>
                <p className="text-zinc-500 text-sm font-medium">Platform management utilities</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                    onClick={handleMaintenanceToggle}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${maintenanceMode ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-amber-300 dark:hover:border-amber-700'}`}
                >
                    <div className={`p-2.5 rounded-lg ${maintenanceMode ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700'}`}>
                        <Settings className={`w-5 h-5 ${maintenanceMode ? 'text-amber-600 animate-spin-slow' : 'text-zinc-500'}`} />
                    </div>
                    <div>
                        <span className="block font-bold text-sm text-zinc-900 dark:text-white">Maintenance</span>
                        <span className="text-xs text-zinc-500 font-medium">{maintenanceMode ? 'Deactivate' : 'Initialize'}</span>
                    </div>
                </button>
                <button 
                    onClick={() => setShowBroadcastModal(true)}
                    className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-primary-300 dark:hover:border-primary-700 rounded-xl transition-all text-left group"
                >
                    <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 group-hover:border-primary-200">
                        <Bell className="w-5 h-5 text-zinc-500 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <div>
                        <span className="block font-bold text-sm text-zinc-900 dark:text-white">Broadcast</span>
                        <span className="text-xs text-zinc-500 font-medium">Global Alert</span>
                    </div>
                </button>
                <button 
                    onClick={() => navigate('/admin/communication')}
                    className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all text-left group"
                >
                    <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 group-hover:border-blue-200">
                        <Send className="w-5 h-5 text-zinc-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                        <span className="block font-bold text-sm text-zinc-900 dark:text-white">Comms Hub</span>
                        <span className="text-xs text-zinc-500 font-medium">Messages</span>
                    </div>
                </button>
                <button className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-rose-300 dark:hover:border-rose-700 rounded-xl transition-all text-left group">
                    <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 group-hover:border-rose-200">
                        <ShieldAlert className="w-5 h-5 text-zinc-500 group-hover:text-rose-600 transition-colors" />
                    </div>
                    <div>
                        <span className="block font-bold text-sm text-zinc-900 dark:text-white">Active SOS</span>
                        <span className="text-xs text-zinc-500 font-medium">Live Map</span>
                    </div>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

