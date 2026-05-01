import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, ShieldCheck, UserPlus, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [bloodGroup, setBloodGroup] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignup = async () => {
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
        setError('Identity generation failed. Please try again.');
        setIsGoogleLoading(false);
      }
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { 
        email, password, fullName, dob, gender, bloodGroup 
      });
      navigate('/verify-otp', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Protocol Failure: Account Generation Refused');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-[#0A0A0A] transition-colors duration-500 selection:bg-blue-500/30">
      
      {/* Immersive Background Nodes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[80%] bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[70%] bg-emerald-600/10 dark:bg-emerald-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <AnimatePresence>
        {isGoogleLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-white">Generating Global Passport Node...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-colors group z-50">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Portal Home</span>
      </Link>

      <div className="max-w-xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 p-3 rounded-2xl shadow-2xl shadow-blue-600/20 mb-8 mx-auto">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 leading-none">Identity <br/> Initialization.</h2>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">Deploy Your Secure Health Node</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-white/5 backdrop-blur-3xl p-10 sm:p-12 rounded-[3.5rem] shadow-3xl border border-white dark:border-white/10"
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black uppercase tracking-widest text-center text-rose-600 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800/30">
                {error}
              </motion.div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Legal Identity Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-2xl font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Temporal Birth Point</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-2xl font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Gender Node</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-2xl font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Blood Node</label>
                  <select
                    required
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-2xl font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  >
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Identity Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="node@ehp.global"
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-2xl font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Secure Passphrase</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-2xl font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
            >
              Deploy Secure Passport <ChevronRight className="h-4 w-4" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#0A0A0A] text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Protocol Bridge</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 py-5 rounded-[1.5rem] flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-50 transition-all active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Initialize via Google</span>
            </button>
          </form>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
        >
          Already Synchronized? {' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 transition-colors">Establish Session</Link>
        </motion.p>
      </div>
    </div>
  );
};

export default Register;
