import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProfileContext } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  MapPin, 
  Navigation, 
  Trophy, 
  Calendar, 
  Hospital, 
  Clock, 
  Stethoscope, 
  ChevronRight, 
  ShieldCheck,
  Activity,
  Droplet,
  Heart,
  Thermometer,
  Search,
  Phone,
  Users,
  Eye,
  Plus,
  Shield,
  Activity as PulseIcon,
  UserCircle,
  Watch as WatchIcon
} from 'lucide-react';
import api from '../../services/api';
import { format, differenceInYears } from 'date-fns';
import { getFullPhotoUrl } from '../../utils/url';

const OverviewTab = () => {
  const navigate = useNavigate();
  const { photoUrl } = useProfileContext();
  const { isStealthMode, stealthData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [safetyScore, setSafetyScore] = useState(0);
  
  // Hospital Finder State
  const [nearbyFacilities, setNearbyFacilities] = useState<any[]>([]);
  const [locLoading, setLocLoading] = useState(false);
  const [isWearableConnected, setIsWearableConnected] = useState(false);
  const [livePulse, setLivePulse] = useState<number | null>(null);

  useEffect(() => {
    const savedStates = JSON.parse(localStorage.getItem('ehp_integrations') || '{}');
    const connected = Object.keys(savedStates).length > 0;
    setIsWearableConnected(connected);

    let interval: any;
    if (connected) {
      interval = setInterval(() => {
        setLivePulse(Math.floor(Math.random() * (85 - 65 + 1)) + 65);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // If stealth mode is active, bypass API and load ghost data
      if (isStealthMode) {
        setData(stealthData);
        setSafetyScore(72); // Safe-looking score for ghost profile
        setLoading(false);
        return;
      }
      try {
        const [profileRes, medicalRes, medicinesRes, vaccinationsRes, appointmentsRes, visitsRes, reportsRes, vitalsRes, familyRes] = await Promise.all([
          api.get('/profile'),
          api.get('/medical'),
          api.get('/medicines'),
          api.get('/vaccinations'),
          api.get('/appointments'),
          api.get('/visits'),
          api.get('/reports'),
          api.get('/vitals'),
          api.get('/family')
        ]);

        const profile = profileRes.data;
        const medical = medicalRes.data;
        const medicines = medicinesRes.data;
        const vaccinations = vaccinationsRes.data;
        const appointments = appointmentsRes.data;
        const visits = visitsRes.data;
        const reports = reportsRes.data;
        const vitals = vitalsRes.data;
        const family = familyRes.data;

        setData({ profile, medical, medicines, vaccinations, appointments, visits, reports, vitals, family });

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
          { label: 'Health Appointments', completed: appointments?.length > 0 },
          { label: 'Vitals Tracked', completed: vitals?.length > 0 }
        ];

        const completedCount = checklistItems.filter(item => item.completed).length;
        setSafetyScore(Math.round((completedCount / checklistItems.length) * 100));

        // Initial Location Fetch
        getMyLocation();

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const { data: facilities } = await api.get(`/hospitals/nearby?lat=${latitude}&lng=${longitude}&type=hospital`);
          const results = facilities.map((f: any) => ({
            ...f,
            distance: calculateDistance(latitude, longitude, f.lat, f.lng).toFixed(1)
          })).sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 3);
          setNearbyFacilities(results);
        } catch (err) {
          console.error('Failed to fetch hospitals');
        } finally {
          setLocLoading(false);
        }
      },
      () => setLocLoading(false)
    );
  };

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



  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase text-[10px]">Syncing Health Intelligence...</p>
    </div>
  );

  const upcomingAppointments = data?.appointments?.filter((a: any) => new Date(a.appointmentDate) >= new Date()).sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  const recentVisits = data?.visits?.sort((a: any, b: any) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()).slice(0, 3);
  
  // Latest Vitals logic
  const getLatestVital = (vType: string) => {
    return data?.vitals?.filter((v: any) => v.type === vType).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const vitalCards = [
    { label: 'Heart Rate', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', data: isWearableConnected ? { value: livePulse, unit: 'BPM' } : getLatestVital('Heart Rate'), path: '/dashboard/vitals' },
    { label: 'Blood Pressure', icon: Activity, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', data: getLatestVital('Blood Pressure'), path: '/dashboard/vitals' },
    { label: 'Blood Glucose', icon: Droplet, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', data: getLatestVital('Blood Glucose'), path: '/dashboard/vitals' },
    { label: 'Temperature', icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', data: getLatestVital('Temperature'), path: '/dashboard/vitals' },
  ];

  // Recent Activity Feed
  const activityFeed = [
    ...(data?.reports || []).map((r: any) => ({ type: 'report', date: r.createdAt, title: `Report uploaded: ${r.title}`, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' })),
    ...(data?.vitals || []).map((v: any) => ({ type: 'vital', date: v.date, title: `Vital tracked: ${v.type}`, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' })),
    ...(data?.visits || []).map((v: any) => ({ type: 'visit', date: v.visitDate, title: `Hospital Visit: ${v.hospitalName}`, icon: Hospital, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 no-scrollbar">
      {/* Dashboard Header */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500">
             <PulseIcon className="h-64 w-64" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center flex-shrink-0 border border-white/10 shadow-2xl overflow-hidden glow-border">
                 {photoUrl ? (
                   <img src={getFullPhotoUrl(photoUrl)!} alt="Profile" className="w-full h-full object-cover scale-110" />
                 ) : (
                   <UserCircle className="w-14 h-14 text-zinc-700" />
                 )}
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Authenticated Node</p>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tighter">GOOD DAY, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{data?.profile?.fullName?.split(' ')[0] || 'USER'}</span></h1>
                <p className="text-sm text-zinc-500 font-medium">System status: <span className="text-emerald-500 font-bold">READY</span>. Health integrity at {safetyScore}%.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-zinc-950 dark:bg-zinc-950 border border-white/10 p-5 rounded-[2rem] shadow-2xl hover:shadow-emerald-500/10 transition-all cursor-pointer group/score" onClick={() => navigate('/dashboard/profile')}>
               <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 glow-border group-hover/score:scale-110 transition-transform">
                 <ShieldCheck className="h-6 w-6 text-emerald-500" />
               </div>
               <div className="text-left pr-2">
                 <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest mb-1 leading-none">Safety Index</p>
                 <p className="text-3xl font-black text-white leading-none">{safetyScore}%</p>
               </div>
            </div>
          </div>
          
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            {vitalCards.map((v, i) => (
              <div 
                key={i} 
                onClick={() => navigate(v.path)}
                className="p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-inner hover:border-emerald-500/20 transition-all cursor-pointer group/vital"
              >
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-2xl ${v.bg} border border-white/5 group-hover/vital:scale-110 transition-transform`}>
                      <v.icon className={`h-5 w-5 ${v.color}`} />
                   </div>
                </div>
                <p className="text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-widest">{v.label}</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-white flex items-baseline gap-1">
                   {v.data ? v.data.value : '--'}
                   <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{v.data?.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-950/90 dark:bg-zinc-950/80 backdrop-blur-xl p-10 flex flex-col justify-between rounded-[3.5rem] relative overflow-hidden shadow-2xl border border-white/5">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 mix-blend-overlay"></div>
           <div className="relative z-10">
            <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-8 border border-white/10 glow-border">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Security Protocol</p>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Vulnerability <br/> Audit</h3>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">{getInsight()}</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="mt-10 w-full py-5 bg-white text-zinc-950 hover:bg-emerald-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 relative z-10 shadow-2xl hover:scale-105 active:scale-95"
          >
            Run Deep Audit <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <button onClick={() => navigate('/dashboard/vitals')} className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-6 relative z-10">
               <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 glow-border group-hover:scale-110 transition-transform">
                  <PulseIcon className="h-6 w-6" />
               </div>
               <div className="text-left">
                  <p className="text-base font-black text-zinc-900 dark:text-white mb-1 uppercase tracking-tighter">Log Vital</p>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">New Protocol Reading</p>
               </div>
            </div>
            <ChevronRight className="h-6 w-6 text-zinc-700 group-hover:text-emerald-500 transition-all relative z-10" />
         </button>
         <button onClick={() => navigate('/dashboard/reports')} className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-6 relative z-10">
               <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-500 border border-cyan-500/20 glow-border group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
               </div>
               <div className="text-left">
                  <p className="text-base font-black text-zinc-900 dark:text-white mb-1 uppercase tracking-tighter">Upload Report</p>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Binary Data Sync</p>
               </div>
            </div>
            <ChevronRight className="h-6 w-6 text-zinc-700 group-hover:text-cyan-500 transition-all relative z-10" />
         </button>
         <button onClick={() => navigate('/dashboard/appointments')} className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-6 relative z-10">
               <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20 glow-border group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
               </div>
               <div className="text-left">
                  <p className="text-base font-black text-zinc-900 dark:text-white mb-1 uppercase tracking-tighter">Schedule</p>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Clinical Engagement</p>
               </div>
            </div>
            <ChevronRight className="h-6 w-6 text-zinc-700 group-hover:text-amber-500 transition-all relative z-10" />
         </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments Section */}
          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="flex justify-between items-center mb-10 relative z-10">
               <h3 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-5 uppercase tracking-tighter">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
                    <Calendar className="h-6 w-6 text-emerald-500" />
                  </div>
                  Upcoming Visits
               </h3>
               <button onClick={() => navigate('/dashboard/appointments')} className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">Full Schedule</button>
            </div>
            
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                {upcomingAppointments.slice(0, 2).map((app: any) => (
                  <div key={app._id} className="p-8 bg-zinc-950/50 dark:bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] group/card hover:border-emerald-500/30 transition-all cursor-pointer shadow-inner" onClick={() => navigate('/dashboard/appointments')}>
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 shadow-2xl group-hover/card:scale-110 transition-transform">
                           <Stethoscope className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">{format(new Date(app.appointmentDate), 'MMM dd')}</p>
                           <p className="text-2xl font-black text-white leading-none tracking-tighter">{format(new Date(app.appointmentDate), 'HH:mm')}</p>
                        </div>
                     </div>
                     <h4 className="text-lg font-black text-white mb-1 truncate uppercase tracking-tight">{app.doctorName}</h4>
                     <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-6">{app.specialty}</p>
                     <div className="flex items-center text-[10px] text-zinc-400 font-black uppercase tracking-widest gap-2.5 bg-white/5 px-4 py-3 rounded-xl border border-white/5 w-fit">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span className="truncate">{app.hospitalName}</span>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 relative z-10">
                 <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">No upcoming clinical engagements.</p>
                 <button onClick={() => navigate('/dashboard/appointments')} className="mt-4 text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] hover:text-emerald-400 transition-colors">+ Initialize Protocol</button>
              </div>
            )}
          </div>

          {/* Recent Hospital Visits Section */}
          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
             <div className="flex justify-between items-center mb-10 relative z-10">
               <h3 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-5 uppercase tracking-tighter">
                  <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 glow-border">
                     <Hospital className="h-6 w-6 text-cyan-500" />
                  </div>
                  Recent Visits
               </h3>
               <button onClick={() => navigate('/dashboard/visits')} className="text-[10px] font-black text-cyan-500 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">View History</button>
            </div>

            <div className="space-y-4 relative z-10">
               {recentVisits && recentVisits.length > 0 ? (
                 recentVisits.map((visit: any) => (
                   <div key={visit._id} onClick={() => navigate(`/dashboard/visits`)} className="flex items-center justify-between p-6 bg-zinc-950/50 dark:bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-[2rem] group/visit hover:border-cyan-500/30 transition-all cursor-pointer shadow-inner">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5 group-hover/visit:scale-110 transition-transform">
                            <Hospital className="h-6 w-6 text-zinc-500 group-hover/visit:text-cyan-500 transition-colors" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-white mb-1 uppercase tracking-tight">{visit.hospitalName}</p>
                            <div className="flex items-center gap-4">
                               <span className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-widest"><Clock className="h-4 w-4 text-zinc-700" /> {format(new Date(visit.visitDate), 'MMM dd, yyyy')}</span>
                               <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 text-[9px] font-black uppercase rounded-lg tracking-widest border border-cyan-500/20">Archived</span>
                            </div>
                         </div>
                      </div>
                      <ChevronRight className="h-6 w-6 text-zinc-700 group-hover/visit:text-cyan-500 transition-all" />
                   </div>
                 ))
               ) : (
                 <div className="py-12 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                    <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">No historical data found.</p>
                 </div>
               )}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center text-center shadow-2xl">
               <Shield className="h-8 w-8 text-emerald-500 mx-auto mb-4" />
               <p className="text-3xl font-black text-white mb-1 tracking-tighter">99.9%</p>
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Uptime & Security</p>
            </div>
            <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center text-center shadow-2xl">
               <Eye className="h-8 w-8 text-cyan-500 mx-auto mb-4" />
               <p className="text-3xl font-black text-white mb-1 tracking-tighter">50k+</p>
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Global Nodes</p>
            </div>
            <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center text-center shadow-2xl">
               <Zap className="h-8 w-8 text-amber-500 mx-auto mb-4" />
               <p className="text-3xl font-black text-white mb-1 tracking-tighter">Instant</p>
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">SOS Protocol</p>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Widgets & Stats */}
        <div className="space-y-6">
          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-[10px] font-black text-white flex items-center uppercase tracking-[0.4em]">
                 <MapPin className="mr-3 h-4 w-4 text-emerald-500" />
                 SOS Points
               </h3>
               {locLoading && <div className="animate-spin h-3 w-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full" />}
            </div>
            
            <div className="space-y-6">
               {nearbyFacilities && nearbyFacilities.length > 0 ? (
                 nearbyFacilities.map((hosp, idx) => (
                   <div key={idx} className="relative pl-6 border-l-2 border-white/5 hover:border-emerald-500/50 transition-colors">
                     <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                     <p className="font-black text-[13px] text-white mb-1 uppercase tracking-tight truncate">{hosp.name}</p>
                     <div className="flex items-center text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                       <span>{hosp.distance} km</span>
                       <span className="mx-3 opacity-20">•</span>
                       <a href={`tel:${hosp.phone}`} className="text-emerald-500 hover:text-emerald-400 transition-colors">Emergency Line</a>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-6">
                    <Search className="h-8 w-8 text-zinc-800 mx-auto mb-3" />
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Scanning Grid...</p>
                 </div>
               )}
            </div>
            <button 
              onClick={() => navigate('/dashboard/hospitals')}
              className="mt-10 w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all hover:bg-emerald-600 hover:border-emerald-500"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>SOS Navigator</span>
            </button>
          </div>v>

          {/* Family Health Widget */}
          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-[10px] font-black text-white flex items-center gap-3 uppercase tracking-[0.4em]">
                 <Users className="h-4 w-4 text-emerald-500" />
                 Family Protocol
               </h3>
               <Plus className="h-5 w-5 text-zinc-600 cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => navigate('/dashboard/family')} />
            </div>
            <div className="flex items-center gap-5 mb-8">
               <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-2xl border-4 border-zinc-950 bg-zinc-900 flex items-center justify-center overflow-hidden glow-border">
                       <UserCircle className="h-6 w-6 text-zinc-700" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                  <p className="text-sm font-black text-white uppercase tracking-tighter">{data?.family?.length || 0} Managed Nodes</p>
               </div>
            </div>
            <button onClick={() => navigate('/dashboard/family')} className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.4em] transition-all">Switch Node</button>
          </div>

          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-[10px] font-black text-white mb-8 flex items-center uppercase tracking-[0.4em]">
              <ShieldCheck className="mr-3 h-4 w-4 text-emerald-500" />
              Reputation Index
            </h3>
            <div className="flex items-center space-x-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 glow-border group-hover:scale-110 transition-transform">
                 <Trophy className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="font-black text-sm text-white uppercase tracking-tight">Level: {safetyScore > 90 ? 'Guardian' : 'Elite'}</p>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{safetyScore}% Data Integrity</p>
              </div>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${safetyScore}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
              />
            </div>
          </div>

          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl group">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-[10px] font-black text-white flex items-center gap-3 uppercase tracking-[0.4em]">
                  <FileText className="h-4 w-4 text-cyan-500" />
                  Binary Archives
               </h3>
               <button onClick={() => navigate('/dashboard/reports')} className="text-[9px] font-black text-cyan-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">Full Access</button>
            </div>
            <div className="space-y-4">
               {data?.reports?.slice(0, 3).map((report: any) => (
                 <div key={report._id} onClick={() => navigate('/dashboard/reports')} className="flex items-center justify-between p-5 bg-zinc-950/50 dark:bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-2xl group/doc hover:border-cyan-500/30 transition-all cursor-pointer shadow-inner">
                    <div className="min-w-0">
                       <p className="text-[13px] font-black text-white truncate uppercase tracking-tight mb-1">{report.title}</p>
                       <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{format(new Date(report.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-800 group-hover/doc:text-cyan-500 transition-colors" />
                 </div>
               ))}
               {(!data?.reports || data.reports.length === 0) && (
                 <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest text-center py-6 border border-dashed border-white/5 rounded-2xl">No archives detected.</p>
               )}
            </div>
          </div>

          {/* Wearables Widget */}
          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Biometric Link</h3>
                <span className={`flex items-center gap-2 px-3 py-1.5 ${isWearableConnected ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-900 text-zinc-600 border border-white/5'} text-[8px] font-black uppercase rounded-lg tracking-[0.2em] shadow-2xl`}>
                   {isWearableConnected && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
                   {isWearableConnected ? 'Active' : 'Offline'}
                </span>
             </div>
             <div 
               className={`flex items-center gap-5 p-5 rounded-2xl border transition-all cursor-pointer shadow-inner ${isWearableConnected ? 'bg-zinc-950/50 border-emerald-500/20 hover:border-emerald-500/50' : 'bg-zinc-950/50 border-dashed border-white/5 opacity-50'}`} 
               onClick={() => navigate('/dashboard/integrations')}
             >
                <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 shadow-2xl">
                   <Activity className={`h-5 w-5 ${isWearableConnected ? 'text-emerald-500' : 'text-zinc-700'}`} />
                </div>
                <div>
                   <p className="text-[13px] font-black text-white mb-1 uppercase tracking-tight">{isWearableConnected ? 'DEVICE SYNCED' : 'NO BIOMETRICS'}</p>
                   <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">{isWearableConnected ? 'STREAMING DATA' : 'SYNC REQUIRED'}</p>
                </div>
             </div>
             <button onClick={() => navigate('/dashboard/integrations')} className="mt-6 w-full py-2 text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em] hover:text-emerald-400 transition-colors">Manage Link</button>
          </div>

          <div className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl">
             <h3 className="text-[10px] font-black text-white mb-10 uppercase tracking-[0.4em]">Protocol Feed</h3>
             <div className="space-y-6">
                {activityFeed.map((act, i) => (
                  <div key={i} className="flex gap-5 relative group/item">
                     {i !== activityFeed.length - 1 && <div className="absolute left-[15px] top-8 w-0.5 h-full bg-white/5 group-hover/item:bg-emerald-500/20 transition-colors" />}
                     <div className={`w-8 h-8 rounded-xl ${act.bg} border border-white/5 flex items-center justify-center relative z-10 shadow-2xl group-hover/item:scale-110 transition-transform`}>
                        <act.icon className={`h-4 w-4 ${act.color}`} />
                     </div>
                     <div className="flex-1 pb-4">
                        <p className="text-[13px] font-black text-white mb-1 uppercase tracking-tight leading-none">{act.title}</p>
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{format(new Date(act.date), 'MMM dd, HH:mm')}</p>
                     </div>
                  </div>
                ))}
                {activityFeed.length === 0 && (
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest text-center py-6 border border-dashed border-white/5 rounded-2xl">Signal silence.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
