import React, { useState, useEffect } from 'react';
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
  ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      trend: stats?.newUsersLastWeek > 0 ? `+${stats.newUsersLastWeek} this week` : 'Stable'
    },
    { 
      label: 'Medical Reports', 
      value: stats?.totalReports || 0, 
      icon: FileText, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      trend: stats?.newReportsLastWeek > 0 ? `+${stats.newReportsLastWeek} this week` : 'Stable'
    },
    { 
      label: 'Emergency Links', 
      value: stats?.activeEmergencyLinks || 0, 
      icon: Activity, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10',
      trend: 'Active Now'
    },
    { 
      label: 'User Feedback', 
      value: stats?.totalFeedback || 0, 
      icon: MessageSquare, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      trend: 'Pending review'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          Admin Command Center
        </h1>
        <p className="text-slate-400">Welcome back, Administrator. Here's what's happening with EHP today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            System Health & Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex flex-col items-start gap-2 p-4 bg-slate-800/50 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all text-left group">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
              <span className="font-medium text-white">Security Audit</span>
              <span className="text-xs text-slate-400">Review unusual login attempts</span>
            </button>
            <button className="flex flex-col items-start gap-2 p-4 bg-slate-800/50 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all text-left group">
              <MessageSquare className="w-6 h-6 text-amber-400" />
              <span className="font-medium text-white">Broadcast</span>
              <span className="text-xs text-slate-400">Send system-wide notification</span>
            </button>
          </div>
        </section>

        {/* System Status */}
        <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Real-time Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-slate-300">API Server</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-slate-300">Database</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm text-slate-300">Cloudinary Storage</span>
              </div>
              <span className="text-xs font-mono text-blue-400">84% free</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
