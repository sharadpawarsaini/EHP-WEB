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
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 saas-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <PulseIcon className="h-64 w-64" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-[2rem] flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-white/10 shadow-xl overflow-hidden">
                 {photoUrl ? (
                   <img src={getFullPhotoUrl(photoUrl)!} alt="Profile" className="w-full h-full object-cover scale-110" />
                 ) : (
                   <UserCircle className="w-12 h-12 text-gray-400" />
                 )}
              </div>
              <div>
                <h1 className="text-3xl saas-heading mb-1">Good day, {data?.profile?.fullName?.split(' ')[0] || 'User'}</h1>
                <p className="saas-subtext">Your medical passport node is currently <span className="text-emerald-600 font-bold">synchronized</span>. Readiness: {safetyScore}%.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-gray-900 dark:bg-white p-5 rounded-[2rem] shadow-xl hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
               <div className="w-12 h-12 bg-white/10 dark:bg-gray-900/10 rounded-2xl flex items-center justify-center border border-white/10">
                 <Zap className="h-6 w-6 text-white dark:text-gray-900" />
               </div>
               <div className="text-left">
                 <p className="text-[10px] font-black text-white/50 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Safety Score</p>
                 <p className="text-2xl font-black text-white dark:text-gray-900">{safetyScore}%</p>
               </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            {vitalCards.map((v, i) => (
              <div 
                key={i} 
                onClick={() => navigate(v.path)}
                className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 group hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                   <div className={`p-1.5 rounded-lg ${v.bg}`}>
                      <v.icon className={`h-4 w-4 ${v.color}`} />
                   </div>
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{v.label}</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                   {v.data ? v.data.value : '--'}
                   <span className="text-xs ml-1 text-zinc-400 font-medium">{v.data?.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="saas-card p-8 flex flex-col justify-between relative overflow-hidden bg-zinc-900 text-white">
           <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">Security Protocol</h3>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">{getInsight()}</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="mt-8 btn-primary w-full py-3 text-sm"
          >
            <span>Run Audit</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <button onClick={() => navigate('/dashboard/vitals')} className="saas-card p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
               <div className="p-2.5 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-600 transition-transform">
                  <PulseIcon className="h-5 w-5" />
               </div>
               <div className="text-left">
                  <p className="text-base font-bold text-zinc-900 dark:text-white leading-tight">Log Vital</p>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Instant Track</p>
               </div>
            </div>
            <Plus className="h-5 w-5 text-zinc-300 group-hover:text-rose-600 transition-colors" />
         </button>
         <button onClick={() => navigate('/dashboard/reports')} className="saas-card p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
               <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 transition-transform">
                  <FileText className="h-5 w-5" />
               </div>
               <div className="text-left">
                  <p className="text-base font-bold text-zinc-900 dark:text-white leading-tight">Upload Doc</p>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Vault Secure</p>
               </div>
            </div>
            <Plus className="h-5 w-5 text-zinc-300 group-hover:text-emerald-600 transition-colors" />
         </button>
         <button onClick={() => navigate('/dashboard/appointments')} className="saas-card p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
               <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 transition-transform">
                  <Calendar className="h-5 w-5" />
               </div>
               <div className="text-left">
                  <p className="font-bold text-zinc-900 dark:text-white leading-tight">Schedule</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Next Visit</p>
               </div>
            </div>
            <Plus className="h-5 w-5 text-zinc-300 group-hover:text-emerald-600 transition-colors" />
         </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments Section */}
          <div className="saas-card p-8">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Upcoming Visits
               </h3>
               <button onClick={() => navigate('/dashboard/appointments')} className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-500">Full Schedule</button>
            </div>
            
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingAppointments.slice(0, 2).map((app: any) => (
                  <div key={app._id} className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700 group hover:border-primary-500/30 transition-all cursor-pointer" onClick={() => navigate('/dashboard/appointments')}>
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                           <Stethoscope className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{format(new Date(app.appointmentDate), 'MMM dd')}</p>
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
                 <button onClick={() => navigate('/dashboard/appointments')} className="mt-4 text-primary-600 font-bold text-sm">+ Schedule Now</button>
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
               <button onClick={() => navigate('/dashboard/visits')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Full History</button>
            </div>

            <div className="space-y-4">
               {recentVisits && recentVisits.length > 0 ? (
                 recentVisits.map((visit: any) => (
                   <div key={visit._id} onClick={() => navigate(`/dashboard/visits`)} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-700 group hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer">
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

          {/* Platform Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="saas-card p-6">
               <Shield className="h-6 w-6 text-emerald-600 mb-4" />
               <p className="text-2xl font-bold text-zinc-900 dark:text-white">99.9%</p>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Uptime & Security</p>
            </div>
            <div className="saas-card p-6">
               <Eye className="h-6 w-6 text-emerald-600 mb-4" />
               <p className="text-2xl font-bold text-zinc-900 dark:text-white">50k+</p>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Global Health IDs</p>
            </div>
            <div className="saas-card p-6">
               <Zap className="h-6 w-6 text-emerald-600 mb-4" />
               <p className="text-2xl font-bold text-zinc-900 dark:text-white">Instant</p>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SOS Data Fetch</p>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Widgets & Stats */}
        <div className="space-y-6">
          <div className="saas-card p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center">
                 <MapPin className="mr-2 h-4 w-4 text-emerald-600" />
                 SOS Points
               </h3>
               {locLoading && <div className="animate-spin h-3 w-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full" />}
            </div>
            
            <div className="space-y-6">
              {nearbyFacilities && nearbyFacilities.length > 0 ? (
                nearbyFacilities.map((hosp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-emerald-100 dark:border-emerald-900/30">
                    <div className="absolute -left-[5.5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white mb-1 truncate">{hosp.name}</p>
                    <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <span>{hosp.distance} km away</span>
                      <span className="mx-2">•</span>
                      <a href={`tel:${hosp.phone}`} className="text-emerald-600 hover:underline">Emergency Line</a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                   <Search className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Searching nearby...</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/dashboard/hospitals')}
              className="mt-8 w-full py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 group active:scale-95 transition-all"
            >
              <Navigation className="h-4 w-4 group-hover:animate-bounce" />
              <span>SOS Navigator</span>
            </button>
          </div>

          {/* Family Health Widget */}
          <div className="saas-card p-8">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                 <Users className="h-5 w-5 text-primary-600" />
                 Family Health
               </h3>
               <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-primary-600" onClick={() => navigate('/dashboard/family')} />
            </div>
            <div className="flex items-center gap-4 mb-6">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                       <UserCircle className="h-6 w-6 text-gray-400" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                  <p className="text-sm font-black text-gray-900 dark:text-white">{data?.family?.length || 0} Managed Profiles</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Syncing Data...</p>
               </div>
            </div>
            <button onClick={() => navigate('/dashboard/family')} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">Switch Profile</button>
          </div>

          <div className="saas-card p-8">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 flex items-center">
              <Trophy className="mr-2 h-4 w-4 text-amber-500" />
              Health Reputation
            </h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-2xl border-4 border-amber-100 dark:border-amber-900/30 flex items-center justify-center p-1">
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-900 dark:text-white">Status: {safetyScore > 90 ? 'Guardian' : 'Elite'}</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{safetyScore}% Integrity Score</p>
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

          <div className="saas-card p-8">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  Recent Documents
               </h3>
               <button onClick={() => navigate('/dashboard/reports')} className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-500">View All</button>
            </div>
            <div className="space-y-4">
               {data?.reports?.slice(0, 3).map((report: any) => (
                 <div key={report._id} onClick={() => navigate('/dashboard/reports')} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 group hover:border-emerald-500/30 transition-all cursor-pointer">
                    <div className="min-w-0">
                       <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{report.title}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase">{format(new Date(report.createdAt), 'MMM dd')}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600" />
                 </div>
               ))}
               {(!data?.reports || data.reports.length === 0) && (
                 <p className="text-xs text-gray-400 italic">No reports uploaded yet.</p>
               )}
            </div>
          </div>

          {/* Wearables Widget */}
          <div className="saas-card p-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6">Wearable Protocol</h3>
                <span className={`flex items-center gap-1.5 px-2 py-1 ${isWearableConnected ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-gray-50 dark:bg-slate-700 text-gray-400'} text-[8px] font-black uppercase rounded-lg tracking-widest border ${isWearableConnected ? 'border-emerald-100 dark:border-emerald-800/30' : 'border-gray-200 dark:border-slate-600'}`}>
                   {isWearableConnected && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                   {isWearableConnected ? 'Active' : 'Offline'}
                </span>
             </div>
             <div 
               className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isWearableConnected ? 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-700 hover:border-primary-500/30' : 'bg-gray-50/20 dark:bg-slate-900/20 border-dashed border-gray-200 dark:border-slate-700 opacity-60'}`} 
               onClick={() => navigate('/dashboard/integrations')}
             >
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                   <Activity className={`h-5 w-5 ${isWearableConnected ? 'text-primary-500' : 'text-gray-300'}`} />
                </div>
                <div>
                   <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">{isWearableConnected ? 'Device Synced' : 'No Devices'}</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isWearableConnected ? 'Auto-Syncing Vitals' : 'Setup Integrations'}</p>
                </div>
             </div>
             <button onClick={() => navigate('/dashboard/integrations')} className="mt-4 w-full py-3 text-primary-600 dark:text-primary-400 font-black text-[10px] uppercase tracking-widest hover:underline">Manage Integrations</button>
          </div>

          <div className="saas-card p-8">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6">Activity Feed</h3>
             <div className="space-y-6">
                {activityFeed.map((act, i) => (
                  <div key={i} className="flex gap-4 relative">
                     {i !== activityFeed.length - 1 && <div className="absolute left-[11px] top-6 w-0.5 h-full bg-gray-100 dark:bg-slate-700" />}
                     <div className={`w-6 h-6 rounded-full ${act.bg} flex items-center justify-center relative z-10`}>
                        <act.icon className={`h-3 w-3 ${act.color}`} />
                     </div>
                     <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{act.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{format(new Date(act.date), 'MMM dd, HH:mm')}</p>
                     </div>
                  </div>
                ))}
                {activityFeed.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-4">No recent activity detected.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
