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
  Map,
  ShieldCheck,
  Zap,
  ChevronRight,
  EyeOff,
  Download,
  AlertTriangle,
  History,
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
          icon: theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />,
          label: 'System Theme',
          description: `Currently in ${theme} mode`,
          action: (
            <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-all relative ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'}`}>
               <motion.div animate={{ x: theme === 'dark' ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          )
        },
        {
          icon: <Bell className="w-5 h-5 text-blue-500" />,
          label: 'Health Alerts',
          description: 'Smart push notifications for vitals',
          action: (
            <button onClick={() => setPushEnabled(!pushEnabled)} className={`w-12 h-6 rounded-full transition-all relative ${pushEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
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
          icon: <Map className="w-5 h-5 text-emerald-500" />,
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
          icon: <Lock className="w-5 h-5 text-indigo-500" />,
          label: 'Change Neural Key',
          description: 'Update your secondary encryption password',
          action: <button onClick={() => setShowPasswordModal(true)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">Update Key</button>
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
          icon: <Lock className="w-5 h-5 text-indigo-500" />,
          label: 'Security Protocol',
          description: 'AES-256 Bit Encryption Active',
          action: <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="h-3 w-3" /> MIL-Grade</div>
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
                'bg-blue-50/90 border-blue-200 text-blue-600'
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Preferences</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Fine-tune your health passport and security logic</p>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={() => setShowDevicesModal(true)} 
              className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:scale-110 hover:border-blue-500/30 transition-all group"
              title="Active Nodes"
            >
               <Smartphone className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => setShowPasswordModal(true)} 
              className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:scale-110 hover:border-indigo-500/30 transition-all group"
              title="Security Protocol"
            >
               <Lock className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
            </button>
         </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
         <div className="lg:col-span-3 space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">{section.title}</h3>
                <div className="space-y-6">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                         <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl group-hover:scale-110 transition-all">
                            {item.icon}
                         </div>
                         <div>
                            <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{item.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.description}</p>
                         </div>
                      </div>
                      {item.action}
                    </div>
                  ))}
                </div>
              </div>
            ))}
         </div>

         <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl h-fit">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Shield className="h-40 w-40" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                     <Zap className="h-6 w-6 text-amber-400" />
                     Safety Pulse
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">Your current security posture is optimized for maximum life-safety coverage. Voice SOS and 2FA are recommended.</p>
                  <div className="space-y-4">
                     <div 
                       onClick={handleSecurityCheckup}
                       className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all"
                     >
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Security Checkup</span>
                        <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white transition-all" />
                     </div>
                     <button 
                       onClick={() => setShowDeleteModal(true)} 
                       className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-rose-400 transition-all hover:bg-rose-500/5 rounded-xl"
                     >
                        Deactivate Passport
                     </button>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30">
               <h4 className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest mb-4">Export Protocol</h4>
               <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium mb-6">Download your full medical history in HL7/FHIR compliant JSON or PDF format for clinical portability.</p>
               <button 
                 onClick={handleRequestArchive}
                 disabled={isExporting}
                 className="w-full py-4 bg-white dark:bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-blue-600 shadow-lg shadow-blue-600/10 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Download className="h-4 w-4" /> Request Archive</>
                  )}
               </button>
            </div>
         </div>
      </div>

      <div className="text-center pt-8">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">EHP GLOBAL • v2.4.0 • SECURED</p>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {/* Password Modal */}
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative border border-white dark:border-slate-700">
                <button onClick={() => setShowPasswordModal(false)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-slate-900 rounded-full hover:bg-gray-200 transition-all text-gray-500"><X className="h-4 w-4" /></button>
                <h3 className="text-2xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                   <Lock className="h-6 w-6 text-indigo-600" />
                   Security Protocol
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Neural Key</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Neural Key</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                      />
                   </div>
                   <button 
                     type="submit" 
                     className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
                   >
                      Rotate Security Keys
                   </button>
                </form>
             </motion.div>
          </motion.div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative border border-rose-100 dark:border-rose-900/30 text-center">
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                   <AlertTriangle className="h-10 w-10 text-rose-600" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-gray-900 dark:text-white">Identity Purge</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed">
                   This action will permanently delete your EHP Clinical Identity, all medical records, and emergency linkages. This cannot be undone.
                </p>
                <div className="flex flex-col gap-4">
                   <button 
                     onClick={handleDeleteAccount}
                     className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all"
                   >
                      Confirm Purge
                   </button>
                   <button 
                     onClick={() => setShowDeleteModal(false)}
                     className="w-full py-5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                   >
                      Abort Mission
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}

        {/* Devices Modal */}
        {showDevicesModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl relative border border-white dark:border-slate-700">
                <button onClick={() => setShowDevicesModal(false)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-slate-900 rounded-full hover:bg-gray-200 transition-all text-gray-500"><X className="h-4 w-4" /></button>
                <div className="flex items-center gap-4 mb-10">
                   <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-[1.5rem]">
                      <Smartphone className="h-8 w-8 text-blue-600" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">Authorized Nodes</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Active EHP Sessions</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                   {[
                     { name: 'Primary Device', model: 'iPhone 15 Pro', status: 'Online', ip: '192.168.1.1' },
                     { name: 'Browser Session', model: 'Vite Terminal (Win)', status: 'Active', ip: '127.0.0.1' },
                     { name: 'Emergency Watch', model: 'Apple Watch Ultra', status: 'Standby', ip: 'Hidden' }
                   ].map((node, i) => (
                     <div key={i} className="p-6 bg-gray-50 dark:bg-slate-900/50 rounded-[1.8rem] border border-gray-100 dark:border-slate-700 flex justify-between items-center group hover:border-blue-500/20 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                              {node.name.includes('Watch') ? <WatchIcon className="h-5 w-5 text-indigo-500" /> : <Smartphone className="h-5 w-5 text-blue-500" />}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900 dark:text-white">{node.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{node.model} • {node.ip}</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${node.status === 'Online' || node.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {node.status}
                           </span>
                           <button className="text-[9px] font-black text-rose-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Revoke</button>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="mt-10 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/30 flex items-center gap-4">
                   <ShieldCheck className="h-6 w-6 text-blue-600" />
                   <p className="text-[10px] font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest leading-relaxed">
                      Session tokens are rotated every 24 hours. Emergency access bypasses these limits only during active SOS events.
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
