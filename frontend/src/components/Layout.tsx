import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Activity, ShieldAlert, FileText, QrCode, Home as HomeIcon, ClipboardList, History, Hospital, Users, MessageSquareHeart, Menu, X, Heart, Settings, Pill, Syringe, Calendar as CalendarIcon } from 'lucide-react';
import { useProfileContext } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    { name: t('nav_reports'), path: '/dashboard/reports', icon: FileText },
    { name: t('nav_contacts'), path: '/dashboard/contacts', icon: ShieldAlert },
    { name: t('nav_emergency'), path: '/dashboard/emergency', icon: QrCode },
    { name: t('nav_logs'), path: '/dashboard/logs', icon: History },
    { name: t('nav_hospitals'), path: '/dashboard/hospitals', icon: Hospital },
    { name: t('nav_vitals'), path: '/dashboard/vitals', icon: Activity },
    { name: t('nav_family'), path: '/dashboard/family', icon: Users },
    { name: 'Feedback', path: '/dashboard/feedback', icon: MessageSquareHeart },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  // Bottom nav items for mobile (most important ones)
  const mobileBottomNav = [
    { name: 'Home', path: '/dashboard', icon: HomeIcon },
    { name: 'Medical', path: '/dashboard/medical', icon: ClipboardList },
    { name: 'SOS', path: '/dashboard/emergency', icon: Heart },
    { name: 'Vitals', path: '/dashboard/vitals', icon: Activity },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const { managedMemberName } = useProfileContext();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex-col hidden md:flex transition-colors duration-300 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">EHP</span>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-full mt-3 w-fit">
            <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 truncate max-w-[120px]">{managedMemberName}</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold border border-blue-100 dark:border-blue-800/50'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={() => window.open(`${window.location.origin}/dashboard/emergency`, '_self')}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold w-full shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
          >
            <ShieldAlert className="h-5 w-5" />
            <span>Emergency SOS</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 font-medium w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>{t('nav_logout')}</span>
          </button>

          <div className="flex bg-gray-50 dark:bg-slate-900/50 p-1 rounded-xl border border-gray-100 dark:border-slate-700 mt-4">
            {['en', 'hi', 'es'].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase ${i18n.language.startsWith(lang) ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-slate-800 flex flex-col shadow-2xl overflow-y-auto">
            <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Activity className="h-7 w-7 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">EHP</span>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-full w-fit">
                <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 truncate max-w-[160px]">{managedMemberName}</span>
              </div>
            </div>

            <nav className="flex-1 px-3 space-y-1">
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
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold border border-blue-100 dark:border-blue-800/50'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 space-y-2 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => { setMobileNavOpen(false); navigate('/dashboard/emergency'); }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold w-full shadow-lg shadow-red-500/30"
              >
                <ShieldAlert className="h-5 w-5" />
                <span>Emergency SOS</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 font-medium w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>{t('nav_logout')}</span>
              </button>
              <div className="flex bg-gray-50 dark:bg-slate-900/50 p-1 rounded-xl border border-gray-100 dark:border-slate-700">
                {['en', 'hi', 'es'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase ${i18n.language.startsWith(lang) ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile top header */}
        <header className="md:hidden bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 py-3 flex justify-between items-center sticky top-0 z-40 transition-colors duration-300 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-1.5">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">EHP</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={handleLogout} className="p-2 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shadow-2xl">
        <div className="flex items-center justify-around px-2 py-1 safe-area-pb">
          {mobileBottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isSOS = item.name === 'SOS';
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all min-w-0 ${
                  isSOS
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/40 -mt-4 px-5 py-3'
                    : isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Icon className={`${isSOS ? 'h-6 w-6' : 'h-5 w-5'} mb-0.5`} />
                <span className={`text-[9px] font-bold leading-none ${isSOS ? '' : ''}`}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default Layout;
