import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Activity, ShieldAlert, FileText, QrCode, Home as HomeIcon, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: HomeIcon },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Medical Info', path: '/dashboard/medical', icon: ClipboardList },
    { name: 'Medical Reports', path: '/dashboard/reports', icon: FileText },
    { name: 'Contacts', path: '/dashboard/contacts', icon: ShieldAlert },
    { name: 'Emergency Link', path: '/dashboard/emergency', icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col hidden md:flex transition-colors duration-300">
        <div className="p-6 flex items-center space-x-2">
          <Activity className="h-8 w-8 text-emergency" />
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">EHP</span>
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

        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-medium w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </button>
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
