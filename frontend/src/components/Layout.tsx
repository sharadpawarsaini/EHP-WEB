import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Activity, 
  ShieldAlert, 
  FileText, 
  QrCode, 
  Home as HomeIcon, 
  ClipboardList, 
  History, 
  Hospital, 
  Users, 
  MessageSquareHeart, 
  Menu, 
  X, 
  Heart, 
  Settings, 
  Pill, 
  Syringe, 
  Calendar as CalendarIcon,
  UserCircle,
  Search,
  Watch
} from 'lucide-react';
import { useProfileContext } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { managedMemberName, photoUrl } = useProfileContext();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: t('nav_overview'), path: '/dashboard', icon: HomeIcon },
    { name: t('nav_profile'), path: '/dashboard/profile', icon: User },
    { name: 'Medicines', path: '/dashboard/medicines', icon: Pill },
    { name: 'Vaccinations', path: '/dashboard/vaccinations', icon: Syringe },
    { name: 'Appointments', path: '/dashboard/appointments', icon: CalendarIcon },
    { name: t('nav_medical'), path: '/dashboard/medical', icon: ClipboardList },
    { name: 'Visit History', path: '/dashboard/visits', icon: History },
    { name: t('nav_reports'), path: '/dashboard/reports', icon: FileText },
    { name: t('nav_contacts'), path: '/dashboard/contacts', icon: ShieldAlert },
    { name: t('nav_emergency'), path: '/dashboard/emergency', icon: QrCode },
    { name: t('nav_logs'), path: '/dashboard/logs', icon: History },
    { name: t('nav_hospitals'), path: '/dashboard/hospitals', icon: Hospital },
    { name: t('nav_vitals'), path: '/dashboard/vitals', icon: Activity },
    { name: 'Wearables', path: '/dashboard/integrations', icon: Watch },
    { name: t('nav_family'), path: '/dashboard/family', icon: Users },
    { name: 'Feedback', path: '/dashboard/feedback', icon: MessageSquareHeart },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const mobileBottomNav = [
    { name: 'Home', path: '/dashboard', icon: HomeIcon },
    { name: 'Medical', path: '/dashboard/medical', icon: ClipboardList },
    { name: 'SOS', path: '/dashboard/emergency', icon: Heart },
    { name: 'Vitals', path: '/dashboard/vitals', icon: Activity },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const getFullPhotoUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const base = api.defaults.baseURL?.replace('/api', '') || '';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const ProfileAvatar = ({ className = "h-8 w-8" }: { className?: string }) => (
    <div className={`${className} rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700 flex items-center justify-center border border-gray-200 dark:border-slate-600`}>
      {photoUrl ? (
        <img src={getFullPhotoUrl(photoUrl)!} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <User className="h-4 w-4 text-gray-400" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex font-sans">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex-col hidden md:flex transition-colors duration-300 flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">EHP</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 mb-2">
            <ProfileAvatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white dark:ring-slate-800" />
            <div className="min-w-0">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Health ID</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={managedMemberName}>{managedMemberName}</p>
            </div>
          </div>
          <div className="flex items-center px-4 py-2 space-x-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cloud Synced</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 translate-x-1'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-3 border-t border-gray-100 dark:border-slate-700 mt-4">
          <button
            onClick={() => navigate('/dashboard/emergency')}
            className="flex items-center justify-center space-x-2 px-4 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black w-full shadow-xl shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <ShieldAlert className="h-5 w-5" />
            <span>EMERGENCY SOS</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 font-bold w-full transition-colors group"
          >
            <LogOut className="h-5 w-5 group-hover:text-red-500" />
            <span>{t('nav_logout')}</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-slate-800 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">EHP</span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <ProfileAvatar className="h-10 w-10 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Health ID</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{managedMemberName}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 space-y-3 border-t border-gray-100 dark:border-slate-700 mt-4">
                <button
                  onClick={() => { setMobileNavOpen(false); navigate('/dashboard/emergency'); }}
                  className="flex items-center justify-center space-x-2 px-4 py-4 bg-red-600 text-white rounded-2xl font-black w-full shadow-xl shadow-red-500/20"
                >
                  <ShieldAlert className="h-5 w-5" />
                  <span>EMERGENCY SOS</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 font-bold w-full transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('nav_logout')}</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile top header & Desktop top header info */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 px-4 md:px-10 py-3 flex justify-between items-center sticky top-0 z-40 transition-colors duration-300 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl px-4 py-2 w-96 group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
               <Search className="h-4 w-4 text-gray-400 mr-3" />
               <input 
                 type="text" 
                 placeholder="Search medical records, vitals, hospitals..." 
                 className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-900 dark:text-white placeholder-gray-400 font-medium"
               />
               <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-black text-gray-400 shadow-sm">⌘ K</kbd>
            </div>

            {/* Mobile Logo (Visible only on mobile header) */}
            <div className="md:hidden flex items-center space-x-1.5">
              <Activity className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">EHP</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={() => navigate('/dashboard/emergency')}
              className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors relative group"
              title="Quick SOS"
            >
               <Heart className="h-5 w-5 fill-red-600" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            </button>
            <ThemeToggle />
            <div className="h-8 w-px bg-gray-100 dark:bg-slate-700 hidden md:block mx-2"></div>
            <Link to="/dashboard/profile" className="hidden md:flex items-center gap-3 group">
               <div className="text-right hidden lg:block">
                  <p className="text-xs font-black text-gray-900 dark:text-white leading-none mb-1 group-hover:text-blue-600 transition-colors">{managedMemberName}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified ID</p>
               </div>
               <ProfileAvatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-700 shadow-md group-hover:scale-105 transition-transform" />
            </Link>
            {/* Mobile Profile Link */}
            <Link to="/dashboard/profile" className="md:hidden">
              <ProfileAvatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-700 shadow-md" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 md:p-10 pb-32 md:pb-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-gray-100 dark:border-slate-700 shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {mobileBottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isSOS = item.name === 'SOS';
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all min-w-0 relative ${
                  isSOS
                    ? 'bg-red-600 text-white shadow-xl shadow-red-500/40 -mt-8 px-6 py-4'
                    : isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Icon className={`${isSOS ? 'h-7 w-7' : 'h-6 w-6'} mb-1`} />
                <span className={`text-[10px] font-black leading-none uppercase tracking-tighter ${isSOS ? 'mt-1' : ''}`}>{item.name}</span>
                {isActive && !isSOS && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default Layout;
