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
        <div className="lg:col-span-2 health-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-primary-600">
             <PulseIcon className="h-64 w-64" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
                 {photoUrl ? (
                   <img src={getFullPhotoUrl(photoUrl)!} alt="Profile" className="w-full h-full object-cover scale-110" />
                 ) : (
                   <UserCircle className="w-12 h-12 text-zinc-400" />
                 )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Good day, {data?.profile?.fullName?.split(' ')[0] || 'User'}</h1>
                <p className="text-sm text-zinc-500 font-medium">Your health passport is <span className="text-primary-600 font-semibold">up to date</span>. Profile readiness: {safetyScore}%.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl shadow-sm border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
               <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                 <ShieldCheck className="h-6 w-6 text-primary-600" />
               </div>
               <div className="text-left pr-2">
                 <p className="text-xs font-semibold text-primary-600/80 uppercase tracking-wider mb-0.5">Safety Score</p>
                 <p className="text-2xl font-extrabold text-primary-700 dark:text-primary-400 leading-none">{safetyScore}%</p>
               </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            {vitalCards.map((v, i) => (
              <div 
                key={i} 
                onClick={() => navigate(v.path)}
                className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:border-primary-200 dark:hover:border-primary-800 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                   <div className={`p-2 rounded-lg ${v.bg}`}>
                      <v.icon className={`h-4 w-4 ${v.color}`} />
                   </div>
                </div>
                <p className="text-xs font-semibold text-zinc-500 mb-1">{v.label}</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white flex items-baseline gap-1">
                   {v.data ? v.data.value : '--'}
                   <span className="text-xs text-zinc-400 font-medium">{v.data?.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="health-card p-8 flex flex-col justify-between relative overflow-hidden bg-zinc-900 dark:bg-zinc-900 text-white border-0 shadow-lg">
           <div className="absolute inset-0 bg-primary-900/20 mix-blend-overlay"></div>
           <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Security Protocol</h3>
            <p className="text-zinc-300 text-sm font-medium leading-relaxed">{getInsight()}</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="mt-8 w-full py-3 bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 relative z-10 shadow-sm"
          >
            <span>Run Audit</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <button onClick={() => navigate('/dashboard/vitals')} className="health-card p-6 flex items-center justify-between group cursor-pointer hover:border-primary-200 dark:hover:border-primary-800 transition-all">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-600">
                  <PulseIcon className="h-5 w-5" />
               </div>
               <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">Log Vital</p>
                  <p className="text-xs text-zinc-500 font-medium">Record new reading</p>
               </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-rose-600 transition-colors" />
         </button>
         <button onClick={() => navigate('/dashboard/reports')} className="health-card p-6 flex items-center justify-between group cursor-pointer hover:border-primary-200 dark:hover:border-primary-800 transition-all">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
                  <FileText className="h-5 w-5" />
               </div>
               <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">Upload Report</p>
                  <p className="text-xs text-zinc-500 font-medium">Add medical record</p>
               </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-primary-600 transition-colors" />
         </button>
         <button onClick={() => navigate('/dashboard/appointments')} className="health-card p-6 flex items-center justify-between group cursor-pointer hover:border-primary-200 dark:hover:border-primary-800 transition-all">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600">
                  <Calendar className="h-5 w-5" />
               </div>
               <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">Schedule</p>
                  <p className="text-xs text-zinc-500 font-medium">Book appointment</p>
               </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-amber-600 transition-colors" />
         </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments Section */}
          <div className="health-card p-8">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                  Upcoming Visits
               </h3>
               <button onClick={() => navigate('/dashboard/appointments')} className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">View All</button>
            </div>
            
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingAppointments.slice(0, 2).map((app: any) => (
                  <div key={app._id} className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 group hover:border-primary-200 dark:hover:border-primary-800 transition-all cursor-pointer shadow-sm" onClick={() => navigate('/dashboard/appointments')}>
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
                           <Stethoscope className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-0.5">{format(new Date(app.appointmentDate), 'MMM dd')}</p>
                           <p className="text-lg font-bold text-zinc-900 dark:text-white leading-none">{format(new Date(app.appointmentDate), 'HH:mm')}</p>
                        </div>
                     </div>
                     <h4 className="font-bold text-zinc-900 dark:text-white mb-1 truncate">{app.doctorName}</h4>
                     <p className="text-xs text-zinc-500 font-medium mb-3">{app.specialty}</p>
                     <div className="flex items-center text-xs text-zinc-500 gap-1.5 bg-white dark:bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800 w-fit">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="truncate">{app.hospitalName}</span>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                 <p className="text-zinc-500 font-medium">No upcoming appointments scheduled.</p>
                 <button onClick={() => navigate('/dashboard/appointments')} className="mt-3 text-primary-600 font-semibold text-sm">+ Schedule Now</button>
              </div>
            )}
          </div>

          {/* Recent Hospital Visits Section */}
          <div className="health-card p-8">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                     <Hospital className="h-5 w-5 text-emerald-600" />
                  </div>
                  Recent Hospital Visits
               </h3>
               <button onClick={() => navigate('/dashboard/visits')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View History</button>
            </div>

            <div className="space-y-3">
               {recentVisits && recentVisits.length > 0 ? (
                 recentVisits.map((visit: any) => (
                   <div key={visit._id} onClick={() => navigate(`/dashboard/visits`)} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 group hover:bg-white dark:hover:bg-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Hospital className="h-5 w-5 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                         </div>
                         <div>
                            <p className="text-base font-bold text-zinc-900 dark:text-white mb-0.5">{visit.hospitalName}</p>
                            <div className="flex items-center gap-3">
                               <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium"><Clock className="h-3.5 w-3.5 text-zinc-400" /> {format(new Date(visit.visitDate), 'MMM dd, yyyy')}</span>
                               <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase rounded tracking-wider">Completed</span>
                            </div>
                         </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-emerald-600 transition-colors" />
                   </div>
                 ))
               ) : (
                 <div className="py-8 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                    <p className="text-zinc-500 font-medium">No hospital visits recorded yet.</p>
                 </div>
               )}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="health-card p-6 flex flex-col justify-center text-center">
               <Shield className="h-6 w-6 text-primary-600 mx-auto mb-3" />
               <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">99.9%</p>
               <p className="text-xs font-semibold text-zinc-500">Uptime & Security</p>
            </div>
            <div className="health-card p-6 flex flex-col justify-center text-center">
               <Eye className="h-6 w-6 text-primary-600 mx-auto mb-3" />
               <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">50k+</p>
               <p className="text-xs font-semibold text-zinc-500">Global Health IDs</p>
            </div>
            <div className="health-card p-6 flex flex-col justify-center text-center">
               <Zap className="h-6 w-6 text-primary-600 mx-auto mb-3" />
               <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">Instant</p>
               <p className="text-xs font-semibold text-zinc-500">SOS Data Fetch</p>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Widgets & Stats */}
        <div className="space-y-6">
          <div className="health-card p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center">
                 <MapPin className="mr-2 h-4 w-4 text-primary-600" />
                 SOS Points
               </h3>
               {locLoading && <div className="animate-spin h-3 w-3 border-2 border-primary-500/30 border-t-primary-500 rounded-full" />}
            </div>
            
            <div className="space-y-5">
              {nearbyFacilities && nearbyFacilities.length > 0 ? (
                nearbyFacilities.map((hosp, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-primary-100 dark:border-primary-900/30">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary-500"></div>
                    <p className="font-semibold text-sm text-zinc-900 dark:text-white mb-0.5 truncate">{hosp.name}</p>
                    <div className="flex items-center text-xs font-medium text-zinc-500">
                      <span>{hosp.distance} km away</span>
                      <span className="mx-2">•</span>
                      <a href={`tel:${hosp.phone}`} className="text-primary-600 hover:text-primary-700">Emergency Line</a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                   <Search className="h-6 w-6 text-zinc-300 mx-auto mb-2" />
                   <p className="text-xs text-zinc-500 font-medium">Searching nearby...</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/dashboard/hospitals')}
              className="mt-6 w-full py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:bg-primary-100 dark:hover:bg-primary-900/40"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>SOS Navigator</span>
            </button>
          </div>

          {/* Family Health Widget */}
          <div className="health-card p-6">
             <div className="flex justify-between items-center mb-5">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                 <Users className="h-4 w-4 text-primary-600" />
                 Family Health
               </h3>
               <Plus className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-primary-600" onClick={() => navigate('/dashboard/family')} />
            </div>
            <div className="flex items-center gap-4 mb-5">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                       <UserCircle className="h-5 w-5 text-zinc-400" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{data?.family?.length || 0} Managed Profiles</p>
               </div>
            </div>
            <button onClick={() => navigate('/dashboard/family')} className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-semibold text-xs transition-colors">Switch Profile</button>
          </div>

          <div className="health-card p-6">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5 flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
              Health Reputation
            </h3>
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                 <Trophy className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-900 dark:text-white">Status: {safetyScore > 90 ? 'Guardian' : 'Elite'}</p>
                <p className="text-xs text-zinc-500 font-medium">{safetyScore}% Integrity Score</p>
              </div>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${safetyScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-emerald-500 rounded-full" 
              />
            </div>
          </div>

          <div className="health-card p-6">
            <div className="flex justify-between items-center mb-5">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary-600" />
                  Recent Documents
               </h3>
               <button onClick={() => navigate('/dashboard/reports')} className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">View All</button>
            </div>
            <div className="space-y-3">
               {data?.reports?.slice(0, 3).map((report: any) => (
                 <div key={report._id} onClick={() => navigate('/dashboard/reports')} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 group hover:border-primary-200 dark:hover:border-primary-800 transition-all cursor-pointer">
                    <div className="min-w-0">
                       <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{report.title}</p>
                       <p className="text-xs text-zinc-500 font-medium">{format(new Date(report.createdAt), 'MMM dd')}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-primary-600" />
                 </div>
               ))}
               {(!data?.reports || data.reports.length === 0) && (
                 <p className="text-sm text-zinc-500 text-center py-4">No reports uploaded yet.</p>
               )}
            </div>
          </div>

          {/* Wearables Widget */}
          <div className="health-card p-6">
             <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Wearables</h3>
                <span className={`flex items-center gap-1.5 px-2 py-1 ${isWearableConnected ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'} text-[10px] font-semibold uppercase rounded-md tracking-widest`}>
                   {isWearableConnected && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />}
                   {isWearableConnected ? 'Active' : 'Offline'}
                </span>
             </div>
             <div 
               className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isWearableConnected ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-primary-300' : 'bg-zinc-50/50 dark:bg-zinc-900/50 border-dashed border-zinc-200 dark:border-zinc-800 opacity-70'}`} 
               onClick={() => navigate('/dashboard/integrations')}
             >
                <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                   <Activity className={`h-4 w-4 ${isWearableConnected ? 'text-primary-600' : 'text-zinc-400'}`} />
                </div>
                <div>
                   <p className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">{isWearableConnected ? 'Device Synced' : 'No Devices'}</p>
                   <p className="text-xs font-medium text-zinc-500">{isWearableConnected ? 'Auto-Syncing Vitals' : 'Setup Integrations'}</p>
                </div>
             </div>
             <button onClick={() => navigate('/dashboard/integrations')} className="mt-4 w-full py-2 text-primary-600 font-semibold text-xs hover:text-primary-700 transition-colors">Manage Integrations</button>
          </div>

          <div className="health-card p-6">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5">Activity Feed</h3>
             <div className="space-y-5">
                {activityFeed.map((act, i) => (
                  <div key={i} className="flex gap-4 relative">
                     {i !== activityFeed.length - 1 && <div className="absolute left-[13px] top-7 w-0.5 h-full bg-zinc-100 dark:bg-zinc-800" />}
                     <div className={`w-7 h-7 rounded-full ${act.bg} flex items-center justify-center relative z-10`}>
                        <act.icon className={`h-3.5 w-3.5 ${act.color}`} />
                     </div>
                     <div className="flex-1 pb-1">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-0.5">{act.title}</p>
                        <p className="text-xs text-zinc-500">{format(new Date(act.date), 'MMM dd, HH:mm')}</p>
                     </div>
                  </div>
                ))}
                {activityFeed.length === 0 && (
                  <p className="text-sm text-zinc-500 text-center py-4">No recent activity detected.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
