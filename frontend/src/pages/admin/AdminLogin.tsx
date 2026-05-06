import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, ChevronRight, LayoutDashboard, Database, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.role !== 'admin') {
        setError('Unauthorized Access: Admin privileges required for this node.');
        setIsLoading(false);
        return;
      }

      login(data, false);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied: Invalid Administrative Credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050505] selection:bg-amber-500/30">
      
      {/* Admin Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <div className="relative">
                <div className="w-24 h-24 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-amber-500 animate-pulse" />
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Authenticating System Administrator...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-amber-500 p-4 rounded-2xl shadow-2xl shadow-amber-500/20 mb-8 mx-auto border border-amber-400/50">
            <Database className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none uppercase">EHP <span className="text-amber-500">Admin</span> Portal</h2>
          <p className="text-[10px] font-bold text-amber-500/50 uppercase tracking-[0.4em]">Core Infrastructure Management</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] border border-white/5 p-10 sm:p-12 rounded-[2.5rem] shadow-3xl shadow-amber-500/5"
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black uppercase tracking-widest text-center text-amber-500 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                {error}
              </motion.div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Admin Identity</label>
                <div className="relative group">
                   <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ehp.global"
                    className="relative w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Root Passphrase</label>
                <div className="relative group">
                   <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="relative w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
            >
              Access Command Center <ChevronRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/20 px-2">
                <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    Secure Layer
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3" />
                    Real-time
                </div>
            </div>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Need Administrative Access? {' '}
            <Link to="/admin/register" className="text-amber-500 hover:text-amber-400 transition-colors">Register Official Node</Link>
          </p>
          <div className="mt-8">
            <Link to="/login" className="text-[9px] font-black text-white/10 hover:text-white/40 uppercase tracking-[0.4em] transition-colors">
              Return to User Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
