import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Shield, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Calendar,
  Building2,
  Fingerprint,
  FileBadge,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InsuranceTab = () => {
  const [insurances, setInsurances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await api.get('/medical');
        if (data && data.insurances) {
          setInsurances(data.insurances);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleAddPolicy = () => {
    setInsurances([
      ...insurances,
      { provider: '', policyNumber: '', expiryDate: '', coverageType: '' }
    ]);
  };

  const handleRemovePolicy = (index: number) => {
    setInsurances(insurances.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...insurances];
    updated[index] = { ...updated[index], [field]: value };
    setInsurances(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/medical', { insurances });
      setMessage('Insurance policies synced successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to sync insurance data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Decrypting Coverage...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-5xl mx-auto">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">Protocol: Shield</span>
               <span className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">AES-256 Vault</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">Insurance Vault</h2>
            <p className="text-sm text-zinc-500 font-medium italic">Manage multiple coverage nodes for universal clinical portability.</p>
         </div>
         <div className="flex gap-4 w-full md:w-auto relative z-10">
            <button 
              onClick={handleAddPolicy}
              className="flex-1 md:flex-none px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <Plus className="h-5 w-5 text-emerald-500" /> New Node
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={saving} 
              className="flex-1 md:flex-none px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-cyan-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {saving ? 'Syncing...' : 'Sync Vault'} <Fingerprint className="h-5 w-5" />
            </button>
         </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center shadow-sm">
            <CheckCircle2 className="h-5 w-5 mr-3" />
            <div className="text-xs font-bold uppercase tracking-widest">{message}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid gap-8">
        {insurances.map((policy, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <button 
              onClick={() => handleRemovePolicy(idx)}
              className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-white/5 z-20"
            >
              <Trash2 className="h-5 w-5" />
            </button>
 
            <div className="flex items-center gap-5 mb-10 relative z-10">
               <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
                  <Shield className="h-6 w-6 text-emerald-500" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white leading-none uppercase tracking-tighter mb-1.5">Policy Node #{idx + 1}</h3>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Active Clinical Coverage Payload</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                  <Building2 className="h-3.5 w-3.5 text-cyan-500" /> Provider Node
                </label>
                <div className="relative group/input">
                   <input
                     type="text"
                     value={policy.provider}
                     onChange={(e) => handleChange(idx, 'provider', e.target.value)}
                     placeholder="e.g. Blue Cross"
                     className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-cyan-500/10 outline-none text-white font-bold placeholder:text-zinc-700 transition-all shadow-inner group-focus-within/input:border-cyan-500/50"
                   />
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                  <Fingerprint className="h-3.5 w-3.5 text-cyan-500" /> Policy Hash
                </label>
                <div className="relative group/input">
                   <input
                     type="text"
                     value={policy.policyNumber}
                     onChange={(e) => handleChange(idx, 'policyNumber', e.target.value)}
                     placeholder="Policy/Group #"
                     className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-cyan-500/10 outline-none text-white font-bold placeholder:text-zinc-700 transition-all shadow-inner group-focus-within/input:border-cyan-500/50"
                   />
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                  <FileBadge className="h-3.5 w-3.5 text-cyan-500" /> Coverage Type
                </label>
                <div className="relative group/input">
                   <select
                     value={policy.coverageType}
                     onChange={(e) => handleChange(idx, 'coverageType', e.target.value)}
                     className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-cyan-500/10 outline-none text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-inner appearance-none group-focus-within/input:border-cyan-500/50"
                   >
                     <option value="" className="bg-zinc-950">Select Type</option>
                     <option value="Health" className="bg-zinc-950">Health</option>
                     <option value="Life" className="bg-zinc-950">Life</option>
                     <option value="Accident" className="bg-zinc-950">Accident</option>
                     <option value="Critical Illness" className="bg-zinc-950">Critical Illness</option>
                   </select>
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                  <Calendar className="h-3.5 w-3.5 text-cyan-500" /> Expiry Logic
                </label>
                <div className="relative group/input">
                   <input
                     type="date"
                     value={policy.expiryDate ? policy.expiryDate.split('T')[0] : ''}
                     onChange={(e) => handleChange(idx, 'expiryDate', e.target.value)}
                     className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-cyan-500/10 outline-none text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-inner group-focus-within/input:border-cyan-500/50"
                   />
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {insurances.length === 0 && (
          <div className="py-24 text-center bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/5 rounded-[3.5rem] relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5 shadow-2xl mx-auto w-fit mb-8 group-hover:scale-110 transition-transform">
                <AlertCircle className="h-12 w-12 text-zinc-700 group-hover:text-cyan-500 transition-colors" />
             </div>
             <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">No Coverage Detected</h3>
             <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] italic">Initialize your medical insurance vault for emergency readiness.</p>
             <button 
               onClick={handleAddPolicy}
               className="mt-10 px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-cyan-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto relative z-10"
             >
               + Initialize Vault
             </button>
          </div>
        )}
      </div>

      <div className="bg-zinc-950 p-10 rounded-[3.5rem] text-white border border-white/5 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="relative z-10">
            <h4 className="text-[11px] font-black mb-6 flex items-center gap-4 uppercase tracking-[0.4em]">
               <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
                  <Fingerprint className="h-5 w-5 text-emerald-500" />
               </div>
               Encryption Protocol
            </h4>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-3xl italic">
               Your insurance data is secured using multi-layer clinical encryption nodes. Access is strictly audited and only granted to verified clinical responders during protocol-validated emergency events via the EHP Nexus Command Center.
            </p>
         </div>
      </div>
    </div>
  );
};

export default InsuranceTab;
