import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowLeft, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500 overflow-x-hidden selection:bg-primary-500/30">
      
      {/* Immersive Background Nodes */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[80%] bg-primary-600/10 dark:bg-primary-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[70%] bg-green-600/10 dark:bg-green-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
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
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-600/10 px-6 py-2.5 rounded-full border border-emerald-100 dark:border-emerald-600/20 mb-8">
               <ShieldCheck className="h-4 w-4 text-emerald-600" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Privacy Protocol v1.0</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-none">
              Your Data. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Your Sovereignty.</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
              At EHP, we believe medical privacy is a fundamental human right. Our systems are engineered to protect your most sensitive information while ensuring it's available when it matters most.
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-16">
            
            {/* Section 1 */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Transparency & Collection</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                <p>
                  We collect only the data essential for emergency triage. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><span className="text-gray-900 dark:text-white font-bold">Clinical Metadata:</span> Blood group, allergies, and chronic conditions.</li>
                  <li><span className="text-gray-900 dark:text-white font-bold">Emergency Nodes:</span> Contact information for your designated guardians.</li>
                  <li><span className="text-gray-900 dark:text-white font-bold">Identity Verification:</span> Basic profile information to ensure accurate patient identification.</li>
                </ul>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">MIL-Grade Security</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                <p>
                  Your medical vault is protected by AES-256 encryption. We utilize industry-standard security protocols to ensure that:
                </p>
                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                    <p className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest">End-to-End</p>
                    <p className="text-xs">Data is encrypted in transit and at rest, ensuring zero unauthorized visibility.</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                    <p className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest">Access Control</p>
                    <p className="text-xs">Only those with your unique QR node or authorized emergency personnel can access your critical info.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Your Rights</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                You maintain absolute control over your EHP profile. You have the right to access, rectify, or permanently delete your medical vault at any time through the dashboard settings. We do not sell your personal data to third parties—ever.
              </p>
            </motion.section>

          </div>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 py-12 text-center">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} EHP GLOBAL REGISTRY • PRIVACY SECURED</p>
      </footer>
    </div>
  );
};

export default Privacy;
