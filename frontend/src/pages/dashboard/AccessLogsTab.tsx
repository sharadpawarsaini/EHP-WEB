import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Eye, ShieldCheck, Clock, Globe, Laptop } from 'lucide-react';

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

  if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading access history...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Access Logs</h2>
        <p className="text-gray-600 dark:text-gray-400">Monitor when and where your emergency profile was scanned or unlocked.</p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-12 text-center border border-gray-100 dark:border-slate-700">
          <Eye className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Access History</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">Your profile hasn't been scanned yet. Logs will appear here automatically when someone accesses your link.</p>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white dark:border-slate-700 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Access Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device/Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/30 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {log.accessType === 'doctor' ? (
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white capitalize">{log.accessType} Access</p>
                          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-tight">
                            {log.accessType === 'doctor' ? 'Full Medical History' : 'Public Profile Scan'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-sm">{log.ipAddress || 'Hidden'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                        <Laptop className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs truncate">{log.userAgent || 'Unknown Device'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessLogsTab;
