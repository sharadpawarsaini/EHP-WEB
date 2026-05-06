import { Shield, Mail, MessageSquare, MapPin, Send, Activity, ArrowLeft, Phone, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-zinc-950 transition-colors duration-500 overflow-x-hidden selection:bg-emerald-500/30 text-white">
      
      {/* Background Infrastructure */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
        <div className="absolute inset-0 cyber-grid opacity-[0.05]"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl border-b border-white/5 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">NEXUS EHP</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4" /> Abort Session
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            
            {/* Contact Info Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-16"
            >
              <div>
                <div className="inline-flex items-center gap-4 bg-emerald-500/10 px-8 py-3 rounded-full border border-emerald-500/20 mb-10">
                   <MessageSquare className="h-4 w-4 text-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Signal Uplink</span>
                </div>
                <h1 className="text-5xl sm:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-10 uppercase">Establish <br/> Comms.</h1>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-md italic">
                  "Establishing a direct neural link between administrative nodes and clinical operatives."
                </p>
              </div>

              <div className="space-y-10">
                {[
                  { icon: Mail, label: 'Neural Mail', val: 'sharadpawarsaini@gmail.com', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { icon: Phone, label: 'Direct Relay', val: '09:00 - 18:00 IST', color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                  { icon: Globe, label: 'Geo-Coordinates', val: 'Dehradun, Uttarakhand, IN', color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-8 group">
                    <div className={`p-6 ${item.bg} border rounded-[2rem] shadow-2xl group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-8 w-8 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">{item.label}</h4>
                      <p className="text-2xl font-black text-white tracking-tighter uppercase">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-white/5 backdrop-blur-2xl rounded-[4rem] border border-white/5 flex items-start gap-6 shadow-3xl">
                 <Shield className="h-8 w-8 text-emerald-500 flex-shrink-0" />
                 <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">
                   Transmission is shielded via Zero-Knowledge encryption. Signal tokens are processed through a decentralized relay to ensure node anonymity.
                 </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-950 p-12 sm:p-16 rounded-[5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <form className="space-y-10 relative z-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-4">Node Identity</label>
                    <input 
                      type="text" 
                      className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/5 font-bold text-white outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-800" 
                      placeholder="ENTER FULL NAME" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-4">Secure Uplink</label>
                    <input 
                      type="email" 
                      className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/5 font-bold text-white outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-800" 
                      placeholder="NODE@PROTOCOL.COM" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-4">Data Transmission</label>
                  <textarea 
                    rows={6} 
                    className="w-full p-8 rounded-[3rem] bg-white/5 border border-white/5 font-bold text-white outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-800 resize-none" 
                    placeholder="DESCRIBE OPERATIONAL REQUIREMENTS..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-8 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.6em] shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 group/btn"
                >
                  <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Dispatch Token
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-white/5 py-16 text-center">
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.6em]">&copy; {new Date().getFullYear()} NEXUS EHP GLOBAL REGISTRY • COMMUNICATION RELAY</p>
      </footer>
    </div>
  );
};

export default Contact;
