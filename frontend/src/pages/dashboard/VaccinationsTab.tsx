import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  UserCircle, 
  Info, 
  X,
  Syringe,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

const VaccinationsTab = () => {
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    vaccineName: '',
    disease: '',
    dateAdministered: format(new Date(), "yyyy-MM-dd"),
    provider: '',
    batchNumber: '',
    nextDoseDate: '',
    isBooster: false,
    notes: ''
  });

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const fetchVaccinations = async () => {
    try {
      const { data } = await api.get('/vaccinations');
      setVaccinations(data);
    } catch (err) {
      console.error('Failed to fetch vaccinations');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/vaccinations', formData);
      setVaccinations([data, ...vaccinations]);
      setShowAdd(false);
      setFormData({
        vaccineName: '',
        disease: '',
        dateAdministered: format(new Date(), "yyyy-MM-dd"),
        provider: '',
        batchNumber: '',
        nextDoseDate: '',
        isBooster: false,
        notes: ''
      });
    } catch (err) {
      alert('Failed to add record');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vaccination record?')) return;
    try {
      await api.delete(`/vaccinations/${id}`);
      setVaccinations(vaccinations.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading vaccination history...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Vaccination Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your immunization history and upcoming doses.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5" /> Add Vaccination
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {vaccinations.map((v) => (
          <div key={v._id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(v._id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-slate-900 rounded-xl">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-[1.5rem]">
                <Syringe className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{v.vaccineName}</h3>
                  {v.isBooster && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Booster</span>
                  )}
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-4">{v.disease}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Administered</p>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <CalendarIcon className="h-4 w-4 text-emerald-500" />
                      {format(new Date(v.dateAdministered), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  {v.nextDoseDate && (
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Next Dose</p>
                      <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <AlertTriangle className="h-4 w-4" />
                        {format(new Date(v.nextDoseDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <UserCircle className="h-4 w-4" />
                    <span>Provider: {v.provider || 'Not specified'}</span>
                  </div>
                  {v.batchNumber && (
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Batch: {v.batchNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {vaccinations.length === 0 && (
          <div className="col-span-full py-24 text-center bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
            <ShieldCheck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No vaccination records found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Keep your health passport updated by adding your immunization history.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Vaccination Record</h3>
                <p className="text-sm text-gray-500">Record a new dose in your digital passport.</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Vaccine Name</label>
                <input required value={formData.vaccineName} onChange={e => setFormData({...formData, vaccineName: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Covishield / Moderna" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Disease</label>
                <input required value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. COVID-19 / Influenza" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date Administered</label>
                <input type="date" required value={formData.dateAdministered} onChange={e => setFormData({...formData, dateAdministered: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Next Dose Due (Optional)</label>
                <input type="date" value={formData.nextDoseDate} onChange={e => setFormData({...formData, nextDoseDate: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Health Provider / Clinic</label>
                <input value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Hospital Name" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Batch / Lot Number</label>
                <input value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. AB1234" />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isBooster ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-slate-700'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isBooster ? 'translate-x-6' : ''}`} />
                  </div>
                  <input type="checkbox" className="hidden" checked={formData.isBooster} onChange={e => setFormData({...formData, isBooster: e.target.checked})} />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">This is a booster dose</span>
                </label>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none" placeholder="Any side effects or additional info..." />
              </div>
              <div className="col-span-2 flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all active:scale-95">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationsTab;
