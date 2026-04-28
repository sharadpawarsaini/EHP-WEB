import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
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
  ShieldAlert
} from 'lucide-react';
import { differenceInYears, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileTab = () => {
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
      setMessage('Profile photo updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/profile', profile);
      setMessage('Profile saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const getFullPhotoUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const base = api.defaults.baseURL?.replace('/api', '') || '';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const calculateAge = (dob: any) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    return differenceInYears(new Date(), birthDate);
  };

  const age = calculateAge(profile.dob);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase text-[10px]">Accessing Secure Vault...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Identity & Bio</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Your verified health credentials</p>
               </div>
               <AnimatePresence>
                {message && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-800/30">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{message}</span>
                  </motion.div>
                )}
               </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-gray-100 dark:border-slate-700">
               <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white dark:border-slate-700 shadow-2xl overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                    {profile.photoUrl ? (
                      <img src={getFullPhotoUrl(profile.photoUrl)!} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-16 h-16 text-gray-300" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white dark:border-slate-800"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
               </div>
               <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{profile.fullName || 'Verified Member'}</h3>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-4">EHP ID: #774-921-00</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                     <span className="px-3 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-slate-700">Level 4 Citizen</span>
                     <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">Verified</span>
                  </div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                     <input
                       type="text"
                       required
                       value={profile.fullName}
                       onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                       className="w-full px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-900 dark:text-white font-bold transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                     <input
                       type="date"
                       required
                       value={profile.dob}
                       onChange={(e) => setProfile({...profile, dob: e.target.value})}
                       className="w-full px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-900 dark:text-white font-bold transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender Identification</label>
                     <select
                       value={profile.gender}
                       onChange={(e) => setProfile({...profile, gender: e.target.value})}
                       className="w-full px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-900 dark:text-white font-bold transition-all"
                     >
                       <option value="Male">Male</option>
                       <option value="Female">Female</option>
                       <option value="Other">Other</option>
                       <option value="Prefer not to say">Prefer not to say</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Blood Type</label>
                     <select
                       required
                       value={profile.bloodGroup}
                       onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                       className="w-full px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-900 dark:text-white font-bold transition-all"
                     >
                        <option value="">Select Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                     </select>
                  </div>
               </div>
               
               <button
                 type="submit"
                 disabled={saving}
                 className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
               >
                 {saving ? 'Synchronizing Bio-Data...' : 'Update Health Passport'}
               </button>
            </form>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white dark:border-slate-700">
             <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Settings2 className="h-5 w-5 text-indigo-600" />
                Preferences & Units
             </h3>
             <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Language</label>
                   <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-xl font-bold text-sm">
                      <option value="English">English (US)</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Hindi">Hindi</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Measurement System</label>
                   <select value={units} onChange={(e) => setUnits(e.target.value)} className="w-full p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-xl font-bold text-sm">
                      <option value="Metric">Metric (kg/cm)</option>
                      <option value="Imperial">Imperial (lb/in)</option>
                   </select>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Digital Card & Security */}
        <div className="space-y-8">
           {/* Digital Health ID Card */}
           <div className="relative group perspective-1000">
              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/40 relative overflow-hidden h-[450px] flex flex-col justify-between">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-0 right-0 p-10 opacity-10">
                    <QrCode className="h-48 w-48" />
                 </div>
                 
                 <div className="relative z-10 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="h-8 w-8 text-white" />
                       <span className="text-xl font-black tracking-tighter uppercase">EHP GLOBAL</span>
                    </div>
                    <CreditCard className="h-8 w-8 opacity-50" />
                 </div>

                 <div className="relative z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden mb-6">
                       {profile.photoUrl ? (
                         <img src={getFullPhotoUrl(profile.photoUrl)!} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <UserCircle className="w-full h-full p-4 text-white/50" />
                       )}
                    </div>
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest leading-none mb-1">Passport Holder</p>
                    <h4 className="text-2xl font-black mb-6 truncate">{profile.fullName || '--- ---'}</h4>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Blood Group</p>
                          <p className="text-xl font-black">{profile.bloodGroup || '--'}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Member Since</p>
                          <p className="text-xl font-black">2024</p>
                       </div>
                    </div>
                 </div>

                 <div className="relative z-10 pt-6 border-t border-white/20 flex justify-between items-center">
                    <div className="flex gap-2">
                       <Zap className="h-4 w-4 text-amber-400" />
                       <span className="text-[10px] font-black tracking-widest uppercase">Verified Emergency ID</span>
                    </div>
                    <p className="text-[10px] font-black opacity-40">v2.4.0</p>
                 </div>
              </div>
           </div>

           {/* Account Security */}
           <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white dark:border-slate-700">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                 <ShieldAlert className="h-5 w-5 text-rose-600" />
                 Account Security
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-lg ${twoFA ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          <Fingerprint className="h-4 w-4" />
                       </div>
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300">2-Factor Auth</span>
                    </div>
                    <button onClick={() => setTwoFA(!twoFA)} className={`w-12 h-6 rounded-full transition-all relative ${twoFA ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${twoFA ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 group cursor-pointer hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-400">
                          <Globe className="h-4 w-4" />
                       </div>
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Active Sessions</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600" />
                 </div>
              </div>
           </div>

           {/* Social Connect */}
           <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white dark:border-slate-700">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Social Connections</h3>
              <div className="flex gap-4">
                 <button className="flex-1 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 transition-all"><Twitter className="h-5 w-5" /></button>
                 <button className="flex-1 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 transition-all"><Linkedin className="h-5 w-5" /></button>
                 <button className="flex-1 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-500 transition-all"><Mail className="h-5 w-5" /></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
