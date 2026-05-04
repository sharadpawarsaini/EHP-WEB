import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ClipboardList, 
  Shield, 
  Activity, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Info, 
  AlertCircle, 
  Calendar, 
  Hospital,
  Heart,
  Droplet,
  Trash2,
  ChevronRight,
  Stethoscope,
  Wind,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, value, onChange, placeholder, icon: Icon }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
      {Icon && <Icon className="h-3 w-3 text-primary-500" />} {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-6 py-5 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 outline-none text-gray-900 dark:text-white transition-all font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
    />
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
    insurance: { provider: '', policyNumber: '' },
    notes: ''
  });
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
            insurance: data.insurance || { provider: '', policyNumber: '' },
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      allergies: details.allergies.split(',').map(s => s.trim()).filter(Boolean),
      conditions: details.conditions.split(',').map(s => s.trim()).filter(Boolean),
      medications: details.medications.split(',').map(s => s.trim()).filter(Boolean),
      surgeries: details.surgeries.split(',').map(s => s.trim()).filter(Boolean),
      vaccinations: details.vaccinations.split(',').map(s => s.trim()).filter(Boolean),
      familyHistory: details.familyHistory.split(',').map(s => s.trim()).filter(Boolean),
      lifestyle: details.lifestyle,
      insurance: details.insurance,
      notes: details.notes
    };

    try {
      await api.post('/medical', payload);
      setMessage('Medical details saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save medical details');
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
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Secure EMR</span>
               <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Synced</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Clinical Passport</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Global interoperable health history and clinical records</p>
         </div>
         <button onClick={handleSubmit} disabled={saving} className="w-full md:w-auto px-10 py-5 bg-primary-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-primary-600/30 hover:scale-105 active:scale-95 transition-all">
            {saving ? 'Syncing...' : 'Save Changes'}
         </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 rounded-3xl flex items-center shadow-lg">
            <CheckCircle2 className="h-6 w-6 mr-4" />
            <div className="flex-1 font-black uppercase text-xs tracking-widest">{message}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Core Medical Data */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 shadow-xl border border-white dark:border-slate-700">
          <div className="grid lg:grid-cols-2 gap-10">
             <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                   <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl">
                      <Heart className="h-6 w-6 text-rose-600" />
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

             <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                   <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                      <Stethoscope className="h-6 w-6 text-emerald-600" />
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

        {/* Lifestyle & Wellness */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 shadow-xl border border-white dark:border-slate-700">
          <div className="flex items-center gap-4 mb-10">
             <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                <Wind className="h-6 w-6 text-emerald-600" />
             </div>
             <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Lifestyle & Wellness</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <button
              type="button"
              onClick={() => setDetails({...details, lifestyle: {...details.lifestyle, smoking: !details.lifestyle.smoking}})}
              className={`p-6 rounded-3xl border transition-all flex flex-col gap-4 text-left ${details.lifestyle.smoking ? 'bg-rose-50 border-rose-200' : 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-700'}`}
            >
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${details.lifestyle.smoking ? 'bg-rose-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'}`}>
                  <Droplet className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Status</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{details.lifestyle.smoking ? 'Smoker' : 'Non-Smoker'}</p>
               </div>
            </button>

            <button
              type="button"
              onClick={() => setDetails({...details, lifestyle: {...details.lifestyle, alcohol: !details.lifestyle.alcohol}})}
              className={`p-6 rounded-3xl border transition-all flex flex-col gap-4 text-left ${details.lifestyle.alcohol ? 'bg-amber-50 border-amber-200' : 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-700'}`}
            >
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${details.lifestyle.alcohol ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'}`}>
                  <Zap className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Consumption</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{details.lifestyle.alcohol ? 'Alcohol User' : 'Alcohol Free'}</p>
               </div>
            </button>

            <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 ml-1">Exercise Intensity</label>
              <select
                value={details.lifestyle.exercise}
                onChange={(e) => setDetails({...details, lifestyle: {...details.lifestyle, exercise: e.target.value}})}
                className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 outline-none text-gray-900 dark:text-white font-black transition-all"
              >
                <option value="None">None</option>
                <option value="Light">Light (1-2 days/wk)</option>
                <option value="Moderate">Moderate (3-4 days/wk)</option>
                <option value="Active">Active (5+ days/wk)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Insurance & Notes */}
        <div className="grid lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 shadow-xl border border-white dark:border-slate-700">
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4 mb-10">
                 <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                    <Shield className="h-6 w-6 text-emerald-600" />
                 </div>
                 Insurance Coverage
              </h3>
              <div className="space-y-8">
                 <InputField 
                    label="Insurance Provider" 
                    value={details.insurance.provider} 
                    onChange={(e: any) => setDetails({...details, insurance: {...details.insurance, provider: e.target.value}})}
                    placeholder="Blue Cross, Aetna..."
                 />
                 <InputField 
                    label="Policy Identification" 
                    value={details.insurance.policyNumber} 
                    onChange={(e: any) => setDetails({...details, insurance: {...details.insurance, policyNumber: e.target.value}})}
                    placeholder="Group/ID..."
                 />
              </div>
           </div>

           <div className="bg-gray-900 rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                 <FileText className="h-40 w-40" />
              </div>
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Zap className="h-6 w-6 text-amber-400" />
                 Responder Notes
              </h3>
              <textarea
                rows={6}
                value={details.notes}
                onChange={(e) => setDetails({...details, notes: e.target.value})}
                placeholder="Critical information for first responders..."
                className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-sm font-medium leading-relaxed outline-none focus:bg-white/10 transition-all resize-none placeholder:text-gray-500"
              />
           </div>
        </div>
      </form>

      {/* Hospital Visit Records */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 shadow-xl border border-white dark:border-slate-700 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-900 dark:bg-white rounded-2xl">
                 <Hospital className="h-6 w-6 text-white dark:text-gray-900" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Visit Archive</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Record clinical visits and store reports</p>
              </div>
           </div>
        </div>
        
        <form onSubmit={handleVisitSubmit} className="space-y-10">
           <div className="grid md:grid-cols-2 gap-10">
              <InputField 
                label="Hospital/Clinic Name" 
                value={visitHospital} 
                onChange={(e: any) => setVisitHospital(e.target.value)}
                placeholder="e.g. Mayo Clinic"
                icon={Hospital}
              />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Calendar className="h-3 w-3 text-primary-500" /> Visit Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-6 py-5 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 outline-none text-gray-900 dark:text-white font-black transition-all"
                />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Attachment Upload</label>
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
                 <div className="p-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center group-hover:border-primary-500 group-hover:bg-primary-50/30 transition-all bg-gray-50/30 dark:bg-slate-900/30">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-4">
                       <Plus className="h-8 w-8 text-primary-600" />
                    </div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">Click to Attach Medical Records</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-widest">Supports PDF, JPG, PNG (Max 5 files)</p>
                 </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visitDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-primary-50/50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-2xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <FileText className="h-5 w-5 text-primary-600 flex-shrink-0" />
                       <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{doc.name}</span>
                    </div>
                    <button type="button" onClick={() => setVisitDocuments(visitDocuments.filter((_, i) => i !== idx))} className="p-2 hover:text-red-600 transition-colors">
                       <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
           </div>

           <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={visitSaving}
                className="w-full sm:w-auto px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-70 text-xs uppercase tracking-[0.2em]"
              >
                {visitSaving ? 'Archiving...' : 'Record Visit'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalTab;
