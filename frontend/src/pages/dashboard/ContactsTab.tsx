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
  Users
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
    if (contacts.length >= 5) { // Increased limit for professional feel
      setError('Maximum 5 contacts allowed for premium users.');
      return;
    }
    try {
      await api.post('/emergency/contacts', newContact);
      setNewContact({ name: '', relation: '', phone: '', isPrimary: false, notifySOS: true });
      setShowAdd(false);
      fetchContacts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add contact');
    }
  };

  const handleDelete = async (id: string) => {
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
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Securing Emergency Network...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-5">
             <div className="p-4 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/20">
                <Users className="h-8 w-8 text-white" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Emergency Contacts</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Your first line of defense in critical situations.</p>
             </div>
          </div>
          {contacts.length < 5 && !showAdd && (
            <button 
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" /> Add Guardian
            </button>
          )}
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center shadow-sm">
            <AlertCircle className="h-5 w-5 mr-3" />
            <div className="flex-1 font-bold">{error}</div>
          </motion.div>
        )}

        <AnimatePresence>
          {showAdd && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd} 
              className="bg-gray-50/50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700 mb-10 space-y-6 overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Relationship</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Spouse"
                    value={newContact.relation}
                    onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white font-bold transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-6 items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                 <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={newContact.isPrimary}
                         onChange={(e) => setNewContact({...newContact, isPrimary: e.target.checked})}
                         className="h-5 w-5 rounded-lg text-blue-600 focus:ring-blue-500/20 border-gray-300 dark:bg-slate-800" 
                       />
                       <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Primary Guardian</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={newContact.notifySOS}
                         onChange={(e) => setNewContact({...newContact, notifySOS: e.target.checked})}
                         className="h-5 w-5 rounded-lg text-rose-600 focus:ring-rose-500/20 border-gray-300 dark:bg-slate-800" 
                       />
                       <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Notify on SOS</span>
                    </label>
                 </div>
                 <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-6 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                  >
                    Register Guardian
                  </button>
                 </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => {
            const Icon = getRelationIcon(contact.relation);
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={contact._id} 
                className={`relative group p-8 bg-gray-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border transition-all hover:border-blue-500/30 ${contact.isPrimary ? 'border-blue-200 dark:border-blue-900/30 ring-1 ring-blue-500/10 shadow-lg shadow-blue-500/5' : 'border-gray-100 dark:border-slate-700'}`}
              >
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-4 rounded-2xl ${contact.isPrimary ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white dark:bg-slate-800 text-gray-400 border border-gray-100 dark:border-slate-700'}`}>
                      <Icon className="h-6 w-6" />
                   </div>
                   <div className="flex gap-2">
                      {contact.notifySOS && (
                         <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg" title="Notified on SOS">
                            <Bell className="h-3 w-3" />
                         </div>
                      )}
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <h4 className="font-black text-gray-900 dark:text-white text-xl truncate">{contact.name}</h4>
                         {contact.isPrimary && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{contact.relation}</p>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 group-hover:border-blue-500/20 transition-all">
                      <div className="w-8 h-8 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                         <Phone className="h-3 w-3 text-gray-400" />
                      </div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{contact.phone}</p>
                   </div>
                </div>
                
                {contact.isPrimary && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                     Primary
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {contacts.length === 0 && !showAdd && (
            <div className="col-span-full py-20 text-center bg-gray-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-700">
               <ShieldCheck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
               <p className="text-xl font-black text-gray-400 mb-2">Your Guardian list is empty.</p>
               <p className="text-xs text-gray-400 font-medium">Add trusted people who should be notified in case of an emergency.</p>
               <button onClick={() => setShowAdd(true)} className="mt-8 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">+ Add Now</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
               <MessageSquare className="h-5 w-5 text-indigo-600" />
               Custom SOS Message
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
               This message will be sent to your guardians along with your GPS coordinates during an emergency.
            </p>
            <textarea 
              className="w-full p-5 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="e.g. Emergency! Please check my EHP profile for live location and medical details."
              rows={3}
            />
         </div>
         <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20">
            <ShieldCheck className="h-8 w-8 text-white mb-6" />
            <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Emergency Network</h3>
            <p className="text-blue-100/80 text-sm font-medium leading-relaxed">
               Verified guardians can receive priority notifications. We recommend adding at least one household member and one professional contact.
            </p>
         </div>
      </div>
    </div>
  );
};

export default ContactsTab;
