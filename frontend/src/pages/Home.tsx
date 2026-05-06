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
    <div className="min-h-screen relative font-sans text-white overflow-x-hidden bg-zinc-950 transition-colors duration-500">
      
      {/* Background Infrastructure */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
        <div className="absolute inset-0 cyber-grid opacity-[0.05]"></div>
      </div>

      {/* Navigation Matrix */}
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl border-b border-white/5 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">NEXUS EHP</span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {['About', 'FAQ', 'Contact'].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-all">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex bg-white/5 p-1.5 rounded-xl border border-white/10">
              {['en', 'hi'].map((lang) => (
                <button key={lang} onClick={() => i18n.changeLanguage(lang)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest ${i18n.language.startsWith(lang) ? 'bg-white text-zinc-950 shadow-2xl' : 'text-zinc-500 hover:text-white'}`}>{lang}</button>
              ))}
            </div>
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-emerald-500 transition-all">Synchronize</Link>
            <Link to="/register" className="hidden sm:block px-8 py-3.5 bg-white text-zinc-950 hover:bg-emerald-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-2xl">Enroll</Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-white">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </nav>

      {/* Mobile Matrix Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[90] bg-zinc-950/98 backdrop-blur-3xl pt-32 px-10">
             <div className="flex flex-col gap-10">
                {['About', 'FAQ', 'Contact'].map((item) => (
                   <Link key={item} to={`/${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-4xl font-black text-white uppercase tracking-tighter border-b border-white/5 pb-4">{item}</Link>
                ))}
                <div className="pt-10 flex flex-col gap-5">
                   <Link to="/login" className="w-full py-6 text-center text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 rounded-2xl text-white hover:bg-white/5 transition-all">Sign In</Link>
                   <Link to="/register" className="w-full py-6 text-center text-[10px] font-black uppercase tracking-[0.4em] bg-white text-zinc-950 rounded-2xl">Join Registry</Link>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative pt-32 sm:pt-48">
        
        {/* Hero Command Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20 mb-8">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.5em]">Global Clinical Standard</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-none uppercase">
                The Core <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Health Node</span>
                <br/>
                For Survival.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-zinc-400 mb-12 leading-relaxed max-w-xl italic font-medium">
                "Instant, secure, and interoperable clinical data synchronization for high-stakes medical deployments."
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-6">
                <Link to="/register" className="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95">
                  Initialize Registry <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/about" className="px-12 py-6 bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all hover:bg-white/10 flex items-center justify-center">
                  Core Manual
                </Link>
              </motion.div>

              {/* Integrity Stats */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-12 mt-16 pt-12 border-t border-white/5">
                {[
                  { num: '50K+', label: 'Managed Nodes' },
                  { num: '99.9%', label: 'Data Integrity' },
                  { num: 'AES-256', label: 'Shield Protocol' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-3xl font-black text-white tracking-tighter">{s.num}</p>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Tactical UI Visual */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="hidden lg:block relative">
               <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] opacity-20 animate-pulse"></div>
               <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] p-16 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 text-emerald-500">
                     <Zap className="h-64 w-64" />
                  </div>
                  <div className="bg-zinc-950/80 backdrop-blur-3xl rounded-[3rem] shadow-2xl p-10 space-y-10 relative z-10 border border-white/5">
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-5">
                           <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 glow-border">
                              <Activity className="h-8 w-8 text-emerald-500" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Status: Operational</p>
                              <p className="text-2xl font-black text-white tracking-tighter">NODE_7742_B</p>
                           </div>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
                     </div>

                     <div className="space-y-6">
                        {[
                           { label: 'Neural Sync', value: '72 BPM', color: 'text-rose-500', bg: 'bg-rose-500/10' },
                           { label: 'Pressure Valve', value: '120/80', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                           { label: 'Oxygen Flow', value: '98%', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                        ].map((v, i) => (
                           <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 group/v hover:border-white/10 transition-all cursor-pointer">
                              <div className="flex items-center gap-4">
                                 <div className={`p-3 rounded-xl ${v.bg} border border-white/5 group-hover/v:scale-110 transition-transform`}>
                                    <Activity className={`h-4 w-4 ${v.color}`} />
                                 </div>
                                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{v.label}</span>
                              </div>
                              <span className="text-xl font-black text-white">{v.value}</span>
                           </div>
                        ))}
                     </div>

                     <div className="pt-6">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                           <div className="h-full w-[72%] bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-4 text-center">Protocol Integrity: High</p>
                     </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 bg-emerald-600 p-12 rounded-[3.5rem] shadow-[0_30px_60px_rgba(16,185,129,0.4)] animate-bounce-slow z-20 border-8 border-zinc-950">
                     <ShieldCheck className="h-12 w-12 text-white" />
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Operational Flow */}
        <section className="max-w-7xl mx-auto px-6 mt-64">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.8em] mb-6 block">Deployment Cycle</span>
            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">Operational <br/> Procedures</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Identity Entry', desc: 'Securely initialize your legal and clinical designation.' },
              { step: '02', title: 'Payload Uplink', desc: 'Synchronize allergies, medications, and binary clinical archives.' },
              { step: '03', title: 'Key Generation', desc: 'Obtain your unique high-frequency QR identifier.' },
              { step: '04', title: 'Combat Ready', desc: 'Instant tactical access for emergency responders globally.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-10 bg-white/5 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="w-20 h-20 bg-zinc-950 border border-white/10 text-emerald-500 rounded-[2rem] flex items-center justify-center font-black text-3xl mb-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:glow-border transition-all">{item.step}</div>
                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-[11px] font-medium text-zinc-500 leading-relaxed italic">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capability Matrix */}
        <section className="max-w-7xl mx-auto px-6 mt-64">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.8em] mb-6 block">Protocol Suite</span>
            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">System <br/> Capabilities</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: QrCode, title: 'Tactical ID', desc: 'High-frequency QR access for sub-second emergency retrieval.', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { icon: ShieldCheck, title: 'Vault Access', desc: 'Multi-layer encryption shielding for clinical binary data.', color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' },
              { icon: Globe, title: 'Neural Grid', desc: 'Global interoperable clinical nodes across all secure networks.', color: 'text-violet-500', bg: 'bg-violet-500/10 border-violet-500/20' },
              { icon: Stethoscope, title: 'Neural AI', desc: 'Predictive health intelligence based on clinical historical data.', color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
              { icon: Clock, title: 'Archive Sync', desc: 'Real-time synchronization of medical encounters and visits.', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
              { icon: Heart, title: 'Family Node', desc: 'Centralized management for multiple dependent clinical nodes.', color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20' },
            ].map((feat, i) => {
              const Icon = feat.icon as any;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white/5 backdrop-blur-2xl border border-white/5 p-12 rounded-[4rem] group hover:border-white/20 transition-all shadow-3xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className={`w-16 h-16 ${feat.bg} border rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all relative z-10`}>
                      <Icon className={`h-8 w-8 ${feat.color}`} />
                   </div>
                   <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight relative z-10">{feat.title}</h3>
                   <p className="text-sm font-medium text-zinc-500 leading-relaxed italic relative z-10">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Founder Matrix */}
        <section className="mt-64 max-w-7xl mx-auto px-6">
           <div className="bg-zinc-950 border border-white/10 rounded-[5rem] p-12 sm:p-32 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              <div className="absolute top-0 right-0 p-20 opacity-5">
                 <Database className="h-[40rem] w-[40rem] text-white" />
              </div>
              <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[150px] rounded-full"></div>
              <div className="grid lg:grid-cols-2 gap-32 items-center relative z-10">
                 <div className="relative group">
                    <div className="absolute -inset-10 bg-emerald-500 blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img 
                      src="/assets/founder.jpeg" 
                      alt="Sharad Pawar Saini" 
                      className="relative rounded-[4rem] w-full aspect-[4/5] object-cover shadow-2xl border-4 border-white/10 filter grayscale group-hover:grayscale-0 transition-all duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/84949574?v=4'; }}
                    />
                    <div className="absolute -bottom-16 -right-16 bg-white p-16 rounded-[4rem] shadow-3xl hidden md:block border-8 border-zinc-950">
                       <p className="text-5xl font-black text-zinc-950 italic tracking-tighter">SURVIVAL.</p>
                       <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.6em] mt-3">Core Architect</p>
                    </div>
                 </div>
                 <div className="space-y-12">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[1em]">Project Lead</span>
                    <h2 className="text-5xl sm:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase">
                      Architect <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Of Safety.</span>
                    </h2>
                    <p className="text-2xl text-zinc-400 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-10">
                      "We are building a future where no clinical detail is lost in transition. EHP is the final safeguard against medical invisibility."
                    </p>
                    <div className="pt-12 border-t border-white/10 flex items-center justify-between">
                       <div>
                          <p className="text-4xl font-black text-white tracking-tight">Sharad Pawar Saini</p>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mt-2">Founder & Lead Designer</p>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all cursor-pointer"><Globe className="h-5 w-5" /></div>
                          <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all cursor-pointer"><Database className="h-5 w-5" /></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Neural AI Section */}
        <section className="mt-64 max-w-7xl mx-auto px-6">
           <div className="bg-emerald-600 rounded-[5rem] p-12 md:p-32 relative overflow-hidden shadow-[0_40px_100px_rgba(16,185,129,0.3)]">
              <div className="absolute top-0 right-0 p-24 opacity-10">
                 <Sparkles className="h-[40rem] w-[40rem] text-white" />
              </div>
              <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
                 <div className="space-y-10">
                    <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.6em]">Nexus Neural Core</span>
                    <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                      Neural <br/>
                      Triage AI.
                    </h2>
                    <p className="text-2xl text-emerald-100 font-medium leading-relaxed italic">
                      Experience the world's most advanced clinical-contextual assistant. Voice-guided life-saving instructions powered by zero-latency neural nodes.
                    </p>
                    <div className="flex gap-8">
                       <button 
                         onClick={() => setShowAIDemo(true)}
                         className="bg-zinc-950 text-white px-12 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-3xl flex items-center gap-4 group"
                       >
                         <Sparkles className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" /> Initialize Neural Link
                       </button>
                    </div>
                 </div>
                 <div className="relative group">
                    <div className="absolute -inset-10 bg-white/20 blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity"></div>
                    <div className="bg-zinc-950/90 backdrop-blur-3xl rounded-[4rem] p-12 border border-white/10 shadow-3xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="h-48 w-48 text-emerald-500" /></div>
                       <div className="flex items-center gap-6 mb-12">
                          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                             <Mic className="h-8 w-8 text-white" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] leading-none mb-2">Neural Input Detected</p>
                             <p className="text-2xl font-black text-white tracking-tighter">PATIENT_IDENTIFIED</p>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">Subject Query</p>
                             <p className="text-lg font-bold text-white italic leading-tight">"Swelling detected after ingestion. Provide triage protocol."</p>
                          </div>
                          <div className="p-8 bg-emerald-500/20 rounded-[2.5rem] border border-emerald-500/30 shadow-inner">
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">Neural Response</p>
                             <p className="text-base font-black text-white leading-relaxed">
                                <span className="text-emerald-500">PROTOCOL ALPHA:</span> Sever Peanut Allergy identified. Deploy **Epinephrine Auto-Injector** immediately. Target: Outer Thigh.
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global Uplink CTA */}
        <section className="mt-64 pb-64 max-w-7xl mx-auto px-6 text-center">
           <div className="relative py-48 px-12 rounded-[6rem] bg-zinc-950 border border-white/5 overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] bg-emerald-500/5 blur-[200px] rounded-full"></div>
              <div className="relative z-10 max-w-4xl mx-auto">
                 <h2 className="text-6xl sm:text-8xl font-black text-white tracking-[1px] mb-12 leading-[0.85] uppercase">
                   Secure Your <br/> 
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Survival Node.</span>
                 </h2>
                 <p className="text-2xl text-zinc-500 mb-16 font-medium italic">Join the elite network of high-trust clinical identifiers.</p>
                 <Link to="/register" className="inline-flex items-center gap-6 bg-white text-zinc-950 hover:bg-emerald-500 hover:text-white px-16 py-8 rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.5em] transition-all shadow-3xl hover:scale-105 active:scale-95 group">
                    Initialize Enrollment <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
           </div>
        </section>
      </main>

      {/* Matrix Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 py-32 relative overflow-hidden">
         <div className="absolute bottom-0 right-0 p-40 opacity-[0.02]">
            <Activity className="h-[60rem] w-[60rem] text-white" />
         </div>
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-24 relative z-10">
            <div className="md:col-span-2">
               <div className="flex items-center gap-3 mb-10">
                  <div className="bg-emerald-600 p-3 rounded-xl">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-black tracking-tighter text-white">NEXUS EHP</span>
               </div>
               <p className="text-zinc-500 max-w-md text-base leading-relaxed italic">The global cryptographic standard for emergency medical identification. Securing the human node through advanced synchronization.</p>
            </div>
            {['Protocol', 'Registry'].map((title, i) => (
              <div key={i}>
                 <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.6em] mb-10">{title}</h4>
                 <ul className="space-y-6">
                    {title === 'Protocol' ? (
                      <>
                        <li><Link to="/register" className="text-sm font-black text-zinc-500 hover:text-emerald-500 transition-all uppercase tracking-widest">Enrollment</Link></li>
                        <li><Link to="/faq" className="text-sm font-black text-zinc-500 hover:text-emerald-500 transition-all uppercase tracking-widest">Manual</Link></li>
                        <li><Link to="/about" className="text-sm font-black text-zinc-500 hover:text-emerald-500 transition-all uppercase tracking-widest">Architecture</Link></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/contact" className="text-sm font-black text-zinc-500 hover:text-emerald-500 transition-all uppercase tracking-widest">Signal Link</Link></li>
                        <li><Link to="/faq" className="text-sm font-black text-zinc-500 hover:text-emerald-500 transition-all uppercase tracking-widest">Archive</Link></li>
                        <li><Link to="/privacy" className="text-sm font-black text-zinc-500 hover:text-emerald-500 transition-all uppercase tracking-widest">Encryption Policy</Link></li>
                      </>
                    )}
                 </ul>
              </div>
            ))}
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} NEXUS EHP GLOBAL REGISTRY. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-10">
               <Link to="/privacy" className="text-[10px] font-black text-zinc-600 hover:text-emerald-500 transition-all uppercase tracking-[0.4em]">Privacy</Link>
               <Link to="/terms" className="text-[10px] font-black text-zinc-600 hover:text-emerald-500 transition-all uppercase tracking-[0.4em]">Terms</Link>
            </div>
         </div>
      </footer>

      {/* AI Assistant Demo Matrix Panel */}
      <AnimatePresence>
        {showAIDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              className="bg-zinc-900 w-full max-w-xl rounded-[5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden relative"
            >
              <button 
                onClick={() => {
                  setShowAIDemo(false);
                  window.speechSynthesis.cancel();
                }}
                className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-rose-500/20 rounded-full text-zinc-500 hover:text-rose-500 transition-all z-20"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="p-16 space-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-5"><Sparkles className="h-64 w-64 text-emerald-500" /></div>
                
                <div className="text-center space-y-6 relative z-10">
                  <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.4)] group">
                    <Sparkles className="h-10 w-10 text-white group-hover:animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">Neural Core Link</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Subject: John Doe // Type: High-Sensitivity Allergy</p>
                  </div>
                </div>

                <div className="h-[250px] overflow-y-auto custom-scrollbar p-10 bg-black/50 rounded-[3rem] border border-white/5 shadow-inner relative z-10">
                  {aiResponse ? (
                    <div className="text-lg font-medium text-zinc-300 leading-relaxed whitespace-pre-wrap italic">
                      {aiResponse.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-emerald-500 font-black not-italic">{part}</strong> : part)}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-30 text-center">
                      <MessageSquare className="h-10 w-10 text-zinc-500" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">Awaiting neural input. <br/> Initialize signal to begin triage.</p>
                    </div>
                  )}
                  {aiLoading && (
                    <div className="mt-6 flex gap-2 justify-center">
                      {[0, 0.2, 0.4].map(delay => <motion.div key={delay} animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay }} className="w-2 h-2 bg-emerald-500 rounded-full" />)}
                    </div>
                  )}
                </div>

                <div className="space-y-6 relative z-10">
                  <button
                    onClick={startListening}
                    disabled={isListening || aiLoading}
                    className={`w-full flex items-center justify-center gap-5 py-8 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] transition-all ${isListening ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_40px_rgba(225,29,72,0.4)]' : 'bg-white text-zinc-950 shadow-2xl hover:scale-[1.02] active:scale-95'}`}
                  >
                    {isListening ? (
                       <div className="flex gap-2 items-center">
                         {[1,2,3,4,5].map(i => <motion.div key={i} animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} className="w-1.5 bg-white rounded-full" />)}
                         <span className="ml-3 tracking-[0.6em]">Listening...</span>
                       </div>
                    ) : (
                      <>
                        <Mic className="h-6 w-6" /> Initialize Link
                      </>
                    )}
                  </button>
                  {aiResponse && (
                    <button 
                      onClick={() => handleAISpeech(aiResponse)}
                      className={`w-full flex items-center justify-center gap-4 py-6 rounded-2xl border border-white/5 transition-all ${isSpeaking ? 'bg-emerald-600 text-white shadow-2xl' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                    >
                      <Volume2 className={`h-5 w-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em]">{isSpeaking ? 'Neural Output Active' : 'Repeat Signal'}</span>
                    </button>
                  )}
                </div>
                
                <div className="pt-4 flex flex-wrap gap-3 justify-center relative z-10">
                  {['Help, he ate a nut!', 'How to use EpiPen?', 'Current Condition?'].map(tag => (
                    <button key={tag} onClick={() => sendToAI(tag)} className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] bg-emerald-500/5 px-5 py-3 rounded-xl border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all shadow-lg">{tag}</button>
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
