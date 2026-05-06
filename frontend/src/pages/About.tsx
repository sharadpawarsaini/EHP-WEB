import { motion } from 'framer-motion';
import { Shield, Users, Heart, CheckCircle, ArrowLeft, Activity, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
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
            <ArrowLeft className="h-4 w-4" /> Abort View
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-32">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Mission Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-32"
          >
            <div className="inline-flex items-center gap-4 bg-emerald-500/10 px-8 py-3 rounded-full border border-emerald-500/20 mb-10">
               <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">The Nexus Protocol</span>
            </div>
            <h1 className="text-5xl sm:text-8xl font-black text-white mb-10 tracking-[1px] leading-[0.9] uppercase">
              Securing Humanity <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">At Any Depth.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-400 leading-relaxed max-w-3xl mx-auto font-medium italic">
              "EHP is a mission-critical synchronization platform designed to preserve clinical identity when seconds define survival."
            </p>
          </motion.div>

          {/* Core Pillars */}
          <div className="grid md:grid-cols-2 gap-10 mb-32">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 group transition-all shadow-3xl"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                 <Users className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Family Nodes</h3>
              <p className="text-zinc-500 font-medium leading-relaxed italic">
                Guardians can initialize and manage the clinical designation of their entire lineage within one high-trust administrative dashboard.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 group transition-all shadow-3xl"
            >
              <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-10 border border-rose-500/20 group-hover:scale-110 transition-transform">
                 <Heart className="h-10 w-10 text-rose-500" />
              </div>
              <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Responder Uplink</h3>
              <p className="text-zinc-500 font-medium leading-relaxed italic">
                By providing sub-second access to blood groups and allergies, we empower first responders with instant, life-critical telemetry.
              </p>
            </motion.div>
          </div>

          {/* Clinical Excellence */}
          <div className="bg-zinc-950 border border-white/10 rounded-[5rem] p-12 sm:p-24 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
             <div className="absolute top-0 right-0 p-20 opacity-5">
                <ShieldCheck className="h-[30rem] w-[30rem] text-white" />
             </div>
             <div className="relative z-10">
                <h2 className="text-5xl font-black text-white text-center mb-24 tracking-[1px] uppercase">Nexus Architecture</h2>
                <div className="grid sm:grid-cols-3 gap-16">
                  {[
                    { icon: Lock, title: "Sovereign Privacy", desc: "Data is shielded using MIL-spec protocols. You maintain absolute control over clinical visibility." },
                    { icon: Activity, title: "Neural Analysis", desc: "Advanced summarization of complex clinical telemetry into clear, actionable responder intel." },
                    { icon: Globe, title: "Grid Synergy", desc: "Your clinical identity works across all borders, unified through a single secure node." }
                  ].map((item, i) => {
                    const Icon = item.icon as any;
                    return (
                      <div key={i} className="text-center space-y-8">
                         <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto border border-white/10 group-hover:glow-border transition-all">
                            <Icon className="h-10 w-10 text-emerald-500" />
                         </div>
                         <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{item.title}</h4>
                         <p className="text-zinc-500 font-medium leading-relaxed text-sm italic">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>

          {/* Operational Standard */}
          <div className="mt-40 space-y-16">
             <div className="text-center space-y-6">
                <h2 className="text-5xl font-black text-white uppercase tracking-[1px]">Clinical Protocols</h2>
                <p className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.8em]">Operational Stack: Integrated</p>
             </div>
             <div className="grid gap-8">
                {[
                  { title: "Immutable Registry", desc: "Ensuring all clinical records are verified and audit-trailed for absolute integrity." },
                  { title: "SOS Bridge Protocol", desc: "Direct node connection between patient QR scans and emergency guardian alert systems." },
                  { title: "Global Compliance", desc: "Adhering to high-trust clinical data standards for seamless institutional integration." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-10 p-10 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/5 hover:border-emerald-500/30 transition-all group shadow-2xl">
                     <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform border border-white/10">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{item.title}</h4>
                        <p className="text-sm text-zinc-500 font-medium italic">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-white/5 py-16 text-center">
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.6em]">&copy; {new Date().getFullYear()} NEXUS EHP GLOBAL REGISTRY • MISSION CONTROL</p>
      </footer>
    </div>
  );
};

export default About;
