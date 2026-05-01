import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, CheckCircle, ArrowLeft, Activity, Gavel, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-600/10 px-6 py-2.5 rounded-full border border-blue-100 dark:border-blue-600/20 mb-8">
               <Scale className="h-4 w-4 text-blue-600" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Legal Framework v1.0</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-none">
              Terms of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Engagement.</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
              By deploying your Emergency Health Passport, you agree to the following protocols governing the use of our global medical registry.
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
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Gavel className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                By accessing or using EHP, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our platform or initialize a medical passport profile.
              </p>
            </motion.section>

            {/* Section 2: Responsibility */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">User Responsibility</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                <p>
                  Accuracy is life-critical. Users are solely responsible for:
                </p>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Providing accurate medical data",
                    "Updating records regularly",
                    "Securing account credentials",
                    "Managing guardian nodes"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Section 3: Disclaimer */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-rose-50/30 dark:bg-rose-900/10 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-rose-100 dark:border-rose-900/20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-rose-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Medical Disclaimer</h2>
              </div>
              <p className="text-rose-900/80 dark:text-rose-400 font-bold leading-relaxed">
                EHP IS A DATA FACILITATION TOOL. IT IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. WE DO NOT GUARANTEE THAT MEDICAL RESPONDERS WILL BE ABLE TO ACCESS YOUR DATA IN ALL CIRCUMSTANCES (E.G., LACK OF CONNECTIVITY OR HARDWARE FAILURE).
              </p>
            </motion.section>

            {/* Section 4: Limitation of Liability */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Limitation of Liability</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                To the maximum extent permitted by law, EHP and its affiliates shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the platform, including but not limited to medical outcomes during emergencies.
              </p>
            </motion.section>

          </div>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 py-12 text-center">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} EHP GLOBAL REGISTRY • LEGAL COMPLIANCE</p>
      </footer>
    </div>
  );
};

export default Terms;
