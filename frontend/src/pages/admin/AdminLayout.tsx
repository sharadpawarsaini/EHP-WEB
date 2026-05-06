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
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { icon: MessageSquare, label: 'Feedback', path: '/admin/feedback' },
    { icon: ShieldAlert, label: 'SOS Monitor', path: '/admin/sos' },
    { icon: Clock, label: 'Audit Logs', path: '/admin/logs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-300">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-slate-800 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">EHP Admin</h1>
              <p className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase">Console v1.0</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 rounded-2xl transition-all group
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-3 pt-6 border-t border-slate-800">
            <NavLink 
              to="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-2xl transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">User Dashboard</span>
            </NavLink>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-slate-800 bg-[#0a0a0a]/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500 w-5 h-5" />
            <span className="font-bold text-white">EHP Admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
            <span className="text-xs font-bold text-emerald-500">AD</span>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
