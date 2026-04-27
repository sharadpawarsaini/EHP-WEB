import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, HeartPulse, UserCircle } from 'lucide-react';
import api from '../../services/api';

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading overview...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome to EHP Dashboard</h1>
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
            <UserCircle className={`h-8 w-8 mb-4 ${stats.profileComplete ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Basic Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.profileComplete ? 'Completed' : 'Action Required'}</p>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl border ${stats.medicalComplete ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50' : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-600'}`}>
            <HeartPulse className={`h-8 w-8 mb-4 ${stats.medicalComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Medical Info</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.medicalComplete ? 'Recorded' : 'Action Required'}</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl border ${stats.contactsCount > 0 ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50' : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-600'}`}>
            <ShieldAlert className={`h-8 w-8 mb-4 ${stats.contactsCount > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Contacts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.contactsCount}/2 Added</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl border ${stats.hasLink ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/50' : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-600'}`}>
            <Activity className={`h-8 w-8 mb-4 ${stats.hasLink ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'}`} />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Emergency Link</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.hasLink ? 'Active' : 'Action Required'}</p>
          </motion.div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 shadow-xl shadow-blue-500/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Ready for the unexpected?</h2>
          <p className="text-blue-100 max-w-xl mb-6">Ensure your medical information is completely up to date. The more details you provide, the better equipped first responders will be.</p>
          <a href="/dashboard/medical" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Review Medical File
          </a>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
