import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserPlus, ChevronRight, Database, Server, Cpu } from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminToken: '' // Secret token for admin registration
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('System Conflict: Passphrases do not match.');
      setIsLoading(false);
      return;
    }

    try {
      // Assuming the backend register route can handle a role or we have a special admin register route
      // For now, we'll try to register as a normal user and the user might need to be promoted
      // OR we send a special admin token
      await api.post('/auth/register', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        role: 'admin',
        adminToken: formData.adminToken 
      });
      
      navigate('/admin/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration Failed: Unauthorized protocol.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050505] selection:bg-amber-500/30">
      
      {/* Admin Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
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
                <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-amber-500 animate-pulse" />
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Initializing Admin Node...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 mb-6 mx-auto">
            <UserPlus className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2 uppercase">Official <span className="text-amber-500">Node</span> Enrollment</h2>
          <p className="text-[10px] font-bold text-amber-500/50 uppercase tracking-[0.4em]">Administrative Level Clearance</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-10 rounded-[2.5rem] shadow-3xl shadow-amber-500/5"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black uppercase tracking-widest text-center text-amber-500 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                {error}
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Full Designation</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-xs"
                  placeholder="System Admin 01"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Admin Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-xs"
                  placeholder="admin@ehp.global"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Passphrase</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-xs"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Verify</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-xs"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-2">Clearance Token (Optional)</label>
                <input
                  type="text"
                  value={formData.adminToken}
                  onChange={(e) => setFormData({...formData, adminToken: e.target.value})}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-amber-500 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-xs"
                  placeholder="X-ADMIN-SECURE-KEY"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 mt-4"
            >
              Finalize Enrollment <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Already have clearance? {' '}
            <Link to="/admin/login" className="text-amber-500 hover:text-amber-400 transition-colors">Sign in to Node</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRegister;
