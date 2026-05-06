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
  Send
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
    { icon: Send, label: 'Communications', path: '/admin/communication' },
    { icon: ShieldAlert, label: 'SOS Monitor', path: '/admin/sos' },
    { icon: Clock, label: 'Audit Logs', path: '/admin/logs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-300 relative overflow-hidden">
      {/* Cyberpunk Background Effects for Entire Layout */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-20"></div>
      <div className="absolute inset-0 scanline pointer-events-none z-0 opacity-50"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950/80 backdrop-blur-2xl border-r border-white/10 transition-transform duration-300 transform shadow-[5px_0_30px_rgba(0,0,0,0.5)]
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
                  flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent hover:border-white/10 hover:shadow-lg'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
            <NavLink 
              to="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-2xl transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <Home className="w-5 h-5 relative z-10 group-hover:text-cyan-400 transition-colors" />
              <span className="font-medium relative z-10">User Dashboard</span>
            </NavLink>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <LogOut className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
              <span className="font-medium relative z-10">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-white/10 bg-zinc-950/80 backdrop-blur-2xl px-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500 w-5 h-5 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">NEXUS COMMAND</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="text-xs font-black text-emerald-400">AD</span>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto relative z-10">
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
