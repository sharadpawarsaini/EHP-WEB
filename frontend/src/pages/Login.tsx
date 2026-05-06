import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, ShieldCheck, Lock, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setTimeout(async () => {
      try {
        const { data } = await api.post('/auth/login', { 
          email: 'demo@ehp.com', 
          password: 'password123' 
        });
        login(data);
        navigate('/dashboard');
      } catch (err) {
        setError('Identity synchronization failed. Please try again.');
        setIsGoogleLoading(false);
      }
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Stealth Mode Trigger: If password is 'safety123', log in to demo account with stealth flag
    if (password === 'safety123') {
      try {
        const { data } = await api.post('/auth/login', { 
          email: 'demo@ehp.com', 
          password: 'password123' 
        });
        login(data, true); // true = stealth mode
        navigate('/dashboard');
        return;
      } catch (err) {
        setError('Stealth synchronization failed.');
        return;
      }
    }

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data, false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied: Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-zinc-950 transition-colors duration-500">
      
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      </div>

      <AnimatePresence>
        {isGoogleLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
            <p className="mt-8 text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Establishing Neural Uplink...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/" className="absolute top-10 left-10 flex items-center gap-3 text-[10px] font-black text-zinc-500 hover:text-white transition-all group z-50 uppercase tracking-[0.3em]">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
        <span>Abort Session</span>
      </Link>

      <div className="max-w-xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl mb-8 mx-auto group hover:scale-110 transition-transform">
            <Activity className="h-10 w-10 text-emerald-500 group-hover:animate-pulse" />
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">Node Enrollment</h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Synchronize clinical identity with the Nexus Archive</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 sm:p-16 rounded-[4rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <form className="space-y-10 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black text-center text-rose-500 bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20 uppercase tracking-widest shadow-inner">
                {error}
              </motion.div>
            )}
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Digital Designation</label>
                <div className="relative group/input">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@nexus.com"
                    className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none text-white font-bold transition-all shadow-inner placeholder:text-zinc-700"
                  />
                  <ShieldCheck className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-800 group-focus-within/input:text-emerald-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Access Key</label>
                <div className="relative group/input">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none text-white font-bold transition-all shadow-inner placeholder:text-zinc-700"
                  />
                  <Lock className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-800 group-focus-within/input:text-emerald-500 transition-colors" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-7 bg-white text-zinc-950 font-black rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Initialize Sync <ChevronRight className="h-5 w-5" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-6 bg-zinc-950/20 backdrop-blur-xl text-zinc-600 font-black uppercase tracking-[0.3em]">Alternate Uplink</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 group/google"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Neural Node (Google)</span>
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
            New Subject? {' '}
            <Link to="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors ml-2 underline underline-offset-8">Register New Node</Link>
          </p>
          <div className="mt-10 pt-10 border-t border-white/5">
            <Link to="/admin/login" className="text-[9px] font-black text-zinc-700 hover:text-emerald-500 transition-all uppercase tracking-[0.5em]">Restricted: Command Center Login</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );

};

export default Login;
