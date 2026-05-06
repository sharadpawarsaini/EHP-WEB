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
  History as HistoryIcon, 
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
  Watch as WatchIcon,
  ChevronRight,
  ShieldCheck,
  Bell,
  Zap,
  Shield,
  EyeOff,
  Rss,
  Lock
} from 'lucide-react';
import { useProfileContext } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { getFullPhotoUrl } from '../utils/url';
import StealthBanner from './StealthBanner';
import NotificationSystem from './NotificationSystem';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, isStealthMode, user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { managedMemberName, photoUrl } = useProfileContext();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navGroups = [
    {
      title: "Core Protocol",
      items: [
        { name: t('nav_overview'), path: '/dashboard', icon: HomeIcon },
        ...(user?.role === 'admin' ? [{ name: 'Admin Console', path: '/admin', icon: ShieldCheck }] : []),
        { name: t('nav_vitals'), path: '/dashboard/vitals', icon: Activity },
        { name: t('nav_emergency'), path: '/dashboard/emergency', icon: QrCode },
        { name: t('nav_medical'), path: '/dashboard/medical', icon: ClipboardList },
        { name: 'NFC Bridge', path: '/dashboard/nfc', icon: Rss },
      ]
    },
    {
      title: "Clinical History",
      items: [
        { name: 'Medicines', path: '/dashboard/medicines', icon: Pill },
        { name: 'Vaccinations', path: '/dashboard/vaccinations', icon: Syringe },
        { name: 'Insurance', path: '/dashboard/insurance', icon: Shield },
        { name: 'Visit History', path: '/dashboard/visits', icon: HistoryIcon },
        { name: t('nav_reports'), path: '/dashboard/reports', icon: FileText },
      ]
    },
    {
      title: "Network & Management",
      items: [
        { name: 'Appointments', path: '/dashboard/appointments', icon: CalendarIcon },
        { name: t('nav_contacts'), path: '/dashboard/contacts', icon: ShieldAlert },
        { name: t('nav_family'), path: '/dashboard/family', icon: Users },
        { name: t('nav_hospitals'), path: '/dashboard/hospitals', icon: Hospital },
        { name: 'Wearables', path: '/dashboard/integrations', icon: WatchIcon },
      ]
    },
    {
      title: "System",
      items: [
        { name: 'Privacy Vault', path: '/dashboard/vault', icon: Lock },
        { name: t('nav_logs'), path: '/dashboard/logs', icon: HistoryIcon },
        { name: 'Feedback', path: '/dashboard/feedback', icon: MessageSquareHeart },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  const mobileBottomNav = [
    { name: 'Home', path: '/dashboard', icon: HomeIcon },
    { name: 'Medical History', path: '/dashboard/medical', icon: ClipboardList },
    { name: 'Insurance', path: '/dashboard/insurance', icon: Shield },
    { name: 'Hospital Visits', path: '/dashboard/visits', icon: Hospital },
    { name: 'Vitals', path: '/dashboard/vitals', icon: Activity },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];



  const ProfileAvatar = ({ className = "h-8 w-8" }: { className?: string }) => (
    <div className={`${className} rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-inner`}>
      {photoUrl ? (
        <img src={getFullPhotoUrl(photoUrl)!} alt="Profile" className="w-full h-full object-cover scale-110" />
      ) : (
        <User className="h-4 w-4 text-gray-400" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 flex font-sans selection:bg-primary-500/30 relative">
      
      {/* Minimal Background Infrastructure */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500"></div>
      </div>

      {/* ── HIGH-FIDELITY SIDEBAR ── */}
      <aside className="w-72 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 flex-col hidden md:flex transition-all duration-500 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
        
        {/* Sidebar Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-2 rounded-xl shadow-primary transition-all duration-300">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">EHP</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="relative group">
             <div className="relative flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm mb-4">
                <ProfileAvatar className="h-11 w-11 flex-shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 leading-none mb-1">Authenticated</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white truncate" title={managedMemberName}>{managedMemberName}</p>
                  {isStealthMode && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-full">
                      <EyeOff className="h-3 w-3" /> Ghost Mode
                    </span>
                  )}
                </div>
             </div>
          </div>

          <div className="flex items-center px-4 py-2 gap-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></div>
             <span className="text-xs font-medium text-zinc-500">System Online</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-10 min-h-0">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h4 className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">{group.title}</h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon as any;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-4 py-2.5 rounded-xl transition-all group ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white font-medium'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                      <span className="text-sm tracking-tight truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 space-y-3 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => navigate('/dashboard/emergency')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold w-full transition-all active:scale-95 text-sm"
          >
            <ShieldAlert className="h-5 w-5" />
            EMERGENCY SOS
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 font-semibold w-full transition-all text-sm"
          >
            <LogOut className="h-5 w-5" />
            <span>{t('nav_logout')}</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-[200] md:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-zinc-950 flex flex-col shadow-2xl overflow-y-auto overflow-x-hidden border-r border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-600 p-2 rounded-xl shadow-primary">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">EHP</span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 mt-auto">
                 <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <ProfileAvatar className="h-10 w-10 flex-shrink-0 rounded-lg" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-500 mb-0.5">Health ID</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{managedMemberName}</p>
                    </div>
                 </div>
                 <button onClick={handleLogout} className="mt-4 w-full py-3 text-center text-rose-600 font-semibold text-sm border border-rose-100 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10 rounded-xl transition-all">Sign Out</button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── COMMAND CENTER MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 relative">

        {/* Ghost Mode Banner */}
        <StealthBanner />

        {/* Header Protocol */}
        <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 px-6 md:px-8 h-16 flex justify-between items-center sticky top-0 z-[100] transition-all duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileNavOpen(true)} className="md:hidden p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="hidden md:block relative group">
               <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 w-[28rem] focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                  <Search className="h-4 w-4 text-zinc-400 mr-3" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search medical records, contacts..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                    onFocus={() => setShowResults(true)}
                    className="bg-transparent border-none focus:ring-0 text-sm w-full text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium"
                  />
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-400 shadow-sm ml-2">
                    ⌘K
                  </div>
               </div>

               <AnimatePresence>
                  {showResults && searchQuery.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setShowResults(false)}></div>
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-card z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
                         <div className="p-4 bg-zinc-50 dark:bg-zinc-900 flex justify-between items-center">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Search Results</p>
                         </div>
                         <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
                            {navGroups.flatMap(g => g.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                              navGroups.flatMap(g => g.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
                                 const Icon = item.icon as any;
                                 return (
                                   <button key={item.name} onClick={() => { navigate(item.path); setShowResults(false); setSearchQuery(''); }} className="w-full flex items-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition-colors">
                                      <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg mr-4">
                                         <Icon className="h-4 w-4" />
                                      </div>
                                      <div>
                                         <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.name}</p>
                                         <p className="text-xs text-zinc-500">Go to {item.name}</p>
                                      </div>
                                   </button>
                                 );
                              })
                            ) : (
                              <div className="p-8 text-center">
                                 <p className="text-sm text-zinc-500">No matching pages found.</p>
                              </div>
                            )}
                         </div>
                      </motion.div>
                    </>
                  )}
               </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard/emergency')} className="relative p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:scale-105 transition-all">
               <Heart className="h-5 w-5 fill-rose-600" />
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-white dark:border-zinc-950"></span>
               </span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
               {['en', 'hi'].map((lang) => (
                 <button
                   key={lang}
                   onClick={() => i18n.changeLanguage(lang)}
                   className={`px-2 py-1 rounded text-xs font-bold transition-all uppercase ${i18n.language.startsWith(lang) ? 'bg-white dark:bg-zinc-800 text-primary-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                 >
                   {lang}
                 </button>
               ))}
            </div>
            <NotificationSystem />
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 hidden sm:block"></div>
            <Link to="/dashboard/profile" className="flex items-center gap-3 group">
               <div className="text-right hidden xl:block">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none mb-1 group-hover:text-primary-600 transition-colors">{managedMemberName}</p>
                  <p className="text-xs font-semibold text-zinc-500 flex items-center justify-end gap-1.5">
                     <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified ID
                  </p>
               </div>
               <ProfileAvatar className="h-10 w-10 shadow-sm group-hover:scale-105 transition-transform border border-zinc-200 dark:border-zinc-700" />
            </Link>
          </div>
        </header>

        {/* Content Shell */}
        <div className="flex-1 overflow-auto p-6 md:p-8 lg:p-10 pb-32 md:pb-12 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* ── MOBILE COMMAND NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[150] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 shadow-3xl">
        <div className="flex items-center justify-around px-4 py-3 safe-area-pb">
          {mobileBottomNav.map((item) => {
            const Icon = item.icon as any;
            const isActive = location.pathname === item.path;
            const isSOS = item.name === 'SOS';
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all relative ${
                  isSOS ? 'bg-rose-600 text-white shadow-2xl shadow-rose-600/40 -mt-10 px-8 py-5 rounded-[2.5rem]' : isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <Icon className={`${isSOS ? 'h-8 w-8' : 'h-6 w-6'} mb-1.5`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
                {isActive && !isSOS && (
                  <motion.div layoutId="mobile-active" className="absolute -bottom-1 w-1 h-1 bg-primary-600 rounded-full" />
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
