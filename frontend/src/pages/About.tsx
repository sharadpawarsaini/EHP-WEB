import { motion } from 'framer-motion';
import { Shield, Users, Heart, CheckCircle, ArrowLeft, Activity, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500 overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Immersive Background Nodes */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[80%] bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[70%] bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-gray-100 dark:border-white/5 bg-white/70 dark:bg-[#0A0A0A]/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2 rounded-xl shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">EHP</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
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
            <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-600/10 px-6 py-2.5 rounded-full border border-blue-100 dark:border-blue-600/20 mb-8">
               <Zap className="h-4 w-4 text-blue-600" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">The EHP Protocol</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-none">
              Securing Humanity through <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Instant Intelligence.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto font-medium">
              EHP (Emergency Health Passport) is a mission-critical platform designed to bridge the data gap during medical emergencies, where seconds save lives.
            </p>
          </motion.div>

          {/* Core Pillars */}
          <div className="grid md:grid-cols-2 gap-10 mb-32">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10 group transition-all"
            >
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                 <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">For Families</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                We empower guardians to manage the critical health nodes of their loved ones—children, elderly parents, and spouses—within one high-security clinical dashboard.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10 group transition-all"
            >
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                 <Heart className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">For Responders</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                By providing sub-second access to blood groups, allergies, and chronic conditions, we provide paramedic units with the telemetry needed for accurate triage.
              </p>
            </motion.div>
          </div>

          {/* Clinical Excellence */}
          <div className="bg-gray-900 dark:bg-white/5 rounded-[4rem] p-10 sm:p-20 relative overflow-hidden shadow-3xl">
             <div className="absolute top-0 right-0 p-20 opacity-5">
                <ShieldCheck className="h-96 w-96 text-white" />
             </div>
             <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-20 tracking-tighter">Why EHP?</h2>
                <div className="grid sm:grid-cols-3 gap-12">
                  {[
                    { icon: Lock, title: "Sovereign Privacy", desc: "Data is encrypted using MIL-spec protocols. You maintain absolute control over visibility." },
                    { icon: Activity, title: "AI Diagnostics", desc: "Advanced summarization of complex medical telemetry into clear, actionable responder info." },
                    { icon: Globe, title: "Global Sync", desc: "Your medical passport works across borders, unified through a single secure identity." }
                  ].map((item, i) => {
                    const Icon = item.icon as any;
                    return (
                      <div key={i} className="text-center space-y-6">
                         <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
                            <Icon className="h-8 w-8 text-blue-400" />
                         </div>
                         <h4 className="text-xl font-black text-white tracking-tight">{item.title}</h4>
                         <p className="text-gray-400 font-medium leading-relaxed text-sm">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>

          {/* Detailed Roadmap */}
          <div className="mt-32 space-y-12">
             <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Clinical Standard</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium uppercase text-[10px] tracking-[0.4em]">Integrated Protocol Stack</p>
             </div>
             <div className="grid gap-6">
                {[
                  { title: "Immutable Data Entry", desc: "Ensuring all health records are verified and audit-trailed for clinical integrity." },
                  { title: "Real-time SOS Bridge", desc: "Direct node connection between patient QR scan and emergency guardian alert systems." },
                  { title: "HL7/FHIR Compliance", desc: "Adhering to global medical data standards for seamless hospital integration." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-8 p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 hover:border-blue-500/30 transition-all group">
                     <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{item.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 py-12 text-center">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} EHP GLOBAL REGISTRY • MISSION CONTROL</p>
      </footer>
    </div>
  );
};

export default About;
