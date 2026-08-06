import { Shield, Mail, MessageSquare, MapPin, Send, Activity, ArrowLeft, Phone, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-500 overflow-x-hidden text-slate-900 dark:text-white">
      
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-sky-400/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl border-b border-blue-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-sky-400 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">EHP</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
            <ArrowLeft className="h-4 w-4" /> Go to Home
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div>
                <div className="inline-flex items-center gap-3 bg-blue-500/10 px-6 py-2.5 rounded-full border border-blue-500/20 mb-8">
                   <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                   <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Get in Touch</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">Contact Our Support Team</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                  Have questions about your Electronic Health Passport? We are here to help you 24/7.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-slate-800 shadow-sm">
                   <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-600 dark:text-blue-400">
                      <Mail className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Us</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">support@ehp-app.com</p>
                   </div>
                </div>

                <div className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-slate-800 shadow-sm">
                   <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <Phone className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Emergency Helpline</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">+1 (800) 555-EHP-HELP</p>
                   </div>
                </div>

                <div className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-slate-800 shadow-sm">
                   <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20 text-sky-600 dark:text-sky-400">
                      <MapPin className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headquarters</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">Global Health Center, NY</p>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[3rem] border border-blue-100 dark:border-slate-800 shadow-2xl space-y-8"
            >
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Send Us a Message</h3>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your message has been sent.'); }}>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Your Full Name</label>
                    <input type="text" required placeholder="John Doe" className="health-input" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Your Email</label>
                    <input type="email" required placeholder="name@example.com" className="health-input" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                    <textarea rows={5} required placeholder="How can we help you today?" className="health-input resize-none"></textarea>
                 </div>

                 <button type="submit" className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider">
                    Send Message <Send className="h-4 w-4 ml-2" />
                 </button>
              </form>
            </motion.div>

          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-blue-100 dark:border-slate-800 py-12 text-center">
         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">&copy; {new Date().getFullYear()} EHP ELECTRONIC HEALTH PASSPORT</p>
      </footer>
    </div>
  );
};

export default Contact;
