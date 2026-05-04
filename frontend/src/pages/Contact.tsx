import { Shield, Mail, MessageSquare, MapPin, Send, Activity, ArrowLeft, Phone, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500 overflow-x-hidden selection:bg-primary-500/30">
      
      {/* Immersive Background Nodes */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[80%] bg-primary-600/10 dark:bg-primary-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[70%] bg-emerald-600/10 dark:bg-emerald-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-gray-100 dark:border-white/5 bg-white/70 dark:bg-[#0A0A0A]/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary-600 p-2 rounded-xl shadow-2xl shadow-primary-600/20 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">EHP</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            
            {/* Contact Info Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div>
                <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-600/10 px-6 py-2.5 rounded-full border border-emerald-100 dark:border-emerald-600/20 mb-8">
                   <MessageSquare className="h-4 w-4 text-emerald-600" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Communication Hub</span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-8">Establish a <br/> Connection.</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md">
                  Have questions about the clinical protocol or account security? Connect with our global support nodes.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: Mail, label: 'Neural Mail', val: 'sharadpawarsaini@gmail.com', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
                  { icon: Phone, label: 'Direct Line', val: 'Available 09:00 - 18:00 IST', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                  { icon: Globe, label: 'Global Node', val: 'Dehradun, Uttarakhand, IN', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className={`p-5 ${item.bg} rounded-2xl shadow-inner group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{item.label}</h4>
                      <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 flex items-start gap-4">
                 <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                   Your communication is encrypted. Support tokens are dispatched via a secure relay to ensure patient privacy.
                 </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-white/5 backdrop-blur-3xl p-10 sm:p-12 rounded-[4rem] shadow-3xl border border-white dark:border-white/10 relative group"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <form className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Identity Name</label>
                    <input 
                      type="text" 
                      className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" 
                      placeholder="Enter Full Name" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Secure Email</label>
                    <input 
                      type="email" 
                      className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" 
                      placeholder="node@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">Transmission Data</label>
                  <textarea 
                    rows={5} 
                    className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-white/10 font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" 
                    placeholder="Describe your technical inquiry..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Send className="h-5 w-5" /> Dispatch Token
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 py-12 text-center">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} EHP GLOBAL REGISTRY • COMMUNICATION RELAY</p>
      </footer>
    </div>
  );
};

export default Contact;
