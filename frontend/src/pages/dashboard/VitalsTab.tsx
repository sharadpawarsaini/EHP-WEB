import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Info, 
  Calendar, 
  Clock, 
  RefreshCcw, 
  Zap, 
  Heart, 
  Brain, 
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  X as XIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

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
        value: vType === 'Blood Pressure' ? parseInt(v.value.split('/')[0]) : parseFloat(v.value),
        fullValue: v.value
      }));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Bio-Metrics...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full">
      
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
         <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">Proactive Vitals</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Bio-Metric Analysis</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time health trends and predictive biometric insights powered by EHP Cloud.</p>
         </div>
         <div className="flex gap-4 w-full sm:w-auto">
            <button onClick={() => navigate('/dashboard/integrations')} className="flex-1 sm:flex-none p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:scale-110 transition-all">
               <RefreshCcw className="h-5 w-5 text-blue-600" />
            </button>
            <button onClick={() => setShowAdd(true)} className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
               Log New Vital
            </button>
         </div>
      </div>

      {/* Standout Feature: Health Score & AI Insights */}
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Activity className="h-40 w-40" />
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-10">
               <div>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                     <Brain className="h-6 w-6 text-blue-400" />
                     Bio-Data Analysis
                  </h3>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stability Score</span>
                        <span className="text-2xl font-black text-emerald-500">92%</span>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">AI Observation</p>
                        <p className="text-sm font-medium leading-relaxed">Your Heart Rate Variability (HRV) shows high recovery efficiency. Blood Pressure is currently within the optimal clinical range.</p>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col items-center justify-center border-l border-white/10 pl-10 hidden md:flex">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
                     <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent -rotate-45"></div>
                     <div className="text-center">
                        <p className="text-3xl font-black">9.2</p>
                        <p className="text-[9px] font-black uppercase text-gray-400">Health Index</p>
                     </div>
                  </div>
                  <button className="mt-8 flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-white transition-all">
                     View Deep Insights <ChevronRight className="h-4 w-4" />
                  </button>
               </div>
            </div>
         </div>

         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20 flex flex-col justify-between">
            <div>
               <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Device Link Status</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-black text-gray-700 dark:text-gray-300">Apple Watch</span>
                     </div>
                     <RefreshCcw className="h-4 w-4 text-gray-300 animate-spin-slow" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-black text-gray-700 dark:text-gray-300">Google Fit</span>
                     </div>
                     <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
               </div>
            </div>
            <button onClick={() => navigate('/dashboard/integrations')} className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
               Manage Wearables
            </button>
         </div>
      </div>

      {/* Main Trends View */}
      <div className="grid lg:grid-cols-2 gap-8">
         {/* Blood Pressure Trend */}
         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl">
                     <Heart className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">Cardio Trend</h4>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Pressure (Systolic)</p>
                  </div>
               </div>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData('Blood Pressure')}>
                     <defs>
                        <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.2)" />
                     <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                     <YAxis fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                     <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                     <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorBp)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Glucose Trend */}
         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                     <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">Glucose Cycle</h4>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mg/dL Analysis</p>
                  </div>
               </div>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData('Blood Glucose')}>
                     <defs>
                        <linearGradient id="colorGl" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.2)" />
                     <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                     <YAxis fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                     <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                     <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorGl)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* History Log */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20 overflow-hidden">
         <div className="p-8 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Audit Log</h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total: {vitals.length} Entries</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <th className="px-8 py-5">Biometric Type</th>
                     <th className="px-8 py-5">Reading</th>
                     <th className="px-8 py-5">Captured At</th>
                     <th className="px-8 py-5 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {vitals.slice().reverse().map(v => (
                     <tr key={v._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-all group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-xl ${
                                 v.type === 'Blood Pressure' ? 'bg-red-50 text-red-600 dark:bg-red-900/30' :
                                 v.type === 'Blood Glucose' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' :
                                 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                              }`}>
                                 <Zap className="h-4 w-4" />
                              </div>
                              <span className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">{v.type}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-lg font-black text-gray-900 dark:text-white">{v.value}</span>
                           <span className="ml-1.5 text-[10px] font-bold text-gray-400 uppercase">{v.unit}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{format(new Date(v.date), 'MMM dd, yyyy')}</span>
                              <span className="text-[9px] font-black text-gray-400 uppercase">{format(new Date(v.date), 'HH:mm')}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => deleteVital(v._id)} className="p-3 bg-red-50 text-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 w-full max-w-lg shadow-2xl relative">
                <button onClick={() => setShowAdd(false)} className="absolute top-8 right-8 p-3 bg-gray-100 dark:bg-slate-900 rounded-full text-gray-500"><XIcon className="h-4 w-4" /></button>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Record Bio-Data</h3>
                <form onSubmit={addVital} className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Biometric Indicator</label>
                      <select value={type} onChange={e => setType(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10">
                        <option value="Blood Pressure">Blood Pressure</option>
                        <option value="Blood Glucose">Blood Glucose</option>
                        <option value="Heart Rate">Heart Rate</option>
                        <option value="Weight">Weight</option>
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Captured Value</label>
                         <input required placeholder="120/80" value={value} onChange={e => setValue(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" />
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Measurement Unit</label>
                         <input readOnly value={unit} className="w-full p-5 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 text-gray-400 font-bold outline-none" />
                      </div>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Time of Capture</label>
                      <input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" />
                   </div>
                   <button type="submit" className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all">Synchronize to Cloud</button>
                </form>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VitalsTab;
