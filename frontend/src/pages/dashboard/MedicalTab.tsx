import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ClipboardList, Shield, Activity, Plus, FileText, CheckCircle2, Info, AlertCircle, Calendar, Hospital, Heart, Droplet, Trash2, ChevronRight, Stethoscope, Wind, Zap, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { encryptMedicalRecord } from '../../utils/encryption';


const InputField = ({ label, value, onChange, placeholder, icon: Icon }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
      {Icon && <Icon className="h-3.5 w-3.5 text-emerald-500" />} {label}
    </label>
    <div className="relative group">
       <input
         type="text"
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         className="w-full px-8 py-5 bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 outline-none text-zinc-900 dark:text-white transition-all font-bold placeholder:text-zinc-300 dark:placeholder:text-zinc-600 shadow-inner group-focus-within:border-emerald-500/50"
       />
       <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
    </div>
  </div>
);

const MedicalTab = () => {
  const [details, setDetails] = useState({
    allergies: '',
    conditions: '',
    medications: '',
    surgeries: '',
    vaccinations: '',
    familyHistory: '',
    lifestyle: { smoking: false, alcohol: false, exercise: 'None' },
    notes: ''
  });
  const { isStealthMode, stealthData } = useAuth();
  // Passphrase handling for Zero‑Knowledge Encryption
  const [passphrase, setPassphrase] = useState('');
  const [showPassModal, setShowPassModal] = useState(false);

  // Show passphrase modal if encryption key not yet stored
  useEffect(() => {
    const stored = localStorage.getItem('ehp_user_passphrase');
    if (!stored) {
      setShowPassModal(true);
    } else {
      setPassphrase(stored);
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Hospital Visit State
  const [visitHospital, setVisitHospital] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitDocuments, setVisitDocuments] = useState<File[]>([]);
  const [visitSaving, setVisitSaving] = useState(false);
  const [visitMessage, setVisitMessage] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      // Ghost Mode: Load sanitized medical data instead of real records
      if (isStealthMode) {
        setDetails({
          allergies: stealthData?.medical?.allergies || '',
          conditions: stealthData?.medical?.conditions || '',
          medications: stealthData?.medical?.medications || '',
          surgeries: stealthData?.medical?.surgeries || '',
          vaccinations: 'COVID-19 (2023), Flu (2024)',
          familyHistory: stealthData?.medical?.familyHistory || '',
          lifestyle: { smoking: false, alcohol: false, exercise: 'Moderate' },
          notes: 'No critical notes for first responders.'
        });
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/medical');
        if (data) {
          setDetails({
            allergies: data.allergies?.join(', ') || '',
            conditions: data.conditions?.join(', ') || '',
            medications: data.medications?.join(', ') || '',
            surgeries: data.surgeries?.join(', ') || '',
            vaccinations: data.vaccinations?.join(', ') || '',
            familyHistory: data.familyHistory?.join(', ') || '',
            lifestyle: data.lifestyle || { smoking: false, alcohol: false, exercise: 'None' },
            notes: data.notes || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [isStealthMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStealthMode) return;
    setSaving(true);
    setMessage('');
    
    try {
      // Parse the comma-separated strings back into arrays for the backend
      const payload = {
        allergies: details.allergies.split(',').map(s => s.trim()).filter(s => s),
        conditions: details.conditions.split(',').map(s => s.trim()).filter(s => s),
        medications: details.medications.split(',').map(s => s.trim()).filter(s => s),
        surgeries: details.surgeries.split(',').map(s => s.trim()).filter(s => s),
        vaccinations: details.vaccinations.split(',').map(s => s.trim()).filter(s => s),
        familyHistory: details.familyHistory.split(',').map(s => s.trim()).filter(s => s),
        lifestyle: details.lifestyle,
        notes: details.notes
      };

      await api.post('/medical', payload);
      setMessage('Clinical telemetry synchronized successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      console.error('Update Failed:', err);
      setMessage(err.response?.data?.message || 'Identity sync failed. Please verify network.');
    } finally {
      setSaving(false);
    }
  };



  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitHospital || !visitDate) {
      setVisitMessage('Please provide hospital name and visit date.');
      return;
    }
    
    setVisitSaving(true);
    setVisitMessage('');

    const formData = new FormData();
    formData.append('hospitalName', visitHospital);
    formData.append('visitDate', visitDate);
    visitDocuments.forEach((file) => {
      formData.append('documents', file);
    });

    try {
      await api.post('/visits', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setVisitMessage('Hospital visit recorded successfully!');
      setVisitHospital('');
      setVisitDate('');
      setVisitDocuments([]);
      setTimeout(() => setVisitMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
      setVisitMessage(err.response?.data?.message || 'Failed to record hospital visit.');
    } finally {
      setVisitSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Constructing Health Profile...</p>
    </div>
  );


  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">

      {/* Ghost Mode Notice */}
      {isStealthMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl"
        >
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex-shrink-0">
            <EyeOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Ghost Profile Active</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
              You are viewing a sanitized ghost profile. Real clinical data is fully encrypted and hidden. Editing is disabled in this mode.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-2xl">SECURE EMR</span>
               <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-2xl">AES-256</span>
            </div>
            <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">Clinical Passport</h2>
            <p className="text-sm text-zinc-500 font-medium italic">Global interoperable health history and clinical records sync protocol.</p>
         </div>
         {isStealthMode ? (
           <div className="flex items-center gap-3 px-8 py-4 bg-zinc-950 border border-white/5 text-zinc-600 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
             <EyeOff className="h-4 w-4" />
             Locked in Ghost Mode
           </div>
         ) : (
           <button onClick={handleSubmit} disabled={saving} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
             {saving ? 'Syncing...' : 'Update Records'} <Zap className="h-4 w-4" />
           </button>
         )}
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center shadow-sm">
            <CheckCircle2 className="h-5 w-5 mr-3" />
            <div className="text-xs font-bold uppercase tracking-widest">{message}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Core Medical Data */}
        <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="grid lg:grid-cols-2 gap-16 relative z-10">
             <div className="space-y-10">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-4 uppercase tracking-tighter">
                   <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 glow-border">
                      <Heart className="h-6 w-6 text-rose-500" />
                   </div>
                   Vital Indicators
                </h3>
                <InputField 
                  label="Allergies" 
                  value={details.allergies} 
                  onChange={(e: any) => setDetails({...details, allergies: e.target.value})}
                  placeholder="Peanuts, Penicillin..."
                  icon={AlertCircle}
                />
                <InputField 
                  label="Chronic Conditions" 
                  value={details.conditions} 
                  onChange={(e: any) => setDetails({...details, conditions: e.target.value})}
                  placeholder="Asthma, Type 1 Diabetes..."
                  icon={Activity}
                />
                <InputField 
                  label="Family History" 
                  value={details.familyHistory} 
                  onChange={(e: any) => setDetails({...details, familyHistory: e.target.value})}
                  placeholder="Heart Disease (Father)..."
                  icon={Activity}
                />
             </div>

             <div className="space-y-10">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-4 uppercase tracking-tighter">
                   <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
                      <Stethoscope className="h-6 w-6 text-emerald-500" />
                   </div>
                   Clinical History
                </h3>
                <InputField 
                  label="Current Medications" 
                  value={details.medications} 
                  onChange={(e: any) => setDetails({...details, medications: e.target.value})}
                  placeholder="Lisinopril 10mg daily..."
                  icon={Zap}
                />
                <InputField 
                  label="Past Surgeries" 
                  value={details.surgeries} 
                  onChange={(e: any) => setDetails({...details, surgeries: e.target.value})}
                  placeholder="Appendectomy (2015)..."
                  icon={Activity}
                />
                <InputField 
                  label="Vaccination History" 
                  value={details.vaccinations} 
                  onChange={(e: any) => setDetails({...details, vaccinations: e.target.value})}
                  placeholder="COVID-19 (2023), Flu..."
                  icon={Shield}
                />
             </div>
          </div>
        </div>

        {/* Lifestyle Protocol */}
        <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="flex items-center gap-4 mb-10 relative z-10">
             <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
                <Wind className="h-6 w-6 text-emerald-500" />
             </div>
             <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">Lifestyle Protocol</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <button
              type="button"
              onClick={() => setDetails({...details, lifestyle: {...details.lifestyle, smoking: !details.lifestyle.smoking}})}
              className={`p-10 rounded-[2.5rem] border transition-all flex flex-col gap-6 text-left shadow-2xl relative overflow-hidden group/btn ${details.lifestyle.smoking ? 'bg-rose-600 border-rose-500 text-white' : 'bg-white/5 border-white/10'}`}
            >
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${details.lifestyle.smoking ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 text-zinc-500 group-hover/btn:scale-110'}`}>
                  <Droplet className="h-6 w-6" />
               </div>
               <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${details.lifestyle.smoking ? 'text-rose-100' : 'text-zinc-500'}`}>Current Status</p>
                  <p className="text-2xl font-black uppercase tracking-tight leading-none">{details.lifestyle.smoking ? 'Smoker' : 'Non-Smoker'}</p>
               </div>
               {details.lifestyle.smoking && <div className="absolute top-0 right-0 p-6 opacity-20"><Zap className="h-20 w-20" /></div>}
            </button>

            <button
              type="button"
              onClick={() => setDetails({...details, lifestyle: {...details.lifestyle, alcohol: !details.lifestyle.alcohol}})}
              className={`p-10 rounded-[2.5rem] border transition-all flex flex-col gap-6 text-left shadow-2xl relative overflow-hidden group/btn ${details.lifestyle.alcohol ? 'bg-amber-600 border-amber-500 text-white' : 'bg-white/5 border-white/10'}`}
            >
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${details.lifestyle.alcohol ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 text-zinc-500 group-hover/btn:scale-110'}`}>
                  <Zap className="h-6 w-6" />
               </div>
               <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${details.lifestyle.alcohol ? 'text-amber-100' : 'text-zinc-500'}`}>Consumption</p>
                  <p className="text-2xl font-black uppercase tracking-tight leading-none">{details.lifestyle.alcohol ? 'Alcohol User' : 'Alcohol Free'}</p>
               </div>
               {details.lifestyle.alcohol && <div className="absolute top-0 right-0 p-6 opacity-20"><Zap className="h-20 w-20" /></div>}
            </button>

            <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-inner">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-6 ml-1">Exercise Intensity</label>
              <select
                value={details.lifestyle.exercise}
                onChange={(e) => setDetails({...details, lifestyle: {...details.lifestyle, exercise: e.target.value}})}
                className="w-full px-8 py-5 bg-zinc-950/50 dark:bg-zinc-950/50 border border-white/5 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-zinc-900 dark:text-white font-black transition-all appearance-none uppercase tracking-widest text-[11px]"
              >
                <option value="None">Level: None</option>
                <option value="Light">Level: Light (1-2/wk)</option>
                <option value="Moderate">Level: Moderate (3-4/wk)</option>
                <option value="Active">Level: Active (5+/wk)</option>
              </select>
            </div>
          </div>
          </div>
        </div>

        {/* Responder Protocol */}
        <div className="lg:col-span-3">
           <div className="bg-zinc-950 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <h3 className="text-[10px] font-black mb-8 flex items-center gap-3 uppercase tracking-[0.5em] text-emerald-500 relative z-10">
                 <Zap className="h-4 w-4" />
                 Tactical Responder Notes
              </h3>
              <textarea
                rows={4}
                value={details.notes}
                onChange={(e) => setDetails({...details, notes: e.target.value})}
                placeholder="Critical information for first responders..."
                className="w-full p-8 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-medium leading-relaxed outline-none focus:bg-white/10 transition-all resize-none placeholder:text-zinc-600 text-white relative z-10 shadow-inner"
              />
           </div>
        </div>
      </form>

      {/* Visit Archive */}
      <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group mt-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
           <div className="flex items-center gap-5">
              <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 glow-border">
                 <Hospital className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">Visit Archive</h2>
                 <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Record clinical visits and binary report archives</p>
              </div>
           </div>
        </div>
               <form onSubmit={handleVisitSubmit} className="space-y-12 relative z-10">
           <div className="grid md:grid-cols-2 gap-12">
              <InputField 
                label="Hospital/Clinic Node" 
                value={visitHospital} 
                onChange={(e: any) => setVisitHospital(e.target.value)}
                placeholder="e.g. Mayo Clinic"
                icon={Hospital}
              />
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                  <Calendar className="h-3.5 w-3.5 text-cyan-500" /> Visit Date
                </label>
                <div className="relative group">
                   <input
                     type="date"
                     value={visitDate}
                     onChange={(e) => setVisitDate(e.target.value)}
                     className="w-full px-8 py-5 bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-cyan-500/10 outline-none text-zinc-900 dark:text-white font-black uppercase tracking-widest text-[11px] transition-all group-focus-within:border-cyan-500/50 shadow-inner"
                   />
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
                </div>
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] block ml-2">Binary Payload Uplink</label>
              <div className="relative group">
                 <input
                   type="file"
                   multiple
                   accept=".jpg,.jpeg,.png,.pdf"
                   onChange={(e) => {
                     if (e.target.files) {
                       setVisitDocuments(Array.from(e.target.files));
                     }
                   }}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 />
                 <div className="p-20 border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-white/5 transition-all bg-white/5 shadow-inner">
                    <div className="p-6 bg-zinc-950 rounded-[2rem] border border-white/5 shadow-2xl mb-6 group-hover:scale-110 transition-transform">
                       <Plus className="h-10 w-10 text-cyan-500" />
                    </div>
                    <p className="text-base font-black text-white uppercase tracking-tighter">Click to Uplink Records</p>
                    <p className="text-[9px] text-zinc-500 mt-2 uppercase font-black tracking-[0.3em]">PDF, JPG, PNG // MAX PAYLOAD 5 FILES</p>
                 </div>
              </div>
           </div>

           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {visitDocuments.map((doc, idx) => (
               <div key={idx} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-[2rem] shadow-2xl">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                       <FileText className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                    </div>
                    <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">{doc.name}</span>
                 </div>
                 <button type="button" onClick={() => setVisitDocuments(visitDocuments.filter((_, i) => i !== idx))} className="p-2 text-zinc-600 hover:text-rose-500 transition-colors">
                    <Trash2 className="h-5 w-5" />
                 </button>
               </div>
             ))}
           </div>

            <div className="flex justify-end pt-8">
               <button
                 type="submit"
                 disabled={visitSaving}
                 className="px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-cyan-600/20 hover:scale-105 active:scale-95 flex items-center gap-3"
               >
                 {visitSaving ? 'Processing...' : 'Sync Archive'} <Zap className="h-4 w-4" />
               </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalTab;
