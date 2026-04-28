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
  EyeOff
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
    try {
      await api.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setStatus({ type: 'success', message: 'Password updated successfully' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setStatus({ type: '', message: '' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update password' });
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
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
            </button>
          )
        },
        {
          icon: <Bell className="w-5 h-5 text-blue-500" />,
          label: 'Health Alerts',
          description: 'Smart push notifications for vitals',
          action: (
            <button onClick={() => setPushEnabled(!pushEnabled)} className={`w-12 h-6 rounded-full transition-all relative ${pushEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pushEnabled ? 'right-1' : 'left-1'}`} />
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
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${voiceEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          )
        },
        {
          icon: <Map className="w-5 h-5 text-emerald-500" />,
          label: 'Guardian Radius',
          description: 'Alert guardians within 10km radius',
          action: <button className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">10km</button>
        },
        {
          icon: <EyeOff className="w-5 h-5 text-gray-500" />,
          label: 'Ghost Privacy',
          description: 'Hide profile from non-emergency scans',
          action: (
            <button onClick={() => setPrivacyMode(!privacyMode)} className={`w-12 h-6 rounded-full transition-all relative ${privacyMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacyMode ? 'right-1' : 'left-1'}`} />
            </button>
          )
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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Preferences</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Fine-tune your health passport and security logic</p>
         </div>
         <div className="flex gap-4">
            <button onClick={() => setShowDevicesModal(true)} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:scale-110 transition-all">
               <Smartphone className="h-5 w-5 text-blue-600" />
            </button>
            <button onClick={() => setShowPasswordModal(true)} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:scale-110 transition-all">
               <Lock className="h-5 w-5 text-indigo-600" />
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
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Security Checkup</span>
                        <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white transition-all" />
                     </div>
                     <button onClick={() => setShowDeleteModal(true)} className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-rose-400 transition-all">
                        Deactivate Passport
                     </button>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30">
               <h4 className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest mb-4">Export Protocol</h4>
               <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium mb-6">Download your full medical history in HL7/FHIR compliant JSON or PDF format for clinical portability.</p>
               <button className="w-full py-4 bg-white dark:bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-blue-600 shadow-lg shadow-blue-600/10 hover:scale-105 transition-all">
                  Request Archive
               </button>
            </div>
         </div>
      </div>

      <div className="text-center pt-8">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">EHP GLOBAL • v2.4.0 • SECURED</p>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative">
                <button onClick={() => setShowPasswordModal(false)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-slate-900 rounded-full"><X className="h-4 w-4" /></button>
                <h3 className="text-2xl font-black mb-8 text-gray-900 dark:text-white">Secure Access</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                   <input type="password" placeholder="Current Password" required className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" />
                   <input type="password" placeholder="New Encryption Key" required className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" />
                   <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">Update Security</button>
                </form>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsTab;
