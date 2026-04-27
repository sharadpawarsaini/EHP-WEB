import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, HeartPulse, UserCircle, Zap, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState({
    profileComplete: false,
    medicalComplete: false,
    contactsCount: 0,
    hasLink: false
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [profileRes, medicalRes, contactsRes, linkRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: null })),
          api.get('/medical').catch(() => ({ data: null })),
          api.get('/emergency/contacts').catch(() => ({ data: [] })),
          api.get('/emergency/link').catch(() => ({ data: null }))
        ]);

        setData({
          profile: profileRes.data,
          medical: medicalRes.data,
        });

        setStats({
          profileComplete: !!profileRes.data?.fullName,
          medicalComplete: !!medicalRes.data?.allergies || !!medicalRes.data?.conditions,
          contactsCount: contactsRes.data?.length || 0,
          hasLink: !!linkRes.data?.link?.publicSlug
        });
      } catch (err) {
        console.error("Failed to fetch overview data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const completionPercentage = [
    stats.profileComplete,
    stats.medicalComplete,
    stats.contactsCount > 0,
    stats.hasLink
  ].filter(Boolean).length * 25;

  const getHealthInsight = () => {
    if (!data?.medical) return "Complete your medical profile to receive personalized health insights.";
    
    const insights = [];
    if (data.profile?.bloodGroup === 'O-') insights.push("You are a Universal Donor! Your blood can help anyone in an emergency.");
    if (data.medical.allergies?.length > 0) insights.push(`Stay cautious about ${data.medical.allergies[0]}. Always keep your QR code accessible for first responders.`);
    if (data.medical.conditions?.length > 0) insights.push("Regular checkups are recommended for your chronic conditions.");
    
    return insights.length > 0 ? insights[Math.floor(Math.random() * insights.length)] : "Your medical profile looks great! Keep it updated for maximum safety.";
  };

  if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading overview...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome, {data?.profile?.fullName?.split(' ')[0] || 'User'}</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your medical identity and secure your emergency passport.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-600">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Profile Completion</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{completionPercentage}%</p>
            </div>
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle className="text-gray-200 dark:text-gray-600" strokeWidth="4" stroke="currentColor" fill="transparent" r="20" cx="24" cy="24" />
                <circle className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out" strokeWidth="4" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * completionPercentage) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="20" cx="24" cy="24" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl border ${stats.profileComplete ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50' : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-600'}`}>
            <div className="flex justify-between items-start mb-4">
              <UserCircle className={`h-8 w-8 ${stats.profileComplete ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              {stats.profileComplete && <span className="text-[10px] font-bold text-blue-600/50 dark:text-blue-400/50 uppercase">Updated</span>}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Basic Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.profileComplete ? 'Completed' : 'Action Required'}</p>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl border ${stats.medicalComplete ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50' : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-600'}`}>
            <div className="flex justify-between items-start mb-4">
              <HeartPulse className={`h-8 w-8 ${stats.medicalComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} />
              {stats.medicalComplete && <span className="text-[10px] font-bold text-emerald-600/50 dark:text-emerald-400/50 uppercase">Recorded</span>}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Medical Info</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.medicalComplete ? 'Up to date' : 'Action Required'}</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl border ${stats.contactsCount > 0 ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50' : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-600'}`}>
            <div className="flex justify-between items-start mb-4">
              <ShieldAlert className={`h-8 w-8 ${stats.contactsCount > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
              {stats.contactsCount > 0 && <span className="text-[10px] font-bold text-purple-600/50 dark:text-purple-400/50 uppercase">{stats.contactsCount} Linked</span>}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Contacts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.contactsCount > 0 ? 'Emergency Ready' : 'Add Contacts'}</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl border ${stats.hasLink ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/50' : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-600'}`}>
            <div className="flex justify-between items-start mb-4">
              <Activity className={`h-8 w-8 ${stats.hasLink ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'}`} />
              {stats.hasLink && <span className="text-[10px] font-bold text-rose-600/50 dark:text-rose-400/50 uppercase">Live</span>}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Emergency Link</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.hasLink ? 'Scan Ready' : 'Generate Now'}</p>
          </motion.div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* AI Health Insights */}
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

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.open(`${window.location.origin}/dashboard/emergency`, '_self')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-100 dark:border-slate-700 transition-all group"
            >
              <ExternalLink className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mb-2" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center">Test My QR Link</span>
            </button>
            <button 
              onClick={() => window.open(`${window.location.origin}/dashboard/medical`, '_self')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-100 dark:border-slate-700 transition-all group"
            >
              <Calendar className="h-6 w-6 text-gray-400 group-hover:text-emerald-500 mb-2" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-center">Update Records</span>
            </button>
          </div>
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
             <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
               <strong>Pro Tip:</strong> Keep your "Emergency Link" active at all times. It is the only way first responders can access your medical history.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
