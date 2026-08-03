import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ShieldAlert, 
  Activity, 
  Lock, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Filter, 
  UserX, 
  Zap, 
  Radio, 
  Shield, 
  Terminal, 
  Eye, 
  Ban, 
  Unlock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CyberActivityDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'blocked' | 'sources'>('feed');

  // Filters
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual IP block state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockIpInput, setBlockIpInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('');

  useEffect(() => {
    fetchCyberData();
    const interval = setInterval(fetchCyberData, 6000); // 6s polling
    return () => clearInterval(interval);
  }, [severityFilter, eventTypeFilter, searchQuery]);

  const fetchCyberData = async () => {
    try {
      const statsRes = await api.get('/admin/cyber/stats');
      setStats(statsRes.data);

      const logsRes = await api.get('/admin/cyber/logs', {
        params: {
          severity: severityFilter,
          eventType: eventTypeFilter,
          search: searchQuery
        }
      });
      setLogs(logsRes.data);

      const blockedRes = await api.get('/admin/cyber/blocked-ips');
      setBlockedIPs(blockedRes.data);
    } catch (error) {
      console.error('Failed to fetch cyber security telemetry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (ipToBlock?: string) => {
    const targetIp = ipToBlock || blockIpInput;
    if (!targetIp) return;

    try {
      await api.post('/admin/cyber/block-ip', {
        ipAddress: targetIp,
        reason: blockReasonInput || 'Flagged via Cyber Security SOC'
      });
      alert(`IP address ${targetIp} has been restricted.`);
      setShowBlockModal(false);
      setBlockIpInput('');
      setBlockReasonInput('');
      fetchCyberData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to block IP address.');
    }
  };

  const handleUnblockIP = async (ip: string) => {
    try {
      await api.delete(`/admin/cyber/unblock-ip/${encodeURIComponent(ip)}`);
      fetchCyberData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to unblock IP.');
    }
  };

  const getThreatBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { color: 'bg-rose-500/20 text-rose-400 border-rose-500/40', label: 'CRITICAL THREAT LEVEL', pulse: 'bg-rose-500' };
      case 'ELEVATED':
        return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', label: 'ELEVATED THREAT LEVEL', pulse: 'bg-amber-500' };
      case 'MEDIUM':
        return { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', label: 'MODERATE ACTIVITY', pulse: 'bg-yellow-500' };
      default:
        return { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', label: 'SYSTEM NOMINAL', pulse: 'bg-emerald-500' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase">Synchronizing Telemetry Feeds...</p>
        </div>
      </div>
    );
  }

  const threatBadge = getThreatBadge(stats?.threatLevel || 'LOW');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Top Header & Threat Radar Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Radio className="w-48 h-48 text-emerald-500 animate-pulse" />
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <ShieldAlert className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 tracking-tight">
                CYBER OPERATIONS & SOC DASHBOARD
              </h1>
              <p className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                Real-Time Telemetry • Security Event Feeds • Automated IP Enforcement
              </p>
            </div>
          </div>
        </div>

        {/* Threat Level Status Pill */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end relative z-10">
          <div className={`px-5 py-3 rounded-2xl border ${threatBadge.color} backdrop-blur-xl flex items-center gap-3 shadow-lg`}>
            <div className={`w-3 h-3 rounded-full ${threatBadge.pulse} animate-ping`}></div>
            <span className="text-xs font-mono font-black tracking-widest">{threatBadge.label}</span>
          </div>

          <button
            onClick={() => fetchCyberData()}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-zinc-300 transition-all hover:scale-105"
            title="Refresh Security Feeds"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cyber Security Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Telemetry Requests (24h)</p>
              <h3 className="text-3xl font-black text-white">{stats?.totalLogs24h || 0}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Live HTTP/API Traffic Signals
          </div>
        </div>

        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Auth Failures (24h)</p>
              <h3 className="text-3xl font-black text-amber-400">{stats?.failedLogins24h || 0}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400">
            <span>Potential Brute-Force Monitoring</span>
          </div>
        </div>

        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Critical Alerts (24h)</p>
              <h3 className="text-3xl font-black text-rose-400">{stats?.criticalEvents24h || 0}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-rose-400">
            <span>Security Threshold Violations</span>
          </div>
        </div>

        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Active IP Blocks</p>
              <h3 className="text-3xl font-black text-cyan-400">{stats?.blockedIPsCount || 0}</h3>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
              <Ban className="w-6 h-6" />
            </div>
          </div>
          <button
            onClick={() => setShowBlockModal(true)}
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest flex items-center gap-1 mt-1"
          >
            + Restrict IP Address
          </button>
        </div>
      </div>

      {/* Main Navigation & View Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-950/40 p-2 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'feed'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Security Event Feed
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'blocked'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Banned IPs ({blockedIPs.length})
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'sources'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Top Telemetry Sources
          </button>
        </div>

        {activeTab === 'feed' && (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search IP, route, Agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-full sm:w-48 font-mono"
              />
            </div>

            {/* Severity Dropdown */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="WARNING">Warning Only</option>
              <option value="INFO">Info Only</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: LIVE SECURITY EVENT FEED */}
      {activeTab === 'feed' && (
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest">
                Real-Time Security Event Stream
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Showing last 150 events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Event Type</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Endpoint / Resource</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Threat Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {logs.map((log) => {
                  const isBlocked = blockedIPs.some(b => b.ipAddress === log.ipAddress);
                  return (
                    <tr key={log._id} className="hover:bg-white/5 transition-all">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                          log.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {log.severity}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-white font-bold">
                        {log.eventType}
                      </td>

                      <td className="px-6 py-4 text-cyan-400">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-zinc-500" />
                          {log.ipAddress}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-zinc-300">
                        <span className="text-emerald-400 font-bold mr-2">{log.method}</span>
                        {log.endpoint}
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isBlocked ? (
                          <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                            <Lock className="w-3.5 h-3.5" /> Banned
                          </span>
                        ) : (
                          <button
                            onClick={() => handleBlockIP(log.ipAddress)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Block IP
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {logs.length === 0 && (
              <div className="p-12 text-center text-zinc-500 font-mono">
                <Shield className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
                <p>No security events matching current telemetry filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BANNED IPS */}
      {activeTab === 'blocked' && (
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-white">Active IP Blocklist</h3>
              <p className="text-xs font-mono text-zinc-400">Restricted IP addresses are automatically blocked by the express middleware.</p>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all"
            >
              + Add IP Block Rule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blockedIPs.map((b) => (
              <div key={b._id} className="bg-zinc-900/80 border border-rose-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-mono font-black text-rose-400">{b.ipAddress}</h4>
                    <p className="text-[10px] font-mono text-zinc-500">Blocked at: {new Date(b.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleUnblockIP(b.ipAddress)}
                    className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 text-xs transition-all"
                    title="Unblock IP"
                  >
                    <Unlock className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">Reason</span>
                  {b.reason}
                </p>
              </div>
            ))}

            {blockedIPs.length === 0 && (
              <div className="col-span-full p-12 text-center text-zinc-500 font-mono">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
                <p>No active IP bans currently enforced.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TOP TELEMETRY SOURCES */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest mb-4">
              Top Active Telemetry IP Sources (24h)
            </h3>
            <div className="space-y-4">
              {stats?.topIPs?.map((item: any, idx: number) => (
                <div key={item._id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-white">{item._id}</span>
                  </div>
                  <span className="px-3 py-1 bg-zinc-900 text-zinc-300 rounded-lg text-xs">
                    {item.count} events
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest mb-4">
              Security Event Type Breakdown
            </h3>
            <div className="space-y-4 font-mono text-xs">
              {stats?.eventBreakdown?.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="font-bold text-zinc-300">{item._id}</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg">
                    {item.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MANUAL IP BLOCK MODAL */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-950 border border-rose-500/40 w-full max-w-md p-6 rounded-[2.5rem] shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-rose-400 font-mono uppercase">Restrict IP Address</h3>
                  <p className="text-xs text-zinc-400">Enforce immediate traffic blockade for specific IP.</p>
                </div>
                <button onClick={() => setShowBlockModal(false)} className="text-zinc-500 hover:text-white">✕</button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">Target IP Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.100"
                    value={blockIpInput}
                    onChange={(e) => setBlockIpInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Reason for Ban</label>
                  <input
                    type="text"
                    placeholder="e.g. Repeated unauthorized API scan"
                    value={blockReasonInput}
                    onChange={(e) => setBlockReasonInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBlockIP()}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-widest shadow-lg shadow-rose-600/30"
                >
                  Enforce Block
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberActivityDashboard;
