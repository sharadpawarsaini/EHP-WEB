import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, TrendingUp, FileText, ArrowRight, MapPin, Navigation, Trophy } from 'lucide-react';
import api from '../../services/api';
import { format } from 'date-fns';

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [recentVitals, setRecentVitals] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [nearestHospital, setNearestHospital] = useState<any>(null);
  const [stats, setStats] = useState({
    profileComplete: false,
    medicalComplete: false,
    contactsCount: 0,
    hasLink: false,
    hasReports: false,
    hasVitals: false,
    hasMedicines: false,
    hasVaccinations: false,
    hasAppointments: false
  });

  const checklistItems = [
    { id: 'profile', label: 'Complete Basic Profile', completed: stats.profileComplete, path: '/dashboard/profile' },
    { id: 'medical', label: 'Add Medical Conditions/Allergies', completed: stats.medicalComplete, path: '/dashboard/medical' },
    { id: 'contacts', label: 'Link Emergency Contacts (Min 1)', completed: stats.contactsCount > 0, path: '/dashboard/contacts' },
    { id: 'link', label: 'Activate Emergency Link', completed: stats.hasLink, path: '/dashboard/emergency' },
    { id: 'vitals', label: 'Record your first Vital sign', completed: stats.hasVitals, path: '/dashboard/vitals' },
    { id: 'reports', label: 'Upload a Medical Report', completed: stats.hasReports, path: '/dashboard/reports' },
    { id: 'medicines', label: 'Setup Medicine Reminders', completed: stats.hasMedicines, path: '/dashboard/medicines' },
    { id: 'vaccinations', label: 'Log Vaccination History', completed: stats.hasVaccinations, path: '/dashboard/vaccinations' },
    { id: 'appointments', label: 'Schedule a Health Appointment', completed: stats.hasAppointments, path: '/dashboard/appointments' },
  ];

  const safetyScore = Math.round((checklistItems.filter(i => i.completed).length / checklistItems.length) * 100);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [profileRes, medicalRes, contactsRes, linkRes, vitalsRes, reportsRes, visitsRes, medicinesRes, vaccinationsRes, appointmentsRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: null })),
          api.get('/medical').catch(() => ({ data: null })),
          api.get('/emergency/contacts').catch(() => ({ data: [] })),
          api.get('/emergency/link').catch(() => ({ data: null })),
          api.get('/vitals').catch(() => ({ data: [] })),
          api.get('/reports').catch(() => ({ data: [] })),
          api.get('/visits').catch(() => ({ data: [] })),
          api.get('/medicines').catch(() => ({ data: [] })),
          api.get('/vaccinations').catch(() => ({ data: [] })),
          api.get('/appointments').catch(() => ({ data: [] }))
        ]);

        setData({
          profile: profileRes.data,
          medical: medicalRes.data,
        });

        setRecentVitals(vitalsRes.data.slice(-2).reverse());
        setRecentReports(reportsRes.data.slice(0, 2));
        setRecentVisits(visitsRes.data.slice(0, 3));

        const s = {
          profileComplete: !!profileRes.data?.fullName,
          medicalComplete: !!medicalRes.data?.allergies || !!medicalRes.data?.conditions,
          contactsCount: contactsRes.data?.length || 0,
          hasLink: !!linkRes.data?.link?.publicSlug,
          hasReports: reportsRes.data?.length > 0,
          hasVitals: vitalsRes.data?.length > 0,
          hasMedicines: medicinesRes.data?.length > 0,
          hasVaccinations: vaccinationsRes.data?.length > 0,
          hasAppointments: appointmentsRes.data?.length > 0
        };
        setStats(s);

        // Fetch nearest hospital if geolocation is available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
              const { latitude, longitude } = pos.coords;
              const { data: hospitalData } = await api.get(`/hospitals/nearby?lat=${latitude}&lng=${longitude}&type=hospital`);
              if (hospitalData && hospitalData.length > 0) {
                // Sort by distance (calculated in backend or just take first)
                setNearestHospital(hospitalData[0]);
              }
            } catch (err) {
              console.error("Failed to fetch nearest hospital", err);
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch overview data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  const getHealthInsight = () => {
    if (!data?.medical) return "Complete your medical profile to receive personalized health insights.";
    
    const insights = [];
    if (data.profile?.bloodGroup === 'O-') insights.push("You are a Universal Donor! Your blood can help anyone in an emergency.");
    if (data.medical.allergies?.length > 0) insights.push(`Stay cautious about ${data.medical.allergies[0]}. Always keep your QR code accessible for first responders.`);
    if (data.medical.conditions?.length > 0) insights.push("Regular checkups are recommended for your chronic conditions.");
    if (stats.hasVitals) insights.push("Great job tracking your vitals! Consistency is key to long-term health.");
    if (safetyScore === 100) insights.push("Perfect Score! Your emergency readiness is world-class.");
    
    return insights.length > 0 ? insights[Math.floor(Math.random() * insights.length)] : "Your medical profile looks great! Keep it updated for maximum safety.";
  };

  if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading overview...</div>;

  return (
    <div className="space-y-8">
      {/* Top Banner: Safety Score & Welcome */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome, {data?.profile?.fullName?.split(' ')[0] || 'User'}</h1>
              <p className="text-gray-600 dark:text-gray-400">Your health passport is {safetyScore}% ready for emergencies.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <div className="text-right">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Safety Score</p>
                <p className="text-3xl font-black text-blue-700 dark:text-white">{safetyScore}%</p>
              </div>
              <Trophy className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          {/* Safety Progress Bar */}
          <div className="mt-8 w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${safetyScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full shadow-lg shadow-blue-500/30"
            />
          </div>
        </div>

        {/* Nearest Help Quick Card */}
        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-[2rem] p-8 text-white shadow-xl shadow-red-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-100">Nearest Help</span>
            </div>
            {nearestHospital ? (
              <>
                <h3 className="text-xl font-bold mb-1 truncate">{nearestHospital.name}</h3>
                <p className="text-red-100 text-xs mb-4 line-clamp-1">{nearestHospital.address}</p>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestHospital.lat},${nearestHospital.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                >
                  <Navigation className="h-4 w-4" /> Navigate Now
                </a>
              </>
            ) : (
              <p className="text-sm text-red-100 italic">Searching for nearest hospital...</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Health Insights & Vitals */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 shadow-xl shadow-blue-500/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                </div>
                <h2 className="text-2xl font-bold">Health Insights</h2>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed italic mb-6">
                "{getHealthInsight()}"
              </p>
              <div className="flex items-center gap-2 text-blue-200 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>AI recommendations based on your data</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Vitals */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" /> Recent Vitals
                </h3>
                <button onClick={() => window.open('/dashboard/vitals', '_self')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {recentVitals.map((v, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{v.type}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{v.value} <span className="text-xs font-normal text-gray-400">{v.unit}</span></p>
                    </div>
                    <span className="text-[10px] text-gray-400">{format(new Date(v.date), 'MMM dd')}</span>
                  </div>
                ))}
                {recentVitals.length === 0 && <p className="text-sm text-gray-500 italic py-4 text-center">No vitals tracked yet.</p>}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" /> Recent Reports
                </h3>
                <button onClick={() => window.open('/dashboard/reports', '_self')} className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {recentReports.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{r.title}</p>
                      <p className="text-[10px] text-gray-400">{format(new Date(r.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                ))}
                {recentReports.length === 0 && <p className="text-sm text-gray-500 italic py-4 text-center">No reports uploaded yet.</p>}
              </div>
            </div>
          </div>

          {/* Recent Hospital Visits */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-indigo-600" /> Recent Hospital Visits
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentVisits.map((visit) => (
                <div 
                  key={visit._id} 
                  onClick={() => window.open(`/dashboard/visits/${visit._id}`, '_self')}
                  className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white truncate mb-1" title={visit.hospitalName}>{visit.hospitalName}</h4>
                  <p className="text-xs text-gray-500 font-medium mb-3">{format(new Date(visit.visitDate), 'MMMM dd, yyyy')}</p>
                  <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <FileText className="h-3 w-3 mr-1" /> {visit.documents?.length || 0} Documents
                  </div>
                </div>
              ))}
              {recentVisits.length === 0 && (
                <div className="col-span-full p-6 text-center text-gray-500 italic">
                  No hospital visits recorded yet. You can add them in the Medical Info tab.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Safety Checklist */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Safety Checklist</h3>
            <div className="space-y-4">
              {checklistItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => window.open(item.path, '_self')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    item.completed 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400' 
                    : 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-700 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <div className={`p-1 rounded-full ${item.completed ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'}`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className={`text-xs font-bold text-left flex-1 ${item.completed ? 'line-through opacity-70' : ''}`}>{item.label}</span>
                  {!item.completed && <ArrowRight className="h-3 w-3" />}
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
               <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                 <strong>Ready for Emergency?</strong> A score of 100% means first responders will have everything they need to save your life.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
