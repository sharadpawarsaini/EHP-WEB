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
  Zap,
  Flame,
  Check
} from 'lucide-react';
import { format } from 'date-fns';

const MedicinesTab = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [takenDoses, setTakenDoses] = useState<Record<string, boolean>>({});
  const [streakCount, setStreakCount] = useState(7);
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

  const toggleTakeDose = (id: string) => {
    const nextState = !takenDoses[id];
    setTakenDoses(prev => ({ ...prev, [id]: nextState }));
    if (nextState) {
      setStreakCount(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-blue-100 dark:border-slate-800 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-600">
            <Pill className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Prescription & Dose Tracker</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Daily Medication Adherence & Schedules</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-700">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{streakCount}-Day Adherence Streak!</span>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary text-xs py-3 px-5"
          >
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.map((m) => {
          const isTaken = takenDoses[m._id];
          return (
            <div key={m._id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-2xl text-blue-600 border border-blue-100 dark:border-slate-700">
                    <Pill className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{m.name}</h3>
                <p className="text-xs font-bold text-blue-600 mb-3">{m.dosage}</p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{m.frequency} • {m.times.join(', ')}</span>
                  </div>
                  {m.notes && (
                    <div className="flex items-start gap-2 text-slate-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-100">
                      <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{m.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => toggleTakeDose(m._id)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isTaken 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'btn-primary'
                  }`}
                >
                  {isTaken ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  {isTaken ? "Today's Dose Completed ✓" : "Mark Dose as Taken"}
                </button>
              </div>
            </div>
          );
        })}

        {medicines.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/90 dark:bg-slate-900/90 rounded-[3rem] border border-blue-100 dark:border-slate-800 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Pill className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Medicines Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">Track your daily prescriptions and dose schedules seamlessly.</p>
            <button onClick={() => setShowAdd(true)} className="btn-primary text-xs py-3 px-6 mx-auto">
              + Add First Medicine
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-blue-100 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Medicine Prescription</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-600 mb-1">Medicine Name</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="health-input"
                  placeholder="e.g. Paracetamol / Amoxicillin"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1">Dosage</label>
                  <input 
                    required 
                    value={formData.dosage} 
                    onChange={e => setFormData({...formData, dosage: e.target.value})}
                    className="health-input"
                    placeholder="e.g. 500mg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Frequency</label>
                  <select 
                    value={formData.frequency} 
                    onChange={e => setFormData({...formData, frequency: e.target.value})}
                    className="health-input"
                  >
                    <option>Once a day</option>
                    <option>Twice a day</option>
                    <option>Three times a day</option>
                    <option>Four times a day</option>
                    <option>As needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Scheduled Time</label>
                <input 
                  type="time"
                  required
                  value={formData.times[0]}
                  onChange={e => setFormData({...formData, times: [e.target.value]})}
                  className="health-input"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Instructions / Notes (Optional)</label>
                <input 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="health-input"
                  placeholder="e.g. Take after meals with water"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1 py-3">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 py-3">
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinesTab;
