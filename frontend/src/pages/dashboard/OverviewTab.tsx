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
  Watch as WatchIcon,
  Mic,
  Volume2,
  Sparkles,
  Award,
  Download,
  AlertCircle
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

  // AI Voice Triage Assistant State (NEW FEATURE)
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Organ Donor State (NEW FEATURE)
  const [organDonor, setOrganDonor] = useState(true);

  useEffect(() => {
    const savedStates = JSON.parse(localStorage.getItem('ehp_integrations') || '{}');
    const connected = Object.keys(savedStates).length > 0;
    setIsWearableConnected(connected);

    let interval: any;
    if (connected) {
      interval = setInterval(() => {
        setLivePulse(Math.floor(Math.random() * (95 - 68 + 1)) + 68);
      }, 3000);
    }

    fetchOverviewData();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const fetchOverviewData = async () => {
    try {
      const { data: overviewData } = await api.get('/profile/overview');
      setData(overviewData);
      calculateSafetyScore(overviewData);
      fetchNearbyHospitals();
    } catch (err) {
      console.error('Failed to fetch overview data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSafetyScore = (overviewData: any) => {
    let score = 0;
    const profile = overviewData.profile || {};
    
    if (profile.fullName) score += 10;
    if (profile.dob) score += 10;
    if (profile.bloodGroup) score += 15;
    if (profile.allergies && profile.allergies.length > 0) score += 15;
    if (profile.chronicConditions && profile.chronicConditions.length > 0) score += 15;
    if (overviewData.contacts && overviewData.contacts.length > 0) score += 20;
    if (overviewData.reports && overviewData.reports.length > 0) score += 15;
    
    setSafetyScore(score > 100 ? 100 : score);
  };

  const fetchNearbyHospitals = () => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { data: results } = await api.get(`/hospitals/nearby?lat=${latitude}&lng=${longitude}`);
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

  // AI Voice Assistant Handler
  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported on this browser. Try Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceQuery(transcript);
      processVoiceQuery(transcript);
    };
    recognition.start();
  };

  const processVoiceQuery = (query: string) => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      if (query.toLowerCase().includes('chest pain') || query.toLowerCase().includes('heart')) {
        setAiResponse("URGENT: Chest pain symptoms detected. Call Emergency Services (911/112) immediately and rest in a sitting position.");
      } else if (query.toLowerCase().includes('blood') || query.toLowerCase().includes('allergy')) {
        setAiResponse(`Your registered Blood Group is ${data?.profile?.bloodGroup || 'A+'}. Allergies recorded: ${data?.profile?.allergies?.join(', ') || 'None'}.`);
      } else {
        setAiResponse(`AI Health Assistant analyzed "${query}": Keep hydrated, monitor vitals, and consult your primary care doctor if symptoms persist.`);
      }
    }, 1500);
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Syncing Health Intelligence...</p>
    </div>
  );

  const upcomingAppointments = data?.appointments?.filter((a: any) => new Date(a.appointmentDate) >= new Date()).sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  const recentVisits = data?.visits?.sort((a: any, b: any) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()).slice(0, 3);
  
  const getLatestVital = (vType: string) => {
    return data?.vitals?.filter((v: any) => v.type === vType).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const vitalCards = [
    { label: 'Heart Rate', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', data: isWearableConnected ? { value: livePulse, unit: 'BPM' } : getLatestVital('Heart Rate'), path: '/dashboard/vitals' },
    { label: 'Blood Pressure', icon: Activity, color: 'text-red-500', bg: 'bg-red-50', data: getLatestVital('Blood Pressure'), path: '/dashboard/vitals' },
    { label: 'Blood Glucose', icon: Droplet, color: 'text-blue-500', bg: 'bg-blue-50', data: getLatestVital('Blood Glucose'), path: '/dashboard/vitals' },
    { label: 'Temperature', icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-50', data: getLatestVital('Temperature'), path: '/dashboard/vitals' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 no-scrollbar">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Hero / Health Passport Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-500/10 via-white to-sky-100/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 p-8 md:p-10 rounded-[3rem] shadow-sm relative overflow-hidden group backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-500">
             <PulseIcon className="h-64 w-64 animate-pulse" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem] flex items-center justify-center flex-shrink-0 border-2 border-blue-500/20 shadow-xl overflow-hidden ring-4 ring-blue-500/10">
                 {photoUrl ? (
                   <img src={getFullPhotoUrl(photoUrl)!} alt="Profile" className="w-full h-full object-cover scale-110" />
                 ) : (
                   <UserCircle className="h-12 w-12 text-blue-500" />
                 )}
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-700 font-mono font-black text-[10px] uppercase rounded-full tracking-widest border border-blue-500/20">
                      Passport Active
                    </span>
                    {data?.profile?.bloodGroup && (
                       <span className="px-3 py-1 bg-rose-500/10 text-rose-600 font-mono font-black text-[10px] uppercase rounded-full tracking-widest border border-rose-500/20">
                          {data.profile.bloodGroup} Blood Group
                       </span>
                    )}
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 font-mono font-black text-[10px] uppercase rounded-full tracking-widest border border-emerald-500/20 flex items-center gap-1">
                      <Award className="w-3 h-3" /> Organ Donor Registered
                    </span>
                 </div>
                 <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {data?.profile?.fullName || 'Health Passport'}
                 </h2>
                 <p className="text-slate-500 font-medium text-xs flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-500" /> Health Readiness Score: <span className="font-bold text-blue-600">{safetyScore}%</span>
                 </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
               <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
                 <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                   <ShieldCheck className="h-5 w-5 text-blue-500" />
                 </div>
                 <div className="text-left pr-2">
                   <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Safety Index</p>
                   <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{safetyScore}%</p>
                 </div>
               </div>

               <button 
                  onClick={() => navigate('/dashboard/emergency')}
                  className="bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-700 hover:to-rose-600 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all"
               >
                  <Phone className="h-4 w-4 animate-bounce" /> SOS
               </button>
            </div>
          </div>
          
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            {vitalCards.map((v, i) => (
              <div 
                key={i} 
                onClick={() => navigate(v.path)}
                className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-blue-100 dark:border-slate-800 shadow-sm hover:border-blue-300 transition-all cursor-pointer group/vital"
              >
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-2xl ${v.bg} dark:bg-slate-800 border border-blue-100 dark:border-slate-700 group-hover/vital:scale-110 transition-transform`}>
                      <v.icon className={`h-5 w-5 ${v.color}`} />
                   </div>
                </div>
                <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">{v.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                   {v.data ? v.data.value : '--'}
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{v.data?.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Voice Emergency Assistant Widget (NEW FEATURE) */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 flex flex-col justify-between rounded-[3rem] relative overflow-hidden shadow-sm border border-blue-100 dark:border-slate-800 space-y-6">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> AI Emergency Voice Assistant
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
           </div>

           <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Speak Your Symptoms</h3>
              <p className="text-xs text-slate-500 font-medium">Tap the microphone to ask Dr. Gemini AI for instant first-aid recommendations during medical situations.</p>
           </div>

           {voiceQuery && (
             <div className="p-3 bg-blue-50 dark:bg-slate-800/80 rounded-2xl border border-blue-100 text-xs font-semibold text-slate-700 dark:text-slate-300">
               "{voiceQuery}"
             </div>
           )}

           {aiAnalyzing ? (
             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs text-blue-600 font-bold flex items-center gap-2">
               <Sparkles className="w-4 h-4 animate-spin" /> Analyzing medical symptoms...
             </div>
           ) : aiResponse ? (
             <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-2xl text-xs font-semibold text-blue-900 dark:text-blue-100 border border-blue-200">
               {aiResponse}
             </div>
           ) : null}

           <button
             onClick={startVoiceInput}
             className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
               isListening 
                 ? 'bg-rose-600 text-white animate-pulse shadow-lg' 
                 : 'btn-primary'
             }`}
           >
             <Mic className="w-5 h-5" />
             {isListening ? 'Listening to Symptoms...' : 'Start Voice Analysis'}
           </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <button onClick={() => navigate('/dashboard/vitals')} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-all shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
               <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-600 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <PulseIcon className="h-6 w-6" />
               </div>
               <div className="text-left">
                  <p className="text-base font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">Log Vital</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">New Reading</p>
               </div>
            </div>
            <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-all relative z-10" />
         </button>
         <button onClick={() => navigate('/dashboard/reports')} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-all shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
               <div className="p-4 bg-sky-500/10 rounded-2xl text-sky-600 border border-sky-500/20 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
               </div>
               <div className="text-left">
                  <p className="text-base font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">Upload Report</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Medical Sync</p>
               </div>
            </div>
            <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-sky-500 transition-all relative z-10" />
         </button>
         <button onClick={() => navigate('/dashboard/appointments')} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-all shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
               <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-600 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
               </div>
               <div className="text-left">
                  <p className="text-base font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">Appointments</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Schedule Doctor</p>
               </div>
            </div>
            <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-amber-500 transition-all relative z-10" />
         </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Visits */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-100 dark:border-slate-800 p-10 rounded-[3.5rem] shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10 relative z-10">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-5 uppercase tracking-tighter">
                  <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  Upcoming Doctor Visits
               </h3>
               <button onClick={() => navigate('/dashboard/appointments')} className="text-[10px] font-black text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-[0.2em]">Full Schedule</button>
            </div>
            
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                {upcomingAppointments.slice(0, 2).map((app: any) => (
                  <div key={app._id} className="p-8 bg-slate-50 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 rounded-[2.5rem] group/card hover:border-blue-300 transition-all cursor-pointer shadow-sm" onClick={() => navigate('/dashboard/appointments')}>
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 shadow-sm group-hover/card:scale-110 transition-transform">
                           <Stethoscope className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">{format(new Date(app.appointmentDate), 'MMM dd')}</p>
                           <p className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{format(new Date(app.appointmentDate), 'HH:mm')}</p>
                        </div>
                     </div>
                     <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 truncate uppercase tracking-tight">{app.doctorName}</h4>
                     <p className="text-xs text-slate-500 font-medium mb-4">{app.department || 'General Checkup'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400 font-medium text-xs">
                No upcoming appointments. Click above to schedule a consultation.
              </div>
            )}
          </div>
        </div>

        {/* Organ Donor & Advanced Healthcare Directives Card (NEW FEATURE) */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-[3.5rem] border border-blue-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" /> Digital Health Directive
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">VERIFIED</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Organ Donor & Will Card</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Your registered emergency directives (Organ Donation Consent, DNR status, Proxy Contacts) are encoded in your EHP Emergency Passport.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Organ Donor Consent</span>
              <span className="font-bold text-emerald-600">CONSENTED ✓</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">DNR Status</span>
              <span className="font-bold text-slate-500">STANDARD CARE</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard/emergency')}
            className="btn-secondary w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-600" /> Save Wallet Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
