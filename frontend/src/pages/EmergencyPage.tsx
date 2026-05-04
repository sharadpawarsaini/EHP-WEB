import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { 
  Activity, 
  ShieldAlert, 
  HeartPulse, 
  UserCircle, 
  Phone, 
  Lock, 
  ChevronRight, 
  FileText, 
  Download, 
  Clock, 
  WifiOff, 
  Pill, 
  Syringe, 
  Calendar, 
  History as HistoryIcon, 
  Stethoscope,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  X,
  Droplets,
  Zap,
  Info,
  Mic,
  Volume2,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { format, differenceInYears } from 'date-fns';

const EmergencyPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [doctorAuthLoading, setDoctorAuthLoading] = useState(false);
  const [doctorAuthError, setDoctorAuthError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [fullData, setFullData] = useState<any>(null);

  // AI Assistant State
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await api.get(`/emergency/public/${slug}`);
        setData(response.data);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setData(err.response.data);
        } else {
          setError('Emergency profile not found or unavailable.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [slug]);

  useEffect(() => {
    let timer: any;
    if (fullData && timeLeft === null) {
      setTimeLeft(300); // 5 minutes
    }
    
    if (timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setFullData(null);
      setTimeLeft(null);
      setAccessCode('');
      alert('Medical history session expired for security.');
    }

    return () => clearInterval(timer);
  }, [fullData, timeLeft]);

  const handleDoctorAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorAuthLoading(true);
    setDoctorAuthError('');
    try {
      const response = await api.post(`/emergency/public/${slug}/access`, {
        accessCode
      });
      setFullData(response.data);
      setTimeLeft(300); // Initialize timer
      setShowDoctorModal(false);
    } catch (err) {
      setDoctorAuthError('Invalid Access Code. Please try again.');
    } finally {
      setDoctorAuthLoading(false);
    }
  };

  // AI Assistant Logic
  const handleAISpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendToAI(transcript);
    };

    recognition.start();
  };

  const sendToAI = async (message: string) => {
    setAiLoading(true);
    setAiResponse('');
    try {
      const response = await api.post(`/ai/guide/${slug}`, {
        message,
        history: chatHistory
      });
      
      const newResponse = response.data.text;
      setAiResponse(newResponse);
      setChatHistory([...chatHistory, 
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: newResponse }] }
      ]);
      handleAISpeech(newResponse);
    } catch (err) {
      setAiResponse("I'm sorry, I'm having trouble connecting. Please follow standard emergency protocols.");
    } finally {
      setAiLoading(false);
    }
  };



  const handleWhatsAppSOS = (phone: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
          const text = encodeURIComponent(`🚨 EMERGENCY ALERT: I am with ${profile.fullName || 'someone'} who needs immediate medical assistance. \n\nPlease help! \n\nMy location: ${loc}`);
          window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`, '_blank');
        },
        () => {
          const text = encodeURIComponent(`🚨 EMERGENCY ALERT: I am with ${profile.fullName || 'someone'} who needs immediate medical assistance. \n\nPlease help!`);
          window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`, '_blank');
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white space-y-6">
        <div className="w-16 h-16 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Decrypting Life-Link...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 backdrop-blur-2xl p-10 rounded-[3rem] text-center max-w-md w-full border border-gray-100 dark:border-white/10 shadow-2xl">
          <ShieldAlert className="h-20 w-20 text-rose-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Identity Ghosted</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (data.isLocked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 backdrop-blur-2xl p-12 rounded-[3rem] text-center max-w-md w-full border border-gray-100 dark:border-white/10 shadow-2xl">
          <div className="w-24 h-24 bg-rose-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-500/30">
            <Lock className="h-10 w-10 text-rose-500" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">{t('profile_locked')}</h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            {t('locked_msg')}
          </p>
        </motion.div>
      </div>
    );
  }

  const profile = data.profile || {};
  const displayData = fullData || data;
  const isFullAccess = !!fullData;

  const calculateAge = (dob: any) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    return differenceInYears(new Date(), birthDate);
  };

  const age = calculateAge(profile.dob);

  const safeFormat = (date: any, formatStr: string) => {
    try {
      if (!date) return 'N/A';
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'N/A';
      return format(d, formatStr);
    } catch (e) {
      return 'N/A';
    }
  };

  const getFullPhotoUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const base = api.defaults.baseURL?.replace('/api', '') || '';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 font-sans pb-24 selection:bg-primary-500/30">
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500 text-white py-3 px-4 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <WifiOff className="h-4 w-4" /> Offline Cache Active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Header */}
      <header className={`sticky top-0 z-[100] backdrop-blur-2xl border-b transition-all duration-500 ${isFullAccess ? 'bg-primary-600/90 border-primary-500/20' : 'bg-rose-600/90 border-rose-500/20'}`}>
        <div className="max-w-4xl mx-auto px-6 h-20 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-xl">
                <Activity className="h-6 w-6" />
             </div>
             <div>
                <span className="text-lg font-black tracking-tighter block leading-none">EHP</span>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Life-Link Protocol</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {isFullAccess && timeLeft !== null && (
               <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${timeLeft <= 60 ? 'bg-rose-500/20 border-rose-500/50 text-rose-100 animate-pulse' : 'bg-white/20 border-white/20 text-white'}`}>
                 <Clock className="h-4 w-4" />
                 <span>Expires: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
               </div>
             )}
             <div className="flex bg-white/10 p-1 rounded-xl border border-white/20">
               <button onClick={() => i18n.changeLanguage('en')} className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${i18n.language.startsWith('en') ? 'bg-white text-gray-900 shadow-xl' : 'text-white hover:bg-white/10'}`}>EN</button>
               <button onClick={() => i18n.changeLanguage('hi')} className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${i18n.language === 'hi' ? 'bg-white text-gray-900 shadow-xl' : 'text-white hover:bg-white/10'}`}>हिं</button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
        
        {/* Profile Card */}
        <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white dark:border-white/10 overflow-hidden relative group">
          <div className={`absolute top-0 left-0 w-full h-3 transition-all duration-500 ${isFullAccess ? 'bg-primary-600' : 'bg-rose-600'}`}></div>
          <div className="p-10 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-10 text-center md:text-left relative z-10">
            <div className="relative">
               <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
               <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-[2.5rem] flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-white/10 shadow-2xl overflow-hidden relative">
                 {profile.photoUrl ? (
                   <img src={getFullPhotoUrl(profile.photoUrl)!} alt="Profile" className="w-full h-full object-cover scale-110" />
                 ) : (
                   <UserCircle className="w-20 h-20 text-gray-300" />
                 )}
               </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">{profile.fullName || 'Unknown Patient'}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <span className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400">
                      {age !== null && !isNaN(age) ? `${age} Years Old` : 'Age Unknown'}
                   </span>
                   <span className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400">
                      {profile.gender || 'Unknown Gender'}
                   </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className={`px-6 py-4 rounded-2xl border flex items-center gap-4 shadow-xl ${isFullAccess ? 'bg-primary-50 border-primary-100 dark:bg-primary-900/20 dark:border-primary-800/30' : 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30'}`}>
                  <HeartPulse className={`h-8 w-8 ${isFullAccess ? 'text-primary-600' : 'text-rose-600'}`} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('blood_group')}</p>
                    <p className={`text-3xl font-black ${isFullAccess ? 'text-primary-700 dark:text-primary-400' : 'text-rose-700 dark:text-rose-400'}`}>{profile.bloodGroup || 'UNK'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Unlock Section */}
        {!isFullAccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gradient-to-br from-primary-900 to-slate-900 border border-primary-500/30 rounded-[3rem] p-10 backdrop-blur-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-3xl shadow-primary-900/30 relative overflow-hidden group"
          >
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700"></div>
            <div className="flex items-center gap-6 text-white relative z-10">
              <div className="p-5 bg-white/10 rounded-[2rem] border border-white/10 shadow-inner">
                 <Lock className="h-10 w-10 text-primary-400" />
              </div>
              <div>
                <h3 className="font-black text-2xl text-white tracking-tight">{t('doctor_access')}</h3>
                <p className="text-primary-300 font-medium">Decrypt full clinical records using the Medical Key.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDoctorModal(true)} 
              className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary-600/40 transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10"
            >
              {t('unlock')} <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        <div className="grid gap-10">
          {/* Critical Indicators Grid */}
          <div className="grid md:grid-cols-2 gap-10">
             {/* Allergies */}
             <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-8 border border-white dark:border-white/10 shadow-xl group">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl group-hover:scale-110 transition-transform">
                      <ShieldAlert className="h-6 w-6 text-rose-600" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t('allergies')}</h3>
                </div>
                {displayData.medical?.allergies?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {displayData.medical.allergies.map((allergy: string, i: number) => (
                      <span key={i} className="bg-rose-50/50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-rose-100 dark:border-rose-800/30 shadow-sm">{allergy}</span>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-center">
                     <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">{t('no_allergies')}</p>
                  </div>
                )}
             </div>

             {/* Conditions */}
             <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-8 border border-white dark:border-white/10 shadow-xl group">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl group-hover:scale-110 transition-transform">
                      <Stethoscope className="h-6 w-6 text-primary-600" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{t('conditions')}</h3>
                </div>
                {displayData.medical?.conditions?.length > 0 ? (
                  <div className="space-y-4">
                    {displayData.medical.conditions.map((condition: string, i: number) => (
                      <div key={i} className="flex items-center gap-4 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        <span className="font-bold text-sm">{condition}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-center">
                     <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">{t('no_conditions')}</p>
                  </div>
                )}
             </div>
          </div>

          {/* Locked/Detailed Content */}
          <AnimatePresence mode="wait">
             {!isFullAccess ? (
               <motion.div 
                 key="locked"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="p-12 text-center bg-gray-100/50 dark:bg-white/5 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10"
               >
                  <Lock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                  <h4 className="text-xl font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Deep Clinical View Restricted</h4>
                  <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto italic">Decryption required for Medications, Vitals History, and Lab Reports.</p>
               </motion.div>
             ) : (
                <motion.div 
                  key="unlocked"
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700"
                >
                   {/* Biometric Dashboard */}
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: 'Height', val: displayData.medical?.height ? `${displayData.medical.height} cm` : 'N/A', icon: TrendingUp, color: 'text-primary-500' },
                        { label: 'Weight', val: displayData.medical?.weight ? `${displayData.medical.weight} kg` : 'N/A', icon: Activity, color: 'text-emerald-500' },
                        { label: 'BMI', val: displayData.medical?.bmi || 'N/A', icon: Zap, color: 'text-green-500' },
                        { label: 'Blood Type', val: profile.bloodGroup || 'UNK', icon: Droplets, color: 'text-rose-500' }
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white dark:border-white/10 shadow-xl text-center group hover:scale-105 transition-all">
                             <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${item.color}`}>
                                <Icon className="h-5 w-5" />
                             </div>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                             <p className="text-xl font-black text-gray-900 dark:text-white">{item.val}</p>
                          </div>
                        );
                      })}
                   </div>

                   {/* Vitals Feed */}
                  {displayData.vitals?.length > 0 && (
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-10 border border-white dark:border-white/10 shadow-2xl">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                               <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                            Telemetry History
                         </h3>
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">Live Audit</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5">
                              <th className="pb-5 pr-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Point</th>
                              <th className="pb-5 pr-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Metric</th>
                              <th className="pb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reading</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {displayData.vitals.slice(0, 5).map((v: any) => (
                              <tr key={v._id} className="group">
                                <td className="py-5 pr-4">
                                   <p className="text-sm font-bold text-gray-900 dark:text-white">{safeFormat(v.date, 'MMM dd')}</p>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase">{safeFormat(v.date, 'HH:mm')}</p>
                                </td>
                                <td className="py-5 pr-4">
                                   <span className="text-xs font-black text-gray-500 uppercase tracking-tight">{v.type}</span>
                                </td>
                                <td className="py-5">
                                   <span className="text-xl font-black text-orange-600 dark:text-orange-400">{v.value}</span>
                                   <span className="ml-1 text-[10px] font-bold text-gray-400 uppercase">{v.unit}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Clinical Visit Timeline */}
                  {displayData.visits?.length > 0 && (
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-10 border border-white dark:border-white/10 shadow-2xl">
                       <div className="flex justify-between items-center mb-10">
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                             <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                                <HistoryIcon className="h-7 w-7 text-green-600" />
                             </div>
                             Visitor History Timeline
                          </h3>
                       </div>
                       <div className="space-y-8 relative">
                          <div className="absolute left-8 top-10 bottom-10 w-px bg-gray-100 dark:bg-white/5"></div>
                          {displayData.visits.map((visit: any) => (
                            <div key={visit._id} className="relative pl-20 group">
                               <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-4 border-green-600 z-10 group-hover:scale-150 transition-transform"></div>
                               <div className="bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/10 group-hover:border-green-500/30 transition-all shadow-sm">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                     <div>
                                        <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">{safeFormat(visit.date, 'MMMM dd, yyyy')}</p>
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{visit.hospitalName || 'Clinical Node Access'}</h4>
                                     </div>
                                     <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl text-[10px] font-black text-green-600 uppercase tracking-widest border border-green-100 dark:border-green-800/30">
                                        {visit.visitType || 'Standard Visit'}
                                     </div>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                                     <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Diagnosis</p>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{visit.diagnosis || 'Standard Observation'}</p>
                                     </div>
                                     <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Attending Clinician</p>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{visit.doctorName || 'Verification Pending'}</p>
                                     </div>
                                  </div>
                                  {visit.notes && (
                                    <div className="p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-white/10 italic text-xs text-gray-500 leading-relaxed font-medium">
                                       " {visit.notes} "
                                    </div>
                                  )}
                                  {visit.documents && visit.documents.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Attached Reports</p>
                                       <div className="grid sm:grid-cols-2 gap-3">
                                          {visit.documents.map((doc: any, idx: number) => (
                                            <a 
                                              key={idx}
                                              href={`${api.defaults.baseURL?.replace('/api', '')}${doc.fileUrl}`} 
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-green-500/30 transition-all group/doc shadow-sm"
                                            >
                                               <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                                  <FileText className="h-4 w-4 text-green-600" />
                                               </div>
                                               <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 truncate flex-1">{doc.title}</span>
                                               <Download className="h-4 w-4 text-gray-400 group-hover/doc:text-green-600 transition-all" />
                                            </a>
                                          ))}
                                       </div>
                                    </div>
                                  )}
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* Medications & Vaccines */}
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-10 border border-white dark:border-white/10 shadow-2xl">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                         <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                            <Pill className="h-6 w-6 text-emerald-600" />
                         </div>
                         Active Meds
                      </h3>
                      <div className="space-y-6">
                        {displayData.medicines?.filter((m: any) => m.active).map((m: any) => (
                          <div key={m._id} className="bg-emerald-50/30 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 group">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-black text-gray-900 dark:text-white">{m.name}</h4>
                              <span className="text-[9px] font-black bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">{m.times.join(', ')}</span>
                            </div>
                            <p className="text-xs font-bold text-emerald-600/70 dark:text-emerald-400/70">{m.dosage} • {m.frequency}</p>
                          </div>
                        )) || <p className="text-gray-400 text-xs italic">No active medications reported.</p>}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-10 border border-white dark:border-white/10 shadow-2xl">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                         <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                            <Syringe className="h-6 w-6 text-emerald-600" />
                         </div>
                         Immunization
                      </h3>
                      <div className="space-y-4">
                        {displayData.vaccinations?.slice(0, 3).map((v: any) => (
                          <div key={v._id} className="bg-emerald-50/30 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 flex justify-between items-center">
                            <div>
                              <h4 className="font-black text-gray-900 dark:text-white text-sm">{v.vaccineName}</h4>
                              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{v.disease}</p>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{safeFormat(v.dateAdministered, 'MMM yyyy')}</p>
                          </div>
                        )) || <p className="text-gray-400 text-xs italic">No immunization history synced.</p>}
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle & Insurance */}
                  <div className="grid md:grid-cols-3 gap-10">
                     <div className="md:col-span-2 bg-white dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-10 border border-white dark:border-white/10 shadow-2xl">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                           <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl">
                              <UserCircle className="h-6 w-6 text-gray-600" />
                           </div>
                           Bio-Demographics
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                           {[
                             { label: 'Smoking', val: displayData.medical?.lifestyle?.smoking ? 'Active' : 'Non-Smoker', color: displayData.medical?.lifestyle?.smoking ? 'text-rose-500' : 'text-emerald-500' },
                             { label: 'Alcohol', val: displayData.medical?.lifestyle?.alcohol ? 'User' : 'Free', color: displayData.medical?.lifestyle?.alcohol ? 'text-amber-500' : 'text-emerald-500' },
                             { label: 'Exercise', val: displayData.medical?.lifestyle?.exercise || 'None', color: 'text-primary-500' }
                           ].map((item, i) => (
                             <div key={i} className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 text-center">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                                <p className={`text-sm font-black ${item.color}`}>{item.val}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-premium">
                         <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="h-32 w-32" />
                         </div>
                         <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-teal-400" />
                            Insurance Vault
                         </h3>
                         <div className="space-y-6 relative z-10 custom-scrollbar max-h-[300px] overflow-auto pr-2">
                            {displayData.medical?.insurances?.length > 0 ? (
                              displayData.medical.insurances.map((ins: any, idx: number) => (
                                <div key={idx} className={`space-y-3 ${idx !== 0 ? 'pt-6 border-t border-white/10' : ''}`}>
                                   <div className="flex justify-between items-start">
                                      <div>
                                         <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-1">{ins.coverageType || 'Medical'} Coverage</p>
                                         <p className="font-black text-sm">{ins.provider || 'UNSPECIFIED'}</p>
                                      </div>
                                      <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 text-[8px] font-black rounded uppercase">Active</span>
                                   </div>
                                   <div>
                                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Policy Node</p>
                                      <p className="font-mono text-xs font-black">{ins.policyNumber || 'N/A'}</p>
                                   </div>
                                   {ins.expiryDate && (
                                     <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Expiration</p>
                                        <p className="text-[10px] font-bold">{new Date(ins.expiryDate).toLocaleDateString()}</p>
                                     </div>
                                   )}
                                </div>
                              ))
                            ) : (
                              <div className="py-4 text-center">
                                 <p className="text-xs text-slate-500 font-bold italic">No insurance nodes detected.</p>
                              </div>
                            )}
                         </div>
                      </div>
                  </div>

                  {/* Clinical Reports */}
                  {displayData.reports?.length > 0 && (
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-10 border border-white dark:border-white/10 shadow-2xl">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                         <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
                            <FileText className="h-6 w-6 text-primary-600" />
                         </div>
                         Lab Reports Vault
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayData?.reports?.map((report: any) => (
                          <div key={report._id} className="bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-6 flex flex-col justify-between group hover:border-primary-500/30 transition-all">
                            <div>
                               <h4 className="font-black text-gray-900 dark:text-white text-sm mb-4 leading-tight">{report.title}</h4>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{safeFormat(report.createdAt, 'MMM yyyy')}</p>
                            </div>
                            <a 
                              href={`${api.defaults.baseURL?.replace('/api', '')}${report.fileUrl}`} 
                              target="_blank" 
                              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-primary-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all"
                            >
                               <Download className="h-4 w-4" /> Open
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
               </motion.div>
             )}
          </AnimatePresence>

          {/* Emergency Contacts - Always Public */}
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-3xl rounded-[3rem] p-10 border border-white dark:border-white/10 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-10 flex items-center gap-4">
               <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                  <Phone className="h-6 w-6 text-emerald-600" />
               </div>
               {t('contacts')}
            </h3>
            {displayData.contacts?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-8">
                {displayData?.contacts?.map((contact: any, i: number) => (
                  <div key={i} className="bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-emerald-500/20 transition-all shadow-sm">
                    <div className="mb-8">
                       <h4 className="font-black text-gray-900 dark:text-white text-2xl tracking-tighter mb-1">{contact.name}</h4>
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">{contact.relation}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <a 
                        href={`tel:${contact.phone}`} 
                        className="w-full flex items-center justify-center gap-4 bg-emerald-600 text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                         <Phone className="h-4 w-4" /> {t('call')}
                      </a>
                      <button 
                        onClick={() => handleWhatsAppSOS(contact.phone)}
                        className="w-full flex items-center justify-center gap-4 bg-white dark:bg-slate-900 text-emerald-600 border-2 border-emerald-500/30 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all relative group overflow-hidden"
                      >
                         <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                         <MessageSquare className="h-4 w-4 relative z-10" /> 
                         <span className="relative z-10">WhatsApp SOS</span>
                         <motion.div 
                           animate={{ scale: [1, 1.2, 1] }} 
                           transition={{ repeat: Infinity, duration: 2 }} 
                           className="absolute top-2 right-4 w-2 h-2 bg-emerald-500 rounded-full"
                         />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="p-10 text-center bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                  <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">No emergency nodes configured.</p>
               </div>
            )}
          </div>
        </div>

        {/* Global Footer Notes */}
        <div className="text-center space-y-6 pt-10">
           {displayData.medical?.notes && (
             <div className="p-8 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-[2.5rem] text-center max-w-2xl mx-auto">
                <Info className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                <p className="text-sm text-amber-900 dark:text-amber-200 font-bold leading-relaxed italic">
                   " {displayData.medical.notes} "
                </p>
             </div>
           )}
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">EHP GLOBAL • SECURED NODE • {slug?.toUpperCase()}</p>
        </div>
      </main>

      <AnimatePresence>
        {showDoctorModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 50 }} 
              className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 max-w-md w-full shadow-3xl relative z-[210] border border-white dark:border-white/10"
            >
              <button 
                onClick={() => setShowDoctorModal(false)}
                className="absolute top-8 right-8 p-3 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 hover:text-gray-900 transition-all"
              >
                 <X className="h-5 w-5" />
              </button>
              
              <div className="text-center mb-10">
                 <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-10 w-10 text-primary-600" />
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{t('doctor_access')}</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">Verification required for clinical history access.</p>
              </div>

              <form onSubmit={handleDoctorAccess} className="space-y-8">
                {doctorAuthError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest border border-rose-100">
                    {doctorAuthError}
                  </motion.div>
                )}
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Medical Passphrase</label>
                   <input 
                     type="text" 
                     required 
                     placeholder="XXXX-XXXX" 
                     value={accessCode} 
                     onChange={(e) => setAccessCode(e.target.value.toUpperCase())} 
                     className="w-full text-center text-4xl font-black font-mono py-8 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-[2.5rem] text-gray-900 dark:text-white outline-none focus:ring-8 focus:ring-primary-500/10 transition-all" 
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={doctorAuthLoading} 
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-primary-600/30 text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 disabled:opacity-50"
                >
                  {doctorAuthLoading ? (
                    <div className="flex items-center justify-center gap-3">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Validating Node...
                    </div>
                  ) : (
                    <>Establish Connection</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Pulse Button */}
      <div className="fixed bottom-8 right-8 z-[150]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAIAssistant(!showAIAssistant)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-3xl transition-all duration-500 ${showAIAssistant ? 'bg-rose-600 rotate-90' : 'bg-primary-600'}`}
        >
          {showAIAssistant ? <X className="text-white h-8 w-8" /> : <Sparkles className="text-white h-8 w-8 animate-pulse" />}
          {!showAIAssistant && (
            <span className="absolute -top-2 -left-2 bg-rose-600 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce">AI GUIDE</span>
          )}
        </motion.button>
      </div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 z-[140] w-[calc(100%-4rem)] max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] shadow-4xl border border-gray-100 dark:border-white/10 overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-600/20">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">First-Aid Intelligence</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${aiLoading ? 'bg-primary-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{aiLoading ? 'Thinking' : 'Ready'}</span>
                </div>
              </div>

              <div className="min-h-[150px] max-h-[300px] overflow-y-auto custom-scrollbar p-6 bg-gray-50 dark:bg-[#050505] rounded-[2rem] border border-gray-100 dark:border-white/5">
                {aiResponse ? (
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {aiResponse.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-primary-600 dark:text-primary-400 font-black">{part}</strong> : part)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-40">
                    <MessageSquare className="h-10 w-10 text-gray-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-center">Describe the symptom or ask for guidance</p>
                  </div>
                )}
                {aiLoading && (
                  <div className="mt-4 flex gap-1">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={startListening}
                  disabled={isListening || aiLoading}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl'}`}
                >
                  {isListening ? (
                    <>
                      <div className="flex gap-0.5 items-center">
                        {[1,2,3,4].map(i => <motion.div key={i} animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} className="w-1 bg-white rounded-full" />)}
                      </div>
                      Listening
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" /> Start Voice Guide
                    </>
                  )}
                </button>
                {aiResponse && (
                  <button 
                    onClick={() => handleAISpeech(aiResponse)}
                    className={`p-5 rounded-2xl border border-gray-100 dark:border-white/10 transition-all ${isSpeaking ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400'}`}
                  >
                    <Volume2 className={`h-5 w-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                  </button>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Medical context: Active</p>
                <div className="flex gap-2">
                  {['Chest Pain', 'Allergy', 'Bleeding'].map(tag => (
                    <button key={tag} onClick={() => sendToAI(`How to handle ${tag}?`)} className="text-[8px] font-black text-primary-600 uppercase tracking-widest hover:underline">{tag}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyPage;
