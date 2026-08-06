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
      title: "My Health",
      items: [
        { name: t('nav_overview'), path: '/dashboard', icon: HomeIcon },
        ...(user?.role === 'admin' ? [{ name: 'Admin Panel', path: '/admin', icon: ShieldCheck }] : []),
        { name: t('nav_vitals'), path: '/dashboard/vitals', icon: Activity },
        { name: t('nav_emergency'), path: '/dashboard/emergency', icon: QrCode },
        { name: t('nav_medical'), path: '/dashboard/medical', icon: ClipboardList },
        { name: 'NFC Card', path: '/dashboard/nfc', icon: Rss },
      ]
    },
    {
      title: "Medical Records",
      items: [
        { name: 'Medicines', path: '/dashboard/medicines', icon: Pill },
        { name: 'Vaccinations', path: '/dashboard/vaccinations', icon: Syringe },
        { name: 'Insurance', path: '/dashboard/insurance', icon: Shield },
        { name: 'Visit History', path: '/dashboard/visits', icon: HistoryIcon },
        { name: t('nav_reports'), path: '/dashboard/reports', icon: FileText },
      ]
    },
    {
      title: "People & Places",
      items: [
        { name: 'Appointments', path: '/dashboard/appointments', icon: CalendarIcon },
        { name: t('nav_contacts'), path: '/dashboard/contacts', icon: ShieldAlert },
        { name: t('nav_family'), path: '/dashboard/family', icon: Users },
        { name: t('nav_hospitals'), path: '/dashboard/hospitals', icon: Hospital },
        { name: 'Wearables', path: '/dashboard/integrations', icon: WatchIcon },
      ]
    },
    {
      title: "Account",
      items: [
        { name: 'Private Vault', path: '/dashboard/vault', icon: Lock },
        { name: t('nav_logs'), path: '/dashboard/logs', icon: HistoryIcon },
        { name: 'Feedback', path: '/dashboard/feedback', icon: MessageSquareHeart },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  const ProfileAvatar = ({ className = "h-8 w-8" }: { className?: string }) => (
    <div className={`${className} rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-blue-200 dark:border-slate-700 shadow-inner`}>
      {photoUrl ? (
        <img src={getFullPhotoUrl(photoUrl)!} alt="Profile" className="w-full h-full object-cover scale-110" />
      ) : (
        <User className="h-4 w-4 text-slate-400" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-500 flex font-sans selection:bg-blue-500/30 relative text-slate-900 dark:text-white">
      
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-400/10 blur-[120px] rounded-full"></div>
      </div>

      {/* ── WHITE & SKY-BLUE SIDEBAR ── */}
      <aside className="w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-r border-blue-100 dark:border-slate-800 flex-col hidden md:flex transition-all duration-500 flex-shrink-0 sticky top-0 h-screen overflow-hidden z-50 shadow-sm">
        
        {/* Sidebar Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-sky-500 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white block leading-none">EHP</span>
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Health Passport</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          <div className="relative group">
             <div className="relative flex items-center gap-4 p-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm mb-4">
                <ProfileAvatar className="h-11 w-11 flex-shrink-0 rounded-2xl ring-2 ring-blue-500/20 shadow-md" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={managedMemberName}>{managedMemberName}</p>
                  {isStealthMode && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase rounded-full border border-amber-500/20">
                      <EyeOff className="h-3 w-3" /> Ghost Mode
                    </span>
                  )}
                </div>
             </div>
          </div>

          <div className="flex items-center px-4 py-2 gap-2 mb-4">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Online</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar pb-10 min-h-0">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h4 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{group.title}</h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon as any;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group text-sm font-semibold ${
                        isActive
                          ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/20 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-all ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-600 group-hover:scale-110'}`} />
                      <span className="text-xs font-bold uppercase tracking-wider truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 space-y-3 bg-white dark:bg-slate-900 border-t border-blue-100 dark:border-slate-800">
          <button
            onClick={() => navigate('/dashboard/emergency')}
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest w-full transition-all active:scale-95 shadow-md shadow-rose-600/20"
          >
            <ShieldAlert className="h-5 w-5 animate-pulse" />
            EMERGENCY SOS
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600 font-bold text-xs uppercase tracking-widest w-full transition-all"
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 flex flex-col shadow-2xl overflow-y-auto overflow-x-hidden border-r border-blue-100 dark:border-slate-800"
            >
              <div className="p-6 flex items-center justify-between border-b border-blue-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-600 to-sky-500 p-2 rounded-xl text-white">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EHP</span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 border-t border-blue-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 mt-auto">
                 <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm">
                    <ProfileAvatar className="h-10 w-10 flex-shrink-0 rounded-lg" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-500 mb-0.5">Health ID</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{managedMemberName}</p>
                    </div>
                 </div>
                 <button onClick={handleLogout} className="mt-4 w-full py-3 text-center text-rose-600 font-bold text-xs uppercase tracking-widest border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/20 rounded-2xl transition-all">Sign Out</button>
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
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-blue-100 dark:border-slate-800 px-6 md:px-8 h-20 flex justify-between items-center sticky top-0 z-[100] transition-all duration-300">
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileNavOpen(true)} className="md:hidden p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="hidden md:block relative group">
               <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 backdrop-blur-md border border-blue-200/80 dark:border-slate-700 rounded-2xl px-5 py-2.5 w-[28rem] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                  <Search className="h-4 w-4 text-slate-400 mr-3" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search medical records, contacts..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                    onFocus={() => setShowResults(true)}
                    className="bg-transparent border-none focus:ring-0 text-xs w-full text-slate-900 dark:text-white placeholder:text-slate-400 font-medium outline-none"
                  />
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-400 shadow-sm ml-2">
                    ⌘K
                  </div>
               </div>

               <AnimatePresence>
                  {showResults && searchQuery.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setShowResults(false)}></div>
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                         <div className="p-4 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Results</p>
                         </div>
                         <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
                            {navGroups.flatMap(g => g.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                              navGroups.flatMap(g => g.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
                                 const Icon = item.icon as any;
                                 return (
                                   <button key={item.name} onClick={() => { navigate(item.path); setShowResults(false); setSearchQuery(''); }} className="w-full flex items-center p-4 hover:bg-blue-50/50 dark:hover:bg-slate-800 text-left transition-colors">
                                      <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl mr-4">
                                         <Icon className="h-4 w-4" />
                                      </div>
                                      <div>
                                         <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                                         <p className="text-xs text-slate-500">Go to {item.name}</p>
                                      </div>
                                   </button>
                                 );
                              })
                            ) : (
                              <div className="p-8 text-center">
                                 <p className="text-sm text-slate-500">No matching pages found.</p>
                              </div>
                            )}
                         </div>
                      </motion.div>
                    </>
                  )}
               </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard/emergency')} className="relative p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:scale-105 transition-all">
               <Heart className="h-5 w-5 fill-rose-600" />
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-white dark:border-slate-900"></span>
               </span>
            </button>
            
            <NotificationSystem />

            <div className="hidden sm:flex items-center gap-3 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
               <ProfileAvatar className="h-9 w-9 rounded-xl" />
               <div className="pr-2">
                 <span className="text-xs font-bold text-slate-900 dark:text-white block leading-none">{managedMemberName}</span>
                 <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                   <ShieldCheck className="w-3 h-3" /> Verified
                 </span>
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Workspace */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
