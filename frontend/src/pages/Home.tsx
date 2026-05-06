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
  Database,
  Mic,
  Volume2,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // AI Demo State
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAISpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendToAI(transcript);
    };

    recognition.start();
  };

  const sendToAI = async (message: string) => {
    setAiLoading(true);
    setAiResponse('');
    try {
      const response = await api.post('/ai/demo', {
        message,
        history: chatHistory
      });
      
      const newResponse = response.data.text;
      setAiResponse(newResponse);
      setChatHistory([...chatHistory, 
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: newResponse }] }
      ]);
      handleAISpeech(newResponse);
    } catch (err) {
      setAiResponse("Demo Assistant is currently taking a breather. Please try again in a moment.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-zinc-900 dark:text-zinc-100 overflow-x-hidden bg-white dark:bg-zinc-950 transition-colors duration-500">
      
      {/* Minimal Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-100 dark:bg-emerald-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Clean Healthcare Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-zinc-100 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-primary-600 p-2 rounded-xl shadow-primary">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">EHP</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['About', 'FAQ', 'Contact'].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm font-medium text-zinc-500 hover:text-primary-600 transition-colors">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-zinc-100 dark:bg-white/5 p-1 rounded-lg border border-zinc-200 dark:border-white/10">
              {['en', 'hi'].map((lang) => (
                <button key={lang} onClick={() => i18n.changeLanguage(lang)} className={`px-3 py-1 rounded-md text-xs font-semibold transition-all uppercase ${i18n.language.startsWith(lang) ? 'bg-white dark:bg-white/10 text-primary-600 shadow-sm' : 'text-zinc-400'}`}>{lang}</button>
              ))}
            </div>
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block text-sm font-semibold text-zinc-600 hover:text-primary-600 transition-colors">Sign In</Link>
            <Link to="/register" className="hidden sm:block btn-primary py-2 px-5 text-sm rounded-lg">Get Started</Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-zinc-900 dark:text-white">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </nav>


      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[90] bg-white dark:bg-zinc-950 pt-24 px-6">
             <div className="flex flex-col gap-6">
                {['About', 'FAQ', 'Contact'].map((item) => (
                   <Link key={item} to={`/${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-3xl font-bold text-zinc-800 dark:text-white">{item}</Link>
                ))}
                <div className="pt-8 flex flex-col gap-3">
                   <Link to="/login" className="w-full py-4 text-center font-semibold border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-white">Log In</Link>
                   <Link to="/register" className="w-full py-4 text-center font-semibold bg-primary-600 text-white rounded-xl">Get Started</Link>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative pt-28 sm:pt-36">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full border border-primary-100 dark:border-primary-800/30 mb-6">
                <Heart className="h-4 w-4 text-primary-600" />
                <span className="text-xs font-semibold text-primary-600">Quality Healthcare Solution for All</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]">
                Your Complete{' '}
                <span className="text-primary-600">Health Passport</span>
                {' '}in One Place
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed max-w-lg">
                The Emergency Health Passport gives first responders instant, secure access to your critical medical history during the moments that matter most.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary py-4 px-8 text-base rounded-xl shadow-primary">
                  {t('home_cta_create', 'Get Started Free')} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/about" className="btn-secondary py-4 px-8 text-base rounded-xl">
                  Learn More
                </Link>
              </motion.div>

              {/* Trust Stats */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-8 mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                {[
                  { num: '10K+', label: 'Active Users' },
                  { num: '99.9%', label: 'Uptime' },
                  { num: '256-bit', label: 'Encryption' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{s.num}</p>
                    <p className="text-xs text-zinc-500 font-medium">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Visual */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="hidden lg:block relative">
              <div className="bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-3xl p-8 relative">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-card p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"><Activity className="h-5 w-5 text-primary-600" /></div>
                    <div><p className="font-bold text-zinc-900 dark:text-white text-sm">Health Dashboard</p><p className="text-xs text-zinc-400">All vitals normal</p></div>
                  </div>
                  {[
                    { label: 'Heart Rate', value: '72 bpm', color: 'bg-rose-500' },
                    { label: 'Blood Pressure', value: '120/80', color: 'bg-primary-500' },
                    { label: 'SpO2', value: '98%', color: 'bg-accent-500' },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${v.color}`}></div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">{v.label}</span>
                      </div>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{v.value}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-4 -right-4 bg-accent-500 text-white p-4 rounded-2xl shadow-green animate-float">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">How it Works</h2>
            <p className="section-subtext mx-auto">Get your emergency health passport ready in just four simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Profile', desc: 'Register and fill in your basic health information securely.' },
              { step: '02', title: 'Add Medical Data', desc: 'Upload allergies, medications, conditions, and emergency contacts.' },
              { step: '03', title: 'Generate QR Code', desc: 'Get a unique QR code linked to your encrypted medical passport.' },
              { step: '04', title: 'Ready for Emergency', desc: 'First responders scan your QR for instant life-saving access.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6">
                <div className="step-number mx-auto mb-5">{item.step}</div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Everything You Need</h2>
            <p className="section-subtext mx-auto">A complete suite of tools to manage your health identity</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: QrCode, title: 'Smart Medical ID', desc: 'Instant QR-code access to your complete medical profile for emergencies.', color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
              { icon: ShieldCheck, title: 'Privacy Vault', desc: 'AES-256 encryption protecting your sensitive health records at all times.', color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/20' },
              { icon: Globe, title: 'Global Access', desc: 'Access your health passport from anywhere in the world, on any device.', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
              { icon: Stethoscope, title: 'AI Health Assistant', desc: 'Get intelligent first-aid guidance powered by your medical context.', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
              { icon: Clock, title: 'Visit Tracking', desc: 'Log hospital visits, prescriptions, and treatments in one timeline.', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { icon: Heart, title: 'Family Management', desc: 'Manage health passports for your entire family from one account.', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
            ].map((feat, i) => {
              const Icon = feat.icon as any;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="health-card p-8 group">
                   <div className={`feature-icon ${feat.bg} mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${feat.color}`} />
                   </div>
                   <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{feat.title}</h3>
                   <p className="text-sm text-zinc-500 leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>


        {/* Founder Deep Dive */}
        <section className="mt-48 max-w-7xl mx-auto px-6">
           <div className="bg-gray-900 dark:bg-white/5 rounded-[4rem] p-10 sm:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-5">
                 <Database className="h-96 w-96 text-white" />
              </div>
              <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                 <div className="relative">
                    <div className="absolute inset-0 bg-primary-600 blur-[100px] opacity-20"></div>
                    <img 
                      src="/assets/founder.jpeg" 
                      alt="Sharad Pawar Saini" 
                      className="relative rounded-[3rem] w-full aspect-[4/5] object-cover shadow-2xl border-4 border-white/10"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/84949574?v=4'; }}
                    />
                    <div className="absolute -bottom-10 -right-10 bg-primary-600 p-8 rounded-[2.5rem] shadow-2xl hidden md:block">
                       <p className="text-4xl font-black text-white">Vision</p>
                       <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mt-1">First Thinking</p>
                    </div>
                 </div>
                 <div className="space-y-8">
                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em]">Leadership Insight</span>
                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                      Engineered for <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400 text-primary-400">Survival.</span>
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

        {/* AI Demo Section */}
        <section className="mt-48 max-w-7xl mx-auto px-6">
           <div className="bg-primary-600 rounded-[4rem] p-10 md:p-20 relative overflow-hidden shadow-3xl shadow-primary-600/20">
              <div className="absolute top-0 right-0 p-20 opacity-10">
                 <Sparkles className="h-96 w-96 text-white" />
              </div>
              <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                 <div className="space-y-8">
                    <span className="text-[10px] font-black text-primary-200 uppercase tracking-[0.4em]">Next-Gen Capability</span>
                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                      Interactive <br/>
                      First-Aid AI.
                    </h2>
                    <p className="text-xl text-primary-100 font-medium leading-relaxed">
                      Experience the world's first medical-context aware AI assistant. It provides voice-guided life-saving instructions based on a patient's specific health passport data.
                    </p>
                    <div className="flex gap-6">
                       <button 
                         onClick={() => setShowAIDemo(true)}
                         className="bg-white text-primary-600 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                       >
                         <Sparkles className="h-4 w-4" /> Start Live Demo
                       </button>
                    </div>
                 </div>
                 <div className="relative">
                    <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/20 shadow-2xl">
                       <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                             <Mic className="h-6 w-6 text-primary-600" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest leading-none mb-1">Demo Case</p>
                             <p className="text-lg font-black text-white">Patient: Severe Peanut Allergy</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                             <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mb-1">Responder Says</p>
                             <p className="text-sm font-medium text-white italic">"He accidentally ate something and is swelling up. What do I do?"</p>
                          </div>
                          <div className="p-4 bg-primary-500/30 rounded-2xl border border-primary-400/30">
                             <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mb-1">EHP Intelligence</p>
                             <p className="text-sm font-bold text-white leading-relaxed">
                                <strong>IMMEDIATE ACTION:</strong> This patient has a severe Peanut Allergy. Look for an **EpiPen** in their bag and administer it to the outer thigh immediately.
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global CTA */}
        <section className="mt-32 pb-32 max-w-7xl mx-auto px-6 text-center">
           <div className="relative py-20 px-8 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto">
                 <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">Protect Your Future Today</h2>
                 <p className="text-lg text-primary-100 mb-10">Join the global network of secure medical identifiers. It's fast, free, and life-critical.</p>
                 <Link to="/register" className="inline-flex items-center gap-3 bg-white text-primary-700 px-10 py-4 rounded-xl font-bold text-sm hover:bg-primary-50 transition-all shadow-lg">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                 </Link>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 py-16">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
               <div className="flex items-center gap-2.5 mb-6">
                  <div className="bg-primary-600 p-2 rounded-xl">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight dark:text-white">EHP</span>
               </div>
               <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">The global standard for secure emergency medical identification. Securing lives through one scan at a time.</p>
            </div>
            {['Product', 'Company'].map((title, i) => (
              <div key={i}>
                 <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6">{title}</h4>
                 <ul className="space-y-3">
                    {title === 'Product' ? (
                      <>
                        <li><Link to="/register" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary-600 transition-colors">Create Profile</Link></li>
                        <li><Link to="/faq" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary-600 transition-colors">How it Works</Link></li>
                        <li><Link to="/about" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary-600 transition-colors">About EHP</Link></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/contact" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary-600 transition-colors">Contact</Link></li>
                        <li><Link to="/faq" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary-600 transition-colors">FAQ</Link></li>
                        <li><Link to="/privacy" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
                      </>
                    )}
                 </ul>
              </div>
            ))}
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-400">&copy; {new Date().getFullYear()} EHP Global Registry. All rights reserved.</p>
            <div className="flex gap-6">
               <Link to="/privacy" className="text-xs text-zinc-400 hover:text-primary-600 transition-colors">Privacy</Link>
               <Link to="/terms" className="text-xs text-zinc-400 hover:text-primary-600 transition-colors">Terms</Link>
            </div>
         </div>
      </footer>


      {/* AI Assistant Demo Panel */}
      <AnimatePresence>
        {showAIDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3.5rem] shadow-4xl border border-white dark:border-white/10 overflow-hidden relative"
            >
              <button 
                onClick={() => {
                  setShowAIDemo(false);
                  window.speechSynthesis.cancel();
                }}
                className="absolute top-8 right-8 p-3 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 hover:text-gray-900 transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-10 space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl shadow-primary-600/20">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">AI Assistant Demo</h3>
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">Mock Patient: John Doe (Nut Allergy)</p>
                  </div>
                </div>

                <div className="h-[200px] overflow-y-auto custom-scrollbar p-6 bg-gray-50 dark:bg-[#050505] rounded-[2rem] border border-gray-100 dark:border-white/5">
                  {aiResponse ? (
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {aiResponse.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-primary-600 dark:text-primary-400 font-black">{part}</strong> : part)}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-40 text-center">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Talk to the AI to see how it handles an emergency</p>
                    </div>
                  )}
                  {aiLoading && (
                    <div className="mt-4 flex gap-1 justify-center">
                      {[0, 0.2, 0.4].map(delay => <motion.div key={delay} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={startListening}
                    disabled={isListening || aiLoading}
                    className={`w-full flex items-center justify-center gap-4 py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl shadow-primary-600/20'}`}
                  >
                    {isListening ? (
                       <div className="flex gap-1 items-center">
                         {[1,2,3,4].map(i => <motion.div key={i} animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} className="w-1 bg-white rounded-full" />)}
                         <span className="ml-2">Listening...</span>
                       </div>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" /> Start Speaking
                      </>
                    )}
                  </button>
                  {aiResponse && (
                    <button 
                      onClick={() => handleAISpeech(aiResponse)}
                      className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-gray-100 dark:border-white/10 transition-all ${isSpeaking ? 'bg-primary-600 text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{isSpeaking ? 'AI Speaking' : 'Replay Response'}</span>
                    </button>
                  )}
                </div>
                
                <div className="pt-4 flex flex-wrap gap-2 justify-center">
                  {['Help, he ate a nut!', 'How to use EpiPen?', 'Is he in danger?'].map(tag => (
                    <button key={tag} onClick={() => sendToAI(tag)} className="text-[8px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-800/30 hover:bg-primary-600 hover:text-white transition-all">{tag}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
