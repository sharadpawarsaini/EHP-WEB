import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, Plus, Trash2, TrendingUp, Info } from 'lucide-react';
import { format } from 'date-fns';

const VitalsTab = () => {
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

  if (loading) return <div className="text-gray-500">Loading vitals...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Health Trends</h2>
          <p className="text-gray-600 dark:text-gray-400">Track and visualize your vital signs over time.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-5 w-5" /> Add Vital
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Blood Pressure Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" /> Blood Pressure
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Systolic Trend (mmHg)</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData('Blood Pressure')}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Glucose Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Blood Glucose
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">mg/dL</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData('Blood Glucose')}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Records Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Vital Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900/50 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {vitals.slice().reverse().map(v => (
                <tr key={v._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {format(new Date(v.date), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      v.type === 'Blood Pressure' ? 'bg-red-50 text-red-600' :
                      v.type === 'Blood Glucose' ? 'bg-emerald-50 text-emerald-600' :
                      v.type === 'Heart Rate' ? 'bg-purple-50 text-purple-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {v.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{v.value}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{v.unit}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteVital(v._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {vitals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No vital records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add Vital Record</h3>
            <form onSubmit={addVital} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Vital Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <option value="Blood Pressure">Blood Pressure</option>
                  <option value="Blood Glucose">Blood Glucose</option>
                  <option value="Heart Rate">Heart Rate</option>
                  <option value="Weight">Weight</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Value ({unit})</label>
                <input 
                  required 
                  placeholder={type === 'Blood Pressure' ? '120/80' : 'Value'}
                  value={value} 
                  onChange={e => setValue(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900" 
                />
                {type === 'Blood Pressure' && <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><Info className="h-3 w-3" /> Enter as Systolic/Diastolic</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date & Time</label>
                <input 
                  type="datetime-local"
                  required 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">Add Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalsTab;
