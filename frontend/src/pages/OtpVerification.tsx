import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Mail, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification Failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const { data } = await api.post('/auth/resend-otp', { email });
      setSuccessMsg(data.message || 'OTP resent successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-[#0A0A0A] transition-colors duration-500 selection:bg-blue-500/30">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[80%] bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[70%] bg-emerald-600/10 dark:bg-emerald-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <Link to="/login" className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-colors group z-50">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Login</span>
      </Link>

      <div className="max-w-md w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-blue-600 p-3 rounded-2xl shadow-2xl shadow-blue-600/20 mb-8 mx-auto">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 leading-none">Verify <br/> Identity.</h2>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">Enter 6-digit Code</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 dark:bg-white/5 backdrop-blur-3xl p-10 sm:p-12 rounded-[3.5rem] shadow-3xl border border-white dark:border-white/10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black uppercase tracking-widest text-center text-rose-600 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800/30">
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black uppercase tracking-widest text-center text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                {successMsg}
              </motion.div>
            )}
            
            <div className="space-y-6">
              <div className="text-center text-xs font-bold text-gray-500">
                Code sent to: <span className="text-blue-600 dark:text-blue-400">{email}</span>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Verification Code</label>
                <div className="relative group">
                   <div className="absolute inset-0 bg-blue-600/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                   <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="relative w-full px-6 py-5 bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 rounded-2xl font-black text-center text-2xl tracking-[0.5em] text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 disabled:opacity-50 hover:bg-blue-500 text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? 'Verifying...' : 'Verify Node'} <ChevronRight className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={handleResend}
              className="w-full bg-transparent py-5 rounded-[1.5rem] flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
            >
              <Mail className="h-4 w-4" /> Resend Code
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OtpVerification;
