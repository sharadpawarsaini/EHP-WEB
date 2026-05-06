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
      const payload = {
        fullName: profile.fullName,
        dob: profile.dob,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        photoUrl: profile.photoUrl
      };
      await api.post('/profile', payload);
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-12">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">Level 4 Citizen</span>
               <span className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">Nexus Identity Node</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">Profile Matrix</h2>
            <p className="text-sm text-zinc-500 font-medium italic">Manage clinical telemetry nodes and biometric verification protocols.</p>
         </div>
         <AnimatePresence>
           {message && (
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 text-emerald-500 rounded-2xl flex items-center gap-4 shadow-2xl relative z-10 overflow-hidden group">
               <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">{message}</span>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left: Bio Form */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl rounded-[3.5rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <Dna className="h-48 w-48 text-emerald-500" />
            </div>
 
            <div className="flex flex-col sm:flex-row items-center gap-12 mb-12 pb-12 border-b border-white/5 relative z-10">
               <div className="relative group/photo">
                  <div className="w-48 h-48 rounded-[3.5rem] border-8 border-zinc-900 shadow-2xl overflow-hidden bg-zinc-900 flex items-center justify-center transition-all group-hover/photo:scale-105 duration-500 group-hover/photo:border-emerald-500/30 p-1">
                    {profile.photoUrl ? (
                      <img src={getFullPhotoUrl(profile.photoUrl)!} alt="Profile" className="w-full h-full object-cover rounded-[3rem]" />
                    ) : (
                      <UserCircle className="w-24 h-24 text-zinc-800" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center rounded-[3.5rem]">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-3 -right-3 p-5 bg-emerald-600 text-white rounded-3xl shadow-2xl hover:scale-110 transition-all border-4 border-zinc-900 group-hover/photo:rotate-12 group-hover/photo:bg-emerald-500"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
               </div>
               <div className="text-center sm:text-left space-y-5">
                  <div>
                     <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3">{profile.fullName || 'Unidentified Node'}</h3>
                     <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] glow-text">Nexus Relay: #774-921-00</p>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                     <span className="px-5 py-2 bg-emerald-500/10 rounded-xl text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">Biometric Uplink Active</span>
                     <span className="px-5 py-2 bg-cyan-500/10 rounded-xl text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">Verified Neural Node</span>
                  </div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Legal Designation</label>
                     <input
                       type="text"
                       required
                       value={profile.fullName}
                       onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                       className="w-full px-7 py-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none text-white font-bold transition-all shadow-inner placeholder:text-zinc-700"
                       placeholder="Enter full name..."
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Birth Cycle</label>
                     <input
                       type="date"
                       required
                       value={profile.dob}
                       onChange={(e) => setProfile({...profile, dob: e.target.value})}
                       className="w-full px-7 py-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none text-white font-black uppercase tracking-widest text-[11px] transition-all shadow-inner"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Gender Identification</label>
                     <select
                       value={profile.gender}
                       onChange={(e) => setProfile({...profile, gender: e.target.value})}
                       className="w-full px-7 py-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none text-white font-black uppercase tracking-widest text-[11px] transition-all appearance-none shadow-inner"
                     >
                       <option value="Male" className="bg-zinc-950">Male</option>
                       <option value="Female" className="bg-zinc-950">Female</option>
                       <option value="Other" className="bg-zinc-950">Other</option>
                       <option value="Prefer not to say" className="bg-zinc-950">Prefer not to say</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Blood Type Cluster</label>
                     <select
                       required
                       value={profile.bloodGroup}
                       onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                       className="w-full px-7 py-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none text-white font-black uppercase tracking-widest text-[11px] transition-all appearance-none shadow-inner"
                     >
                        <option value="" className="bg-zinc-950">Select Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g} className="bg-zinc-950">{g}</option>)}
                     </select>
                  </div>
               </div>
               
               <button
                 type="submit"
                 disabled={saving}
                 className="w-full py-7 bg-white text-zinc-950 font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em] relative z-10"
               >
                 {saving ? 'Synchronizing Nexus Identity...' : 'Confirm Clinical Identity'}
               </button>
            </form>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
             <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl rounded-[3.5rem] p-10 shadow-2xl border border-white/10 flex flex-col justify-between group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="relative z-10">
                   <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tighter leading-none">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <Settings2 className="h-6 w-6 text-emerald-500" />
                      </div>
                      Global Configuration
                   </h3>
                   <div className="space-y-5">
                      <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner group/item hover:border-emerald-500/30 transition-all">
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Language Matrix</span>
                         <span className="text-xs font-black text-white uppercase tracking-widest group-hover/item:text-emerald-500 transition-colors">English (US)</span>
                      </div>
                      <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner group/item hover:border-emerald-500/30 transition-all">
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Standard Units</span>
                         <span className="text-xs font-black text-white uppercase tracking-widest group-hover/item:text-emerald-500 transition-colors">Metric (SI)</span>
                      </div>
                   </div>
                </div>
                <button className="w-full mt-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 hover:text-emerald-400 flex items-center justify-center gap-3 relative z-10">
                   Advanced Logic <ChevronRight className="h-5 w-5" />
                </button>
             </div>
             <div className="bg-zinc-950 rounded-[3.5rem] p-10 text-white shadow-3xl border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                   <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 w-fit mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <Zap className="h-8 w-8 text-emerald-500" />
                   </div>
                   <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter leading-none">Nexus Pro Sync</h3>
                   <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 italic">
                      Your clinical identity is automatically synchronized across all authorized nodes of the EHP network including active emergency responders.
                   </p>
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner w-fit">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> Live Data Relay Active
                   </div>
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
              <div className="bg-zinc-950 rounded-[3.5rem] p-12 text-white shadow-3xl relative overflow-hidden h-[550px] flex flex-col justify-between border border-white/10 group-hover:border-emerald-500/30 transition-all duration-500">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-cyan-600/10"></div>
                 <div className="absolute -bottom-20 -right-20 p-20 opacity-5 pointer-events-none group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
                    <QrCode className="h-72 w-72" />
                 </div>
                 
                 <div className="relative z-10 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
                          <Binary className="h-7 w-7 text-emerald-500" />
                       </div>
                       <span className="text-xl font-black tracking-[0.2em] uppercase">Clinical Passport</span>
                    </div>
                    <Cpu className="h-7 w-7 text-zinc-800 animate-pulse" />
                 </div>
 
                 <div className="relative z-10">
                    <div className="w-28 h-28 bg-zinc-900 rounded-[2.5rem] border-4 border-white/5 overflow-hidden mb-10 shadow-2xl group-hover:border-emerald-500/30 transition-all p-1">
                       {profile.photoUrl ? (
                         <img src={getFullPhotoUrl(profile.photoUrl)!} alt="Profile" className="w-full h-full object-cover rounded-[2.2rem]" />
                       ) : (
                         <UserCircle className="w-full h-full p-6 text-zinc-800" />
                       )}
                    </div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] leading-none mb-3">Subject Designation</p>
                    <h4 className="text-4xl font-black mb-10 tracking-tighter uppercase leading-none group-hover:text-emerald-500 transition-colors">{profile.fullName || 'UNIDENTIFIED'}</h4>
                    
                    <div className="grid grid-cols-2 gap-12">
                       <div>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">Blood Group</p>
                          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{profile.bloodGroup || '--'}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">Birth Cycle</p>
                          <p className="text-3xl font-black tracking-tighter">{profile.dob ? profile.dob.split('-')[0] : '----'}</p>
                       </div>
                    </div>
                 </div>
 
                 <div className="relative z-10 pt-10 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                       </div>
                       <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-600">Nexus Protocol v4.0</span>
                    </div>
                    <div className="flex gap-1.5">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                       <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse delay-75 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Security Hub */}
           <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl rounded-[3.5rem] p-10 shadow-2xl border border-white/10 group">
              <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-tighter leading-none">
                 <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                   <Lock className="h-6 w-6 text-rose-500" />
                 </div>
                 Vault Security
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 shadow-inner group/toggle hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-2xl border transition-all ${twoFA ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]'}`}>
                          <Fingerprint className="h-6 w-6" />
                       </div>
                       <div>
                          <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Access Protocol</span>
                          <span className="block text-xs font-black text-white uppercase tracking-widest">Biometric 2FA</span>
                       </div>
                    </div>
                    <button onClick={() => setTwoFA(!twoFA)} className={`w-16 h-8 rounded-full transition-all relative ${twoFA ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-900 border border-white/5'}`}>
                       <motion.div 
                          animate={{ x: twoFA ? 34 : 6 }}
                          className="absolute top-2 w-4 h-4 bg-white rounded-full shadow-2xl" 
                       />
                    </button>
                 </div>
                 
                 <button className="w-full p-6 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 border border-white/5 transition-all group/btn shadow-inner">
                    Active Session Matrix
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform text-emerald-500" />
                 </button>
              </div>
           </div>
 
           {/* Quick Actions */}
           <div className="bg-rose-500/5 backdrop-blur-xl rounded-[3rem] p-10 border border-rose-500/10 group hover:bg-rose-500/10 transition-all">
              <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-[0.4em] mb-6 text-center italic">Critical Hazard Zone</p>
              <button className="w-full py-6 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-rose-500/20 hover:bg-rose-600 hover:text-white transition-all border border-rose-500/20 group-hover:scale-105 active:scale-95">
                 Purge Clinical Identity
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
