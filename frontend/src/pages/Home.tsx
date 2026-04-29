import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  Clock, 
  QrCode, 
  Heart, 
  CheckCircle, 
  ArrowRight, 
  Smartphone, 
  Stethoscope, 
  Lock, 
  Menu, 
  X,
  Zap,
  ShieldCheck,
  Globe,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden bg-white dark:bg-[#0A0A0A] transition-colors duration-500">
      
      {/* Immersive Background Nodes */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[80%] bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[70%] bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-[20%] w-[50%] h-[50%] bg-emerald-600/10 dark:bg-emerald-600/5 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-gray-100 dark:border-white/5 bg-white/70 dark:bg-[#0A0A0A]/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2 rounded-xl shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">EHP</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {['About', 'FAQ', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase()}`} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
              {['en', 'hi'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all uppercase ${i18n.language.startsWith(lang) ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white hover:opacity-70 transition-opacity">{t('nav_login', 'Log in')}</Link>
            <Link to="/register" className="hidden sm:block bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
              {t('nav_get_started', 'Get Started')}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-900 dark:text-white">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[90] bg-white dark:bg-[#0A0A0A] pt-24 px-6">
             <div className="flex flex-col gap-8">
                {['About', 'FAQ', 'Contact'].map((item) => (
                  <Link key={item} to={`/${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-4xl font-black tracking-tighter dark:text-white">{item}</Link>
                ))}
                <div className="pt-10 flex flex-col gap-4">
                   <Link to="/login" className="w-full py-5 text-center font-black uppercase tracking-widest border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white">Log In</Link>
                   <Link to="/register" className="w-full py-5 text-center font-black uppercase tracking-widest bg-blue-600 text-white rounded-2xl">Get Started</Link>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative pt-32 sm:pt-48">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 text-center">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-600/10 px-6 py-2.5 rounded-full border border-blue-100 dark:border-blue-600/20 mb-10">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">The Future of Emergency Triage</span>
           </motion.div>

           <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.9] mb-8">
             Your Life-Link <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Always Connected.</span>
           </motion.h1>

           <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg sm:text-2xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
             The Emergency Health Passport gives first responders instant, secure access to your critical medical history during the moments that matter most.
           </motion.p>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="bg-blue-600 text-white px-12 py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all">
                {t('home_cta_create', 'Initialize Profile')}
              </Link>
              <Link to="/about" className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-12 py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-50 transition-all">
                The Protocol
              </Link>
           </motion.div>
        </section>

        {/* Dynamic Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 mt-48 grid md:grid-cols-3 gap-10">
           {[
             { icon: QrCode, title: 'Instant QR ID', desc: 'Secure medical identification accessible via a high-fidelity QR node on your device lock screen.', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
             { icon: ShieldCheck, title: 'Encrypted Vault', desc: 'MIL-grade AES-256 encryption ensures your deep clinical history is only accessible to authorized medical nodes.', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
             { icon: Globe, title: 'Global Registry', desc: 'Access your health records anywhere in the world, unified through a single secure medical passport.', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' }
           ].map((feat, i) => {
             const Icon = feat.icon as any;
             return (
               <motion.div 
                 key={i} 
                 whileHover={{ y: -10 }}
                 className="p-10 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white dark:border-white/10 shadow-2xl group transition-all"
               >
                  <div className={`w-16 h-16 ${feat.bg} rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
                     <Icon className={`h-8 w-8 ${feat.color}`} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{feat.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{feat.desc}</p>
               </motion.div>
             );
           })}
        </section>

        {/* Founder Deep Dive */}
        <section className="mt-48 max-w-7xl mx-auto px-6">
           <div className="bg-gray-900 dark:bg-white/5 rounded-[4rem] p-10 sm:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-5">
                 <Database className="h-96 w-96 text-white" />
              </div>
              <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                 <div className="relative">
                    <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20"></div>
                    <img 
                      src="/assets/founder.jpeg" 
                      alt="Sharad Pawar Saini" 
                      className="relative rounded-[3rem] w-full aspect-[4/5] object-cover shadow-2xl border-4 border-white/10"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/84949574?v=4'; }}
                    />
                    <div className="absolute -bottom-10 -right-10 bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl hidden md:block">
                       <p className="text-4xl font-black text-white">Vision</p>
                       <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mt-1">First Thinking</p>
                    </div>
                 </div>
                 <div className="space-y-8">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Leadership Insight</span>
                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                      Engineered for <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-blue-400">Survival.</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed">
                      "I founded EHP to bridge the critical information gap during medical emergencies. Every second saved through data availability is a life potentially preserved."
                    </p>
                    <div className="pt-8 border-t border-white/10">
                       <p className="text-2xl font-black text-white">Sharad Pawar Saini</p>
                       <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Founder & Lead Architect</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global CTA */}
        <section className="mt-48 pb-48 max-w-7xl mx-auto px-6 text-center">
           <div className="relative py-32 rounded-[4rem] bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden shadow-3xl shadow-blue-600/20">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="relative z-10 max-w-3xl mx-auto px-6">
                 <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-8 leading-none">Protect Your Future <br/> Today.</h2>
                 <p className="text-xl text-blue-100/80 font-medium mb-12">Join the global network of secure medical identifiers. It's fast, free, and life-critical.</p>
                 <Link to="/register" className="inline-flex items-center gap-4 bg-white text-gray-900 px-12 py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
                   Deploy Your Passport <ArrowRight className="h-5 w-5" />
                 </Link>
              </div>
           </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 py-20">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
               <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-600 p-2 rounded-xl">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter dark:text-white">EHP</span>
               </div>
               <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium leading-relaxed">The global standard for secure emergency medical identification. Securing lives through one scan at a time.</p>
            </div>
            {['Product', 'Company'].map((title, i) => (
              <div key={i}>
                 <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-8">{title}</h4>
                 <ul className="space-y-4">
                    {title === 'Product' ? (
                      <>
                        <li><Link to="/register" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Create Profile</Link></li>
                        <li><Link to="/faq" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">How it Works</Link></li>
                        <li><Link to="/about" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">The Protocol</Link></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/contact" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Contact Support</Link></li>
                        <li><Link to="/faq" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Documentation</Link></li>
                        <li><Link to="/login" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Security</Link></li>
                      </>
                    )}
                 </ul>
              </div>
            ))}
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} EHP GLOBAL REGISTRY</p>
            <div className="flex gap-8">
               <Link to="/" className="text-[10px] font-black text-gray-400 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-widest">Privacy</Link>
               <Link to="/" className="text-[10px] font-black text-gray-400 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-widest">Terms</Link>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;
