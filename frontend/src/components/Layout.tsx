import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Activity, ShieldAlert, FileText, QrCode, Home as HomeIcon, ClipboardList, History, Hospital, Users } from 'lucide-react';
import { useProfileContext } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: t('nav_overview'), path: '/dashboard', icon: HomeIcon },
    { name: t('nav_profile'), path: '/dashboard/profile', icon: User },
    { name: t('nav_medical'), path: '/dashboard/medical', icon: ClipboardList },
    { name: t('nav_reports'), path: '/dashboard/reports', icon: FileText },
    { name: t('nav_contacts'), path: '/dashboard/contacts', icon: ShieldAlert },
    { name: t('nav_emergency'), path: '/dashboard/emergency', icon: QrCode },
    { name: t('nav_logs'), path: '/dashboard/logs', icon: History },
    { name: t('nav_hospitals'), path: '/dashboard/hospitals', icon: Hospital },
    { name: t('nav_family'), path: '/dashboard/family', icon: Users },
  ];

  const { managedMemberName } = useProfileContext();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col hidden md:flex transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-emergency" />
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">EHP</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-full mt-3 w-fit">
            <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 truncate max-w-[120px]">{managedMemberName}</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
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
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                {item.name}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="md:hidden bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 p-4 flex justify-between items-center transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-emergency" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">EHP</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400">
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
