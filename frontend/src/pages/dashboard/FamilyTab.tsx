import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useProfileContext } from '../../context/ProfileContext';
import { 
  UserPlus, 
  UserCircle, 
  Trash2, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Plus,
  X,
  Heart,
  Activity,
  Zap,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FamilyTab = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const { managedMemberId, setManagedMember, photoUrl } = useProfileContext();

  const getFullPhotoUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const base = api.defaults.baseURL?.replace('/api', '') || '';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/family');
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch family members');
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/family', { name, relation });
      setMembers([...members, data]);
      setName('');
      setRelation('');
      setShowAdd(false);
    } catch (err) {
      alert('Failed to add family member');
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Permanently delete this profile? All medical history for this member will be lost.')) return;
    try {
      await api.delete(`/family/${id}`);
      setMembers(members.filter(m => m._id !== id));
      if (managedMemberId === id) setManagedMember(null);
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Building Circle of Care...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">Shared Access</span>
               <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">HIPAA Compliant</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Family Circle</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Manage clinical records and emergency profiles for your loved ones</p>
         </div>
         <button onClick={() => setShowAdd(true)} className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            <UserPlus className="h-4 w-4" /> Add Member
         </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Primary Profile Card */}
        <motion.div 
           whileHover={{ y: -5 }}
           className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group ${!managedMemberId ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'bg-white/60 dark:bg-slate-800/60 border-gray-100 dark:border-slate-700 opacity-80'}`}
        >
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <UserCircle className="h-32 w-32" />
           </div>
           
           <div className="flex justify-between items-start mb-8">
               <div className="w-16 h-16 rounded-2xl overflow-hidden bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/30">
                  {photoUrl ? (
                    <img src={getFullPhotoUrl(photoUrl)!} alt="Me" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-full h-full p-3 text-indigo-600" />
                  )}
               </div>
              {!managedMemberId && (
                 <div className="px-4 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Active
                 </div>
              )}
           </div>

           <div className="mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">Me (Primary)</h3>
              <p className="text-sm text-gray-400 font-medium">Account Owner</p>
           </div>

           <button 
             disabled={!managedMemberId}
             onClick={() => setManagedMember(null)}
             className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${!managedMemberId ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-900 text-white hover:scale-105'}`}
           >
             {!managedMemberId ? 'Managing Your Profile' : 'Switch to My Profile'}
           </button>
        </motion.div>

        {/* Family Member Cards */}
        <AnimatePresence mode="popLayout">
           {members.map(member => (
             <motion.div 
                layout
                key={member._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group ${managedMemberId === member._id ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-2xl shadow-emerald-500/10' : 'bg-white/60 dark:bg-slate-800/60 border-gray-100 dark:border-slate-700 opacity-80'}`}
             >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Users className="h-32 w-32 text-emerald-600" />
                </div>

                <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30">
                       {member.photoUrl ? (
                         <img src={getFullPhotoUrl(member.photoUrl)!} alt={member.name} className="w-full h-full object-cover" />
                       ) : (
                         <Users className="w-full h-full p-4 text-emerald-600" />
                       )}
                    </div>
                   <div className="flex gap-2">
                      <button onClick={() => deleteMember(member._id)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                         <Trash2 className="h-5 w-5" />
                      </button>
                      {managedMemberId === member._id && (
                        <div className="px-4 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                           <ShieldCheck className="h-3 w-3" /> Managing
                        </div>
                      )}
                   </div>
                </div>

                <div className="mb-8">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{member.name}</h3>
                   <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                         {member.relation}
                      </span>
                   </div>
                </div>

                <button 
                  disabled={managedMemberId === member._id}
                  onClick={() => setManagedMember(member._id, member.name)}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${managedMemberId === member._id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-900 text-white hover:scale-105'}`}
                >
                  {managedMemberId === member._id ? 'Current Context' : `Manage ${member.name.split(' ')[0]}`}
                </button>
             </motion.div>
           ))}
        </AnimatePresence>

        {/* Add Suggestion Card */}
        {members.length < 5 && (
           <motion.div 
             onClick={() => setShowAdd(true)}
             className="p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/10 transition-all"
           >
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6">
                 <Plus className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Add Family Profile</p>
           </motion.div>
        )}
      </div>

      {/* Info Widget */}
      <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-5">
         <Zap className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
         <div>
            <p className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-1">Context Switching</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">Managing a family member switches your entire dashboard (Vitals, Medical, Reports) to their context. This allows you to update their clinical passport as a legal guardian.</p>
         </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 max-w-lg w-full relative z-10 shadow-2xl border border-white dark:border-slate-700">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Expand Circle</h3>
                <button onClick={() => setShowAdd(false)} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={addMember} className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Full Name</label>
                   <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" placeholder="e.g. Sarah Smith" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Relationship Context</label>
                   <select required value={relation} onChange={e => setRelation(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-black outline-none appearance-none">
                     <option value="">Select Relation</option>
                     <option value="Spouse">Spouse</option>
                     <option value="Child">Child</option>
                     <option value="Parent">Parent</option>
                     <option value="Sibling">Sibling</option>
                     <option value="Other">Other</option>
                   </select>
                </div>
                <button type="submit" className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all mt-4">
                   Initialize Member Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyTab;
