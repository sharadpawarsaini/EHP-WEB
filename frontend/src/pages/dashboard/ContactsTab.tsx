import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Phone, 
  Plus, 
  Trash2, 
  User, 
  Heart, 
  Home, 
  ShieldCheck, 
  Bell, 
  MessageSquare, 
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Users,
  ShieldAlert,
  Zap,
  X,
  Smartphone,
  Navigation,
  SmartphoneIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactsTab = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '', isPrimary: false, notifySOS: true });
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/emergency/contacts');
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (contacts.length >= 5) {
      setError('Maximum 5 nodes allowed for safety protocols.');
      return;
    }
    try {
      await api.post('/emergency/contacts', newContact);
      setNewContact({ name: '', relation: '', phone: '', isPrimary: false, notifySOS: true });
      setShowAdd(false);
      fetchContacts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add guardian');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sever this emergency link? This guardian will no longer be notified during SOS events.')) return;
    try {
      await api.delete(`/emergency/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const getRelationIcon = (relation: string) => {
    const rel = relation.toLowerCase();
    if (rel.includes('spouse') || rel.includes('wife') || rel.includes('husband') || rel.includes('partner')) return Heart;
    if (rel.includes('parent') || rel.includes('mother') || rel.includes('father')) return Home;
    if (rel.includes('doctor') || rel.includes('physician')) return ShieldCheck;
    return User;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-rose-600/20 border-t-rose-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Securing Emergency Network...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full">Active Guard</span>
               <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full">SMS Priority</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Guardian Nodes</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Critical emergency contacts notified instantly during SOS triggers</p>
         </div>
         <button onClick={() => setShowAdd(true)} className="w-full md:w-auto px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Register Guardian
         </button>
      </div>

      <AnimatePresence>
         {error && (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 text-rose-800 dark:text-rose-400 rounded-3xl flex items-center shadow-lg">
             <AlertCircle className="h-6 w-6 mr-4" />
             <div className="flex-1 font-black uppercase text-xs tracking-widest">{error}</div>
           </motion.div>
         )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Guardian Cards */}
        <AnimatePresence mode="popLayout">
           {contacts.map((contact) => {
             const Icon = getRelationIcon(contact.relation);
             return (
               <motion.div 
                 layout
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 whileHover={{ y: -5 }}
                 key={contact._id} 
                 className={`p-8 rounded-[3rem] border-2 transition-all relative overflow-hidden group ${contact.isPrimary ? 'bg-white dark:bg-slate-800 border-rose-500 shadow-2xl shadow-rose-500/10' : 'bg-white/60 dark:bg-slate-800/60 border-gray-100 dark:border-slate-700 opacity-80'}`}
               >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <ShieldAlert className="h-32 w-32 text-rose-600" />
                  </div>

                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className={`p-4 rounded-2xl transition-all group-hover:scale-110 ${contact.isPrimary ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/30' : 'bg-gray-100 dark:bg-slate-900 text-gray-400'}`}>
                        <Icon className="h-6 w-6" />
                     </div>
                     <div className="flex gap-2">
                        {contact.notifySOS && (
                           <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl" title="Notified on SOS">
                              <Bell className="h-4 w-4" />
                           </div>
                        )}
                        <button onClick={() => handleDelete(contact._id)} className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                           <Trash2 className="h-4 w-4" />
                        </button>
                     </div>
                  </div>

                  <div className="mb-8 relative z-10">
                     <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight truncate max-w-[200px]">{contact.name}</h3>
                        {contact.isPrimary && <CheckCircle2 className="h-5 w-5 text-rose-500" />}
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                        {contact.relation}
                     </span>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-slate-900 rounded-[1.8rem] border border-gray-100 dark:border-slate-700 group-hover:border-rose-500/20 transition-all relative z-10">
                     <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                        <SmartphoneIcon className="h-5 w-5 text-gray-400" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Encrypted Phone</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{contact.phone}</p>
                     </div>
                  </div>

                  {contact.isPrimary && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-b-xl shadow-lg">
                       Primary Node
                    </div>
                  )}
               </motion.div>
             );
           })}
        </AnimatePresence>

        {/* Suggestion Card */}
        {contacts.length < 5 && (
           <motion.div 
             onClick={() => setShowAdd(true)}
             className="p-8 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-rose-500 hover:bg-rose-50/10 transition-all"
           >
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6">
                 <Plus className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Add Guardian Node</p>
           </motion.div>
        )}
      </div>

      {/* Info Sections */}
      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-xl border border-white dark:border-slate-700">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-4">
               <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                  <MessageSquare className="h-6 w-6 text-emerald-600" />
               </div>
               Custom SOS Payload
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
               This intelligent payload is dispatched to all notified guardians along with your real-time GPS coordinates and bio-data pulse during an SOS event.
            </p>
            <textarea 
              className="w-full p-6 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none placeholder:text-gray-400"
              placeholder="e.g. SOS TRIGERRED: Check my EHP Passport now for live biometric stream and location."
              rows={4}
            />
         </div>

         <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-12 opacity-10">
               <ShieldCheck className="h-40 w-40" />
            </div>
            <div className="relative z-10">
               <Zap className="h-8 w-8 text-amber-400 mb-8" />
               <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Safety Integrity</h3>
               <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10">
                  Your Guardian list is stored with double-layer encryption. In an emergency, our automated relay initiates SMS and Voice calls to all primary nodes within 2 seconds.
               </p>
            </div>
            <div className="relative z-10 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
               <Navigation className="h-5 w-5 text-rose-500" />
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Live GPS Routing Active</p>
            </div>
         </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 max-w-lg w-full relative z-10 shadow-2xl border border-white dark:border-slate-700">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Node Registration</h3>
                <button onClick={() => setShowAdd(false)} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Guardian Name</label>
                   <input required value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" placeholder="Legal Full Name" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Relationship</label>
                      <input required value={newContact.relation} onChange={e => setNewContact({...newContact, relation: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" placeholder="e.g. Spouse" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Phone</label>
                      <input required type="tel" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" placeholder="+1..." />
                   </div>
                </div>
                <div className="flex flex-wrap gap-6 pt-4">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                         <input type="checkbox" checked={newContact.isPrimary} onChange={e => setNewContact({...newContact, isPrimary: e.target.checked})} className="sr-only peer" />
                         <div className="w-6 h-6 border-2 border-gray-200 dark:border-slate-700 rounded-lg peer-checked:bg-rose-600 peer-checked:border-rose-600 transition-all flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                         </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Set as Primary Node</span>
                   </label>
                </div>
                <button type="submit" className="w-full py-6 bg-rose-600 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all mt-4">
                   Activate Guardian Node
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactsTab;
