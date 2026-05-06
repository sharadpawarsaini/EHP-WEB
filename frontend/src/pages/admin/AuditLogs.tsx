import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ShieldAlert, 
  Activity, 
  User, 
  Clock, 
  Globe, 
  ExternalLink,
  Lock,
  Eye
} from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/admin/logs');
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="relative z-10">
        <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl inline-block">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 glow-border">
               <ShieldAlert className="w-7 h-7 text-emerald-400" />
            </div>
            SECURITY & AUDIT LOGS
          </h1>
          <p className="text-zinc-400 font-medium text-sm tracking-widest uppercase">Track system access and emergency protocol executions.</p>
        </div>
      </header>

      <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative group hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 backdrop-blur-md">
                <th className="px-6 py-5 text-zinc-400 font-black text-xs uppercase tracking-widest">Event Type</th>
                <th className="px-6 py-5 text-zinc-400 font-black text-xs uppercase tracking-widest">Accessed By</th>
                <th className="px-6 py-5 text-zinc-400 font-black text-xs uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-5 text-zinc-400 font-black text-xs uppercase tracking-widest">Location/IP</th>
                <th className="px-6 py-5 text-zinc-400 font-black text-xs uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5 transition-all duration-300 group/row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-500/10 rounded-lg">
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <span className="text-white text-sm font-medium">Emergency Link Access</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300 text-sm">{log.ipAddress || 'Unknown IP'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-500 text-xs font-mono">
                      {log.userAgent?.split(' ')[0] || 'Browser/Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-400 hover:text-emerald-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 justify-end ml-auto group/btn transition-all">
                      <Eye className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-125" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-white font-medium">No activity logged</h3>
              <p className="text-slate-500">Security events will be recorded here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
