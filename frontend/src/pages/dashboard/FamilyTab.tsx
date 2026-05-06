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
import { getFullPhotoUrl } from '../../utils/url';

const FamilyTab = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const { managedMemberId, setManagedMember, photoUrl } = useProfileContext();



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
      <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Building Circle of Care...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">Nexus Shared Access</span>
               <span className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">HIPAA Shield</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">Family Command</h2>
            <p className="text-sm text-zinc-500 font-medium italic">Manage clinical telemetry and emergency profiles for your primary node circle.</p>
         </div>
         <button onClick={() => setShowAdd(true)} className="w-full md:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10">
            <UserPlus className="h-5 w-5" /> Deploy Profile
         </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Primary Profile Card */}
        <motion.div 
           whileHover={{ y: -5 }}
           className={`p-10 rounded-[3.5rem] border transition-all relative overflow-hidden group ${!managedMemberId ? 'bg-zinc-950 border-emerald-500 shadow-2xl shadow-emerald-500/20' : 'bg-white/5 border-white/10 opacity-60 backdrop-blur-xl'}`}
        >
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <UserCircle className="h-40 w-40 text-emerald-500" />
           </div>
           
           <div className="flex justify-between items-start mb-10 relative z-10">
               <div className="w-20 h-20 rounded-[2rem] overflow-hidden bg-zinc-900 border-2 border-emerald-500/30 p-1 shadow-2xl">
                  {photoUrl ? (
                    <img src={getFullPhotoUrl(photoUrl)!} alt="Me" className="w-full h-full object-cover rounded-[1.8rem]" />
                  ) : (
                    <UserCircle className="w-full h-full p-4 text-emerald-600" />
                  )}
               </div>
              {!managedMemberId && (
                 <div className="px-5 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20">
                    <ShieldCheck className="h-3.5 w-3.5" /> Primary Node
                 </div>
              )}
           </div>
 
           <div className="mb-10 relative z-10">
              <h3 className="text-3xl font-black text-white leading-none uppercase tracking-tighter mb-2">Me</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Master Clinical Identity</p>
           </div>
 
           <button 
             disabled={!managedMemberId}
             onClick={() => setManagedMember(null)}
             className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all relative z-10 ${!managedMemberId ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-white text-zinc-950 hover:scale-105 active:scale-95 shadow-2xl'}`}
           >
             {!managedMemberId ? 'Active Session' : 'Switch To Master'}
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
                className={`p-10 rounded-[3.5rem] border transition-all relative overflow-hidden group ${managedMemberId === member._id ? 'bg-zinc-950 border-cyan-500 shadow-2xl shadow-cyan-500/20' : 'bg-white/5 border-white/10 opacity-70 backdrop-blur-xl'}`}
             >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-10 opacity-5">
                   <Users className="h-40 w-40 text-cyan-500" />
                </div>
 
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="w-20 h-20 rounded-[2rem] overflow-hidden bg-zinc-900 border-2 border-white/10 p-1 shadow-2xl group-hover:border-cyan-500/30 transition-all">
                       {member.photoUrl ? (
                         <img src={getFullPhotoUrl(member.photoUrl)!} alt={member.name} className="w-full h-full object-cover rounded-[1.8rem]" />
                       ) : (
                         <Users className="w-full h-full p-5 text-zinc-700 group-hover:text-cyan-500 transition-colors" />
                       )}
                    </div>
                   <div className="flex gap-3">
                      <button onClick={() => deleteMember(member._id)} className="p-3 bg-white/5 border border-white/5 rounded-2xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                         <Trash2 className="h-5 w-5" />
                      </button>
                      {managedMemberId === member._id && (
                        <div className="px-5 py-2 bg-cyan-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-600/20">
                           <ShieldCheck className="h-3.5 w-3.5" /> Managing
                        </div>
                      )}
                   </div>
                </div>
 
                <div className="mb-10 relative z-10">
                   <h3 className="text-3xl font-black text-white leading-none uppercase tracking-tighter mb-3">{member.name}</h3>
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 bg-cyan-500/10 px-4 py-1.5 rounded-xl border border-cyan-500/20">
                         {member.relation}
                      </span>
                   </div>
                </div>
 
                <button 
                  disabled={managedMemberId === member._id}
                  onClick={() => setManagedMember(member._id, member.name)}
                  className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all relative z-10 ${managedMemberId === member._id ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-white text-zinc-950 hover:scale-105 active:scale-95 shadow-2xl'}`}
                >
                  {managedMemberId === member._id ? 'Current Stream' : `Link ${member.name.split(' ')[0]}`}
                </button>
             </motion.div>
           ))}
        </AnimatePresence>

        {/* Add Suggestion Card */}
        {members.length < 5 && (
           <motion.div 
             onClick={() => setShowAdd(true)}
             className="p-10 rounded-[3.5rem] border-2 border-dashed border-white/5 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-white/10 transition-all shadow-inner group"
           >
              <div className="w-20 h-20 bg-zinc-950 rounded-[2.5rem] border border-white/5 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                 <Plus className="h-8 w-8 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">Initialize Profile</p>
           </motion.div>
        )}
      </div>

      {/* Info Widget */}
      <div className="p-10 bg-zinc-950/60 backdrop-blur-xl rounded-[3.5rem] border border-white/5 flex items-start gap-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
            <Zap className="h-6 w-6 text-emerald-500 flex-shrink-0" />
         </div>
         <div>
            <p className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-3">Context Synchronization</p>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium italic">Managed profiles grant full guardianship permissions. All telemetry streams, clinical reports, and medical protocol logic will dynamically sync to the selected member's clinical identity.</p>
         </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/95 backdrop-blur-2xl" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white/10 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-[3.5rem] p-12 max-w-lg w-full relative z-10 shadow-2xl border border-white/10">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Expand Circle</h3>
                <button onClick={() => setShowAdd(false)} className="p-4 bg-white/5 rounded-[1.5rem] text-zinc-500 hover:text-white transition-all border border-white/5">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={addMember} className="space-y-10">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Legal Full Name</label>
                   <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner" placeholder="e.g. Sarah Smith" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Relationship Context</label>
                   <select required value={relation} onChange={e => setRelation(e.target.value)} className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 text-white font-black uppercase tracking-widest text-[11px] outline-none appearance-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner">
                     <option value="" className="bg-zinc-950">Select Relation</option>
                     <option value="Spouse" className="bg-zinc-950">Spouse</option>
                     <option value="Child" className="bg-zinc-950">Child</option>
                     <option value="Parent" className="bg-zinc-950">Parent</option>
                     <option value="Sibling" className="bg-zinc-950">Sibling</option>
                     <option value="Other" className="bg-zinc-950">Other</option>
                   </select>
                </div>
                <button type="submit" className="w-full py-7 bg-emerald-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all mt-6">
                   Initialize Member Identity
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
