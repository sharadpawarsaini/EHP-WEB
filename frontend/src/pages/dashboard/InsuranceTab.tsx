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
      <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decrypting Coverage Nodes...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-5xl mx-auto">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
         <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="data-badge bg-teal-500/10 text-teal-600 border-teal-500/20">Protocol: Shield</span>
               <span className="data-badge">Encrypted</span>
            </div>
            <h2 className="text-5xl heading-premium tracking-tighter">Insurance Vault</h2>
            <p className="subheading-premium mt-2">Manage multiple coverage nodes for universal clinical access.</p>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleAddPolicy}
              className="flex-1 md:flex-none px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Policy
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={saving} 
              className="flex-1 md:flex-none px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-premium hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? 'Syncing...' : 'Save Vault'}
            </button>
         </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 glass border-teal-500/20 text-teal-600 rounded-3xl flex items-center shadow-premium">
            <CheckCircle2 className="h-6 w-6 mr-4" />
            <div className="flex-1 font-black uppercase text-[10px] tracking-widest">{message}</div>
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
            className="card-premium p-10 relative group"
          >
            <button 
              onClick={() => handleRemovePolicy(idx)}
              className="absolute top-8 right-8 p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
            >
              <Trash2 className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 mb-10">
               <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-600">
                  <Shield className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">Policy Node #{idx + 1}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Coverage Unit</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Building2 className="h-3 w-3 text-teal-500" /> Provider
                </label>
                <input
                  type="text"
                  value={policy.provider}
                  onChange={(e) => handleChange(idx, 'provider', e.target.value)}
                  placeholder="e.g. Blue Cross"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-900 dark:text-white transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Fingerprint className="h-3 w-3 text-teal-500" /> Policy ID
                </label>
                <input
                  type="text"
                  value={policy.policyNumber}
                  onChange={(e) => handleChange(idx, 'policyNumber', e.target.value)}
                  placeholder="Policy/Group #"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-900 dark:text-white transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <FileBadge className="h-3 w-3 text-teal-500" /> Coverage Type
                </label>
                <select
                  value={policy.coverageType}
                  onChange={(e) => handleChange(idx, 'coverageType', e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-900 dark:text-white font-bold transition-all"
                >
                  <option value="">Select Type</option>
                  <option value="Health">Health</option>
                  <option value="Life">Life</option>
                  <option value="Accident">Accident</option>
                  <option value="Critical Illness">Critical Illness</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Calendar className="h-3 w-3 text-teal-500" /> Expiry Date
                </label>
                <input
                  type="date"
                  value={policy.expiryDate ? policy.expiryDate.split('T')[0] : ''}
                  onChange={(e) => handleChange(idx, 'expiryDate', e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-teal-500/10 outline-none text-slate-900 dark:text-white font-bold transition-all"
                />
              </div>
            </div>
          </motion.div>
        ))}

        {insurances.length === 0 && (
          <div className="py-24 text-center glass border-dashed border-slate-200 dark:border-white/10 rounded-5xl">
             <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-6" />
             <h3 className="text-2xl heading-premium text-slate-400">No Coverage Nodes Detected</h3>
             <p className="subheading-premium mt-2">Initialize your medical insurance vault for emergency readiness.</p>
             <button 
               onClick={handleAddPolicy}
               className="mt-10 px-10 py-5 bg-teal-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-premium hover:scale-105 transition-all"
             >
               + Initialize Vault
             </button>
          </div>
        )}
      </div>

      <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-premium relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Shield className="h-40 w-40" />
         </div>
         <div className="relative z-10">
            <h4 className="text-xl font-black mb-4 flex items-center gap-3 tracking-tighter">
               <Fingerprint className="h-6 w-6 text-teal-400" />
               Encryption Integrity
            </h4>
            <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
               Your insurance data is secured using military-grade encryption nodes. Only authorized clinical responders can view these details during a protocol-validated emergency access.
            </p>
         </div>
      </div>
    </div>
  );
};

export default InsuranceTab;
