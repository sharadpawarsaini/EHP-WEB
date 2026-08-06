import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck,
  Home,
  TrendingUp,
  Clock,
  Send,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Radio, label: 'Cyber Security SOC', path: '/admin/cyber-activity' },
    { icon: Users, label: 'User Directory', path: '/admin/users' },
    { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { icon: MessageSquare, label: 'Feedback', path: '/admin/feedback' },
    { icon: Send, label: 'Communications', path: '/admin/communication' },
    { icon: ShieldAlert, label: 'SOS Emergency Monitor', path: '/admin/sos' },
    { icon: Clock, label: 'Audit Logs', path: '/admin/logs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex text-slate-900 dark:text-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-sky-400/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-r border-blue-100 dark:border-slate-800 transition-transform duration-300 transform shadow-lg
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">EHP Admin</h1>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group text-sm font-semibold
                  ${isActive 
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/20 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-slate-400" />
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-2 pt-6 border-t border-blue-100 dark:border-slate-800">
            <NavLink 
              to="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-2xl text-sm font-semibold transition-all"
            >
              <Home className="w-5 h-5 text-blue-600" />
              <span>User App</span>
            </NavLink>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl text-sm font-bold transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-blue-100 dark:border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600 w-6 h-6" />
            <span className="font-bold text-slate-900 dark:text-white">EHP Admin</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
