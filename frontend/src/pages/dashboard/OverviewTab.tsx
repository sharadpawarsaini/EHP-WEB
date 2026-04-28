import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, TrendingUp, FileText, ArrowRight, MapPin, Navigation, Trophy, Calendar, Hospital, Clock, Stethoscope, ChevronRight, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { format, differenceInYears } from 'date-fns';

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [safetyScore, setSafetyScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, medicalRes, medicinesRes, vaccinationsRes, appointmentsRes, visitsRes, reportsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/medical'),
          api.get('/medicines'),
          api.get('/vaccinations'),
          api.get('/appointments'),
          api.get('/visits'),
          api.get('/reports')
        ]);

        const profile = profileRes.data;
        const medical = medicalRes.data;
        const medicines = medicinesRes.data;
        const vaccinations = vaccinationsRes.data;
        const appointments = appointmentsRes.data;
        const visits = visitsRes.data;
        const reports = reportsRes.data;

        setData({ profile, medical, medicines, vaccinations, appointments, visits, reports });

        // Calculate Safety Score
        const checklistItems = [
          { label: 'Profile Completed', completed: !!profile.fullName && !!profile.dob && !!profile.bloodGroup },
          { label: 'Allergies Listed', completed: medical.allergies?.length > 0 },
          { label: 'Medical Conditions', completed: medical.conditions?.length > 0 },
          { label: 'Emergency Contacts', completed: true }, 
          { label: 'Digital Reports', completed: reports?.length > 0 },
          { label: 'Insurance Info', completed: !!medical.insurance?.provider },
          { label: 'Medicine Reminders', completed: medicines?.length > 0 },
          { label: 'Vaccination History', completed: vaccinations?.length > 0 },
          { label: 'Health Appointments', completed: appointments?.length > 0 }
        ];

        const completedCount = checklistItems.filter(item => item.completed).length;
        setSafetyScore(Math.round((completedCount / checklistItems.length) * 100));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getInsight = () => {
    const insights = [
      "Keep your emergency contacts updated to ensure they're notified immediately.",
      "Adding a profile photo helps medical responders identify you faster.",
      "Upload your latest blood test report for a more complete medical profile.",
      "Make sure to list all current medications, including supplements."
    ];
    if (safetyScore < 50) return "Your safety score is low. Please complete more profile sections.";
    if (safetyScore < 80) return "You're getting there! A few more details will make your profile emergency-ready.";
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const calculateAge = (dob: any) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    return differenceInYears(new Date(), birthDate);
  };

  const age = calculateAge(data?.profile?.dob);

  if (loading) return <div className="text-gray-500 dark:text-gray-400 p-8 animate-pulse font-bold tracking-widest uppercase text-xs">Loading health landscape...</div>;

  const upcomingAppointments = data?.appointments?.filter((a: any) => new Date(a.appointmentDate) >= new Date()).sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  const recentVisits = data?.visits?.sort((a: any, b: any) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Banner: Safety Score & Welcome */}
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Welcome, {data?.profile?.fullName?.split(' ')[0] || 'User'}</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Your health passport is {safetyScore}% ready. {age !== null && `Current age: ${age} years.`}</p>
            </div>
            <div className="flex items-center space-x-4 bg-blue-600 p-5 rounded-[2rem] shadow-xl shadow-blue-600/30">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                 <Zap className="h-6 w-6 text-white" />
               </div>
               <div className="text-left">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Safety Score</p>
                 <p className="text-2xl font-black text-white">{safetyScore}%</p>
               </div>
            </div>
          </div>
          
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood</p>
              <p className="text-xl font-black text-red-600">{data?.profile?.bloodGroup || '??'}</p>
            </div>
            <div className="p-5 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Allergies</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{data?.medical?.allergies?.length || 0}</p>
            </div>
            <div className="p-5 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Meds</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{data?.medicines?.length || 0}</p>
            </div>
            <div className="p-5 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-xl font-black text-emerald-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl shadow-indigo-600/30 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck className="h-40 w-40" />
           </div>
           <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[1.2rem] flex items-center justify-center mb-8 border border-white/30">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">AI Insight</h3>
            <p className="text-blue-100 font-medium leading-relaxed">{getInsight()}</p>
          </div>
          <button className="mt-8 flex items-center justify-center space-x-2 py-4 bg-white text-blue-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all shadow-xl shadow-black/10 active:scale-95 relative z-10">
            <span>Audit Passport</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments Section */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                     <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  Upcoming Appointments
               </h3>
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Calendar</button>
            </div>
            
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingAppointments.slice(0, 2).map((app: any) => (
                  <div key={app._id} className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700 group hover:border-blue-500/30 transition-all">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                           <Stethoscope className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{format(new Date(app.appointmentDate), 'MMM dd')}</p>
                           <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{format(new Date(app.appointmentDate), 'HH:mm')}</p>
                        </div>
                     </div>
                     <h4 className="font-black text-gray-900 dark:text-white mb-1 truncate">{app.doctorName}</h4>
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">{app.specialty}</p>
                     <div className="flex items-center text-xs text-gray-400 gap-1.5">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{app.hospitalName}</span>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                 <p className="text-gray-400 font-bold italic">No upcoming appointments scheduled.</p>
              </div>
            )}
          </div>

          {/* Recent Hospital Visits Section */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                     <Hospital className="h-6 w-6 text-emerald-600" />
                  </div>
                  Recent Hospital Visits
               </h3>
               <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Full History</button>
            </div>

            <div className="space-y-4">
               {recentVisits && recentVisits.length > 0 ? (
                 recentVisits.map((visit: any) => (
                   <div key={visit._id} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700 group hover:bg-white dark:hover:bg-slate-800 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-700">
                            <Hospital className="h-6 w-6 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-gray-900 dark:text-white mb-1">{visit.hospitalName}</p>
                            <div className="flex items-center gap-3">
                               <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Clock className="h-3 w-3" /> {format(new Date(visit.visitDate), 'MMM dd, yyyy')}</span>
                               <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[8px] font-black uppercase rounded-md tracking-widest">Completed</span>
                            </div>
                         </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-all" />
                   </div>
                 ))
               ) : (
                 <div className="py-12 text-center bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                    <p className="text-gray-400 font-bold italic">No hospital visits recorded yet.</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Widgets & Stats */}
        <div className="space-y-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700 overflow-hidden relative group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-emerald-600" />
              Safety Radius
            </h3>
            <div className="space-y-6">
              {[
                { name: 'City General Hospital', dist: '1.2 km', time: '5 mins' },
                { name: 'Apollo Emergency', dist: '2.8 km', time: '12 mins' },
                { name: 'Red Cross Clinic', dist: '3.5 km', time: '15 mins' }
              ].map((hosp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-emerald-100 dark:border-emerald-900/30">
                  <div className="absolute -left-[5.5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">{hosp.name}</p>
                  <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>{hosp.dist}</span>
                    <span className="mx-2">•</span>
                    <span className="text-emerald-600">{hosp.time} away</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 group active:scale-95 transition-all">
              <Navigation className="h-4 w-4 group-hover:animate-bounce" />
              <span>Launch SOS Navigator</span>
            </button>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Health XP
            </h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-2xl border-4 border-amber-100 dark:border-amber-900/30 flex items-center justify-center p-1">
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="font-black text-sm text-gray-900 dark:text-white">Profile Level: {safetyScore > 90 ? 'Guardian' : 'Elite'}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{safetyScore}% Data Integrity</p>
              </div>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden border border-gray-50 dark:border-slate-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${safetyScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
              />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                  <FileText className="h-5 w-5 text-indigo-600" />
               </div>
               <h3 className="text-lg font-black text-gray-900 dark:text-white">Documents</h3>
            </div>
            <div className="space-y-4">
               {data?.reports?.slice(0, 2).map((report: any) => (
                 <div key={report._id} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 group hover:border-indigo-500/30 transition-all">
                    <div className="min-w-0">
                       <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{report.title}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase">{format(new Date(report.createdAt), 'MMM dd')}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600" />
                 </div>
               ))}
               {(!data?.reports || data.reports.length === 0) && (
                 <p className="text-xs text-gray-400 italic">No reports uploaded yet.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
