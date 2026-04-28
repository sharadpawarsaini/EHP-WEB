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
  Watch as WatchIcon,
  ChevronRight,
  ShieldCheck,
  Bell,
  Zap
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
        { name: t('nav_vitals'), path: '/dashboard/vitals', icon: Activity },
        { name: t('nav_emergency'), path: '/dashboard/emergency', icon: QrCode },
        { name: t('nav_medical'), path: '/dashboard/medical', icon: ClipboardList },
      ]
    },
    {
      title: "Clinical History",
      items: [
        { name: 'Medicines', path: '/dashboard/medicines', icon: Pill },
        { name: 'Vaccinations', path: '/dashboard/vaccinations', icon: Syringe },
        { name: 'Visit History', path: '/dashboard/visits', icon: History },
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
        { name: t('nav_logs'), path: '/dashboard/logs', icon: History },
        { name: 'Feedback', path: '/dashboard/feedback', icon: MessageSquareHeart },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
      ]
    }
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
    <div className={`${className} rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-inner`}>
      {photoUrl ? (
        <img src={getFullPhotoUrl(photoUrl)!} alt="Profile" className="w-full h-full object-cover scale-110" />
      ) : (
        <User className="h-4 w-4 text-gray-400" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 flex font-sans selection:bg-blue-500/30 relative">
      
      {/* Premium Theme Background Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block">
         <div className="absolute top-0 left-0 w-full h-full bg-[#050505]"></div>
         <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/5 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      {/* ── HIGH-FIDELITY SIDEBAR ── */}
      <aside className="w-72 bg-gray-50/50 dark:bg-[#0A0A0A] border-r border-gray-100 dark:border-white/5 flex-col hidden md:flex transition-all duration-500 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
        
        {/* Sidebar Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-blue-600 rounded-xl shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">EHP</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="relative group">
             <div className="absolute inset-0 bg-blue-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative flex items-center gap-4 p-4 bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white dark:border-white/10 shadow-xl mb-4">
                <ProfileAvatar className="h-12 w-12 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white truncate" title={managedMemberName}>{managedMemberName}</p>
                </div>
             </div>
          </div>

          <div className="flex items-center px-4 py-2 gap-3 mb-6">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Node Online</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-10">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h4 className="px-4 text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-4">{group.title}</h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon as any;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-4 py-3.5 rounded-[1.25rem] transition-all group relative ${
                        isActive
                          ? 'bg-blue-600 text-white font-black shadow-2xl shadow-blue-600/30 translate-x-1'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon className={`mr-4 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600'}`} />
                      <span className="text-xs font-bold tracking-tight truncate">{item.name}</span>
                      {isActive && (
                         <motion.div layoutId="sidebar-active" className="absolute left-[-1rem] w-1.5 h-8 bg-blue-600 rounded-r-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 space-y-3 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => navigate('/dashboard/emergency')}
            className="flex items-center justify-center gap-3 px-4 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-[1.5rem] font-black w-full shadow-2xl shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-95 text-[10px] uppercase tracking-widest"
          >
            <ShieldAlert className="h-5 w-5" />
            EMERGENCY SOS
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 font-bold w-full transition-all group text-xs"
          >
            <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span>{t('nav_logout')}</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-[200] md:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={() => setMobileNavOpen(false)} />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-[#0A0A0A] flex flex-col shadow-3xl overflow-y-auto overflow-x-hidden border-r border-white/10"
            >
              <div className="p-8 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">EHP</span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                 <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10">
                    <ProfileAvatar className="h-12 w-12 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Health ID</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white truncate">{managedMemberName}</p>
                    </div>
                 </div>
              </div>

              <nav className="flex-1 px-4 space-y-8 pb-10">
                {navGroups.map((group) => (
                  <div key={group.title} className="space-y-4">
                     <h4 className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">{group.title}</h4>
                     <div className="space-y-1">
                        {group.items.map((item) => {
                           const Icon = item.icon as any;
                           const isActive = location.pathname === item.path;
                           return (
                             <Link
                               key={item.name}
                               to={item.path}
                               onClick={() => setMobileNavOpen(false)}
                               className={`flex items-center px-4 py-4 rounded-2xl transition-all ${
                                 isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50'
                               }`}
                             >
                               <Icon className={`mr-4 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                               <span className="text-sm font-bold">{item.name}</span>
                             </Link>
                           );
                        })}
                     </div>
                  </div>
                ))}
              </nav>

              <div className="p-8 border-t border-gray-100 dark:border-white/5">
                 <button onClick={handleLogout} className="w-full py-4 text-center text-rose-600 font-black uppercase tracking-widest text-[10px] border border-rose-600/20 rounded-2xl">Initialize Logout</button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── COMMAND CENTER MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header Protocol */}
        <header className="bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 px-6 md:px-12 h-20 flex justify-between items-center sticky top-0 z-[100] transition-all duration-500">
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileNavOpen(true)} className="md:hidden p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="hidden md:block relative group">
               <div className="flex items-center bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-2.5 w-[32rem] focus-within:ring-8 focus-within:ring-blue-600/5 focus-within:border-blue-600/30 transition-all">
                  <Search className="h-4 w-4 text-gray-400 mr-4" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search medical records, telemetry, SOS..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                    onFocus={() => setShowResults(true)}
                    className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-900 dark:text-white placeholder:text-gray-400 font-bold"
                  />
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[9px] font-black text-gray-400 shadow-sm">
                    <Zap className="h-3 w-3" /> ⌘K
                  </div>
               </div>

               <AnimatePresence>
                  {showResults && searchQuery.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setShowResults(false)}></div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-3xl z-50 overflow-hidden divide-y divide-gray-100 dark:divide-white/5">
                         <div className="p-6 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Neural Search Protocol</p>
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full uppercase">Active</span>
                         </div>
                         <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
                            {navGroups.flatMap(g => g.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                              navGroups.flatMap(g => g.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
                                 const Icon = item.icon as any;
                                 return (
                                   <button key={item.name} onClick={() => { navigate(item.path); setShowResults(false); setSearchQuery(''); }} className="w-full flex items-center p-6 hover:bg-gray-50 dark:hover:bg-white/5 text-left group transition-all">
                                      <div className="p-3 bg-gray-100 dark:bg-[#050505] rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all mr-5">
                                         <Icon className="h-5 w-5" />
                                      </div>
                                      <div>
                                         <p className="text-sm font-black text-gray-900 dark:text-white">{item.name}</p>
                                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Navigate to {item.name} Protocol</p>
                                      </div>
                                      <ChevronRight className="ml-auto h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                   </button>
                                 );
                              })
                            ) : (
                              <div className="p-16 text-center">
                                 <p className="text-sm font-bold text-gray-400 italic">No matching protocols identified.</p>
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
            <button onClick={() => navigate('/dashboard/emergency')} className="relative p-3 rounded-2xl bg-rose-50 dark:bg-rose-600/10 text-rose-600 hover:scale-110 transition-all group shadow-xl shadow-rose-600/5">
               <Heart className="h-6 w-6 fill-rose-600" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 rounded-full border-2 border-white dark:border-[#0A0A0A] animate-ping"></span>
            </button>
            <div className="hidden sm:flex items-center gap-3">
               <button className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
               </button>
            </div>
            <div className="h-8 w-px bg-gray-100 dark:border-white/5 mx-2 hidden sm:block"></div>
            <Link to="/dashboard/profile" className="flex items-center gap-4 group">
               <div className="text-right hidden xl:block">
                  <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1 group-hover:text-blue-600 transition-colors">{managedMemberName}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-end gap-1.5">
                     <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified ID
                  </p>
               </div>
               <ProfileAvatar className="h-12 w-12 shadow-2xl group-hover:scale-105 transition-transform border-2 border-white dark:border-white/10" />
            </Link>
          </div>
        </header>

        {/* Content Shell */}
        <div className="flex-1 overflow-auto p-6 md:p-12 pb-32 md:pb-12 bg-white dark:bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
               <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {children}
               </motion.div>
            </AnimatePresence>
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
                  isSOS ? 'bg-rose-600 text-white shadow-2xl shadow-rose-600/40 -mt-10 px-8 py-5 rounded-[2.5rem]' : isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <Icon className={`${isSOS ? 'h-8 w-8' : 'h-6 w-6'} mb-1.5`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
                {isActive && !isSOS && (
                  <motion.div layoutId="mobile-active" className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
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
