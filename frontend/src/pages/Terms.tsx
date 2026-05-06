import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, CheckCircle, ArrowLeft, Activity, Gavel, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-4 bg-emerald-500/10 px-8 py-3 rounded-full border border-emerald-500/20 mb-10">
               <Scale className="h-4 w-4 text-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Legal Protocol v1.0</span>
            </div>
            <h1 className="text-5xl sm:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9] uppercase">
              Operational <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Framework.</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium italic">
              "By deploying your clinical node, you authorize the following operational synchronization protocols."
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-16">
            
            {/* Section 1 */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-3xl"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Gavel className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Signal Acceptance</h2>
              </div>
              <p className="text-zinc-400 font-medium leading-relaxed italic">
                By accessing or using Nexus EHP, you agree to be bound by these operational protocols. If you do not agree with any part of these terms, you must abort use and incinerate your medical passport profile.
              </p>
            </motion.section>

            {/* Section 2: Responsibility */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-950 border border-white/10 p-12 rounded-[4rem] shadow-3xl"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                  <AlertCircle className="h-8 w-8 text-cyan-500" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Node Duty</h2>
              </div>
              <div className="space-y-8 text-zinc-400 font-medium leading-relaxed italic">
                <p>
                  Clinical accuracy is survival-critical. Nodes are solely responsible for:
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Accurate telemetry input",
                    "Regular record synchronization",
                    "Credential encryption security",
                    "Guardian node authorization"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-black text-white uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Section 3: Disclaimer */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-rose-500/10 backdrop-blur-3xl p-12 rounded-[4rem] border border-rose-500/20 shadow-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <AlertCircle className="h-64 w-64 text-rose-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/30">
                    <Activity className="h-8 w-8 text-rose-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Medical Warning</h2>
                </div>
                <p className="text-rose-500 font-black leading-relaxed text-sm uppercase tracking-widest">
                  NEXUS EHP IS A DATA FACILITATION RELAY. IT IS NOT A SUBSTITUTE FOR CLINICAL INTERVENTION. WE DO NOT GUARANTEE THAT MEDICAL RESPONDERS WILL BE ABLE TO SYNCHRONIZE WITH YOUR NODE IN ALL OPERATIONAL ENVIRONMENTS.
                </p>
              </div>
            </motion.section>

            {/* Section 4: Liability */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-3xl"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <FileText className="h-8 w-8 text-zinc-500" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Liability Limits</h2>
              </div>
              <p className="text-zinc-400 font-medium leading-relaxed italic">
                To the maximum extent permitted by protocol, Nexus EHP and its administrative nodes shall not be liable for any incidental or consequential damages arising from node failure or clinical synchronization issues.
              </p>
            </motion.section>

          </div>
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-white/5 py-16 text-center">
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.6em]">&copy; {new Date().getFullYear()} NEXUS EHP GLOBAL REGISTRY • LEGAL COMPLIANCE</p>
      </footer>
    </div>
  );
};

export default Terms;
