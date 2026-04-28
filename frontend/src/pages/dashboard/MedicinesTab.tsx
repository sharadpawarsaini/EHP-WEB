import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Pill, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  ToggleLeft,
  ToggleRight,
  Info,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

const MedicinesTab = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once a day',
    times: ['08:00'],
    notes: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const { data } = await api.get('/medicines');
      setMedicines(data);
    } catch (err) {
      console.error('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/medicines', formData);
      setMedicines([...medicines, data]);
      setFormData({ name: '', dosage: '', frequency: 'Once a day', times: ['08:00'], notes: '' });
      setShowAdd(false);
    } catch (err) {
      alert('Failed to add medicine');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this medicine reminder?')) return;
    try {
      await api.delete(`/medicines/${id}`);
      setMedicines(medicines.filter(m => m._id !== id));
    } catch (err) {
      alert('Failed to delete medicine');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const { data } = await api.patch(`/medicines/${id}/toggle`);
      setMedicines(medicines.map(m => m._id === id ? data : m));
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading your medicines...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Medicine Reminders</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Track your daily medications and never miss a dose.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" /> Add Medicine
        </button>
      </div>

      {/* Interaction Checker - STAND OUT FEATURE */}
      <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-8 opacity-20">
            <ShieldCheck className="h-32 w-32 text-blue-400" />
         </div>
         <div className="relative z-10">
            <h3 className="text-xl font-black mb-2 flex items-center gap-3">
               <Zap className="h-6 w-6 text-amber-400" />
               Smart Interaction Checker
            </h3>
            <p className="text-gray-400 text-sm font-medium mb-8 max-w-lg">Check for potential complications between two medications before you take them.</p>
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Medication A</label>
                  <select className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50">
                     <option className="text-black">Select Primary...</option>
                     <option className="text-black">Aspirin</option>
                     <option className="text-black">Warfarin</option>
                     <option className="text-black">Ibuprofen</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Medication B</label>
                  <select className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50">
                     <option className="text-black">Select Secondary...</option>
                     <option className="text-black">Blood Thinners</option>
                     <option className="text-black">Alcohol</option>
                     <option className="text-black">Vitamins</option>
                  </select>
               </div>
            </div>
            <div className="mt-6 flex items-center gap-4 p-4 bg-amber-400/10 rounded-2xl border border-amber-400/20 max-w-3xl">
               <AlertCircle className="h-5 w-5 text-amber-400" />
               <p className="text-xs font-bold text-amber-200">Simulation: Combining Blood Thinners with Aspirin may increase bleeding risk. Consult your physician.</p>
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.map((m) => (
          <div key={m._id} className={`group bg-white dark:bg-slate-800 p-6 rounded-[2rem] border transition-all duration-300 ${m.active ? 'border-gray-100 dark:border-slate-700 shadow-sm' : 'border-dashed border-gray-200 dark:border-slate-800 opacity-60'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${m.active ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-gray-50 dark:bg-slate-900'}`}>
                <Pill className={`h-6 w-6 ${m.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggle(m._id)} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  {m.active ? <ToggleRight className="h-6 w-6 text-indigo-600" /> : <ToggleLeft className="h-6 w-6 text-gray-400" />}
                </button>
                <button onClick={() => handleDelete(m._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{m.name}</h3>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-4">{m.dosage}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>{m.frequency} • {m.times.join(', ')}</span>
              </div>
              {m.notes && (
                <div className="flex items-start gap-2 text-xs text-gray-500 bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
                  <Info className="h-3.5 w-3.5 text-amber-500 mt-0.5" />
                  <span>{m.notes}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <Calendar className="h-3 w-3" /> Started {format(new Date(m.createdAt), 'MMM dd')}
              </div>
              {m.active ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded-full">
                  <AlertCircle className="h-3 w-3" /> Paused
                </span>
              )}
            </div>
          </div>
        ))}

        {medicines.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200/50 dark:shadow-none">
              <Pill className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No medicines listed</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Click the button above to add your first medicine reminder.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">New Medicine</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Medicine Name</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="e.g. Paracetamol"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Dosage</label>
                <input 
                  required 
                  value={formData.dosage} 
                  onChange={e => setFormData({...formData, dosage: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 500mg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                <select 
                  value={formData.frequency} 
                  onChange={e => setFormData({...formData, frequency: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>Once a day</option>
                  <option>Twice a day</option>
                  <option>Three times a day</option>
                  <option>Four times a day</option>
                  <option>As needed</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Time(s)</label>
                <div className="flex gap-2">
                  <input 
                    type="time"
                    required
                    value={formData.times[0]}
                    onChange={e => setFormData({...formData, times: [e.target.value]})}
                    className="flex-1 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
                <textarea 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                  placeholder="Take after food..."
                />
              </div>
              <div className="col-span-2 flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinesTab;
