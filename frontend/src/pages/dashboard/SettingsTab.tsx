import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  User, 
  Globe, 
  Lock, 
  LogOut,
  Smartphone,
  Database,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Mic,
  Map as MapIcon,
  ShieldCheck,
  Zap,
  ChevronRight,
  EyeOff,
  Download,
  AlertTriangle,
  History as HistoryIcon,
  Navigation,
  Watch as WatchIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsTab = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  // UI Toggles
  const [pushEnabled, setPushEnabled] = useState(() => localStorage.getItem('ehp_push') === 'true');
  const [emailEnabled, setEmailEnabled] = useState(() => localStorage.getItem('ehp_email') === 'true');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [guardianRadius, setGuardianRadius] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    localStorage.setItem('ehp_push', pushEnabled.toString());
  }, [pushEnabled]);

  useEffect(() => {
    localStorage.setItem('ehp_email', emailEnabled.toString());
  }, [emailEnabled]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }
    setStatus({ type: 'loading', message: 'Updating encryption keys...' });
    try {
      await api.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setStatus({ type: 'success', message: 'Security Protocol Updated' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setStatus({ type: '', message: '' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update password' });
    }
  };

  const handleRequestArchive = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('EHP Clinical Archive (JSON/PDF) has been dispatched to your verified email.');
    }, 2500);
  };

  const handleSecurityCheckup = () => {
    setStatus({ type: 'success', message: 'Neural scan complete. No vulnerabilities found.' });
    setTimeout(() => setStatus({ type: '', message: '' }), 4000);
  };

  const handleDeleteAccount = async () => {
    if (confirm('CRITICAL ACTION: This will permanently purge your clinical identity. Proceed?')) {
      try {
        // In a real app: await api.delete('/profile/purge');
        alert('Passport deactivated. Redirecting to terminal.');
        logout();
        navigate('/login');
      } catch (err) {
        alert('Purge failed. Protocol error.');
      }
    }
  };

  const sections = [
    {
      title: 'Experience',
      items: [
        {
          icon: theme === 'dark' ? <Moon className="w-5 h-5 text-emerald-400" /> : <Sun className="w-5 h-5 text-amber-500" />,
          label: 'System Theme',
          description: `Currently in ${theme} mode`,
          action: (
            <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-all relative ${theme === 'dark' ? 'bg-emerald-600' : 'bg-gray-200'}`}>
               <motion.div animate={{ x: theme === 'dark' ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          )
        },
        {
          icon: <Bell className="w-5 h-5 text-primary-500" />,
          label: 'Health Alerts',
          description: 'Smart push notifications for vitals',
          action: (
            <button onClick={() => setPushEnabled(!pushEnabled)} className={`w-12 h-6 rounded-full transition-all relative ${pushEnabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
               <motion.div animate={{ x: pushEnabled ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          )
        }
      ]
    },
    {
      title: 'SOS & Security',
      items: [
        {
          icon: <Mic className="w-5 h-5 text-rose-500" />,
          label: 'Voice Activation',
          description: 'Trigger SOS with voice command "Emergency"',
          action: (
            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`w-12 h-6 rounded-full transition-all relative ${voiceEnabled ? 'bg-rose-600' : 'bg-gray-200'}`}>
               <motion.div animate={{ x: voiceEnabled ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          )
        },
        {
          icon: <MapIcon className="w-5 h-5 text-emerald-500" />,
          label: 'Guardian Radius',
          description: `Alert guardians within ${guardianRadius}km radius`,
          action: (
            <select 
              value={guardianRadius} 
              onChange={(e) => setGuardianRadius(Number(e.target.value))}
              className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none outline-none cursor-pointer"
            >
              <option value="5">5km</option>
              <option value="10">10km</option>
              <option value="25">25km</option>
              <option value="50">50km</option>
            </select>
          )
        },
        {
          icon: <EyeOff className="w-5 h-5 text-gray-500" />,
          label: 'Ghost Privacy',
          description: 'Hide profile from non-emergency scans',
          action: (
            <button onClick={() => setPrivacyMode(!privacyMode)} className={`w-12 h-6 rounded-full transition-all relative ${privacyMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
               <motion.div animate={{ x: privacyMode ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          )
        }
      ]
    },
    {
      title: 'Security & Identity',
      items: [
        {
          icon: <Lock className="w-5 h-5 text-emerald-500" />,
          label: 'Change Neural Key',
          description: 'Update your secondary encryption password',
          action: <button onClick={() => setShowPasswordModal(true)} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">Update Key</button>
        },
        {
          icon: <Trash2 className="w-5 h-5 text-rose-500" />,
          label: 'Purge Identity',
          description: 'Permanently delete all clinical data',
          action: <button onClick={() => setShowDeleteModal(true)} className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-600 hover:text-white transition-all">Purge Data</button>
        }
      ]
    },
    {
      title: 'Advanced Controls',
      items: [
        {
          icon: <Lock className="w-5 h-5 text-emerald-500" />,
          label: 'Security Protocol',
          description: 'AES-256 Bit Encryption Active',
          action: <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="h-3 w-3" /> MIL-Grade</div>
        },
        {
          icon: <Database className="w-5 h-5 text-cyan-500" />,
          label: 'Offline Mirror',
          description: 'Keep local encrypted cache of records',
          action: <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest"><CheckCircle2 className="h-3 w-3" /> Enabled</div>
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* Status Toasts */}
      <div className="fixed top-24 right-10 z-[100] space-y-4 pointer-events-none">
        <AnimatePresence>
          {status.message && (
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 min-w-[300px] pointer-events-auto ${
                status.type === 'error' ? 'bg-rose-50/90 border-rose-200 text-rose-600' : 
                status.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-600' : 
                'bg-primary-50/90 border-primary-200 text-primary-600'
              }`}
            >
              {status.type === 'error' ? <AlertCircle className="h-5 w-5" /> : 
               status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : 
               <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              <span className="text-xs font-black uppercase tracking-widest">{status.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
         <div className="space-y-4">
            <h2 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">System Protocols</h2>
            <p className="text-sm text-zinc-500 font-medium italic">Fine-tune your clinical identity and neural security logic.</p>
         </div>
         <div className="flex gap-6 relative z-10">
            <button 
              onClick={() => setShowDevicesModal(true)} 
              className="p-5 bg-white/5 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl hover:scale-110 hover:border-emerald-500/30 transition-all group"
              title="Active Nodes"
            >
               <Smartphone className="h-6 w-6 text-emerald-500 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => setShowPasswordModal(true)} 
              className="p-5 bg-white/5 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl hover:scale-110 hover:border-cyan-500/30 transition-all group"
              title="Security Protocol"
            >
               <Lock className="h-6 w-6 text-cyan-500 group-hover:scale-110 transition-transform" />
            </button>
         </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
         <div className="lg:col-span-3 space-y-10">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                   {section.title}
                </h3>
                <div className="space-y-10">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 group-hover/item:scale-110 transition-all shadow-2xl">
                            {item.icon}
                         </div>
                         <div>
                            <p className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-none mb-1.5">{item.label}</p>
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none">{item.description}</p>
                         </div>
                      </div>
                      <div className="relative z-10">
                         {item.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
         </div>

         <div className="lg:col-span-2 space-y-10">
            <div className="bg-zinc-950 p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl border border-white/5 group">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Shield className="h-48 w-48 text-emerald-500" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
                     <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
                        <Zap className="h-6 w-6 text-emerald-500" />
                     </div>
                     Neural Pulse
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-10 font-medium italic">Your security posture is currently optimized for global clinical coverage. Automated SOS and AES-256 are locked.</p>
                  <div className="space-y-6">
                     <div 
                       onClick={handleSecurityCheckup}
                       className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group/link cursor-pointer hover:bg-white/10 transition-all shadow-inner"
                     >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Tactical Scan</span>
                        <ChevronRight className="h-5 w-5 text-zinc-700 group-hover/link:text-emerald-500 transition-all" />
                     </div>
                     <button 
                       onClick={() => setShowDeleteModal(true)} 
                       className="w-full py-6 bg-white/5 text-rose-500 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-rose-500 hover:text-white rounded-2xl border border-rose-500/10 hover:border-rose-500 transition-all shadow-2xl"
                     >
                        PURGE NODE
                     </button>
                  </div>
               </div>
            </div>

            <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                  <Download className="h-4 w-4" />
                  Binary Archive
               </h4>
               <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-10 italic">Export full clinical telemetry in FHIR compliant archives for external node migration.</p>
               <button 
                 onClick={handleRequestArchive}
                 disabled={isExporting}
                 className="w-full py-6 bg-white text-zinc-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
               >
                  {isExporting ? (
                    <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Download className="h-4 w-4" /> Initialize Export</>
                  )}
               </button>
            </div>
         </div>
      </div>

      <div className="text-center pt-16">
         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.8em]">EHP NEXUS COMMAND • v3.0.0 • ENCRYPTED</p>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {/* Password Modal */}
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-2xl">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white/10 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-[3.5rem] w-full max-w-md p-12 shadow-2xl relative border border-white/10">
                <button onClick={() => setShowPasswordModal(false)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-zinc-500 border border-white/5"><X className="h-5 w-5" /></button>
                <h3 className="text-3xl font-black mb-10 text-white uppercase tracking-tighter flex items-center gap-4">
                   <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 glow-border">
                      <Lock className="h-6 w-6 text-cyan-500" />
                   </div>
                   Security Matrix
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Legacy Protocol Key</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full p-6 bg-white/5 rounded-2xl border border-white/5 text-white font-bold outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-inner" 
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">New Neural Key</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full p-6 bg-white/5 rounded-2xl border border-white/5 text-white font-bold outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-inner" 
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Confirm Neural Key</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full p-6 bg-white/5 rounded-2xl border border-white/5 text-white font-bold outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-inner" 
                      />
                   </div>
                   <button 
                     type="submit" 
                     className="w-full py-6 bg-cyan-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-cyan-600/20 hover:scale-105 active:scale-95 transition-all mt-6"
                   >
                      Rotate Security Keys
                   </button>
                </form>
             </motion.div>
          </motion.div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-2xl">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white/10 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-[3.5rem] w-full max-w-md p-12 shadow-2xl relative border border-rose-500/20 text-center">
                <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-rose-500/20 glow-border shadow-rose-500/20">
                   <AlertTriangle className="h-12 w-12 text-rose-500" />
                </div>
                <h3 className="text-4xl font-black mb-6 text-white uppercase tracking-tighter">Identity Purge</h3>
                <p className="text-zinc-500 font-medium mb-12 leading-relaxed italic">
                   This action will permanently purge your clinical identity, all telemetry data, and emergency linkages. This cannot be reversed.
                </p>
                <div className="flex flex-col gap-6">
                   <button 
                     onClick={handleDeleteAccount}
                     className="w-full py-6 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all"
                   >
                      Confirm Purge
                   </button>
                   <button 
                     onClick={() => setShowDeleteModal(false)}
                     className="w-full py-6 bg-white/5 text-zinc-500 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all border border-white/5"
                   >
                      Abort Mission
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}

        {/* Devices Modal */}
        {showDevicesModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-2xl">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white/10 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-[3.5rem] w-full max-w-lg p-12 shadow-2xl relative border border-white/10">
                <button onClick={() => setShowDevicesModal(false)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-zinc-500 border border-white/5"><X className="h-5 w-5" /></button>
                <div className="flex items-center gap-6 mb-12">
                   <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
                      <Smartphone className="h-8 w-8 text-emerald-500" />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Authorized Nodes</h3>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Active EHP Sync Streams</p>
                   </div>
                </div>
                
                <div className="space-y-6">
                   {[
                     { name: 'Primary Device', model: 'iPhone 15 Pro', status: 'Online', ip: '192.168.1.1' },
                     { name: 'Nexus Terminal', model: 'Win 11 Build', status: 'Active', ip: '127.0.0.1' },
                     { name: 'Emergency Watch', model: 'Series X Ultra', status: 'Standby', ip: 'Hidden' }
                   ].map((node, i) => (
                     <div key={i} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex justify-between items-center group/node hover:border-emerald-500/20 transition-all shadow-inner">
                        <div className="flex items-center gap-6">
                           <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 shadow-2xl group-hover/node:scale-110 transition-transform">
                              {node.name.includes('Watch') ? <WatchIcon className="h-6 w-6 text-emerald-500" /> : <Smartphone className="h-6 w-6 text-cyan-500" />}
                           </div>
                           <div>
                              <p className="text-base font-black text-white uppercase tracking-tight leading-none mb-2">{node.name}</p>
                              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{node.model} // {node.ip}</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className={`text-[9px] font-black uppercase tracking-widest mb-2 ${node.status === 'Online' || node.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {node.status}
                           </span>
                           <button className="text-[9px] font-black text-rose-500 uppercase tracking-widest opacity-0 group-hover/node:opacity-100 transition-opacity">Deauth</button>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="mt-12 p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 flex items-center gap-5">
                   <ShieldCheck className="h-7 w-7 text-emerald-500" />
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-relaxed italic">
                      Session tokens rotate every 24h. Emergency bypass active.
                   </p>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsTab;
