import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ClipboardList, Shield, Activity, Plus, FileText, CheckCircle2, Info, AlertCircle, Calendar, Hospital } from 'lucide-react';
import { motion } from 'framer-motion';

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

  if (loading) return <div className="text-gray-500 animate-pulse p-8">Loading medical profile...</div>;

  const InputField = ({ label, value, onChange, placeholder, icon: Icon }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white transition-all font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600"
      />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full overflow-hidden">
      {message && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 rounded-2xl flex items-center shadow-sm">
          <CheckCircle2 className="h-5 w-5 mr-3" />
          <div className="flex-1 font-bold">{message}</div>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Clinical Profile */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Clinical Profile</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Core medical history for emergencies</p>
            </div>
          </div>

          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 mb-8 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">Separate multiple entries with commas. This information will be available to medical responders during an emergency.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
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
              label="Current Medications" 
              value={details.medications} 
              onChange={(e: any) => setDetails({...details, medications: e.target.value})}
              placeholder="Lisinopril 10mg daily..."
              icon={FileText}
            />
            <InputField 
              label="Past Surgeries" 
              value={details.surgeries} 
              onChange={(e: any) => setDetails({...details, surgeries: e.target.value})}
              placeholder="Appendectomy (2015)..."
              icon={Activity}
            />
            <InputField 
              label="Vaccinations" 
              value={details.vaccinations} 
              onChange={(e: any) => setDetails({...details, vaccinations: e.target.value})}
              placeholder="COVID-19 (2023), Flu..."
              icon={Shield}
            />
            <InputField 
              label="Family History" 
              value={details.familyHistory} 
              onChange={(e: any) => setDetails({...details, familyHistory: e.target.value})}
              placeholder="Heart Disease (Father)..."
              icon={Activity}
            />
          </div>
        </div>

        {/* Lifestyle & Wellness */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-600" />
             </div>
             Lifestyle & Wellness
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 bg-gray-50/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-blue-500/20 transition-all cursor-pointer group">
              <input
                type="checkbox"
                id="smoking"
                checked={details.lifestyle.smoking}
                onChange={(e) => setDetails({...details, lifestyle: {...details.lifestyle, smoking: e.target.checked}})}
                className="h-6 w-6 text-blue-600 rounded-lg border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="smoking" className="font-bold text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Smoker</label>
            </div>
            <div className="flex items-center space-x-4 bg-gray-50/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-blue-500/20 transition-all cursor-pointer group">
              <input
                type="checkbox"
                id="alcohol"
                checked={details.lifestyle.alcohol}
                onChange={(e) => setDetails({...details, lifestyle: {...details.lifestyle, alcohol: e.target.checked}})}
                className="h-6 w-6 text-blue-600 rounded-lg border-gray-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="alcohol" className="font-bold text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Consumes Alcohol</label>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Exercise Frequency</label>
              <select
                value={details.lifestyle.exercise}
                onChange={(e) => setDetails({...details, lifestyle: {...details.lifestyle, exercise: e.target.value}})}
                className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white font-bold transition-all"
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
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-indigo-600" />
             </div>
             Insurance & Clinical Notes
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <InputField 
              label="Insurance Provider" 
              value={details.insurance.provider} 
              onChange={(e: any) => setDetails({...details, insurance: {...details.insurance, provider: e.target.value}})}
              placeholder="Blue Cross, Aetna..."
            />
            <InputField 
              label="Policy Number" 
              value={details.insurance.policyNumber} 
              onChange={(e: any) => setDetails({...details, insurance: {...details.insurance, policyNumber: e.target.value}})}
              placeholder="Optional..."
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Additional Medical Notes</label>
            <textarea
              rows={4}
              value={details.notes}
              onChange={(e) => setDetails({...details, notes: e.target.value})}
              placeholder="Any other important medical information that first responders or doctors should know..."
              className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white font-medium transition-all shadow-sm resize-none"
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 text-xs uppercase tracking-widest"
          >
            {saving ? 'Saving Records...' : 'Save Complete Medical Profile'}
          </button>
        </div>
      </form>

      {/* Recent Hospital Visits Form */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700 mt-8">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-gray-900 dark:bg-white rounded-2xl shadow-lg">
              <Hospital className="h-6 w-6 text-white dark:text-gray-900" />
           </div>
           <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Hospital Visits</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Record clinical visits and upload documents</p>
           </div>
        </div>
        
        {visitMessage && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-400 rounded-2xl flex items-center shadow-sm">
            <CheckCircle2 className="h-5 w-5 mr-3" />
            <div className="flex-1 font-bold">{visitMessage}</div>
          </motion.div>
        )}

        <form onSubmit={handleVisitSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <InputField 
              label="Hospital Name" 
              value={visitHospital} 
              onChange={(e: any) => setVisitHospital(e.target.value)}
              placeholder="e.g. Apollo Hospital"
              icon={Hospital}
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Date Visited
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white font-bold transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Upload Medical Documents (Max 5)</label>
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
               <div className="p-10 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center group-hover:border-blue-500 transition-colors bg-gray-50/30 dark:bg-slate-900/30">
                  <Plus className="h-10 w-10 text-gray-300 group-hover:text-blue-500 mb-4 transition-colors" />
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Click to browse or drag and drop</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-widest">Images or PDF accepted</p>
               </div>
            </div>

            {visitDocuments.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {visitDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{doc.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={visitSaving}
              className="w-full sm:w-auto px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-70 text-xs uppercase tracking-widest"
            >
              {visitSaving ? 'Saving Visit...' : 'Record Hospital Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalTab;
