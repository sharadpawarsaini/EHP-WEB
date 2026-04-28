import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  XCircle, 
  X,
  Stethoscope,
  ChevronRight,
  MoreVertical,
  Zap,
  ShieldCheck,
  AlertCircle,
  Video
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    hospitalName: '',
    appointmentDate: format(new Date(), "yyyy-MM-dd'T'10:00"),
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/appointments', formData);
      setAppointments([...appointments, data].sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()));
      setShowAdd(false);
      setFormData({
        doctorName: '',
        specialty: '',
        hospitalName: '',
        appointmentDate: format(new Date(), "yyyy-MM-dd'T'10:00"),
        reason: '',
        notes: ''
      });
    } catch (err) {
      alert('Failed to schedule appointment');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { data } = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments(appointments.map(a => a._id === id ? data : a));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Cancel and delete this appointment record?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments(appointments.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800/50';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/30 dark:border-rose-800/50';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Schedule...</p>
    </div>
  );

  const upcoming = appointments.filter(a => a.status === 'Scheduled');
  const past = appointments.filter(a => a.status !== 'Scheduled');

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">Tele-Health Ready</span>
               <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Calendar Sync</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Visit Scheduler</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Manage clinical consultations and telehealth sessions</p>
         </div>
         <button onClick={() => setShowAdd(true)} className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Book Consultation
         </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Main Timeline */}
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Upcoming Queue</h3>
            <div className="space-y-6">
               {upcoming.map((a) => (
                 <motion.div layout key={a._id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20 group hover:border-indigo-500/30 transition-all">
                   <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                     <div className="flex gap-6">
                       <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl group-hover:scale-110 transition-all h-fit">
                         <Stethoscope className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                       </div>
                       <div className="space-y-1">
                         <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{a.doctorName}</h4>
                         <p className="text-sm text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest">{a.specialty}</p>
                         <div className="flex flex-wrap gap-4 pt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           <div className="flex items-center gap-2">
                             <Clock className="h-3.5 w-3.5 text-emerald-500" />
                             <span>{format(new Date(a.appointmentDate), 'MMM dd, yyyy • HH:mm')}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <MapPin className="h-3.5 w-3.5 text-rose-500" />
                             <span className="truncate max-w-[150px]">{a.hospitalName}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="flex flex-row sm:flex-col items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                       <div className={`text-[9px] font-black px-4 py-2 rounded-xl border uppercase tracking-[0.2em] ${getStatusColor(a.status)}`}>
                         {a.status}
                       </div>
                       <div className="flex gap-2 ml-auto sm:ml-0">
                         <button onClick={() => handleStatusUpdate(a._id, 'Completed')} className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Mark as Completed">
                           <CheckCircle2 className="h-5 w-5" />
                         </button>
                         <button onClick={() => handleStatusUpdate(a._id, 'Cancelled')} className="p-3 bg-rose-50 text-rose-600 dark:bg-rose-900/30 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Cancel Appointment">
                           <XCircle className="h-5 w-5" />
                         </button>
                       </div>
                     </div>
                   </div>
                   {a.reason && (
                     <div className="mt-8 p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-400 italic flex items-start gap-3">
                        <Zap className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        "{a.reason}"
                     </div>
                   )}
                 </motion.div>
               ))}
               {upcoming.length === 0 && (
                 <div className="py-20 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
                    <CalendarIcon className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                    <p className="text-xl font-black text-gray-400 mb-2">No clinical visits queued.</p>
                    <button onClick={() => setShowAdd(true)} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Schedule your first visit</button>
                 </div>
               )}
            </div>
         </div>

         {/* Sidebar Insights */}
         <div className="space-y-8">
            <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Video className="h-40 w-40" />
               </div>
               <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-amber-400" />
                  Smart Tips
               </h3>
               <ul className="space-y-6">
                  <li className="flex gap-4">
                     <div className="p-2 bg-white/10 rounded-lg h-fit">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                     </div>
                     <p className="text-sm font-medium text-gray-400 leading-relaxed">Arrive 15 minutes early for biometrics check.</p>
                  </li>
                  <li className="flex gap-4">
                     <div className="p-2 bg-white/10 rounded-lg h-fit">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                     </div>
                     <p className="text-sm font-medium text-gray-400 leading-relaxed">Sync your Google Fit data before consultation.</p>
                  </li>
                  <li className="flex gap-4">
                     <div className="p-2 bg-white/10 rounded-lg h-fit">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                     </div>
                     <p className="text-sm font-medium text-gray-400 leading-relaxed">Have your EHP QR code ready for scanning.</p>
                  </li>
               </ul>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white dark:border-slate-700 shadow-xl">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Archived Visits</h4>
               <div className="space-y-4">
                  {past.slice(0, 3).map(a => (
                     <div key={a._id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                           <div>
                              <p className="text-xs font-black text-gray-900 dark:text-white leading-none">{a.doctorName}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">{format(new Date(a.appointmentDate), 'MMM dd')}</p>
                           </div>
                        </div>
                        <span className={`text-[8px] font-black px-2 py-1 rounded-lg border uppercase ${getStatusColor(a.status)}`}>{a.status}</span>
                     </div>
                  ))}
                  {past.length > 3 && (
                     <button className="w-full pt-4 text-[9px] font-black uppercase tracking-widest text-indigo-600 text-center hover:underline">View All History</button>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 max-w-lg w-full relative z-10 shadow-2xl border border-white dark:border-slate-700">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Book Visit</h3>
                <button onClick={() => setShowAdd(false)} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Practitioner Details</label>
                   <div className="grid grid-cols-2 gap-4">
                      <input required value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" placeholder="Dr. Name" />
                      <input required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" placeholder="Specialty" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Facility Name</label>
                   <input required value={formData.hospitalName} onChange={e => setFormData({...formData, hospitalName: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold outline-none" placeholder="Hospital or Clinic" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Appointment Schedule</label>
                   <input type="datetime-local" required value={formData.appointmentDate} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-black outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason for Visit</label>
                   <textarea rows={3} required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-medium outline-none resize-none" placeholder="Briefly describe your symptoms or reason..." />
                </div>
                <button type="submit" className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all mt-4">
                   Confirm Appointment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentsTab;
