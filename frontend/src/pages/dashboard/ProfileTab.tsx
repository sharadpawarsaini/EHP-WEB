import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useProfileContext } from '../../context/ProfileContext';
import { 
  Camera, 
  UserCircle, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Fingerprint, 
  Settings2, 
  LogOut, 
  QrCode, 
  CreditCard,
  Zap,
  Twitter,
  Linkedin,
  Mail,
  ChevronRight,
  ShieldAlert,
  Dna,
  Binary,
  Cpu,
  Smartphone,
  Lock,
  ArrowRight
} from 'lucide-react';
import { differenceInYears, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getFullPhotoUrl } from '../../utils/url';

const ProfileTab = () => {
  const { refreshProfile } = useProfileContext();
  const [profile, setProfile] = useState({
    fullName: '',
    dob: '',
    gender: 'Prefer not to say',
    bloodGroup: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Additional mock settings
  const [twoFA, setTwoFA] = useState(true);
  const [units, setUnits] = useState('Metric');
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        if (data && data.fullName) {
          setProfile({
            ...data,
            dob: data.dob ? data.dob.split('T')[0] : ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    try {
      const { data } = await api.post('/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, photoUrl: data.photoUrl });
      await refreshProfile();
      setMessage('Biometric identification updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update biometric ID');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/profile', profile);
      await refreshProfile();
      setMessage('Clinical identity synchronized');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Identity sync failed');
    } finally {
      setSaving(false);
    }
  };



  const calculateAge = (dob: any) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    return differenceInYears(new Date(), birthDate);
  };

  const age = calculateAge(profile.dob);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Secure Vault...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Header Widget */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Level 4 Citizen</span>
               <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Encrypted Identity</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Identity & Bio</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Verify clinical credentials and biometric identification</p>
         </div>
         <AnimatePresence>
           {message && (
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-800/30 shadow-xl shadow-emerald-500/10">
               <CheckCircle2 className="h-5 w-5" />
               <span className="text-[10px] font-black uppercase tracking-widest">{message}</span>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left: Bio Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-xl border border-white dark:border-slate-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5">
               <Dna className="h-40 w-40" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-10 mb-12 pb-12 border-b border-gray-50 dark:border-slate-700 relative z-10">
               <div className="relative group">
                  <div className="w-40 h-40 rounded-[3rem] border-8 border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
                    {profile.photoUrl ? (
                      <img src={getFullPhotoUrl(profile.photoUrl)!} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-20 h-20 text-gray-300" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-4 bg-emerald-600 text-white rounded-[1.5rem] shadow-2xl hover:scale-110 transition-all border-4 border-white dark:border-slate-800 group-hover:rotate-12"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
               </div>
               <div className="text-center sm:text-left space-y-4">
                  <div>
                     <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{profile.fullName || 'Unidentified Member'}</h3>
                     <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mt-1">EHP ID: #774-921-00</p>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                     <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">Biometrics Active</span>
                     <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">Verified Node</span>
                  </div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Designation</label>
                     <input
                       type="text"
                       required
                       value={profile.fullName}
                       onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                       className="w-full px-6 py-5 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-gray-900 dark:text-white font-black transition-all"
                       placeholder="Enter full name..."
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Birth Date</label>
                     <input
                       type="date"
                       required
                       value={profile.dob}
                       onChange={(e) => setProfile({...profile, dob: e.target.value})}
                       className="w-full px-6 py-5 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-gray-900 dark:text-white font-black transition-all"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender Identification</label>
                     <select
                       value={profile.gender}
                       onChange={(e) => setProfile({...profile, gender: e.target.value})}
                       className="w-full px-6 py-5 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-gray-900 dark:text-white font-black transition-all appearance-none"
                     >
                       <option value="Male">Male</option>
                       <option value="Female">Female</option>
                       <option value="Other">Other</option>
                       <option value="Prefer not to say">Prefer not to say</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Blood Type Cluster</label>
                     <select
                       required
                       value={profile.bloodGroup}
                       onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                       className="w-full px-6 py-5 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-gray-900 dark:text-white font-black transition-all appearance-none"
                     >
                        <option value="">Select Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                     </select>
                  </div>
               </div>
               
               <button
                 type="submit"
                 disabled={saving}
                 className="w-full py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-[0.2em]"
               >
                 {saving ? 'Synchronizing Identity...' : 'Update Clinical Identity'}
               </button>
            </form>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white dark:border-slate-700 flex flex-col justify-between">
                <div>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <Settings2 className="h-5 w-5 text-emerald-600" />
                      Global Config
                   </h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-50 dark:border-slate-700">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Language</span>
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-300">English (US)</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-50 dark:border-slate-700">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Units</span>
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Metric (SI)</span>
                      </div>
                   </div>
                </div>
                <button className="w-full mt-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-600 hover:underline flex items-center justify-center gap-2">
                   Advanced Preferences <ChevronRight className="h-4 w-4" />
                </button>
             </div>
             <div className="bg-gradient-to-br from-emerald-600 to-primary-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <Zap className="h-8 w-8 text-amber-400 mb-6" />
                <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">EHP Pro Sync</h3>
                <p className="text-primary-100/80 text-sm font-medium leading-relaxed mb-6">
                   Your clinical identity is automatically synchronized across all nodes of the EHP network including emergency responders.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                   <ShieldCheck className="h-4 w-4 text-emerald-400" /> Live Data Relay
                </div>
             </div>
          </div>
        </div>

        {/* Right: Digital Passport Card */}
        <div className="space-y-10">
           {/* Passport Visualization */}
           <motion.div 
             whileHover={{ y: -10, rotateY: 5 }}
             className="relative group perspective-1000"
           >
              <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-3xl relative overflow-hidden h-[500px] flex flex-col justify-between border border-white/10">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-primary-600/20"></div>
                 <div className="absolute -bottom-20 -right-20 p-20 opacity-10">
                    <QrCode className="h-64 w-64" />
                 </div>
                 
                 <div className="relative z-10 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                          <Binary className="h-6 w-6 text-emerald-400" />
                       </div>
                       <span className="text-lg font-black tracking-tighter uppercase">Clinical Passport</span>
                    </div>
                    <Cpu className="h-6 w-6 text-white/30" />
                 </div>

                 <div className="relative z-10">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[2rem] border-4 border-white/20 overflow-hidden mb-8 shadow-2xl">
                       {profile.photoUrl ? (
                         <img src={getFullPhotoUrl(profile.photoUrl)!} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <UserCircle className="w-full h-full p-5 text-white/30" />
                       )}
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-none mb-2">Subject Designation</p>
                    <h4 className="text-3xl font-black mb-8 leading-tight">{profile.fullName || '--- ---'}</h4>
                    
                    <div className="grid grid-cols-2 gap-10">
                       <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Blood Type</p>
                          <p className="text-2xl font-black text-emerald-400">{profile.bloodGroup || '--'}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Birth Cycle</p>
                          <p className="text-2xl font-black">{profile.dob ? profile.dob.split('-')[0] : '----'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="relative z-10 pt-8 border-t border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4 text-emerald-400" />
                       <span className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400">Secure Protocol v4.0</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 </div>
              </div>
           </motion.div>

           {/* Security Hub */}
           <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-8 shadow-xl border border-white dark:border-slate-700">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                 <Lock className="h-5 w-5 text-rose-600" />
                 Vault Security
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-50 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-xl ${twoFA ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          <Fingerprint className="h-5 w-5" />
                       </div>
                       <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Biometric 2FA</span>
                    </div>
                    <button onClick={() => setTwoFA(!twoFA)} className={`w-14 h-7 rounded-full transition-all relative ${twoFA ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-200 dark:bg-slate-700'}`}>
                       <motion.div 
                          animate={{ x: twoFA ? 28 : 4 }}
                          className="absolute top-1.5 w-4 h-4 bg-white rounded-full shadow-sm" 
                       />
                    </button>
                 </div>
                 
                 <button className="w-full p-5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-600 hover:text-white transition-all group">
                    View Active Sessions
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="bg-rose-50/50 dark:bg-rose-900/10 rounded-[2.5rem] p-8 border border-rose-100 dark:border-rose-900/30">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">Hazard Zone</p>
              <button className="w-full py-4 bg-white dark:bg-slate-800 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800/30">
                 Purge Clinical Identity
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
