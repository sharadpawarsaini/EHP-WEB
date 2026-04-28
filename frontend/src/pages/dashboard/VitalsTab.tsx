import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, Plus, Trash2, TrendingUp, Info, Calendar, Clock, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

const VitalsTab = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState('Blood Pressure');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('mmHg');
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  useEffect(() => {
    fetchVitals();
  }, []);

  useEffect(() => {
    // Update unit automatically based on type
    const units: any = {
      'Blood Pressure': 'mmHg',
      'Blood Glucose': 'mg/dL',
      'Heart Rate': 'bpm',
      'Weight': 'kg'
    };
    setUnit(units[type]);
  }, [type]);

  const fetchVitals = async () => {
    try {
      const { data } = await api.get('/vitals');
      setVitals(data);
    } catch (err) {
      console.error('Failed to fetch vitals');
    } finally {
      setLoading(false);
    }
  };

  const addVital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/vitals', { type, value, unit, date });
      setVitals([...vitals, data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setValue('');
      setShowAdd(false);
    } catch (err) {
      alert('Failed to add vital record');
    }
  };

  const deleteVital = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    try {
      await api.delete(`/vitals/${id}`);
      setVitals(vitals.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const getChartData = (vType: string) => {
    return vitals
      .filter(v => v.type === vType)
      .map(v => ({
        date: format(new Date(v.date), 'MMM dd'),
        // For BP, we only plot the systolic (first number) for the line chart
        value: vType === 'Blood Pressure' ? parseInt(v.value.split('/')[0]) : parseFloat(v.value),
        fullValue: v.value
      }));
  };

  if (loading) return <div className="text-gray-500 animate-pulse p-8">Loading vitals...</div>;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Health Trends</h2>
          <p className="text-gray-500 dark:text-gray-400">Track and visualize your vital signs over time.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/dashboard/integrations')}
            className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all active:scale-95 border border-gray-200 dark:border-slate-600"
          >
            <RefreshCcw className="h-5 w-5" /> Sync
          </button>
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" /> Add Vital
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Blood Pressure Chart */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 sm:p-8 rounded-[2rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/40 dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-xl">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              Blood Pressure
            </h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">Systolic Trend (mmHg)</span>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData('Blood Pressure')}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Glucose Chart */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 sm:p-8 rounded-[2rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/40 dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              Blood Glucose
            </h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">mg/dL</span>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData('Blood Glucose')}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Vital Records</h3>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-4">Date & Time</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Value</th>
                <th className="px-8 py-4">Unit</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {vitals.slice().reverse().map(v => (
                <tr key={v._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{format(new Date(v.date), 'MMM dd, yyyy')}</span>
                      <span className="text-[10px] font-bold text-gray-400">{format(new Date(v.date), 'HH:mm')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      v.type === 'Blood Pressure' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                      v.type === 'Blood Glucose' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                      v.type === 'Heart Rate' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' :
                      'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                    }`}>
                      {v.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-base font-black text-gray-900 dark:text-white">{v.value}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-gray-400">{v.unit}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => deleteVital(v._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-700">
          {vitals.slice().reverse().map(v => (
            <div key={v._id} className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <span className={`w-2 h-2 rounded-full ${
                      v.type === 'Blood Pressure' ? 'bg-red-500' :
                      v.type === 'Blood Glucose' ? 'bg-emerald-500' :
                      v.type === 'Heart Rate' ? 'bg-purple-500' :
                      'bg-blue-500'
                    }`}></span>
                   <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{v.type}</span>
                </div>
                <div className="flex items-baseline gap-1">
                   <span className="text-xl font-black text-gray-900 dark:text-white">{v.value}</span>
                   <span className="text-[10px] font-bold text-gray-400">{v.unit}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                   <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(v.date), 'MMM dd')}</span>
                   <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(v.date), 'HH:mm')}</span>
                </div>
              </div>
              <button onClick={() => deleteVital(v._id)} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl transition-all active:scale-95">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {vitals.length === 0 && (
          <div className="px-8 py-20 text-center">
            <Activity className="h-12 w-12 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium italic">No vital records yet.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 sm:p-10 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">Add Vital</h3>
               <button onClick={() => setShowAdd(false)} className="p-2 bg-gray-50 dark:bg-slate-700 rounded-xl text-gray-500"><Plus className="h-6 w-6 rotate-45" /></button>
            </div>
            <form onSubmit={addVital} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Vital Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                  <option value="Blood Pressure">Blood Pressure</option>
                  <option value="Blood Glucose">Blood Glucose</option>
                  <option value="Heart Rate">Heart Rate</option>
                  <option value="Weight">Weight</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Value ({unit})</label>
                <input 
                  required 
                  placeholder={type === 'Blood Pressure' ? '120/80' : 'Value'}
                  value={value} 
                  onChange={e => setValue(e.target.value)} 
                  className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-300" 
                />
                {type === 'Blood Pressure' && <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1"><Info className="h-3 w-3 text-blue-500" /> Enter as Systolic/Diastolic</p>}
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Date & Time</label>
                <input 
                  type="datetime-local"
                  required 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
              <div className="flex gap-4 pt-4 pb-4 sm:pb-0">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gray-100 dark:bg-slate-700 text-gray-500 hover:bg-gray-200 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">Add Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalsTab;
