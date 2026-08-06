import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, UserPlus, Mail, Lock, ChevronRight, Calendar, User, Heart } from 'lucide-react';
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
        setError('Google signup failed. Please try again.');
        setIsGoogleLoading(false);
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { 
        email, password, fullName, dob, gender, bloodGroup 
      });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not create account. Please check your information and try again.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-500">
      
      {/* Background soft glowing accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-400/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <AnimatePresence>
        {isGoogleLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin shadow-lg"></div>
            <p className="mt-6 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Creating your account...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-all group z-50 uppercase tracking-widest">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Go to Home</span>
      </Link>

      <div className="max-w-2xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-sky-400 rounded-[2rem] shadow-xl shadow-blue-500/25 mb-6 mx-auto group hover:scale-105 transition-transform">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Create Your Account</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Join EHP and secure your medical health passport</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-blue-100 dark:border-slate-800 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs font-bold text-center text-rose-600 bg-rose-50 dark:bg-rose-900/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800">
                {error}
              </motion.div>
            )}
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="health-input pr-12"
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="health-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="health-input cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Blood Group</label>
                  <select
                    required
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="health-input cursor-pointer"
                  >
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="health-input pr-12"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="health-input pr-12"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider"
            >
              Create Account <ChevronRight className="h-5 w-5" />
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-4 bg-white dark:bg-slate-900 text-slate-400 font-bold">OR</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-xs font-semibold text-slate-500">
            Already have an account? {' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold underline ml-1">Log In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
