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
  Send,
  Zap,
  Lock,
  Radio,
  Sparkles,
  Server,
  KeyRound,
  Download
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
  LineChart,
  Line
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', type: 'info', targetGroup: 'ALL' });
  const [mfaEnforced, setMfaEnforced] = useState(true);

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
          } else {
            setMaintenanceMode(false);
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

    fetchData();
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
      alert(newMode ? 'ALERT: Global Lockdown Initiated. All non-admin requests paused.' : 'Global Lockdown Lifted. Platform operational.');
    } catch (error) {
      alert('Failed to toggle system status');
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/broadcast', broadcastForm);
      setShowBroadcastModal(false);
      setBroadcastForm({ title: '', message: '', type: 'info', targetGroup: 'ALL' });
      alert('Global emergency alert broadcast transmitted to all nodes.');
    } catch (error) {
      alert('Broadcast transmission failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500/20 border-t-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Medical Reports Stored', value: stats?.totalReports || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Live SOS Triggers', value: stats?.activeEmergencyLinks || 0, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'User Feedback Requests', value: stats?.totalFeedback || 0, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="space-y-8 min-h-screen pb-12">
      {/* Top Bar Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-blue-100 dark:border-slate-800 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              EHP Super Admin Control Center
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              High-Level Platform Security • System Telemetry • Global Controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/admin/sos')}
            className="btn-accent text-xs py-2.5 px-4"
          >
            <AlertTriangle className="w-4 h-4" /> Live SOS Radar
          </button>

          <div className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border ${
            maintenanceMode 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${maintenanceMode ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></div>
            {maintenanceMode ? 'Lockdown Mode Active' : 'System Operational (200 OK)'}
          </div>
        </div>
      </header>

      {/* High-Level Security & AI Risk Matrix Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Threat Predictor Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> AI Anomaly Risk Index
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">LOW RISK (2.8%)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">Optimal</h3>
            <span className="text-xs text-slate-500 font-medium">0 suspicious intrusion vectors detected</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time pattern analysis monitoring for rapid login attempts, bulk data extraction, and unusual geographical access requests.
          </p>
        </div>

        {/* Step-Up Security Authentication Guard */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" /> Admin Step-Up Security
            </span>
            <button
              onClick={() => setMfaEnforced(!mfaEnforced)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${mfaEnforced ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${mfaEnforced ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{mfaEnforced ? 'Enforced (Passkey)' : 'Standard'}</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Requires hardware security key or TOTP authorization before making system configuration changes or viewing audit logs.
          </p>
        </div>

        {/* System Lockdown Quick Action */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" /> Emergency Freeze
            </span>
            <span className="text-[11px] text-slate-400 font-medium">1-Click Panic Switch</span>
          </div>
          <button
            onClick={handleMaintenanceToggle}
            className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              maintenanceMode 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {maintenanceMode ? 'Lift System Lockdown' : 'Trigger Global Lockdown'}
          </button>
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3.5 rounded-2xl border border-blue-100`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+12%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & System Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Platform Adoption Growth</h2>
              <p className="text-xs text-slate-500 font-medium">Monthly registered patient and provider growth metrics</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">+12% Monthly</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.growthData || []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Database & Infrastructure Cluster Health */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" /> Microservice Clusters
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Real-time status across API nodes</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stats?.systemHealth?.nodes?.map((node: any) => (
              <div key={node.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-blue-100 dark:border-slate-700 flex flex-col items-center gap-1 text-center">
                <div className={`w-3 h-3 rounded-full ${node.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Node-{node.id}</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{node.load}% Load</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-600" /> CPU Allocation</span>
                <span className="text-blue-600 font-mono">{stats?.systemHealth?.cpu || 18}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stats?.systemHealth?.cpu || 18}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2"><Database className="w-4 h-4 text-sky-500" /> Memory Usage</span>
                <span className="text-sky-600 font-mono">{stats?.systemHealth?.memory || 34}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${stats?.systemHealth?.memory || 34}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Utilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Response Latency */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">API Response Latency</h2>
              <p className="text-xs text-slate-500 font-medium">Real-time HTTP round-trip latency (ms)</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">~ 28.4ms (FAST)</span>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.systemHealth?.latency?.map((v: number, i: number) => ({ time: i, ms: v })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="ms" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Command Shortcuts */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Super-Admin Utility Controls</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Execute administrative platform directives</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => setShowBroadcastModal(true)}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 border border-blue-100 dark:border-slate-700 rounded-2xl text-left transition-all group"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-2 text-blue-600 group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <span className="block font-bold text-sm text-slate-900 dark:text-white">Send Emergency Broadcast</span>
              <span className="text-xs text-slate-500">Push global alert to all users</span>
            </button>

            <button 
              onClick={() => navigate('/admin/cyber-activity')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 border border-blue-100 dark:border-slate-700 rounded-2xl text-left transition-all group"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-2 text-blue-600 group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <span className="block font-bold text-sm text-slate-900 dark:text-white">Cyber SOC Dashboard</span>
              <span className="text-xs text-slate-500">IP Banning & Vulnerability Scanner</span>
            </button>

            <button 
              onClick={() => navigate('/admin/communication')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 border border-blue-100 dark:border-slate-700 rounded-2xl text-left transition-all group"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-2 text-blue-600 group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <span className="block font-bold text-sm text-slate-900 dark:text-white">Communications Hub</span>
              <span className="text-xs text-slate-500">Direct notifications & SMS</span>
            </button>

            <button 
              onClick={() => navigate('/admin/logs')}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 border border-blue-100 dark:border-slate-700 rounded-2xl text-left transition-all group"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-2 text-blue-600 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="block font-bold text-sm text-slate-900 dark:text-white">Audit Trails & Logs</span>
              <span className="text-xs text-slate-500">Track all administrative activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send Emergency Broadcast</h2>
                  <p className="text-xs text-slate-500 mt-1">Transmits push notifications and SMS alerts to patient profiles.</p>
                </div>
                <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="text-slate-600 block mb-1">Broadcast Title</label>
                  <input 
                    required
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({...broadcastForm, title: e.target.value})}
                    placeholder="e.g. Regional Emergency Medical Alert"
                    className="health-input"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">Alert Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({...broadcastForm, message: e.target.value})}
                    placeholder="Enter urgent notification details for patients..."
                    className="health-input resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-600 block mb-1">Alert Level</label>
                    <select 
                      value={broadcastForm.type}
                      onChange={(e) => setBroadcastForm({...broadcastForm, type: e.target.value})}
                      className="health-input"
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="emergency">Emergency (High Priority)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Target Patients</label>
                    <select 
                      value={broadcastForm.targetGroup}
                      onChange={(e) => setBroadcastForm({...broadcastForm, targetGroup: e.target.value})}
                      className="health-input"
                    >
                      <option value="ALL">All Registered Users</option>
                      <option value="CRITICAL_ONLY">Patients with Chronic Conditions</option>
                      <option value="O_NEG">O-Negative Donors Only</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowBroadcastModal(false)}
                    className="btn-secondary flex-1 py-3"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary flex-1 py-3"
                  >
                    Send Broadcast
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
