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
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-emerald-400" />
          Security & Audit Logs
        </h1>
        <p className="text-slate-400 mt-1">Track system access and emergency protocol executions.</p>
      </header>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/20">
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Event Type</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Accessed By</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Timestamp</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Location/IP</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/30 transition-colors">
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
                    <button className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1 justify-end ml-auto">
                      <Eye className="w-4 h-4" />
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
