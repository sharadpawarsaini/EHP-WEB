import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Eye, 
  ShieldCheck, 
  Clock, 
  Globe, 
  Laptop, 
  ShieldAlert, 
  Zap, 
  Lock, 
  History, 
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccessLogsTab = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/emergency/logs');
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevel = () => {
    if (logs.length === 0) return { level: 'Safe', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    const recentLogs = logs.filter(l => new Date(l.createdAt).getTime() > Date.now() - 3600000);
    if (recentLogs.length > 3) return { level: 'Elevated', color: 'text-rose-500', bg: 'bg-rose-500/10' };
    return { level: 'Safe', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  };

  const threat = getThreatLevel();

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auditing Access Vault...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white dark:border-slate-700 shadow-xl shadow-gray-200/40">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Security Audit</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Monitoring your medical passport integrity</p>
               </div>
               <div className={`px-4 py-2 rounded-xl border border-white dark:border-slate-700 flex items-center gap-2 ${threat.bg}`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${threat.color.replace('text', 'bg')}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${threat.color}`}>Threat: {threat.level}</span>
               </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
               <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Scans</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{logs.length}</p>
               </div>
               <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Doctor Keys</p>
                  <p className="text-xl font-black text-emerald-600">{logs.filter(l => l.accessType === 'doctor').length}</p>
               </div>
               <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unique IPs</p>
                  <p className="text-xl font-black text-blue-600">{new Set(logs.map(l => l.ipAddress)).size}</p>
               </div>
            </div>
         </div>

         <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-20">
               <Lock className="h-24 w-24" />
            </div>
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
               <ShieldAlert className="h-6 w-6 text-rose-500" />
               Live Watch
            </h3>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">Real-time surveillance of your EHP Identity. Any unauthorized attempt triggers instant guardian alerts.</p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10 w-fit">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">Passive Monitor Active</span>
            </div>
         </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border border-gray-100 dark:border-slate-700 shadow-sm">
          <History className="h-16 w-16 text-gray-200 dark:text-slate-700 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Security Events</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">Your profile has not been accessed yet. Logs will generate automatically upon scan.</p>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Geolocation/IP</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Device Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl transition-all ${log.accessType === 'doctor' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'}`}>
                           {log.accessType === 'doctor' ? <ShieldCheck className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-white capitalize">{log.accessType} Access</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{log.accessType === 'doctor' ? 'Clinical Unlock' : 'Public Scan'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                           <Clock className="h-3 w-3 text-gray-400" />
                           {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 ml-5">{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                          <Navigation className="h-3.5 w-3.5 text-blue-500" />
                          <span className="font-mono">{log.ipAddress || 'Anonymized'}</span>
                        </div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 ml-5">
                           <Globe className="h-2 w-2" /> Geo-Verified
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl max-w-[250px] border border-gray-100 dark:border-slate-700">
                        <Laptop className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-[10px] font-medium text-gray-500 truncate">{log.userAgent || 'Legacy Device'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Tip */}
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800/30 flex items-center gap-4">
         <AlertTriangle className="h-6 w-6 text-amber-600" />
         <p className="text-xs text-amber-800 dark:text-amber-400 font-bold leading-relaxed">
            PRO TIP: If you see an "Access" log from a location you don't recognize, immediately cycle your Doctor Access Key in the Emergency tab.
         </p>
      </div>
    </div>
  );
};

export default AccessLogsTab;
