import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, TrendingUp, FileText, ArrowRight, MapPin, Navigation, Trophy } from 'lucide-react';
import api from '../../services/api';
import { format, differenceInYears } from 'date-fns';

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [safetyScore, setSafetyScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, medicalRes, medicinesRes, vaccinationsRes, appointmentsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/medical'),
          api.get('/medicines'),
          api.get('/vaccinations'),
          api.get('/appointments')
        ]);

        const profile = profileRes.data;
        const medical = medicalRes.data;
        const medicines = medicinesRes.data;
        const vaccinations = vaccinationsRes.data;
        const appointments = appointmentsRes.data;

        setData({ profile, medical, medicines, vaccinations, appointments });

        // Calculate Safety Score
        const checklistItems = [
          { label: 'Profile Completed', completed: !!profile.fullName && !!profile.dob && !!profile.bloodGroup },
          { label: 'Allergies Listed', completed: medical.allergies?.length > 0 },
          { label: 'Medical Conditions', completed: medical.conditions?.length > 0 },
          { label: 'Emergency Contacts', completed: true }, // Placeholder for now
          { label: 'Digital Reports', completed: true }, // Placeholder
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

  if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading overview...</div>;

  return (
    <div className="space-y-8">
      {/* Top Banner: Safety Score & Welcome */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome, {data?.profile?.fullName?.split(' ')[0] || 'User'}</h1>
              <p className="text-gray-600 dark:text-gray-400">Your health passport is {safetyScore}% ready for emergencies. {age !== null && `Current age: ${age} years.`}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <div className="text-right">
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Safety Score</p>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{safetyScore}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Blood Group</p>
              <p className="text-xl font-black text-red-600">{data?.profile?.bloodGroup || '??'}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Allergies</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{data?.medical?.allergies?.length || 0}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Medicines</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{data?.medicines?.length || 0}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vitals</p>
              <p className="text-xl font-black text-emerald-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-600/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/30">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Daily Insight</h3>
            <p className="text-blue-100 font-medium leading-relaxed">{getInsight()}</p>
          </div>
          <button className="mt-6 flex items-center justify-center space-x-2 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
            <span>Review Profile</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity & Checklist */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="mr-3 h-6 w-6 text-blue-600" />
              Safety Checklist
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Profile Completed', completed: !!data?.profile?.fullName && !!data?.profile?.dob },
                { label: 'Medical History', completed: data?.medical?.conditions?.length > 0 },
                { label: 'Allergy Records', completed: data?.medical?.allergies?.length > 0 },
                { label: 'Active Medicines', completed: data?.medicines?.length > 0 },
                { label: 'Emergency Contacts', completed: true },
                { label: 'Vaccination History', completed: data?.vaccinations?.length > 0 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.completed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className={`text-sm font-bold ${item.completed ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="mr-3 h-6 w-6 text-indigo-600" />
                Latest Health Documents
              </h3>
              <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-600 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Blood Test Report - Mar 2024</p>
                      <p className="text-xs text-gray-500 font-medium">PDF • 2.4 MB • Lab One Diagnostics</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Widgets */}
        <div className="space-y-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white dark:border-slate-700 overflow-hidden relative group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-emerald-600" />
              Nearest SOS Points
            </h3>
            <div className="space-y-6">
              {[
                { name: 'City General Hospital', dist: '1.2 km', time: '5 mins' },
                { name: 'Apollo Emergency', dist: '2.8 km', time: '12 mins' },
                { name: 'Red Cross Clinic', dist: '3.5 km', time: '15 mins' }
              ].map((hosp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-emerald-100 dark:border-emerald-900/30">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">{hosp.name}</p>
                  <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>{hosp.dist}</span>
                    <span className="mx-2">•</span>
                    <span className="text-emerald-600">{hosp.time} away</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 group">
              <Navigation className="h-4 w-4 group-hover:animate-bounce" />
              <span>Open Emergency Map</span>
            </button>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Health Milestones
            </h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-full border-4 border-amber-100 dark:border-amber-900/30 flex items-center justify-center p-1">
                <div className="w-full h-full bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Profile Level: Gold</p>
                <p className="text-xs text-gray-500 font-medium">9/10 fields completed</p>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[90%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
