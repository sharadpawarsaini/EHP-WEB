import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Activity, ShieldAlert, HeartPulse, UserCircle, Phone, Lock, ChevronRight, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const EmergencyPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [doctorAuthLoading, setDoctorAuthLoading] = useState(false);
  const [doctorAuthError, setDoctorAuthError] = useState('');
  const [fullData, setFullData] = useState<any>(null);

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

  const handleDoctorAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorAuthLoading(true);
    setDoctorAuthError('');
    try {
      const response = await api.post(`/emergency/public/${slug}/access`, {
        accessCode
      });
      setFullData(response.data);
      setShowDoctorModal(false);
    } catch (err) {
      setDoctorAuthError('Invalid Access Code. Please try again.');
    } finally {
      setDoctorAuthLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] text-center max-w-md w-full shadow-2xl border border-white dark:border-slate-700">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (data.isLocked) {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] text-center max-w-md w-full shadow-2xl border border-white/10">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <Lock className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">{t('profile_locked')}</h2>
          <p className="text-gray-400 leading-relaxed font-medium">
            {t('locked_msg')}
          </p>
        </div>
      </div>
    );
  }

  const profile = data.profile || {};
  const medical = data.medical || {};

  const displayData = fullData || data;
  const isFullAccess = !!fullData;

  return (
    <div className={`min-h-screen ${isFullAccess ? 'bg-slate-50 dark:bg-slate-900' : 'bg-gray-900 dark:bg-slate-950'} text-gray-900 dark:text-gray-100 font-sans pb-20 transition-colors duration-300`}>
      {/* Header */}
      <header className={`${isFullAccess ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-red-600 to-rose-600'} text-white py-6 px-4 shadow-md sticky top-0 z-10 transition-colors duration-300`}>
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">EHP {isFullAccess ? t('doctor_view') : t('emergency_title')}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white/10 p-1 rounded-lg backdrop-blur-md border border-white/20">
              <button 
                onClick={() => i18n.changeLanguage('en')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${i18n.language.startsWith('en') ? 'bg-white text-gray-900 shadow-sm' : 'text-white hover:bg-white/10'}`}
              >
                EN
              </button>
              <button 
                onClick={() => i18n.changeLanguage('hi')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${i18n.language === 'hi' ? 'bg-white text-gray-900 shadow-sm' : 'text-white hover:bg-white/10'}`}
              >
                हिं
              </button>
            </div>
            {!isFullAccess && (
              <div className="hidden sm:flex items-center space-x-2 text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-white/10">
                <span className="animate-ping absolute h-2 w-2 bg-white rounded-full opacity-75"></span>
                <span className="relative h-2 w-2 bg-white rounded-full"></span>
                <span>{t('public_view')}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700 overflow-hidden relative">
          <div className={`absolute top-0 left-0 w-full h-2 ${isFullAccess ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}></div>
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left relative z-10">
            <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-slate-600 shadow-sm">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <UserCircle className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{profile.fullName || 'Unknown Patient'}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                  <HeartPulse className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-bold text-red-700 dark:text-red-300">{t('blood_group')}: <span className="text-xl">{profile.bloodGroup || 'Unknown'}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isFullAccess && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border border-blue-500/30 rounded-3xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-900/20"
          >
            <div className="flex items-center gap-4 text-white">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <Lock className="h-8 w-8 text-blue-300 flex-shrink-0" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">{t('doctor_access')}</h3>
                <p className="text-blue-200 text-sm">Unlock full medical history using the Access Code.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDoctorModal(true)}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              {t('unlock')} <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        <div className="grid gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" /> {t('allergies')}
            </h3>
            {displayData.medical?.allergies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayData.medical.allergies.map((allergy: string, i: number) => (
                  <span key={i} className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-3 py-1 rounded-lg font-medium text-sm border border-red-100 dark:border-red-800/50 shadow-sm">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">{t('no_allergies')}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('conditions')}</h3>
              {displayData.medical?.conditions?.length > 0 ? (
                <ul className="space-y-3">
                  {displayData.medical.conditions.map((condition: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 shadow-sm shadow-blue-500/50"></span>
                      <span className="font-medium">{condition}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">{t('no_conditions')}</p>
              )}
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('medications')}</h3>
              {displayData.medical?.medications?.length > 0 ? (
                <ul className="space-y-3">
                  {displayData.medical.medications.map((medication: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-sm shadow-emerald-500/50"></span>
                      <span className="font-medium">{medication}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">{t('no_medications')}</p>
              )}
            </div>
          </div>

          {isFullAccess && (
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-blue-100 dark:border-blue-900/50">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-4">Additional Medical History</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Past Surgeries</h4>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{displayData.medical?.surgeries?.join(', ') || 'None reported'}</p>
                  </div>
                  <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Vaccinations</h4>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{displayData.medical?.vaccinations?.join(', ') || 'None reported'}</p>
                  </div>
                </div>
              </div>
              {/* Reports Section */}
              {displayData.reports?.length > 0 && (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" /> Clinical Reports
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {displayData.reports.map((report: any) => (
                      <div key={report._id} className="bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{report.title}</h4>
                        <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${report.fileUrl}`} target="_blank" className="mt-3 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-xs font-bold">
                          <Download className="h-3.5 w-3.5" /> View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-emerald-500" /> {t('contacts')}
            </h3>
            {displayData.contacts?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {displayData.contacts.map((contact: any, i: number) => (
                  <div key={i} className="bg-gray-50/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{contact.name}</h4>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{contact.relation}</span>
                    </div>
                    <a href={`tel:${contact.phone}`} className="mt-4 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl font-bold">
                      <Phone className="h-5 w-5" /> {t('call')}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No contacts listed.</p>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showDoctorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDoctorModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative z-10">
              <h2 className="text-2xl font-bold mb-4">{t('doctor_access')}</h2>
              <form onSubmit={handleDoctorAccess} className="space-y-4">
                {doctorAuthError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center font-bold">{doctorAuthError}</div>}
                <input type="text" required placeholder={t('access_code_prompt')} value={accessCode} onChange={(e) => setAccessCode(e.target.value.toUpperCase())} className="w-full text-center text-2xl font-mono p-4 bg-gray-50 dark:bg-slate-900 border rounded-xl" />
                <button type="submit" disabled={doctorAuthLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">{doctorAuthLoading ? 'Verifying...' : t('unlock')}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyPage;
