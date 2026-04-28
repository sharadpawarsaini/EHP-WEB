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
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';

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
      case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading your schedule...</div>;

  const upcoming = appointments.filter(a => a.status === 'Scheduled');
  const past = appointments.filter(a => a.status !== 'Scheduled');

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Appointment Manager</h2>
          <p className="text-gray-600 dark:text-gray-400">Keep track of your medical visits and consultations.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5" /> Schedule Visit
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              Upcoming Appointments <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{upcoming.length}</span>
            </h3>
            <div className="space-y-4">
              {upcoming.map((a) => (
                <div key={a._id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm group hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                        <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{a.doctorName}</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">{a.specialty}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{format(new Date(a.appointmentDate), 'MMM dd, yyyy • HH:mm')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{a.hospitalName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase tracking-widest ${getStatusColor(a.status)}`}>
                        {a.status}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate(a._id, 'Completed')} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors" title="Mark as Completed">
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleStatusUpdate(a._id, 'Cancelled')} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Cancel Appointment">
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {a.reason && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl text-sm text-gray-600 dark:text-gray-400 italic">
                      " {a.reason} "
                    </div>
                  )}
                </div>
              ))}
              {upcoming.length === 0 && (
                <div className="py-12 text-center bg-gray-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
                  <p className="text-gray-400 italic">No upcoming appointments scheduled.</p>
                </div>
              )}
            </div>
          </section>

          {past.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Past & Cancelled</h3>
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                    {past.slice().reverse().map(a => (
                      <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{a.doctorName}</p>
                              <p className="text-[10px] text-gray-500">{format(new Date(a.appointmentDate), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusColor(a.status)}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete(a._id)} className="text-gray-300 hover:text-red-500 p-2">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
            <h4 className="text-xl font-bold mb-4">Quick Health Tips</h4>
            <ul className="space-y-4 text-sm text-blue-50/80">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-200 shrink-0" />
                Prepare a list of symptoms before your visit.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-200 shrink-0" />
                Bring your digital EHP reports to the doctor.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-200 shrink-0" />
                Arrive 15 minutes early for paperwork.
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Overview</h4>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] font-bold text-gray-400 mb-2">{d}</div>)}
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className={`aspect-square flex items-center justify-center text-[10px] rounded-lg ${i + 1 === new Date().getDate() ? 'bg-blue-600 text-white font-bold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Appointment</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Doctor's Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input required value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} className="w-full pl-12 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dr. John Smith" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Specialty</label>
                  <input required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cardiology" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hospital/Clinic</label>
                  <input required value={formData.hospitalName} onChange={e => setFormData({...formData, hospitalName: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="City Hospital" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date & Time</label>
                  <input type="datetime-local" required value={formData.appointmentDate} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reason for Visit</label>
                  <input required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Regular Checkup / Chest Pain" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;
