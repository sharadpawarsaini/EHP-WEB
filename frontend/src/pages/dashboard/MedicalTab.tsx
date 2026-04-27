import React, { useState, useEffect } from 'react';
import api from '../../services/api';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {message && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 rounded-2xl flex items-center shadow-sm">
          <div className="flex-1 font-medium">{message}</div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Clinical Profile */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Clinical Profile</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Separate multiple entries with commas (e.g. Peanuts, Penicillin)</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allergies</label>
              <input
                type="text"
                value={details.allergies}
                onChange={(e) => setDetails({...details, allergies: e.target.value})}
                placeholder="Peanuts, Penicillin..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chronic Conditions</label>
              <input
                type="text"
                value={details.conditions}
                onChange={(e) => setDetails({...details, conditions: e.target.value})}
                placeholder="Asthma, Type 1 Diabetes..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Medications</label>
              <input
                type="text"
                value={details.medications}
                onChange={(e) => setDetails({...details, medications: e.target.value})}
                placeholder="Lisinopril 10mg daily..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Past Surgeries</label>
              <input
                type="text"
                value={details.surgeries}
                onChange={(e) => setDetails({...details, surgeries: e.target.value})}
                placeholder="Appendectomy (2015)..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vaccinations</label>
              <input
                type="text"
                value={details.vaccinations}
                onChange={(e) => setDetails({...details, vaccinations: e.target.value})}
                placeholder="COVID-19 (2023), Flu..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Family History</label>
              <input
                type="text"
                value={details.familyHistory}
                onChange={(e) => setDetails({...details, familyHistory: e.target.value})}
                placeholder="Heart Disease (Father)..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle & Wellness */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Lifestyle & Wellness</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 bg-gray-50/50 dark:bg-slate-700/50 p-4 rounded-xl border border-gray-200 dark:border-slate-600">
              <input
                type="checkbox"
                id="smoking"
                checked={details.lifestyle.smoking}
                onChange={(e) => setDetails({...details, lifestyle: {...details.lifestyle, smoking: e.target.checked}})}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 dark:border-slate-500 dark:bg-slate-800 focus:ring-blue-500"
              />
              <label htmlFor="smoking" className="font-medium text-gray-700 dark:text-gray-300">Smoker</label>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50/50 dark:bg-slate-700/50 p-4 rounded-xl border border-gray-200 dark:border-slate-600">
              <input
                type="checkbox"
                id="alcohol"
                checked={details.lifestyle.alcohol}
                onChange={(e) => setDetails({...details, lifestyle: {...details.lifestyle, alcohol: e.target.checked}})}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 dark:border-slate-500 dark:bg-slate-800 focus:ring-blue-500"
              />
              <label htmlFor="alcohol" className="font-medium text-gray-700 dark:text-gray-300">Consumes Alcohol</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exercise Frequency</label>
              <select
                value={details.lifestyle.exercise}
                onChange={(e) => setDetails({...details, lifestyle: {...details.lifestyle, exercise: e.target.value}})}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
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
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Insurance & Notes</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Insurance Provider</label>
              <input
                type="text"
                value={details.insurance.provider}
                onChange={(e) => setDetails({...details, insurance: {...details.insurance, provider: e.target.value}})}
                placeholder="Blue Cross, Aetna..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Policy Number</label>
              <input
                type="text"
                value={details.insurance.policyNumber}
                onChange={(e) => setDetails({...details, insurance: {...details.insurance, policyNumber: e.target.value}})}
                placeholder="Optional..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Medical Notes</label>
            <textarea
              rows={4}
              value={details.notes}
              onChange={(e) => setDetails({...details, notes: e.target.value})}
              placeholder="Any other important medical information..."
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm resize-none"
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70"
          >
            {saving ? 'Saving Records...' : 'Save Complete Medical Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalTab;
