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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="saas-badge bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">Protocol: Shield</span>
               <span className="saas-badge bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">Encrypted</span>
            </div>
            <h2 className="text-3xl saas-heading">Insurance Vault</h2>
            <p className="saas-subtext mt-1">Manage multiple coverage nodes for universal clinical access.</p>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleAddPolicy}
              className="btn-secondary px-6 py-2.5 text-base"
            >
              <Plus className="h-4 w-4" /> Add Policy
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={saving} 
              className="btn-primary px-8 py-2.5 text-base"
            >
              {saving ? 'Syncing...' : 'Save Vault'}
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
            className="saas-card p-8 relative"
          >
            <button 
              onClick={() => handleRemovePolicy(idx)}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
 
            <div className="flex items-center gap-3 mb-8">
               <Shield className="h-5 w-5 text-emerald-600" />
               <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Policy #{idx + 1}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Clinical Coverage Node</p>
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
          <div className="py-20 text-center saas-card border-dashed">
             <AlertCircle className="h-12 w-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-zinc-400">No Coverage Nodes Detected</h3>
             <p className="saas-subtext mt-1">Initialize your medical insurance vault for emergency readiness.</p>
             <button 
               onClick={handleAddPolicy}
               className="mt-8 btn-primary px-10 py-3 text-sm"
             >
               + Initialize Vault
             </button>
          </div>
        )}
      </div>

      <div className="saas-card p-8 bg-zinc-900 text-white border-none shadow-xl">
         <div className="relative z-10">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
               <Fingerprint className="h-4 w-4 text-emerald-400" />
               Encryption Protocol
            </h4>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-2xl">
               Your insurance data is secured using military-grade encryption nodes. Only authorized clinical responders can view these details during a protocol-validated emergency access.
            </p>
         </div>
      </div>
    </div>
  );
};

export default InsuranceTab;
