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

        {/* AI Demo Section */}
        <section className="mt-48 max-w-7xl mx-auto px-6">
           <div className="bg-blue-600 rounded-[4rem] p-10 md:p-20 relative overflow-hidden shadow-3xl shadow-blue-600/20">
              <div className="absolute top-0 right-0 p-20 opacity-10">
                 <Sparkles className="h-96 w-96 text-white" />
              </div>
              <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                 <div className="space-y-8">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.4em]">Next-Gen Capability</span>
                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                      Interactive <br/>
                      First-Aid AI.
                    </h2>
                    <p className="text-xl text-blue-100 font-medium leading-relaxed">
                      Experience the world's first medical-context aware AI assistant. It provides voice-guided life-saving instructions based on a patient's specific health passport data.
                    </p>
                    <div className="flex gap-6">
                       <button 
                         onClick={() => setShowAIDemo(true)}
                         className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                       >
                         <Sparkles className="h-4 w-4" /> Start Live Demo
                       </button>
                    </div>
                 </div>
                 <div className="relative">
                    <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/20 shadow-2xl">
                       <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                             <Mic className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1">Demo Case</p>
                             <p className="text-lg font-black text-white">Patient: Severe Peanut Allergy</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                             <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Responder Says</p>
                             <p className="text-sm font-medium text-white italic">"He accidentally ate something and is swelling up. What do I do?"</p>
                          </div>
                          <div className="p-4 bg-blue-500/30 rounded-2xl border border-blue-400/30">
                             <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">EHP Intelligence</p>
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
               <Link to="/privacy" className="text-[10px] font-black text-gray-400 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-widest">Privacy</Link>
               <Link to="/terms" className="text-[10px] font-black text-gray-400 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-widest">Terms</Link>
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
                  <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl shadow-blue-600/20">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">AI Assistant Demo</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Mock Patient: John Doe (Nut Allergy)</p>
                  </div>
                </div>

                <div className="h-[200px] overflow-y-auto custom-scrollbar p-6 bg-gray-50 dark:bg-[#050505] rounded-[2rem] border border-gray-100 dark:border-white/5">
                  {aiResponse ? (
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {aiResponse.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-blue-600 dark:text-blue-400 font-black">{part}</strong> : part)}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-40 text-center">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Talk to the AI to see how it handles an emergency</p>
                    </div>
                  )}
                  {aiLoading && (
                    <div className="mt-4 flex gap-1 justify-center">
                      {[0, 0.2, 0.4].map(delay => <motion.div key={delay} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={startListening}
                    disabled={isListening || aiLoading}
                    className={`w-full flex items-center justify-center gap-4 py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl shadow-blue-600/20'}`}
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
                      className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-gray-100 dark:border-white/10 transition-all ${isSpeaking ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{isSpeaking ? 'AI Speaking' : 'Replay Response'}</span>
                    </button>
                  )}
                </div>
                
                <div className="pt-4 flex flex-wrap gap-2 justify-center">
                  {['Help, he ate a nut!', 'How to use EpiPen?', 'Is he in danger?'].map(tag => (
                    <button key={tag} onClick={() => sendToAI(tag)} className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/30 hover:bg-blue-600 hover:text-white transition-all">{tag}</button>
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
