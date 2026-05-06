import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
            <ArrowLeft className="h-4 w-4" /> Abort Protocol
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
               <ShieldCheck className="h-4 w-4 text-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Privacy Protocol v4.0</span>
            </div>
            <h1 className="text-5xl sm:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9] uppercase">
              Clinical <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Sovereignty.</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium italic">
              "We believe medical privacy is a fundamental neural right. Our systems are engineered to shield your clinical identity."
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
                  <Eye className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Data Extraction</h2>
              </div>
              <div className="space-y-8 text-zinc-400 font-medium leading-relaxed italic">
                <p>
                  We collect only the telemetry essential for emergency synchronization. This includes:
                </p>
                <ul className="space-y-4">
                  {[
                    { label: "Clinical Metadata", desc: "Blood group, allergies, and chronic conditions." },
                    { label: "Emergency Nodes", desc: "Contact information for your designated guardians." },
                    { label: "Identity Verification", desc: "Basic profile information for accurate patient identification." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                      <Zap className="h-5 w-5 text-emerald-500 mt-1" />
                      <div>
                        <span className="text-white font-black uppercase text-sm tracking-widest block mb-1">{item.label}</span>
                        <span className="text-xs">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-950 border border-white/10 p-12 rounded-[4rem] shadow-3xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Lock className="h-64 w-64 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                    <Lock className="h-8 w-8 text-cyan-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Nexus Shielding</h2>
                </div>
                <div className="space-y-8 text-zinc-400 font-medium leading-relaxed italic">
                  <p>
                    Your clinical vault is shielded by AES-256 encryption. We utilize industry-standard security protocols to ensure that:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-8 pt-4">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                      <p className="text-sm font-black text-white mb-3 uppercase tracking-[0.2em]">Zero-Visibility</p>
                      <p className="text-xs text-zinc-500">Data is encrypted in transit and at rest, ensuring zero unauthorized synchronization.</p>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                      <p className="text-sm font-black text-white mb-3 uppercase tracking-[0.2em]">Credential Control</p>
                      <p className="text-xs text-zinc-500">Only those with your unique QR node or authorized emergency personnel can access your critical telemetry.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-3xl"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <FileText className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Node Rights</h2>
              </div>
              <p className="text-zinc-400 font-medium leading-relaxed italic">
                You maintain absolute control over your Nexus profile. You have the right to access, rectify, or permanently incinerate your clinical vault at any time through the dashboard settings. We do not sell your personal data to third parties—ever.
              </p>
            </motion.section>

          </div>
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-white/5 py-16 text-center">
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.6em]">&copy; {new Date().getFullYear()} NEXUS EHP GLOBAL REGISTRY • PRIVACY SECURED</p>
      </footer>
    </div>
  );
};

export default Privacy;
